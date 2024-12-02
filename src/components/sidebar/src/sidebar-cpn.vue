<template>
  <Teleport to="body">
    <Transition name="wrap" appear>
      <div class="sidebar-wrap" v-show="!isClose" @click="closePage()"></div>
    </Transition>
    <Transition name="sidebar" v-show="!isClose" appear>
      <div class="sidebar">
        <div class="title">
          <div class="more-menu" @click="closePage()">
            <ElButton class="more-btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.94971 11.9497H39.9497"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.94971 23.9497H39.9497"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.94971 35.9497H39.9497"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </ElButton>
          </div>
          <h2 class="onpaper">
            <router-link :to="{ name: 'HomePage' }">Onpaper</router-link>
          </h2>
        </div>
        <Content @click-item="closePage()"></Content>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Content from './sidebar-content.vue'

const emits = defineEmits(['close'])
const isClose = ref(false)

const closePage = () => {
  isClose.value = true
  //动画完成后才关闭组件
  setTimeout(() => {
    emits('close')
  }, 300)
}

const route = useRoute()
watch(
  () => route.name,
  () => {
    closePage()
  }
)
</script>

<style scoped lang="less">
.sidebar-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.35);
  cursor: auto;
}
.sidebar {
  position: fixed;
  top: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 240px;
  height: 100vh;
  font-weight: 500;
  color: var(--color-text1);
  background-color: var(--bgc);
  .title {
    display: flex;
    align-items: center;
    height: 55px;
    width: 100%;
    margin-bottom: 10px;
    .more-menu {
      margin: 0 15px;
      cursor: pointer;
      .more-btn {
        margin: auto;
        display: flex;
        padding: 10px;
        border-radius: 50%;
        background-color: transparent;
        &:hover {
          background-color: var(--bgc-hover);
        }
        svg {
          stroke: var(--color-text1);
        }
      }
    }
    .onpaper {
      position: relative;
      cursor: pointer;
      bottom: 2px;
      font-size: 24px;
    }
  }
}
.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease;
}

.wrap-enter-from,
.wrap-leave-to {
  opacity: 0;
}

.wrap-enter-active,
.wrap-leave-active {
  transition: opacity 0.3s ease;
}
</style>
