<template>
  <div class="relative z-10 pt-12">
    <!-- 装饰背景 -->
    <div class="absolute top-0 -left-6 -right-6 h-48">
      <div
        class="absolute inset-0 bg-gradient-to-br from-teal-400 via-cyan-500 to-brand-500 h-56"
      >
        <div
          class="absolute inset-0 bg-gradient-to-t from-white/20 via-white/5 to-transparent"
        ></div>
        <div
          class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent"
        ></div>
      </div>
    </div>

    <div class="relative bg-white rounded-2xl p-4 shadow-lg overflow-hidden">
      <!-- 性别标识 -->
      <div
        class="absolute top-5 -right-8 w-28 text-center py-1 text-xs font-medium transform rotate-45 shadow-sm"
        :class="[
          userInfo?.sex === 0
            ? 'bg-blue-500 text-white'
            : 'bg-pink-500 text-white',
        ]"
      ></div>

      <div class="flex items-center">
        <!-- 头像区域 -->
        <AvatarSection
          :avatar-url="avatarUrl"
          :nickname="userInfo?.nickname"
          :first-tag="userTags[0]"
          @error="$emit('imageError', $event)"
        />

        <!-- 用户信息 -->
        <user-info-section
          :nickname="userInfo?.nickname"
          :province="userInfo?.province"
          :city="userInfo?.city"
        />

        <!-- 编辑按钮 -->
        <edit-button @click="$emit('edit')" />
      </div>

      <!-- 经验值进度条 -->
      <experience-bar
        :title="userLevel.title"
        :exp="userLevel.exp"
        :next-exp="userLevel.nextExp"
      />

      <!-- 用户数据统计 -->
      <stats-section :stats="userStats" />
    </div>
  </div>
</template>

<script setup>
import AvatarSection from "./components/AvatarSection.vue";
import UserInfoSection from "./components/UserInfoSection.vue";
import EditButton from "./components/EditButton.vue";
import ExperienceBar from "./components/ExperienceBar.vue";
import StatsSection from "./components/StatsSection.vue";

defineProps({
  avatarUrl: String,
  userInfo: Object,
  userTags: Array,
  userLevel: Object,
  userStats: Object,
});

defineEmits(["edit", "imageError"]);
</script>
