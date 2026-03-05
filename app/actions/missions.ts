'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateDailyMissions } from '@/lib/ai/missions'

export async function fetchOrGenerateMissions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Check if missions already exist for today (not expired)
  const { data: existing } = await supabase
    .from('missions')
    .select('*')
    .eq('student_id', user.id)
    .gte('expires_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString())

  if (existing && existing.length > 0) return existing

  // Fetch profile + startup for context
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, skills, interests, innovation_score')
    .eq('id', user.id)
    .single()

  const { data: startup } = await supabase
    .from('startups')
    .select('name, stage')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const missions = await generateDailyMissions({
    studentName: profile?.full_name ?? 'Student',
    startupStage: startup?.stage ?? 'idea',
    startupName: startup?.name,
    skills: profile?.skills ?? [],
    interests: profile?.interests ?? [],
    innovationScore: profile?.innovation_score ?? 0,
  })

  // Set expiration to midnight tomorrow
  const expiresAt = new Date(tomorrow)
  
  const { data: inserted } = await supabase
    .from('missions')
    .insert(missions.map((m) => ({ 
      ...m, 
      student_id: user.id, 
      expires_at: expiresAt.toISOString() 
    })))
    .select()

  revalidateTag('missions')
  return inserted ?? []
}
