<template>
  <div class="min-h-screen bg-surface-50 flex items-center justify-center">
    <van-loading type="spinner" color="#14b8a6" size="36" vertical>
      {{ loadingText }}
    </van-loading>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import { useUserStore } from "@/store/modules/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const loadingText = ref("正在登录...");

onMounted(async () => {
  try {
    // 获取 URL 中的 code 参数
    const { code } = route.query;
    
    console.log("code", code);

    if (!code) {
      throw new Error("未获取到授权码");
    }

    // 调用微信登录接口
    const data = await userStore.login(code);

    console.log("data", data);

    // // 保存用户信息和 token
    // userStore.setUserInfo(data.userInfo);
    userStore.setToken(data.token);

    // 跳转到原来的页面或首页
    const redirect = "/";
    router.replace(redirect);
  } catch (error) {
    console.error("微信登录失败:", error);
    loadingText.value = "登录失败";
    showToast({
      message: "登录失败，请重试",
      type: "fail",
    });

    // 3秒后跳转到登录页
    setTimeout(() => {
      router.replace("/login");
    }, 3000);
  }
});
</script>
