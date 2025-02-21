import { defineStore } from "pinia";
import { wxLogin } from "@/api/wx";
import { getUserInfo } from "@/api/user";
import { MOCK_SELLER_USER, MOCK_NORMAL_USER } from "@/mock";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    openid: "",
    userInfo: null,
    // 默认使用普通用户数据
    role: 1,
  }),

  actions: {
    // 开发环境使用
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      this.role = userInfo.role;
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
      this.openid = "";
      this.userInfo = null;
      this.role = 1;
      localStorage.clear();
    },

    async getUserInfo() {
      // 开发环境且使用 mock 数据时，返回 mock 数据
      if (
        process.env.NODE_ENV === "development" &&
        process.env.VUE_APP_USE_MOCK === "true"
      ) {
        // 根据当前角色返回对应的 mock 数据
        const mockData = this.role === 2 ? MOCK_SELLER_USER : MOCK_NORMAL_USER;
        this.userInfo = mockData;
        return mockData;
      }

      if (!this.openid) {
        console.warn("尝试获取用户信息但 openid 为空");
        return null;
      }
      const data = await getUserInfo(this.openid);
      this.userInfo = data;
      this.role = data.role;
      return data;
    },

    // 切换测试用户类型
    toggleUserType() {
      if (this.role === 1) {
        this.userInfo = MOCK_SELLER_USER;
        this.role = 2;
      } else {
        this.userInfo = MOCK_NORMAL_USER;
        this.role = 1;
      }
    },
  },

  getters: {
    // 是否是店员
    isSeller: (state) => state.role === 2,
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
