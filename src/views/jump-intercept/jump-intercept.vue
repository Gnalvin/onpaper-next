<template>
  <div class="intercept">
    <div class="tip-box">
      <div class="content">
        <h2 class="title">onpaper</h2>
        <div class="tip">您正试图跳转至其他网站，请注意账号财产安全。</div>
        <div class="url">即将访问: {{ link }}</div>
      </div>
      <a :href="link" rel="nofollow noopener noreferrer">
        <ElButton class="btn"> 继续访问 </ElButton>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ElButton from '@/components/button/el-button.vue'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'

const link = ref<any>('')
const route = useRoute()
watch(
  () => route.query.target,
  (newTarget) => {
    link.value = newTarget
  },
  { immediate: true }
)
</script>

<style scoped lang="less">
.intercept {
  display: flex;
  justify-content: center;
  background-color: var(--bgc3);
  height: 100vh;
}
.tip-box {
  position: relative;
  margin-top: 25vh;
  width: 585px;
  border: 1px solid var(--border-color1-hover);
  border-radius: 9px;
  background-color: var(--bgc);
  height: 265px;
  .content {
    padding: 15px 25px 0;
    .title {
      color: var(--color-text2-hover);
      margin-top: 0px;
    }
    .tip {
      padding: 25px 50px 15px;
      color: var(--color-regular);
      font-size: 18px;
      line-height: 24px;
    }
    .url {
      margin: 0 50px;
      color: var(--color-text3);
      padding: 15px 0px 20px;
      border-bottom: 1px solid var(--border-color1);
    }
  }
  .btn {
    position: absolute;
    right: 40px;
    bottom: 30px;
    padding: 10px 17px;
    a {
      font-weight: 400;
      color: #fff;
    }
  }
}
</style>
