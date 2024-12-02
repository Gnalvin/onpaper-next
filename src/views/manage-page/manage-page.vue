<template>
  <div class="setting">
    <div class="side-bar">
      <ul class="menu">
        <li>
          <RouterLink class="item" :to="{ name: 'manageProfile' }">
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="6"
                width="40"
                height="36"
                rx="3"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 14H44"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20 24H36"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20 32H36"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 24H14"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 32H14"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            个人信息
          </RouterLink>
        </li>
        <li>
          <RouterLink class="item" :to="{ name: 'safetySetting' }">
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="6"
                y="22"
                width="36"
                height="22"
                rx="2"
                fill="none"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M14 22V14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14V22"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24 30V36"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            账号安全
          </RouterLink>
        </li>
        <li>
          <RouterLink class="item" :to="{ name: 'pushSetting' }">
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4C16.268 4 10 10.268 10 18V38H38V18C38 10.268 31.732 4 24 4Z"
                fill="none"
              />
              <path
                d="M10 38V18C10 10.268 16.268 4 24 4C31.732 4 38 10.268 38 18V38M4 38H44"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="bevel"
              />
              <path
                d="M24 44C26.7614 44 29 41.7614 29 39V38H19V39C19 41.7614 21.2386 44 24 44Z"
                fill="none"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="bevel"
              />
            </svg>
            消息提醒
          </RouterLink>
        </li>
      </ul>
    </div>
    <div class="container">
      <RouterView></RouterView>
    </div>
    <TopButton></TopButton>
  </div>
</template>

<script setup lang="ts">
import TopButton from '@/components/top-button/top-button.vue'
</script>

<style scoped lang="less">
.setting {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 70px);
  background-color: var(--bgc3);
  padding: 70px 0 10px 0px;
}
.side-bar {
  position: relative;
  padding-top: 50px;
  min-width: 200px;
  flex: 1;
  max-width: 225px;
  .menu {
    position: fixed;
    .item {
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 500;
      color: var(--color-regular);
      padding: 12px 25px 12px 24px;
      border-left: 2px solid transparent;
      cursor: pointer;
      svg {
        stroke: var(--color-regular);
        margin-right: 15px;
      }
    }
  }
}
.container {
  flex: 1;
  max-width: 1000px;
  min-width: 800px;
  padding: 0 5px;
  margin: 50px 50px 15px 0px;
  font-size: 15px;
  background-color: var(--bgc);
  color: var(--color-text2);
  box-shadow: 0 1px 5px #c7c7c7;
}
.router-link-exact-active {
  display: inline-block;
  border-color: #0057ff !important;
  color: var(--primary-middle-color) !important;
  background-color: var(--blue-mask-chose);
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
  svg {
    stroke: var(--primary-middle-color) !important;
  }
}
</style>
