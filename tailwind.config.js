/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  // 确保不会影响 Vant 的样式
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // 基础色板 - 使用更柔和的青色系统
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
        },
        // 功能色板
        feature: {
          order: {
            light: "#fee2e2",
            DEFAULT: "#f43f5e",
          },
          favorite: {
            light: "#fef3c7",
            DEFAULT: "#f59e0b",
          },
          service: {
            light: "#dbeafe",
            DEFAULT: "#3b82f6",
          },
          system: {
            light: "#f3e8ff",
            DEFAULT: "#9333ea",
          },
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ec4899",
          600: "#db2777",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        surface: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
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
        silver: {
          500: "#94A3B8",
        },
        bronze: {
          500: "#B45309",
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
      borderWidth: {
        3: "3px",
      },
    },
  },
};
