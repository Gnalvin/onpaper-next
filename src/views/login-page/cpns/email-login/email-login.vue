<template>
  <div class="email-login">
    <div>
      <WLInput
        class="el-input"
        placeholder="输入邮箱地址"
        v-model="account.email"
        :verify-rules="emailLoginRules.email"
        @blur="handleEmailBlur"
        ref="emailInput"
        v-focus
      >
      </WLInput>
      <WLInput
        class="el-input"
        placeholder="请输入验证码"
        v-model="account.verifyCode"
        :verify-rules="emailLoginRules.verifyCode"
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
      <ElButton
        class="next-btn waiting"
        @click="handleLogin"
        :disable="loginStore.waiting"
      >
        <span v-if="!loginStore.waiting">登录</span>
        <span v-else>登陆中 ...</span>
      </ElButton>
      <div class="footer">
        <label class="agree">
          <label class="agree-check" :class="{ checkBgc: agree }">
            <input type="checkbox" id="keep" v-model="agree" />
          </label>
          <span class="check-text" for="keep">
            我同意
            <RouterLink
              class="link"
              :to="{ name: 'userTerms' }"
              target="_blank"
            >
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import useLoginStore from '@/stores/module/login'
import WLInput from '@/components/input/wl-input.vue'
import ElButton from '@/components/button/el-button.vue'
import { debounce } from '@/utils/debounce'
import { MessageBox } from '@/components/message-box'

import { emailLoginRules } from '../../config/account'

const loginStore = useLoginStore()

const account = reactive({
  email: '',
  verifyCode: ''
})
const agree = ref(false)

const codeInput = ref<InstanceType<typeof WLInput>>()
// 验证邮箱是否存在
let lastVerifyEmail = ''
const emailInput = ref<InstanceType<typeof WLInput>>()
const rules =
  // eslint-disable-next-line no-useless-escape
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

const handleEmailBlur = () => {
  // 如果两次邮箱一样 不发起请求
  if (lastVerifyEmail === account.email) {
    if (loginStore.verifyEmailStatus === 'fail') {
      emailInput.value?.ChangeTipMessage('邮箱未注册')
    }
    return
  }
  //两次不一样 重置验证状态
  loginStore.verifyEmailStatus = 'unknown'
  lastVerifyEmail = account.email

  // 如果符合正则 长度小于50 在发送网络请求
  if (rules.test(account.email) && account.email.length <= 45) {
    loginStore.verifyEmailExistAction(account.email)
  }
}

watch(
  () => loginStore.verifyEmailStatus,
  (newValue) => {
    if (newValue === 'fail') {
      emailInput.value?.ChangeTipMessage('邮箱未注册')
    }
  }
)
//发送验证码
const codeBtnDisable = ref(false)
const sendCodeStatus = computed(() => loginStore.sendCodeStatus)
const sendCode = () => {
  //已发送状态 return
  if (codeBtnDisable.value) return
  // 邮箱验证不通过 return
  if (loginStore.verifyEmailStatus !== 'success') return

  codeBtnDisable.value = true
  loginStore.getEmailCode(account.email)
  countDownFn()
}

const count = ref(60)
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
  if (loginStore.waiting || loginStore.verifyEmailStatus !== 'success') return
  // 邮箱格式
  const mRes = emailInput.value!.VerifyCallFn()
  if (!mRes.verify) return
  //验证码格式
  const cRes = codeInput.value!.VerifyCallFn()
  if (!cRes.verify) {
    codeInput.value?.ChangeTipMessage(cRes.message)
    return
  }

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
  loginStore.loginByEmailAction(account)
}, 350)

watch(
  () => loginStore.codeStatus,
  (newValue) => {
    if (newValue === 'codeErr') {
      codeInput.value?.ChangeTipMessage('验证码错误')
    }
  }
)
</script>

<style scoped lang="less">
@import '../css/common.less';
</style>
