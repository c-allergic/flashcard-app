import { Request, Response, NextFunction } from "express"
import { Octokit } from "@octokit/rest"

interface GitHubUser {
  id: number
  login: string
  name: string
  email: string
  avatar_url: string
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取访问令牌
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 验证GitHub令牌
    const octokit = new Octokit({ auth: token })

    try {
      // 获取用户信息
      const { data: user } = await octokit.rest.users.getAuthenticated()

      // 将用户信息存储在请求中
      req.user = {
        id: user.id,
        login: user.login,
        name: user.name || user.login,
        email: user.email || '',
        avatar_url: user.avatar_url
      }

      next()
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}