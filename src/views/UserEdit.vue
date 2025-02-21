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
            >
              <template #label>
                <div class="flex items-center">
                  <van-icon name="user-o" class="mr-1 text-brand-500" />
                  昵称
                </div>
              </template>
            </van-field>
            <van-field name="sex" label="性别" class="custom-field">
              <template #label>
                <div class="flex items-center">
                  <van-icon name="friends-o" class="mr-1 text-brand-500" />
                  性别
                </div>
              </template>
              <template #input>
                <van-radio-group
                  v-model="formData.sex"
                  direction="horizontal"
                  class="custom-radio-group"
                >
                  <van-radio :name="1" checked-color="#14b8a6">男</van-radio>
                  <van-radio :name="0" checked-color="#14b8a6">女</van-radio>
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
            >
              <template #label>
                <div class="flex items-center">
                  <van-icon name="location-o" class="mr-1 text-brand-500" />
                  地区
                </div>
              </template>
            </van-field>
            <template v-if="userStore.isSeller">
              <van-field
                v-model="formData.birthday"
                label="出生日期"
                placeholder="请选择出生日期"
                readonly
                is-link
                @click="showBirthdayPicker = true"
                :rules="[{ required: true, message: '请选择出生日期' }]"
                class="custom-field"
              >
                <template #label>
                  <div class="flex items-center">
                    <van-icon name="calendar-o" class="mr-1 text-brand-500" />
                    出生日期
                  </div>
                </template>
              </van-field>
            </template>
            <van-field
              v-model="formData.bio"
              v-if="userStore.isSeller"
              label="个性签名"
              type="textarea"
              rows="3"
              maxlength="50"
              :placeholder="
                userStore.isSeller
                  ? '介绍一下自己，让更多人了解你'
                  : '写点什么来展示自己吧'
              "
              class="custom-field"
              :rules="[
                {
                  required: userStore.isSeller,
                  message: '请输入个性签名',
                },
              ]"
            >
              <template #extra>
                <div class="text-xs text-surface-400">
                  {{ formData.bio.length }}/50
                </div>
              </template>
              <template #label>
                <div class="flex items-center">
                  <van-icon name="edit" class="mr-1 text-brand-500" />
                  个性签名
                </div>
              </template>
            </van-field>
          </van-cell-group>
          <div class="p-6">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="submitting"
              class="btn-primary"
              @click="onSubmit"
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

    <!-- 生日选择器 -->
    <van-popup v-model:show="showBirthdayPicker" position="bottom" round>
      <van-picker
        title="选择出生日期"
        :columns="dateColumns"
        @confirm="onBirthdayConfirm"
        @cancel="showBirthdayPicker = false"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { showToast } from "vant";
import { areaList } from "@vant/area-data";
// import { updateUserInfo } from "@/api/user";
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
  birthday: userStore.userInfo?.birthday || "1995-01-01",
  bio: userStore.userInfo?.bio || "",
});

const showArea = ref(false);
const showBirthdayPicker = ref(false);
const submitting = ref(false);

// 头像地址
const avatarUrl = computed(() => {
  const url = userStore.userInfo?.avatarUrl;
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
const handleEditAvatar = async () => {
  // TODO: 实现头像上传功能
  // try {
  //   const res = await chooseImage();
  //   console.log("选择图片返回:", res);
  //   const localImgUrl = await getLocalImgUrl(res[0]);
  //   console.log("本地图片 base64:", localImgUrl.slice(0, 50) + "..."); // 只打印开头部分避免日志过长
  //   const file = base64ToFile(localImgUrl);
  //   console.log("转换后的文件:", {
  //     name: file.name,
  //     size: file.size,
  //     type: file.type,
  //     lastModified: file.lastModified,
  //   });
  //   // 验证文件是否有效
  //   if (!(file instanceof File) || file.size === 0) {
  //     throw new Error("文件转换失败");
  //   }
  //   // 创建 FormData 对象
  //   const formData = new FormData();
  //   formData.append("avatar", file);
  //   const result = await updateUserInfo(formData);
  //   console.log("上传结果:", result);
  //   // 更新头像显示
  //   if (result.avatarUrl) {
  //     userStore.updateUserAvatar(result.avatarUrl);
  //   }
  //   showToast({
  //     message: "头像更新成功",
  //     type: "success",
  //   });
  // } catch (error) {
  //   console.error("头像上传失败:", error);
  //   showToast({
  //     message: error.message || "头像上传失败",
  //     type: "fail",
  //   });
  // }
};

// 生成年月日选择器的列
const generateDateColumns = () => {
  const years = Array.from({ length: 36 }, (_, i) => 1970 + i).map((year) => ({
    text: `${year}年`,
    value: year,
  }));

  const months = Array.from({ length: 12 }, (_, i) => i + 1).map((month) => ({
    text: `${month}月`,
    value: month,
  }));

  const days = Array.from({ length: 31 }, (_, i) => i + 1).map((day) => ({
    text: `${day}日`,
    value: day,
  }));

  return [years, months, days];
};

const dateColumns = ref(generateDateColumns());

// 处理生日选择
const onBirthdayConfirm = (values) => {
  console.log("onBirthdayConfirm", values);
  const { selectedValues } = values;
  const [year, month, day] = selectedValues;
  formData.value.birthday = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  showBirthdayPicker.value = false;
};

// 提交表单
const onSubmit = async () => {
  submitting.value = true;
  try {
    // TODO: 实现用户信息更新
    // 1. 调用后端更新接口
    // 2. 更新本地 store 数据
    // const data = await updateUserInfo({
    //   sex: formData.value.sex,
    // });
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
  @apply text-surface-600;
}

/* 调整图标样式 */
.custom-field :deep(.van-field__label-icon) {
  @apply mr-1 text-lg;
}

/* 调整图标与文字的对齐 */
.custom-field :deep(.van-field__label-icon .van-icon) {
  @apply -mt-0.5;
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
