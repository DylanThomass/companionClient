<template>
  <div class="min-h-screen bg-background-light">
    <!-- 顶部标题 -->
    <div class="relative px-md pt-xl pb-lg">
      <div
        class="absolute top-0 left-0 right-0 h-32 bg-primary-light opacity-10 rounded-b-[30px] -z-10"
      ></div>
      <div class="flex items-center gap-sm">
        <div
          class="w-10 h-10 rounded-full bg-primary-light opacity-20 flex items-center justify-center"
        >
          <van-icon name="like" class="text-xl text-primary" />
        </div>
        <div>
          <h1 class="text-xl font-medium text-text-primary">心动匹配</h1>
          <p class="text-sm text-text-secondary mt-xs">
            让我们帮你找到最合适的倾听者
          </p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="px-md pb-24 space-y-md">
      <!-- 服务类型选择 -->
      <div class="card">
        <div class="card-header">
          <div class="card-icon">
            <van-icon name="star" />
          </div>
          <span>选择服务类型</span>
        </div>
        <div class="grid grid-cols-2 gap-sm">
          <div
            v-for="service in services"
            :key="service.id"
            class="service-card"
            :class="{
              'service-card-active': selectedServices.includes(service.id),
            }"
            @click="toggleService(service.id)"
          >
            <div class="flex items-center gap-xs">
              <van-icon :name="service.icon" class="text-lg text-primary" />
              <span class="text-sm font-medium text-text-primary">{{
                service.name
              }}</span>
            </div>
            <div class="mt-xs text-xs text-text-secondary">
              {{ service.description }}
            </div>
            <!-- 选中标记 -->
            <div
              v-if="selectedServices.includes(service.id)"
              class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm"
            >
              <van-icon name="success" class="text-white text-xs" />
            </div>
          </div>
        </div>
      </div>

      <!-- 店员特征筛选 -->
      <div class="card">
        <div class="card-header">
          <div class="card-icon">
            <van-icon name="friends-o" />
          </div>
          <span>店员特征</span>
        </div>

        <!-- 性别偏好 -->
        <div>
          <div class="text-sm text-text-secondary mb-sm">性别偏好</div>
          <div class="custom-radio-group">
            <div
              class="custom-radio"
              :class="{ 'custom-radio-active': preferredGender === 'any' }"
              @click="preferredGender = 'any'"
            >
              <span>不限</span>
            </div>
            <div
              class="custom-radio"
              :class="{ 'custom-radio-active': preferredGender === 'female' }"
              @click="preferredGender = 'female'"
            >
              <span>女生</span>
            </div>
            <div
              class="custom-radio"
              :class="{ 'custom-radio-active': preferredGender === 'male' }"
              @click="preferredGender = 'male'"
            >
              <span>男生</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间和价格设置 -->
      <div class="card">
        <div class="card-header">
          <div class="card-icon">
            <van-icon name="clock-o" />
          </div>
          <span>时间和价格</span>
        </div>

        <!-- 服务时长 -->
        <div class="mb-lg">
          <div class="text-sm text-text-secondary mb-sm">服务时长</div>
          <div class="custom-radio-group">
            <div
              class="custom-radio"
              :class="{ 'custom-radio-active': duration === '30' }"
              @click="duration = '30'"
            >
              <span>30分钟</span>
            </div>
            <div
              class="custom-radio"
              :class="{ 'custom-radio-active': duration === '60' }"
              @click="duration = '60'"
            >
              <span>1小时</span>
            </div>
            <div
              class="custom-radio"
              :class="{ 'custom-radio-active': duration === 'day' }"
              @click="duration = 'day'"
            >
              <span>包天</span>
            </div>
          </div>
        </div>

        <!-- 价格区间 -->
        <div>
          <div class="flex justify-between mb-sm">
            <span class="text-sm text-text-secondary">价格区间</span>
            <span class="text-sm font-medium text-primary flex items-center">
              <van-icon name="gold-coin-o" class="mr-xs" />
              {{ priceRange[0] }} - {{ priceRange[1] }}元
            </span>
          </div>
          <van-slider
            v-model="priceRange"
            range
            :min="0"
            :max="500"
            :step="10"
          />
          <div class="flex justify-between mt-xs">
            <span class="text-xs text-text-secondary">0元</span>
            <span class="text-xs text-text-secondary">500元</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="fixed-bottom safe-area-bottom">
      <div class="flex gap-sm px-md py-sm bg-background border-t border-border">
        <van-button plain block class="order-button" @click="handleOrder">
          <template #icon>
            <van-icon name="shopping-cart-o" class="mr-xs" />
          </template>
          直接下单
        </van-button>
        <van-button
          type="primary"
          block
          class="match-button"
          :disabled="!canSubmit"
          @click="handleMatch"
        >
          <template #icon>
            <van-icon name="magic" class="mr-xs" />
          </template>
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
/* 卡片样式 */
.card {
  @apply bg-background rounded-lg p-md shadow-sm mb-md;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.card-header {
  @apply flex items-center text-text-primary font-medium mb-md;
}

.card-icon {
  @apply w-6 h-6 rounded-md flex items-center justify-center mr-xs;
  background-color: rgba(20, 184, 166, 0.1);
}

.card-icon .van-icon {
  @apply text-primary text-sm;
}

/* 服务卡片 */
.service-card {
  @apply relative p-md rounded-lg border border-border cursor-pointer transition-all duration-base;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.service-card-active {
  @apply border-primary;
  background-color: rgba(20, 184, 166, 0.05);
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.1);
}

/* 自定义单选按钮 */
.custom-radio-group {
  @apply flex flex-wrap gap-sm;
}

.custom-radio {
  @apply px-md py-xs rounded-full border border-border text-text-secondary text-sm cursor-pointer transition-all duration-fast;
}

.custom-radio-active {
  @apply border-primary text-primary;
  background-color: rgba(20, 184, 166, 0.05);
}

/* 固定底部 */
.fixed-bottom {
  @apply fixed bottom-0 left-0 right-0 z-10;
}

/* 按钮样式 */
.order-button {
  @apply rounded-lg border-border text-text-secondary;
}

.match-button {
  @apply rounded-lg;
  background: linear-gradient(
    to right,
    var(--c-primary),
    var(--c-primary-light)
  );
  border: none;
}

.match-button:disabled {
  @apply bg-background-light text-text-secondary border border-border;
  background: var(--c-background-light);
}

/* 滑块样式 */
:deep(.van-slider) {
  margin: 10px 0;
}

:deep(.van-slider__button) {
  background-color: var(--c-primary);
  border-color: var(--c-primary);
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.2);
  width: 20px;
  height: 20px;
}

:deep(.van-slider__bar) {
  background-color: var(--c-primary);
  height: 4px;
}

:deep(.van-slider__runway) {
  height: 4px;
}
</style>
