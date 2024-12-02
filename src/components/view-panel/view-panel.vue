<template>
  <Teleport to="body">
    <Transition name="wrap" appear>
      <div class="mask-wrap" v-show="!isClose" @click="closePage"></div>
    </Transition>
    <Transition name="container" appear>
      <div class="container" v-show="!isClose">
        <div class="close" @click="closePage">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="35"
            height="35"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
            />
          </svg>
        </div>
        <slot></slot>
        <TopButton></TopButton>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import TopButton from '@/components/top-button/top-button.vue'
import { ref } from 'vue'
const emits = defineEmits(['close'])

const isClose = ref(false)
const closePage = () => {
  isClose.value = true
  //动画完成后才关闭组件
  setTimeout(() => {
    emits('close')
  }, 250)
}
defineExpose({ closePage })
</script>

<style scoped lang="less">
.mask-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(2px);
  cursor: pointer;
}
.container {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  z-index: 1001;
  overflow: auto;
  height: calc(100vh - 50px);
  background-color: var(--bgc2);
  border-top: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}
.close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  position: fixed;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  right: 15px;
  top: 55px;
  svg {
    fill: var(--color-text1);
  }
}

.container-enter-from,
.container-leave-to {
  transform: translateY(100%);
}

.container-enter-active {
  transition: transform 0.25s ease;
}
.container-leave-active {
  transition: transform 0.25s ease-out;
}

.wrap-enter-from,
.wrap-leave-to {
  opacity: 0;
}

.wrap-enter-active,
.wrap-leave-active {
  transition: opacity 0.25s ease;
}
</style>
