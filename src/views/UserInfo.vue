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
        <div class="absolute top-0 -left-6 -right-6 h-48">
          <div
            class="absolute inset-0 bg-gradient-to-br from-teal-400 via-cyan-500 to-brand-500 h-56"
          >
            <!-- 添加一个柔和的渐变遮罩 -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-white/20 via-white/5 to-transparent"
            ></div>
            <!-- 底部过渡效果 -->
            <div
              class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent"
            ></div>
          </div>
        </div>

        <!-- 用户信息内容 -->
        <div
          class="relative bg-white rounded-2xl p-4 shadow-lg overflow-hidden"
        >
          <!-- 性别标识 -->
          <div
            class="absolute top-5 -right-8 w-28 text-center py-1 text-xs font-medium transform rotate-45 shadow-sm"
            :class="[
              userStore.userInfo?.sex === 0
                ? 'bg-blue-500 text-white'
                : 'bg-pink-500 text-white',
            ]"
          ></div>

          <div class="flex items-center">
            <!-- 头像区域 -->
            <div class="relative flex-shrink-0 w-24 self-end">
              <van-image
                round
                width="96"
                height="96"
                :src="avatarUrl"
                :alt="userStore.userInfo?.nickname"
                class="border-4 border-white shadow-lg"
                @error="onImageError"
              >
                <template #error>
                  <div
                    class="w-[96px] h-[96px] rounded-full bg-surface-100 flex items-center justify-center"
                  >
                    <van-icon
                      name="user-circle-o"
                      size="48"
                      class="text-surface-400"
                    />
                  </div>
                </template>
              </van-image>
              <!-- 标签角标 -->
              <div
                v-if="userStore.userTags && userStore.userTags.length > 0"
                style="transform: rotate(-12deg)"
                class="absolute -bottom-2 right-0 px-2 py-1 bg-white rounded-full shadow-lg"
              >
                <span class="text-xs text-brand-500">
                  #{{ userStore.userTags[0]?.tag || "" }}
                </span>
              </div>
            </div>

            <!-- 用户信息 -->
            <div class="flex-1 px-4 flex flex-col justify-between h-[96px]">
              <!-- 昵称区域 -->
              <div class="text-2xl font-semibold text-surface-800 mt-4">
                {{ userStore.userInfo?.nickname || "亲爱的用户" }}
              </div>
              <!-- 地域信息 -->
              <div class="flex items-center text-surface-500 text-sm mb-4">
                <van-icon name="location-o" class="mr-1" />
                <span
                  >{{ userStore.userInfo?.province }}
                  {{ userStore.userInfo?.city }}</span
                >
              </div>
            </div>

            <!-- 编辑按钮 -->
            <div class="flex-shrink-0 self-center">
              <van-button
                class="edit-btn"
                round
                size="small"
                @click="handleEdit"
              >
                <template #icon>
                  <van-icon name="edit" class="text-sm" />
                </template>
                编辑
              </van-button>
            </div>
          </div>

          <!-- 经验值进度条 -->
          <div class="mt-6 space-y-2">
            <div class="flex items-center justify-between">
              <span
                class="px-2 py-0.5 bg-brand-100 text-brand-500 rounded-full text-xs font-medium"
              >
                {{ userLevel.title }}
              </span>
              <span class="text-brand-500 font-medium">
                {{ userLevel.currentExp }}/{{ userLevel.nextLevelExp }}
              </span>
            </div>
            <div class="h-2 bg-surface-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-300"
                :style="{ width: `${userLevel.progress}%` }"
              ></div>
            </div>
          </div>

          <!-- 用户数据统计 -->
          <div
            class="mt-4 flex items-center justify-between border-t border-b border-surface-100 py-4"
          >
            <div
              class="flex-1 text-center border-r border-surface-100 group cursor-pointer"
            >
              <div class="text-lg font-semibold text-brand-500">
                ¥ {{ userStats.balance }}
              </div>
              <div
                class="text-xs text-surface-500 group-hover:text-brand-500 transition-colors"
              >
                余额
              </div>
            </div>
            <div
              class="flex-1 text-center border-r border-surface-100 group cursor-pointer"
            >
              <div class="text-lg font-semibold text-brand-500">
                {{ userStats.coupons }}
              </div>
              <div
                class="text-xs text-surface-500 group-hover:text-brand-500 transition-colors"
              >
                卡券
              </div>
            </div>
            <div
              class="flex-1 text-center border-r border-surface-100 group cursor-pointer"
            >
              <div class="text-lg font-semibold text-brand-500">
                {{ userStore.userInfo?.consecutiveSignInDays }}
              </div>
              <div
                class="text-xs text-surface-500 group-hover:text-brand-500 transition-colors"
              >
                签到
              </div>
            </div>
            <div class="flex-1 text-center group cursor-pointer">
              <div class="text-lg font-semibold text-brand-500">
                {{ userStats.inviteCount }}
              </div>
              <div
                class="text-xs text-surface-500 group-hover:text-brand-500 transition-colors"
              >
                邀请
              </div>
            </div>
          </div>
        </div>
        <!-- 在线状态卡片 -->
        <div v-if="userStore.isSeller" class="mt-6">
          <div class="bg-white/95 backdrop-blur rounded-xl p-3 shadow-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span
                  class="w-2 h-2 rounded-full mr-2"
                  :class="[
                    online ? 'bg-success-500 animate-pulse' : 'bg-surface-300',
                  ]"
                />
                <span class="text-base font-medium">{{
                  online ? "在线接单" : "暂停接单"
                }}</span>
              </div>
              <van-switch
                v-model="online"
                size="20px"
                active-color="#10b981"
                @change="handleOnlineChange"
              />
            </div>
            <div class="mt-1 text-xs text-surface-500">
              {{
                online ? "当前状态：可以接受新的订单" : "当前状态：暂时无法接单"
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- 功能按钮组 -->
      <div class="mt-6 grid grid-cols-3 gap-3">
        <!-- 签到按钮 -->
        <div
          class="bg-white rounded-xl p-4 shadow-lg text-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
          @click="handleSignIn"
        >
          <van-icon name="sign" class="text-2xl text-brand-500" />
          <div class="mt-2 text-sm text-surface-600 whitespace-nowrap">
            {{ userStats.todaySignIn ? "已签到" : "每日签到" }}
          </div>
        </div>

        <!-- 标签管理 -->
        <div
          class="bg-white rounded-xl p-4 shadow-lg text-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
          @click="handleManageTags"
        >
          <van-icon name="label-o" class="text-2xl text-brand-500" />
          <div class="mt-2 text-sm text-surface-600 whitespace-nowrap">
            标签管理
          </div>
        </div>
        <!-- 根据角色显示不同按钮 -->
        <div
          class="bg-white rounded-xl p-4 shadow-lg text-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
          @click="handleUserAction"
        >
          <van-icon
            :name="userStore.isSeller ? 'setting-o' : 'shop-collect-o'"
            class="text-2xl text-brand-500"
          />
          <div class="mt-2 text-sm text-surface-600 whitespace-nowrap">
            {{ userStore.isSeller ? "装修主页" : "成为店员" }}
          </div>
        </div>
      </div>

      <!-- 功能模块 -->
      <div class="mt-6 grid grid-cols-2 gap-4">
        <!-- 订单与收藏 -->
        <div class="bg-white rounded-2xl p-4 shadow-lg">
          <div class="text-sm text-surface-500 mb-3">
            {{ userStore.isSeller ? "店员中心" : "订单与收藏" }}
          </div>
          <div class="space-y-2">
            <!-- 店员专属功能 -->
            <template v-if="userStore.isSeller">
              <div
                class="flex items-center p-3 bg-feature-income-light/20 rounded-xl cursor-pointer hover:bg-feature-income-light/30 transition-colors duration-300"
                @click="handleIncome"
              >
                <van-icon
                  name="balance-o"
                  class="text-xl text-feature-income"
                />
                <span class="ml-2 text-surface-600 text-sm">收入统计</span>
                <van-icon name="arrow" class="ml-auto text-surface-400" />
              </div>
            </template>

            <!-- 通用功能 -->
            <div
              class="flex items-center p-3 bg-feature-order-light/20 rounded-xl cursor-pointer hover:bg-feature-order-light/30 transition-colors duration-300"
              @click="handleOrders"
            >
              <van-icon name="orders-o" class="text-xl text-feature-order" />
              <span class="ml-2 text-surface-600 text-sm">我的订单</span>
              <van-icon name="arrow" class="ml-auto text-surface-400" />
            </div>
            <div
              class="flex items-center p-3 bg-feature-favorite-light/20 rounded-xl cursor-pointer hover:bg-feature-favorite-light/30 transition-colors duration-300"
              @click="handleFavorites"
            >
              <van-icon name="like-o" class="text-xl text-feature-favorite" />
              <span class="ml-2 text-surface-600 text-sm">收藏店员</span>
              <van-icon name="arrow" class="ml-auto text-surface-400" />
            </div>
          </div>
        </div>

        <!-- 帮助与支持 -->
        <div class="bg-white rounded-2xl p-4 shadow-lg">
          <div class="text-sm text-surface-500 mb-3">帮助与支持</div>
          <div class="space-y-2">
            <div
              class="flex items-center p-3 bg-feature-service-light/20 rounded-xl cursor-pointer hover:bg-feature-service-light/30 transition-colors duration-300"
              @click="handleCustomerService"
            >
              <van-icon name="service-o" class="text-xl text-feature-service" />
              <span class="ml-2 text-surface-600 text-sm">咨询客服</span>
              <van-icon name="arrow" class="ml-auto text-surface-400" />
            </div>
            <div
              class="flex items-center p-3 bg-feature-system-light/20 rounded-xl cursor-pointer hover:bg-feature-system-light/30 transition-colors duration-300"
              @click="handleClearCache"
            >
              <van-icon name="delete-o" class="text-xl text-feature-system" />
              <span class="ml-2 text-surface-600 text-sm">清理缓存</span>
              <van-icon name="arrow" class="ml-auto text-surface-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- 即将推出 -->
      <div class="mt-6 bg-white/60 backdrop-blur rounded-2xl p-4 shadow-lg">
        <div class="text-sm text-surface-500 mb-3 flex items-center">
          <van-icon name="upgrade" class="mr-1 text-brand-400" />
          即将推出
        </div>
        <div class="grid grid-cols-2 gap-3">
          <!-- 邀请好友 -->
          <div
            class="flex items-center p-3 border border-dashed border-surface-300 rounded-xl cursor-not-allowed opacity-75"
          >
            <van-icon name="friends-o" class="text-xl text-surface-400" />
            <span class="ml-2 text-surface-500 text-sm">邀请好友</span>
            <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
          </div>
          <!-- AI角色管理 -->
          <div
            class="flex items-center p-3 border border-dashed border-surface-300 rounded-xl cursor-not-allowed opacity-75"
          >
            <van-icon name="friends" class="text-xl text-surface-400" />
            <span class="ml-2 text-surface-500 text-sm">AI角色管理</span>
            <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
          </div>
          <!-- 创业加盟 -->
          <div
            class="flex items-center p-3 border border-dashed border-surface-300 rounded-xl cursor-not-allowed opacity-75"
          >
            <van-icon name="shop" class="text-xl text-surface-400" />
            <span class="ml-2 text-surface-500 text-sm">创业加盟</span>
            <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
          </div>
          <!-- 社区活动 -->
          <div
            class="flex items-center p-3 border border-dashed border-surface-300 rounded-xl cursor-not-allowed opacity-75"
          >
            <van-icon name="cluster" class="text-xl text-surface-400" />
            <span class="ml-2 text-surface-500 text-sm">社区活动</span>
            <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
          </div>
          <!-- 积分商城 -->
          <div
            class="flex items-center p-3 border border-dashed border-surface-300 rounded-xl cursor-not-allowed opacity-75"
          >
            <van-icon name="gift" class="text-xl text-surface-400" />
            <span class="ml-2 text-surface-500 text-sm">积分商城</span>
            <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
          </div>
        </div>
        <!-- 退出登录按钮 -->
        <div class="mt-6">
          <van-button block round class="btn-danger" @click="handleLogout">
            退出登录
          </van-button>
        </div>
      </div>
    </div>

    <!-- 调试信息 -->
    <div v-if="isDev" class="mt-8">
      <van-collapse
        v-model="activeNames"
        class="rounded-design overflow-hidden bg-white"
      >
        <van-collapse-item title="调试信息" name="1">
          <div class="p-4 bg-surface-50 rounded-b-design">
            <pre
              class="text-sm font-mono text-surface-600 whitespace-pre-wrap break-all"
            >
              {{ JSON.stringify(userStore.userInfo, null, 2) }}
            </pre>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
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

const router = useRouter();
const userStore = useUserStore();
const activeNames = ref([]);

// ==================== 环境与状态 ====================
// 是否是开发环境
const isDev = computed(() => process.env.NODE_ENV === "development");
// 是否是微信环境
const isWx = computed(() => isWxEnv());
// 在线状态
const online = ref(true);

// ==================== 用户数据 ====================
// 头像地址
const avatarUrl = computed(() => userStore.userInfo?.avatarUrl);

// 用户等级信息
const userLevel = computed(() => {
  // TODO: 从后端获取用户经验值
  return calculateUserLevel(700);
});

// 用户统计信息
const userStats = ref({
  balance: 520.0,
  coupons: 3,
  signInDays: 7,
  inviteCount: 3,
  todaySignIn: false,
});

// 店员统计信息
const sellerStats = ref({
  pendingOrders: 5, // 待处理订单数
  todayIncome: 888, // 今日收入
  monthIncome: 6666, // 本月收入
  totalIncome: 88888, // 总收入
});

// ==================== 生命周期钩子 ====================
onMounted(async () => {
  if (!userStore.userId) {
    console.log("用户未登录，跳过数据获取");
    return;
  }

  try {
    // 1. 检查用户信息是否已加载
    if (!userStore.userInfo) {
      await userStore.getUserInfo();
    }

    // 2. 检查系统标签是否已加载
    if (userStore.systemTags.length === 0) {
      await userStore.fetchSystemTags();
    }

    // 3. 检查用户标签是否已加载
    if (userStore.userTags.length === 0 && userStore.systemTags.length > 0) {
      await userStore.fetchUserTags();
    }

    // 4. 获取用户统计数据
    // TODO: 实现用户统计数据获取
    // await getUserStats();
  } catch (error) {
    console.error("初始化用户数据失败:", error);
    showToast({
      message: "加载用户数据失败",
      type: "fail",
    });
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

// ==================== 工具方法 ====================
// 图片加载错误处理
const onImageError = (error) => {
  console.error("图片加载失败:", error);
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
