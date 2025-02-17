<template>
  <div class="min-h-screen flex flex-col">
    <!-- 主内容区域 -->
    <div class="flex-1 pb-[56px]">
      <router-view />
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="active" route class="safe-area-bottom">
      <van-tabbar-item to="/hall" icon="shop-o">店员大厅</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">个人中心</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const active = ref(0);

// 根据当前路由设置激活的标签
const routeMap = {
  "/hall": 0,
  "/orders": 1,
  "/user": 2,
};

active.value = routeMap[route.path] || 0;
</script>
