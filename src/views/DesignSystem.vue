<template>
  <div class="min-h-screen bg-background-light">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="设计系统展示"
      left-arrow
      @click-left="$router.back()"
      fixed
      placeholder
      class="bg-background"
    />

    <div class="p-md space-y-xl">
      <!-- 颜色系统 -->
      <section>
        <h2 class="text-lg font-medium text-text-primary mb-md">主题色系统</h2>
        <div class="space-y-md">
          <!-- 主色 -->
          <div>
            <h3 class="text-sm text-text-secondary mb-sm">主色</h3>
            <div class="grid grid-cols-3 gap-sm">
              <div
                class="aspect-square bg-primary rounded-lg flex items-center justify-center text-white text-sm"
              >
                Primary
              </div>
              <div
                class="aspect-square bg-primary-light rounded-lg flex items-center justify-center text-white text-sm"
              >
                Light
              </div>
              <div
                class="aspect-square bg-primary-dark rounded-lg flex items-center justify-center text-white text-sm"
              >
                Dark
              </div>
            </div>
          </div>

          <!-- 文本色 -->
          <div>
            <h3 class="text-sm text-text-secondary mb-sm">文本色</h3>
            <div class="space-y-sm">
              <div class="p-sm rounded-lg bg-background flex items-center">
                <span class="text-text-primary">主要文本</span>
                <span class="text-xs text-text-secondary ml-auto"
                  >text-text-primary</span
                >
              </div>
              <div class="p-sm rounded-lg bg-background flex items-center">
                <span class="text-text-regular">常规文本</span>
                <span class="text-xs text-text-secondary ml-auto"
                  >text-text-regular</span
                >
              </div>
              <div class="p-sm rounded-lg bg-background flex items-center">
                <span class="text-text-secondary">次要文本</span>
                <span class="text-xs text-text-secondary ml-auto"
                  >text-text-secondary</span
                >
              </div>
            </div>
          </div>

          <!-- 功能色 -->
          <div>
            <h3 class="text-sm text-text-secondary mb-sm">功能色</h3>
            <div class="grid grid-cols-4 gap-sm">
              <div
                class="aspect-square bg-success-500 rounded-lg flex items-center justify-center text-white text-sm"
              >
                Success
              </div>
              <div
                class="aspect-square bg-warning-500 rounded-lg flex items-center justify-center text-white text-sm"
              >
                Warning
              </div>
              <div
                class="aspect-square bg-danger-500 rounded-lg flex items-center justify-center text-white text-sm"
              >
                Danger
              </div>
              <div
                class="aspect-square bg-feature-service rounded-lg flex items-center justify-center text-white text-sm"
              >
                Service
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 按钮系统 -->
      <section>
        <h2 class="text-lg font-medium text-text-primary mb-md">按钮系统</h2>
        <div class="space-y-sm">
          <!-- 主要按钮 -->
          <div>
            <h3 class="text-sm text-text-secondary mb-sm">主要按钮</h3>
            <div class="space-y-sm">
              <van-button block type="primary" size="large"
                >主要按钮</van-button
              >
              <van-button block type="primary" size="large" loading
                >加载中</van-button
              >
              <van-button block type="primary" size="large" disabled
                >禁用状态</van-button
              >
            </div>
          </div>

          <!-- 次要按钮 -->
          <div>
            <h3 class="text-sm text-text-secondary mb-sm">次要按钮</h3>
            <div class="space-y-sm">
              <van-button block plain size="large">次要按钮</van-button>
              <van-button block plain size="large" loading>加载中</van-button>
              <van-button block plain size="large" disabled
                >禁用状态</van-button
              >
            </div>
          </div>

          <!-- 功能按钮 -->
          <div>
            <h3 class="text-sm text-text-secondary mb-sm">功能按钮</h3>
            <div class="grid grid-cols-2 gap-sm">
              <van-button block type="success" size="normal"
                >成功按钮</van-button
              >
              <van-button block type="warning" size="normal"
                >警告按钮</van-button
              >
              <van-button block type="danger" size="normal"
                >危险按钮</van-button
              >
              <van-button block icon="plus" size="normal">图标按钮</van-button>
            </div>
          </div>
        </div>
      </section>

      <!-- 表单元素 -->
      <section>
        <h2 class="text-lg font-medium text-text-primary mb-md">表单元素</h2>
        <div class="space-y-md">
          <!-- 输入框 -->
          <div>
            <h3 class="text-sm text-text-secondary mb-sm">输入框</h3>
            <div class="space-y-sm">
              <van-field
                v-model="form.text"
                label="文本"
                placeholder="请输入文本"
              />
              <van-field
                v-model="form.password"
                type="password"
                label="密码"
                placeholder="请输入密码"
              />
              <van-field
                v-model="form.textarea"
                type="textarea"
                label="文本域"
                placeholder="请输入内容"
                rows="3"
              />
            </div>
          </div>

          <!-- 单选框 -->
          <div>
            <h3 class="text-sm text-text-secondary mb-sm">单选框</h3>
            <van-radio-group v-model="form.radio" direction="horizontal">
              <van-radio name="1">选项一</van-radio>
              <van-radio name="2">选项二</van-radio>
            </van-radio-group>
          </div>

          <!-- 复选框 -->
          <div>
            <h3 class="text-sm text-text-secondary mb-sm">复选框</h3>
            <van-checkbox-group v-model="form.checkbox" direction="horizontal">
              <van-checkbox name="1">选项一</van-checkbox>
              <van-checkbox name="2">选项二</van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
      </section>

      <!-- 卡片组件 -->
      <section>
        <h2 class="text-lg font-medium text-text-primary mb-md">卡片组件</h2>
        <div class="space-y-md">
          <!-- 基础卡片 -->
          <div class="card">
            <div class="text-text-primary font-medium mb-sm">基础卡片</div>
            <p class="text-text-regular">
              这是一个基础卡片的示例，使用了我们的设计令牌。
            </p>
          </div>

          <!-- Vant 卡片 -->
          <van-card
            num="2"
            price="2.00"
            desc="描述信息"
            title="商品标题"
            thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
          >
            <template #tags>
              <van-tag type="primary" class="mr-xs">标签</van-tag>
              <van-tag plain type="primary">标签</van-tag>
            </template>
            <template #footer>
              <van-button size="small" class="mr-xs">按钮</van-button>
              <van-button size="small" type="primary">按钮</van-button>
            </template>
          </van-card>
        </div>
      </section>

      <!-- 列表组件 -->
      <section>
        <h2 class="text-lg font-medium text-text-primary mb-md">列表组件</h2>
        <van-cell-group class="card overflow-hidden">
          <van-cell title="单元格" value="内容" />
          <van-cell title="单元格" value="内容" label="描述信息" />
          <van-cell title="单元格" is-link />
          <van-cell title="单元格" is-link value="内容" />
        </van-cell-group>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  text: "",
  password: "",
  textarea: "",
  radio: "1",
  checkbox: ["1"],
});
</script>

<style scoped>
/* 基础样式覆盖 */
:deep(.van-nav-bar) {
  background-color: var(--c-background);
}

:deep(.van-nav-bar__title) {
  color: var(--c-text-primary);
}

:deep(.van-cell-group) {
  background-color: transparent;
}

/* 卡片样式 */
.card {
  @apply bg-background rounded-lg p-md shadow-sm;
}
</style>
