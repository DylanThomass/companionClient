<template>
  <div class="min-h-screen bg-surface-50">
    <!-- 照片轮播展示 -->
    <div class="relative">
      <!-- 轮播图 -->
      <div class="relative h-[280px] overflow-hidden">
        <van-swipe
          :autoplay="4000"
          :show-indicators="true"
          @change="onPhotoChange"
          class="h-full"
          indicator-color="#14b8a6"
        >
          <van-swipe-item
            v-for="(photo, index) in sellerInfo.photos"
            :key="index"
            @click="previewPhotos(index)"
          >
            <van-image :src="photo" fit="cover" class="w-full h-[280px]" />
          </van-swipe-item>
        </van-swipe>
        <!-- 渐变遮罩 -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent to-surface-900/30 pointer-events-none"
        ></div>
        <!-- 照片计数器 -->
        <div
          class="absolute top-3 right-3 px-2 py-1 bg-surface-900/60 rounded-full text-xs text-white"
        >
          {{ currentPhotoIndex + 1 }}/{{ sellerInfo.photos.length }}
        </div>
      </div>

      <!-- 基础信息卡片 -->
      <div class="absolute -bottom-16 left-4 right-4">
        <div class="bg-white rounded-2xl p-4 shadow-lg">
          <div class="flex items-start">
            <van-image
              round
              width="64"
              height="64"
              :src="sellerInfo.avatar"
              class="border-2 border-white shadow-md"
            />
            <div class="ml-4 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xl font-medium text-surface-800">
                  {{ sellerInfo.name }}
                </span>
                <van-icon
                  :name="
                    sellerInfo.gender === 'female' ? 'like-o' : 'friends-o'
                  "
                  :class="
                    sellerInfo.gender === 'female'
                      ? 'text-pink-500'
                      : 'text-blue-500'
                  "
                />
              </div>
              <!-- 等级和评分 -->
              <div class="flex items-center gap-3 mt-1">
                <span class="text-brand-500 font-medium"
                  >Lv.{{ sellerInfo.level }}</span
                >
                <div class="flex items-center gap-1">
                  <van-rate
                    v-model="sellerInfo.rating"
                    :size="12"
                    color="#f59e0b"
                    void-icon="star"
                    void-color="#e5e7eb"
                    readonly
                  />
                  <span class="text-xs text-surface-400"
                    >{{ sellerInfo.rating }}分</span
                  >
                </div>
              </div>
              <!-- 基本信息 -->
              <div
                class="flex items-center gap-3 mt-2 text-xs text-surface-400"
              >
                <span class="flex items-center gap-1">
                  <van-icon name="location-o" />
                  {{ sellerInfo.location }}
                </span>
                <span class="flex items-center gap-1">
                  <van-icon name="star-o" />
                  {{ sellerInfo.constellation }}
                </span>
              </div>
            </div>
          </div>
          <!-- 标签列表 -->
          <div class="flex flex-wrap gap-2 mt-4">
            <span
              v-for="tag in sellerInfo.tags"
              :key="tag"
              class="inline-block px-2 py-1 text-xs bg-surface-50 text-surface-500 rounded-full"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 占位，确保内容不被基础信息卡片遮挡 -->
    <div class="h-20"></div>

    <!-- 数据统计 -->
    <div class="px-4 mb-4">
      <div class="bg-white rounded-xl p-4 flex justify-between">
        <div class="flex-1 flex flex-col items-center">
          <span class="text-lg font-medium text-surface-800">{{
            sellerInfo.favoriteCount
          }}</span>
          <span class="text-xs text-surface-500 mt-1">收藏</span>
        </div>
        <div
          class="flex-1 flex flex-col items-center border-x border-surface-100"
        >
          <span class="text-lg font-medium text-surface-800">{{
            sellerInfo.orderCount
          }}</span>
          <span class="text-xs text-surface-500 mt-1">接单</span>
        </div>
        <div class="flex-1 flex flex-col items-center">
          <span class="text-lg font-medium text-surface-800">{{
            sellerInfo.reviewCount
          }}</span>
          <span class="text-xs text-surface-500 mt-1">评价</span>
        </div>
      </div>
    </div>

    <!-- 自我介绍 -->
    <div class="px-4 py-6">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-5 bg-brand-500 rounded-full"></div>
          <span class="text-lg font-medium text-surface-800">一封来信</span>
        </div>
        <div
          class="text-sm text-surface-600 leading-relaxed whitespace-pre-wrap italic text-center"
        >
          {{ sellerInfo.introduction }}
        </div>
      </div>
    </div>

    <!-- 服务列表 -->
    <div class="px-4 pb-6">
      <div class="bg-white rounded-xl p-4">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-5 bg-brand-500 rounded-full"></div>
          <span class="text-lg font-medium text-surface-800">服务项目</span>
        </div>

        <!-- 服务类型滑块 -->
        <van-swipe
          :loop="false"
          :width="280"
          :show-indicators="false"
          class="service-swipe"
        >
          <van-swipe-item v-for="(services, type) in serviceTypes" :key="type">
            <div
              class="service-card"
              :class="{
                'ring-2 ring-brand-500 ring-offset-2':
                  selectedType?.name === services.name,
              }"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <van-icon
                    :name="services.icon"
                    class="text-lg text-brand-500"
                  />
                  <span class="font-medium">{{ services.name }}</span>
                </div>
                <span class="text-xs text-surface-400">30分钟起</span>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(duration, index) in services.items"
                  :key="index"
                  class="p-2 bg-white rounded-lg border border-surface-100 cursor-pointer relative"
                  :class="{
                    'border-brand-500': isSelected(type, duration),
                    'hover:border-brand-200 active:bg-surface-50': !isSelected(
                      type,
                      duration
                    ),
                  }"
                  @click="selectService(type, duration)"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="text-sm">{{ duration.name }}</div>
                      <div class="mt-1 text-xs text-surface-400">
                        {{ duration.time }}
                      </div>
                    </div>
                    <div class="text-brand-500 font-medium">
                      ¥{{ duration.price }}
                    </div>
                  </div>
                  <div
                    v-if="isSelected(type, duration)"
                    class="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center"
                  >
                    <van-icon name="success" class="text-white text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>

    <!-- 底部下单按钮 -->
    <div class="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t">
      <van-button
        block
        :class="[
          'h-11 rounded-design text-base font-medium transition-colors duration-300',
          selectedService
            ? 'bg-brand-50 text-brand-500 border border-brand-100 hover:bg-brand-100'
            : 'bg-surface-50 text-surface-400 border border-surface-100',
        ]"
        :disabled="!selectedService"
        @click="showOrderPopup = true"
      >
        {{
          selectedService ? `￥${selectedService.price} 立即下单` : "请选择服务"
        }}
      </van-button>
    </div>

    <!-- 下单弹窗 -->
    <van-popup
      v-model:show="showOrderPopup"
      position="bottom"
      round
      class="order-popup"
    >
      <div class="p-4">
        <div class="text-lg font-medium mb-6">确认订单</div>

        <!-- 服务信息 -->
        <div class="mb-4 p-3 bg-surface-50 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="text-surface-500">服务类型</span>
            <span>{{ selectedType?.name }}</span>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-surface-500">服务时长</span>
            <span>{{ selectedService?.time }}</span>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-surface-500">服务费用</span>
            <span class="text-brand-500 font-medium"
              >￥{{ selectedService?.price }}</span
            >
          </div>
        </div>

        <!-- 微信号输入 -->
        <div class="mb-6">
          <van-field
            v-model="wechatId"
            label="微信号"
            placeholder="请输入您的微信号"
            :rules="[{ required: true, message: '请输入微信号' }]"
          />
        </div>

        <!-- 支付方式 -->
        <div class="mb-6">
          <div class="text-sm text-surface-600 mb-2">支付方式</div>
          <van-radio-group v-model="paymentMethod" direction="horizontal">
            <van-radio name="balance" icon-size="18px">
              余额支付
              <template #extra>
                <span class="text-xs text-surface-400 ml-1"
                  >剩余: ￥{{ userBalance }}</span
                >
              </template>
            </van-radio>
            <van-radio name="wechat" icon-size="18px">微信支付</van-radio>
          </van-radio-group>
        </div>

        <!-- 确认按钮 -->
        <van-button
          block
          :class="[
            'h-11 rounded-design text-base font-medium transition-colors duration-300',
            wechatId
              ? 'bg-brand-50 text-brand-500 border border-brand-100 hover:bg-brand-100'
              : 'bg-surface-50 text-surface-400 border border-surface-100',
          ]"
          :disabled="!wechatId"
          @click="handleCreateOrder"
        >
          确认下单
        </van-button>
      </div>
    </van-popup>

    <!-- 图片预览 -->
    <van-image-preview
      v-model:show="showPreview"
      :images="sellerInfo.photos"
      :start-position="currentPhotoIndex"
      :show-index="true"
      :closeable="true"
      @change="onPhotoChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { showToast, ImagePreview } from "vant";
import HeadImg1 from "@/assets/test/HeadImg-1.jpg";
import HeadImg2 from "@/assets/test/HeadImg-2.jpg";
import HeadImg3 from "@/assets/test/HeadImg-3.jpg";
import HeadImg4 from "@/assets/test/HeadImg-4.jpg";

const route = useRoute();
const sellerId = route.params.id;
const showPreview = ref(false);
const currentPhotoIndex = ref(0);
const isExpanded = ref(false);

// 模拟店员详情数据
const sellerInfo = ref({
  id: 1,
  name: "浅夏微凉",
  tags: ["情感咨询", "温暖治愈", "倾听者", "专业认证", "知心姐姐"],
  avatar: HeadImg1,
  photos: [HeadImg1, HeadImg2, HeadImg3, HeadImg4],
  rating: 5,
  orderCount: 238,
  favoriteCount: 156,
  reviewCount: 212,
  gender: "female",
  level: 8,
  location: "广东·深圳",
  constellation: "双子座",
  introduction: `"愿以温暖之心，助你渡过难关。"

                                    ——浅夏微凉`,
});

// 预览照片
const previewPhotos = (index) => {
  currentPhotoIndex.value = index;
  showPreview.value = true;
};

// 照片切换回调
const onPhotoChange = (index) => {
  currentPhotoIndex.value = index;
};

// 获取店员详情
const fetchSellerDetail = async () => {
  try {
    // TODO: 调用获取店员详情接口
    // const { data } = await getSellerDetail(sellerId);
    // sellerInfo.value = data;
  } catch (error) {
    console.error("获取店员详情失败:", error);
    showToast({
      message: "获取店员信息失败",
      type: "error",
    });
  }
};

// 服务价格配置
const textServices = [
  { name: "体验咨询", time: "30分钟", price: 29.9 },
  { name: "标准咨询", time: "1小时", price: 49.9 },
  { name: "日常咨询", time: "1天", price: 99.9 },
  { name: "连续咨询", time: "1周", price: 299.9 },
  { name: "深度咨询", time: "1个月", price: 899.9 },
];

const voiceServices = [
  { name: "体验咨询", time: "30分钟", price: 39.9 },
  { name: "标准咨询", time: "1小时", price: 69.9 },
  { name: "日常咨询", time: "1天", price: 149.9 },
  { name: "连续咨询", time: "1周", price: 399.9 },
  { name: "深度咨询", time: "1个月", price: 1199.9 },
];

const videoServices = [
  { name: "体验咨询", time: "30分钟", price: 49.9 },
  { name: "标准咨询", time: "1小时", price: 89.9 },
  { name: "日常咨询", time: "1天", price: 199.9 },
  { name: "连续咨询", time: "1周", price: 499.9 },
  { name: "深度咨询", time: "1个月", price: 1499.9 },
];

// 服务选择相关
const selectedType = ref(null);
const selectedService = ref(null);
const showOrderPopup = ref(false);
const wechatId = ref("");
const paymentMethod = ref("balance");
const userBalance = ref(1000); // 模拟用户余额

// 服务类型配置
const serviceTypes = {
  text: {
    name: "文字/语音条",
    icon: "chat-o",
    items: textServices,
  },
  voice: {
    name: "语音连麦",
    icon: "phone-o",
    items: voiceServices,
  },
  video: {
    name: "视频通话",
    icon: "video-o",
    items: videoServices,
  },
};

// 判断服务是否被选中
const isSelected = (type, service) => {
  return (
    selectedType.value?.name === serviceTypes[type].name &&
    selectedService.value?.time === service.time
  );
};

// 选择服务
const selectService = (type, service) => {
  selectedType.value = serviceTypes[type];
  selectedService.value = service;
};

// 创建订单
const handleCreateOrder = async () => {
  try {
    // TODO: 调用创建订单接口
    const orderData = {
      sellerId: sellerId,
      serviceType: selectedType.value.name,
      serviceDuration: selectedService.value.time,
      price: selectedService.value.price,
      wechatId: wechatId.value,
      paymentMethod: paymentMethod.value,
    };

    // const { data } = await createOrder(orderData);
    showToast({ message: "下单成功", type: "success" });
    showOrderPopup.value = false;
  } catch (error) {
    console.error("创建订单失败:", error);
    showToast({ message: "下单失败，请重试", type: "error" });
  }
};

onMounted(() => {
  fetchSellerDetail();
});
</script>

<style scoped>
.service-swipe {
  padding: 12px 0;
  margin: 0 -16px;
}

.service-card {
  margin: 0 16px;
  padding: 16px;
  background-color: rgb(249 250 251 / 0.5);
  border-radius: 0.5rem;
  height: 100%;
  overflow-y: auto;
  max-height: 400px;
  transition: all 0.3s ease;
}

/* 自定义滚动条样式 */
.service-card::-webkit-scrollbar {
  width: 4px;
}

.service-card::-webkit-scrollbar-track {
  background: transparent;
}

.service-card::-webkit-scrollbar-thumb {
  background-color: rgb(203 213 225 / 0.5);
  border-radius: 2px;
}

.order-popup {
  max-height: 80vh;
}
</style>
