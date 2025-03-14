<template>
  <div class="bg-white/95 backdrop-blur rounded-xl p-3 shadow-lg">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <span
          class="w-2 h-2 rounded-full mr-2"
          :class="[
            modelValue ? 'bg-success-500 animate-pulse' : 'bg-surface-300',
          ]"
        />
        <span class="text-base font-medium">{{
          modelValue ? "在线接单" : "暂停接单"
        }}</span>
      </div>
      <van-switch
        :model-value="modelValue"
        size="20px"
        active-color="#10b981"
        @change="$emit('update:modelValue', $event)"
      />
    </div>
    <div class="mt-1 text-xs text-surface-500">
      {{ modelValue ? "当前状态：可以接受新的订单" : "当前状态：暂时无法接单" }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

defineEmits(["update:modelValue"]);
</script>
