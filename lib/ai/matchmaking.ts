import { createClient } from "@/lib/supabase/server";
import { generateMatchReasoning } from "./groq";

export interface MatchResult {
  profile: {
    id: string;
    rs_id: string;
    full_name: string;
    skills?: string[] | null;
    sdgs?: string[] | null;
    bio?: string | null;
    role: string;
    linkedin_url?: string | null;
  };
  similarity: number;
  reasoning?: string;
}

export async function findSimilarProfiles(
  embedding: number[],
  targetRole: "mentor" | "student",
  limit = 5,
): Promise<MatchResult[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("match_profiles", {
    query_embedding: embedding,
    target_role: targetRole,
    match_count: limit,
  });

  if (error) throw new Error(`Vector search error: ${error.message}`);

  return (data ?? []) as MatchResult[];
}

export async function findSimilarStartups(
  embedding: number[],
  filters: { stage?: string; domain?: string },
  limit = 10,
): Promise<
  Array<{
    id: string;
    name: string;
    pitch?: string | null;
    stage?: string | null;
    domain?: string | null;
    sdgs?: string[] | null;
    funding_raised?: number | null;
    student_id: string;
    similarity: number;
  }>
> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("match_startups", {
    query_embedding: embedding,
    filter_stage: filters.stage ?? null,
    filter_domain: filters.domain ?? null,
    match_count: limit,
  });

  if (error) throw new Error(`Startup vector search error: ${error.message}`);

  return data ?? [];
}

/**
 * Complete matchmaking pipeline: Vector search + LLM reasoning
 * Finds mentors for a student and generates AI explanations
 */
export async function findMentorsForStudent(
  studentId: string,
  limit = 5,
): Promise<MatchResult[]> {
  const supabase = await createClient();

  // Get student profile with embedding
  const { data: studentProfile, error: studentError } = await supabase
    .from("profiles")
    .select("id, rs_id, full_name, skills, sdgs, bio, embedding")
    .eq("id", studentId)
    .single();

  if (studentError || !studentProfile) {
    throw new Error("Student profile not found");
  }

  if (!studentProfile.embedding) {
    throw new Error("Student profile has no embedding. Generate it first.");
  }

  // Vector search for mentors
  const matches = await findSimilarProfiles(
    studentProfile.embedding,
    "mentor",
    limit,
  );

  // Generate AI reasoning for each match
  const enrichedMatches = await Promise.all(
    matches.map(async (match) => {
      try {
        const reasoning = await generateMatchReasoning(
          {
            full_name: match.profile.full_name,
            skills: match.profile.skills,
            sdgs: match.profile.sdgs,
            bio: match.profile.bio,
          },
          {
            full_name: studentProfile.full_name,
            skills: studentProfile.skills,
            sdgs: studentProfile.sdgs,
            bio: studentProfile.bio,
          },
          match.similarity,
        );
        return { ...match, reasoning };
      } catch (error) {
        console.error("Error generating reasoning:", error);
        // Fallback reasoning if Groq fails
        return {
          ...match,
          reasoning: `${Math.round(match.similarity * 100)}% match based on shared skills and interests.`,
        };
      }
    }),
  );

  return enrichedMatches;
}

/**
 * Calculate compatibility score (0-100%) from vector similarity
 * Applies scaling to make scores more intuitive
 */
export function calculateCompatibilityScore(vectorSimilarity: number): number {
  // Vector similarity is typically 0.0 to 1.0
  // Apply logarithmic scaling to spread scores more evenly
  const scaled = Math.pow(vectorSimilarity, 0.7) * 100;
  return Math.round(Math.min(100, Math.max(0, scaled)));
}
