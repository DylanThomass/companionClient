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
          50: "#fdf4f4",
          100: "#fde8e8",
          200: "#fbd5d5",
          300: "#f8b4b4",
          400: "#f98080",
          500: "#f05252",
          600: "#e02424",
          700: "#c81e1e",
          800: "#9b1c1c",
          900: "#771d1d",
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
