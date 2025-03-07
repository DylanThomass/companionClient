# Companion 样式系统指南

## 目录

1. [介绍](#介绍)
2. [设计令牌系统](#设计令牌系统)
3. [新样式系统](#新样式系统)
4. [旧样式系统](#旧样式系统)
5. [迁移指南](#迁移指南)
6. [最佳实践](#最佳实践)
7. [常见问题](#常见问题)

## 介绍

Companion 应用目前同时存在两套样式系统：

- **新系统**：基于设计令牌（Design Tokens）的语义化命名系统，推荐在新开发中使用
- **旧系统**：使用 `surface-*`、`brand-*` 等命名的系统，将逐步迁移到新系统

本文档旨在帮助开发者理解这两套系统，并提供平滑迁移的指导。

## 设计令牌系统

设计令牌是我们设计系统的基础，它们定义在 CSS 变量中，并通过 Tailwind 配置映射为可用的类名。

### 颜色令牌

```css
/* 主题色 */
--c-primary: #14b8a6;
--c-primary-light: #2dd4bf;
--c-primary-dark: #0d9488;

/* 功能色 */
--c-success: #22c55e;
--c-warning: #f59e0b;
--c-danger: #ef4444;
--c-info: #3b82f6;

/* 文本色 */
--c-text-primary: #27272a;
--c-text-regular: #52525b;
--c-text-secondary: #71717a;
--c-text-placeholder: #a1a1aa;

/* 边框和背景色 */
--c-border: #e4e4e7;
--c-border-light: #f4f4f5;
--c-background: #ffffff;
--c-background-light: #fafafa;
```

### 间距令牌

```css
--s-base: 4px;
--s-xs: 8px;
--s-sm: 12px;
--s-md: 16px;
--s-lg: 24px;
--s-xl: 32px;
```

### 圆角令牌

```css
--r-sm: 8px;
--r-md: 12px;
--r-lg: 16px;
--r-full: 9999px;
```

### 字体令牌

```css
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
```

### 动画令牌

```css
--duration-fast: 0.2s;
--duration-base: 0.3s;
--duration-slow: 0.4s;
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

### 阴影令牌

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

## 新样式系统

新样式系统基于设计令牌，使用语义化的命名，更加直观和一致。

### 颜色类

```html
<!-- 背景色 -->
<div class="bg-primary">主题色背景</div>
<div class="bg-primary-light">浅主题色背景</div>
<div class="bg-primary-dark">深主题色背景</div>
<div class="bg-success-500">成功状态背景</div>
<div class="bg-warning-500">警告状态背景</div>
<div class="bg-danger-500">危险状态背景</div>
<div class="bg-info-500">信息状态背景</div>
<div class="bg-background">标准背景</div>
<div class="bg-background-light">浅色背景</div>

<!-- 文本色 -->
<p class="text-text-primary">主要文本</p>
<p class="text-text-regular">常规文本</p>
<p class="text-text-secondary">次要文本</p>
<p class="text-text-placeholder">占位符文本</p>
<p class="text-primary">主题色文本</p>

<!-- 边框色 -->
<div class="border border-border">标准边框</div>
<div class="border border-border-light">浅色边框</div>
<div class="border border-primary">主题色边框</div>
```

### 间距类

```html
<!-- 内边距 -->
<div class="p-xs">超小内边距 (8px)</div>
<div class="p-sm">小内边距 (12px)</div>
<div class="p-md">中等内边距 (16px)</div>
<div class="p-lg">大内边距 (24px)</div>
<div class="p-xl">超大内边距 (32px)</div>

<!-- 外边距 -->
<div class="m-xs">超小外边距</div>
<div class="m-sm">小外边距</div>
<div class="m-md">中等外边距</div>
<div class="m-lg">大外边距</div>
<div class="m-xl">超大外边距</div>

<!-- 间隙 -->
<div class="gap-xs">超小间隙</div>
<div class="gap-sm">小间隙</div>
<div class="gap-md">中等间隙</div>
<div class="gap-lg">大间隙</div>
<div class="gap-xl">超大间隙</div>
```

### 圆角类

```html
<div class="rounded-sm">小圆角 (8px)</div>
<div class="rounded-md">中圆角 (12px)</div>
<div class="rounded-lg">大圆角 (16px)</div>
<div class="rounded-full">完全圆形</div>
```

### 字体类

```html
<p class="text-xs">超小文本 (12px)</p>
<p class="text-sm">小文本 (14px)</p>
<p class="text-base">基础文本 (16px)</p>
<p class="text-lg">大文本 (18px)</p>
<p class="text-xl">超大文本 (20px)</p>
```

### 预定义组件类

#### 按钮

```html
<!-- 基础按钮 -->
<button class="button-base">基础按钮</button>

<!-- 主要按钮 -->
<button class="button-primary">主要按钮</button>

<!-- 次要按钮 -->
<button class="button-secondary">次要按钮</button>

<!-- 功能按钮 -->
<button class="button-success">成功按钮</button>
<button class="button-warning">警告按钮</button>
<button class="button-danger">危险按钮</button>

<!-- 微信登录按钮 -->
<button class="button-wechat">微信登录</button>
```

#### 卡片

```html
<div class="ds-card">
  <div class="ds-card-header">
    <div class="ds-card-icon">
      <van-icon name="star" />
    </div>
    <span>卡片标题</span>
  </div>
  <p>卡片内容</p>
</div>
```

#### 单选按钮

```html
<div class="ds-radio-group">
  <div
    class="ds-radio"
    :class="{ 'ds-radio-active': selected === 'option1' }"
    @click="selected = 'option1'"
  >
    <span>选项一</span>
  </div>
  <div
    class="ds-radio"
    :class="{ 'ds-radio-active': selected === 'option2' }"
    @click="selected = 'option2'"
  >
    <span>选项二</span>
  </div>
</div>
```

#### 布局组件

```html
<div class="ds-page">
  <div class="ds-content">
    <!-- 页面内容 -->
  </div>
  <div class="ds-fixed-bottom">
    <!-- 底部按钮 -->
  </div>
</div>
```

### 工具类

```html
<!-- 文本截断 -->
<p class="text-truncate">单行文本截断...</p>
<p class="text-truncate-2">多行文本截断...</p>

<!-- 安全区域 -->
<div class="safe-bottom">适配全面屏底部</div>

<!-- 禁用点击 -->
<button class="no-click">禁用状态</button>

<!-- 渐变背景 -->
<div class="gradient-primary">渐变背景</div>
```

## 旧样式系统

旧样式系统使用不同的命名约定，将逐步迁移到新系统。

### 颜色类

```html
<!-- 背景色 -->
<div class="bg-surface-50">最浅灰色背景</div>
<div class="bg-surface-100">浅灰色背景</div>
<div class="bg-surface-800">深色背景</div>
<div class="bg-surface-900">最深色背景</div>

<div class="bg-brand-500">品牌色背景</div>
<div class="bg-brand-600">深品牌色背景</div>

<!-- 文本色 -->
<p class="text-surface-800">深色文本</p>
<p class="text-surface-600">中等文本</p>
<p class="text-surface-400">浅色文本</p>

<p class="text-brand-500">品牌色文本</p>

<!-- 边框色 -->
<div class="border border-surface-100">浅色边框</div>
<div class="border border-surface-200">中等边框</div>
<div class="border border-brand-500">品牌色边框</div>
```

### 按钮类

```html
<!-- 基础按钮 -->
<button class="btn-base">基础按钮</button>

<!-- 主要按钮 -->
<button class="btn-primary">主要按钮</button>

<!-- 次要按钮 -->
<button class="btn-secondary">次要按钮</button>

<!-- 微信按钮 -->
<button class="btn-wechat">微信登录</button>
```

### 其他类

```html
<!-- 页面容器 -->
<div class="page-container">页面内容</div>

<!-- 卡片 -->
<div class="card">卡片内容</div>

<!-- 文本阴影 -->
<p class="text-shadow">带阴影的文本</p>
```

### 圆角和字体

```html
<!-- 圆角 -->
<div class="rounded-design">设计圆角 (16px)</div>
<div class="rounded-design-sm">小设计圆角 (12px)</div>

<!-- 字体大小 -->
<p class="text-assist">辅助文本 (0.75rem)</p>
<p class="text-body">正文文本 (1rem)</p>
<p class="text-title">标题文本 (1.25rem)</p>
<p class="text-headline">大标题文本 (1.5rem)</p>
```

## 迁移指南

为了平滑迁移到新系统，请遵循以下步骤：

### 1. 颜色迁移

| 旧系统             | 新系统                | 说明       |
| ------------------ | --------------------- | ---------- |
| `bg-surface-50`    | `bg-background-light` | 浅色背景   |
| `bg-surface-100`   | `bg-border-light`     | 浅边框色   |
| `bg-surface-800`   | `bg-text-primary`     | 深色文本   |
| `text-surface-400` | `text-text-secondary` | 次要文本   |
| `text-surface-600` | `text-text-regular`   | 常规文本   |
| `text-surface-800` | `text-text-primary`   | 主要文本   |
| `bg-brand-500`     | `bg-primary`          | 主题色     |
| `text-brand-500`   | `text-primary`        | 主题色文本 |
| `border-brand-500` | `border-primary`      | 主题色边框 |

### 2. 按钮迁移

| 旧系统          | 新系统             | 说明         |
| --------------- | ------------------ | ------------ |
| `btn-primary`   | `button-primary`   | 主要按钮     |
| `btn-secondary` | `button-secondary` | 次要按钮     |
| `btn-wechat`    | `button-wechat`    | 微信登录按钮 |

### 3. 布局迁移

| 旧系统           | 新系统                   | 说明     |
| ---------------- | ------------------------ | -------- |
| `page-container` | `ds-page` + `ds-content` | 页面容器 |
| `card`           | `ds-card`                | 卡片组件 |

### 4. 其他迁移

| 旧系统              | 新系统       | 说明     |
| ------------------- | ------------ | -------- |
| `rounded-design`    | `rounded-lg` | 大圆角   |
| `rounded-design-sm` | `rounded-md` | 中圆角   |
| `text-headline`     | `text-xl`    | 大标题   |
| `text-title`        | `text-lg`    | 标题     |
| `text-body`         | `text-base`  | 正文     |
| `text-assist`       | `text-xs`    | 辅助文本 |

## 最佳实践

### 1. 使用语义化类名

优先使用语义化的类名，如 `bg-primary` 而非 `bg-[#14b8a6]`。

```html
<!-- 推荐 -->
<div class="bg-primary text-white"></div>

<!-- 不推荐 -->
<div class="bg-[#14b8a6] text-[#ffffff]"></div>
```

### 2. 组合使用原子类

Tailwind 的强大之处在于组合使用原子类，避免创建过多自定义类。

```html
<!-- 推荐 -->
<div class="bg-background rounded-lg p-md shadow-sm"></div>

<!-- 不推荐为每种组合创建新类 -->
<div class="custom-container"></div>
```

### 3. 使用预定义组件类

对于常见的 UI 模式，使用预定义的组件类。

```html
<!-- 推荐 -->
<div class="ds-card">
  <div class="ds-card-header">标题</div>
  <p>内容</p>
</div>

<!-- 不推荐重复定义相同的样式组合 -->
<div class="bg-background rounded-lg p-md shadow-sm">
  <div class="flex items-center font-medium mb-md">标题</div>
  <p>内容</p>
</div>
```

### 4. 避免使用透明度修饰符

避免使用 Tailwind 的透明度修饰符（如 `bg-primary/10`），而是使用预定义的颜色或 CSS 属性。

```html
<!-- 推荐 -->
<div class="bg-primary-light opacity-50"></div>
<!-- 或 -->
<div style="background-color: rgba(20, 184, 166, 0.1);"></div>

<!-- 不推荐 -->
<div class="bg-primary/10"></div>
```

### 5. 使用 @apply 抽象复杂样式

对于重复使用的复杂样式组合，使用 @apply 抽象为组件类。

```css
.custom-button {
  @apply bg-primary text-white rounded-lg px-md py-sm transition-all duration-fast;
}
```

## 常见问题

### 1. 我应该使用哪套系统？

- **新项目或新组件**：优先使用新系统
- **维护旧组件**：可以继续使用旧系统，或逐步迁移到新系统
- **混合使用**：两套系统可以混合使用，但同一组件内尽量保持一致

### 2. 如何处理透明度？

避免使用 Tailwind 的透明度修饰符（如 `bg-primary/10`），而是：

- 使用预定义的浅色变体（如 `bg-primary-light`）
- 使用 `opacity-` 类调整整个元素的透明度
- 使用 rgba 颜色值（如 `style="background-color: rgba(20, 184, 166, 0.1);"`）

### 3. 如何自定义样式？

- **优先使用设计令牌**：通过 Tailwind 类使用设计令牌
- **组合使用原子类**：利用 Tailwind 的组合能力
- **创建组件类**：对于重复的样式组合，创建组件类
- **使用 CSS 变量**：直接使用 CSS 变量进行自定义

```css
.custom-element {
  background-color: var(--c-primary);
  padding: var(--s-md);
  border-radius: var(--r-lg);
}
```

### 4. 我找不到对应的类怎么办？

如果找不到所需的类，可以：

1. 查看 Tailwind 文档，了解可用的原子类
2. 查看 `tailwind.config.js`，了解自定义的扩展
3. 查看 `design-tokens.css`，了解可用的设计令牌
4. 创建自定义类或使用内联样式

### 5. 如何确保样式一致性？

- 使用设计令牌和预定义组件类
- 遵循最佳实践
- 进行代码审查，确保遵循规范
- 使用 Storybook 或设计系统文档作为参考
