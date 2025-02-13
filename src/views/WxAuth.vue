<template>
  <div class="wx-auth">
    <van-loading type="spinner" vertical>登录中...</van-loading>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { showToast } from "vant";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

onMounted(async () => {
  try {
    const { code } = route.query;

    if (!code) {
      throw new Error("未获取到授权码");
    }

    await userStore.login(code);
    showToast({ message: "登录成功" });

    // 直接跳转到首页（用户信息页）
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
