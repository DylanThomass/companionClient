<template>
  <div class="app">
    <van-nav-bar
      :title="appTitle"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import { useRouter, useRoute } from "vue-router";
import { initWxConfig, isWxEnv } from "@/utils/wx-sdk";
import { showToast } from "vant";
import { useUserStore } from "@/store/modules/user";

// 应用配置
const appTitle = process.env.VUE_APP_TITLE || "Companion";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const appReady = ref(false);

// 提供全局状态
provide("appReady", appReady);

const onClickLeft = () => {
  // 如果是首页，不显示返回按钮
  if (["/", "/hall", "/user"].includes(route.path)) {
    return;
  }
  router.back();
};

onMounted(async () => {
  console.log("App mounted");

  // 初始化微信配置
  if (isWxEnv()) {
    try {
      await initWxConfig();
    } catch (error) {
      console.error("初始化微信配置失败:", error);
    }
  }

  // 如果已登录，获取用户信息
  if (userStore.isLoggedIn) {
    try {
      await userStore.getUserInfo();
      // 获取系统标签
      await userStore.fetchSystemTags();
      await userStore.fetchUserTags();
    } catch (error) {
      console.error("获取用户信息失败:", error);
    }
  }

  appReady.value = true;
});
</script>

<style>
.app {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 确保基础样式加载 */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}
</style>
