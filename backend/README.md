# 闪卡应用后端

## 已完成的API端点

### 1. 认证相关 (`/api/auth`)
- `GET /auth/github/callback` - GitHub OAuth回调
- `GET /auth/user` - 获取当前用户信息

### 2. 数据同步 (`/api/sync`)
- `POST /sync` - 同步闪卡、工作记录和计划数据到GitHub

### 3. 备份恢复 (`/api/backup`)
- `POST /backup` - 创建数据备份
- `GET /backups` - 获取备份列表
- `GET /backup/:path` - 获取特定备份文件
- `POST /restore/:path` - 恢复备份数据

### 4. AI助手 (`/api/ai`)
- `POST /ai-helper/generate-plan` - 生成计划
- `POST /ai-helper/optimize-content` - 优化内容
- `POST /ai-helper/generate-flashcard` - 生成闪卡

## 依赖项
- `express` - Web框架
- `express-session` - 会话管理
- `@octokit/rest` - GitHub API客户端
- `@types/express-session` - 会话类型定义
- `openai` - OpenAI API客户端（可选，如果你使用自己的API）

## 环境变量
需要在 `.env` 文件中设置：
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_OWNER=your_github_username
PORT=3000
SESSION_SECRET=your_session_secret
OPENAI_API_KEY=your_openai_api_key
```

## 启动服务
```bash
npm run dev
```

## 注意事项
- 需要先配置GitHub OAuth应用
- GitHub仓库需要有适当的权限
- 如果使用自己的API，可以修改 `src/routes/ai.ts` 中的实现