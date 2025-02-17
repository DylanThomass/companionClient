import { defineStore } from "pinia";
import { wxLogin } from "@/api/wx";
import { getUserInfo } from "@/api/user";
import headImg from "@/assets/test/HeadImg-1.jpg";
// Mock 数据
const MOCK_USER_INFO = {
  id: 1001,
  openId: "o0Nbu7AX1_CpU3GSre5ShDs-SSPU",
  nickname: "治愈系店员",
  avatarUrl: headImg,
  gender: 1, // 1-男 2-女
  province: "广东",
  city: "深圳",
  role: 2, // 1-普通用户 2-店员
  stats: {
    balance: 888.88,
    coupons: 5,
    signInDays: 12,
    inviteCount: 8,
    todaySignIn: false,
  },
  seller: {
    pendingOrders: 3,
    todayIncome: 666,
    monthIncome: 8888,
    totalIncome: 66666,
    rating: 4.9,
    orderCount: 128,
  },
  tags: ["温暖贴心", "专业可靠", "倾听者"],
  level: {
    exp: 750,
    title: "温暖使者",
  },
};

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    openid: "",
    userInfo: null,
    // 用户角色: 1-普通用户 2-店员
    role: process.env.VUE_APP_USE_MOCK === "true" ? MOCK_USER_INFO.role : 1,
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
      this.userInfo = null;
      this.role = 1;
    },

    async getUserInfo() {
      // 开发环境且使用 mock 数据时，返回 mock 数据
      if (
        process.env.NODE_ENV === "development" &&
        process.env.VUE_APP_USE_MOCK === "true"
      ) {
        this.userInfo = MOCK_USER_INFO;
        this.role = MOCK_USER_INFO.role;
        return MOCK_USER_INFO;
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
