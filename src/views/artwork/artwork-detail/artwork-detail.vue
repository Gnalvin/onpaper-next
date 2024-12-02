<template>
  <div
    class="artwork-show"
    @scroll="scrollIng"
    ref="artworkShowEl"
    v-title="pageTitle"
  >
    <div class="no-see" v-if="artworkStore.noExist">
      <span>作品已删除或不可见</span>
      <span class="tip">5 秒后将跳转至首页</span>
    </div>
    <div class="container" v-else-if="artworkStore.artInfo.artworkId">
      <div class="show-wrap">
        <div class="artwork-wrap">
          <ArtworkItem
            :scroll-value="scrollValue"
            @collect="handleCollect"
            @like="handleLike"
          ></ArtworkItem>
        </div>
        <BottomPart
          @focus="handleFocus"
          @showEdit="handleShowEditPanel"
        ></BottomPart>
      </div>
      <InfoPart
        @focus="handleFocus"
        @collect="handleCollect"
        @like="handleLike"
        @showEdit="handleShowEditPanel"
      ></InfoPart>
    </div>
    <div></div>
  </div>
  <EditPanel
    v-if="isShowEdit"
    @close="handleShowEditPanel"
    @delete="handleDelete"
  ></EditPanel>
  <Transition appear>
    <OnlyFans v-if="isShowOnlyFans" @focus="handleFocus"></OnlyFans>
  </Transition>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import useMainStore from '@/stores/module/main'
import useArtworkDetailStore from '@/stores/module/artwork-detail'
import { useRoute, useRouter } from 'vue-router'
import InfoPart from './cpns/info-part.vue'
import BottomPart from './cpns/bottom-part.vue'
import ArtworkItem from './cpns/artwork-item.vue'
import EditPanel from './cpns/edit-panel.vue'
import OnlyFans from './cpns/only-fans.vue'
import { MessageBox } from '@/components/message-box'
import { throttle } from '@/utils/throttle'
import { debounce } from '@/utils/debounce'
import { stopBodyScroll } from '@/utils/stopScroll'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const artworkStore = useArtworkDetailStore()
//页面标题
const pageTitle = computed(() => `${artworkStore.artInfo.title} - 纸上`)

// 从 /artwork/123 导航到 /artwork/456 时，相同的组件实例将被重复使用
// 需要监听 路由参数变化 重新加载数据
const artworkShowEl = ref<HTMLDivElement>()
watch(
  () => route.params.artId,
  (toArtId) => {
    if (!toArtId) {
      // 离开页面跳转顶部
      window.scrollTo(0, 0)
      return
    } // 如果没有这个参数 则 结束
    artworkStore.$reset()
    artworkShowEl.value?.scrollTo(0, 0)
    //发送网络请求
    artworkStore.getArtworkInfoAction(toArtId as string)
  },
  { immediate: true }
)

//屏幕滚动的值
const scrollValue = ref(0)
const scrollIng = throttle((event: Event) => {
  if (event.target instanceof Element) {
    scrollValue.value = event.target.scrollTop
  }
}, 150)

// 关注/取消关注
const handleFocus = debounce(() => {
  if (!mainStore.verifyIsLogin()) return
  //取消关注时 弹出提示
  if (artworkStore.artInfo.interact.isFocusAuthor) {
    MessageBox({
      text: `是否取消关注 @${artworkStore.artInfo.userName} ?`
    }).then(() => {
      artworkStore.postUserFocusAction()
    })
    return
  }
  artworkStore.postUserFocusAction()
}, 135)

// 收藏/取消收藏作品
const handleCollect = debounce(() => {
  if (!mainStore.verifyIsLogin()) return
  artworkStore.postArtworkCollectAction()
}, 350)

//点赞/取消点赞作品
const handleLike = debounce(() => {
  if (!mainStore.verifyIsLogin()) return
  artworkStore.postArtworkLikeAction()
}, 350)

//是否显示编辑面板
const isShowEdit = ref(false)
const handleShowEditPanel = () => {
  if (!mainStore.verifyIsLogin()) return
  isShowEdit.value = !isShowEdit.value
  stopBodyScroll(isShowEdit.value, false)
}
// 删除作品后返回用户首页
const handleDelete = () => {
  if (!mainStore.verifyIsLogin()) return
  handleShowEditPanel()
  router.replace({
    name: 'userHome',
    params: { userId: artworkStore.artInfo.userId }
  })
}
const isShowOnlyFans = computed(() => {
  if (
    artworkStore.artInfo.whoSee == 'onlyFans' &&
    !artworkStore.isOwn &&
    !artworkStore.artInfo.interact.isFocusAuthor
  ) {
    return true
  }
  return false
})
</script>

<style scoped lang="less">
.artwork-show {
  width: 100%;
  background-color: var(--bgc3);
  height: 100%;
}

.container {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-top: 65px;
}
.show-wrap {
  flex: 2;
  min-width: 500px;
  .artwork-wrap {
    display: flex;
    background-color: var(--bgc3);
  }
}

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

@media (max-width: 1200px) {
  .container {
    flex-direction: column;
  }
}
</style>
