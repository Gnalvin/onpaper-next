<template>
  <div class="no-found">
    <div class="no-see">
      <span>查找的页面不存在</span>
      <span class="tip">{{ time }} 秒后将跳转至首页</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
let time = ref(5)
const timer = setInterval(() => {
  time.value -= 1
  if (!time.value) {
    clearInterval(timer)
    router.push({ name: 'HomePage' })
  }
}, 1000)
</script>

<style scoped lang="less">
.no-see {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text1);
  .tip {
    font-size: 16px;
    font-weight: 500;
    margin-top: 20px;
    color: var(--color-text4-hover);
  }
}
</style>
