<template>
  <div class="bg-white shadow-sm">
    <van-tabs v-model:active="activeTab" sticky animated>
      <van-tab
        v-for="tab in tabs"
        :key="tab.value"
        :title="tab.title"
        :badge="tab.badge"
      >
        <div class="bg-white min-h-screen">
          <OrderListPanel
            :type="tab.value"
            :is-seller="isSeller"
            :orders="getOrdersByType(tab.value)"
            @refresh="refreshBadge"
          />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import OrderListPanel from "./OrderListPanel.vue";
import HeadImg1 from "@/assets/test/HeadImg-1.jpg";
import HeadImg2 from "@/assets/test/HeadImg-2.jpg";
import HeadImg3 from "@/assets/test/HeadImg-3.jpg";
import { useUserStore } from "@/store/modules/user";

const props = defineProps({
  isSeller: {
    type: Boolean,
    default: false,
  },
});

const userStore = useUserStore();

// 测试数据
const orderData = {
  pending: [
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
  ],
  processing: [
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
  ],
  completed: [
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
  ],
  appeal: [
    {
      id: "O2024030104",
      title: "心理咨询",
      status: "appeal",
      price: 128.0,
      createTime: "2024-03-01 16:30",
      seller: {
        id: 3,
        name: "星河漫步",
        avatar: HeadImg3,
      },
    },
  ],
};

// 标签页配置
const defaultTabs = [
  { title: "待服务", value: "pending", badge: "" },
  { title: "服务中", value: "processing", badge: "" },
  { title: "已结束", value: "completed", badge: "" },
  { title: "申诉中", value: "appeal", badge: "" },
];

const sellerTabs = [
  ...defaultTabs,
  { title: "我的", value: "mine", badge: "" },
];

const tabs = computed(() => (props.isSeller ? sellerTabs : defaultTabs));

const activeTab = ref(0);

// 根据类型获取订单列表
const getOrdersByType = (type) => {
  // TODO: 调用后端接口获取订单列表
  if (type === "mine") {
    // 合并所有与店员相关的订单
    return Object.values(orderData)
      .flat()
      .filter(
        (order) =>
          order.seller.id === userStore.userInfo.id ||
          order.userId === userStore.userInfo.id
      );
  }
  return orderData[type] || [];
};

// 刷新角标数量
const refreshBadge = (type, count) => {
  const tab = tabs.value.find((t) => t.value === type);
  if (tab) {
    tab.badge = count > 0 ? count.toString() : "";
  }
};

// 初始化加载各状态订单数量
const initBadgeCounts = async () => {
  try {
    // 使用测试数据的长度作为角标数量
    Object.entries(orderData).forEach(([type, orders]) => {
      refreshBadge(type, orders.length);
    });
  } catch (error) {
    console.error("获取订单数量失败:", error);
  }
};

// 页面加载时初始化数据
initBadgeCounts();
</script>

<style scoped>
:deep(.van-tabs__wrap) {
  @apply border-b border-surface-100;
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
</style>
