import { defineStore } from "pinia";
import { wxLogin } from "@/api/wx";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    userInfo: null,
  }),

  actions: {
    async login(code) {
      const data = await wxLogin(code);
      this.token = data.token;
      this.userInfo = data.userInfo;
      return data;
    },

    logout() {
      this.token = "";
      this.userInfo = null;
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.userInfo,
  },

  persist: true,
});
