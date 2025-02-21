<template>
  <div class="px-4 mb-4 mt-4">
    <van-swipe
      class="carousel-container rounded-2xl overflow-hidden"
      :autoplay="3000"
      :show-indicators="true"
      indicator-color="#14b8a6"
      :height="200"
    >
      <!-- 公告卡片 -->
      <van-swipe-item>
        <div class="bg-gradient-to-br from-blue-50 to-brand-50 p-4 h-full">
          <div class="flex items-center justify-between mb-3">
            <span class="text-lg font-medium text-surface-800">平台公告</span>
            <span class="text-xs text-surface-400">每日更新</span>
          </div>
          <div
            v-for="notice in announcements.slice(0, 2)"
            :key="notice.id"
            class="flex items-start space-x-3 py-2.5 animate-fade-in bg-white/80 rounded-xl px-3 mb-2"
          >
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              :class="getTagStyle(notice.type)"
            >
              <van-icon :name="getTagIcon(notice.type)" class="text-sm" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-surface-800 truncate">
                {{ notice.title }}
              </div>
              <div class="mt-1 text-xs text-surface-500 line-clamp-1">
                {{ notice.content }}
              </div>
            </div>
          </div>
        </div>
      </van-swipe-item>

      <!-- 每日心语 -->
      <van-swipe-item>
        <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-4 h-full">
          <div class="flex items-center justify-between mb-3">
            <span class="text-lg font-medium text-surface-800">今日心语</span>
            <van-icon
              name="replay"
              class="text-surface-400"
              @click.stop="refreshTip"
            />
          </div>
          <div
            class="p-4 rounded-xl bg-white/80 animate-fade-in backdrop-blur-sm flex flex-col h-[80px]"
          >
            <div class="flex items-start flex-1">
              <van-icon
                :name="tips[currentTipIndex].icon"
                class="text-xl mr-2 mt-1 text-brand-500"
              />
              <div class="flex-1">
                <div class="text-sm font-medium mb-2 text-surface-800">
                  {{ tips[currentTipIndex].title }}
                </div>
                <div
                  class="text-sm opacity-85 leading-relaxed line-clamp-3 text-surface-600"
                >
                  {{ tips[currentTipIndex].content }}
                </div>
              </div>
            </div>
            <div class="mt-3 text-xs opacity-75 text-right text-surface-500">
              {{ tips[currentTipIndex].author }}
            </div>
          </div>
        </div>
      </van-swipe-item>

      <!-- 用户反馈 -->
      <van-swipe-item>
        <div
          class="bg-gradient-to-br from-surface-800 to-surface-900 p-4 text-white h-full"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-lg font-medium">温暖瞬间</span>
            <span class="text-xs opacity-60">实时更新</span>
          </div>
          <div class="overflow-hidden">
            <van-swipe
              :autoplay="4000"
              :show-indicators="false"
              vertical
              :duration="600"
              class="h-[120px]"
            >
              <van-swipe-item v-for="feedback in feedbacks" :key="feedback.id">
                <div class="flex flex-col justify-between animate-fade-in">
                  <div class="text-sm leading-relaxed opacity-90 line-clamp-4">
                    {{ feedback.content }}
                  </div>
                  <div
                    class="flex items-center justify-between mt-6 pt-3 border-t border-white/10"
                  >
                    <div class="flex items-center">
                      <van-image
                        round
                        width="20"
                        height="20"
                        :src="feedback.avatar"
                      />
                      <span class="ml-2 text-xs opacity-60">
                        {{ feedback.nickname }}
                      </span>
                    </div>
                    <div class="flex items-center text-xs opacity-60">
                      <van-icon name="good-job-o" class="mr-1" />
                      <span>{{ feedback.likes }}共鸣</span>
                    </div>
                  </div>
                </div>
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup>
import { ref } from "vue";
import defaultAvatar from "@/assets/test/HeadImg-1.jpg";

// 复用原来组件的数据和方法
const announcements = ref([
  {
    id: 1,
    type: "feature",
    title: "深夜情感咨询服务上线",
    content:
      "为了给更多需要帮助的用户提供服务，平台推出深夜情感咨询服务，22:00-次日6:00期间可享受8折优惠。",
    isNew: true,
    link: "/notice/1",
  },
  {
    id: 2,
    type: "activity",
    title: "新人首单立减30元",
    content: "新用户注册即可领取30元优惠券，可用于平台任意店员的咨询服务。",
    isNew: false,
    link: "/notice/2",
  },
]);
const tips = ref([
  {
    id: 1,
    title: "今日诗语",
    content: "所有的相遇，都是久别重逢；所有的等待，都值得欣喜相拥。",
    author: "——席慕蓉",
    icon: "flower-o",
    theme: "from-rose-50 to-brand-50 text-surface-800",
  },
  {
    id: 2,
    title: "心理小贴士",
    content: "与其在烦恼中纠结，不如在行动中改变。今天，试着做一个小小的改变。",
    author: "——心理学家",
    icon: "bulb-o",
    theme: "from-amber-50 to-rose-50 text-surface-800",
  },
  {
    id: 3,
    title: "情感微语",
    content:
      "理解他人的痛苦，也要善待自己的脆弱。温柔不只是对他人，也要对自己。",
    author: "——治愈系店员",
    icon: "like-o",
    theme: "from-brand-50 to-blue-50 text-surface-800",
  },
]);
const feedbacks = ref([
  {
    id: 1,
    content:
      "第一次觉得被人真正理解了，谢谢店员的倾听，让我在深夜里不再感到孤单...",
    nickname: "星辰大海",
    avatar: defaultAvatar,
    likes: 368,
  },
  {
    id: 2,
    content:
      "很感谢店员的开导，让我从失恋的阴霾中走出来，现在的我学会了更好地爱自己...",
    nickname: "微风",
    avatar: defaultAvatar,
    likes: 246,
  },
]);

const currentTipIndex = ref(0);

const getTagStyle = (type) => {
  const styles = {
    feature: "bg-blue-50 text-blue-500",
    activity: "bg-brand-50 text-brand-500",
    notice: "bg-amber-50 text-amber-500",
  };
  return styles[type] || styles.notice;
};
const getTagIcon = (type) => {
  const icons = {
    feature: "upgrade",
    activity: "gift",
    notice: "volume",
  };
  return icons[type] || "volume";
};
const refreshTip = async () => {
  /* ... 原 DailyTips 的方法 ... */
};
</script>

<style scoped>
.carousel-container {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  margin-bottom: 20px;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
