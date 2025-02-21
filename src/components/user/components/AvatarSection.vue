<template>
  <div class="relative">
    <div class="w-16 h-16 rounded-full overflow-hidden shadow-lg">
      <img
        :src="avatarUrl"
        :alt="nickname"
        class="w-full h-full object-cover"
        @error="$emit('error', $event)"
      />
    </div>
    <div
      v-if="firstTag"
      class="absolute -bottom-2 -right-2 bg-brand-500 text-white px-2 py-0.5 text-xs rounded-full shadow-md tag-rotate"
    >
      {{ firstTag }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  avatarUrl: String,
  nickname: String,
  firstTag: String,
});

defineEmits(["error"]);
</script>

<style scoped>
.tag-rotate {
  transform: rotate(-12deg);
}
</style>
