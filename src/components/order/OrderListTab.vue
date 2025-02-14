<template>
  <div class="space-y-4 py-4">
    <div
      v-for="order in orders"
      :key="order.id"
      class="bg-white rounded-2xl p-4 shadow-lg"
      @click="handleOrderClick(order)"
    >
      <!-- 订单头部 -->
      <div class="flex items-center justify-between">
        <span class="text-lg font-medium text-surface-800">{{
          order.title
        }}</span>
        <van-tag :type="getStatusType(order.status)" round>
          {{ getStatusText(order.status) }}
        </van-tag>
      </div>

      <!-- 店员信息 -->
      <div class="flex items-center mt-4">
        <van-image
          round
          width="40"
          height="40"
          :src="order.seller.avatar"
          class="border-2 border-white shadow"
        />
        <div class="ml-3">
          <div class="text-surface-800">{{ order.seller.name }}</div>
          <div class="text-sm text-surface-500">
            下单时间: {{ formatTime(order.createTime) }}
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="mt-4 flex items-center justify-between text-sm">
        <span class="text-surface-500">订单号: {{ order.id }}</span>
        <span class="text-brand-500 font-medium">¥{{ order.price }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  orders: {
    type: Array,
    default: () => [],
  },
});

// 格式化时间
const formatTime = (time) => {
  if (!time) return "";
  // 只保留到分钟
  return time.split(":").slice(0, 2).join(":");
};

// 获取状态标签类型
const getStatusType = (status) => {
  const types = {
    pending: "warning",
    processing: "primary",
    completed: "success",
    appeal: "danger",
  };
  return types[status] || "default";
};

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    pending: "待服务",
    processing: "服务中",
    completed: "已结束",
    appeal: "申诉中",
  };
  return texts[status] || status;
};

// 点击订单
const handleOrderClick = (order) => {
  router.push(`/order/${order.id}`);
};
</script>
