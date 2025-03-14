<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- 订单与收藏 -->
    <div class="bg-white rounded-2xl p-4 shadow-lg">
      <div class="text-sm text-surface-500 mb-3">
        {{ isSeller ? "店员中心" : "订单与收藏" }}
      </div>
      <div class="space-y-2">
        <!-- 店员专属功能 -->
        <template v-if="isSeller">
          <div
            class="flex items-center p-3 bg-feature-income-light/20 rounded-xl cursor-pointer hover:bg-feature-income-light/30 transition-colors duration-300"
            @click="$emit('income')"
          >
            <van-icon name="balance-o" class="text-xl text-feature-income" />
            <span class="ml-2 text-surface-600 text-sm">收入统计</span>
            <van-icon name="arrow" class="ml-auto text-surface-400" />
          </div>
        </template>

        <!-- 通用功能 -->
        <div
          class="flex items-center p-3 bg-feature-order-light/20 rounded-xl cursor-pointer hover:bg-feature-order-light/30 transition-colors duration-300"
          @click="$emit('orders')"
        >
          <van-icon name="orders-o" class="text-xl text-feature-order" />
          <span class="ml-2 text-surface-600 text-sm">我的订单</span>
          <van-icon name="arrow" class="ml-auto text-surface-400" />
        </div>
        <div
          class="flex items-center p-3 bg-feature-favorite-light/20 rounded-xl cursor-pointer hover:bg-feature-favorite-light/30 transition-colors duration-300"
          @click="$emit('favorites')"
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
          @click="$emit('customer-service')"
        >
          <van-icon name="service-o" class="text-xl text-feature-service" />
          <span class="ml-2 text-surface-600 text-sm">咨询客服</span>
          <van-icon name="arrow" class="ml-auto text-surface-400" />
        </div>
        <div
          class="flex items-center p-3 bg-feature-system-light/20 rounded-xl cursor-pointer hover:bg-feature-system-light/30 transition-colors duration-300"
          @click="$emit('clear-cache')"
        >
          <van-icon name="delete-o" class="text-xl text-feature-system" />
          <span class="ml-2 text-surface-600 text-sm">清理缓存</span>
          <van-icon name="arrow" class="ml-auto text-surface-400" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isSeller: {
    type: Boolean,
    default: false,
  },
});

defineEmits([
  "orders",
  "favorites",
  "income",
  "customer-service",
  "clear-cache",
]);
</script>
