import { defineStore } from "pinia";
import { getUserTagInfo, getSystemTagInfo } from "@/api/system";

/**
 * 系统状态管理
 */
export const useSystemStore = defineStore("system", {
  /**
   * 状态定义
   */
  state: () => ({
    // 标签相关
    systemTags: [], // 系统预设标签列表
    userTags: [], // 用户已选标签

    // 系统配置
    systemConfig: {}, // 系统配置信息
  }),

  /**
   * 计算属性
   */
  getters: {
    // 用户选择的标签
    userSelectedTags: (state) => {
      return state.systemTags.filter((tag) => state.userTags.includes(tag.id));
    },
  },

  /**
   * 操作方法
   */
  actions: {
    /**
     * 获取系统标签
     */
    async fetchSystemTags() {
      try {
        const res = await getSystemTagInfo();
        if (res.code === "0000") {
          const { sysTagInfo } = res.data;
          this.systemTags = sysTagInfo;
        } else {
          this.systemTags = [];
        }
      } catch (error) {
        console.error("获取系统标签失败:", error);
        this.systemTags = [];
        throw error;
      }
    },

    /**
     * 获取用户标签
     */
    async fetchUserTags() {
      try {
        const res = await getUserTagInfo({});
        if (res.code === "0000") {
          const { userTagInfo = [] } = res.data;
          this.userTags = userTagInfo;
        } else {
          this.userTags = [];
        }
      } catch (error) {
        console.error("获取用户标签失败:", error);
        this.userTags = [];
        throw error;
      }
    },

    /**
     * 更新系统配置
     * @param {Object} config - 系统配置信息
     */
    updateSystemConfig(config) {
      this.systemConfig = { ...this.systemConfig, ...config };
    },

    /**
     * 清除所有状态
     */
    clearState() {
      this.systemTags = [];
      this.userTags = [];
      this.systemConfig = {};
    },
  },

  // 持久化存储
  persist: true,
});
