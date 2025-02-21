<template>
  <div class="mt-4 grid grid-cols-3 gap-4">
    <div class="text-center">
      <div class="text-lg font-medium text-surface-900">
        {{ stats.balance }}
      </div>
      <div class="text-xs text-surface-500">余额</div>
    </div>
    <div class="text-center">
      <div class="text-lg font-medium text-surface-900">
        {{ stats.coupons }}
      </div>
      <div class="text-xs text-surface-500">优惠券</div>
    </div>
    <div class="text-center">
      <div class="text-lg font-medium text-surface-900">
        {{ stats.signInDays }}
      </div>
      <div class="text-xs text-surface-500">签到天数</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
  },
});
</script>
