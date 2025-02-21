<template>
  <van-button size="small" class="edit-btn" round @click="handleClick">
    编辑
  </van-button>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const handleClick = () => {
  router.push("/user/edit");
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
