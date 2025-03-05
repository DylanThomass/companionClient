import { defineStore } from "pinia";

/**
 * 账户状态管理
 */
export const useAccountStore = defineStore("account", {
  /**
   * 状态定义
   */
  state: () => ({
    balance: 0, // 用户余额
    loading: false, // 加载状态
  }),

  /**
   * 计算属性
   */
  getters: {
    // 获取用户余额
    userBalance: (state) => state.balance,
  },

  /**
   * 操作方法
   */
  actions: {
    /**
     * 获取用户余额
     * @returns {Promise<number>} 用户余额
     */
    async fetchBalance() {
      this.loading = true;
      try {
        // TODO: 调用获取用户余额接口
        // const { data } = await getUserBalance();
        // this.balance = data.balance;

        // 开发环境使用模拟数据
        if (process.env.NODE_ENV === "development") {
          this.balance = 1000;
        }
        return this.balance;
      } catch (error) {
        console.error("获取用户余额失败:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 更新用户余额
     * @param {number} amount - 更新金额（正数增加，负数减少）
     * @returns {Promise<void>}
     */
    async updateBalance(amount) {
      try {
        // TODO: 调用更新余额接口
        // const { data } = await updateUserBalance(amount);
        // this.balance = data.balance;

        // 开发环境直接更新本地状态
        if (process.env.NODE_ENV === "development") {
          this.balance += amount;
        }
      } catch (error) {
        console.error("更新用户余额失败:", error);
        throw error;
      }
    },

    /**
     * 重置账户状态
     */
    reset() {
      this.balance = 0;
      this.loading = false;
    },
  },

  // 持久化存储
  persist: true,
});
