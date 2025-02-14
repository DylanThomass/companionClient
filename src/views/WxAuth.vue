<template>
  <div class="wx-auth">
    <van-loading type="spinner" vertical>登录中...</van-loading>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { showToast } from "vant";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

onMounted(async () => {
  try {
    const { code, state } = route.query;
    console.log("code", code);

    if (!code) {
      throw new Error("未获取到授权码");
    }

    // await userStore.login(code);
    // await nextTick();

    if (!userStore.isLoggedIn) {
      throw new Error("登录状态更新失败");
    }

    showToast({ message: "登录成功" });

    // 调试信息
    console.log("微信授权成功：", {
      code,
      state,
      userInfo: userStore.userInfo,
      token: userStore.token,
      isLoggedIn: userStore.isLoggedIn,
    });

    // 确保登录成功后跳转到首页
    router.replace("/");
  } catch (error) {
    console.error("微信登录失败:", error);
    showToast({
      message: error.message || "登录失败",
      type: "fail",
    });
    router.replace("/login");
  }
});
</script>
