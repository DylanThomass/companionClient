# Companion 样式指南

## 1. 核心配置

### 1.1 Tailwind 配置 (tailwind.config.js)

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  important: true, // 关键：提升 Tailwind 样式优先级，用于覆盖 Vant
  corePlugins: {
    preflight: false, // 关键：禁用 Tailwind 重置样式，避免与 Vant 冲突
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: "hsl(42, 15%, 95%)", // 背景色
          100: "hsl(42, 15%, 90%)",
          200: "hsl(42, 15%, 80%)",
          300: "hsl(18, 82%, 75%)", // 主色调浅色
          400: "hsl(18, 82%, 65%)", // 主色调
          500: "hsl(18, 82%, 55%)", // 主色调深色
        },
        surface: {
          50: "hsl(0, 0%, 98%)", // 卡片背景
          100: "hsl(0, 0%, 96%)", // 次要背景
          200: "hsl(0, 0%, 93%)", // 边框色
          300: "hsl(0, 0%, 88%)",
          400: "hsl(0, 0%, 74%)",
          500: "hsl(0, 0%, 62%)", // 次要文字
          600: "hsl(0, 0%, 46%)", // 主要文字
          700: "hsl(0, 0%, 38%)",
          800: "hsl(0, 0%, 26%)",
          900: "hsl(0, 0%, 13%)",
        },
      },
      borderRadius: {
        design: "16px", // 更大的圆角
        "design-sm": "12px", // 小组件圆角
      },
      fontSize: {
        assist: "0.75rem",
        body: "1rem",
        title: "1.25rem",
        headline: "1.5rem",
      },
    },
  },
};
```

### 1.2 PostCSS 配置 (postcss.config.js)

```javascript
module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-px-to-viewport-8-plugin")({
      viewportWidth: 375, // 基准视口宽度
    }),
  ],
};
```

## 2. 基础样式系统

### 2.1 色彩系统

- **品牌色系 (brand)**

  - brand-50: 背景色 (hsl(42, 15%, 95%))
  - brand-300: 主色调浅色 (hsl(18, 82%, 75%))
  - brand-400: 主色调 (hsl(18, 82%, 65%))
  - brand-500: 主色调深色 (hsl(18, 82%, 55%))

- **中性色系 (surface)**
  - surface-50: 卡片背景 (hsl(0, 0%, 98%))
  - surface-100: 次要背景 (hsl(0, 0%, 96%))
  - surface-200: 边框色 (hsl(0, 0%, 93%))
  - surface-500: 次要文字 (hsl(0, 0%, 62%))
  - surface-600: 主要文字 (hsl(0, 0%, 46%))
  - surface-800: 深色按钮 (hsl(0, 0%, 26%))
  - surface-900: 最深色 (hsl(0, 0%, 13%))

### 2.2 字体系统

```css
fontSize: {
  assist: "0.75rem",    // 辅助文字
  body: "1rem",         // 正文
  title: "1.25rem",     // 标题
  headline: "1.5rem",   // 大标题
}
```

### 2.3 圆角系统

```css
borderRadius: {
  design: "16px",      // 大组件圆角
  "design-sm": "12px", // 小组件圆角
}
```

### 2.4 间距系统

- 页面外边距：`px-6 py-12`
- 组件间距：`space-y-8`
- 内部间距：`p-8`（大区块）、`p-4`（小区块）

## 3. 组件样式指南

### 3.1 按钮样式

```css
/* 预定义按钮样式类 */
.btn-base {
  @apply !h-14 !rounded-design !border-none !shadow-sm !transition-all !duration-200 !font-medium !text-lg;
}

.btn-primary {
  @apply btn-base !bg-surface-800 hover:!bg-surface-900 !text-white;
}

.btn-wechat {
  @apply btn-base !bg-[#07C160] hover:!bg-[#06AE56] !text-white;
}

.btn-secondary {
  @apply btn-base !bg-surface-100 hover:!bg-surface-200 !text-surface-600;
}
```

使用示例：

```html
<!-- 主按钮 -->
<van-button class="btn-primary">
  <span class="!text-white !font-medium !text-lg">按钮文本</span>
</van-button>

<!-- 微信登录按钮 -->
<van-button class="btn-wechat">
  <span class="!text-white !font-medium !text-lg">微信登录</span>
</van-button>

<!-- 次要按钮 -->
<van-button class="btn-secondary">
  <span>次要按钮</span>
</van-button>
```

### 3.2 输入框样式

```html
<van-field class="h-14 bg-surface-100 rounded-design-sm overflow-hidden">
  <template #left-icon>
    <van-icon name="user-o" class="text-surface-400" />
  </template>
</van-field>
```

### 3.3 卡片样式

```html
<div class="bg-white rounded-design shadow-sm overflow-hidden">
  <!-- 卡片内容 -->
</div>
```

## 4. 样式覆盖说明

### 4.1 Vant 样式重置

```css
/* src/styles/tailwind.css */
.van-button {
  &--default {
    background-color: inherit !important;
  }
  &__content {
    color: inherit !important;
  }
}
```

### 4.2 样式优先级处理

- 使用 `!` 前缀强制覆盖样式
- Tailwind 配置中启用 `important: true`
- 使用预定义类名避免样式冲突

## 5. 最佳实践

### 5.1 样式命名规范

- 使用语义化的类名（如 btn-primary, btn-secondary）
- 遵循 BEM 命名规范
- 避免过深的选择器嵌套

### 5.2 响应式设计

- 使用 postcss-px-to-viewport 自动转换单位
- 基准宽度：375px
- 保持布局的弹性和适应性

### 5.3 性能优化

- 合理使用预定义类
- 避免过多的自定义 CSS
- 利用 Tailwind 的 JIT 模式
