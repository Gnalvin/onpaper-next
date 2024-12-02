<template>
  <div class="verify-panel top-mask-layer">
    <div class="container">
      <div class="title">
        {{ title }}
        <svg
          @click="$emit('close')"
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 14L34 34"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="bevel"
          />
          <path
            d="M14 34L34 14"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="bevel"
          />
        </svg>
      </div>
      <div class="form" v-if="!isShowNext">
        <WLInput
          class="el-input"
          :placeholder="safetyStore.phone"
          v-model="phone"
          ref="phoneInput"
          disable
          :theme="true"
        >
        </WLInput>
        <WLInput
          class="el-input"
          placeholder="请输入验证码"
          v-model="verifyCode"
          :verify-rules="rules.verifyCode"
          :max-len="6"
          :theme="true"
          :type="'num'"
          ref="codeInput"
        >
          <ElButton class="code" @click="sendCode" :disable="codeBtnDisable">
            <div v-if="!codeBtnDisable">
              <span>获取验证码</span>
            </div>
            <div v-else>
              <span>获取验证码 ({{ count }})</span>
            </div>
          </ElButton>
        </WLInput>
        <ElButton
          class="next-btn waiting"
          @click="next"
          :disable="safetyStore.waiting"
        >
          <span v-if="!safetyStore.waiting">下一步</span>
          <span v-else>登陆中 ...</span>
        </ElButton>
      </div>
      <template v-if="isShowNext">
        <div class="form" v-if="settingType == '手机号'">
          <PhoneSetting @close="$emit('close')"></PhoneSetting>
        </div>
        <div class="form" v-if="settingType == '邮箱'">
          <EmailSetting @close="$emit('close')"></EmailSetting>
        </div>
        <div class="form" v-if="settingType == '密码'">
          <PasswordSetting @close="$emit('close')"></PasswordSetting>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, type PropType } from 'vue'
import useSafetyStore from '@/stores/module/setting/safety'
import PhoneSetting from './phone-setting.vue'
import PasswordSetting from './password-setting.vue'
import EmailSetting from './email-setting.vue'
import WLInput from '@/components/input/wl-input.vue'
import ElButton from '@/components/button/el-button.vue'
import { rules } from '../config'

const props = defineProps({
  settingType: {
    Type: String as PropType<'手机号' | '邮箱' | '密码'>,
    required: true
  }
})
defineEmits(['close'])

const safetyStore = useSafetyStore()

const isShowNext = ref(false) // 是否显示验证的下一步
const phone = ref('')
const verifyCode = ref('')

const phoneInput = ref<InstanceType<typeof WLInput>>()
const codeInput = ref<InstanceType<typeof WLInput>>()

const title = computed(() => {
  if (!isShowNext.value) {
    return '验证手机号'
  } else {
    return '新的' + props.settingType
  }
})
//发送验证码
const count = ref(60)
const codeBtnDisable = ref(false)

const sendCode = async () => {
  //已发送状态 return
  if (codeBtnDisable.value) return
  // 手机验证不通过 return
  const { verify } = phoneInput.value!.VerifyCallFn()
  if (!verify) return

  //发送验证码
  codeBtnDisable.value = true
  countDownFn()
  safetyStore.getSafetyPhoneCodeAction()
}

//倒计时函数
const countDownFn = () => {
  const timer = setInterval(() => {
    count.value--
    if (count.value === 0) {
      clearInterval(timer)
      codeBtnDisable.value = false
      count.value = 60
    }
  }, 1000)
}

let lastVerifyCode = ''
const next = async () => {
  if (safetyStore.waiting) return
  //验证码格式
  const cRes = codeInput.value!.VerifyCallFn()
  if (!cRes.verify) {
    codeInput.value?.ChangeTipMessage(cRes.message)
    return
  }
  // 手机验证不通过 return
  const pRes = phoneInput.value!.VerifyCallFn()
  if (!pRes.verify) return
  if (lastVerifyCode == verifyCode.value) return
  lastVerifyCode = verifyCode.value
  const res = await safetyStore.authSafetyCodeAction(verifyCode.value)
  if (res.status === 1018) {
    codeInput.value?.ChangeTipMessage('验证码错误')
  }
  if (res.status == 200) {
    isShowNext.value = true
  }
}

watch(verifyCode, () => codeInput.value?.ChangeTipMessage(''))

onUnmounted(() => {
  safetyStore.sendCodeStatus = 'unknown'
  safetyStore.verifyEmailStatus = 'unknown'
  safetyStore.waiting = false
})
</script>

<style scoped lang="less">
@import '../css/common.less';
.verify-panel {
  display: flex;
  justify-content: center;
}
.container {
  color: var(--color-text1);
  margin: 20vh auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 280px;
  background-color: var(--surface-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  border: 1px solid var(--border-color1);
  border-radius: 8px;
  padding: 10px;
  .title {
    width: 100%;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    padding: 15px 0;
    border-bottom: 1px solid var(--transparent-hover);
    position: relative;
    svg {
      position: absolute;
      right: 0;
      top: -2px;
      cursor: pointer;
      stroke: var(--color-text1);
    }
  }
  .form {
    margin-top: 20px;
    width: 295px;
  }
}
</style>
