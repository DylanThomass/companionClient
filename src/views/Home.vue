<template>
  <div class="min-h-screen bg-surface-50 px-6 py-12">
    <!-- Logo 和欢迎语 -->
    <div class="text-center mb-12">
      <div
        class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-300 to-brand-400 rounded-2xl flex items-center justify-center"
      >
        <van-icon name="like" class="text-4xl text-white" />
      </div>
      <h1 class="text-2xl font-semibold text-surface-800">
        欢迎回来，{{ userStore.userInfo?.nickname }}
      </h1>
      <p class="mt-3 text-surface-500">让温暖永远相伴</p>
    </div>

    <!-- 功能卡片区域 -->
    <div class="space-y-4 mt-12">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="bg-white rounded-design p-5 shadow-sm transform transition-transform active:scale-98"
        @click="item.onClick"
      >
        <div class="flex items-center">
          <div
            class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mr-4"
          >
            <van-icon :name="item.icon" class="text-xl text-brand-500" />
          </div>
          <span class="text-surface-600">{{ item.title }}</span>
          <van-icon name="arrow" class="ml-auto text-surface-400" />
        </div>
      </div>
    </div>

    <!-- 版本信息 -->
    <div class="mt-12 text-center">
      <p class="text-surface-400 text-sm">Version {{ version }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { configWxShare } from "@/api/wx";
import { checkWxSdkAvailable } from "@/utils/wx-sdk";
import { ref, onMounted } from "vue";

const router = useRouter();
const userStore = useUserStore();
const version = ref(process.env.VUE_APP_VERSION || "1.0.0");

// 配置分享
onMounted(async () => {
  const isAvailable = await checkWxSdkAvailable();
  if (!isAvailable) {
    console.log("微信 JS-SDK 不可用，跳过分享配置");
    return;
  }

  configWxShare({
    title: "欢迎来到 Companion",
    desc: `${userStore.userInfo?.nickname} 邀请你一起来体验`,
  });
});

const menuItems = [
  {
    title: "个人信息",
    icon: "user-o",
    onClick: () => router.push("/user"),
  },
  {
    title: "退出登录",
    icon: "close",
    onClick: () => {
      userStore.logout();
      router.replace("/login");
    },
  },
];
</script>
