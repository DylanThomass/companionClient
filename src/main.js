import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import VConsole from "vconsole";
import {
  Button,
  NavBar,
  Tabbar,
  TabbarItem,
  Form,
  Field,
  CellGroup,
  Cell,
  Loading,
  Toast,
  Dialog,
  Collapse,
  CollapseItem,
} from "vant";

// 在开发环境和测试环境中启用 VConsole
if (["development", "test"].includes(process.env.VUE_APP_ENV)) {
  new VConsole();
}

// Vant 组件
const vantComponents = {
  Button: Button,
  NavBar: NavBar,
  Tabbar: Tabbar,
  TabbarItem: TabbarItem,
  Form: Form,
  Field: Field,
  CellGroup: CellGroup,
  Cell: Cell,
  Loading: Loading,
  Toast: Toast,
  Dialog: Dialog,
  Collapse: Collapse,
  CollapseItem: CollapseItem,
};

// 引入 Vant 样式
import "vant/lib/index.css";
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
