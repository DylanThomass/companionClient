<template>
  <div class="home">
    <h1>首页</h1>
    <van-cell-group inset>
      <van-cell title="用户信息">
        <template #value>
          <span v-if="userStore.userInfo">
            {{ userStore.userInfo.nickname }}
          </span>
          <span v-else>未登录</span>
        </template>
      </van-cell>
    </van-cell-group>

    <van-button type="primary" block @click="handleLogout">
      退出登录
    </van-button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { showToast } from "vant";

const router = useRouter();
const userStore = useUserStore();

const handleLogout = () => {
  userStore.logout();
  showToast("已退出登录");
  router.push("/login");
};
</script>

<style scoped>
.home {
  padding: 16px;
  min-height: 100vh;
  background-color: #f7f8fa;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.van-cell-group {
  margin-bottom: 16px;
}
</style>
