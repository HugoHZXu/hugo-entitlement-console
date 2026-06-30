# 架构说明

[English](architecture.md) | [简体中文](architecture.zh-CN.md)

本文档概述 Hugo Entitlement Console 的整体架构。

## 概述

Hugo Entitlement Console 是一个独立的 Vue 3 + Tailwind CSS 应用，配合本地后端（[hugo-saas-backend](https://github.com/HugoHZXu/hugo-saas-backend)）提供身份认证和授权服务。

## 技术栈

- Vue 3 + TypeScript，使用 Vite 作为构建工具
- Vue Router 处理客户端路由
- Pinia 管理客户端状态（会话、筛选条件）
- TanStack Vue Query 管理服务端状态和缓存
- TanStack Table（通过封装的 DataGrid 组件使用）
- `@hugo-ui/shadcn-vue` UI 组件库（来自外部 [hugo-ui](https://github.com/HugoHZXu/hugo-ui) 仓库）
- vue-i18n 提供中英文双语支持
- Vitest 用于单元测试，Playwright 用于端到端测试

## 路由

所有路由在主布局 `src/layouts/AppLayout.vue` 中渲染。

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | — | 重定向到 `/products` |
| `/products` | `ProductListPage` | 产品目录 |
| `/products/:productId` | `ProductDetailPage` | 产品详情，包含授权汇总和操作记录 |
| `/products/:productId/allocated-users` | `AllocatedUsersPage` | 产品的席位分配管理 |
| `/activity-log` | `ActivityLogPage` | 全局审计日志 |

## 目录结构

```
src/
  app/          应用入口、全局配置、全局样式、国际化
  routes/       Vue Router 路由配置
  layouts/      主布局
  pages/        页面组件
  features/     功能模块（组合式函数、组件、状态、样式）
  shared/
    api/        API 客户端（GraphQL + REST）
    config/     服务地址和查询键定义
    mocks/      测试和回退用的合成数据
    stores/     全局 Pinia 状态
    types/      共享 TypeScript 类型
    utils/      工具函数
```

代码采用基于功能模块的组织方式。页面组件组合功能模块，功能模块中的组合式函数调用共享 API 客户端，而非直接接触网络传输层。

## 后端集成

开发时应用连接以下本地服务：

| 服务 | 默认地址 | 用途 |
|------|---------|------|
| Identity Service | `http://127.0.0.1:4320` | 演示账号、认证 token、`/userinfo` |
| Entitlement Service (GraphQL) | `http://127.0.0.1:4317/graphql` | 读取查询（产品、授权、操作日志） |
| Entitlement Service (REST) | `http://127.0.0.1:4317` | 写入命令（席位分配变更） |

通过环境变量配置服务地址：

```bash
VITE_IDENTITY_SERVICE_URL=http://127.0.0.1:4320
VITE_ENTITLEMENT_GRAPHQL_URL=http://127.0.0.1:4317/graphql
VITE_ENTITLEMENT_REST_URL=http://127.0.0.1:4317
```

所有授权请求都会自动携带当前演示账号的 token，并且数据范围限定在选中的组织内。

## 数据流

应用采用分层架构：

1. **页面层**：根据路由参数渲染 UI，调用功能模块的组合式函数。
2. **组合式函数**（如 `useProductQuery`、`useActivityLogsQuery`）：通过 TanStack Vue Query 调用共享 API 客户端获取数据，查询范围按当前账号和组织隔离。
3. **API 客户端**（`src/shared/api/`）：负责 GraphQL 查询、REST 命令、请求认证和响应规范化。
4. **缓存层**（TanStack Vue Query）：缓存查询结果，变更后自动失效过期数据，保持各视图同步。

草稿状态（如保存前的用户选择）保留在页面组件本地，持久化状态存储在后端。

## 领域模型

核心业务类型：

- **Product**：产品目录项，包含状态、供应方、使用维度和元数据。
- **Entitlement**：按产品和使用维度划分的数量记录（如许可席位）。
- **ProductEntitlementSummary**：单个产品的已购、已分配和可用席位汇总。
- **AllocatedUser**：已分配到产品席位上的用户。
- **UserAccessRow**：可分配用户及其当前分配状态。
- **ActivityLogEntry**：规范化后的审计日志条目，包含产品上下文、操作者信息和本地化显示文本。

## 状态管理

应用中存在两类状态：

- **服务端状态**（产品、授权、分配、操作日志）由 TanStack Vue Query 管理。缓存键按账号和组织隔离，切换上下文时自动重新获取新范围下的数据。
- **客户端状态**（会话信息、选中组织、搜索/筛选偏好）由 Pinia 管理。
- 临时 UI 状态（草稿选择、开关状态）保留在组件本地。

## 测试

- **单元测试**（Vitest）覆盖工具函数、组合式函数、状态逻辑和 API 客户端。
- **端到端测试**（Playwright）在真实浏览器中覆盖主要产品工作流。

运行 `pnpm run verify` 可执行完整校验流程（类型检查 + 代码检查 + 单元测试 + 构建）。
