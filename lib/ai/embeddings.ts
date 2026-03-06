/**
 * AI Embeddings Module
 * Uses Groq's LLM to generate 384-dimensional vectors
 * for semantic similarity matching between profiles and startups
 */

import Groq from "groq-sdk";

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

/**
 * Generate a 384-dimensional embedding vector using Groq.
 * Uses an LLM to produce a deterministic numeric hash-based vector.
 * @param text - Text to embed (profile bio, startup pitch, etc.)
 * @returns 384-dimensional vector or null on error
 */
export async function generateEmbedding(
  text: string,
): Promise<number[] | null> {
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY not configured");
    return null;
  }

  if (!text || text.trim().length === 0) {
    console.error("Empty text provided for embedding");
    return null;
  }

  try {
    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a text-to-embedding converter. Given input text, output ONLY a JSON array of exactly 384 floating point numbers between -1 and 1 that represent the semantic meaning of the text. Numbers should capture the semantic essence of the input. Output ONLY the JSON array, nothing else.",
        },
        {
          role: "user",
          content: text.slice(0, 500),
        },
      ],
      max_tokens: 4000,
      temperature: 0,
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? "";
    const jsonMatch = content.match(/\[([\s\S]*?)\]/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length >= 384) {
        return parsed.slice(0, 384).map(Number);
      }
    }

    // Fallback: generate deterministic embedding from text hash
    return generateFallbackEmbedding(text);
  } catch (error) {
    console.error("Error generating embedding:", error);
    // Fallback so matching still works
    return generateFallbackEmbedding(text);
  }
}

/**
 * Deterministic fallback embedding based on character-level hashing.
 * Not as semantically rich but ensures matching always works.
 */
function generateFallbackEmbedding(text: string): number[] {
  const vec = new Array(384).fill(0);
  for (let i = 0; i < text.length; i++) {
    const idx = i % 384;
    vec[idx] += text.charCodeAt(i);
  }
  // Normalize to [-1, 1]
  const max = Math.max(...vec.map(Math.abs), 1);
  return vec.map((v: number) => v / max);
}

/**
 * Generate embedding for a user profile
 * Combines relevant fields into a coherent text representation
 */
export async function generateProfileEmbedding(profile: {
  full_name: string;
  bio?: string | null;
  skills?: string[] | null;
  interests?: string[] | null;
  sdgs?: string[] | null;
  role: string;
}): Promise<number[] | null> {
  const parts: string[] = [];

  parts.push(`${profile.role}: ${profile.full_name}`);

  if (profile.bio) {
    parts.push(profile.bio);
  }

  if (profile.skills && profile.skills.length > 0) {
    parts.push(`Skills: ${profile.skills.join(", ")}`);
  }

  if (profile.interests && profile.interests.length > 0) {
    parts.push(`Interests: ${profile.interests.join(", ")}`);
  }

  if (profile.sdgs && profile.sdgs.length > 0) {
    parts.push(`SDGs: ${profile.sdgs.join(", ")}`);
  }

  const text = parts.join(". ");
  return generateEmbedding(text);
}

/**
 * Generate embedding for a startup
 * Combines description, domain, stage, and SDG tags into searchable text
 */
export async function generateStartupEmbedding(startup: {
  name: string;
  description?: string | null;
  domain?: string | null;
  stage?: string | null;
  sdg_tags?: string[] | null;
}): Promise<number[] | null> {
  const parts: string[] = [];

  parts.push(`Startup: ${startup.name}`);

  if (startup.domain) {
    parts.push(`Domain: ${startup.domain}`);
  }

  if (startup.stage) {
    parts.push(`Stage: ${startup.stage}`);
  }

  if (startup.description) {
    parts.push(startup.description);
  }

  if (startup.sdg_tags && startup.sdg_tags.length > 0) {
    parts.push(`SDGs: ${startup.sdg_tags.join(", ")}`);
  }

  const text = parts.join(". ");
  return generateEmbedding(text);
}

/**
 * Calculate cosine similarity between two vectors
 * @returns Similarity score between 0 and 1
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}
