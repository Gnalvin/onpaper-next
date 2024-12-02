<template>
  <div class="loading" ref="loadingEl">
    <span>
      <svg width="50px" height="50px" viewBox="0 0 100 100">
        <circle
          r="25"
          cx="50"
          cy="50"
          fill="transparent"
          stroke="#FFFFFF"
          stroke-width="50"
          ref="svgEl"
        ></circle>
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isFinish: Boolean
})

//绑定元素
const loadingEl = ref<HTMLDivElement>()
const svgEl = ref<HTMLElement>()
//是否完成
const isFinish = computed(() => props.isFinish)
let timer: number

//挂载时调用
onMounted(() => {
  //初始进度
  let prog = 20
  // 每50毫秒 执行函数 随机修改 svg 的进度
  timer = window.setInterval(function () {
    //显示 svg图片
    loadingEl.value!.style.opacity = '1'
    // 当 这个元素还没有加载完成持续循环添加进度
    if (!isFinish.value) {
      // 140 就停顿 等待
      if (prog > 140) return
      prog = prog + Math.random() * 5
      svgEl.value!.setAttribute('stroke-dasharray', `${prog} 158`)
    } else {
      clearInterval(timer)
      loadingEl.value!.style.opacity = '0'
      svgEl.value!.setAttribute('stroke-dasharray', `158 158`)
    }
  }, 100)
})

//卸载时调用清除 timer
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="less">
.loading {
  position: absolute;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0.85;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid #fff;
  transform: rotate(-90deg);
  opacity: 0;
  span {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
