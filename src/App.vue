<template>
  <div id="app">
    <van-nav-bar
      title="Companion"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>

    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { initWxConfig } from "@/utils/wx-sdk";

const router = useRouter();
const active = ref(0);

const onClickLeft = () => {
  router.back();
};

onMounted(async () => {
  console.log("App mounted, 准备初始化微信配置");
  try {
    // 如果当前页面包含授权参数，则不初始化微信配置
    if (
      window.location.href.includes("code=") &&
      window.location.href.includes("state=")
    ) {
      console.log("当前是授权回调页面，跳过微信配置");
      return;
    }
    await initWxConfig();
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
