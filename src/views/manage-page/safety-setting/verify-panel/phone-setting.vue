<template>
  <WLInput
    class="el-input"
    placeholder="请输入手机号"
    v-model="phone"
    :verify-rules="rules.phone"
    ref="phoneInput"
    :theme="true"
    @blur="handlePhoneBlur"
    v-focus
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
      <div v-if="sendCodeStatus === 'unknown' && !codeBtnDisable">
        <span>获取验证码</span>
      </div>
      <div v-else>
        <span>获取验证码 ({{ count }})</span>
      </div>
    </ElButton>
  </WLInput>
  <ElButton
    class="next-btn waiting"
    @click="changeBindingPhone"
    :disable="safetyStore.waiting"
  >
    <span v-if="!safetyStore.waiting">完成</span>
    <span v-else>修改中 ...</span>
  </ElButton>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import WLInput from '@/components/input/wl-input.vue'
import ElButton from '@/components/button/el-button.vue'
import useSafetyStore from '@/stores/module/setting/safety'
import { rules } from '../config'

const emits = defineEmits(['close'])
const safetyStore = useSafetyStore()

const phone = ref('')
const verifyCode = ref('')

const phoneInput = ref<InstanceType<typeof WLInput>>()
const codeInput = ref<InstanceType<typeof WLInput>>()

// 验证手机是否可以注册
let lastVerifyPhone = ''
const handlePhoneBlur = () => {
  const { verify } = phoneInput.value!.VerifyCallFn()
  if (!verify) return

  // 如果两次手机一样 不发起请求
  if (lastVerifyPhone === phone.value) {
    if (safetyStore.verifyPhoneStatus === 'fail') {
      phoneInput.value?.ChangeTipMessage('手机已经注册了')
    }
    return
  }

  //两次不一样 重置验证状态
  safetyStore.verifyEmailStatus = 'unknown'
  lastVerifyPhone = phone.value
  safetyStore.verifyPhoneExistAction(phone.value)
}

watch(
  () => safetyStore.verifyPhoneStatus,
  (newValue) => {
    if (newValue === 'fail') {
      phoneInput.value?.ChangeTipMessage('手机已经注册了')
    }
  }
)

//发送验证码
const sendCodeStatus = computed(() => safetyStore.sendCodeStatus)
const count = ref(60)
const codeBtnDisable = ref(false)

const sendCode = () => {
  //已发送状态 return
  if (codeBtnDisable.value) return
  // 手机验证不通过 return
  const { verify } = phoneInput.value!.VerifyCallFn()
  if (!verify || safetyStore.verifyPhoneStatus != 'success') return

  //发送验证码
  codeBtnDisable.value = true
  countDownFn()
  safetyStore.getSendCodeToNewPhoneAction(phone.value)
}

//倒计时函数
const countDownFn = () => {
  const timer = setInterval(() => {
    count.value--
    if (count.value === 0) {
      clearInterval(timer)
      codeBtnDisable.value = false
      safetyStore.sendCodeStatus = 'unknown'
      count.value = 60
    }
  }, 1000)
}

let lastVerifyCode = ''
const changeBindingPhone = async () => {
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
  // 发送请求
  const res = await safetyStore.changeBindingPhoneAction(
    phone.value,
    verifyCode.value
  )
  if (res.status == 1018) {
    codeInput.value?.ChangeTipMessage('验证码错误')
  }
  if (res.status == 200) {
    emits('close')
  }
}
</script>

<style scoped lang="less">
@import '../css/common.less';
</style>
