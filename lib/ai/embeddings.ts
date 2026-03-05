/**
 * AI Embeddings Module
 * Uses Hugging Face's gte-small model to generate 384-dimensional vectors
 * for semantic similarity matching between profiles and startups
 */

const HUGGINGFACE_API_URL =
  'https://api-inference.huggingface.co/pipeline/feature-extraction/thenlper/gte-small'
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

/**
 * Generate embeddings for text using Hugging Face Inference API
 * @param text - Text to embed (profile bio, startup pitch, etc.)
 * @returns 384-dimensional vector or null on error
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!HUGGINGFACE_API_KEY) {
    console.error('HUGGINGFACE_API_KEY not configured')
    return null
  }

  if (!text || text.trim().length === 0) {
    console.error('Empty text provided for embedding')
    return null
  }

  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        options: { wait_for_model: true },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API error:', response.status, errorText)
      return null
    }

    const data = await response.json()

    // The API returns a nested array [[...numbers...]]; flatten it
    return Array.isArray(data[0]) ? (data[0] as number[]) : (data as number[])
  } catch (error) {
    console.error('Error generating embedding:', error)
    return null
  }
}

/**
 * Generate embedding for a user profile
 * Combines relevant fields into a coherent text representation
 */
export async function generateProfileEmbedding(profile: {
  full_name: string
  bio?: string | null
  skills?: string[] | null
  interests?: string[] | null
  sdgs?: string[] | null
  role: string
}): Promise<number[] | null> {
  const parts: string[] = []

  parts.push(`${profile.role}: ${profile.full_name}`)

  if (profile.bio) {
    parts.push(profile.bio)
  }

  if (profile.skills && profile.skills.length > 0) {
    parts.push(`Skills: ${profile.skills.join(', ')}`)
  }

  if (profile.interests && profile.interests.length > 0) {
    parts.push(`Interests: ${profile.interests.join(', ')}`)
  }

  if (profile.sdgs && profile.sdgs.length > 0) {
    parts.push(`SDGs: ${profile.sdgs.join(', ')}`)
  }

  const text = parts.join('. ')
  return generateEmbedding(text)
}

/**
 * Generate embedding for a startup
 * Combines pitch, domain, stage, and SDGs into searchable text
 */
export async function generateStartupEmbedding(startup: {
  name: string
  pitch?: string | null
  domain?: string | null
  stage?: string | null
  sdgs?: string[] | null
}): Promise<number[] | null> {
  const parts: string[] = []

  parts.push(`Startup: ${startup.name}`)

  if (startup.domain) {
    parts.push(`Domain: ${startup.domain}`)
  }

  if (startup.stage) {
    parts.push(`Stage: ${startup.stage}`)
  }

  if (startup.pitch) {
    parts.push(startup.pitch)
  }

  if (startup.sdgs && startup.sdgs.length > 0) {
    parts.push(`SDGs: ${startup.sdgs.join(', ')}`)
  }

  const text = parts.join('. ')
  return generateEmbedding(text)
}

/**
 * Calculate cosine similarity between two vectors
 * @returns Similarity score between 0 and 1
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}
