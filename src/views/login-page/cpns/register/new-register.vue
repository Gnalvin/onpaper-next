<template>
  <div class="register">
    <div class="from">
      <WLInput class="el-input" disable :placeholder="phoneNumber">
        <template #left><span class="zone">+86</span></template>
      </WLInput>
      <WLInput
        class="el-input"
        type="password"
        placeholder="请设置密码"
        v-model="password"
        :verify-rules="registerRules.password"
        v-focus
        @show-tip="handlePasswordClick"
      >
        <template #bottom>
          <Transition name="tip" appear>
            <div class="password-verify" v-show="isShowTip">
              <p class="tip-title">您的密码必须有：</p>
              <div
                class="tip-content"
                :class="{
                  'tip-success': verifyLength,
                  'tip-err': !verifyLength && isShowPasswordTip
                }"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 24L20 34L40 14"
                    stroke="#9b9b9b"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                9 到 16 个字符
              </div>
              <div
                class="tip-content"
                :class="{
                  'tip-success': verifyMix,
                  'tip-err': !verifyMix && isShowPasswordTip
                }"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 24L20 34L40 14"
                    stroke="#9b9b9b"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                字母、数字共同组成
              </div>
            </div>
          </Transition>
        </template>
      </WLInput>
      <ElButton
        class="next-btn"
        @click="handleRegister"
        :disable="loginStore.waiting"
      >
        <span v-if="!loginStore.waiting">注册</span>
        <span v-else>注册中 ...</span>
      </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import WLInput from '@/components/input/wl-input.vue'
import ElButton from '@/components/button/el-button.vue'
import useLoginStore from '@/stores/module/login'
import { registerRules } from '../../config/account'

defineProps({
  phoneNumber: {
    type: String,
    required: true
  }
})
const loginStore = useLoginStore()
const password = ref('')

//展示密码强度提示
const isShowPasswordTip = ref(false)
const handlePasswordClick = (status: boolean) => {
  firstShow.value = false
  isShowPasswordTip.value = status
}
// 不同阶段密码提示
const verifyLength = ref(false)
const verifyMix = ref(false)
const lengthRules = /^\S{9,16}$/
const mixRules = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)/

watch(password, (newValue) => {
  verifyLength.value = lengthRules.test(newValue)
  verifyMix.value = mixRules.test(newValue)
  if (newValue.length === 0) {
    verifyLength.value = false
    verifyMix.value = false
  }
})

let firstShow = ref(true) // 第一次不展示密码提示
const isShowTip = computed(() => {
  return (
    isShowPasswordTip.value ||
    (!firstShow.value && (!verifyLength.value || !verifyMix.value))
  )
})

const handleRegister = () => {
  if (loginStore.waiting) return
  //密码不符合要求返回
  if (!verifyLength.value || !verifyMix.value) return
  loginStore.account.password = password.value
  loginStore.phoneLoginAction()
}
</script>

<style scoped lang="less">
@import '../css/common.less';

.password-verify {
  margin: 5px 0 -10px 10px;
  .tip-title {
    color: #161823;
    font-weight: 500;
    margin: 4px 0px;
  }
  .tip-content {
    svg {
      margin-right: 5px;
    }
    display: flex;
    align-items: center;
    margin: 4px 0;
    font-size: 12px;
    line-height: 15px;
  }
}
.zone {
  color: #7d7d7d;
  margin-left: 20px;
}
// 提示的颜色
.tip-success {
  color: #4ad2a6;
  svg {
    path {
      stroke: #4ad2a6;
    }
  }
}
.tip-err {
  color: rgb(255, 76, 58);
  svg {
    path {
      stroke: rgb(255, 76, 58);
    }
  }
}

.tip-enter-from,
.tip-leave-to {
  opacity: 0;
}

.tip-enter-active,
.tip-leave-active {
  transition: opacity 0.6s ease;
}
</style>
