"use server";

import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

export interface Competition {
  id: string;
  title: string;
  platform: string;
  tags: string[];
  deadline: string;
  url: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prize: string;
  description: string;
}

export interface ScoredCompetition extends Competition {
  matchedTags: string[];
}

// ── Groq client (singleton) ────────────────────────────────────────────

let groqClient: Groq | null = null;
function getGroq(): Groq {
  if (!groqClient) groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groqClient;
}

// ── In-memory cache (per server instance, 30-min TTL) ───────────────────

interface CacheEntry {
  competitions: Competition[];
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000;

// ── Tavily Search ───────────────────────────────────────────────────────

interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

async function searchTavily(query: string): Promise<TavilyResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.error("[competitions] TAVILY_API_KEY is not set");
    return [];
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: 20,
      search_depth: "advanced",
      include_answer: false,
    }),
  });

  if (!res.ok) {
    console.error("[competitions] Tavily error:", res.status, await res.text());
    return [];
  }

  const data = (await res.json()) as { results?: TavilyResult[] };
  return data.results ?? [];
}

// ── Groq LLM extraction ────────────────────────────────────────────────

const EXTRACTION_SYSTEM_PROMPT = `You are a structured-data extractor. The user will give you raw web-search results about upcoming student hackathons and coding competitions.

Return ONLY a JSON array (no markdown, no explanation) where each element has these exact keys:
- "title" (string): competition name
- "platform" (string): hosting platform (e.g. Devpost, Unstop, Devfolio, MLH, Kaggle, LeetCode, Codeforces, CodeChef, HackerRank, HackerEarth, AtCoder, TopCoder, or the actual platform name)
- "tags" (string[]): relevant technology/topic tags in lowercase
- "deadline" (string): registration or submission deadline in YYYY-MM-DD format, or "TBD" if unknown
- "url" (string): direct link to the competition page
- "difficulty" (string): one of "Beginner", "Intermediate", or "Advanced"
- "prize" (string): prize info or "See details"
- "description" (string): one-sentence description

Rules:
- Only include REAL competitions that are currently open or upcoming.
- Do NOT invent competitions. If the search results don't contain enough info, return fewer items.
- Ensure every URL comes directly from the search results.
- Return a minimum of 0 and maximum of 20 items.
- Output raw JSON only — no wrapping markdown fences.`;

async function extractWithGroq(
  tavilyResults: TavilyResult[],
): Promise<Competition[]> {
  if (tavilyResults.length === 0) return [];

  const groq = getGroq();
  const userContent = tavilyResults
    .map(
      (r, i) =>
        `[${i + 1}] Title: ${r.title}\nURL: ${r.url}\nSnippet: ${r.content}`,
    )
    .join("\n\n");

  const chat = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 4096,
    messages: [
      { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
  });

  const raw = chat.choices[0]?.message?.content?.trim() ?? "[]";

  // Strip markdown fences if the model wraps them anyway
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error(
      "[competitions] Groq JSON parse failed:",
      cleaned.slice(0, 200),
    );
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter(
      (item: Record<string, unknown>) =>
        typeof item.title === "string" &&
        typeof item.url === "string" &&
        item.title.length > 0,
    )
    .map((item: Record<string, unknown>, i: number) => ({
      id: `ai-${i}-${Date.now()}`,
      title: String(item.title),
      platform: String(item.platform ?? "Unknown"),
      tags: Array.isArray(item.tags)
        ? item.tags.map((t: unknown) => String(t).toLowerCase())
        : [],
      deadline: String(item.deadline ?? "TBD"),
      url: String(item.url),
      difficulty: (["Beginner", "Intermediate", "Advanced"].includes(
        String(item.difficulty),
      )
        ? String(item.difficulty)
        : "Intermediate") as Competition["difficulty"],
      prize: String(item.prize ?? "See details"),
      description: String(item.description ?? ""),
    }));
}

// ── AI Search Pipeline ──────────────────────────────────────────────────

async function fetchCompetitionsAI(
  userSkills: string[],
): Promise<Competition[]> {
  const skillStr =
    userSkills.length > 0
      ? userSkills.join(", ")
      : "web development, AI, data science";

  const cacheKey = skillStr.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.competitions;
  }

  const query = `Upcoming active student hackathons and coding competitions on Devpost, Unstop, Devfolio, MLH, Kaggle, LeetCode, Codeforces involving ${skillStr}`;

  const tavilyResults = await searchTavily(query);
  const competitions = await extractWithGroq(tavilyResults);

  // De-duplicate by URL
  const seen = new Set<string>();
  const unique = competitions.filter((c) => {
    if (seen.has(c.url)) return false;
    seen.add(c.url);
    return true;
  });

  cache.set(cacheKey, { competitions: unique, timestamp: Date.now() });
  return unique;
}

// ── Scoring ─────────────────────────────────────────────────────────────

function scoreCompetition(
  competition: Competition,
  userSkills: string[],
): { score: number; matchedTags: string[] } {
  const normalised = userSkills.map((s) => s.toLowerCase().trim());
  const matchedTags = competition.tags.filter((tag) =>
    normalised.some((skill) => tag.includes(skill) || skill.includes(tag)),
  );
  return { score: matchedTags.length, matchedTags };
}

// ── Public server actions ───────────────────────────────────────────────

export async function getRecommendedCompetitions(
  userSkills: string[],
): Promise<ScoredCompetition[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const competitions = await fetchCompetitionsAI(userSkills);

    if (!userSkills.length)
      return competitions.slice(0, 3).map((c) => ({ ...c, matchedTags: [] }));

    const scored = competitions.map((c) => {
      const { score, matchedTags } = scoreCompetition(c, userSkills);
      return { ...c, matchedTags, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(({ score: _score, ...rest }) => rest);
  } catch (err) {
    console.error("[competitions] AI pipeline failed:", err);
    return [];
  }
}

export async function getAllCompetitions(
  userSkills: string[],
): Promise<ScoredCompetition[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const competitions = await fetchCompetitionsAI(userSkills);

    if (!userSkills.length)
      return competitions.map((c) => ({ ...c, matchedTags: [] }));

    const scored = competitions.map((c) => {
      const { score, matchedTags } = scoreCompetition(c, userSkills);
      return { ...c, matchedTags, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map(({ score: _score, ...rest }) => rest);
  } catch (err) {
    console.error("[competitions] AI pipeline failed:", err);
    return [];
  }
}
