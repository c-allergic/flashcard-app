import { Octokit } from '@octokit/rest'

class GitHubService {
  private octokit: Octokit

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
  }

  async authenticate() {
    // GitHub OAuth认证逻辑
    // 这里需要实现OAuth流程
  }

  async syncData(repo: string, data: any) {
    try {
      // 将数据同步到GitHub仓库
      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner: process.env.GITHUB_OWNER,
        repo,
        path: 'data.json',
        message: 'Update flashcard data',
        content: Buffer.from(JSON.stringify(data)).toString('base64'),
        sha: await this.getFileSha(repo, 'data.json')
      })
      return response
    } catch (error) {
      console.error('GitHub sync error:', error)
      throw error
    }
  }

  private async getFileSha(repo: string, path: string) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER,
        repo,
        path
      })
      return (data as any).sha
    } catch (error) {
      // 文件不存在，返回undefined
      return undefined
    }
  }

  async backupData(repo: string, data: any) {
    const timestamp = new Date().toISOString()
    const backupPath = `backups/flashcard-data-${timestamp}.json`

    return this.octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo,
      path: backupPath,
      message: `Backup flashcard data ${timestamp}`,
      content: Buffer.from(JSON.stringify(data)).toString('base64')
    })
  }
}

export const githubService = new GitHubService()