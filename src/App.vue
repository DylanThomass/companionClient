<template>
  <div id="app">
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

    <van-tabbar v-model="activeTab" v-if="showTabbar">
      <van-tabbar-item
        v-for="tab in tabs"
        :key="tab.path"
        :icon="tab.icon"
        :to="tab.path"
      >
        {{ tab.text }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { initWxConfig, isWxEnv } from "@/utils/wx-sdk";

// 应用配置
const appTitle = process.env.VUE_APP_TITLE || "Companion";

// 标签栏配置
const tabs = [
  { path: "/", icon: "home-o", text: "首页" },
  { path: "/user", icon: "user-o", text: "我的" },
];

const router = useRouter();
const route = useRoute();
const activeTab = ref(0);

// 控制标签栏显示
const showTabbar = computed(() => {
  // 在登录页和授权页不显示标签栏
  const hiddenPaths = ["/login", "/wx-auth"];
  return !hiddenPaths.includes(route.path);
});

const onClickLeft = () => {
  // 如果是首页，不显示返回按钮
  if (route.path === "/") {
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
    const url = window.location.href.split("#")[0];
    await initWxConfig(url, [
      "updateAppMessageShareData",
      "updateTimelineShareData",
      "chooseImage",
      "getLocation",
    ]);
    console.log("微信配置初始化完成");
  } catch (error) {
    console.error("App.vue 中微信配置初始化失败:", error);
  }
});
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f7f8fa;
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
