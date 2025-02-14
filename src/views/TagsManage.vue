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
            :key="tag"
            class="px-3 py-1.5 bg-brand-50 rounded-full flex items-center group"
            @click="removeTag(tag)"
          >
            <span class="text-sm text-brand-500">{{ tag }}</span>
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
            v-for="tag in recommendTags"
            :key="tag"
            class="px-3 py-1.5 bg-surface-50 rounded-full cursor-pointer transition-colors duration-300"
            :class="[
              selectedTags.includes(tag)
                ? 'bg-brand-50 text-brand-500'
                : 'text-surface-600 hover:bg-surface-100',
            ]"
            @click="toggleTag(tag)"
          >
            <span class="text-sm">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- 自定义标签 -->
      <div class="mt-6 bg-white rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <span class="text-surface-600 font-medium">自定义标签</span>
          <van-tag type="primary" size="medium" round>会员功能</van-tag>
        </div>
        <div class="space-y-4">
          <van-field
            v-model="customTag"
            placeholder="输入自定义标签（不超过10字）"
            :rules="[{ pattern: /^[^\s]{1,10}$/, message: '标签长度1-10字' }]"
            :disabled="!isVip"
            class="custom-field"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                class="add-btn"
                :disabled="!isVip || !customTag"
                @click="handleAddCustomTag"
              >
                添加
              </van-button>
            </template>
          </van-field>
          <div v-if="!isVip" class="text-sm text-surface-400">
            开通会员即可使用自定义标签功能
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { useUserStore } from "@/store/modules/user";
import { getDictByType, getSensitiveWords } from "@/api/system";

const router = useRouter();
const userStore = useUserStore();
const submitting = ref(false);
const customTag = ref("");
const isVip = computed(() => userStore.userInfo?.isVip || false);

// 已选标签
const selectedTags = ref(userStore.userInfo?.tags || []);

// 推荐标签列表
const recommendTags = ref([]);

// 获取系统标签
const fetchSystemTags = async () => {
  try {
    // TODO: 后端接口开发中，暂时使用模拟数据
    /*
    const { data } = await getDictByType("USER_TAGS");
    // 处理返回的数据字典
    if (Array.isArray(data)) {
      recommendTags.value = data
        .filter((item) => item.status === "0") // 只使用启用的标签
        .map((item) => item.label || item.dictLabel);
    }
    */
    recommendTags.value = [
      "乐观开朗",
      "善解人意",
      "倾听者",
      "温暖治愈",
      "细心周到",
      "耐心细致",
      "阳光活力",
      "知心姐姐",
      "贴心暖男",
      "情感专家",
    ];
  } catch (error) {
    console.error("获取系统标签失败:", error);
    showToast({
      message: "获取标签列表失败",
      type: "error",
    });
  }
};

// 页面加载时获取系统标签
fetchSystemTags();

// 切换标签
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else if (selectedTags.value.length < 5) {
    selectedTags.value.push(tag);
  } else {
    showToast({
      message: "最多选择5个标签",
      type: "warning",
    });
  }
};

// 移除标签
const removeTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  }
};

// 添加自定义标签
const handleAddCustomTag = async () => {
  const tag = customTag.value.trim();

  // 检查标签是否合法
  if (!tag) {
    showToast({ message: "请输入标签内容", type: "warning" });
    return;
  }

  if (tag.length > 10) {
    showToast({ message: "标签最多10个字", type: "warning" });
    return;
  }

  // 检查是否包含敏感词
  // TODO: 后端接口开发中，暂时使用本地敏感词列表
  /*
  try {
    const { data: sensitiveWords } = await getSensitiveWords();
    if (sensitiveWords.some((word) => tag.includes(word))) {
      showToast({ message: "标签包含不当词语", type: "warning" });
      return;
    }
  } catch (error) {
    console.error("获取敏感词失败:", error);
  }
  */
  const sensitiveWords = ["傻", "笨", "滚", "死", "操", "草"];
  if (sensitiveWords.some((word) => tag.includes(word))) {
    showToast({ message: "标签包含不当词语", type: "warning" });
    return;
  }

  // 检查是否重复
  if (selectedTags.value.includes(tag)) {
    showToast({ message: "标签已存在", type: "warning" });
    return;
  }

  // 添加标签
  if (selectedTags.value.length >= 5) {
    showToast({ message: "最多选择5个标签", type: "warning" });
    return;
  }

  selectedTags.value.push(tag);
  customTag.value = "";
  showToast({ message: "添加成功", type: "success" });
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
    // TODO: 后端接口开发中，暂时使用延时模拟
    // 1. 实现保存标签接口 POST /user/tags
    // 2. 更新用户信息缓存
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast({
      message: "保存成功",
      type: "success",
    });
    router.back();
  } catch (error) {
    showToast({
      message: "保存失败，请重试",
      type: "error",
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

.custom-field :deep(.van-field__control) {
  @apply bg-surface-50 rounded-lg px-3 py-2;
}

.add-btn {
  @apply ml-2 bg-brand-500 border-none;
}

.add-btn:active {
  @apply opacity-90;
}
</style>
