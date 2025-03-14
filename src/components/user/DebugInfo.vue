<template>
  <div class="mt-8">
    <van-collapse
      v-model="activeNames"
      class="rounded-design overflow-hidden bg-white"
    >
      <van-collapse-item title="调试信息" name="1">
        <div class="p-4 bg-surface-50 rounded-b-design">
          <pre
            class="text-sm font-mono text-surface-600 whitespace-pre-wrap break-all"
          >
            {{ JSON.stringify(userInfo, null, 2) }}
          </pre>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  userInfo: {
    type: Object,
    default: () => ({}),
  },
});

const activeNames = ref([]);
</script>
