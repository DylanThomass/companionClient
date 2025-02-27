import { defineStore } from "pinia";
import { wxLogin } from "@/api/wx";
import { getUserInfo } from "@/api/user";
import { getUserTagInfo } from "@/api/system";
import { MOCK_SELLER_USER, MOCK_NORMAL_USER } from "@/mock";
import { IMAGE_BASE_URL } from "@/utils/request";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    openid: "",
    userId: "",
    userInfo: null,
    // 默认使用普通用户数据
    role: 1,
    // 系统标签
    systemTags: [],
    // 用户已选标签
    userTags: [],
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
      this.userId = data.userId;
      return data;
    },

    logout() {
      this.token = "";
      this.openid = "";
      this.userId = "";
      this.userInfo = null;
      this.role = 1;
      this.systemTags = [];
      this.userTags = [];
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

      if (!this.userId) {
        console.warn("尝试获取用户信息但 userId 为空");
        return null;
      }
      const data = await getUserInfo(this.userId);
      console.log("getUserInfo", data);
      this.userInfo = data;
      this.role = data.role;
      return data;
    },

    // 获取系统标签
    async fetchSystemTags() {
      try {
        const res = await getUserTagInfo({ userId: "" });
        console.log("getUserTagInfo:", res);
        if (res) {
          console.log("res", res);
          const { sysTagInfo = [] } = res;
          this.systemTags = sysTagInfo;
        }

        return res;
      } catch (error) {
        console.error("获取系统标签失败:", error);
        return null;
      }
    },

    // 获取用户已经选择的标签
    async fetchUserTags() {
      try {
        if (!this.userId) {
          console.warn("尝试获取用户标签但 userId 为空");
          return null;
        }

        const res = await getUserTagInfo({ userId: this.userId });
        const { userTagInfo = [] } = res;
        console.log("获取用户标签:", res);

        if (res) {
          this.userTags = userTagInfo.map((tagId) =>
            this.systemTags.find((tag) => tag.id === tagId)
          );
        } else {
          this.userTags = [];
        }
      } catch (error) {
        console.error("获取用户标签失败:", error);
        return null;
      }
    },

    // 更新用户标签（本地状态更新，不调用API）
    updateUserTags(tags) {
      this.userTags = tags;
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

    updateUserAvatar(avatarUrl) {
      const fullAvatarUrl = avatarUrl.startsWith("http")
        ? avatarUrl
        : `${IMAGE_BASE_URL}${avatarUrl}`;
      this.userInfo.avatarUrl = fullAvatarUrl;
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
