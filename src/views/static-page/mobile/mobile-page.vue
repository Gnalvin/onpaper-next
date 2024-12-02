<template>
  <div class="mobile-page">
    <div class="logo-slogan">
      <img class="logo" :src="logoUrl" />
      <div class="slogan">为绘画梦想助力</div>
    </div>
    <div class="tip">
      <div>感谢您的支持</div>
      <div>手机用户请使用小程序访问</div>
      <div>微信搜索：纸上App</div>
    </div>
    <ElButton v-if="href" class="btn" @click="handleGoToWeChat"
      >打开小程序</ElButton
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ElButton from '@/components/button/el-button.vue'
import wlRequest from '@/service/index' //拿到创建的网络请求实例
import type { IResultType } from '@/service/type'

document.body.style.minWidth = '0px'
const PreviewOssUrl = import.meta.env.VITE_OSS_PREVIEW_URL
const logoUrl = PreviewOssUrl + 'assets/logo.png'

const href = ref('')
wlRequest
  .get<IResultType<{ url: string }>>({ url: '/auth/wx_url' })
  .then((res) => {
    if (res.status === 200) {
      href.value = res.data.url
    }
  })

const handleGoToWeChat = () => {
  location.href = href.value
}

const height = ref(window.innerHeight + 'px')
</script>

<style scoped lang="less">
.mobile-page {
  overflow: hidden;
  position: relative;
  height: v-bind(height);
}
.logo-slogan {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 15vh;
  .logo {
    width: 80px;
    height: 80px;
    border-radius: 15px;
    border: 1px solid var(--border-color1);
  }
  .slogan {
    font-size: 13px;
    color: var(--color-text2);
    margin-top: 10px;
  }
}
.tip {
  margin-top: 70px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  line-height: 2.5;
}
.btn {
  position: absolute;
  bottom: 40px;
  left: 50%;
  margin: 0;
  transform: translate(-50%, -50%);
}
</style>
