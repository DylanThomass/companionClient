<template>
  <div class="min-h-screen bg-surface-50">
    <!-- 订单列表 -->
    <van-tabs v-model:active="activeTab" sticky swipeable>
      <van-tab title="待服务">
        <div class="p-4">
          <div v-if="pendingOrders.length > 0" class="space-y-4">
            <order-list-tab :status="'pending'" :orders="pendingOrders" />
          </div>
          <van-empty v-else description="暂无待服务订单" />
        </div>
      </van-tab>

      <van-tab title="服务中">
        <div class="p-4">
          <div v-if="processingOrders.length > 0" class="space-y-4">
            <order-list-tab :status="'processing'" :orders="processingOrders" />
          </div>
          <van-empty v-else description="暂无进行中订单" />
        </div>
      </van-tab>

      <van-tab title="已结束">
        <div class="p-4">
          <div v-if="completedOrders.length > 0" class="space-y-4">
            <order-list-tab :status="'completed'" :orders="completedOrders" />
          </div>
          <van-empty v-else description="暂无已结束订单" />
        </div>
      </van-tab>

      <van-tab title="申诉中">
        <div class="p-4">
          <div v-if="appealOrders.length > 0" class="space-y-4">
            <order-list-tab :status="'appeal'" :orders="appealOrders" />
          </div>
          <van-empty v-else description="暂无申诉订单" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import OrderListTab from "@/components/order/OrderListTab.vue";
import { showToast } from "vant";
import HeadImg1 from "@/assets/test/HeadImg-1.jpg";
import HeadImg2 from "@/assets/test/HeadImg-2.jpg";
import HeadImg3 from "@/assets/test/HeadImg-3.jpg";
import HeadImg4 from "@/assets/test/HeadImg-4.jpg";

const activeTab = ref(0);

// TODO: 从后端获取订单数据
const pendingOrders = ref([
  {
    id: "O2024030101",
    title: "倾听服务",
    status: "pending",
    price: 68.0,
    createTime: "2024-03-01 14:30",
    seller: {
      id: 1,
      name: "浅夏微凉",
      avatar: HeadImg1,
    },
  },
]);

const processingOrders = ref([
  {
    id: "O2024030102",
    title: "情感咨询",
    status: "processing",
    price: 128.0,
    createTime: "2024-03-01 15:30",
    seller: {
      id: 2,
      name: "暖阳晴空",
      avatar: HeadImg2,
    },
  },
]);

const completedOrders = ref([
  {
    id: "O2024030103",
    title: "心理疏导",
    status: "completed",
    price: 98.0,
    createTime: "2024-03-01 16:30",
    seller: {
      id: 3,
      name: "星河漫步",
      avatar: HeadImg3,
    },
  },
]);

const appealOrders = ref([
  {
    id: "O2024030104",
    title: "一对一倾听",
    status: "appeal",
    price: 88.0,
    createTime: "2024-03-01 17:30",
    seller: {
      id: 4,
      name: "晚樱初雪",
      avatar: HeadImg4,
    },
  },
]);

// 获取订单列表
const fetchOrders = async (status) => {
  try {
    // TODO: 实现获取订单列表接口
    // GET /orders?status=pending
    // const { data } = await getOrders({ status });
    // switch(status) {
    //   case 'pending':
    //     pendingOrders.value = data;
    //     break;
    //   ...
    // }
  } catch (error) {
    console.error("获取订单列表失败:", error);
    showToast({
      message: "获取订单失败，请重试",
      type: "error",
    });
  }
};

// 监听标签页切换
const onTabChange = (index) => {
  const statusMap = ["pending", "processing", "completed", "appeal"];
  fetchOrders(statusMap[index]);
};

onMounted(() => {
  // 初始加载待服务订单
  fetchOrders("pending");
});
</script>

<style scoped>
:deep(.van-tabs__wrap) {
  @apply bg-white shadow-sm;
}

:deep(.van-tabs__nav) {
  @apply bg-transparent;
}

:deep(.van-tab) {
  @apply text-surface-500;
}

:deep(.van-tab--active) {
  @apply text-brand-500 font-medium;
}

:deep(.van-tabs__line) {
  @apply bg-brand-500;
}

:deep(.van-empty) {
  @apply py-12;
}
</style>
