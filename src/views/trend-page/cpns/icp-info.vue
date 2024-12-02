<template>
  <div class="icp-info">
    <p>
      <a title="粤ICP备" href="//beian.miit.gov.cn/" target="_blank">
        粤ICP备2023025543号
      </a>
    </p>
    <p>
      <a
        title="粤公网安备"
        href="//www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502009952"
        target="_blank"
      >
        <img
          style="width: 14px; height: 14px"
          src="@/assets/img/icp/icp.png"
          alt=""
        />
        粤公网安备44030502009952号
      </a>
    </p>
    <p class="other">
      <a href="/terms/user-term" target="_blank">服务协议</a>
      |
      <a href="/about" target="_blank">联系我们</a>
      |
      <span @click="handleShowFeedback" style="cursor: pointer">意见反馈</span>
    </p>
    <p>深圳市绘梦网络科技有限公司 ©2023</p>
  </div>
  <FeedbackItem v-if="isFeedback" @close="handleShowFeedback"></FeedbackItem>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { stopBodyScroll } from '@/utils/stopScroll'
import FeedbackItem from '@/components/feedback/feedback-item.vue'

// 展示意见反馈
const isFeedback = ref(false)
const handleShowFeedback = () => {
  isFeedback.value = !isFeedback.value
  stopBodyScroll(isFeedback.value)
}
</script>

<style scoped lang="less">
.icp-info {
  padding-left: 15px;
  a {
    font-size: 12px;
    color: var(--color-text3);
  }
  font-size: 12px;
  color: var(--color-text3);
  font-weight: 400;
}
</style>
