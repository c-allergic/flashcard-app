# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个闪卡应用，具有完整的前后端架构，支持工作记录、计划模式、GitHub集成和AI辅助功能。应用采用现代化的技术栈，包括React + Vite前端和Node.js + Express后端。

## 常用命令

### 前端开发
```bash
# 启动开发服务器
cd frontend && npm run dev

# 构建生产版本
cd frontend && npm run build

# 代码检查和修复
cd frontend && npm run lint
```

### 后端开发
```bash
# 启动后端服务器（使用nodemon热重载）
cd backend && npm run dev

# 启动生产服务器
cd backend && npm start

# 构建TypeScript
cd backend && npm run build

# 运行测试
cd backend && npm test
```

### 全局命令
```bash
# 安装所有依赖
npm install

# 运行完整应用
# 需要同时运行前端和后端
```

## 高层架构

### 技术栈
- **前端**: React + TypeScript + Vite
- **后端**: Node.js + Express + TypeScript
- **数据存储**: GitHub私人仓库 + IndexedDB
- **AI集成**: OpenAI API
- **状态管理**: React Context + 本地存储

### 项目结构
```
flashcard-app/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/       # UI组件（闪卡、工作记录、计划模式）
│   │   ├── services/         # API服务层
│   │   │   ├── api.ts        # 主API服务
│   │   │   ├── github.ts     # GitHub集成
│   │   │   ├── ai.ts        # AI功能
│   │   │   └── indexeddb.ts  # 本地存储
│   │   └── tests/           # 单元测试
│   └── package.json
├── backend/                  # Node.js后端API
│   ├── src/
│   │   ├── server/          # 主服务器文件
│   │   ├── routes/          # API路由
│   │   │   ├── auth.ts      # GitHub OAuth认证
│   │   │   ├── ai.ts        # AI助手API
│   │   │   ├── sync.ts      # 数据同步
│   │   │   └── backup.ts    # 备份恢复
│   │   └── middleware/      # 中间件
│   └── package.json
└── shared/                   # 共享类型和工具
```

### 核心功能模块

#### 1. 闪卡管理
- 组件：`src/components/Flashcard.tsx`
- 服务：`src/services/api.ts` 中的 `flashcardApi`
- 功能：CRUD操作、分类标签、复习测试

#### 2. 工作记录
- 组件：`src/components/WorkLog.tsx`
- 服务：`src/services/api.ts` 中的 `worklogApi`
- 功能：富文本编辑、超链接支持、历史记录

#### 3. 计划模式
- 组件：`src/components/PlanMode.tsx`
- 服务：`src/services/api.ts` 中的 `planApi`
- 功能：计划管理、优先级、截止日期、AI生成

#### 4. AI集成
- 后端路由：`src/routes/ai.ts`
- 前端服务：`src/services/ai.ts`
- 功能：计划生成、内容优化、闪卡生成

#### 5. GitHub集成
- 后端路由：`src/routes/auth.ts` 和 `sync.ts`
- 前端服务：`src/services/github.ts`
- 功能：OAuth认证、数据同步、备份恢复

### 开发模式

1. **数据流**：前端通过API服务层与后端通信，同时使用IndexedDB进行本地缓存
2. **状态管理**：使用React Context和本地存储管理应用状态
3. **API设计**：RESTful API，支持闪卡、工作记录、计划等资源的CRUD操作
4. **AI集成**：通过OpenAI API提供智能功能

### 环境配置

需要在项目根目录创建 `.env` 文件：
```env
# 前端环境变量
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_CLIENT_SECRET=your_github_client_secret
VITE_GITHUB_OWNER=your_github_username
VITE_AI_API_KEY=your_openai_api_key

# 后端环境变量
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_OWNER=your_github_username
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```

### 扩展开发

当添加新功能时：
1. 在 `src/components/` 下创建新的React组件
2. 在 `src/services/` 下添加相应的服务层
3. 更新主 `App.tsx` 组件以整合新功能
4. 添加必要的测试到 `src/tests/`

### 注意事项

- 应用使用IndexedDB进行本地数据缓存，提高离线使用体验
- GitHub集成需要配置OAuth应用和私人仓库权限
- AI功能依赖OpenAI API密钥
- 前端使用Vite进行构建，后端使用TypeScript
- 代码遵循TypeScript类型系统，确保类型安全

这个架构设计支持模块化开发，便于维护和扩展。