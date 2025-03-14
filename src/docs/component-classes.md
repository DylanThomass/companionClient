# Companion 组件类参考文档

本文档提供了项目中所有语义化组件类的详细说明，帮助开发者快速查找和使用这些类。

## 按钮类

### 新系统按钮

| 类名               | 对应样式     | 用途                               |
| ------------------ | ------------ | ---------------------------------- |
| `button-base`      | 基础按钮样式 | 所有按钮的基础样式                 |
| `button-primary`   | 主题色按钮   | 主要操作按钮，薄荷绿背景 (#14b8a6) |
| `button-secondary` | 次要按钮     | 次要操作按钮，白色背景，主题色边框 |
| `button-success`   | 成功按钮     | 成功操作按钮，绿色背景 (#22c55e)   |
| `button-warning`   | 警告按钮     | 警告操作按钮，橙色背景 (#f59e0b)   |
| `button-danger`    | 危险按钮     | 危险操作按钮，红色背景 (#ef4444)   |
| `button-wechat`    | 微信按钮     | 微信登录按钮，微信绿背景 (#07c160) |

### 旧系统按钮

| 类名            | 对应样式     | 用途                                   |
| --------------- | ------------ | -------------------------------------- |
| `btn-base`      | 基础按钮样式 | 所有旧按钮的基础样式                   |
| `btn-primary`   | 主要按钮     | 主要操作按钮，品牌色背景 (brand-500)   |
| `btn-secondary` | 次要按钮     | 次要操作按钮，浅品牌色背景 (brand-200) |
| `btn-wechat`    | 微信按钮     | 微信登录按钮，微信绿背景 (#07c160)     |

## 卡片类

### 新系统卡片

| 类名             | 对应样式 | 用途                         |
| ---------------- | -------- | ---------------------------- |
| `ds-card`        | 基础卡片 | 白色背景，圆角，阴影，内边距 |
| `ds-card-header` | 卡片头部 | 卡片标题区域样式             |
| `ds-card-icon`   | 卡片图标 | 卡片中图标的样式             |

### 旧系统卡片

| 类名   | 对应样式 | 用途                 |
| ------ | -------- | -------------------- |
| `card` | 基础卡片 | 白色背景，圆角，阴影 |

## 页面容器类

### 新系统容器

| 类名              | 对应样式     | 用途                               |
| ----------------- | ------------ | ---------------------------------- |
| `ds-page`         | 页面容器     | 最外层页面容器，设置最小高度和背景 |
| `ds-content`      | 内容容器     | 内容区域容器，设置内边距和间距     |
| `ds-fixed-bottom` | 底部固定容器 | 固定在页面底部的容器               |

### 旧系统容器

| 类名             | 对应样式 | 用途                               |
| ---------------- | -------- | ---------------------------------- |
| `page-container` | 页面容器 | 最外层页面容器，设置最小高度和背景 |

## 表单元素类

### 新系统表单

| 类名              | 对应样式     | 用途                 |
| ----------------- | ------------ | -------------------- |
| `ds-radio-group`  | 单选框组     | 单选框组容器样式     |
| `ds-radio`        | 单选框       | 单选框基础样式       |
| `ds-radio-active` | 激活的单选框 | 选中状态的单选框样式 |

## 实用工具类

| 类名               | 对应样式     | 用途               |
| ------------------ | ------------ | ------------------ |
| `text-truncate`    | 单行文本截断 | 超出部分显示省略号 |
| `text-truncate-2`  | 两行文本截断 | 超出两行显示省略号 |
| `safe-bottom`      | 安全底部     | 适配底部安全区域   |
| `no-click`         | 禁止点击     | 禁用点击事件       |
| `gradient-primary` | 主题渐变     | 主题色渐变背景     |

## 颜色对照表

### 主题色系列

| 变量名              | 颜色值  | Tailwind 类        | 旧系统对应     |
| ------------------- | ------- | ------------------ | -------------- |
| `--c-primary`       | #14b8a6 | `bg-primary`       | `bg-brand-500` |
| `--c-primary-light` | #2dd4bf | `bg-primary-light` | `bg-brand-400` |
| `--c-primary-dark`  | #0d9488 | `bg-primary-dark`  | `bg-brand-600` |

### 功能色系列

| 变量名        | 颜色值  | Tailwind 类  | 旧系统对应 |
| ------------- | ------- | ------------ | ---------- |
| `--c-success` | #22c55e | `bg-success` | -          |
| `--c-warning` | #f59e0b | `bg-warning` | -          |
| `--c-danger`  | #ef4444 | `bg-danger`  | -          |
| `--c-info`    | #3b82f6 | `bg-info`    | -          |

### 文本色系列

| 变量名                 | 颜色值  | Tailwind 类             | 旧系统对应         |
| ---------------------- | ------- | ----------------------- | ------------------ |
| `--c-text-primary`     | #27272a | `text-text-primary`     | `text-surface-800` |
| `--c-text-regular`     | #52525b | `text-text-regular`     | `text-surface-600` |
| `--c-text-secondary`   | #71717a | `text-text-secondary`   | `text-surface-500` |
| `--c-text-placeholder` | #a1a1aa | `text-text-placeholder` | `text-surface-400` |

### 背景和边框色

| 变量名                 | 颜色值  | Tailwind 类           | 旧系统对应           |
| ---------------------- | ------- | --------------------- | -------------------- |
| `--c-background`       | #ffffff | `bg-background`       | `bg-white`           |
| `--c-background-light` | #fafafa | `bg-background-light` | `bg-surface-50`      |
| `--c-border`           | #e4e4e7 | `border-border`       | `border-surface-200` |
| `--c-border-light`     | #f4f4f5 | `border-border-light` | `border-surface-100` |

## 使用建议

1. **新项目或新组件**：优先使用新系统的语义化类名
2. **维护旧代码**：可以继续使用旧系统类名，或逐步迁移到新系统
3. **混合使用**：可以混合使用两种系统，但同一组件内尽量保持一致

## 类名选择指南

### 何时使用语义化类名

- 构建可复用组件时
- 需要统一样式时
- 样式可能会随设计系统变化时

### 何时使用原子类

- 需要快速实现一次性样式时
- 需要直观了解具体样式值时
- 进行原型设计时

## 示例

### 按钮示例

```html
<!-- 新系统按钮 -->
<button class="button-primary">主要按钮</button>
<button class="button-secondary">次要按钮</button>

<!-- 旧系统按钮 -->
<button class="btn-primary">主要按钮</button>
<button class="btn-secondary">次要按钮</button>

<!-- 使用 Vant 组件 -->
<van-button class="button-primary">Vant 按钮</van-button>
```

### 卡片示例

```html
<!-- 新系统卡片 -->
<div class="ds-card">
  <div class="ds-card-header">卡片标题</div>
  <p>卡片内容</p>
</div>

<!-- 旧系统卡片 -->
<div class="card">
  <div class="text-surface-800 font-medium mb-2">卡片标题</div>
  <p>卡片内容</p>
</div>
```

### 页面容器示例

```html
<!-- 新系统页面 -->
<div class="ds-page">
  <div class="ds-content">
    <!-- 页面内容 -->
  </div>
  <div class="ds-fixed-bottom">
    <!-- 底部按钮 -->
  </div>
</div>

<!-- 旧系统页面 -->
<div class="page-container">
  <!-- 页面内容 -->
</div>
```
