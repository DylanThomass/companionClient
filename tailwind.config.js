/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}", "./src/styles/*.css"],
  // 确保不会影响 Vant 的样式
  corePlugins: {
    preflight: false,
  },
  // 启用 important 选项，支持 !类名 语法
  important: true,
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--c-primary)",
          light: "var(--c-primary-light)",
          dark: "var(--c-primary-dark)",
        },
        // 恢复 surface 颜色系列，兼容旧代码
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
        // 保留 brand 颜色系列，兼容旧代码
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "var(--c-success)",
          600: "#16a34a",
          700: "#15803d",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "var(--c-warning)",
          600: "#d97706",
          700: "#b45309",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "var(--c-danger)",
          600: "#dc2626",
          700: "#b91c1c",
        },
        info: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "var(--c-info)",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        feature: {
          service: {
            light: "var(--c-feature-service-light)",
            DEFAULT: "var(--c-feature-service)",
          },
          order: {
            light: "var(--c-feature-order-light)",
            DEFAULT: "var(--c-feature-order)",
          },
          favorite: {
            light: "var(--c-feature-favorite-light)",
            DEFAULT: "var(--c-feature-favorite)",
          },
          system: {
            light: "var(--c-feature-system-light)",
            DEFAULT: "var(--c-feature-system)",
          },
        },
        text: {
          primary: "var(--c-text-primary)",
          regular: "var(--c-text-regular)",
          secondary: "var(--c-text-secondary)",
          placeholder: "var(--c-text-placeholder)",
        },
        border: {
          DEFAULT: "var(--c-border)",
          light: "var(--c-border-light)",
        },
        background: {
          DEFAULT: "var(--c-background)",
          light: "var(--c-background-light)",
        },
      },
      spacing: {
        base: "var(--s-base)",
        xs: "var(--s-xs)",
        sm: "var(--s-sm)",
        md: "var(--s-md)",
        lg: "var(--s-lg)",
        xl: "var(--s-xl)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        full: "var(--r-full)",
        // 恢复旧的圆角设置
        design: "16px",
        "design-sm": "12px",
      },
      fontFamily: {
        sans: "var(--font-family)",
      },
      fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        // 恢复旧的字体大小
        assist: "0.75rem",
        body: "1rem",
        title: "1.25rem",
        headline: "1.5rem",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
        // 恢复旧的过渡时间
        200: "200ms",
      },
      transitionTimingFunction: {
        "ease-out": "var(--ease-out)",
        "ease-in-out": "var(--ease-in-out)",
        // 恢复旧的缓动函数
        design: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      // 恢复旧的边框宽度
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
  // 添加所有可能使用的类到 safelist
  safelist: [
    // 按钮相关
    { pattern: /^btn-/ },
    { pattern: /^!h-/ },
    { pattern: /^!rounded-/ },
    { pattern: /^!border-/ },
    { pattern: /^!shadow-/ },
    { pattern: /^!transition-/ },
    { pattern: /^!duration-/ },
    { pattern: /^!font-/ },
    { pattern: /^!text-/ },
    { pattern: /^!bg-/ },
    { pattern: /^hover:!bg-/ },

    // 颜色相关
    { pattern: /^bg-surface-/ },
    { pattern: /^text-surface-/ },
    { pattern: /^border-surface-/ },
    { pattern: /^bg-brand-/ },
    { pattern: /^text-brand-/ },
    { pattern: /^border-brand-/ },

    // 其他常用类
    "min-h-screen",
    "bg-gray-100",
    "p-4",
    "bg-white",
    "rounded-lg",
    "shadow-sm",
    "mb-4",
  ],
};
