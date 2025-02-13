<template>
  <div class="user-info">
    <!-- 头部信息卡片 -->
    <van-cell-group inset class="user-card">
      <van-cell center title="头像" class="avatar-cell">
        <template #value>
          <van-image
            round
            width="60"
            height="60"
            :src="userStore.userInfo?.headimgurl"
            :alt="userStore.userInfo?.nickname"
          >
            <template #error>
              <van-icon name="user-circle-o" size="60" />
            </template>
          </van-image>
        </template>
      </van-cell>
      <van-cell title="昵称" :value="userStore.userInfo?.nickname" />
      <van-cell title="性别" :value="formatGender(userStore.userInfo?.sex)" />
      <van-cell title="地区" :value="formatLocation()" />
      <van-cell title="OpenID" :value="formatOpenId()" />
    </van-cell-group>

    <!-- 操作按钮组 -->
    <div class="action-buttons">
      <van-button type="primary" block @click="handleLogout"
        >退出登录</van-button
      >
    </div>

    <!-- 调试信息 -->
    <div v-if="isDev" class="debug-info">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="调试信息" name="1">
          <pre>{{ JSON.stringify(userStore.userInfo, null, 2) }}</pre>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { showToast, showDialog } from "vant";

const router = useRouter();
const userStore = useUserStore();
const activeNames = ref([]);

// 是否为开发环境
const isDev = computed(() => process.env.VUE_APP_ENV === "development");

// 格式化性别显示
const formatGender = (sex) => {
  const genderMap = {
    1: "男",
    2: "女",
    0: "未知",
  };
  return genderMap[sex] || "未知";
};

// 格式化地区显示
const formatLocation = () => {
  const { province, city } = userStore.userInfo || {};
  if (province && city && province !== city) {
    return `${province} ${city}`;
  }
  return province || city || "未知";
};

// 格式化 OpenID 显示（仅显示前后几位）
const formatOpenId = () => {
  const openid = userStore.userInfo?.openid;
  if (!openid) return "未知";
  return `${openid.slice(0, 4)}...${openid.slice(-4)}`;
};

// 退出登录
const handleLogout = () => {
  showDialog({
    title: "确认退出",
    message: "是否确认退出登录？",
    showCancelButton: true,
  }).then((action) => {
    if (action === "confirm") {
      userStore.logout();
      showToast("已退出登录");
      router.replace("/login");
    }
  });
};
</script>

<style scoped>
.user-info {
  padding: 16px;
  min-height: 100vh;
  background-color: #f7f8fa;
}

.user-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}

.avatar-cell :deep(.van-cell__value) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.action-buttons {
  margin: 24px 0;
}

.debug-info {
  margin-top: 24px;
}

.debug-info pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  line-height: 1.5;
  padding: 8px;
  margin: 0;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
