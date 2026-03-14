import { Router, Request } from "express"
import { Octokit } from "@octokit/rest"

// 扩展Request接口
declare module 'express' {
  interface Request {
    user?: {
      id: number
      login: string
      name: string
      email: string
      avatar_url: string
      token?: string
    }
  }
}

const router = Router()

interface SyncData {
  flashcards: any[]
  worklogs: any[]
  plans: any[]
}

router.post('/sync', async (req, res) => {
  const { flashcards, worklogs, plans }: SyncData = req.body

  try {
    // 确保req.user存在
    const user = (req as any).user
    if (!user || !user.token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const octokit = new Octokit({ auth: user.token })

    // 确保GITHUB_OWNER环境变量已设置
    const githubOwner = process.env.GITHUB_OWNER
    if (!githubOwner) {
      return res.status(500).json({ error: 'GitHub owner not configured' })
    }

    // 同步闪卡数据
    await syncData(octokit, 'flashcards', flashcards, githubOwner)
    await syncData(octokit, 'worklogs', worklogs, githubOwner)
    await syncData(octokit, 'plans', plans, githubOwner)

    res.json({ success: true, message: 'Data synced successfully' })
  } catch (error) {
    console.error('Sync error:', error)
    res.status(500).json({ error: 'Failed to sync data' })
  }
})

async function syncData(octokit: Octokit, repo: string, data: any[], githubOwner: string) {
  try {
    // 获取现有数据文件
    const { data: fileData } = await octokit.repos.getContent({
      owner: githubOwner,
      repo,
      path: 'data.json'
    })

    const existingData = JSON.parse(Buffer.from((fileData as any).content, 'base64').toString())

    // 合并数据（简单合并，实际应用中需要更复杂的冲突解决）
    const mergedData = {
      ...existingData,
      ...data.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
    }

    // 更新数据文件
    await octokit.repos.createOrUpdateFileContents({
      owner: githubOwner,
      repo,
      path: 'data.json',
      message: `Update ${repo} data`,
      content: Buffer.from(JSON.stringify(mergedData)).toString('base64'),
      sha: (fileData as any).sha
    })
  } catch (error: any) {
    // 如果文件不存在，创建新文件
    if (error.status === 404) {
      await octokit.repos.createOrUpdateFileContents({
        owner: githubOwner,
        repo,
        path: 'data.json',
        message: `Create ${repo} data`,
        content: Buffer.from(JSON.stringify(data.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}))).toString('base64')
      })
    } else {
      throw error
    }
  }
}

export default router