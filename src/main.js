import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import VConsole from "vconsole";
import { Toast, Dialog } from "vant";

// 样式导入顺序很重要
import "vant/lib/index.css"; // 1. Vant 基础样式
import "./styles/design-tokens.css"; // 2. 设计令牌
import "./styles/base.css"; // 3. 基础样式
import "./styles/vant-reset.css"; // 4. Vant 样式重置
import "./styles/tailwind.css"; // 5. Tailwind 和自定义样式

// 引入 Font Awesome
import "@fortawesome/fontawesome-free/css/all.css";

// 在开发环境和测试环境中启用 VConsole
if (["development", "test"].includes(process.env.VUE_APP_ENV)) {
  new VConsole();
}

// Vant 组件
const vantComponents = {
  Toast,
  Dialog,
};

// 创建应用实例
const app = createApp(App);

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error("全局错误:", {
    error: err,
    info,
    component: vm?.$options?.name,
  });
};

// 全局警告处理
app.config.warnHandler = (msg, vm, trace) => {
  console.warn("全局警告:", {
    message: msg,
    trace,
    component: vm?.$options?.name,
  });
};

// 注册 Vant 组件
Object.values(vantComponents).forEach((component) => {
  app.use(component);
});

// 使用 Pinia 和路由
app.use(createPinia());
app.use(router);

// 挂载应用
app.mount("#app");
