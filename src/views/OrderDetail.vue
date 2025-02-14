<template>
  <div class="min-h-screen bg-surface-50">
    <!-- 订单状态卡片 -->
    <div class="p-4">
      <div class="bg-white rounded-2xl p-6 shadow-lg">
        <!-- 状态标题 -->
        <div class="flex items-center justify-between">
          <span class="text-xl font-medium text-surface-800">{{
            orderInfo.title
          }}</span>
          <van-tag :type="getStatusType(orderInfo.status)" round size="medium">
            {{ getStatusText(orderInfo.status) }}
          </van-tag>
        </div>

        <!-- 下单时间 -->
        <div class="mt-4 flex items-center text-surface-500 text-sm">
          <van-icon name="clock-o" class="mr-2" />
          <span>下单时间：{{ formatTime(orderInfo.createTime) }}</span>
        </div>

        <!-- 店员信息 -->
        <div class="mt-4 flex items-center">
          <van-image
            round
            width="56"
            height="56"
            :src="orderInfo.seller?.avatar"
            class="border-2 border-white shadow-md"
          />
          <div class="ml-4 flex-1">
            <div class="text-lg font-medium text-surface-800">
              {{ orderInfo.seller?.name }}
            </div>
            <div class="flex items-center gap-1 mt-1 overflow-hidden">
              <span
                v-for="tag in orderInfo.seller?.tags?.slice(0, 2)"
                :key="tag"
                class="inline-block px-1.5 py-0.5 text-xs bg-surface-50 text-surface-500 rounded-full whitespace-nowrap overflow-hidden text-ellipsis"
                style="max-width: 4rem"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <!-- 根据订单状态显示不同按钮 -->
          <template v-if="orderInfo.status === 'pending'">
            <van-button
              round
              size="small"
              class="remind-btn"
              @click="handleRemind"
            >
              催一催
            </van-button>
          </template>
          <template v-if="orderInfo.status === 'processing'">
            <van-button
              round
              size="small"
              class="complaint-btn"
              @click="handleComplaint"
            >
              投诉店员
            </van-button>
          </template>
          <template v-if="orderInfo.status === 'completed'">
            <van-button
              round
              size="small"
              class="reward-btn"
              @click="handleReward"
            >
              打赏店员
            </van-button>
          </template>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="mt-4 bg-white rounded-2xl p-6 shadow-lg">
        <div class="text-surface-600 font-medium mb-4">订单信息</div>
        <div class="space-y-4">
          <div class="flex justify-between text-sm">
            <span class="text-surface-500">订单编号</span>
            <span class="text-surface-800">{{ orderInfo.id }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-surface-500">服务金额</span>
            <span class="text-brand-500 font-medium"
              >¥{{ orderInfo.price }}</span
            >
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-8 space-y-4">
        <!-- 待服务状态 -->
        <template v-if="orderInfo.status === 'pending'">
          <van-button block round class="cancel-btn" @click="handleCancel">
            取消订单
          </van-button>
          <!-- 取消订单说明 -->
          <div class="mt-4 text-sm text-surface-500 leading-relaxed">
            <p>温馨提示：</p>
            <p>• 取消订单后，支付金额将原路退回，优惠券和折扣将自动返还</p>
            <p>• 仅可在下单后5分钟内取消订单</p>
            <p>• 每天最多可取消3次订单</p>
          </div>
        </template>

        <!-- 服务中状态 -->
        <template v-if="orderInfo.status === 'processing'">
          <!-- 服务进度 -->
          <div class="bg-white rounded-2xl p-6 shadow-lg mb-4">
            <div
              class="flex items-center justify-between text-sm text-surface-500 mb-2"
            >
              <span>服务进行中</span>
              <span>{{ formatDuration(orderInfo.startTime) }}</span>
            </div>
            <div class="h-1 bg-surface-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-brand-500 rounded-full"
                style="width: 60%"
              ></div>
            </div>
            <div class="mt-2 text-xs text-surface-400 text-right">
              预计剩余 20 分钟
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="space-y-3">
            <van-button block round class="contact-btn" @click="handleContact">
              联系客服
            </van-button>

            <van-button
              block
              round
              class="finish-btn"
              @click="handleFinishService"
            >
              确认结束服务
            </van-button>
          </div>

          <!-- 服务说明 -->
          <div class="mt-4 text-sm text-surface-500 leading-relaxed">
            <p>温馨提示：</p>
            <p>• 服务结束需要双方确认才能完成</p>
            <p>• 如遇问题可联系客服协调或选择投诉</p>
          </div>
        </template>

        <!-- 已完成状态 -->
        <template v-if="orderInfo.status === 'completed'">
          <!-- 评价打分区域 -->
          <div class="bg-white rounded-2xl p-6 shadow-lg mb-4">
            <div class="flex items-center justify-between">
              <span class="text-surface-600 font-medium">服务评价</span>
              <span class="text-xs text-surface-400">
                完成时间：{{ formatTime(orderInfo.finishTime) }}
              </span>
            </div>
            <div class="mt-4">
              <!-- 评分区域 -->
              <div class="flex justify-center items-center">
                <van-rate
                  v-model="orderInfo.rating"
                  color="#f59e0b"
                  void-icon="star"
                  void-color="#e5e7eb"
                  :readonly="orderInfo.hasComment"
                  :disabled="orderInfo.hasComment"
                  :size="32"
                />
                <span class="ml-3 text-base text-surface-500">
                  {{ orderInfo.rating || 5 }}.0 分
                </span>
              </div>

              <!-- 评价按钮 -->
              <div class="mt-8" v-if="!orderInfo.hasComment">
                <van-button
                  block
                  round
                  class="action-btn"
                  @click="handleComment"
                >
                  提交评价
                </van-button>
                <div class="mt-2 text-xs text-surface-400 text-center">
                  评价后将无法修改，请谨慎评分
                </div>
              </div>
              <div class="mt-4 text-sm text-brand-500 text-center" v-else>
                已评价，感谢您的反馈
              </div>
            </div>
          </div>

          <!-- 操作按钮组 -->
          <div class="space-y-3">
            <!-- 次要操作 -->
            <div class="grid grid-cols-2 gap-3">
              <van-button
                block
                round
                class="secondary-btn"
                @click="handleBookAgain"
              >
                再来一单
              </van-button>
              <van-button
                block
                round
                class="secondary-btn"
                @click="handleFavorite"
              >
                收藏店员
              </van-button>
            </div>
          </div>

          <!-- 温馨提示 -->
          <div class="mt-4 text-sm text-surface-500 leading-relaxed">
            <p>温馨提示：</p>
            <p>• 收藏店员后可第一时间获知档期</p>
          </div>
        </template>

        <!-- 申诉中状态 -->
        <template v-if="orderInfo.status === 'appeal'">
          <!-- 申诉进度 -->
          <div class="bg-white rounded-2xl p-6 shadow-lg mb-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-surface-600 font-medium">申诉进度</span>
              <span class="text-xs text-surface-400">
                申诉时间：{{ formatTime(orderInfo.appealTime) }}
              </span>
            </div>

            <!-- 进度步骤 -->
            <div class="relative">
              <div
                class="absolute left-[15px] top-0 bottom-0 w-[1px] bg-surface-100"
              ></div>
              <div class="space-y-6">
                <!-- 申诉递交 -->
                <div class="flex items-start">
                  <div
                    class="w-8 h-8 rounded-full bg-brand-500 flex-shrink-0 flex items-center justify-center"
                  >
                    <van-icon name="records" class="text-white text-sm" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-surface-800">
                      申诉递交
                    </div>
                    <div class="mt-1 text-xs text-surface-500">
                      您的申诉已提交，我们会尽快处理
                    </div>
                  </div>
                </div>

                <!-- 官方审核 -->
                <div class="flex items-start">
                  <div
                    class="w-8 h-8 rounded-full bg-brand-500 flex-shrink-0 flex items-center justify-center"
                  >
                    <van-icon name="shield-o" class="text-white text-sm" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-surface-800">
                      官方审核
                    </div>
                    <div class="mt-1 text-xs text-surface-500">
                      正在审核您的申诉材料
                    </div>
                  </div>
                </div>

                <!-- 客服处理 -->
                <div class="flex items-start opacity-50">
                  <div
                    class="w-8 h-8 rounded-full bg-surface-200 flex-shrink-0 flex items-center justify-center"
                  >
                    <van-icon name="service-o" class="text-white text-sm" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-surface-400">
                      客服处理
                    </div>
                    <div class="mt-1 text-xs text-surface-400">
                      等待客服介入处理
                    </div>
                  </div>
                </div>

                <!-- 申诉完成 -->
                <div class="flex items-start opacity-50">
                  <div
                    class="w-8 h-8 rounded-full bg-surface-200 flex-shrink-0 flex items-center justify-center"
                  >
                    <van-icon name="checked" class="text-white text-sm" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-surface-400">
                      申诉完成
                    </div>
                    <div class="mt-1 text-xs text-surface-400">
                      等待处理结果
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <van-button
            block
            round
            class="contact-btn"
            @click="handleAppealDetail"
          >
            联系客服
          </van-button>

          <!-- 温馨提示 -->
          <div class="mt-4 text-sm text-surface-500 leading-relaxed">
            <p>温馨提示：</p>
            <p>• 申诉处理预计需要1-3个工作日</p>
            <p>• 如有疑问可随时联系客服咨询进度</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast, showDialog } from "vant";
import confetti from "canvas-confetti";
import HeadImg1 from "@/assets/test/HeadImg-1.jpg";
import HeadImg2 from "@/assets/test/HeadImg-2.jpg";
import HeadImg3 from "@/assets/test/HeadImg-3.jpg";
import HeadImg4 from "@/assets/test/HeadImg-4.jpg";

const route = useRoute();
const router = useRouter();
const orderId = route.params.id;

// 模拟订单数据
const mockOrders = {
  O2024030101: {
    id: "O2024030101",
    title: "倾听服务",
    status: "pending",
    price: 68.0,
    createTime: "2024-03-01 14:30",
    seller: {
      id: 1,
      name: "浅夏微凉",
      tags: ["善解人意", "温暖治愈", "倾听者"],
      avatar: HeadImg1,
    },
  },
  O2024030102: {
    id: "O2024030102",
    title: "情感咨询",
    status: "processing",
    price: 128.0,
    createTime: "2024-03-01 15:30",
    seller: {
      id: 2,
      name: "暖阳晴空",
      tags: ["专业认证", "经验丰富", "耐心细致"],
      avatar: HeadImg2,
    },
  },
  O2024030103: {
    id: "O2024030103",
    title: "心理疏导",
    status: "completed",
    price: 98.0,
    createTime: "2024-03-01 16:30",
    finishTime: "2024-03-01 17:30",
    rating: 5,
    hasComment: false,
    seller: {
      id: 3,
      name: "星河漫步",
      tags: ["心理专家", "情绪管理", "正向引导"],
      avatar: HeadImg3,
    },
  },
  O2024030104: {
    id: "O2024030104",
    title: "一对一倾听",
    status: "appeal",
    price: 88.0,
    createTime: "2024-03-01 17:30",
    appealTime: "2024-03-01 18:30",
    appealStep: 2,
    seller: {
      id: 4,
      name: "晚樱初雪",
      tags: ["情感专家", "暖心治愈", "知心姐姐"],
      avatar: HeadImg4,
    },
  },
};

const orderInfo = ref(null);

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

// 催一催
const handleRemind = () => {
  showDialog({
    title: "催一催",
    message: "是否提醒店员尽快开始服务？",
    confirmButtonText: "确认",
    confirmButtonColor: "#14b8a6",
  }).then(() => {
    // TODO: 调用催单接口
    showToast({
      message: "已提醒店员",
      type: "success",
    });
  });
};

// 投诉店员
const handleComplaint = () => {
  showDialog({
    title: "投诉店员",
    message: "您确定要投诉该店员吗？投诉后客服会尽快处理。",
    confirmButtonText: "确认投诉",
    confirmButtonColor: "#ef4444",
  }).then(() => {
    // TODO: 跳转到投诉页面
    showToast("投诉功能开发中...");
  });
};

// 取消订单
const handleCancel = () => {
  // 检查是否在可取消时间内
  const orderTime = new Date(orderInfo.value.createTime);
  const now = new Date();
  const diffMinutes = (now - orderTime) / 1000 / 60;

  if (diffMinutes > 5) {
    showToast({
      message: "已超过可取消时间",
      type: "warning",
    });
    return;
  }

  showDialog({
    title: "取消订单",
    message: "确认取消订单吗？取消后支付金额将原路退回",
    confirmButtonText: "确认取消",
    confirmButtonColor: "#ef4444",
  }).then(() => {
    // TODO: 调用取消订单接口
    // 1. 检查今日取消次数
    // 2. 发起退款
    // 3. 返还优惠券
    showToast({
      message: "订单已取消",
      type: "success",
    });
    router.back();
  });
};

// 评价服务
const handleComment = () => {
  showDialog({
    title: "提交评价",
    message: "评价提交后将无法修改，是否确认？",
    confirmButtonText: "确认提交",
    confirmButtonColor: "#14b8a6",
  }).then(() => {
    // TODO: 调用评价接口
    orderInfo.value.hasComment = true;
    // 显示礼花效果
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#14b8a6", "#f59e0b", "#ec4899", "#8b5cf6"],
    });
    showToast({
      message: "评价成功",
      type: "success",
    });
  });
};

// 查看申诉
const handleAppealDetail = () => {
  // TODO: 跳转到申诉详情页面
  showToast("申诉功能开发中...");
};

// 打赏店员
const handleReward = () => {
  showDialog({
    title: "打赏店员",
    message: "感谢店员的优质服务",
    confirmButtonText: "确认打赏",
    confirmButtonColor: "#14b8a6",
  }).then(() => {
    // TODO: 跳转到打赏页面
    showToast("打赏功能开发中...");
  });
};

// 格式化服务时长
const formatDuration = (startTime) => {
  if (!startTime) return "0分钟";
  const start = new Date(startTime);
  const now = new Date();
  const minutes = Math.floor((now - start) / 1000 / 60);
  return `${minutes}分钟`;
};

// 联系客服
const handleContact = () => {
  // TODO: 跳转到客服页面
  showToast("客服功能开发中...");
};

// 确认结束服务
const handleFinishService = () => {
  showDialog({
    title: "结束服务",
    message: "确认服务已完成？需要店员也确认后才能完成订单",
    confirmButtonText: "确认完成",
    confirmButtonColor: "#14b8a6",
  }).then(() => {
    // TODO: 调用确认完成接口
    showToast({
      message: "已确认，等待店员确认",
      type: "success",
    });
  });
};

// 再来一单
const handleBookAgain = () => {
  showDialog({
    title: "再来一单",
    message: "是否预约相同的服务？",
    confirmButtonText: "确认预约",
    confirmButtonColor: "#14b8a6",
  }).then(() => {
    // TODO: 跳转到预约页面，带上当前店员和服务信息
    showToast("预约功能开发中...");
  });
};

// 收藏店员
const handleFavorite = () => {
  showDialog({
    title: "收藏店员",
    message: h("div", [
      h("p", "收藏后可以更方便地找到Ta"),
      h("textarea", {
        class: "w-full p-2 border rounded mt-3 text-sm",
        placeholder: "添加备注（选填，仅自己可见）",
        rows: 3,
      }),
    ]),
    confirmButtonText: "确认收藏",
    confirmButtonColor: "#14b8a6",
  }).then(() => {
    // TODO: 调用收藏接口
    showToast({
      message: "收藏成功",
      type: "success",
    });
  });
};

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    // TODO: 实现获取订单详情接口
    // const { data } = await getOrderDetail(orderId);
    // orderInfo.value = data;

    // 模拟从后端获取数据
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockOrder = mockOrders[orderId];

    if (!mockOrder) {
      showToast({
        message: "订单不存在",
        type: "error",
      });
      router.back();
      return;
    }

    orderInfo.value = mockOrder;
  } catch (error) {
    console.error("获取订单详情失败:", error);
    showToast({
      message: "获取订单详情失败",
      type: "error",
    });
  }
};

onMounted(() => {
  fetchOrderDetail();
});
</script>

<style scoped>
.remind-btn {
  @apply bg-brand-50 border-none text-brand-500;
}

.remind-btn:active {
  @apply bg-brand-100;
}

.complaint-btn {
  @apply bg-red-50 border-none text-red-500;
}

.complaint-btn:active {
  @apply bg-red-100;
}

.action-btn {
  @apply bg-gradient-to-r from-brand-500 to-brand-400 border-none shadow-lg;
}

.action-btn:active {
  @apply opacity-90 shadow-md;
}

.cancel-btn {
  @apply bg-white border-red-200 text-red-500;
}

.cancel-btn:active {
  @apply bg-red-50;
}

.contact-btn {
  @apply bg-gradient-to-r from-brand-500 to-brand-400 border-none text-white shadow-lg;
}

.contact-btn:active {
  @apply opacity-90 shadow-md;
}

.finish-btn {
  @apply bg-white border-brand-200 text-brand-500;
}

.finish-btn:active {
  @apply bg-brand-50;
}

.secondary-btn {
  @apply bg-white border-surface-200 text-surface-600;
}

.secondary-btn:active {
  @apply bg-surface-50;
}
</style>
