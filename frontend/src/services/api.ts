import axios from 'axios'
import { cacheService } from './cache'

const API_BASE_URL = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 闪卡API
export const flashcardApi = {
  getAll: () => cacheService.cacheApiRequest('flashcards_all', () => api.get('/flashcards')),
  getById: (id: string) => api.get(`/flashcards/${id}`),
  create: (flashcard: any) => api.post('/flashcards', flashcard),
  update: (id: string, flashcard: any) => api.put(`/flashcards/${id}`, flashcard),
  delete: (id: string) => api.delete(`/flashcards/${id}`)
}

// 工作记录API
export const worklogApi = {
  getAll: () => cacheService.cacheApiRequest('worklogs_all', () => api.get('/worklog')),
  getById: (id: string) => api.get(`/worklog/${id}`),
  create: (worklog: any) => api.post('/worklog', worklog),
  update: (id: string, worklog: any) => api.put(`/worklog/${id}`, worklog),
  delete: (id: string) => api.delete(`/worklog/${id}`)
}

// 计划API
export const planApi = {
  getAll: () => cacheService.cacheApiRequest('plans_all', () => api.get('/plans')),
  getById: (id: string) => api.get(`/plans/${id}`),
  create: (plan: any) => api.post('/plans', plan),
  update: (id: string, plan: any) => api.put(`/plans/${id}`, plan),
  delete: (id: string) => api.delete(`/plans/${id}`)
}

// AI助手API
export const aiApi = {
  generatePlan: (prompt: string) => api.post('/ai-helper/generate-plan', { prompt }),
  optimizeContent: (content: string) => api.post('/ai-helper/optimize-content', { content }),
  generateFlashcard: (content: string) => api.post('/ai-helper/generate-flashcard', { content })
}