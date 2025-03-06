<template>
  <div class="min-h-screen bg-gradient-to-b from-surface-50 to-white">
    <!-- 顶部标题 -->
    <div class="relative px-4 pt-6 pb-8">
      <div
        class="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent"
      ></div>
      <div class="relative flex items-center gap-3">
        <van-icon name="heart-o" class="text-brand-500 text-xl" />
        <div>
          <div class="text-xl font-medium text-surface-800">心动匹配</div>
          <div class="mt-1 text-sm text-surface-400">
            让我们帮你找到最合适的倾听者
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="px-4 pb-24 space-y-4">
      <!-- 服务类型选择 -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-surface-100"
      >
        <div class="flex items-center gap-2 mb-5">
          <van-icon name="star" class="text-brand-500 text-lg" />
          <span class="text-base font-medium text-surface-800"
            >选择服务类型</span
          >
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="service in services"
            :key="service.id"
            class="relative p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            :class="[
              selectedServices.includes(service.id)
                ? 'border-brand-500 bg-brand-50/50'
                : 'border-surface-100 hover:border-brand-200',
            ]"
            @click="toggleService(service.id)"
          >
            <div class="flex items-center gap-3">
              <van-icon :name="service.icon" class="text-lg text-brand-500" />
              <span class="text-sm font-medium">{{ service.name }}</span>
            </div>
            <div class="mt-2 text-xs text-surface-400">
              {{ service.description }}
            </div>
            <!-- 选中标记 -->
            <div
              v-if="selectedServices.includes(service.id)"
              class="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center shadow-md"
            >
              <van-icon name="success" class="text-white text-xs" />
            </div>
          </div>
        </div>
      </div>

      <!-- 店员特征筛选 -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-surface-100"
      >
        <div class="flex items-center gap-2 mb-5">
          <van-icon name="friends-o" class="text-brand-500 text-lg" />
          <span class="text-base font-medium text-surface-800">店员特征</span>
        </div>

        <!-- 性别偏好 -->
        <div>
          <div class="text-sm text-surface-600 mb-3">性别偏好</div>
          <van-radio-group
            v-model="preferredGender"
            direction="horizontal"
            class="gap-4"
          >
            <van-radio name="any" checked-color="#14b8a6">不限</van-radio>
            <van-radio name="female" checked-color="#14b8a6">女生</van-radio>
            <van-radio name="male" checked-color="#14b8a6">男生</van-radio>
          </van-radio-group>
        </div>
      </div>

      <!-- 时间和价格设置 -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-surface-100"
      >
        <div class="flex items-center gap-2 mb-5">
          <van-icon name="clock-o" class="text-brand-500 text-lg" />
          <span class="text-base font-medium text-surface-800">时间和价格</span>
        </div>

        <!-- 服务时长 -->
        <div class="mb-6">
          <div class="text-sm text-surface-600 mb-3">服务时长</div>
          <van-radio-group
            v-model="duration"
            direction="horizontal"
            class="gap-4"
          >
            <van-radio name="30" checked-color="#14b8a6">30分钟</van-radio>
            <van-radio name="60" checked-color="#14b8a6">1小时</van-radio>
            <van-radio name="day" checked-color="#14b8a6">包天</van-radio>
          </van-radio-group>
        </div>

        <!-- 价格区间 -->
        <div>
          <div class="flex justify-between mb-3">
            <span class="text-sm text-surface-600">价格区间</span>
            <span class="text-sm font-medium text-brand-500">
              <van-icon name="gold-coin-o" class="mr-1" />
              {{ priceRange[0] }} - {{ priceRange[1] }}
            </span>
          </div>
          <van-slider
            v-model="priceRange"
            range
            :min="0"
            :max="500"
            :step="10"
            bar-height="6px"
            active-color="#14b8a6"
            inactive-color="#e2e8f0"
          />
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div
      class="fixed bottom-[56px] left-0 right-0 px-4 py-3 bg-white/80 backdrop-blur-sm border-t border-surface-100"
    >
      <div class="flex gap-3">
        <van-button
          class="flex-1 h-12 rounded-full text-base font-medium transition-all duration-300 bg-surface-50 text-surface-600 border border-surface-100 hover:bg-surface-100 hover:-translate-y-0.5"
          @click="handleOrder"
        >
          <van-icon name="shopping-cart-o" class="mr-1" />
          直接下单
        </van-button>
        <van-button
          class="flex-1 h-12 rounded-full text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
          :class="[
            canSubmit
              ? 'bg-gradient-to-r from-brand-500 to-brand-400 border-none text-white hover:opacity-90'
              : 'bg-surface-50 text-surface-400 border border-surface-100',
          ]"
          :disabled="!canSubmit"
          @click="handleMatch"
        >
          <van-icon name="magic" class="mr-1" />
          开启匹配
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { showToast } from "vant";

// 服务类型列表
const services = [
  {
    id: 1,
    name: "文字语音条",
    icon: "chat-o",
    description: "温暖文字/语音陪伴",
  },
  {
    id: 2,
    name: "语音聊天",
    icon: "phone-o",
    description: "实时语音交流",
  },
  {
    id: 3,
    name: "情绪咨询",
    icon: "heart-o",
    description: "专业情绪疏导",
  },
  {
    id: 4,
    name: "虚拟恋爱",
    icon: "like-o",
    description: "温暖恋爱体验",
  },
];

// 表单数据
const selectedServices = ref([]);
const preferredGender = ref("any");
const duration = ref("60");
const priceRange = ref([50, 200]);

// 切换服务类型选择
const toggleService = (id) => {
  const index = selectedServices.value.indexOf(id);
  if (index === -1) {
    selectedServices.value.push(id);
  } else {
    selectedServices.value.splice(index, 1);
  }
};

// 判断是否可以提交
const canSubmit = computed(() => {
  return selectedServices.value.length > 0;
});

// 处理匹配按钮点击
const handleMatch = () => {
  // TODO: 实现匹配逻辑
  showToast("匹配功能开发中...");
};

// 处理直接下单按钮点击
const handleOrder = () => {
  if (selectedServices.value.length === 0) {
    showToast("请至少选择一个服务类型");
    return;
  }
  // TODO: 实现下单逻辑
  showToast("下单功能开发中...");
};
</script>

<style scoped>
:deep(.van-slider) {
  margin: 10px 0;
}

:deep(.van-radio) {
  margin-right: 0;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.3s;
}

:deep(.van-radio--checked) {
  background: #f0fdf4;
  border-color: #14b8a6;
}

:deep(.van-radio__label) {
  color: #475569;
  margin-left: 8px;
}

/* 修复服务类型卡片的选中状态 */
.border-brand-500 {
  border-color: #14b8a6;
}

.bg-brand-50 {
  background-color: #f0fdf4;
}

.hover\:border-brand-200:hover {
  border-color: #a7f3d0;
}

/* 修复价格滑块颜色 */
:deep(.van-slider__button) {
  background-color: #14b8a6;
  border-color: #14b8a6;
}

:deep(.van-slider__button-wrapper) {
  box-shadow: 0 2px 4px rgba(20, 184, 166, 0.2);
}

/* 修复底部按钮样式 */
.van-button--default {
  border-color: #e2e8f0;
}

.van-button--default:active {
  background-color: #f1f5f9;
}
</style>
