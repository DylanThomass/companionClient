<template>
  <div class="min-h-screen bg-surface-50">
    <div class="px-4 py-4">
      <!-- 头像编辑 -->
      <div class="bg-white rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-surface-600 font-medium">个人头像</span>
          <div class="relative" @click="handleEditAvatar">
            <van-image
              round
              width="72"
              height="72"
              :src="avatarUrl"
              class="border-4 border-white shadow-md transition-transform duration-300 hover:scale-105"
              loading-icon="photo-o"
              error-icon="warning-o"
            >
            </van-image>
            <div
              class="absolute bottom-0 right-0 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
            >
              <van-icon name="photograph" class="text-white text-sm" />
            </div>
          </div>
        </div>
      </div>

      <!-- 基本信息表单 -->
      <div class="bg-white rounded-2xl mt-6 shadow-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-surface-100">
          <span class="text-surface-600 font-medium">基本信息</span>
        </div>
        <van-form @submit="onSubmit">
          <van-cell-group class="form-group">
            <van-field
              v-model="formData.nickname"
              label="昵称"
              placeholder="请输入昵称"
              :rules="[{ required: true, message: '请输入昵称' }]"
              class="custom-field"
            />
            <van-field name="sex" label="性别" class="custom-field">
              <template #input>
                <van-radio-group
                  v-model="formData.sex"
                  direction="horizontal"
                  class="custom-radio-group"
                >
                  <van-radio :name="1" checked-color="#14b8a6">男</van-radio>
                  <van-radio :name="2" checked-color="#14b8a6">女</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              v-model="formData.location"
              label="地区"
              placeholder="请选择地区"
              readonly
              is-link
              @click="showArea = true"
              class="custom-field"
            />
          </van-cell-group>
          <div class="p-6">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="submitting"
              class="btn-primary"
            >
              保存
            </van-button>
          </div>
        </van-form>
      </div>
    </div>

    <!-- 地区选择器 -->
    <van-popup v-model:show="showArea" position="bottom" round>
      <van-area
        :area-list="areaList"
        @confirm="onConfirmArea"
        @cancel="showArea = false"
        title="选择地区"
        show-toolbar
        :columns-num="2"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { showToast, Area } from "vant";
import { areaList } from "@vant/area-data";

const router = useRouter();
const userStore = useUserStore();

// 默认头像
const DEFAULT_AVATAR =
  "https://mcs-mimp-web.sf-express.com/wemp/uploadFiles/default-avatar.png";

// 表单数据
const formData = ref({
  nickname: userStore.userInfo?.nickname || "",
  sex: userStore.userInfo?.sex || 1,
  province: userStore.userInfo?.province || "",
  city: userStore.userInfo?.city || "",
  location: userStore.userInfo?.province
    ? `${userStore.userInfo.province} ${userStore.userInfo.city}`
    : "",
});

const showArea = ref(false);
const submitting = ref(false);

// 头像地址
const avatarUrl = computed(() => {
  const url = userStore.userInfo?.headimgurl;
  // 如果URL无效或未定义，返回默认头像
  return url && url !== "undefined" ? url : DEFAULT_AVATAR;
});

// 地区选择确认
const onConfirmArea = ({ selectedOptions }) => {
  if (!selectedOptions || selectedOptions.length < 2) {
    showToast({
      message: "请选择完整的地区信息",
      type: "warning",
      icon: "warning-o",
    });
    return;
  }

  const [province, city] = selectedOptions;

  formData.value.province = province.text;
  formData.value.city = city.text;
  formData.value.location = `${province.text} ${city.text}`;
  showArea.value = false;
};

// 编辑头像
const handleEditAvatar = () => {
  // TODO: 实现头像上传功能
  // 1. 调用微信 JS-SDK 选择图片
  // 2. 上传图片到服务器
  // 3. 更新用户头像
  showToast({
    message: "头像上传功能开发中...",
    type: "success",
    icon: "success",
  });
};

// 提交表单
const onSubmit = async () => {
  submitting.value = true;
  try {
    // TODO: 实现用户信息更新
    // 1. 调用后端更新接口
    // 2. 更新本地 store 数据
    await userStore.updateUserInfo({
      nickname: formData.value.nickname,
      sex: formData.value.sex,
      province: formData.value.province,
      city: formData.value.city,
    });
    showToast({
      message: "保存成功",
      type: "success",
      icon: "success",
    });
    router.back();
  } catch (error) {
    console.error("更新用户信息失败:", error);
    showToast({
      message: "保存失败，请重试",
      type: "error",
      icon: "cross",
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* 只针对表单字段的单元格 */
.form-group :deep(.van-field.van-cell) {
  @apply bg-transparent px-6 py-4;
}

.custom-field :deep(.van-field__label) {
  @apply text-surface-600 w-16;
}

.custom-radio-group :deep(.van-radio) {
  @apply mr-8;
}

.custom-radio-group :deep(.van-radio__label) {
  @apply text-surface-600;
}

.btn-primary {
  @apply bg-gradient-to-r from-brand-500 to-brand-400 border-none shadow-lg;
}

.btn-primary:active {
  @apply opacity-90 shadow-md;
}

.btn-primary :deep(.van-button__text) {
  @apply text-white font-medium text-base;
}
</style>
