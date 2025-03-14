<template>
  <div class="bg-white/60 backdrop-blur rounded-2xl p-4 shadow-lg">
    <div class="text-sm text-surface-500 mb-3 flex items-center">
      <van-icon name="upgrade" class="mr-1 text-brand-400" />
      即将推出
    </div>
    <div class="grid grid-cols-2 gap-3">
      <!-- 邀请好友 -->
      <div
        class="flex items-center p-3 border border-dashed border-surface-300 rounded-xl cursor-not-allowed opacity-75"
      >
        <van-icon name="friends-o" class="text-xl text-surface-400" />
        <span class="ml-2 text-surface-500 text-sm">邀请好友</span>
        <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
      </div>
      <!-- AI角色管理 -->
      <div
        class="flex items-center p-3 border border-dashed border-surface-300 rounded-xl cursor-not-allowed opacity-75"
      >
        <van-icon name="friends" class="text-xl text-surface-400" />
        <span class="ml-2 text-surface-500 text-sm">AI角色管理</span>
        <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
      </div>
      <!-- 创业加盟 -->
      <div
        class="flex items-center p-3 border border-dashed border-surface-300 rounded-xl cursor-not-allowed opacity-75"
      >
        <van-icon name="shop" class="text-xl text-surface-400" />
        <span class="ml-2 text-surface-500 text-sm">创业加盟</span>
        <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
      </div>
      <!-- 社区活动 -->
      <div
        class="flex items-center p-3 border border-dashed border-surface-300 rounded-xl cursor-not-allowed opacity-75"
      >
        <van-icon name="cluster" class="text-xl text-surface-400" />
        <span class="ml-2 text-surface-500 text-sm">社区活动</span>
        <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
      </div>
      <!-- 积分商城 -->
      <div
        class="flex items-center p-3 border border-dashed border-surface-300 rounded-xl cursor-not-allowed opacity-75"
      >
        <van-icon name="gift" class="text-xl text-surface-400" />
        <span class="ml-2 text-surface-500 text-sm">积分商城</span>
        <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
      </div>
    </div>
    <!-- 退出登录按钮 -->
    <div class="mt-6">
      <van-button block round class="btn-danger" @click="$emit('logout')">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup>
defineEmits(["logout"]);
</script>

<style scoped>
.btn-danger {
  @apply bg-danger-500 border-danger-500;
}

.btn-danger:active {
  @apply bg-danger-600 border-danger-600;
}

.btn-danger :deep(.van-button__text) {
  @apply text-white font-medium text-lg;
}
</style>
