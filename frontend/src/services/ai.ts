class AIService {
  private apiBase: string = ''

  constructor() {
    // Vercel 部署时自动使用 /api/ai-helper
    this.apiBase = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/ai-helper`
      : '/api/ai-helper'
  }

  async generatePlan(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiBase}/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) {
        throw new Error('AI generation failed')
      }

      const data = await response.json()
      return data.plan
    } catch (error) {
      console.error('AI generation error:', error)
      throw error
    }
  }

  async optimizeContent(content: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiBase}/optimize-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        throw new Error('Content optimization failed')
      }

      const data = await response.json()
      return data.optimizedContent
    } catch (error) {
      console.error('Content optimization error:', error)
      throw error
    }
  }

  async generateFlashcard(content: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiBase}/generate-flashcard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        throw new Error('Flashcard generation failed')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Flashcard generation error:', error)
      throw error
    }
  }
}

export const aiService = new AIService()