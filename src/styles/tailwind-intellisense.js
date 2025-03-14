/**
 * Tailwind CSS 类名提示插件
 *
 * 此文件不会被实际导入，仅用于为 VS Code 的 Tailwind CSS IntelliSense 扩展提供类名提示
 * 安装 Tailwind CSS IntelliSense 扩展后，将鼠标悬停在类名上即可看到提示
 */

// 按钮类
const buttonClasses = {
  // 新系统按钮
  "button-base":
    "padding: 0.5rem 1rem; border-radius: 9999px; transition: all 0.2s;",
  "button-primary":
    "background: #14b8a6; color: white; border: 1px solid #14b8a6;",
  "button-secondary":
    "background: white; color: #14b8a6; border: 1px solid #14b8a6;",
  "button-success":
    "background: #22c55e; color: white; border: 1px solid #22c55e;",
  "button-warning":
    "background: #f59e0b; color: white; border: 1px solid #f59e0b;",
  "button-danger":
    "background: #ef4444; color: white; border: 1px solid #ef4444;",
  "button-wechat":
    "background: #07c160; color: white; border: 1px solid #07c160;",

  // 旧系统按钮
  "btn-base":
    "padding: 0.5rem 1rem; border-radius: 9999px; transition: all 0.3s;",
  "btn-primary":
    "background: #14b8a6; color: white; border: 1px solid #14b8a6;",
  "btn-secondary":
    "background: #99f6e4; color: #14b8a6; border: 1px solid #99f6e4;",
  "btn-wechat": "background: #07c160; color: white; border: 1px solid #07c160;",
};

// 卡片类
const cardClasses = {
  // 新系统卡片
  "ds-card":
    "background: white; border-radius: 1rem; padding: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);",
  "ds-card-header": "font-weight: 500; margin-bottom: 0.75rem; color: #27272a;",
  "ds-card-icon": "font-size: 1.5rem; color: #14b8a6; margin-bottom: 0.5rem;",

  // 旧系统卡片
  card: "background: white; border-radius: 1rem; padding: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);",
};

// 页面容器类
const containerClasses = {
  // 新系统容器
  "ds-page": "min-height: 100vh; background: #fafafa; padding-bottom: 2rem;",
  "ds-content": "padding: 1rem; max-width: 100%;",
  "ds-fixed-bottom":
    "position: fixed; bottom: 0; left: 0; right: 0; padding: 1rem; background: white; box-shadow: 0 -2px 10px rgba(0,0,0,0.05);",

  // 旧系统容器
  "page-container":
    "min-height: 100vh; background: #fafafa; padding-bottom: 2rem;",
};

// 表单元素类
const formClasses = {
  // 新系统表单
  "ds-radio-group": "display: flex; gap: 1rem; margin: 0.5rem 0;",
  "ds-radio":
    "display: flex; align-items: center; padding: 0.5rem 1rem; border: 1px solid #e4e4e7; border-radius: 0.5rem;",
  "ds-radio-active": "border-color: #14b8a6; background: rgba(20,184,166,0.1);",
};

// 实用工具类
const utilityClasses = {
  "text-truncate":
    "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;",
  "text-truncate-2":
    "overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;",
  "safe-bottom": "padding-bottom: env(safe-area-inset-bottom);",
  "no-click": "pointer-events: none;",
  "gradient-primary":
    "background: linear-gradient(to right, #14b8a6, #2dd4bf);",
};

// 导出所有类名（仅用于提示，不会被实际使用）
module.exports = {
  ...buttonClasses,
  ...cardClasses,
  ...containerClasses,
  ...formClasses,
  ...utilityClasses,
};
