<template>
  <Transition appear>
    <div class="tip-box-wrap" v-if="isShow">
      <div class="container">
        <svg
          v-if="msgType == 'success'"
          width="45"
          height="45"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
            fill="none"
            stroke="#1bad1b"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            d="M16 24L22 30L34 18"
            stroke="#1bad1b"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else
          width="45"
          height="45"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
            fill="none"
            stroke="#e93751"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            d="M31 18V19"
            stroke="#e93751"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 18V19"
            stroke="#e93751"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M31 31C31 31 29 27 24 27C19 27 17 31 17 31"
            stroke="#e93751"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="text"> {{ text }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
defineProps({
  text: {
    type: String,
    default: ''
  },
  msgType: {
    type: String as PropType<'error' | 'success'>,
    default: 'success'
  }
})
const isShow = ref(true)
setTimeout(() => {
  isShow.value = false
}, 1000)
</script>

<style scoped lang="less">
.tip-box-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  border-radius: 8px;
  width: 200px;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--transparent-theme-color2);
  backdrop-filter: blur(1px);
}
.text {
  margin-top: 15px;
  font-size: 15px;
  font-weight: 500;
}
</style>
