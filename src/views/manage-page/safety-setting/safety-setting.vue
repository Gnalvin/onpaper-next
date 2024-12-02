<template>
  <div class="safety">
    <div class="head">
      <span>账号安全</span>
      <span class="tip">绑定手机和邮箱，并设置密码，帐号更安全</span>
    </div>
    <div class="body">
      <div class="item">
        <div class="title">绑定手机</div>
        <div class="content">{{ safetyStore.phone }}</div>
        <div class="setting" @click="settingType = '手机号'">更换手机</div>
      </div>
      <div class="item">
        <div class="title">绑定邮箱</div>
        <div class="content">
          {{ safetyStore.email ? safetyStore.email : '未绑定' }}
        </div>
        <div class="setting" @click="settingType = '邮箱'">
          {{ safetyStore.email ? '更换邮箱' : '绑定邮箱' }}
        </div>
      </div>
      <div class="item">
        <div class="title">设置密码</div>
        <div class="content">
          {{ safetyStore.password ? '已设置' : '未设置' }}
        </div>
        <div class="setting" @click="settingType = '密码'">修改密码</div>
      </div>
    </div>
  </div>
  <verifyPanel
    v-if="settingType"
    :settingType="settingType"
    @close="settingType = ''"
  ></verifyPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useSafetyStore from '@/stores/module/setting/safety'
import verifyPanel from './verify-panel/verify-panel.vue'
const safetyStore = useSafetyStore()
safetyStore.getUserBindingInfoAction()

const settingType = ref<'手机号' | '邮箱' | '密码' | ''>()
</script>

<style scoped lang="less">
.safety {
  padding: 50px;
}
.head {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text1);
  .tip {
    min-width: 0;
    margin-top: 5px;
    color: var(--color-text4-hover);
    font-size: 14px;
  }
}
.body {
  margin-top: 50px;
  .item {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    border-bottom: 1px solid var(--transparent-hover);
    .title {
      font-size: 16px;
      margin: 0 30px;
      font-weight: 500;
    }
    .content {
      width: 100px;
    }
    .setting {
      margin: 0 30px;
      font-weight: 500;
      cursor: pointer;
      color: var(--primary-middle-color);
    }
  }
}
</style>
