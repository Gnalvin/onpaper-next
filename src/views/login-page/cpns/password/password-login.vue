<template>
  <div class="login">
    <div class="form">
      <WLInput
        class="el-input"
        v-focus
        placeholder="手机号/邮箱"
        v-model="accountInfo.account"
        :verify-rules="loginRules.account"
        ref="accountInput"
      ></WLInput>
      <WLInput
        class="el-input"
        type="password"
        placeholder="请输入密码"
        v-model="accountInfo.password"
        :verify-rules="loginRules.password"
        ref="passwordInput"
      ></WLInput>
    </div>
    <ElButton class="next-btn" @click="handleLogin">登录</ElButton>
    <div class="footer">
      <label class="agree">
        <label class="agree-check" :class="{ checkBgc: argue }">
          <input type="checkbox" id="keep" v-model="argue" />
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
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import useLoginStore from '@/stores/module/login'

import ElButton from '@/components/button/el-button.vue'
import WLInput from '@/components/input/wl-input.vue'
import { MessageBox } from '@/components/message-box'
import { loginRules } from '@/views/login-page/config/account'
import { debounce } from '@/utils/debounce'

const loginStore = useLoginStore()

const argue = ref(false)

const accountInfo = reactive({
  account: '',
  password: ''
})

const accountInput = ref<InstanceType<typeof WLInput>>()
const passwordInput = ref<InstanceType<typeof WLInput>>()

let lastAccount = ''
let lastPassword = ''

//处理登录
const handleLogin = debounce(async () => {
  const { account, password } = accountInfo
  //如果之前验证过错误 ,密码和账号 没有修改的情况下 不允许再次发生请求
  if (loginStore.loginStatus === 'fail') {
    if (lastAccount === account && lastPassword == password) {
      passwordInput.value?.ChangeTipMessage('账号或密码错误')
      return
    }
  }

  const aRes = accountInput.value!.VerifyCallFn()
  const pRes = passwordInput.value!.VerifyCallFn()
  if (!aRes.verify) {
    const tip = account ? aRes.message : '请输入账号'
    return accountInput.value?.ChangeTipMessage(tip)
  }
  // 密码不符合格式肯定错误
  if (!pRes.verify) {
    const tip = password ? '密码错误' : '请输入密码'
    return passwordInput.value?.ChangeTipMessage(tip)
  }
  lastAccount = account
  lastPassword = password
  //同意协议
  if (!argue.value) {
    try {
      await MessageBox({
        text: '请同意<a href="/terms/user-term" style="color:#409eff;" target="_blank">《用户协议》</a>和<a href="/terms/privacy" style="color:#409eff;" target="_blank">《隐私政策》</a>',
        confirmButtonText: '同意'
      })
    } catch {
      return
    }
    argue.value = true
  }
  // MessageBox 弹出后 自动填充的密码会改变（谷歌会，苹果不会 应该是浏览器bug） 所以用保存过的 lastAccount来登陆
  passwordInput.value?.ChangeTipMessage('')
  loginStore.accountLoginAction({
    account: lastAccount,
    password: lastPassword
  })
}, 300)

// 如果服务器验证密码错误 主动修改 输入框提示信息
watch(
  () => loginStore.loginStatus,
  (newValue) => {
    if (newValue === 'fail') {
      passwordInput.value?.ChangeTipMessage('账号或密码错误')
    }
  }
)
</script>

<style scoped lang="less">
@import '../css/common.less';
</style>
