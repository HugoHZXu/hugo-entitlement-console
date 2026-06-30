# Hugo Entitlement Console

[English](README.md) | [简体中文](README.zh-CN.md)

一个基于 Vue 3 的 B2B 产品授权管理控制台作品集项目，使用现代 Vue 3 + TypeScript 技术栈构建，涵盖产品目录、席位分配和审计日志等功能。

## 快速开始

本项目需要配合本地后端服务运行。完整 demo 启动步骤：

```bash
# 1. 启动后端（在 hugo-saas-backend 目录下）
git clone https://github.com/HugoHZXu/hugo-saas-backend.git
cd hugo-saas-backend
pnpm install
pnpm run db:reset
pnpm run dev:services

# 2. 启动前端（在本项目目录下）
cd ../entitlement-console-portfolio
pnpm install
pnpm run dev
```

后端默认运行在以下端口：

| 服务 | 地址 |
|------|------|
| Identity Service | `http://127.0.0.1:4320` |
| Entitlement Service (GraphQL) | `http://127.0.0.1:4317/graphql` |
| Entitlement Service (REST) | `http://127.0.0.1:4317` |

> **注：** 本项目所有演示数据均为合成数据，不包含任何真实客户信息。

## 功能特性

- **产品目录** — 浏览产品列表，展示状态、供应方、支持平台、使用维度和授权元数据。
- **账号切换** — 在不同演示账号之间切换，体验不同组织和权限范围。
- **产品详情** — 查看授权汇总、席位使用情况和产品级操作记录。
- **席位分配** — 管理指定用户的席位分配，支持搜索、草稿选择和容量校验。
- **操作日志** — 审计日志支持分页、搜索、排序和多语言消息。
- **国际化** — 通过 `vue-i18n` 提供完整的中英文界面。

## 截图

### 产品列表

产品主界面，展示所有可用产品及其状态和元数据。

![Products page](docs/images/products.png)

### 产品详情

选中产品的授权汇总、席位使用情况和近期操作记录。

![Product detail page](docs/images/product-detail.png)

### 席位分配

席位管理界面，支持搜索、多选和保存前的容量检查。

![Allocated users page](docs/images/allocated-users.png)

### 操作日志

全局审计日志，支持跨产品的筛选、排序和分页。

![Activity Log page](docs/images/activity-log.png)

## 技术栈

- **框架：** Vue 3 + TypeScript、Vite
- **路由：** Vue Router
- **状态管理：** Pinia（客户端状态）、TanStack Vue Query（服务端状态）
- **表格：** TanStack Table（通过 DataGrid 组件使用）
- **样式：** Tailwind CSS v4、`@hugo-ui/shadcn-vue` 组件库
- **国际化：** vue-i18n
- **测试：** Vitest（单元测试）、Playwright（端到端测试）
- **工具：** ESLint、Prettier、pnpm

## 相关项目

- [hugo-saas-backend](https://github.com/HugoHZXu/hugo-saas-backend) — 配套本地后端，提供身份认证和授权服务。
- [hugo-ui](https://github.com/HugoHZXu/hugo-ui) — 外部设计系统，提供 `@hugo-ui/shadcn-vue` 组件库。
- [hugo-saas-console](https://github.com/HugoHZXu/hugo-saas-console) — 同系列的 SaaS 管理控制台前端。

## 本地开发

**环境要求：** Node.js `>=22.12.0`、pnpm `>=10.34.1`

```bash
pnpm install
pnpm run dev
```

常用命令：

```bash
pnpm run typecheck    # 类型检查
pnpm run lint         # ESLint 代码检查
pnpm run test         # 单元测试（Vitest）
pnpm run test:e2e     # 端到端测试（Playwright）
pnpm run build        # 生产构建
pnpm run verify       # 完整校验（typecheck + lint + test + build）
```

### 本地链接设计系统

如需对接本地克隆的 `hugo-ui` 仓库进行开发：

```bash
pnpm run setup:local-hugo-ui
pnpm run verify:hugo-ui
```

## 项目结构

```
src/
  app/          应用入口、全局配置、全局样式、国际化
  routes/       Vue Router 路由配置
  layouts/      主布局
  pages/        页面组件
  features/     功能模块（组合式函数、组件、状态、样式）
  shared/       共享 API、配置、状态、类型和工具函数
```

架构相关细节请参阅 [docs/architecture.zh-CN.md](docs/architecture.zh-CN.md)。

## 文档

- [Architecture Overview](docs/architecture.md) (EN) | [架构说明](docs/architecture.zh-CN.md) (中文)

## 许可证

MIT
