import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import { useUserStore } from "./modules/user";
import { useAccountStore } from "./modules/account";
import { useSystemStore } from "./modules/system";

const pinia = createPinia();

// 配置持久化插件
pinia.use(
  createPersistedState({
    key: (id) => `companion_${id}`,
    storage: localStorage,
    paths: [
      "user.token",
      "user.userInfo",
      "system.systemTags",
      "system.userTags",
    ],
  })
);

export { useUserStore, useAccountStore, useSystemStore };
export default pinia;
