# Companion Client

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.2-42b883" alt="Vue 3.2">
  <img src="https://img.shields.io/badge/Vant-4.8-blue" alt="Vant 4.8">
  <img src="https://img.shields.io/badge/TailwindCSS-3.3-38bdf8" alt="TailwindCSS 3.3">
  <img src="https://img.shields.io/badge/Pinia-2.1-yellow" alt="Pinia 2.1">
  <img src="https://img.shields.io/badge/version-0.1.0-orange" alt="Version 0.1.0">
</p>

## 项目介绍

Companion Client 是一个基于 Vue 3 开发的情感陪伴类微信 H5 应用，旨在提供温暖治愈的在线情感咨询服务。项目采用 Composition API 开发，结合 Vant 4 组件库和 TailwindCSS 实现了美观且功能丰富的用户界面。

### 设计风格

- **治愈系·低信息密度·情绪可视化**
- 暖色调设计，统一圆角系统
- 流畅的交互动画效果
- 微信环境适配优化

## 技术栈

- **前端框架**: Vue 3.2 (Composition API)
- **状态管理**: Pinia 2.1 + 持久化存储
- **UI 组件库**: Vant 4.8
- **CSS 框架**: TailwindCSS 3.3
- **路由管理**: Vue Router 4
- **HTTP 请求**: Axios 1.6
- **微信集成**: weixin-js-sdk 1.6
- **构建工具**: Vue CLI 5

## 项目结构

```
src/
├── api/          # API 接口定义
├── assets/       # 静态资源文件
├── components/   # 公共组件
│   ├── hall/     # 大厅相关组件
│   ├── order/    # 订单相关组件
│   └── user/     # 用户相关组件
├── composables/  # 组合式函数
├── layouts/      # 布局组件
├── mock/         # 模拟数据
├── router/       # 路由配置
├── store/        # Pinia 状态管理
│   └── modules/  # 状态模块
├── styles/       # 全局样式
├── utils/        # 工具函数
│   └── wx-sdk.js # 微信 SDK 封装
└── views/        # 页面组件
    ├── Login.vue       # 登录页
    ├── OrderDetail.vue # 订单详情
    ├── OrderList.vue   # 订单列表
    ├── SellerHall.vue  # 店员大厅
    ├── UserEdit.vue    # 用户编辑
    ├── UserInfo.vue    # 用户信息
    └── WxAuth.vue      # 微信授权
```

## 功能特性

- **微信授权登录**: 支持微信 OAuth 授权登录
- **个人中心**: 用户资料展示与编辑
- **店员大厅**: 浏览和筛选店员信息
- **订单管理**: 创建、查看和管理订单
- **标签系统**: 个性化标签选择与展示
- **响应式设计**: 适配各种移动设备屏幕

## 开发指南

### 环境要求

- Node.js 18.x
- pnpm >= 6.0.0

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

```bash
pnpm run serve
```

### 生产环境构建

```bash
pnpm run build
```

### 代码检查与修复

```bash
pnpm run lint
```

## 微信开发配置

### 配置说明

1. 在 `.env.development` 和 `.env.production` 文件中配置微信相关参数:

```
VUE_APP_WX_APP_ID=your_app_id
VUE_APP_WX_REDIRECT_URI=your_redirect_uri
```

2. 确保服务器域名已在微信公众平台完成备案

### 常见问题

- **微信授权失败**: 检查 AppID 和授权回调域名配置
- **JS-SDK 接口调用失败**: 确认 JS 安全域名设置和签名生成是否正确

## 部署说明

1. 执行构建命令生成静态文件:

```bash
pnpm run build
```

2. 将 `dist` 目录下的文件部署到支持 HTTPS 的 Web 服务器

3. 配置服务器支持 HTML5 History 模式的路由重定向

## 浏览器兼容性

- iOS Safari >= 10
- Android Chrome >= 67
- 微信内置浏览器 >= 7.0

## 许可证

[MIT](LICENSE)
