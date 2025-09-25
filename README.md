# 舌诊面诊中医智能诊断系统

这是一个基于React和TypeScript的中医智能诊断系统，结合了舌诊和面诊功能，为用户提供个性化的中医健康咨询服务。

## 功能特点

- 面部特征分析与健康评估
- 舌象诊断与体质分析
- 中医智能聊天助手
- 个性化健康建议与调理方案
- 中药知识库查询

## 本地开发

### 环境准备

- 安装 [Node.js](https://nodejs.org/en)
- 安装 [pnpm](https://pnpm.io/installation)

### 操作步骤

1. 克隆项目到本地
2. 安装依赖

```sh
pnpm install
```

3. 启动开发服务器

```sh
pnpm dev
```

4. 在浏览器访问 http://localhost:3000

## 构建部署

要构建生产版本，运行以下命令：

```sh
pnpm build
```

构建后的文件将位于 `dist` 目录中，可以部署到任何静态文件服务器上。

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Framer Motion (动画效果)
- React Router (路由管理)
