<template>
  <div class="ds-page">
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
    <div class="relative px-md">
      <!-- 头像和昵称区域 -->
      <div class="relative z-10 pt-xl">
        <!-- 装饰背景 -->
        <div class="absolute top-0 -left-md -right-md h-48">
          <div class="absolute inset-0 gradient-primary h-56">
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
        <div class="ds-card relative overflow-hidden">
          <!-- 性别标识 -->
          <div
            class="absolute top-5 -right-8 w-28 text-center py-1 text-xs font-medium transform rotate-45 shadow-sm"
            :class="[
              userStore.userInfo?.sex === 0
                ? 'bg-info-500 text-white'
                : 'bg-danger-500 text-white',
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
                class="border-4 border-white shadow-md"
                @error="onImageError"
              >
                <template #error>
                  <div
                    class="w-[96px] h-[96px] rounded-full bg-background-light flex items-center justify-center"
                  >
                    <van-icon
                      name="user-circle-o"
                      size="48"
                      class="text-text-secondary"
                    />
                  </div>
                </template>
              </van-image>
              <!-- 标签角标 -->
              <div
                v-if="userStore.userTags && userStore.userTags.length > 0"
                style="transform: rotate(-12deg)"
                class="absolute -bottom-2 right-0 px-2 py-1 bg-white rounded-full shadow-sm"
              >
                <span class="text-xs text-primary">
                  #{{ userStore.userTags[0]?.tag || "" }}
                </span>
              </div>
            </div>

            <!-- 用户信息 -->
            <div class="flex-1 px-md flex flex-col justify-between h-[96px]">
              <!-- 昵称区域 -->
              <div class="text-2xl font-semibold text-text-primary mt-md">
                {{ userStore.userInfo?.nickname || "亲爱的用户" }}
              </div>
              <!-- 地域信息 -->
              <div class="flex items-center text-text-secondary text-sm mb-md">
                <van-icon name="location-o" class="mr-xs" />
                <span
                  >{{ userStore.userInfo?.province }}
                  {{ userStore.userInfo?.city }}</span
                >
              </div>
            </div>

            <!-- 编辑按钮 -->
            <div class="flex-shrink-0 self-center">
              <van-button
                class="button-secondary"
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
          <div class="mt-md space-y-xs">
            <div class="flex items-center justify-between">
              <span
                class="px-xs py-0.5 bg-primary-light/20 text-primary rounded-full text-xs font-medium"
              >
                {{ userLevel.title }}
              </span>
              <span class="text-primary font-medium">
                {{ userLevel.currentExp }}/{{ userLevel.nextLevelExp }}
              </span>
            </div>
            <div class="h-2 bg-background-light rounded-full overflow-hidden">
              <div
                class="h-full gradient-primary rounded-full transition-all duration-base"
                :style="{ width: `${userLevel.progress}%` }"
              ></div>
            </div>
          </div>

          <!-- 用户数据统计 -->
          <div
            class="mt-md flex items-center justify-between border-t border-b border-border py-md"
          >
            <div
              class="flex-1 text-center border-r border-border group cursor-pointer"
            >
              <div class="text-lg font-semibold text-primary">
                ¥ {{ userStats.balance }}
              </div>
              <div
                class="text-xs text-text-secondary group-hover:text-primary transition-colors"
              >
                余额
              </div>
            </div>
            <div
              class="flex-1 text-center border-r border-border group cursor-pointer"
            >
              <div class="text-lg font-semibold text-primary">
                {{ userStats.coupons }}
              </div>
              <div
                class="text-xs text-text-secondary group-hover:text-primary transition-colors"
              >
                卡券
              </div>
            </div>
            <div
              class="flex-1 text-center border-r border-border group cursor-pointer"
            >
              <div class="text-lg font-semibold text-primary">
                {{ userStore.userInfo?.consecutiveSignInDays }}
              </div>
              <div
                class="text-xs text-text-secondary group-hover:text-primary transition-colors"
              >
                签到
              </div>
            </div>
            <div class="flex-1 text-center group cursor-pointer">
              <div class="text-lg font-semibold text-primary">
                {{ userStats.inviteCount }}
              </div>
              <div
                class="text-xs text-text-secondary group-hover:text-primary transition-colors"
              >
                邀请
              </div>
            </div>
          </div>
        </div>
        <!-- 在线状态卡片 -->
        <div v-if="userStore.isSeller" class="mt-md">
          <div class="ds-card">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span
                  class="w-2 h-2 rounded-full mr-xs"
                  :class="[
                    online
                      ? 'bg-success-500 animate-pulse'
                      : 'bg-text-secondary',
                  ]"
                />
                <span class="text-base font-medium">{{
                  online ? "在线接单" : "暂停接单"
                }}</span>
              </div>
              <van-switch
                v-model="online"
                size="20px"
                active-color="var(--c-success)"
                @change="handleOnlineChange"
              />
            </div>
            <div class="mt-xs text-xs text-text-secondary">
              {{
                online ? "当前状态：可以接受新的订单" : "当前状态：暂时无法接单"
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- 功能按钮组 -->
      <div class="mt-md grid grid-cols-3 gap-sm">
        <!-- 签到按钮 -->
        <div
          class="ds-card p-md text-center cursor-pointer hover:shadow-md transition-all duration-fast"
          @click="handleSignIn"
        >
          <van-icon name="sign" class="text-2xl text-primary" />
          <div class="mt-xs text-sm text-text-secondary whitespace-nowrap">
            {{ userStats.todaySignIn ? "已签到" : "每日签到" }}
          </div>
        </div>

        <!-- 标签管理 -->
        <div
          class="ds-card p-md text-center cursor-pointer hover:shadow-md transition-all duration-fast"
          @click="handleManageTags"
        >
          <van-icon name="label-o" class="text-2xl text-primary" />
          <div class="mt-xs text-sm text-text-secondary whitespace-nowrap">
            标签管理
          </div>
        </div>
        <!-- 根据角色显示不同按钮 -->
        <div
          class="ds-card p-md text-center cursor-pointer hover:shadow-md transition-all duration-fast"
          @click="handleUserAction"
        >
          <van-icon
            :name="userStore.isSeller ? 'setting-o' : 'shop-collect-o'"
            class="text-2xl text-primary"
          />
          <div class="mt-xs text-sm text-text-secondary whitespace-nowrap">
            {{ userStore.isSeller ? "装修主页" : "成为店员" }}
          </div>
        </div>
      </div>

      <!-- 功能模块 -->
      <div class="mt-md grid grid-cols-2 gap-sm">
        <!-- 订单与收藏 -->
        <div class="ds-card">
          <div class="text-sm text-text-secondary mb-sm">
            {{ userStore.isSeller ? "店员中心" : "订单与收藏" }}
          </div>
          <div class="space-y-xs">
            <!-- 店员专属功能 -->
            <template v-if="userStore.isSeller">
              <div
                class="flex items-center p-sm bg-info-500/10 rounded-lg cursor-pointer hover:bg-info-500/20 transition-colors duration-fast"
                @click="handleIncome"
              >
                <van-icon name="balance-o" class="text-xl text-info-500" />
                <span class="ml-xs text-text-regular text-sm">收入统计</span>
                <van-icon name="arrow" class="ml-auto text-text-secondary" />
              </div>
            </template>

            <!-- 通用功能 -->
            <div
              class="flex items-center p-sm bg-danger-500/10 rounded-lg cursor-pointer hover:bg-danger-500/20 transition-colors duration-fast"
              @click="handleOrders"
            >
              <van-icon name="orders-o" class="text-xl text-danger-500" />
              <span class="ml-xs text-text-regular text-sm">我的订单</span>
              <van-icon name="arrow" class="ml-auto text-text-secondary" />
            </div>
            <div
              class="flex items-center p-sm bg-warning-500/10 rounded-lg cursor-pointer hover:bg-warning-500/20 transition-colors duration-fast"
              @click="handleFavorites"
            >
              <van-icon name="like-o" class="text-xl text-warning-500" />
              <span class="ml-xs text-text-regular text-sm">收藏店员</span>
              <van-icon name="arrow" class="ml-auto text-text-secondary" />
            </div>
          </div>
        </div>

        <!-- 帮助与支持 -->
        <div class="ds-card">
          <div class="text-sm text-text-secondary mb-sm">帮助与支持</div>
          <div class="space-y-xs">
            <div
              class="flex items-center p-sm bg-info-500/10 rounded-lg cursor-pointer hover:bg-info-500/20 transition-colors duration-fast"
              @click="handleCustomerService"
            >
              <van-icon name="service-o" class="text-xl text-info-500" />
              <span class="ml-xs text-text-regular text-sm">咨询客服</span>
              <van-icon name="arrow" class="ml-auto text-text-secondary" />
            </div>
            <div
              class="flex items-center p-sm bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors duration-fast"
              @click="handleClearCache"
            >
              <van-icon name="delete-o" class="text-xl text-primary" />
              <span class="ml-xs text-text-regular text-sm">清理缓存</span>
              <van-icon name="arrow" class="ml-auto text-text-secondary" />
            </div>
          </div>
        </div>
      </div>

      <!-- 即将推出 -->
      <div class="mt-md ds-card bg-background/60 backdrop-blur">
        <div class="text-sm text-text-secondary mb-sm flex items-center">
          <van-icon name="upgrade" class="mr-xs text-primary" />
          即将推出
        </div>
        <div class="grid grid-cols-2 gap-sm">
          <!-- 邀请好友 -->
          <div
            class="flex items-center p-sm border border-dashed border-border rounded-lg cursor-not-allowed opacity-75"
          >
            <van-icon name="friends-o" class="text-xl text-text-secondary" />
            <span class="ml-xs text-text-secondary text-sm">邀请好友</span>
            <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
          </div>
          <!-- AI角色管理 -->
          <div
            class="flex items-center p-sm border border-dashed border-border rounded-lg cursor-not-allowed opacity-75"
          >
            <van-icon name="friends" class="text-xl text-text-secondary" />
            <span class="ml-xs text-text-secondary text-sm">AI角色管理</span>
            <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
          </div>
          <!-- 创业加盟 -->
          <div
            class="flex items-center p-sm border border-dashed border-border rounded-lg cursor-not-allowed opacity-75"
          >
            <van-icon name="shop" class="text-xl text-text-secondary" />
            <span class="ml-xs text-text-secondary text-sm">创业加盟</span>
            <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
          </div>
          <!-- 社区活动 -->
          <div
            class="flex items-center p-sm border border-dashed border-border rounded-lg cursor-not-allowed opacity-75"
          >
            <van-icon name="cluster" class="text-xl text-text-secondary" />
            <span class="ml-xs text-text-secondary text-sm">社区活动</span>
            <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
          </div>
          <!-- 积分商城 -->
          <div
            class="flex items-center p-sm border border-dashed border-border rounded-lg cursor-not-allowed opacity-75"
          >
            <van-icon name="gift" class="text-xl text-text-secondary" />
            <span class="ml-xs text-text-secondary text-sm">积分商城</span>
            <van-tag type="primary" size="mini" class="ml-auto">Coming</van-tag>
          </div>
        </div>
        <!-- 退出登录按钮 -->
        <div class="mt-md">
          <van-button block round class="button-danger" @click="handleLogout">
            退出登录
          </van-button>
        </div>
      </div>
    </div>

    <!-- 调试信息 -->
    <div v-if="isDev" class="mt-lg">
      <van-collapse
        v-model="activeNames"
        class="rounded-lg overflow-hidden bg-background"
      >
        <van-collapse-item title="调试信息" name="1">
          <div class="p-md bg-background-light rounded-b-lg">
            <pre
              class="text-sm font-mono text-text-secondary whitespace-pre-wrap break-all"
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
    confirmButtonColor: "var(--c-danger)",
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
    confirmButtonColor: "var(--c-primary)",
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
    confirmButtonColor: "var(--c-danger)",
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
/* 使用新的设计系统组件类 */
.gradient-primary {
  background: linear-gradient(
    to right,
    var(--c-primary),
    var(--c-primary-light)
  );
}

/* 自定义样式 */
.tag-rotate {
  transform: rotate(-12deg);
}
</style>
