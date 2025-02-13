<template>
  <div class="min-h-screen bg-surface-50 px-6 py-12">
    <!-- 顶部标题 -->
    <div class="text-center mb-16">
      <h1 class="text-3xl font-semibold text-surface-800">Companion</h1>
      <p class="mt-3 text-surface-500">让温暖永远相伴</p>
    </div>

    <!-- 微信登录按钮 -->
    <div class="mt-12">
      <van-button
        block
        class="btn-wechat h-14 rounded-design"
        @click="handleWxLogin"
      >
        <template #icon>
          <van-icon name="wechat" class="text-white text-2xl mr-2" />
        </template>
        <span class="text-white font-medium text-lg">微信一键登录</span>
      </van-button>
    </div>

    <!-- 服务条款 -->
    <div class="mt-8 text-center text-sm text-surface-500">
      登录即代表您同意
      <span
        class="text-brand-400 hover:text-brand-500 cursor-pointer transition-colors"
        @click="handleViewTerms"
      >
        服务条款
      </span>
      和
      <span
        class="text-brand-400 hover:text-brand-500 cursor-pointer transition-colors"
        @click="handleViewPrivacy"
      >
        隐私政策
      </span>
    </div>

    <!-- 开发环境下显示清理缓存按钮 -->
    <div v-if="isDev" class="mt-8 text-center">
      <van-button
        class="btn-secondary !h-10 !text-base"
        @click="handleClearCache"
      >
        清理缓存
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showToast, showDialog } from "vant";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 页面标题
const title = computed(() => process.env.VUE_APP_TITLE || "Companion");

// 是否为开发环境
const isDev = computed(() => process.env.NODE_ENV === "development");

// 清理缓存
const handleClearCache = () => {
  try {
    // 清理 localStorage
    localStorage.clear();
    // 清理 sessionStorage
    sessionStorage.clear();
    // 清理 userStore
    userStore.logout();

    showToast({
      type: "success",
      message: "缓存已清理",
      onClose: () => {
        // 刷新页面
        window.location.reload();
      },
    });
  } catch (error) {
    console.error("清理缓存失败：", error);
    showToast({
      type: "fail",
      message: "清理缓存失败",
    });
  }
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

// 查看服务条款
const handleViewTerms = () => {
  showDialog({
    title: "服务条款",
    message: "服务条款内容...",
  });
};

// 查看隐私政策
const handleViewPrivacy = () => {
  showDialog({
    title: "隐私政策",
    message: "隐私政策内容...",
  });
};

// 微信登录
const handleWxLogin = () => {
  // 构建微信授权 URL
  const appid = process.env.VUE_APP_WX_APPID;
  const redirectUri = encodeURIComponent(
    `${process.env.VUE_APP_WX_REDIRECT_URI}/wx-auth`
  );
  const scope = "snsapi_userinfo";
  const redirect = route.query.redirect || "/";
  const state = encodeURIComponent(redirect);

  const wxAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;

  // 调试信息
  if (isDev) {
    console.log("微信登录配置：", {
      appid,
      redirectUri: decodeURIComponent(redirectUri),
      scope,
      state: decodeURIComponent(state),
    });
    console.log("完整授权URL：", wxAuthUrl);
  }

  window.location.href = wxAuthUrl;
};
</script>

<style scoped>
.btn-wechat {
  @apply bg-[#07c160] border-[#07c160];
}

.btn-wechat:active {
  @apply bg-[#06ad56] border-[#06ad56];
}
</style>
