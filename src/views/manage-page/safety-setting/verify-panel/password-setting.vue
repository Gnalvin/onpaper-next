<template>
  <WLInput
    class="el-input"
    type="password"
    placeholder="请设置密码"
    v-model="password"
    :autocomplete="'new-password'"
    :verify-rules="rules.password"
    :theme="true"
    ref="passwordInput"
    v-focus
  >
    <template #bottom>
      <Transition name="tip" appear>
        <div class="password-verify">
          <p class="tip-title">您的密码必须有：</p>
          <div
            class="tip-content"
            :class="{
              'tip-success': verifyLength,
              'tip-err': !verifyLength
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
              'tip-err': !verifyMix
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
    class="next-btn waiting"
    @click="changePassword"
    :disable="safetyStore.waiting"
  >
    <span v-if="!safetyStore.waiting">完成</span>
    <span v-else>修改中 ...</span>
  </ElButton>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import WLInput from '@/components/input/wl-input.vue'
import ElButton from '@/components/button/el-button.vue'
import useSafetyStore from '@/stores/module/setting/safety'
import { rules } from '../config'

const emits = defineEmits(['close'])
const safetyStore = useSafetyStore()
const password = ref('')
const passwordInput = ref<InstanceType<typeof WLInput>>()

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
//修改密码
const changePassword = async () => {
  const { verify } = passwordInput.value!.VerifyCallFn()
  if (!verify) return
  const res = await safetyStore.changePasswordAction(password.value)
  if (res.status == 200) {
    emits('close')
  }
}
</script>

<style scoped lang="less">
@import '../css/common.less';
.password-verify {
  margin: 5px 0 -10px 10px;
  .tip-title {
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
