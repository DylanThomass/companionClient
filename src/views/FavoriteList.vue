<template>
  <div class="min-h-screen bg-surface-50">
    <!-- 收藏列表 -->
    <div class="p-4 space-y-4">
      <template v-if="favoriteList.length > 0">
        <!-- 店员卡片 -->
        <div
          v-for="item in favoriteList"
          :key="item.id"
          class="bg-white rounded-2xl p-4 shadow-lg"
          @click="handleViewProfile(item)"
        >
          <!-- 店员基本信息 -->
          <div class="flex items-center relative">
            <van-image
              round
              width="56"
              height="56"
              :src="item.avatar"
              class="border-2 border-white shadow-md"
            />
            <div class="ml-4 flex-1">
              <div class="text-lg font-medium text-surface-800">
                {{ item.name }}
              </div>
              <div class="flex items-center gap-1 mt-1 overflow-hidden">
                <span
                  v-for="tag in item.tags?.slice(0, 2)"
                  :key="tag"
                  class="inline-block px-1.5 py-0.5 text-xs bg-surface-50 text-surface-500 rounded-full whitespace-nowrap overflow-hidden text-ellipsis"
                  style="max-width: 4rem"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <!-- 操作按钮 -->
            <van-icon
              name="share-o"
              class="text-surface-400 text-lg p-2"
              @click.stop="handleShare(item)"
            >
            </van-icon>
          </div>

          <!-- 备注信息 -->
          <div
            v-if="item.note"
            class="mt-3 p-2 bg-surface-50 rounded-lg text-sm text-surface-600"
          >
            <div class="flex items-center justify-between">
              <span class="text-surface-400">备注</span>
              <van-icon
                name="edit"
                class="text-surface-400"
                @click.stop="handleEditNote(item)"
              />
            </div>
            <div class="mt-1">{{ item.note }}</div>
          </div>
          <div
            v-else
            class="mt-3 p-2 bg-surface-50 rounded-lg text-sm text-surface-400 text-center"
            @click.stop="handleEditNote(item)"
          >
            添加备注
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <van-empty
        v-else
        description="暂无收藏的店员"
        class="bg-white rounded-2xl p-8 shadow-lg"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast, showDialog } from "vant";
import HeadImg1 from "@/assets/test/HeadImg-1.jpg";
import HeadImg2 from "@/assets/test/HeadImg-2.jpg";
import HeadImg3 from "@/assets/test/HeadImg-3.jpg";
import HeadImg4 from "@/assets/test/HeadImg-4.jpg";

const router = useRouter();

// 模拟收藏列表数据
const favoriteList = ref([
  {
    id: 1,
    name: "浅夏微凉",
    tags: ["善解人意", "温暖治愈", "倾听者"],
    avatar: HeadImg1,
    note: "很耐心的倾听者，声音很治愈",
  },
  {
    id: 2,
    name: "暖阳晴空",
    tags: ["专业认证", "经验丰富", "耐心细致"],
    avatar: HeadImg2,
    note: null,
  },
]);

// 分享店员主页
const handleShare = async (seller) => {
  try {
    const shareLink = `${window.location.origin}/seller/${seller.id}`;
    if (navigator.share) {
      // 如果支持原生分享
      await navigator.share({
        title: seller.name,
        text: `${seller.name} - ${seller.tags?.join("、")}`,
        url: shareLink,
      });
    } else {
      // 如果不支持原生分享，复制链接
      await navigator.clipboard.writeText(shareLink);
      showToast({
        message: "链接已复制",
        type: "success",
      });
    }
  } catch (error) {
    console.error("分享失败:", error);
    showToast({
      message: "分享失败",
      type: "error",
    });
  }
};

// 编辑备注
const handleEditNote = (seller) => {
  showDialog({
    title: "编辑备注",
    message: h("div", [
      h("textarea", {
        class: "w-full p-2 border rounded mt-2 text-sm",
        placeholder: "添加备注（仅自己可见）",
        rows: 3,
        value: seller.note,
      }),
    ]),
    confirmButtonText: "保存",
    confirmButtonColor: "#14b8a6",
  }).then(() => {
    // TODO: 调用更新备注接口
    showToast({
      message: "备注已更新",
      type: "success",
    });
  });
};

// 查看店员主页
const handleViewProfile = (seller) => {
  // TODO: 跳转到店员主页
  showToast("店员主页开发中...");
  // router.push(`/seller/${seller.id}`);
};
</script>

<style scoped>
.bg-white {
  @apply cursor-pointer transition-shadow duration-200;
}

.bg-white:active {
  @apply shadow-md;
}

.van-icon {
  @apply cursor-pointer rounded-full transition-colors duration-200;
}

.van-icon:active {
  @apply bg-surface-100;
}
</style>
