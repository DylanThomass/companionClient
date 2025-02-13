<template>
  <div class="min-h-screen bg-surface-50 p-6">
    <!-- 头部信息卡片 -->
    <div class="bg-white rounded-design shadow-sm overflow-hidden">
      <!-- 头像和昵称区域 -->
      <div class="p-8 bg-gradient-to-br from-brand-300 to-brand-400">
        <div class="flex items-center space-x-6">
          <van-image
            round
            width="88"
            height="88"
            :src="userStore.userInfo?.headimgurl"
            :alt="userStore.userInfo?.nickname"
            class="flex-shrink-0 border-4 border-white/50 shadow-lg"
          >
            <template #error>
              <div
                class="w-[88px] h-[88px] rounded-full bg-white/20 flex items-center justify-center"
              >
                <van-icon name="user-circle-o" size="44" class="text-white" />
              </div>
            </template>
          </van-image>

          <div class="flex-1">
            <h2 class="text-2xl font-semibold text-white">
              {{ userStore.userInfo?.nickname || "亲爱的用户" }}
            </h2>
            <p class="mt-2 text-white/80">
              {{ formatLocation() }}
            </p>
          </div>
        </div>
      </div>

      <!-- 用户信息列表 -->
      <div class="divide-y divide-surface-100">
        <van-cell
          title="性别"
          :value="formatGender(userStore.userInfo?.sex)"
          class="text-surface-600 h-16"
        />
        <van-cell
          title="地区"
          :value="formatLocation()"
          class="text-surface-600 h-16"
        />
        <van-cell
          title="ID"
          :value="formatOpenId()"
          class="text-surface-600 h-16"
        />
      </div>
    </div>

    <!-- 操作按钮组 -->
    <div class="mt-8">
      <van-button block class="btn-secondary" @click="handleLogout">
        退出登录
      </van-button>
    </div>

    <!-- 调试信息 -->
    <div v-if="isDev" class="mt-8">
      <van-collapse
        v-model="activeNames"
        class="rounded-design overflow-hidden"
      >
        <van-collapse-item title="调试信息" name="1">
          <pre
            class="text-assist bg-base-bg p-4 rounded-design overflow-x-auto font-mono text-gray-600"
          >
            {{ JSON.stringify(userStore.userInfo, null, 2) }}
          </pre>
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
const isDev = computed(() => process.env.VUE_APP_ENV === "development");

// 格式化性别显示
const formatGender = (sex) => {
  const genderMap = {
    1: "男",
    2: "女",
    0: "未知",
  };
  return genderMap[sex] || "未知";
};

// 格式化地区显示
const formatLocation = () => {
  const { province, city } = userStore.userInfo || {};
  if (province && city && province !== city) {
    return `${province} ${city}`;
  }
  return province || city || "未知";
};

// 格式化 OpenID 显示（仅显示前后几位）
const formatOpenId = () => {
  const openid = userStore.userInfo?.openid;
  if (!openid) return "未知";
  return `${openid.slice(0, 4)}...${openid.slice(-4)}`;
};

// 退出登录
const handleLogout = () => {
  showDialog({
    title: "确认退出",
    message: "是否确认退出登录？",
    showCancelButton: true,
  }).then((action) => {
    if (action === "confirm") {
      userStore.logout();
      showToast("已退出登录");
      router.replace("/login");
    }
  });
};
</script>
