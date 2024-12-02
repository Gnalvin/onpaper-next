<template>
  <div class="upload-page" @click="chanelEditShow">
    <div class="edit-wrap">
      <ArtworkView ref="artworkViewCpn" @showSort="showSort"></ArtworkView>
      <ArtworkDescribe
        @fileWarn="handleFileWarn"
        @goToImg="handleGoToImg"
        @showCover="handleShowOtherSetting"
      ></ArtworkDescribe>
    </div>
  </div>
  <SortImg v-if="isShowSort" @close="showSort" @addImg="addImg"></SortImg>
  <Transition appear>
    <ImgBar @goToImg="handleGoToImg"></ImgBar>
  </Transition>
  <Transition appear>
    <OtherSetting
      v-if="isShowOtherSetting"
      @close="handleShowOtherSetting"
      @upload="handleUpload"
    ></OtherSetting>
  </Transition>
  <Transition appear>
    <WaitingTip v-if="isUploading"></WaitingTip>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { onBeforeRouteLeave } from 'vue-router'
import useUploadArtworkStore from '@/stores/module/upload/artwork'
import ArtworkDescribe from './cpns/main/artwork-describe.vue'
import ArtworkView from './cpns/main/artwork-view.vue'
import SortImg from './cpns/handle/sort-img.vue'
import ImgBar from './cpns/handle/img-bar.vue'
import OtherSetting from './cpns/main/other-setting.vue'
import WaitingTip from './cpns/handle/waiting-tip.vue'
import { MessageBox } from '@/components/message-box'
import { getScrollContainer } from '@/components/utils/scroll'
import { stopBodyScroll } from '@/utils/stopScroll'

const uploadStore = useUploadArtworkStore()
// 获取组件实例
const artworkViewCpn = ref<InstanceType<typeof ArtworkView>>()
// 当没有选图片又点击上传时 修改样式
const handleFileWarn = (payload: boolean) => {
  artworkViewCpn.value?.fileWarnFn(payload)
}

// 展示排序组件
const isShowSort = ref(false)
const showSort = () => {
  isShowSort.value = !isShowSort.value
  stopBodyScroll(isShowSort.value)
}

//调用组件里面的方法 上传文件
const addImg = () => {
  artworkViewCpn.value?.addImg()
}

//关闭图片编辑菜单
const chanelEditShow = () => {
  //调用组件里面的方法 关闭
  artworkViewCpn.value?.closeMenu()
}

// 将屏幕滚动到 图片位置
let scrollContainer: HTMLElement | Window | undefined
const handleGoToImg = (index: number) => {
  // --------- 以下代码为滚动 到 点击的元素
  const el = document.getElementById('imgWarp')!.children[index] as HTMLElement
  scrollContainer = getScrollContainer(el)
  const clientHeight = document.documentElement.clientHeight // 浏览器高度
  const elHeight = el.offsetHeight // 元素高度
  const elPosition = el.offsetTop // 元素在页面滚动的位置
  const top = elPosition - (clientHeight - elHeight) / 2
  scrollContainer?.scrollTo(0, top)
}

// 展示编辑封面
const isShowOtherSetting = ref(false)
const handleShowOtherSetting = () => {
  isShowOtherSetting.value = !isShowOtherSetting.value
  stopBodyScroll(isShowOtherSetting.value)
}

//处理作品上传
const isUploading = ref(false)
const handleUpload = async () => {
  isUploading.value = true
  stopBodyScroll(true)
  await uploadStore.uploadCoverAction()
  await uploadStore.uploadArtworkAction()
  stopBodyScroll(false)
}

// 以下代码为 离开页面时候提示
// 离开组件时 询问是否离开
onBeforeRouteLeave(async () => {
  let isLeave = false
  // 如果是上传最后跳转的时候 允许离开
  if (isUploading.value) return true

  await MessageBox({
    text: '当前数据不会保存，是否要离开？'
  })
    .then(() => {
      // 离开页面
      //清空 store
      uploadStore.$reset()
      isLeave = true
    })
    .catch(() => (isLeave = false))

  return isLeave
})
// 用户刷新或者关闭页面时
useEventListener(window, 'beforeunload', () => '关闭提示')
</script>

<style scoped lang="less">
.upload-page {
  padding-top: 70px;
  background-color: var(--bgc3);
}
.edit-wrap {
  display: flex;
  justify-content: center;
  padding: 30px 35px;
  min-height: calc(100vh - 100px - 27px);
}
</style>
