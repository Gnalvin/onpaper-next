<template>
  <div
    class="login-wrap top-mask-layer"
    :class="{ 'no-bgc': noBgc }"
    @click.self="$emit('close')"
  >
    <div class="panel">
      <h1 class="title">onpaper</h1>
      <div class="container">
        <div class="nav" v-if="showPanel == 'main'">
          <div class="tab" @click="currentTab = 0">验证码登陆</div>
          <div class="tab" @click="currentTab = 1">密码登陆</div>
        </div>
        <div v-if="showPanel == 'register'" class="panel-title">
          <svg
            @click="loginStore.isShowRegister = false"
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31 36L19 24L31 12"
              stroke="#1f1f1f"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="bevel"
            />
          </svg>
          注册新用户
        </div>
        <div v-if="showPanel == 'email'" class="panel-title">
          <svg
            @click="handleShowEmailLogin"
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31 36L19 24L31 12"
              stroke="#1f1f1f"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="bevel"
            />
          </svg>
          邮箱登陆
        </div>
        <component :is="pages[currentTab]"></component>
        <OtherLogin
          @email="handleShowEmailLogin"
          :is-show-phone="showPanel == 'email'"
        ></OtherLogin>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import useLoginStore from '@/stores/module/login'
import PasswordLogin from '../cpns/password/password-login.vue'
import EmailLogin from '../cpns/email-login/email-login.vue'
import VerifyCodeLogin from '../cpns/verify-code/verify-code.vue'
import OtherLogin from '../cpns/other-login/other-login.vue'
import { stopBodyScroll } from '@/utils/stopScroll'

defineProps({
  noBgc: {
    type: Boolean,
    default: false
  }
})
defineEmits(['close'])

const loginStore = useLoginStore()
// 切换不同登陆方式
const pages = [VerifyCodeLogin, PasswordLogin, EmailLogin]
const currentTab = ref(0)
const moveStyle = computed(() => {
  return 120 * currentTab.value + '%'
})

const showPanel = ref<'main' | 'register' | 'email'>('main')
watch(
  () => loginStore.isShowRegister,
  (val) => {
    if (val) return (showPanel.value = 'register')
    showPanel.value = 'main'
  }
)

const handleShowEmailLogin = () => {
  showPanel.value = showPanel.value == 'email' ? 'main' : 'email'
  currentTab.value = currentTab.value == 2 ? 0 : 2
}

stopBodyScroll(true)
onUnmounted(() => {
  stopBodyScroll(false)
  loginStore.$reset()
})
</script>

<style scoped lang="less">
.login-wrap {
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(2px);
  z-index: 9999;
}
.panel {
  margin-top: 15vh;
  text-align: center;
  width: 380px;
  .title {
    font-size: 48px;
    color: white;
    margin-bottom: 25px;
  }
  .nav {
    display: flex;
    margin-bottom: 24px;
    padding-top: 15px;
    color: #1f1f1f;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    .tab {
      line-height: 45px;
      width: 80px;
      padding-right: 16px;
      cursor: pointer;
    }
    &::after {
      content: '';
      width: 80px;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      transform: translateX(v-bind('moveStyle'));
      transition: transform 0.16s ease-in-out 0s;
      background: var(--color-text4-hover);
      height: 4px;
      border-radius: 2px;
    }
  }
  .container {
    position: relative;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    padding: 0 43px;
  }
}
.panel-title {
  display: flex;
  margin-bottom: 24px;
  padding-top: 15px;
  line-height: 45px;
  font-size: 17px;
  font-weight: 500;
  align-items: center;
  color: #1f1f1f;
  svg {
    cursor: pointer;
    margin-right: 10px;
  }
}
.no-bgc {
  background-color: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
}
</style>
