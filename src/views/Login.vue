<template>
  <div class="fixed inset-0 bg-background flex flex-col overflow-hidden">
    <!-- 主要内容区域 -->
    <div class="flex-1 flex flex-col items-center justify-center px-4 mb-5">
      <!-- Logo 和标题 -->
      <div class="flex items-center gap-2 mb-10">
        <div
          class="w-[70px] h-[70px] mx-auto rounded-full bg-primary/5 flex items-center justify-center"
        >
          <van-icon name="like" class="text-6xl text-primary" />
        </div>
        <div class="text-center">
          <h1 class="text-3xl font-medium text-text-primary mb-1">Companion</h1>
          <p class="text-sm text-text-secondary">让温暖永远相伴</p>
        </div>
      </div>

      <!-- 欢迎文字 -->
      <div class="w-full max-w-[280px] text-center mb-10">
        <p class="text-lg text-text-primary mb-1">欢迎回来</p>
        <p class="text-sm text-text-secondary">
          您的贴心情感伙伴，随时倾听与陪伴
        </p>
      </div>

      <!-- 微信登录按钮 -->
      <div class="w-full max-w-[280px] mb-5">
        <van-button
          block
          size="large"
          class="!bg-[#07c160] !border-[#07c160] !h-11 !rounded-md"
          @click="handleWxLogin"
        >
          <template #icon>
            <van-icon name="wechat" class="text-lg mr-1 text-white" />
          </template>
          <span class="text-white">微信一键登录</span>
        </van-button>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="p-4 text-center mb-5">
      <!-- 服务条款 -->
      <div class="text-xs text-text-secondary mb-2">
        登录即代表您同意
        <span class="text-primary px-1" @click="handleViewTerms">服务条款</span>
        和
        <span class="text-primary px-1" @click="handleViewPrivacy"
          >隐私政策</span
        >
      </div>

      <!-- 版权信息 -->
      <p class="text-xs text-text-secondary opacity-70">© 2023 Companion</p>

      <!-- 开发环境工具 -->
      <div v-if="isDev" class="mt-1">
        <span class="text-xs text-primary opacity-70" @click="handleClearCache">
          清理缓存
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showToast, showDialog } from "vant";
import { useUserStore } from "@/store/modules/user";
import testAvatar from "@/assets/test/HeadImg.jpg";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 是否为开发环境
const isDev = computed(() => process.env.NODE_ENV === "development");

// 清理缓存
const handleClearCache = () => {
  try {
    localStorage.clear();
    sessionStorage.clear();
    userStore.logout();
    showToast({ type: "success", message: "缓存已清理" });
  } catch (error) {
    console.error("清理缓存失败：", error);
    showToast({ type: "fail", message: "清理缓存失败" });
  }
};

// 查看服务条款
const handleViewTerms = () => {
  showDialog({
    title: "服务条款",
    message: "服务条款内容...",
    theme: "round-button",
    confirmButtonColor: "var(--c-primary)",
  });
};

// 查看隐私政策
const handleViewPrivacy = () => {
  showDialog({
    title: "隐私政策",
    message: "隐私政策内容...",
    theme: "round-button",
    confirmButtonColor: "var(--c-primary)",
  });
};

// 微信登录
const handleWxLogin = () => {
  // 开发环境直接模拟登录
  if (isDev) {
    const mockUserInfo = {
      openid: "oZdZL6hs_Jn4yFiJ2GWUuQyR0DhE",
      nickname: "开发测试",
      sex: 1,
      province: "广东",
      city: "深圳",
      country: "中国",
      headimgurl: testAvatar,
      privilege: [],
    };
    userStore.setUserInfo(mockUserInfo);
    userStore.setToken("dev_token");
    router.replace("/");
    return;
  }

  // 构建微信授权 URL
  const appid = process.env.VUE_APP_WX_APPID;
  const redirectUri = encodeURIComponent(
    `${process.env.VUE_APP_WX_REDIRECT_URI}/wx-auth`
  );
  const scope = "snsapi_userinfo";
  const redirect = route.query.redirect || "/";
  const state = encodeURIComponent(redirect);

  const wxAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;

  window.location.href = wxAuthUrl;
};

// 页面加载时检查缓存状态
onMounted(() => {
  if (isDev) {
    const cacheInfo = {
      localStorage: { ...localStorage },
      token: localStorage.getItem("token"),
      userInfo: userStore.userInfo,
    };
    console.log("当前缓存状态：", cacheInfo);
  }
});
</script>
