import type { VercelRequest, VercelResponse } from '@vercel/node'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = request.body

  if (!prompt) {
    return response.status(400).json({ error: 'Prompt is required' })
  }

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的计划制定助手，能够根据用户的需求生成合理的每日计划。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    const plan = result.choices[0]?.message?.content?.trim()

    if (!plan) {
      return response.status(500).json({ error: 'Failed to generate plan' })
    }

    response.json({ plan })
  } catch (error) {
    console.error('AI plan generation error:', error)
    response.status(500).json({ error: 'Failed to generate plan' })
  }
}