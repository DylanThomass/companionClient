/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // 确保不会覆盖 Vant 的样式
  corePlugins: {
    preflight: false,
  },
  important: true,
  theme: {
    extend: {
      colors: {
        // 基础色板 - 使用更现代的色彩系统
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
        // 情绪渐变色
        emotion: {
          joy: {
            from: "hsl(38,89%,60%)", // 更深的橙色
            to: "hsl(355,70%,55%)", // 更深的红色
          },
          calm: {
            from: "hsl(198,60%,45%)", // 更深的蓝色
            to: "hsl(210,50%,50%)", // 更深的靛蓝
          },
          low: {
            from: "hsl(240,30%,45%)", // 更深的紫色
            to: "hsl(260,25%,55%)", // 更深的淡紫
          },
        },
      },
      borderRadius: {
        design: "16px", // 更大的圆角
        "design-sm": "12px", // 小组件圆角
      },
      transitionTimingFunction: {
        design: "cubic-bezier(0.4, 0, 0.2, 1)",
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
