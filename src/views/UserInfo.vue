<template>
  <div class="min-h-screen bg-gradient-to-b from-surface-50 to-surface-100">
    <!-- 用户信息卡片 -->
    <div class="relative px-6 pt-12">
      <!-- 头像和昵称区域 -->
      <div class="relative z-10">
        <!-- 装饰背景 -->
        <div class="absolute -top-6 -left-6 -right-6 h-48">
          <div
            class="absolute inset-0 bg-gradient-to-br from-teal-400 via-cyan-500 to-brand-500"
          >
            <!-- 添加一个柔和的渐变遮罩 -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-white/20 via-white/5 to-transparent"
            ></div>
            <!-- 底部过渡效果 -->
            <div
              class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent"
            ></div>
          </div>
        </div>

        <!-- 用户信息内容 -->
        <div
          class="relative bg-white rounded-2xl px-6 py-4 shadow-lg overflow-hidden"
        >
          <!-- 性别标识 -->
          <div
            class="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
            :class="[
              userStore.userInfo?.sex === 1
                ? 'bg-blue-50 text-blue-500'
                : 'bg-pink-50 text-pink-500',
            ]"
          >
            <van-icon
              :name="userStore.userInfo?.sex === 1 ? 'male' : 'female'"
              class="text-lg"
            />
          </div>

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
                v-if="userTags[0]"
                style="transform: rotate(-12deg)"
                class="absolute -bottom-2 right-0 px-2 py-1 bg-white rounded-full shadow-lg cursor-pointer group"
              >
                <span class="text-xs text-brand-500"> #{{ userTags[0] }} </span>
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
                {{ userLevel.exp }}/{{ userLevel.nextExp }}
              </span>
            </div>
            <div class="h-2 bg-surface-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-300"
                :style="{ width: `${userLevel.exp % 100}%` }"
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
                ¥{{ userStats.balance }}
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
                {{ userStats.signInDays }}
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
        <!-- 成为店员 -->
        <div
          class="bg-white rounded-xl p-4 shadow-lg text-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
          @click="handleBecomeSeller"
        >
          <van-icon name="shop-o" class="text-2xl text-brand-500" />
          <div class="mt-2 text-sm text-surface-600 whitespace-nowrap">
            成为店员
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
      </div>

      <!-- 功能模块 -->
      <div class="mt-6 grid grid-cols-2 gap-4">
        <!-- 订单与收藏 -->
        <div class="bg-white rounded-2xl p-4 shadow-lg">
          <div class="text-sm text-surface-500 mb-3">订单与收藏</div>
          <div class="space-y-2">
            <div
              class="flex items-center p-3 bg-feature-order-light/20 rounded-xl cursor-pointer hover:bg-feature-order-light/30 transition-colors duration-300"
              @click="handleOrders"
            >
              <van-icon name="orders-o" class="text-xl text-feature-order" />
              <span class="ml-2 text-surface-600 text-sm">订单管理</span>
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { showToast, showDialog } from "vant";

const router = useRouter();
const userStore = useUserStore();
const activeNames = ref([]);

// 是否为开发环境
const isDev = computed(() => process.env.NODE_ENV === "development");

// 头像地址
const avatarUrl = computed(() => {
  return userStore.userInfo?.headimgurl;
});

// 用户等级信息
const userLevel = computed(() => {
  // TODO: 从后端获取用户经验值
  const exp = 750;
  const level = Math.floor(exp / 100) + 1;
  const titles = ["初心者", "温暖使者", "关怀大师", "守护天使", "温暖领袖"];
  return {
    level,
    exp,
    nextExp: level * 100,
    title: titles[Math.min(level - 1, titles.length - 1)],
  };
});

// 用户统计信息
const userStats = ref({
  // TODO: 从后端获取用户统计数据
  balance: 520.0,
  coupons: 3,
  signInDays: 7,
  inviteCount: 3,
  todaySignIn: false,
});

// 用户标签
const userTags = ref([
  // TODO: 从后端获取用户标签
  "乐观开朗",
  "善解人意",
  "倾听者",
  "温暖治愈",
]);

// 签到
const handleSignIn = () => {
  if (userStats.value.todaySignIn) return;
  // TODO: 实现签到功能
  // 1. 调用签到接口
  // 2. 更新签到状态和天数
  // 3. 获取签到奖励
  userStats.value.todaySignIn = true;
  userStats.value.signInDays++;
  showToast({
    message: "签到成功",
    icon: "success",
  });
};

// 成为店员
const handleBecomeSeller = () => {
  showDialog({
    title: "成为店员",
    message: "成为店员后可以管理店铺、处理订单等",
    confirmButtonText: "立即申请",
    confirmButtonColor: "#14b8a6",
    cancelButtonText: "暂不考虑",
  })
    .then(() => {
      // TODO: 实现店员申请功能
      // 1. 调用申请接口
      // 2. 处理审核流程
      showToast({
        message: "申请已提交",
        icon: "success",
      });
    })
    .catch(() => {});
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

// 编辑头像
const handleEditAvatar = () => {
  router.push("/user/edit");
};

// 订单管理
const handleOrders = () => {
  // TODO: 实现订单管理页面
  router.push("/orders");
};

// 收藏店员
const handleFavorites = () => {
  // TODO: 实现收藏店员页面
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
      // 1. 清理本地存储
      // 2. 清理应用缓存
      // 3. 重新加载必要数据
      localStorage.clear();
      showToast({
        message: "缓存已清理",
        icon: "success",
      });
    })
    .catch(() => {});
};

const onImageError = (error) => {
  console.error("Image load error:", error);
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
