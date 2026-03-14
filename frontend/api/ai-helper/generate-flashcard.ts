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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个闪卡生成助手，能够根据提供的文本内容生成高质量的闪卡问题答案对。'
        },
        {
          role: 'user',
          content: `请根据以下内容生成闪卡：\n\n${content}\n\n请以JSON格式返回，包含questions和answers数组。`
        }
      ],
      max_tokens: 500,
      temperature: 0.6
    })

    const flashcardData = result.choices[0]?.message?.content?.trim()

    if (!flashcardData) {
      return response.status(500).json({ error: 'Failed to generate flashcard' })
    }

    // 尝试解析JSON
    try {
      const parsedData = JSON.parse(flashcardData)
      response.json(parsedData)
    } catch (parseError) {
      response.json({ content: flashcardData })
    }
  } catch (error) {
    console.error('AI flashcard generation error:', error)
    response.status(500).json({ error: 'Failed to generate flashcard' })
  }
}