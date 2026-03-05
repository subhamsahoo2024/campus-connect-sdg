'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateProfileEmbedding } from '@/lib/ai/embeddings'
import { findMentorsForStudent, findSimilarProfiles } from '@/lib/ai/matchmaking'
import { generateMatchReasoning } from '@/lib/ai/groq'

export async function getStudentMentorMatches() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, skills, sdgs, bio, role, embedding')
    .eq('id', user.id)
    .single()

  if (!profile) throw new Error('Profile not found')

  // Generate embedding if not exists
  let embedding: number[] | null = profile.embedding
  if (!embedding) {
    embedding = await generateProfileEmbedding({
      full_name: profile.full_name,
      bio: profile.bio,
      skills: profile.skills,
      interests: null,
      sdgs: profile.sdgs,
      role: profile.role,
    })

    if (embedding) {
      await supabase.from('profiles').update({ embedding }).eq('id', user.id)
    } else {
      throw new Error('Could not generate embedding for profile')
    }
  }

  // Use the complete matchmaking pipeline
  try {
    const matches = await findMentorsForStudent(user.id, 5)
    return matches
  } catch (error) {
    console.error('Error finding mentors:', error)
    // Fallback if matchmaking fails
    return []
  }
}

export async function connectWithMentor(mentorId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check if matches table has the connection
  await supabase.from('matches').upsert({
    mentor_id: mentorId,
    student_id: user.id,
    status: 'pending',
  })

  revalidateTag('connections')
}

export async function getMenteeSuggestions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, skills, sdgs, bio, role, embedding')
    .eq('id', user.id)
    .single()

  if (!profile) throw new Error('Profile not found')

  // Generate embedding if not exists
  let embedding: number[] | null = profile.embedding
  if (!embedding) {
    embedding = await generateProfileEmbedding({
      full_name: profile.full_name,
      bio: profile.bio,
      skills: profile.skills,
      interests: null,
      sdgs: profile.sdgs,
      role: profile.role,
    })

    if (embedding) {
      await supabase.from('profiles').update({ embedding }).eq('id', user.id)
    } else {
      throw new Error('Could not generate embedding for profile')
    }
  }

  const matches = await findSimilarProfiles(embedding, 'student', 10)

  const results = await Promise.all(
    matches.map(async (match) => {
      try {
        const reasoning = await generateMatchReasoning(
          {
            full_name: profile.full_name,
            skills: profile.skills,
            sdgs: profile.sdgs,
            bio: profile.bio,
          },
          {
            full_name: match.profile.full_name,
            skills: match.profile.skills,
            sdgs: match.profile.sdgs,
            bio: match.profile.bio,
          },
          match.similarity
        )
        return { ...match, reasoning }
      } catch (error) {
        console.error('Error generating reasoning:', error)
        return {
          ...match,
          reasoning: `${Math.round(match.similarity * 100)}% match based on shared interests.`,
        }
      }
    })
  )

  return results
}
          skills: profile.skills,
          sdg_interests: profile.sdg_interests,
          bio: profile.bio,
        },
        {
          full_name: match.profile.full_name,
          skills: match.profile.skills,
          sdg_interests: match.profile.sdg_interests,
          bio: match.profile.bio,
        },
        match.similarity
      )
      return { ...match, reasoning }
    })
  )

  return results
}
