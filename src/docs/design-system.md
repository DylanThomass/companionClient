# Companion 设计系统文档

## 1. 设计理念

Companion 是一款情感陪伴应用，我们的设计理念基于以下核心价值观：

- **温暖**：使用柔和的色彩和圆润的形状，传达温暖和亲近感
- **简约**：简洁的界面设计，减少视觉噪音，让用户专注于情感交流
- **信任**：一致的设计语言和可靠的交互模式，建立用户信任
- **情感化**：注重细节和微交互，增强情感连接

## 2. 色彩系统

### 2.1 主题色

主题色采用薄荷绿色系，传达清新、平静和治愈的感觉：

```css
--c-primary: #14b8a6; /* 主色 */
--c-primary-light: #2dd4bf; /* 浅色 */
--c-primary-dark: #0d9488; /* 深色 */
```

### 2.2 功能色

功能色用于表达不同状态和功能：

```css
--c-success: #22c55e; /* 成功 */
--c-warning: #f59e0b; /* 警告 */
--c-danger: #ef4444; /* 危险 */
--c-info: #3b82f6; /* 信息 */
```

### 2.3 特性色

特性色用于区分不同功能模块：

```css
/* 服务相关 */
--c-feature-service: #3b82f6;
--c-feature-service-light: #dbeafe;

/* 订单相关 */
--c-feature-order: #f43f5e;
--c-feature-order-light: #fee2e2;

/* 收藏相关 */
--c-feature-favorite: #f59e0b;
--c-feature-favorite-light: #fef3c7;

/* 系统相关 */
--c-feature-system: #9333ea;
--c-feature-system-light: #f3e8ff;
```

### 2.4 文本色

文本色采用中性灰色系，确保良好的可读性：

```css
--c-text-primary: #27272a; /* 主要文本 */
--c-text-regular: #52525b; /* 常规文本 */
--c-text-secondary: #71717a; /* 次要文本 */
--c-text-placeholder: #a1a1aa; /* 占位符 */
```

### 2.5 边框和背景色

```css
--c-border: #e4e4e7; /* 边框色 */
--c-border-light: #f4f4f5; /* 浅边框色 */

--c-background: #ffffff; /* 背景色 */
--c-background-light: #fafafa; /* 浅背景色 */
```

## 3. 间距系统

我们使用 4px 作为基础单位，构建一致的间距系统：

```css
--s-base: 4px;
--s-xs: 8px; /* 超小间距 */
--s-sm: 12px; /* 小间距 */
--s-md: 16px; /* 中间距 */
--s-lg: 24px; /* 大间距 */
--s-xl: 32px; /* 超大间距 */
```

在 Tailwind 中使用：`p-xs`, `m-sm`, `gap-md` 等。

## 4. 圆角系统

圆角系统用于创建友好的视觉效果：

```css
--r-sm: 8px; /* 小圆角 */
--r-md: 12px; /* 中圆角 */
--r-lg: 16px; /* 大圆角 */
--r-full: 9999px; /* 完全圆形 */
```

在 Tailwind 中使用：`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`。

## 5. 字体系统

### 5.1 字体家族

```css
--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
  "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

### 5.2 字体大小

```css
--font-size-xs: 12px; /* 超小字体 */
--font-size-sm: 14px; /* 小字体 */
--font-size-base: 16px; /* 基础字体 */
--font-size-lg: 18px; /* 大字体 */
--font-size-xl: 20px; /* 超大字体 */
```

在 Tailwind 中使用：`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`。

## 6. 动画系统

### 6.1 过渡时间

```css
--duration-fast: 0.2s; /* 快速过渡 */
--duration-base: 0.3s; /* 基础过渡 */
--duration-slow: 0.4s; /* 慢速过渡 */
```

### 6.2 缓动函数

```css
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

## 7. 阴影系统

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

## 8. 组件设计规范

### 8.1 按钮

按钮是用户交互的主要入口，我们有以下几种类型：

#### 主要按钮

```html
<van-button type="primary" size="large">主要按钮</van-button>
```

- 使用主题色背景
- 白色文字
- 圆角设计
- 适当的内边距

#### 次要按钮

```html
<van-button plain size="large">次要按钮</van-button>
```

- 白色背景
- 主题色边框和文字
- 与主要按钮保持一致的圆角和尺寸

#### 功能按钮

```html
<van-button type="success">成功按钮</van-button>
<van-button type="warning">警告按钮</van-button>
<van-button type="danger">危险按钮</van-button>
```

- 使用对应的功能色
- 保持一致的样式规范

#### 微信登录按钮

```html
<van-button class="!bg-[#07c160] !border-[#07c160]">
  <van-icon name="wechat" class="text-white" />
  <span class="text-white">微信一键登录</span>
</van-button>
```

- 使用微信官方绿色 (#07c160)
- 白色图标和文字
- 圆角设计

### 8.2 表单元素

#### 输入框

```html
<van-field v-model="form.text" label="文本" placeholder="请输入文本" />
```

- 清晰的标签
- 适当的占位符文本
- 聚焦时显示主题色边框

#### 单选框和复选框

```html
<van-radio-group v-model="form.radio">
  <van-radio name="1">选项一</van-radio>
</van-radio-group>

<van-checkbox-group v-model="form.checkbox">
  <van-checkbox name="1">选项一</van-checkbox>
</van-checkbox-group>
```

- 使用主题色作为选中状态
- 保持一致的间距和对齐

### 8.3 卡片

```html
<div class="bg-background rounded-lg p-md shadow-sm">
  <div class="text-text-primary font-medium mb-sm">卡片标题</div>
  <p class="text-text-regular">卡片内容</p>
</div>
```

- 白色背景
- 圆角设计
- 轻微阴影
- 内容留有适当内边距

### 8.4 列表

```html
<van-cell-group class="rounded-lg overflow-hidden">
  <van-cell title="单元格" value="内容" />
  <van-cell title="单元格" value="内容" label="描述信息" />
</van-cell-group>
```

- 圆角容器
- 清晰的分隔线
- 一致的内边距
- 主要和次要信息区分明显

## 9. 页面布局规范

### 9.1 通用布局

- 顶部：导航栏
- 中间：主要内容区域
- 底部：操作按钮或标签栏

### 9.2 内容区域

- 使用卡片式设计
- 保持适当的内边距和元素间距
- 重要信息放在视口上方
- 次要信息可以放在滚动区域

### 9.3 移动端适配

- 避免使用 hover 效果（移动端没有悬停状态）
- 确保点击区域足够大（至少 44x44px）
- 避免过长的滚动页面
- 关键操作放在拇指可触及区域

## 10. 微信 H5 适配规范

### 10.1 安全域名

- 确保应用运行在 HTTPS 协议下
- 在微信公众平台配置正确的安全域名

### 10.2 API 配置

- 动态请求微信配置
- 正确处理 API 签名

### 10.3 用户体验优化

- 确保页面响应流畅
- 避免长时间加载
- 设置正确的 meta 标签优化视口

## 11. 代码规范

### 11.1 Vue 组件结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 导入语句
import { ref } from "vue";

// 状态定义
const count = ref(0);

// 方法定义
const increment = () => {
  count.value++;
};

// 生命周期钩子
onMounted(() => {
  console.log("组件已挂载");
});
</script>

<style scoped>
/* 组件样式 */
</style>
```

### 11.2 CSS 类命名规范

- 使用 Tailwind 类名优先
- 自定义类名使用小写字母和连字符（kebab-case）
- 避免过深的嵌套

### 11.3 JavaScript 规范

- 使用 ES6+ 语法
- 使用 const 和 let，避免 var
- 使用箭头函数
- 使用异步/await 处理异步操作

## 12. 最佳实践

### 12.1 性能优化

- 使用懒加载组件
- 避免不必要的重渲染
- 优化图片资源
- 使用合适的缓存策略

### 12.2 无障碍设计

- 提供足够的颜色对比度
- 使用语义化的 HTML 结构
- 确保键盘可访问性
- 提供适当的替代文本

### 12.3 响应式设计

- 使用相对单位（rem, em, vh, vw）
- 使用 Flexbox 和 Grid 布局
- 测试不同设备尺寸
- 考虑横屏和竖屏模式

### 12.4 用户体验提升

- 提供适当的加载状态
- 添加微交互和动画效果
- 确保表单验证和错误提示清晰
- 提供操作的反馈机制

## 13. 设计审核清单

在提交设计或代码前，请检查以下项目：

- [ ] 是否使用了正确的色彩系统？
- [ ] 间距和对齐是否一致？
- [ ] 字体大小和颜色是否符合规范？
- [ ] 交互元素是否有足够的点击区域？
- [ ] 是否考虑了边缘情况（空状态、错误状态等）？
- [ ] 动画效果是否适当且流畅？
- [ ] 代码是否遵循了项目规范？
- [ ] 是否进行了跨设备测试？

## 14. 资源和工具

### 14.1 设计资源

- 色彩系统：Tailwind CSS 色板
- 图标库：Vant 内置图标
- 字体：系统默认字体

### 14.2 开发工具

- UI 框架：Vant 4
- CSS 框架：Tailwind CSS
- 构建工具：Vite
- 状态管理：Pinia

## 15. 版本历史

| 版本  | 日期       | 描述     |
| ----- | ---------- | -------- |
| 1.0.0 | 2023-12-01 | 初始版本 |

---

文档由 Companion 团队维护，最后更新于 2023-12-01。
