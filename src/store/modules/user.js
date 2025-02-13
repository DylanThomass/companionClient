import { defineStore } from "pinia";
import { ref } from "vue";
import { wxLogin } from "@/api/user";

export const useUserStore = defineStore("user", () => {
  // 从 localStorage 初始化 token 和用户信息
  const token = ref(localStorage.getItem("token") || "");
  const userInfo = ref(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );

  async function login(code) {
    try {
      const data = await wxLogin(code);
      token.value = data.token;
      userInfo.value = data.userInfo;
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      return data;
    } catch (error) {
      token.value = "";
      userInfo.value = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      throw error;
    }
  }

  function logout() {
    token.value = "";
    userInfo.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  }

  return {
    token,
    userInfo,
    login,
    logout,
  };
});
