class AIService {
  private apiKey: string = ''

  async generatePlan(prompt: string): Promise<string> {
    try {
      const response = await fetch('http://localhost:3000/api/ai/generate-plan', {
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
      const response = await fetch('http://localhost:3000/api/ai/optimize-content', {
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
      const response = await fetch('http://localhost:3000/api/ai/generate-flashcard', {
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