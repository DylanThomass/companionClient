<template>
  <div class="min-h-screen bg-surface-50">
    <OrderTabs :is-seller="userStore.isSeller" />
  </div>
</template>

<script setup>
import OrderTabs from "@/components/order/OrderTabs.vue";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
</script>

<style scoped>
:deep(.van-tabs__wrap) {
  @apply bg-white shadow-sm;
}

:deep(.van-tabs__nav) {
  @apply bg-transparent;
}

:deep(.van-tab) {
  @apply text-surface-500;
}

:deep(.van-tab--active) {
  @apply text-brand-500 font-medium;
}

:deep(.van-tabs__line) {
  @apply bg-brand-500;
}

:deep(.van-empty) {
  @apply py-12;
}
</style>
