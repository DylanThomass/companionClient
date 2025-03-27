<template>
  <div class="relative bg-white rounded-2xl p-4 shadow-lg overflow-hidden">
    <!-- 性别标识 -->
    <div
      class="absolute top-5 -right-8 w-28 text-center py-1 text-xs font-medium transform rotate-45 shadow-sm"
      :class="[
        userInfo?.sex === 0
          ? 'bg-blue-500 text-white'
          : 'bg-pink-500 text-white',
      ]"
    ></div>

    <div class="flex items-center">
      <!-- 头像区域 -->
      <div class="relative flex-shrink-0 w-24 self-end">
        <van-image
          round
          width="96"
          height="96"
          :src="avatarUrl"
          :alt="userInfo?.nickname"
          class="border-4 border-white shadow-lg"
          @error="onImageError"
        >
          <template #error>
            <div
              class="w-[96px] h-[96px] rounded-full bg-surface-100 flex items-center justify-center"
            >
              <van-icon
                name="user-circle-o"
                size="48"
                class="text-surface-400"
              />
            </div>
          </template>
        </van-image>
        <!-- 标签角标 -->
        <div
          v-if="userTags && userTags.length > 0"
          style="transform: rotate(-12deg)"
          class="absolute -bottom-2 right-0 px-2 py-1 bg-white rounded-full shadow-lg"
        >
          <span class="text-xs text-brand-500">
            #{{ userTags[0]?.tag || "" }}
          </span>
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="flex-1 px-4 flex flex-col justify-between h-[96px]">
        <!-- 昵称区域 -->
        <div class="text-2xl font-semibold text-surface-800 mt-4">
          {{ userInfo?.nickname || "亲爱的用户" }}
        </div>
        <!-- 地域信息 -->
        <div class="flex items-center text-surface-500 text-sm mb-4">
          <van-icon name="location-o" class="mr-1" />
          <span>{{ userInfo?.province }} {{ userInfo?.city }}</span>
        </div>
      </div>

      <!-- 编辑按钮 -->
      <div class="flex-shrink-0 self-center">
        <van-button class="edit-btn" round size="small" @click="$emit('edit')">
          <template #icon>
            <van-icon name="edit" class="text-sm" />
          </template>
          编辑
        </van-button>
      </div>
    </div>

    <!-- 经验值进度条 -->
    <div class="mt-6 space-y-2">
      <div class="flex items-center justify-between">
        <span
          class="px-2 py-0.5 bg-brand-100 text-brand-500 rounded-full text-xs font-medium"
        >
          {{ userVipInfo.levelName || "暂无等级" }}
        </span>
        <span class="text-brand-500 font-medium">
          {{ userVipInfo.experience }} / {{ userVipInfo.expNext }}
        </span>
      </div>
      <div class="h-2 bg-surface-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-300"
          :style="{
            width: `${(userVipInfo.experience / userVipInfo.expNext) * 100}%`,
          }"
        ></div>
      </div>
    </div>

    <!-- 用户数据统计 -->
    <div
      class="mt-4 flex items-center justify-between border-t border-b border-surface-100 py-4"
    >
      <div
        class="flex-1 text-center border-r border-surface-100 group cursor-pointer"
      >
        <div class="text-lg font-semibold text-brand-500">
          ¥ {{ userOtherInfo.balance || 1000 }}
        </div>
        <div
          class="text-xs text-surface-500 group-hover:text-brand-500 transition-colors"
        >
          余额
        </div>
      </div>
      <div
        class="flex-1 text-center border-r border-surface-100 group cursor-pointer"
      >
        <div class="text-lg font-semibold text-brand-500">
          {{ userOtherInfo.couponCount || 10 }}
        </div>
        <div
          class="text-xs text-surface-500 group-hover:text-brand-500 transition-colors"
        >
          卡券
        </div>
      </div>
      <div
        class="flex-1 text-center border-r border-surface-100 group cursor-pointer"
      >
        <div class="text-lg font-semibold text-brand-500">
          {{ userOtherInfo.consecutiveSignInDays }}
        </div>
        <div
          class="text-xs text-surface-500 group-hover:text-brand-500 transition-colors"
        >
          签到
        </div>
      </div>
      <div class="flex-1 text-center group cursor-pointer">
        <div class="text-lg font-semibold text-brand-500">
          {{ userOtherInfo.validInvitations }}
        </div>
        <div
          class="text-xs text-surface-500 group-hover:text-brand-500 transition-colors"
        >
          邀请
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/store/modules/user";
const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({}),
  },
  userVipInfo: {
    type: Object,
    default: () => ({}),
  },
  userOtherInfo: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(["edit"]);
const userStore = useUserStore();

// 头像地址
const avatarUrl = computed(() => props.userInfo?.avatarUrl);
const userTags = computed(() => userStore.userSelectedTags);

// 图片加载错误处理
const onImageError = (error) => {
  console.error("图片加载失败:", error);
};
</script>

<style scoped>
.edit-btn {
  @apply bg-white/90 backdrop-blur text-surface-600 border-surface-200;
}

.edit-btn:active {
  @apply bg-surface-50;
}

.edit-btn :deep(.van-button__text) {
  @apply text-sm font-normal;
}
</style>
