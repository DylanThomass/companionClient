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
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { initWxConfig, isWxEnv } from "@/utils/wx-sdk";
import { showToast } from "vant";

// 应用配置
const appTitle = process.env.VUE_APP_TITLE || "Companion";

const router = useRouter();
const route = useRoute();

const onClickLeft = () => {
  // 如果是首页，不显示返回按钮
  if (["/", "/hall", "/orders", "/user"].includes(route.path)) {
    return;
  }
  router.back();
};

onMounted(async () => {
  console.log("App mounted, 准备初始化微信配置");
  try {
    // 非微信环境不初始化配置
    if (!isWxEnv()) {
      console.log("非微信环境，跳过配置初始化");
      return;
    }

    // 获取当前页面 URL，不包含 hash
    const url =
      process.env.NODE_ENV === "development"
        ? window.location.href.split("#")[0].replace("https://", "http://")
        : window.location.href.split("#")[0];

    await initWxConfig(url, [
      "updateAppMessageShareData",
      "updateTimelineShareData",
      "chooseImage",
      "getLocation",
    ]);
    console.log("微信配置初始化完成");
  } catch (error) {
    console.error("微信配置初始化失败:", {
      message: error.message,
      config: error.config,
      status: error.response?.status,
      data: error.response?.data,
    });

    // 如果不是开发环境，显示友好的错误提示
    if (process.env.NODE_ENV !== "development") {
      showToast({
        message: "微信初始化失败，请刷新重试",
        type: "fail",
      });
    }
  }
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
