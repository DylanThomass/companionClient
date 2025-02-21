<template>
  <div class="mt-4">
    <div class="flex items-center justify-between mb-1">
      <span class="text-sm text-surface-600">{{ title }}</span>
      <span class="text-xs text-surface-400"> {{ exp }}/{{ nextExp }} </span>
    </div>
    <van-progress
      :percentage="(exp / nextExp) * 100"
      :stroke-width="8"
      color="linear-gradient(to right, #14b8a6, #0ea5e9)"
    />
  </div>
</template>

<script setup>
defineProps({
  title: String,
  exp: Number,
  nextExp: Number,
});
</script>
