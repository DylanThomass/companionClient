<template>
  <div class="ml-4 flex-1">
    <div class="text-lg font-medium text-surface-900">
      {{ nickname }}
    </div>
    <div class="text-sm text-surface-500">{{ province }} {{ city }}</div>
  </div>
</template>

<script setup>
defineProps({
  nickname: String,
  province: String,
  city: String,
});
</script>
