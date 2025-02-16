import { defineStore } from "pinia";
import { wxLogin } from "@/api/wx";
import { getUserInfo } from "@/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    openid: "",
    userInfo: null,
  }),

  actions: {
    // 开发环境使用
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },

    setToken(token) {
      this.token = token;
    },

    async login(code) {
      const data = await wxLogin(code);
      this.token = data.token;
      this.openid = data.accessToken;
      return data;
    },

    logout() {
      this.token = "";
      this.userInfo = null;
    },

    async getUserInfo() {
      if (!this.openid) {
        console.warn("尝试获取用户信息但 openid 为空");
        return null;
      }
      const data = await getUserInfo(this.openid);
      this.userInfo = data;
      return data;
    },
  },

  getters: {
    isLoggedIn: (state) => {
      // 开发环境且配置跳过鉴权时，始终返回 true
      if (
        process.env.NODE_ENV === "development" &&
        process.env.VUE_APP_SKIP_AUTH === "true"
      ) {
        return true;
      }
      return !!state.token;
    },
  },

  persist: true,
});
