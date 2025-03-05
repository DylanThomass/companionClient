import { defineStore } from "pinia";
import { wxLogin } from "@/api/wx";
import { getUserInfo } from "@/api/user";
import { getUserTagInfo } from "@/api/system";
import { MOCK_SELLER_USER, MOCK_NORMAL_USER } from "@/mock";
import { IMAGE_BASE_URL } from "@/utils/request";
import { useAccountStore } from "./account";

/**
 * 用户状态管理
 */
export const useUserStore = defineStore("user", {
  /**
   * 状态定义
   */
  state: () => ({
    // 认证相关
    token: "",
    openid: "",
    userId: "",

    // 用户信息
    userInfo: null,
    role: 1, // 默认普通用户 (1: 普通用户, 2: 店员)

    // 标签相关
    systemTags: [], // 系统标签列表
    userTags: [], // 用户已选标签
  }),

  /**
   * 计算属性
   */
  getters: {
    // 是否是店员
    isSeller: (state) => state.role === 2,

    // 是否已登录
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

  /**
   * 操作方法
   */
  actions: {
    /**
     * 设置用户信息（开发环境使用）
     * @param {Object} userInfo - 用户信息对象
     */
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      this.role = userInfo.role;
    },

    /**
     * 设置认证令牌
     * @param {string} token - 认证令牌
     */
    setToken(token) {
      this.token = token;
    },

    /**
     * 微信登录
     * @param {string} code - 微信授权码
     * @returns {Promise<Object>} 登录结果
     */
    async login(code) {
      try {
        const data = await wxLogin(code);
        this.token = data.token;
        this.openid = data.accessToken;
        this.userId = data.userId;

        // 登录成功后初始化账户余额
        const accountStore = useAccountStore();
        await accountStore.fetchBalance();

        return data;
      } catch (error) {
        console.error("登录失败:", error);
        throw error;
      }
    },

    /**
     * 退出登录，清除所有状态
     */
    logout() {
      this.token = "";
      this.openid = "";
      this.userId = "";
      this.userInfo = null;
      this.role = 1;
      this.systemTags = [];
      this.userTags = [];

      // 重置账户状态
      const accountStore = useAccountStore();
      accountStore.reset();

      localStorage.clear();
    },

    /**
     * 获取用户信息
     * @returns {Promise<Object|null>} 用户信息
     */
    async getUserInfo() {
      // 开发环境使用 mock 数据
      if (
        process.env.NODE_ENV === "development" &&
        process.env.VUE_APP_USE_MOCK === "true"
      ) {
        const mockData = this.role === 2 ? MOCK_SELLER_USER : MOCK_NORMAL_USER;
        this.userInfo = mockData;
        return mockData;
      }

      // 检查 userId 是否存在
      if (!this.userId) {
        console.warn("尝试获取用户信息但 userId 为空");
        return null;
      }

      try {
        const data = await getUserInfo(this.userId);
        this.userInfo = data;
        this.role = data.role;
        return data;
      } catch (error) {
        console.error("获取用户信息失败:", error);
        throw error;
      }
    },

    /**
     * 获取系统标签列表
     * @returns {Promise<Object|null>} 标签信息
     */
    async fetchSystemTags() {
      try {
        const res = await getUserTagInfo({ userId: "" });

        if (res && res.sysTagInfo) {
          this.systemTags = res.sysTagInfo;
        } else {
          this.systemTags = [];
        }

        return res;
      } catch (error) {
        console.error("获取系统标签失败:", error);
        this.systemTags = [];
        throw error;
      }
    },

    /**
     * 获取用户已选标签
     * @returns {Promise<Array|null>} 用户标签
     */
    async fetchUserTags() {
      // 检查 userId 是否存在
      if (!this.userId) {
        console.warn("尝试获取用户标签但 userId 为空");
        return null;
      }

      try {
        // 确保系统标签已加载
        if (this.systemTags.length === 0) {
          await this.fetchSystemTags();
        }

        const res = await getUserTagInfo({ userId: this.userId });

        if (res && res.userTagInfo) {
          // 将标签ID映射为完整的标签对象
          this.userTags = res.userTagInfo
            .map((tagId) => this.systemTags.find((tag) => tag.id === tagId))
            .filter((tag) => tag); // 过滤掉未找到的标签
        } else {
          this.userTags = [];
        }

        return this.userTags;
      } catch (error) {
        console.error("获取用户标签失败:", error);
        this.userTags = [];
        throw error;
      }
    },

    /**
     * 更新用户标签（本地状态更新，不调用API）
     * @param {Array} tags - 标签数组
     */
    updateUserTags(tags) {
      this.userTags = tags;
    },

    /**
     * 切换测试用户类型（开发环境使用）
     */
    toggleUserType() {
      if (this.role === 1) {
        this.userInfo = MOCK_SELLER_USER;
        this.role = 2;
      } else {
        this.userInfo = MOCK_NORMAL_USER;
        this.role = 1;
      }
    },

    /**
     * 更新用户头像
     * @param {string} avatarUrl - 头像URL
     */
    updateUserAvatar(avatarUrl) {
      const fullAvatarUrl = avatarUrl.startsWith("http")
        ? avatarUrl
        : `${IMAGE_BASE_URL}${avatarUrl}`;
      this.userInfo.avatarUrl = fullAvatarUrl;
    },
  },

  // 持久化存储
  persist: true,
});
