<template>
  <div class="p-4 space-y-3">
    <div
      v-for="order in orders"
      :key="order.id"
      class="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
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
          class="border-2 border-white shadow-sm"
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

      <!-- 操作按钮 -->
      <div
        v-if="getActionButtons(order).length > 0"
        class="mt-4 flex justify-end space-x-2"
      >
        <van-button
          v-for="action in getActionButtons(order)"
          :key="action.text"
          size="small"
          :type="action.type"
          round
          @click.stop="action.onClick"
        >
          {{ action.text }}
        </van-button>
      </div>
    </div>

    <!-- 空状态 -->
    <van-empty v-if="orders.length === 0" :description="getEmptyText(type)" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";

const router = useRouter();

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  isSeller: {
    type: Boolean,
    default: false,
  },
  orders: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["refresh"]);

// const orders = ref([]);
const loading = ref(false);

// 获取订单列表
const fetchOrders = async () => {
  // TODO: 接口调用暂时注释
  // const api = props.type === "mine" ? getMyOrders : getOrders;
  // const response = await api({
  //   type: props.type,
  // });
  // orders.value = response.data;
  // emit("refresh", props.type, response.total);
  // try {
  //   loading.value = true;
  //   const api = props.type === "mine" ? getMyOrders : getOrders;
  //   const response = await api({
  //     type: props.type,
  //   });
  //   orders.value = response.data;
  //   emit("refresh", props.type, response.total);
  // } catch (error) {
  //   console.error("获取订单列表失败:", error);
  //   showToast("获取订单列表失败");
  // } finally {
  //   loading.value = false;
  // }
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

// 获取空状态文本
const getEmptyText = (type) => {
  const texts = {
    pending: "暂无待服务订单",
    processing: "暂无进行中订单",
    completed: "暂无已结束订单",
    appeal: "暂无申诉订单",
    mine: "暂无相关订单",
  };
  return texts[type] || "暂无订单";
};

// 格式化时间
const formatTime = (time) => {
  if (!time) return "";
  // 只保留到分钟
  return time.split(":").slice(0, 2).join(":");
};

// 获取操作按钮
const getActionButtons = (order) => {
  if (props.isSeller) {
    switch (order.status) {
      case "pending":
        return [
          {
            text: "开始服务",
            type: "primary",
            onClick: () => handleStartService(order),
          },
        ];
      case "processing":
        return [
          {
            text: "结束服务",
            type: "primary",
            onClick: () => handleEndService(order),
          },
        ];
      default:
        return [];
    }
  }

  // 用户视角的按钮
  switch (order.status) {
    case "pending":
      return [
        {
          text: "取消订单",
          type: "danger",
          onClick: () => handleCancelOrder(order),
        },
      ];
    case "completed":
      return [
        {
          text: "申请售后",
          type: "warning",
          onClick: () => handleAfterSale(order),
        },
      ];
    default:
      return [];
  }
};

// 点击订单
const handleOrderClick = (order) => {
  router.push(`/order/${order.id}`);
};

// 初始化
onMounted(() => {
  fetchOrders();
});

// 店员操作方法
const handleStartService = async (order) => {
  try {
    await startService(order.id);
    showToast({
      message: "服务已开始",
      type: "success",
    });
    fetchOrders();
  } catch (error) {
    console.error("开始服务失败:", error);
    showToast({
      message: "操作失败",
      type: "fail",
    });
  }
};

const handleEndService = async (order) => {
  try {
    await endService(order.id);
    showToast({
      message: "服务已结束",
      type: "success",
    });
    fetchOrders();
  } catch (error) {
    console.error("结束服务失败:", error);
    showToast({
      message: "操作失败",
      type: "fail",
    });
  }
};
</script>
