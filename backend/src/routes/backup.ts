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

interface BackupData {
  flashcards: any[]
  worklogs: any[]
  plans: any[]
}

router.post('/backup', async (req, res) => {
  const { flashcards, worklogs, plans }: BackupData = req.body

  try {
    // 确保req.user存在
    const user = (req as any).user
    if (!user || !user.token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const octokit = new Octokit({ auth: user.token })
    const timestamp = new Date().toISOString()

    // 确保GITHUB_OWNER环境变量已设置
    const githubOwner = process.env.GITHUB_OWNER
    if (!githubOwner) {
      return res.status(500).json({ error: 'GitHub owner not configured' })
    }

    // 创建备份文件
    const backupData = {
      timestamp,
      flashcards,
      worklogs,
      plans
    }

    const backupPath = `backups/flashcard-backup-${timestamp}.json`

    await octokit.repos.createOrUpdateFileContents({
      owner: githubOwner,
      repo: 'flashcard-backups',
      path: backupPath,
      message: `Backup flashcard data ${timestamp}`,
      content: Buffer.from(JSON.stringify(backupData)).toString('base64')
    })

    res.json({ success: true, message: 'Backup created successfully', path: backupPath })
  } catch (error) {
    console.error('Backup error:', error)
    res.status(500).json({ error: 'Failed to create backup' })
  }
})

router.get('/backups', async (req, res) => {
  try {
    // 确保req.user存在
    const user = (req as any).user
    if (!user || !user.token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const octokit = new Octokit({ auth: user.token })

    const githubOwner = process.env.GITHUB_OWNER
    if (!githubOwner) {
      return res.status(500).json({ error: 'GitHub owner not configured' })
    }

    const { data: backups } = await octokit.repos.getContent({
      owner: githubOwner,
      repo: 'flashcard-backups',
      path: 'backups'
    })

    res.json({ backups: (backups as any[]).map((file: any) => ({
      name: file.name,
      path: file.path,
      sha: file.sha,
      size: file.size,
      download_url: file.download_url
    })) })
  } catch (error) {
    console.error('Get backups error:', error)
    res.status(500).json({ error: 'Failed to get backups' })
  }
})

router.get('/backup/:path', async (req, res) => {
  try {
    const { path } = req.params
    // 确保req.user存在
    const user = (req as any).user
    if (!user || !user.token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const octokit = new Octokit({ auth: user.token })

    const githubOwner = process.env.GITHUB_OWNER
    if (!githubOwner) {
      return res.status(500).json({ error: 'GitHub owner not configured' })
    }

    const { data: fileData } = await octokit.repos.getContent({
      owner: githubOwner,
      repo: 'flashcard-backups',
      path
    })

    const backupData = JSON.parse(Buffer.from((fileData as any).content, 'base64').toString())
    res.json(backupData)
  } catch (error) {
    console.error('Get backup error:', error)
    res.status(500).json({ error: 'Failed to get backup' })
  }
})

router.post('/restore/:path', async (req, res) => {
  try {
    const { path } = req.params
    // 确保req.user存在
    const user = (req as any).user
    if (!user || !user.token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const octokit = new Octokit({ auth: user.token })

    const githubOwner = process.env.GITHUB_OWNER
    if (!githubOwner) {
      return res.status(500).json({ error: 'GitHub owner not configured' })
    }

    const { data: fileData } = await octokit.repos.getContent({
      owner: githubOwner,
      repo: 'flashcard-backups',
      path
    })

    const backupData = JSON.parse(Buffer.from((fileData as any).content, 'base64').toString())

    // 返回备份数据供前端恢复
    res.json({
      success: true,
      message: 'Backup restored successfully',
      data: {
        flashcards: backupData.flashcards,
        worklogs: backupData.worklogs,
        plans: backupData.plans
      }
    })
  } catch (error) {
    console.error('Restore error:', error)
    res.status(500).json({ error: 'Failed to restore backup' })
  }
})

export default router