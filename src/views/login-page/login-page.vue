<template>
  <div class="login">
    <MainPanel :noBgc="true"></MainPanel>
    <div class="icp-info">
      <a title="沪ICP备" href="//beian.miit.gov.cn/" target="_blank">
        粤ICP备2023025543号
      </a>
      |
      <a
        title="粤公网安备"
        href="//www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502009952"
        target="_blank"
      >
        <img
          style="width: 13px; height: 13px"
          src="@/assets/img/icp/icp.png"
          alt=""
        />
        粤公网安备44030502009952号
      </a>
      <p>
        <a href="/about" target="_blank">联系我们</a>
        |
        <span>深圳市绘梦网络科技有限公司 ©2023</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import useLoginStore from '@/stores/module/login'
import router from '@/router'
import MainPanel from './panel/main-panel.vue'
document.documentElement.setAttribute('style', 'color-scheme:light')

const loginStore = useLoginStore()

watch(
  () => loginStore.loginStatus,
  (val) => {
    if (val == 'success') {
      // 页面跳转
      router.replace({
        name: 'mainHome'
      })
    }
  }
)
</script>

<style scoped lang="less">
// 防止div出现光标
div {
  user-select: none;
}

.login {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100vh;
  // background-image: url('https://lofter.lf127.net/1611802021488/bangqiaoyan-feng.jpg?imageView&type=jpg&quality=80&stripmeta=0&thumbnail=4000x4000');
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #1f1f1f;
  background-position: center;
  background-attachment: fixed;
  color: #333;
}

.icp-info {
  position: absolute;
  z-index: 9999;
  text-align: center;
  color: #e4e8ff;
  bottom: 5vh;
  font-size: 12px;
  a {
    color: #e4e8ff;
  }
}
</style>
