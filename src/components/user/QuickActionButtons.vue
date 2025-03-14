<template>
  <div class="grid grid-cols-3 gap-3">
    <!-- 签到按钮 -->
    <div
      class="bg-white rounded-xl p-4 shadow-lg text-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
      @click="$emit('sign-in')"
    >
      <van-icon name="sign" class="text-2xl text-brand-500" />
      <div class="mt-2 text-sm text-surface-600 whitespace-nowrap">
        {{ todaySignIn ? "已签到" : "每日签到" }}
      </div>
    </div>

    <!-- 标签管理 -->
    <div
      class="bg-white rounded-xl p-4 shadow-lg text-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
      @click="$emit('manage-tags')"
    >
      <van-icon name="label-o" class="text-2xl text-brand-500" />
      <div class="mt-2 text-sm text-surface-600 whitespace-nowrap">
        标签管理
      </div>
    </div>

    <!-- 根据角色显示不同按钮 -->
    <div
      class="bg-white rounded-xl p-4 shadow-lg text-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
      @click="$emit('user-action')"
    >
      <van-icon
        :name="isSeller ? 'setting-o' : 'shop-collect-o'"
        class="text-2xl text-brand-500"
      />
      <div class="mt-2 text-sm text-surface-600 whitespace-nowrap">
        {{ isSeller ? "装修主页" : "成为店员" }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  todaySignIn: {
    type: Boolean,
    default: false,
  },
  isSeller: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["sign-in", "manage-tags", "user-action"]);
</script>
