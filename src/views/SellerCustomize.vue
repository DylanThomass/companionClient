<template>
  <div class="min-h-screen bg-surface-50 pb-20">
    <!-- 预览区域 -->
    <div class="relative">
      <!-- 主页预览 -->
      <div class="bg-white relative">
        <!-- 轮播图 -->
        <div class="relative h-72">
          <van-swipe class="h-full" :autoplay="3000" indicator-color="#14b8a6">
            <van-swipe-item
              v-for="(image, index) in formData.images"
              :key="index"
            >
              <van-image
                :src="image"
                fit="cover"
                class="w-full h-full"
                radius="0"
              >
                <template #error>
                  <div
                    class="w-full h-72 bg-surface-100 flex items-center justify-center"
                  >
                    <van-icon
                      name="photo-o"
                      size="32"
                      class="text-surface-400"
                    />
                  </div>
                </template>
              </van-image>
            </van-swipe-item>
          </van-swipe>
          <!-- 编辑按钮 -->
          <div class="absolute bottom-6 right-6">
            <van-button
              round
              size="small"
              class="edit-btn"
              @click="handleEditImages"
            >
              <template #icon>
                <van-icon name="photograph" />
              </template>
              编辑轮播图
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑表单 -->
    <div class="px-4 -mt-6 relative z-10">
      <div class="bg-white rounded-xl p-4 shadow-md">
        <van-form @submit="onSubmit">
          <!-- 语音介绍 -->
          <div class="mt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-surface-700">语音介绍</span>
              <span class="text-xs text-surface-400">最长60秒</span>
            </div>
            <div class="bg-surface-50 p-4 rounded-lg">
              <div
                v-if="formData.voiceIntro"
                class="flex items-center justify-between"
              >
                <div class="flex items-center">
                  <van-icon name="volume-o" class="mr-2" />
                  <span class="text-sm">{{ voiceDuration }}秒</span>
                </div>
                <div class="flex items-center">
                  <van-button
                    size="mini"
                    round
                    plain
                    type="primary"
                    class="mr-2"
                    @click="playVoice"
                  >
                    <template #icon>
                      <van-icon
                        :name="isPlaying ? 'pause-circle-o' : 'play-circle-o'"
                      />
                    </template>
                    试听
                  </van-button>
                  <van-button
                    size="mini"
                    round
                    type="danger"
                    @click="removeVoice"
                  >
                    删除
                  </van-button>
                </div>
              </div>
              <div v-else>
                <van-uploader
                  :after-read="afterVoiceRead"
                  :max-size="2 * 1024 * 1024"
                  accept="audio/*"
                >
                  <div
                    class="flex items-center justify-center p-4 border border-dashed border-surface-300 rounded-lg cursor-pointer hover:bg-surface-100 transition-colors duration-300"
                  >
                    <van-icon name="plus" class="mr-2 text-surface-400" />
                    <span class="text-sm text-surface-600">上传语音介绍</span>
                  </div>
                </van-uploader>
              </div>
            </div>
          </div>

          <!-- 服务项目管理 -->
          <div class="mt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-surface-700">服务项目</span>
              <van-button
                round
                size="mini"
                type="primary"
                @click="showServiceEditor = true"
              >
                管理服务
              </van-button>
            </div>
            <div class="bg-surface-50 p-4 rounded-lg space-y-3">
              <div
                v-for="service in formData.services"
                :key="service.id"
                class="flex items-center justify-between"
              >
                <div class="flex items-center">
                  <van-icon :name="service.icon" class="mr-2" />
                  <span>{{ service.name }}</span>
                </div>
                <van-switch
                  v-model="service.enabled"
                  size="14px"
                  active-color="#14b8a6"
                />
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="mt-8">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              color="#14b8a6"
            >
              保存修改
            </van-button>
          </div>
        </van-form>
      </div>
    </div>

    <!-- 轮播图编辑弹窗 -->
    <van-popup
      v-model:show="showImageEditor"
      position="bottom"
      round
      safe-area-inset-bottom
    >
      <div class="p-4">
        <div class="text-lg font-medium mb-4">编辑轮播图</div>
        <div class="space-y-4">
          <div
            v-for="(image, index) in formData.images"
            :key="index"
            class="relative"
          >
            <van-image
              :src="image"
              fit="cover"
              class="w-full h-32 rounded-lg"
            />
            <div class="absolute top-2 right-2">
              <van-button
                round
                size="mini"
                type="danger"
                @click="removeImage(index)"
              >
                删除
              </van-button>
            </div>
          </div>
          <div v-if="formData.images.length < 5">
            <van-uploader
              :after-read="afterRead"
              :max-count="5 - formData.images.length"
              :max-size="5 * 1024 * 1024"
              accept="image/*"
              multiple
            >
              <div
                class="w-full h-32 rounded-lg bg-surface-50 border border-dashed border-surface-300 flex items-center justify-center hover:bg-surface-100 transition-colors duration-300 cursor-pointer"
              >
                <div class="text-center">
                  <van-icon
                    name="photograph"
                    class="text-2xl text-surface-400"
                  />
                  <div class="mt-2 text-sm text-surface-500">添加轮播图</div>
                </div>
              </div>
            </van-uploader>
          </div>
        </div>
        <div class="mt-4">
          <van-button round block @click="showImageEditor = false">
            确定
          </van-button>
        </div>
      </div>
    </van-popup>

    <!-- 服务编辑弹窗 -->
    <van-popup
      v-model:show="showServiceEditor"
      position="bottom"
      round
      safe-area-inset-bottom
      style="height: 80vh"
    >
      <div class="p-4 h-full flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <span class="text-lg font-medium">服务详情设置</span>
          <van-icon
            name="cross"
            class="text-lg text-surface-400"
            @click="showServiceEditor = false"
          />
        </div>
        <div class="flex-1 overflow-auto space-y-4">
          <div
            v-for="service in formData.services"
            :key="service.id"
            class="p-4 bg-surface-50 rounded-lg"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <van-icon :name="service.icon" class="mr-2" />
                <span class="font-medium">{{ service.name }}</span>
              </div>
              <van-switch
                v-model="service.enabled"
                size="14px"
                active-color="#14b8a6"
              />
            </div>

            <div class="mt-4 space-y-3">
              <!-- 服务时段 -->
              <div class="mt-2">
                <div class="text-sm text-surface-600 mb-2">服务时长与定价</div>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="range in service.timeRanges"
                    :key="range.type"
                    class="p-3 bg-white rounded-lg"
                    :class="{ 'opacity-50': !service.enabled }"
                  >
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium">{{
                          range.name
                        }}</span>
                        <van-switch
                          v-model="range.enabled"
                          size="14px"
                          active-color="#14b8a6"
                          :disabled="!service.enabled"
                        />
                      </div>
                      <div class="text-xs text-surface-500 mb-2">
                        {{ range.description }}
                      </div>
                      <div class="flex items-center justify-between mt-2">
                        <span class="text-sm text-surface-500">价格</span>
                        <span
                          class="text-base font-medium"
                          :class="[
                            service.enabled && range.enabled
                              ? 'text-brand-500'
                              : 'text-surface-400',
                          ]"
                        >
                          ¥{{ range.price }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-surface-100">
          <van-button round block type="primary" @click="handleSaveServices">
            保存设置
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { showToast } from "vant";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

// 用户等级信息
const userLevel = ref({
  level: 2,
  exp: 750,
  title: "温暖使者",
});

// 表单数据
const formData = ref({
  voiceIntro: null,
  voiceDuration: 0,
  images: [
    "https://picsum.photos/800/400",
    "https://picsum.photos/800/401",
    "https://picsum.photos/800/402",
  ],
  services: [
    {
      id: 1,
      name: "文字语音条",
      icon: "chat-o",
      enabled: true,
      description: "温暖文字/语音陪伴，随时倾诉烦恼",
      timeRanges: [
        {
          type: "halfHour",
          name: "半小时",
          price: 29.9,
          enabled: true,
        },
        {
          type: "hour",
          name: "一小时",
          price: 49.9,
          enabled: true,
        },
        {
          type: "day",
          name: "一天",
          price: 199.9,
          enabled: true,
        },
        {
          type: "week",
          name: "一周",
          price: 999.9,
          enabled: true,
        },
      ],
    },
    {
      id: 2,
      name: "语音聊天",
      icon: "phone-o",
      enabled: true,
      description: "实时语音交流，温暖治愈陪伴",
      timeRanges: [
        {
          type: "day",
          name: "一天",
          price: 299.9,
          enabled: true,
        },
        {
          type: "week",
          name: "一周",
          price: 1499.9,
          enabled: true,
        },
        {
          type: "month",
          name: "一个月",
          price: 3999.9,
          enabled: true,
        },
      ],
    },
    {
      id: 3,
      name: "情绪咨询",
      icon: "smile-o",
      enabled: true,
      description: "专业情绪疏导，解决心理困扰",
      timeRanges: [
        {
          type: "hour",
          name: "一小时",
          price: 99.9,
          enabled: true,
        },
        {
          type: "day",
          name: "一天",
          price: 499.9,
          enabled: true,
        },
      ],
    },
    {
      id: 4,
      name: "虚拟恋爱",
      icon: "like-o",
      enabled: true,
      description: "温暖恋爱体验，感受甜蜜时光",
      timeRanges: [
        {
          type: "hour",
          name: "一小时",
          price: 69.9,
          enabled: true,
        },
        {
          type: "day",
          name: "一天",
          price: 299.9,
          enabled: true,
        },
        {
          type: "week",
          name: "一周",
          price: 1599.9,
          enabled: true,
        },
      ],
    },
    {
      id: 5,
      name: "视频聊天",
      icon: "video-o",
      enabled: true,
      description: "面对面视频交流，更真实的陪伴",
      timeRanges: [
        {
          type: "halfHour",
          name: "半小时",
          price: 99.9,
          enabled: true,
        },
        {
          type: "hour",
          name: "一小时",
          price: 179.9,
          enabled: true,
        },
      ],
    },
    {
      id: 6,
      name: "叫醒服务",
      icon: "clock-o",
      enabled: true,
      description: "温暖的早安问候，开启美好一天",
      timeRanges: [
        {
          type: "once",
          name: "单次",
          price: 9.9,
          enabled: true,
        },
        {
          type: "day",
          name: "包天",
          price: 29.9,
          enabled: true,
        },
      ],
    },
  ],
});

// 语音播放状态
const isPlaying = ref(false);
const audioPlayer = ref(null);

// 处理语音上传
const afterVoiceRead = async (file) => {
  try {
    // 创建音频对象获取时长
    const audio = new Audio(URL.createObjectURL(file.file));
    await new Promise((resolve) => {
      audio.addEventListener("loadedmetadata", () => {
        if (audio.duration > 60) {
          showToast("语音时长不能超过60秒");
          resolve(false);
        } else {
          formData.value.voiceIntro = file.file;
          formData.value.voiceDuration = Math.ceil(audio.duration);
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.error("语音处理失败:", error);
    showToast("语音处理失败");
  }
};

// 播放语音
const playVoice = () => {
  if (!audioPlayer.value) {
    audioPlayer.value = new Audio(
      URL.createObjectURL(formData.value.voiceIntro)
    );
    audioPlayer.value.addEventListener("ended", () => {
      isPlaying.value = false;
    });
  }

  if (isPlaying.value) {
    audioPlayer.value.pause();
    isPlaying.value = false;
  } else {
    audioPlayer.value.play();
    isPlaying.value = true;
  }
};

// 删除语音
const removeVoice = () => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value = null;
  }
  formData.value.voiceIntro = null;
  formData.value.voiceDuration = 0;
  isPlaying.value = false;
};

// 轮播图编辑器显示状态
const showImageEditor = ref(false);

// 服务编辑器显示状态
const showServiceEditor = ref(false);

// 编辑轮播图
const handleEditImages = () => {
  showImageEditor.value = true;
};

// 删除图片
const removeImage = (index) => {
  formData.value.images.splice(index, 1);
};

// 上传图片后的处理
const afterRead = (file) => {
  // TODO: 实现图片上传到服务器
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.value.images.push(e.target.result);
  };
  reader.readAsDataURL(file.file);
};

// 切换服务状态
const toggleService = (serviceId) => {
  const service = formData.value.services.find((s) => s.id === serviceId);
  if (service) {
    service.enabled = !service.enabled;
  }
};

// 提交表单
const onSubmit = async (values) => {
  try {
    // TODO: 调用后端接口保存数据
    console.log("提交的数据:", values);
    showToast({
      message: "保存成功",
      type: "success",
    });
  } catch (error) {
    console.error("保存失败:", error);
    showToast({
      message: "保存失败",
      type: "fail",
    });
  }
};

// 处理服务保存
const handleSaveServices = () => {
  // TODO: 实现服务保存逻辑
  console.log("保存的服务数据:", formData.value.services);
  showToast({
    message: "服务设置保存成功",
    type: "success",
  });
  showServiceEditor.value = false;
};

// 计算年龄
const calculateAge = (birthday) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
</script>

<style scoped>
.edit-btn {
  @apply bg-white/90 backdrop-blur text-surface-600 border-surface-200;
}

.edit-btn:active {
  @apply bg-surface-50;
}
</style>
