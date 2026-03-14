import express from "express"
import session from "express-session"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import authRoutes from "../routes/auth"
import syncRoutes from "../routes/sync"
import backupRoutes from "../routes/backup"
import aiRoutes from "../routes/ai"
import { authenticate, requireAuth } from "../middleware/auth"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// 认证中间件
app.use('/api', authenticate)

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/sync', requireAuth, syncRoutes)
app.use('/api/backup', requireAuth, backupRoutes)
app.use('/api/ai', aiRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log('GitHub Owner:', process.env.GITHUB_OWNER)
  console.log('GitHub Client ID:', process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not set')
})

export default app