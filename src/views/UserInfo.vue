<template>
  <div class="min-h-screen bg-gradient-to-b from-surface-50 to-surface-100">
    <!-- 开发环境测试按钮 -->
    <div v-if="isDev && !isWx" class="fixed bottom-20 right-4 z-50">
      <van-button
        round
        size="small"
        type="primary"
        @click="userStore.toggleUserType()"
      >
        切换用户类型
      </van-button>
    </div>

    <!-- 用户信息卡片 -->
    <div class="relative px-6">
      <!-- 头像和昵称区域 -->
      <div class="relative z-10 pt-12">
        <!-- 装饰背景 -->
        <decorative-background />

        <!-- 用户信息内容 -->
        <user-profile-card
          :user-info="userStore.userInfo"
          :user-vip-info="userStore.userVipInfo"
          :user-other-info="userStore.userOtherInfo"
          :user-tags="userStore.userTags"
          @edit="handleEdit"
        />

        <!-- 在线状态卡片 -->
        <online-status-card
          v-if="userStore.isSeller"
          v-model="online"
          class="mt-6"
          @update:model-value="handleOnlineChange"
        />
      </div>

      <!-- 功能按钮组 -->
      <quick-action-buttons
        class="mt-6"
        :today-sign-in="userStats.todaySignIn"
        :is-seller="userStore.isSeller"
        @sign-in="handleSignIn"
        @manage-tags="handleManageTags"
        @user-action="handleUserAction"
      />

      <!-- 功能模块 -->
      <feature-modules
        class="mt-6"
        :is-seller="userStore.isSeller"
        @orders="handleOrders"
        @favorites="handleFavorites"
        @income="handleIncome"
        @customer-service="handleCustomerService"
        @clear-cache="handleClearCache"
      />

      <!-- 即将推出 -->
      <coming-soon-features class="mt-6" @logout="handleLogout" />
    </div>

    <!-- 调试信息 -->
    <debug-info v-if="isDev" :user-info="userStore.userInfo" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { showToast, showDialog } from "vant";
import { calculateUserLevel } from "@/mock";
import { isWxEnv } from "@/utils/wx-sdk";
import { updateUserInfo } from "@/api/user";

// 导入组件
import DecorativeBackground from "@/components/user/DecorativeBackground.vue";
import UserProfileCard from "@/components/user/UserProfileCard.vue";
import OnlineStatusCard from "@/components/user/OnlineStatusCard.vue";
import QuickActionButtons from "@/components/user/QuickActionButtons.vue";
import FeatureModules from "@/components/user/FeatureModules.vue";
import ComingSoonFeatures from "@/components/user/ComingSoonFeatures.vue";
import DebugInfo from "@/components/user/DebugInfo.vue";

const router = useRouter();
const userStore = useUserStore();

// ==================== 环境与状态 ====================
// 是否是开发环境
const isDev = computed(() => process.env.NODE_ENV === "development");
// 是否是微信环境
const isWx = computed(() => isWxEnv());
// 在线状态
const online = ref(true);

// ==================== 用户数据 ====================
// 用户等级信息
const userLevel = computed(() => {
  // TODO: 从后端获取用户经验值
  return calculateUserLevel(700);
});

// 用户统计信息
const userStats = userStore.userOtherInfo;

// const sellerStats = userStore.sellerStats;

// ==================== 生命周期钩子 ====================
onMounted(async () => {
  if (userStore.isLoggedIn) {
    try {
      await userStore.getUserInfo();
      await userStore.getUserVipInfo();
      await userStore.getUserOtherInfo();
    } catch (error) {
      console.error("初始化用户数据失败:", error);
      showToast({
        message: "加载用户数据失败",
        type: "fail",
      });
    }
  }
});

// ==================== 事件处理方法 ====================
// 签到
const handleSignIn = async () => {
  if (userStats.value.todaySignIn) {
    showToast("今日已签到");
    return;
  }

  try {
    // TODO: 实现签到功能
    userStats.value.todaySignIn = true;
    const signInDays = userStore.userInfo?.consecutiveSignInDays + 1;
    const params = {
      apiRequest: {
        userId: userStore.userInfo.id,
        consecutiveSignInDays: signInDays,
      },
    };
    await updateUserInfo(params);
    showToast({
      message: "签到成功",
      icon: "success",
    });
  } catch (error) {
    console.error("签到失败:", error);
    userStats.value.todaySignIn = false;
    showToast({
      message: "签到失败，请重试",
      type: "fail",
    });
  }
};

// 成为店员
const handleBecomeSeller = () => {
  // TODO: 实现店员申请功能
  showToast({
    message: "申请已提交",
    icon: "success",
  });
};

// 退出登录
const handleLogout = () => {
  showDialog({
    title: "提示",
    message: "确定要退出登录吗？",
    confirmButtonText: "退出",
    confirmButtonColor: "#ef4444",
  }).then(() => {
    userStore.logout();
    showToast("已退出登录");
    router.replace("/login");
  });
};

// 编辑用户资料
const handleEdit = () => {
  router.push("/user/edit");
};

// 订单管理
const handleOrders = () => {
  router.push("/orders");
};

// 收藏店员
const handleFavorites = () => {
  router.push("/favorites");
};

// 咨询客服
const handleCustomerService = () => {
  showDialog({
    title: "联系客服",
    message: "工作时间：周一至周日 9:00-21:00",
    confirmButtonText: "拨打电话",
    confirmButtonColor: "#14b8a6",
    cancelButtonText: "取消",
  })
    .then(() => {
      window.location.href = "tel:400-123-4567";
    })
    .catch(() => {});
};

// 清理缓存
const handleClearCache = () => {
  showDialog({
    title: "清理缓存",
    message: "确定要清理应用缓存吗？这可能需要重新加载一些数据。",
    confirmButtonText: "确定清理",
    confirmButtonColor: "#f05252",
  })
    .then(() => {
      // TODO: 实现缓存清理功能
      userStore.logout();
      showToast({
        message: "缓存已清理",
        icon: "success",
      });
    })
    .catch(() => {});
};

// 标签管理
const handleManageTags = () => {
  router.push("/tags-manage");
};

// 收入统计
const handleIncome = () => {
  router.push("/seller/income");
};

// 处理店员相关动作
const handleUserAction = () => {
  if (userStore.isSeller) {
    // 已是店员，跳转到装修页面
    router.push("/seller/customize");
  } else {
    // 不是店员，显示申请对话框
    handleBecomeSeller();
  }
};

// 处理在线状态变更
const handleOnlineChange = async (value) => {
  try {
    // TODO: 调用后端接口更新在线状态
    await updateOnlineStatus(value);
    showToast({
      message: value ? "已切换为在线状态" : "已切换为离线状态",
      type: "success",
    });
  } catch (error) {
    console.error("更新在线状态失败:", error);
    online.value = !value; // 恢复原状态
    showToast({
      message: "状态更新失败",
      type: "fail",
    });
  }
};

// 更新在线状态的 API 调用
const updateOnlineStatus = async (status) => {
  // TODO: 实现在线状态更新接口
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
};
</script>

<style scoped>
.btn-primary {
  @apply bg-brand-500 border-brand-500;
}

.btn-primary:active {
  @apply bg-brand-600 border-brand-600;
}

.btn-primary :deep(.van-button__text) {
  @apply text-white font-medium text-lg;
}

.btn-secondary {
  @apply bg-brand-200 border-brand-200;
}

.btn-secondary:active {
  @apply bg-brand-300 border-brand-300;
}

.btn-secondary :deep(.van-button__text) {
  @apply text-brand-500 font-medium text-lg;
}

.btn-danger {
  @apply bg-danger-500 border-danger-500;
}

.btn-danger:active {
  @apply bg-danger-600 border-danger-600;
}

.btn-danger :deep(.van-button__text) {
  @apply text-white font-medium text-lg;
}

.edit-btn {
  @apply bg-white/90 backdrop-blur text-surface-600 border-surface-200;
}

.edit-btn:active {
  @apply bg-surface-50;
}

.edit-btn :deep(.van-button__text) {
  @apply text-sm font-normal;
}

.tag-rotate {
  transform: rotate(-12deg);
}
</style>
