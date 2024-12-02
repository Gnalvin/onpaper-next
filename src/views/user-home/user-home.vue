<template>
  <div
    v-title="pageTitle"
    class="user-home"
    v-show="userProfileStore.userId"
    ref="userHomeEL"
  >
    <div class="profile">
      <BannerShow></BannerShow>
      <ProfileContent></ProfileContent>
    </div>
    <ShowBar ref="showBarEL"></ShowBar>
    <div class="content-wrap">
      <div class="container">
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" :key="$route.path" />
          </KeepAlive>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onUnmounted, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import useUserProfileStore from '@/stores/module/user-home/module/profile'
import useUserHomeStore from '@/stores/module/user-home'
import useNavBarStore from '@/stores/module/nav-bar'

import BannerShow from './cpns/banner/banner-show.vue'
import ProfileContent from './cpns/profile/profile-content.vue'
import ShowBar from './cpns/show/show-bar.vue'

import { getScrollContainer } from '@/components/utils'

const route = useRoute()
const navBarStore = useNavBarStore()
const userHomeStore = useUserHomeStore()
const userProfileStore = useUserProfileStore()
const showBarEL = ref<InstanceType<typeof ShowBar>>()
//页面标题
const pageTitle = computed(
  () => `@${userProfileStore.userName} 的个人主页 - 纸上`
)

// 从 /users/johnny 导航到 /users/jolyne 时，相同的组件实例将被重复使用
// 需要监听 路由参数变化 重新加载数据
watch(
  () => route.params.userId,
  async (toUserId) => {
    //清空store
    userHomeStore.reSetAboutUserHomeStore()
    if (!toUserId) return // 如果没有这个参数 则 结束
    await userProfileStore.getUserProfileAction(toUserId as string)
  },
  { immediate: true }
)

const userHomeEL = ref<HTMLElement>()

// 点击跳转到导航栏位置
const goToNavPosition = () => {
  const scrollEL = getScrollContainer(userHomeEL.value!)
  const barHeight = showBarEL.value!.getBarHeight()

  scrollEL!.scrollTo({
    top: barHeight - 60
  })
}
provide('goToNavPosition', goToNavPosition)

onUnmounted(() => {
  navBarStore.isTransparentNav = false
  userProfileStore.$reset()
})
</script>

<style scoped lang="less">
.profile {
  width: 680px;
  margin: 0 auto;
  padding-top: 80px;
}
.content-wrap {
  padding-top: 25px;
  min-height: 43vh;
  border-top: 1px solid var(--border-color1);
  background-color: var(--bgc2);
  padding-bottom: 60px;
}
.container {
  margin: 0 auto;
  width: 1100px;
  background-color: var(--bgc);
  transition: background-color 0.5s ease;
}

// 视口 小于 1200px 改变资料面板,导航面板,内容面板的宽度
@media (max-width: 1200px) {
  .content-wrap {
    .container {
      width: 915px;
    }
    :deep(.container-wrap) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
</style>
