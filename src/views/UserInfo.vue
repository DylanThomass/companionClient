<template>
  <div class="min-h-screen bg-surface-50 px-6 py-12">
    <!-- 用户信息卡片 -->
    <div class="bg-white rounded-design shadow-sm overflow-hidden">
      <!-- 头像和昵称区域 -->
      <div class="p-8 bg-gradient-to-br from-brand-300 to-brand-400">
        <div class="flex items-center space-x-6">
          <van-image
            round
            width="88"
            height="88"
            :src="userStore.userInfo?.headimgurl"
            :alt="userStore.userInfo?.nickname"
            class="flex-shrink-0 border-4 border-white/50 shadow-lg"
          >
            <template #error>
              <div
                class="w-[88px] h-[88px] rounded-full bg-white/20 flex items-center justify-center"
              >
                <van-icon name="user-circle-o" size="44" class="text-white" />
              </div>
            </template>
          </van-image>
          <div class="flex-1">
            <h2 class="text-2xl font-semibold text-white">
              {{ userStore.userInfo?.nickname || "亲爱的用户" }}
            </h2>
            <p class="mt-2 text-white/80">
              {{ userStore.userInfo?.country }}
              {{ userStore.userInfo?.province }}
            </p>
          </div>
        </div>
      </div>

      <!-- 信息列表 -->
      <div class="divide-y divide-surface-100">
        <van-cell
          v-for="(item, index) in userInfoItems"
          :key="index"
          :title="item.label"
          :value="item.value"
          class="text-surface-600 h-16"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="mt-8 space-y-4">
      <van-button block class="btn-primary" @click="handleLogout">
        退出登录
      </van-button>
    </div>

    <!-- 调试信息 -->
    <div v-if="isDev" class="mt-8">
      <van-collapse
        v-model="activeNames"
        class="rounded-design overflow-hidden bg-white"
      >
        <van-collapse-item title="调试信息" name="1">
          <div class="p-4 bg-surface-50 rounded-b-design">
            <pre
              class="text-sm font-mono text-surface-600 whitespace-pre-wrap break-all"
            >
              {{ JSON.stringify(userStore.userInfo, null, 2) }}
            </pre>
          </div>
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

// 用户信息列表
const userInfoItems = computed(() => [
  {
    label: "昵称",
    value: userStore.userInfo?.nickname,
  },
  {
    label: "性别",
    value: userStore.userInfo?.sex === 1 ? "男" : "女",
  },
  {
    label: "地区",
    value: `${userStore.userInfo?.country} ${userStore.userInfo?.province} ${userStore.userInfo?.city}`,
  },
]);

// 退出登录
const handleLogout = () => {
  showDialog({
    title: "提示",
    message: "确定要退出登录吗？",
    confirmButtonText: "退出",
    confirmButtonColor: "#ef4444",
  }).then(() => {
    userStore.logout();
    showToast("已退出登录");
    router.replace("/login");
  });
};
</script>

<style scoped>
.btn-primary {
  @apply bg-brand-500 border-brand-500;
}

.btn-primary:active {
  @apply bg-brand-600 border-brand-600;
}

.btn-primary :deep(.van-button__text) {
  @apply text-white font-medium text-lg;
}
</style>
