<template>
  <div class="verify-code" v-show="!loginStore.isShowRegister">
    <div class="form">
      <WLInput
        class="el-input"
        placeholder="请输入手机号"
        v-model="account.phone"
        :verify-rules="registerRules.phone"
        ref="phoneInput"
        v-focus
      >
      </WLInput>
      <WLInput
        v-show="isShowInviteCode"
        class="el-input"
        placeholder="请输入邀请码"
        :max-len="7"
        v-model="account.inviteCode"
        :verify-rules="registerRules.inviteCode"
        ref="inviteInput"
      ></WLInput>
      <WLInput
        class="el-input"
        placeholder="请输入验证码"
        v-model="account.verifyCode"
        :verify-rules="registerRules.verifyCode"
        :max-len="6"
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
    </div>
    <ElButton
      class="next-btn waiting"
      @click="handleLogin"
      :disable="loginStore.waiting"
    >
      <span v-if="!loginStore.waiting">登录 / 注册</span>
      <span v-else>登陆中 ...</span>
    </ElButton>
    <div class="footer">
      <label class="agree">
        <label class="agree-check" :class="{ checkBgc: agree }">
          <input type="checkbox" id="keep" v-model="agree" />
        </label>
        <span class="check-text" for="keep">
          我同意
          <RouterLink class="link" :to="{ name: 'userTerms' }" target="_blank">
            《用户协议》
          </RouterLink>
          和
          <RouterLink
            class="link"
            :to="{ name: 'privacyTerms' }"
            target="_blank"
          >
            《隐私政策》
          </RouterLink>
        </span>
      </label>
    </div>
  </div>
  <Register
    :phone-number="account.phone"
    v-if="loginStore.isShowRegister"
  ></Register>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onUnmounted } from 'vue'
import Register from '../register/new-register.vue'
import useLoginStore from '@/stores/module/login'
import WLInput from '@/components/input/wl-input.vue'
import ElButton from '@/components/button/el-button.vue'
import { MessageBox } from '@/components/message-box'
import { debounce } from '@/utils/debounce'

import { registerRules } from '../../config/account'

const loginStore = useLoginStore()

const account = reactive({
  phone: '',
  verifyCode: '',
  inviteCode: ''
})
const phoneInput = ref<InstanceType<typeof WLInput>>()
const inviteInput = ref<InstanceType<typeof WLInput>>()

// 是否展示需要填写邀请码
const isShowInviteCode = ref(false)
const agree = ref(false)

//发送验证码
const sendCodeStatus = computed(() => loginStore.sendCodeStatus)
const count = ref(60)
const codeBtnDisable = ref(false)

const sendCode = async () => {
  //已发送状态 return
  if (codeBtnDisable.value) return
  // 手机验证不通过 return
  const { verify } = phoneInput.value!.VerifyCallFn()
  if (!verify) return
  //如果需要邀请码
  if (isShowInviteCode.value) {
    const { verify } = inviteInput.value!.VerifyCallFn()
    if (!verify) return
  }
  //发送验证码
  codeBtnDisable.value = true
  countDownFn()
  const res = await loginStore.getPhoneCode(account.phone, account.inviteCode)
  // // 新用户需要 邀请码
  if (res.status === 1024) {
    isShowInviteCode.value = true
    count.value = 10
    inviteInput.value?.ChangeTipMessage('新用户需要邀请码')
  }
  if (res.status === 1025) {
    count.value = 10
    inviteInput.value?.ChangeTipMessage('无效的邀请码')
  }
}

//倒计时函数
const countDownFn = () => {
  const timer = setInterval(() => {
    count.value--
    if (count.value === 0) {
      clearInterval(timer)
      codeBtnDisable.value = false
      loginStore.sendCodeStatus = 'unknown'
      count.value = 60
    }
  }, 1000)
}

//发送登陆或注册请求
let lastVerifyCode = ''
const handleLogin = debounce(async () => {
  if (loginStore.waiting) return
  //验证码格式
  const cRes = codeInput.value!.VerifyCallFn()
  if (!cRes.verify) {
    codeInput.value?.ChangeTipMessage(cRes.message)
    return
  }

  // 手机验证不通过 return
  const pRes = phoneInput.value!.VerifyCallFn()
  if (!pRes.verify) return
  //同意协议
  if (!agree.value) {
    try {
      await MessageBox({
        text: '请同意<a href="/terms/user-term" style="color:#409eff;" target="_blank">《用户协议》</a>和<a href="/terms/privacy" style="color:#409eff;" target="_blank">《隐私政策》</a>',
        confirmButtonText: '同意'
      })
    } catch {
      return
    }
    agree.value = true
  }
  if (lastVerifyCode == account.verifyCode) return
  lastVerifyCode = account.verifyCode
  loginStore.account.phone = account.phone
  loginStore.account.verifyCode = account.verifyCode
  loginStore.account.inviteCode = account.inviteCode
  const res = await loginStore.phoneLoginAction()
  if (res.status === 1025) {
    count.value = 10
    inviteInput.value?.ChangeTipMessage('无效的邀请码')
  }
}, 350)

const codeInput = ref<InstanceType<typeof WLInput>>()
watch(
  () => loginStore.codeStatus,
  (newValue) => {
    if (newValue === 'codeErr') {
      codeInput.value?.ChangeTipMessage('验证码错误')
    }
  }
)
// 如果用户从注册页返回
watch([() => loginStore.isShowRegister, account], () => (lastVerifyCode = ''))
onUnmounted(() => {
  loginStore.$reset()
})
</script>

<style scoped lang="less">
@import '../css/common.less';
</style>
