<template>
  <div class="min-h-screen bg-surface-50">
    <!-- 标签内容区 -->
    <div class="p-4">
      <!-- 已选标签 -->
      <div class="bg-white rounded-2xl p-6 shadow-lg">
        <div class="text-surface-600 font-medium mb-4">已选标签</div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(tag, index) in selectedTags"
            :key="tag?.id || index"
            class="px-3 py-1.5 bg-brand-50 rounded-full flex items-center group"
            @click="removeTag(tag)"
          >
            <span class="text-sm text-brand-500">{{ tag?.tag }}</span>
            <van-icon
              name="cross"
              class="ml-1 text-xs text-brand-400 group-hover:text-brand-500"
            />
          </div>
          <div
            v-if="!selectedTags.length"
            class="text-sm text-surface-400 py-4"
          >
            还没有选择标签哦
          </div>
        </div>
      </div>

      <!-- 推荐标签 -->
      <div class="mt-6 bg-white rounded-2xl p-6 shadow-lg">
        <div class="text-surface-600 font-medium mb-4">推荐标签</div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="tag in systemTags"
            :key="tag.id"
            class="px-3 py-1.5 rounded-full cursor-pointer transition-colors duration-300"
            :class="isTagSelected(tag) ? 'bg-brand-50' : 'bg-surface-50'"
            @click="toggleTag(tag)"
          >
            <span
              class="text-sm"
              :class="{ 'text-brand-500': isTagSelected(tag) }"
              >{{ tag.tag }}</span
            >
          </div>
          <div v-if="!systemTags.length" class="text-sm text-surface-400 py-4">
            加载系统标签中...
          </div>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="mt-8">
        <van-button
          block
          round
          class="btn-primary"
          :loading="submitting"
          @click="handleSave"
        >
          保存
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { useUserStore } from "@/store/modules/user";
import { updateUserTag } from "@/api/system";

const router = useRouter();
const userStore = useUserStore();
const submitting = ref(false);

// 已选标签 - 使用本地状态管理，方便修改
const selectedTags = ref([]);

// 初始化已选标签
onMounted(() => {
  // 从store中获取用户已选标签
  if (userStore.userTags && userStore.userTags.length > 0) {
    selectedTags.value = [...userStore.userTags];
  }

  // 如果系统标签为空，则尝试获取
  if (userStore.systemTags.length === 0) {
    fetchSystemTags();
  }
});

// 获取系统标签
const fetchSystemTags = async () => {
  try {
    await userStore.fetchSystemTags();
    console.log("系统标签加载完成:", userStore.systemTags);
  } catch (error) {
    console.error("获取系统标签失败:", error);
    showToast({
      message: "获取标签列表失败",
      type: "fail",
    });
  }
};

// 系统标签列表
const systemTags = computed(() => userStore.systemTags);

// 检查标签是否已选择
const isTagSelected = (tag) => {
  return selectedTags.value.some((t) => t.id === tag.id);
};

// 切换标签
const toggleTag = (tag) => {
  if (isTagSelected(tag)) {
    removeTag(tag);
  } else {
    addTag(tag);
  }
};

// 添加标签
const addTag = (tag) => {
  if (selectedTags.value.length >= 5) {
    showToast({
      message: "最多选择5个标签",
      type: "warning",
    });
    return;
  }

  // 检查是否已存在
  if (!isTagSelected(tag)) {
    selectedTags.value.push(tag);
  }
};

// 移除标签
const removeTag = (tag) => {
  const index = selectedTags.value.findIndex((t) => t.id === tag.id);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  }
};

// 保存标签
const handleSave = async () => {
  if (selectedTags.value.length < 1) {
    showToast({
      message: "请至少选择1个标签",
      type: "warning",
    });
    return;
  }

  submitting.value = true;
  try {
    const params = {
      userId: userStore.userId,
      tagList: selectedTags.value.map((tag) => tag.id),
    };
    console.log("保存标签:", params);
    await updateUserTag(params);

    // 更新store中的用户标签
    userStore.updateUserTags(selectedTags.value);

    showToast({
      message: "保存成功",
      type: "success",
    });
    router.back();
  } catch (error) {
    console.error("保存标签失败:", error);
    showToast({
      message: "保存失败，请重试",
      type: "fail",
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.btn-primary {
  @apply bg-gradient-to-r from-brand-500 to-brand-400 border-none shadow-lg;
}

.btn-primary:active {
  @apply opacity-90 shadow-md;
}

.btn-primary :deep(.van-button__text) {
  @apply text-white font-medium text-base;
}
</style>
