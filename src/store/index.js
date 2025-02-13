import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

const pinia = createPinia();

// 配置持久化插件
pinia.use(
  createPersistedState({
    key: (id) => `companion_${id}`,
    storage: localStorage,
    paths: ["user.token", "user.userInfo"],
  })
);

export default pinia;
