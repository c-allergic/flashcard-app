import { Router } from "express"
import { OpenAI } from "openai"

const router = Router()

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// 生成每日计划
router.post('/generate-plan', async (req, res) => {
  const { prompt } = req.body

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个专业的计划制定助手，能够根据用户的需求生成合理的每日计划。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    const plan = response.choices[0].message?.content?.trim()

    if (!plan) {
      return res.status(500).json({ error: 'Failed to generate plan' })
    }

    res.json({ plan })
  } catch (error) {
    console.error('AI plan generation error:', error)
    res.status(500).json({ error: 'Failed to generate plan' })
  }
})

// 优化内容
router.post('/optimize-content', async (req, res) => {
  const { content } = req.body

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个内容优化助手，能够优化和改进用户提供的文本内容。"
        },
        {
          role: "user",
          content: `请优化以下内容：\n\n${content}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.5
    })

    const optimizedContent = response.choices[0].message?.content?.trim()

    if (!optimizedContent) {
      return res.status(500).json({ error: 'Failed to optimize content' })
    }

    res.json({ optimizedContent })
  } catch (error) {
    console.error('AI content optimization error:', error)
    res.status(500).json({ error: 'Failed to optimize content' })
  }
})

// 生成闪卡内容
router.post('/generate-flashcard', async (req, res) => {
  const { content } = req.body

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个闪卡生成助手，能够根据提供的文本内容生成高质量的闪卡问题答案对。"
        },
        {
          role: "user",
          content: `请根据以下内容生成闪卡：\n\n${content}\n\n请以JSON格式返回，包含questions和answers数组。`
        }
      ],
      max_tokens: 500,
      temperature: 0.6
    })

    const flashcardData = response.choices[0].message?.content?.trim()

    if (!flashcardData) {
      return res.status(500).json({ error: 'Failed to generate flashcard' })
    }

    // 尝试解析JSON
    try {
      const parsedData = JSON.parse(flashcardData)
      res.json(parsedData)
    } catch (parseError) {
      // 如果不是JSON，返回原始文本
      res.json({ content: flashcardData })
    }
  } catch (error) {
    console.error('AI flashcard generation error:', error)
    res.status(500).json({ error: 'Failed to generate flashcard' })
  }
})

export default router