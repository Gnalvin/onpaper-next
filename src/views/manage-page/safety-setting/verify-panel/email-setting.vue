<template>
  <WLInput
    class="el-input"
    placeholder="输入邮箱地址"
    v-model="email"
    :verify-rules="rules.email"
    ref="emailInput"
    @blur="handleEmailBlur"
    :theme="true"
    v-focus
  >
  </WLInput>
  <WLInput
    class="el-input"
    placeholder="请输入验证码"
    v-model="verifyCode"
    :verify-rules="rules.verifyCode"
    :max-len="6"
    :type="'num'"
    :theme="true"
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
    @click="handleLogin"
    :disable="safetyStore.waiting"
  >
    <span v-if="!safetyStore.waiting">完成</span>
    <span v-else>修改中 ...</span>
  </ElButton>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import useSafetyStore from '@/stores/module/setting/safety'
import WLInput from '@/components/input/wl-input.vue'
import ElButton from '@/components/button/el-button.vue'
import { rules } from '../config'

const emits = defineEmits(['close'])

const safetyStore = useSafetyStore()

const email = ref('')
const verifyCode = ref('')

// 验证邮箱是否存在
let lastVerifyEmail = ''
const emailInput = ref<InstanceType<typeof WLInput>>()
const codeInput = ref<InstanceType<typeof WLInput>>()

const emailRules =
  // eslint-disable-next-line no-useless-escape
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

const handleEmailBlur = () => {
  // 如果两次邮箱一样 不发起请求
  if (lastVerifyEmail === email.value) {
    if (safetyStore.verifyEmailStatus === 'fail') {
      emailInput.value?.ChangeTipMessage('邮箱已被绑定')
    }
    return
  }
  //两次不一样 重置验证状态
  safetyStore.verifyEmailStatus = 'unknown'
  lastVerifyEmail = email.value

  // 如果符合正则 长度小于50 在发送网络请求
  if (emailRules.test(email.value) && email.value.length <= 45) {
    safetyStore.verifyEmailExistAction(email.value)
  }
}

watch(
  () => safetyStore.verifyEmailStatus,
  (newValue) => {
    if (newValue === 'fail') {
      emailInput.value?.ChangeTipMessage('邮箱已被绑定')
    }
  }
)
//发送验证码
const count = ref(60)

//发送验证码
const codeBtnDisable = ref(false)
const sendCodeStatus = computed(() => safetyStore.sendCodeStatus)
const sendCode = () => {
  //已发送状态 return
  if (codeBtnDisable.value) return
  // 邮箱格式不通过
  const { verify } = emailInput.value!.VerifyCallFn()
  if (!verify) return
  // 邮箱验证不通过 return
  if (safetyStore.verifyEmailStatus !== 'success') return

  codeBtnDisable.value = true
  safetyStore.getEmailCode(email.value)
  countDownFn()
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

//发送登陆或注册请求
let lastVerifyCode = ''
const handleLogin = async () => {
  if (safetyStore.waiting || safetyStore.verifyEmailStatus !== 'success') return
  // 邮箱格式
  const mRes = emailInput.value!.VerifyCallFn()
  if (!mRes.verify) return
  //验证码格式
  const cRes = codeInput.value!.VerifyCallFn()
  if (!cRes.verify) {
    codeInput.value?.ChangeTipMessage(cRes.message)
    return
  }

  if (lastVerifyCode == verifyCode.value) return
  lastVerifyCode = verifyCode.value
  const res = await safetyStore.changeBindingEmailAction(
    email.value,
    verifyCode.value
  )
  if (res.status == 1018) {
    codeInput.value?.ChangeTipMessage('验证码错误')
  }
  if (res.status === 200) {
    emits('close')
  }
}
</script>

<style scoped lang="less">
@import '../css/common.less';
</style>
