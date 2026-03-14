# 闪卡应用

一个功能完整的闪卡应用，支持工作记录、计划模式、GitHub集成和AI辅助功能。

## 功能特性

- **闪卡管理**：创建、编辑、删除闪卡，支持分类和标签
- **工作记录**：记录每日工作内容，支持富文本和超链接
- **计划模式**：编写和管理每日计划，支持优先级和截止日期
- **GitHub集成**：数据同步到私人仓库，支持备份和恢复
- **AI辅助**：生成计划建议、内容优化和闪卡内容生成
- **本地存储**：使用IndexedDB缓存数据，支持离线使用

## 技术架构

- **前端**：React + TypeScript + Vite
- **后端**：Node.js + Express + TypeScript
- **数据存储**：GitHub私人仓库 + IndexedDB
- **AI集成**：OpenAI API
- **状态管理**：React Context + 本地存储

## 项目结构

```
flashcard-app/
├── frontend/                 # 前端React应用
│   ├── src/
│   │   ├── components/       # React组件
│   │   ├── services/         # API和服务
│   │   └── tests/           # 测试文件
│   └── package.json
├── backend/                  # 后端Node.js应用
│   ├── src/
│   │   ├── server/          # 服务器文件
│   │   ├── routes/          # API路由
│   │   └── middleware/      # 中间件
│   └── package.json
└── shared/                   # 共享类型和工具
```

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

### 后端

```bash
cd backend
npm install
npm run dev
```

## 环境配置

创建 `.env` 文件：

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

## 使用说明

1. **闪卡功能**：
   - 点击"闪卡"标签查看所有闪卡
   - 点击闪卡可以翻转查看答案
   - 使用编辑和删除按钮管理闪卡

2. **工作记录**：
   - 点击"工作记录"标签查看记录
   - 记录支持富文本和超链接

3. **计划模式**：
   - 点击"计划模式"标签管理计划
   - 使用AI生成计划建议
   - 设置计划优先级和截止日期

4. **GitHub集成**：
   - 通过OAuth认证连接GitHub
   - 数据自动同步到私人仓库
   - 支持备份和恢复

5. **AI功能**：
   - 生成每日计划建议
   - 优化内容质量
   - 自动生成闪卡内容

## 开发指南

### 添加新功能

1. 在相应组件目录下创建新组件
2. 在services目录下添加相关服务
3. 更新主App组件整合新功能
4. 添加必要的测试

### 贡献

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 许可证

MIT License

## 联系方式

如有问题，请提交Issue或联系维护者。