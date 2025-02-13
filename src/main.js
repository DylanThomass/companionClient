import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VConsole from "vconsole";

// 只在开发环境中启用 VConsole
if (process.env.VUE_APP_ENV === "development") {
  new VConsole();
}

// 引入 Vant 组件
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
} from "vant";

// 引入 Vant 样式
import "vant/lib/index.css";

// 创建应用实例
const app = createApp(App);

// 注册 Vant 组件
app
  .use(Button)
  .use(NavBar)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Form)
  .use(Field)
  .use(CellGroup)
  .use(Cell)
  .use(Loading);

// 使用 Pinia 和路由
app.use(createPinia());
app.use(router);

// 挂载应用
app.mount("#app");
