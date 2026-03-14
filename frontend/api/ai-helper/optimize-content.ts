import type { VercelRequest, VercelResponse } from '@vercel/node'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const { content } = request.body

  if (!content) {
    return response.status(400).json({ error: 'Content is required' })
  }

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '你是一个内容优化助手，能够优化和改进用户提供的文本内容。'
        },
        {
          role: 'user',
          content: `请优化以下内容：\n\n${content}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.5
    })

    const optimizedContent = result.choices[0]?.message?.content?.trim()

    if (!optimizedContent) {
      return response.status(500).json({ error: 'Failed to optimize content' })
    }

    response.json({ optimizedContent })
  } catch (error) {
    console.error('AI content optimization error:', error)
    response.status(500).json({ error: 'Failed to optimize content' })
  }
}