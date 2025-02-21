<template>
  <div class="min-h-screen bg-surface-50 pb-[56px]">
    <!-- 顶部搜索栏 -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="p-3">
        <van-search
          v-model="searchText"
          placeholder="搜索店员"
          shape="round"
          background="transparent"
        />
      </div>
    </div>

    <!-- 信息轮播 -->
    <info-carousel />

    <!-- TOP3 店员展示 -->
    <div class="relative overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-b from-brand-50 to-surface-50"
      ></div>
      <div class="relative p-4 pt-6">
        <div class="flex items-center justify-between mb-6">
          <div class="text-lg font-medium text-surface-800">本月优秀店员</div>
          <div class="text-xs text-surface-400">每月更新</div>
        </div>
        <div class="flex justify-center items-end gap-4 mb-6">
          <!-- 第二名 -->
          <div
            class="relative w-24 text-center translate-y-4"
            @click="router.push(`/seller/${topSellers[1].id}`)"
          >
            <van-image
              round
              width="72"
              height="72"
              :src="topSellers[1].avatar"
              class="mx-auto shadow-md"
            />
            <div class="mt-3 flex items-center justify-center gap-1">
              <span class="font-medium text-surface-800 truncate">
                {{ topSellers[1].name }}
              </span>
              <van-icon
                :name="
                  topSellers[1].gender === 'female' ? 'like-o' : 'friends-o'
                "
                :class="
                  topSellers[1].gender === 'female'
                    ? 'text-pink-500'
                    : 'text-blue-500'
                "
                class="text-sm"
              />
            </div>
            <div class="mt-1.5">
              <div class="text-xs text-brand-500 font-medium">
                {{ topSellers[1].rating }}分
              </div>
              <div class="text-[10px] text-surface-400 mt-0.5">
                {{ topSellers[1].praiseRate }}%好评
              </div>
            </div>
          </div>

          <!-- 第一名 -->
          <div
            class="relative w-32 text-center -translate-y-6"
            @click="router.push(`/seller/${topSellers[0].id}`)"
          >
            <van-image
              round
              width="96"
              height="96"
              :src="topSellers[0].avatar"
              class="mx-auto shadow-lg"
            />
            <div class="mt-3 flex items-center justify-center gap-1">
              <span class="font-medium text-lg text-surface-800 truncate">
                {{ topSellers[0].name }}
              </span>
              <van-icon
                :name="
                  topSellers[0].gender === 'female' ? 'like-o' : 'friends-o'
                "
                :class="
                  topSellers[0].gender === 'female'
                    ? 'text-pink-500'
                    : 'text-blue-500'
                "
                class="text-base"
              />
            </div>
            <div class="mt-2">
              <van-rate
                v-model="topSellers[0].rating"
                :size="16"
                color="#f59e0b"
                void-icon="star"
                void-color="#e5e7eb"
                readonly
              />
              <div class="text-[10px] text-surface-400 mt-1">
                {{ topSellers[0].praiseRate }}%好评
              </div>
            </div>
          </div>

          <!-- 第三名 -->
          <div
            class="relative w-24 text-center translate-y-8"
            @click="router.push(`/seller/${topSellers[2].id}`)"
          >
            <van-image
              round
              width="60"
              height="60"
              :src="topSellers[2].avatar"
              class="mx-auto shadow-md"
            />
            <div class="mt-3 flex items-center justify-center gap-1">
              <span class="font-medium text-surface-800 truncate">
                {{ topSellers[2].name }}
              </span>
              <van-icon
                :name="
                  topSellers[2].gender === 'female' ? 'like-o' : 'friends-o'
                "
                :class="
                  topSellers[2].gender === 'female'
                    ? 'text-pink-500'
                    : 'text-blue-500'
                "
                class="text-sm"
              />
            </div>
            <div class="mt-1.5">
              <div class="text-xs text-brand-500 font-medium">
                {{ topSellers[2].rating }}分
              </div>
              <div class="text-[10px] text-surface-400 mt-0.5">
                {{ topSellers[2].praiseRate }}%好评
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 装饰元素 -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="w-full h-full"
          style="
            background-image: radial-gradient(
              circle at 50% 50%,
              #14b8a6 1px,
              transparent 1px
            );
            background-size: 24px 24px;
          "
        ></div>
      </div>
    </div>

    <!-- 筛选工具栏 -->
    <div class="bg-white shadow-sm">
      <div class="px-4 py-3 flex justify-between items-center">
        <div class="flex gap-3">
          <div
            class="flex items-center gap-1 text-sm py-1 px-2 rounded-full"
            :class="{ 'text-brand-500': activeSort === 'rating' }"
            @click="handleSortChange('rating')"
          >
            <span>评分</span>
            <van-icon :name="getSortIcon('rating')" />
          </div>
          <div
            class="flex items-center gap-1 text-sm py-1 px-2 rounded-full"
            :class="{ 'text-brand-500': activeSort === 'orderCount' }"
            @click="handleSortChange('orderCount')"
          >
            <span>接单量</span>
            <van-icon :name="getSortIcon('orderCount')" />
          </div>
        </div>
        <div
          class="flex items-center gap-1 text-sm py-1 px-2 rounded-full"
          @click="showFilter = true"
        >
          <span>筛选</span>
          <van-icon
            name="filter-o"
            :class="{ 'text-brand-500': hasActiveFilters }"
          />
        </div>
      </div>
    </div>

    <!-- 店员列表 -->
    <div class="p-4 space-y-3">
      <div
        v-for="seller in filteredSellers"
        :key="seller.id"
        class="relative bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        @click="handleSellerClick(seller)"
      >
        <!-- 性别丝带 -->
        <div
          class="absolute bottom-5 -right-8 w-28 text-center py-1 text-xs font-medium transform rotate-45 shadow-sm"
          :class="[
            seller.gender === 2
              ? 'bg-pink-500 text-white'
              : 'bg-blue-500 text-white',
          ]"
        ></div>

        <div class="flex items-start">
          <!-- 头像部分 -->
          <van-image
            round
            width="64"
            height="64"
            :src="seller.avatar"
            class="flex-shrink-0 border-2 border-white shadow-sm"
          />

          <!-- 信息部分 -->
          <div class="flex-1 ml-3">
            <!-- 昵称和标签 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg font-medium text-surface-800">
                  {{ seller.name }}
                </span>
                <!-- 等级标签 -->
                <span
                  class="px-1.5 py-0.5 bg-brand-50 text-brand-500 text-xs rounded-full transform -rotate-3"
                >
                  Lv.{{ seller.level }}
                </span>
              </div>
              <van-tag
                :type="seller.online ? 'success' : 'default'"
                size="medium"
                round
              >
                {{ seller.online ? "在线" : "离线" }}
              </van-tag>
            </div>

            <!-- 个性签名 -->
            <div class="mt-1 text-sm text-surface-500 line-clamp-1">
              {{ seller.bio || "这个人很懒，什么都没写~" }}
            </div>

            <!-- 基本信息 -->
            <div class="mt-2 flex items-center text-sm text-surface-500">
              <van-rate
                v-model="seller.rating"
                :size="12"
                color="#f59e0b"
                void-icon="star"
                void-color="#e5e7eb"
                readonly
              />
              <span class="ml-1">{{ seller.rating }}</span>
              <span class="mx-2 text-surface-300">|</span>
              <span class="flex items-center">
                <van-icon name="star-o" class="mr-1" />
                {{ seller.constellation }}
              </span>
            </div>

            <!-- 标签 -->
            <div class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="tag in seller.tags?.slice(0, 3)"
                :key="tag"
                class="inline-block px-2 py-0.5 text-xs bg-surface-50 text-surface-500 rounded-full"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选弹出层 -->
    <van-popup
      v-model:show="showFilter"
      position="right"
      :style="{ width: '80%', height: '100%' }"
    >
      <div class="p-4">
        <div class="text-lg font-medium mb-6">筛选条件</div>

        <!-- 服务类型 -->
        <div class="mb-6">
          <div class="text-sm text-surface-600 mb-3">服务类型</div>
          <div class="flex flex-wrap gap-2">
            <van-tag
              v-for="tag in serviceTypes"
              :key="tag"
              :type="filters.serviceTypes.includes(tag) ? 'primary' : 'default'"
              round
              size="medium"
              @click="toggleFilter('serviceTypes', tag)"
            >
              {{ tag }}
            </van-tag>
          </div>
        </div>

        <!-- 店员特点 -->
        <div class="mb-6">
          <div class="text-sm text-surface-600 mb-3">店员特点</div>
          <div class="flex flex-wrap gap-2">
            <van-tag
              v-for="tag in sellerTags"
              :key="tag"
              :type="filters.sellerTags.includes(tag) ? 'primary' : 'default'"
              round
              size="medium"
              @click="toggleFilter('sellerTags', tag)"
            >
              {{ tag }}
            </van-tag>
          </div>
        </div>

        <!-- 其他条件 -->
        <div class="mb-6">
          <div class="text-sm text-surface-600 mb-3">其他条件</div>
          <div class="space-y-2">
            <van-cell-group inset>
              <van-cell title="仅看认证店员" center>
                <template #right-icon>
                  <van-switch v-model="filters.onlyCertified" size="24" />
                </template>
              </van-cell>
              <van-cell title="仅看新人店员" center>
                <template #right-icon>
                  <van-switch v-model="filters.onlyNewcomer" size="24" />
                </template>
              </van-cell>
            </van-cell-group>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div class="flex gap-3">
            <van-button block plain class="flex-1" @click="resetFilters">
              重置
            </van-button>
            <van-button
              block
              type="primary"
              class="flex-1"
              @click="applyFilters"
            >
              确定
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 智能匹配入口 -->
    <div class="fixed right-4 bottom-20 z-50">
      <van-button
        round
        type="primary"
        size="small"
        icon="magic-stick"
        @click="showMatchDialog = true"
      >
        智能匹配
      </van-button>
    </div>

    <!-- 匹配弹窗 -->
    <van-dialog
      v-model:show="showMatchDialog"
      title="智能匹配店员"
      :show-confirm-button="false"
      class="match-dialog"
    >
      <div class="p-4">
        <div class="space-y-4">
          <div class="text-sm text-surface-600">选择咨询主题</div>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="topic in consultTopics"
              :key="topic.id"
              class="p-3 rounded-xl border text-center cursor-pointer transition-colors"
              :class="[
                selectedTopic === topic.id
                  ? 'border-brand-500 bg-brand-50 text-brand-500'
                  : 'border-surface-200',
              ]"
              @click="selectedTopic = topic.id"
            >
              <van-icon :name="topic.icon" class="text-xl mb-1" />
              <div class="text-sm">{{ topic.name }}</div>
            </div>
          </div>

          <van-button block type="primary" class="mt-6" @click="handleMatch">
            开始匹配
          </van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { showToast, showDialog } from "vant";
import { sellers, topSellers } from "@/mock/seller";
import InfoCarousel from "@/components/hall/InfoCarousel.vue";

const router = useRouter();
const searchText = ref("");
const showFilter = ref(false);
const activeSort = ref("");
const sortOrder = ref("desc");

// 筛选条件
const serviceTypes = [
  "情感咨询",
  "心理疏导",
  "倾听陪伴",
  "生活指导",
  "职场建议",
];
const sellerTags = ["专业认证", "温暖治愈", "经验丰富", "擅长倾听", "知心姐姐"];

// 筛选状态
const filters = reactive({
  serviceTypes: [],
  sellerTags: [],
  onlyCertified: false,
  onlyNewcomer: false,
});

// 是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return (
    filters.serviceTypes.length > 0 ||
    filters.sellerTags.length > 0 ||
    filters.onlyCertified ||
    filters.onlyNewcomer
  );
});

const sellerList = ref(sellers);

// 筛选后的店员列表
const filteredSellers = computed(() => {
  return sellerList.value.filter((seller) => {
    // 搜索过滤
    if (
      searchText.value &&
      !seller.name.includes(searchText.value) &&
      !seller.tags.some((tag) => tag.includes(searchText.value))
    ) {
      return false;
    }
    // 服务类型过滤
    if (
      filters.serviceTypes.length > 0 &&
      !filters.serviceTypes.some((type) => seller.tags.includes(type))
    ) {
      return false;
    }
    // 店员特点过滤
    if (
      filters.sellerTags.length > 0 &&
      !filters.sellerTags.some((tag) => seller.tags.includes(tag))
    ) {
      return false;
    }
    // 认证店员过滤
    if (filters.onlyCertified && !seller.tags.includes("专业认证")) {
      return false;
    }
    // 新人店员过滤
    if (filters.onlyNewcomer && seller.orderCount > 50) {
      return false;
    }
    return true;
  });
});

// 获取排序图标
const getSortIcon = (type) => {
  if (activeSort.value !== type) return "arrow-down";
  return sortOrder.value === "desc" ? "arrow-down" : "arrow-up";
};

const handleSellerClick = (seller) => {
  router.push(`/seller/${seller.id}`);
};

// 切换排序
const handleSortChange = (type) => {
  if (activeSort.value === type) {
    sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
  } else {
    activeSort.value = type;
    sortOrder.value = "desc";
  }
};

// 切换筛选条件
const toggleFilter = (type, value) => {
  const list = filters[type];
  const index = list.indexOf(value);
  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(value);
  }
};

// 重置筛选
const resetFilters = () => {
  filters.serviceTypes = [];
  filters.sellerTags = [];
  filters.onlyCertified = false;
  filters.onlyNewcomer = false;
};

// 应用筛选
const applyFilters = () => {
  showFilter.value = false;
};

// 收藏店员
const handleFavorite = (seller) => {
  // TODO: 调用收藏接口
  showDialog({
    title: "收藏店员",
    message: h("div", [
      h("p", "收藏后可以更方便地找到Ta"),
      h("textarea", {
        class: "w-full p-2 border rounded mt-3 text-sm",
        placeholder: "添加备注（选填，仅自己可见）",
        rows: 3,
      }),
    ]),
    confirmButtonText: "确认收藏",
    confirmButtonColor: "#14b8a6",
  }).then(() => {
    seller.isFavorite = true;
    showToast({
      message: "收藏成功",
      type: "success",
    });
  });
};

// 取消收藏
const handleUnfavorite = (seller) => {
  showDialog({
    title: "取消收藏",
    message: "确定取消收藏该店员吗？",
    confirmButtonText: "确定",
    confirmButtonColor: "#ef4444",
  }).then(() => {
    // TODO: 调用取消收藏接口
    seller.isFavorite = false;
    seller.note = null;
    showToast({
      message: "已取消收藏",
      type: "success",
    });
  });
};

// 特色店员
const featuredSellers = computed(() => {
  return sellerList.value.filter((seller) => seller.rating >= 4.8).slice(0, 3);
});

// 咨询主题
const consultTopics = [
  { id: "emotion", name: "情感困扰", icon: "like-o" },
  { id: "anxiety", name: "焦虑压力", icon: "warning-o" },
  { id: "career", name: "职业发展", icon: "chart-trending-o" },
  { id: "life", name: "生活困惑", icon: "question-o" },
];

const showMatchDialog = ref(false);
const selectedTopic = ref("");

// 智能匹配
const handleMatch = async () => {
  if (!selectedTopic.value) {
    showToast("请选择咨询主题");
    return;
  }

  showLoadingToast({
    message: "正在匹配最适合的店员...",
    duration: 0,
  });

  try {
    // TODO: 调用匹配接口
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const matchedSeller = sellerList.value.find((seller) =>
      seller.tags.includes(selectedTopic.value)
    );
    if (matchedSeller) {
      handleSellerClick(matchedSeller);
    } else {
      showToast("没有找到合适的店员");
    }
  } catch (error) {
    showToast("匹配失败，请稍后再试");
  } finally {
    showLoadingToast.value = false;
  }
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.bg-white {
  @apply cursor-pointer transition-shadow duration-200;
}

.bg-white:active {
  @apply shadow-md;
}

.text-sm {
  @apply transition-colors duration-200;
}

.text-sm:active {
  @apply bg-surface-50;
}
</style>
