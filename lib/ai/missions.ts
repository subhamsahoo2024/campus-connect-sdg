/**
 * Missions Module
 * Re-exports mission generation from groq.ts for backward compatibility
 * and provides helper functions for mission management
 */

import { generateDailyMissions as groqGenerateDailyMissions } from './groq'

export interface DailyMission {
  title: string
  description: string
  xp_reward: number
}

/**
 * Generate daily missions for a student
 * Wrapper around groq.generateDailyMissions with simplified interface
 */
export async function generateDailyMissions(context: {
  studentName: string
  startupStage?: string
  startupName?: string
  skills?: string[]
  interests?: string[]
  innovationScore?: number
}): Promise<DailyMission[]> {
  // Prepare profile and startup data
  const profile = {
    full_name: context.studentName,
    skills: context.skills || [],
    interests: context.interests || [],
  }

  const startup = context.startupName
    ? {
        name: context.startupName,
        stage: context.startupStage || 'idea',
        domain: null,
      }
    : null

  return groqGenerateDailyMissions(profile, startup)
}
