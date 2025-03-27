import { defineStore } from "pinia";
import { wxLogin } from "@/api/wx";
import { getUserInfo, getVipInfo, getOtherInfo } from "@/api/user";
import { getUserTagInfo } from "@/api/system";
import { MOCK_SELLER_USER } from "@/mock";
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
    userVipInfo: null,
    userOtherInfo: null,
    role: 1, // 默认普通用户 (1: 普通用户, 2: 店员)

    // 标签相关
    systemTags: [], // 系统标签列表
    userTags: [], // 用户已选标签
  }),

  /**
   * 计算属性
   */
  getters: {
    // 用户选择的标签
    userSelectedTags: (state) => {
      return state.systemTags.filter((tag) => state.userTags.includes(tag.id));
    },

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
     * @returns {Object} 用户信息
     */
    async getUserInfo() {
      try {
        const data = await getUserInfo();
        this.userInfo = data;
        this.role = data.role;
        return data;
      } catch (error) {
        console.error("获取用户信息失败:", error);
        throw error;
      }
    },

    /**
     * 获取用户vip信息
     * @returns {Object} 用户vip信息
     */
    async getUserVipInfo() {
      try {
        const data = await getVipInfo();
        this.userVipInfo = data;
        return data;
      } catch (error) {
        console.error("获取用户vip信息失败:", error);
        throw error;
      }
    },

    /**
     * 获取用户其他信息
     * @returns {Object} 用户其他信息
     */
    async getUserOtherInfo() {
      try {
        const data = await getOtherInfo();
        this.userOtherInfo = data;
        return data;
      } catch (error) {
        console.error("获取用户其他信息失败:", error);
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
