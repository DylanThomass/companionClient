import { createApp } from "vue";
import "vant/lib/index.css";
import "vant/es/toast/style";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import VConsole from "vconsole";
import { Toast, Dialog } from "vant";

// 在开发环境和测试环境中启用 VConsole
if (["development", "test"].includes(process.env.VUE_APP_ENV)) {
  new VConsole();
}

// Vant 组件
const vantComponents = {
  Toast: Toast,
  Dialog: Dialog,
};

// 引入 Vant 样式
import "./styles/base.css";
import "./styles/tailwind.css";

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
app.use(pinia);
app.use(router);

// 挂载应用
app.mount("#app");
