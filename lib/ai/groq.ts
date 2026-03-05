import Groq from "groq-sdk";

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

export async function generateMatchReasoning(
  mentor: {
    full_name: string;
    skills?: string[] | null;
    sdgs?: string[] | null;
    bio?: string | null;
  },
  student: {
    full_name: string;
    skills?: string[] | null;
    sdgs?: string[] | null;
    bio?: string | null;
  },
  similarityScore: number,
): Promise<string> {
  const groq = getGroqClient();

  const prompt = `You are a matchmaking assistant for a university innovation platform.
A mentor and student have been algorithmically matched with a ${Math.round(similarityScore * 100)}% compatibility score.

Mentor: ${mentor.full_name}
Skills: ${mentor.skills?.join(", ") || "N/A"}
SDG Interests: ${mentor.sdgs?.join(", ") || "N/A"}
Bio: ${mentor.bio || "N/A"}

Student: ${student.full_name}
Skills: ${student.skills?.join(", ") || "N/A"}
SDG Interests: ${student.sdgs?.join(", ") || "N/A"}
Bio: ${student.bio || "N/A"}

Write exactly 2 sentences explaining why this is a good match. Be specific, mentioning shared skills or overlapping SDG goals. Do not add any preamble.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.7,
  });

  return (
    completion.choices[0]?.message?.content?.trim() ??
    "Strong compatibility based on shared interests and skills."
  );
}

export async function generateStartupGrowthInsight(
  startup: {
    name: string;
    description?: string | null;
    stage?: string | null;
    domain?: string | null;
    sdg_tags?: string[] | null;
  },
  activitySummary: string,
): Promise<string> {
  const groq = getGroqClient();

  const prompt = `You are an investment analyst on a campus innovation platform.
Analyze this startup and write a 3-sentence growth insight for an investor.

Startup: ${startup.name}
Description: ${startup.description || "N/A"}
Stage: ${startup.stage || "N/A"}
Domain: ${startup.domain || "N/A"}
SDG Tags: ${startup.sdg_tags?.join(", ") || "N/A"}
Activity: ${activitySummary}

Write exactly 3 concise sentences covering: (1) the team's momentum, (2) the market opportunity, and (3) a forward-looking observation. No preamble.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
    temperature: 0.7,
  });

  return (
    completion.choices[0]?.message?.content?.trim() ??
    "Promising early-stage startup with strong fundamentals."
  );
}

export async function generateWeeklyEcosystemReport(ecosystemData: {
  totalStudents: number;
  totalStartups: number;
  topDomains: string[];
  stageCounts: Record<string, number>;
  totalFunding: number;
}): Promise<string> {
  const groq = getGroqClient();

  const prompt = `You are a strategic advisor for a university innovation ecosystem.
Based on this week's data, generate a strategic report for the administration.

Total Students: ${ecosystemData.totalStudents}
Total Startups: ${ecosystemData.totalStartups}
Top Domains: ${ecosystemData.topDomains.join(", ")}
Stage Distribution: ${JSON.stringify(ecosystemData.stageCounts)}
Total Funding Raised: $${ecosystemData.totalFunding.toLocaleString()}

Write a 3-paragraph strategic report covering:
1. Key highlights and wins this week
2. Gaps or bottlenecks identified
3. Concrete recommendations (e.g., workshops, mentor recruitment, funding drives)
Be specific and actionable. No bullet points, flowing paragraphs only.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 600,
    temperature: 0.8,
  });

  return (
    completion.choices[0]?.message?.content?.trim() ??
    "Data insufficient for report generation."
  );
}

/**
 * Generate daily missions for a student using Llama 3.1 8B Instant
 * Fast and efficient mission generation based on startup stage and profile
 */
export async function generateDailyMissions(
  profile: {
    full_name: string;
    skills?: string[] | null;
    interests?: string[] | null;
  },
  startup?: {
    name: string;
    stage?: string | null;
    domain?: string | null;
  } | null,
): Promise<Array<{ title: string; description: string; xp_reward: number }>> {
  const groq = getGroqClient();

  const startupContext = startup
    ? `Student has a startup called "${startup.name}" at ${startup.stage || "idea"} stage in the ${startup.domain || "general"} domain.`
    : "Student does not have a startup yet.";

  const prompt = `You are a gamification engine for a university innovation platform.
Generate exactly 3 daily missions for ${profile.full_name}.

${startupContext}
Skills: ${profile.skills?.join(", ") || "N/A"}
Interests: ${profile.interests?.join(", ") || "N/A"}

Generate 3 missions that are:
1. Actionable and specific (not vague)
2. Achievable today (30 min to 2 hours each)
3. Tailored to their startup stage or skills
4. Progressive in difficulty (easy → medium → hard)

For each mission, provide:
- title: Short action-oriented title (max 6 words)
- description: One sentence explaining the task
- xp_reward: XP points (10 for easy, 20 for medium, 30 for hard)

Respond ONLY with valid JSON array in this exact format:
[
  {"title": "...", "description": "...", "xp_reward": 10},
  {"title": "...", "description": "...", "xp_reward": 20},
  {"title": "...", "description": "...", "xp_reward": 30}
]

No markdown code blocks, no preamble, just the JSON array.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.9,
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? "[]";

    // Try to parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const missions = JSON.parse(jsonMatch[0]);
      return missions.slice(0, 3); // Ensure max 3 missions
    }

    // Fallback if parsing fails
    return [
      {
        title: "Update Your Startup Page",
        description: "Add or refine your pitch on the startup page.",
        xp_reward: 10,
      },
      {
        title: "Connect with a Mentor",
        description: "Browse mentors and send a connection request.",
        xp_reward: 20,
      },
      {
        title: "Share Your Progress",
        description: "Post an update about your startup journey on LinkedIn.",
        xp_reward: 30,
      },
    ];
  } catch (error) {
    console.error("Error generating missions:", error);
    // Return fallback missions
    return [
      {
        title: "Update Your Profile",
        description: "Add more details about your skills and interests.",
        xp_reward: 10,
      },
      {
        title: "Explore Opportunities",
        description: "Browse available mentors and potential matches.",
        xp_reward: 20,
      },
      {
        title: "Build Your Network",
        description: "Connect with peers working on similar challenges.",
        xp_reward: 30,
      },
    ];
  }
}
