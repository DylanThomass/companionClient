<template>
  <div class="login-page">
    <!-- 顶部标题 -->
    <div class="px-4 py-8 text-center">
      <h1 class="text-2xl font-bold text-gray-800">{{ title }}</h1>
      <p class="mt-2 text-gray-600">欢迎回来，请登录您的账号</p>
    </div>

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" class="px-4">
      <van-cell-group inset>
        <!-- 用户名输入框 -->
        <van-field
          v-model="formData.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
          :disabled="loading"
        >
          <template #left-icon>
            <van-icon name="user-o" />
          </template>
        </van-field>

        <!-- 密码输入框 -->
        <van-field
          v-model="formData.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
          :disabled="loading"
        >
          <template #left-icon>
            <van-icon name="lock" />
          </template>
        </van-field>
      </van-cell-group>

      <!-- 提交按钮 -->
      <div class="mt-6">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :loading="loading"
          loading-text="登录中..."
        >
          登录
        </van-button>
      </div>

      <!-- 其他操作 -->
      <div class="mt-4 flex justify-between px-2">
        <span
          class="text-sm text-gray-600 cursor-pointer"
          @click="handleForgetPassword"
        >
          忘记密码
        </span>
        <span
          class="text-sm text-gray-600 cursor-pointer"
          @click="handleRegister"
        >
          注册账号
        </span>
      </div>

      <!-- 在登录按钮下方添加 -->
      <div class="mt-4">
        <van-divider>其他登录方式</van-divider>
        <div class="flex justify-center">
          <van-button
            round
            icon="wechat"
            color="#07c160"
            class="w-12 h-12"
            @click="handleWxLogin"
          />
        </div>
      </div>
    </van-form>

    <!-- 底部说明 -->
    <div class="mt-8 px-4 text-center text-gray-500 text-sm">
      登录即表示同意
      <van-button type="text" size="mini" class="!p-0" @click="handleViewTerms">
        服务条款
      </van-button>
      和
      <van-button
        type="text"
        size="mini"
        class="!p-0"
        @click="handleViewPrivacy"
      >
        隐私政策
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showToast, showDialog } from "vant";
import { useUserStore } from "@/store/modules/user";
import { login } from "@/api/user";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 页面标题
const title = computed(() => process.env.VUE_APP_TITLE || "Companion");

// 表单数据
const formData = ref({
  username: "",
  password: "",
});

// 加载状态
const loading = ref(false);

// 登录提交
const onSubmit = async (values) => {
  try {
    loading.value = true;
    const res = await login(values);
    userStore.setToken(res.token);
    showToast({
      type: "success",
      message: "登录成功",
      onClose: () => {
        const redirect = route.query.redirect || "/";
        router.replace(redirect);
      },
    });
  } catch (error) {
    console.error("登录失败：", error);
  } finally {
    loading.value = false;
  }
};

// 忘记密码
const handleForgetPassword = () => {
  showToast("忘记密码功能开发中");
};

// 注册账号
const handleRegister = () => {
  showToast("注册功能开发中");
};

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
  // 确保重定向到 wx-auth 路由
  const redirectUri = encodeURIComponent(
    `${process.env.VUE_APP_WX_REDIRECT_URI}/wx-auth`
  );
  const scope = "snsapi_userinfo";
  const state = encodeURIComponent("/");

  const wxAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;

  console.log("微信授权 URL:", {
    appid,
    redirectUri: decodeURIComponent(redirectUri),
    scope,
    state: decodeURIComponent(state),
    fullUrl: wxAuthUrl,
  });

  window.location.href = wxAuthUrl;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 40px;
}

:deep(.van-field__left-icon) {
  margin-right: 6px;
}

:deep(.van-button--text) {
  color: var(--van-primary-color);
  height: auto;
  line-height: normal;
  padding: 0;
}

:deep(.van-button--text)::before {
  display: none;
}
</style>
