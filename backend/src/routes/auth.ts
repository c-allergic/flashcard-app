import { Router } from "express"
import { Octokit } from "@octokit/rest"

const router = Router()

// GitHub OAuth回调路由
router.get('/github/callback', async (req, res) => {
  const { code } = req.query

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' })
  }

  try {
    // 使用code交换访问令牌
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code as string
      })
    })

    const data = await response.json() as { access_token?: string; error?: string; error_description?: string }

    if (data.error) {
      return res.status(400).json({ error: data.error_description })
    }

    // 获取用户信息
    const octokit = new Octokit({ auth: data.access_token })
    const { data: user } = await octokit.rest.users.getAuthenticated()

    // 返回用户信息和访问令牌
    res.json({
      user: {
        id: user.id,
        login: user.login,
        name: user.name || user.login,
        email: user.email || '',
        avatar_url: user.avatar_url
      },
      token: data.access_token
    })
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    res.status(500).json({ error: 'Failed to authenticate with GitHub' })
  }
})

// 扩展Session类型
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number
      login: string
      name: string
      email: string
      avatar_url: string
    }
  }
}

// 获取GitHub用户信息
router.get('/user', (req, res) => {
  // 检查req.session或req.session.user是否存在
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  res.json(req.session.user)
})

export default router