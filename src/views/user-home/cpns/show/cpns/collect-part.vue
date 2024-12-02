<template>
  <div class="collect-area">
    <div class="collect" v-if="collectStore.isNoCollects == 'no'">
      <div class="count">
        <div>
          收藏作品<span class="num">{{ collectStore.collectCount }}</span>
        </div>
      </div>
      <Transition>
        <ul class="container-wrap" v-show="collectStore.collects.length">
          <template v-for="item in collects" :key="item.artworkId">
            <li>
              <SquareArtItem
                :artwork-item="item"
                :is-show-time="false"
                :is-show-like="false"
                :is-show-cancel="userHomeStore.owner"
                @cancel="handleCancelCollect"
              ></SquareArtItem>
            </li>
          </template>
        </ul>
      </Transition>
      <div class="page-num">
        <PaginationItem
          v-if="collectStore.collects.length"
          :pageCount="pageCount"
          :page="pageNum"
          @choiceNum="handleToPage"
        ></PaginationItem>
      </div>
    </div>
    <div v-if="collectStore.isNoCollects == 'yes'" class="tip">
      ta还没有收藏过作品哦&nbsp; ,,Ծ‸Ծ,,
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onActivated, inject } from 'vue'
import useUserHomeStore from '@/stores/module/user-home'
import useCollectStore from '@/stores/module/user-home/module/collect'
import { useRoute, useRouter } from 'vue-router'
import { SquareArtItem } from '@/components/artwork-item'
import { PaginationItem } from '@/components/pagination'
import { MessageBox } from '@/components/message-box'

const userHomeStore = useUserHomeStore()
const collectStore = useCollectStore()
const route = useRoute()
const router = useRouter()

const userId = route.params.userId as string

// 获取作品
const collects = computed(() => collectStore.collects)

// 向上取整 计算需要多少页
const pageCount = computed(() => Math.ceil(collectStore.collectCount / 30))
// 当前页数
const pageNum = ref(1)

// 跳转路由
const replaceRouterAndRequest = () => {
  const query = { page: String(pageNum.value) }
  router.replace({ name: 'userHomeCollect', query })
  collectStore.getUserHomeCollectAction({ userId, page: pageNum.value })
  userHomeStore.historyQuery['collect'] = query
}

// 验证路由参数
const verifyQuery = () => {
  const page = Number(route.query.page)
  // 如果 地址框输入 的页数很大 跳回第一页 同时修改数值
  if (page <= 0) {
    pageNum.value = 1
    route.query.page = '1'
  } else {
    pageNum.value = page
  }
}
onActivated(() => {
  // 首次加载 如果在route有 参数 取出作为当前页数
  if (route.query.page) {
    verifyQuery()
    collectStore.getUserHomeCollectAction({ userId, page: pageNum.value })
    userHomeStore.historyQuery['collect'] = route.query
  } else {
    // 没有参数 则 跳转补充 page=1
    replaceRouterAndRequest()
  }
})

const goToNavPosition = inject<() => number>('goToNavPosition')

//处理点击分页器
const handleToPage = (page: number) => {
  pageNum.value = page
  replaceRouterAndRequest()
  goToNavPosition!()
}

const handleCancelCollect = (artId: string, uid: string) => {
  MessageBox({ text: '是否取消收藏' }).then(() => {
    collectStore.cancelArtworkCollectAction(artId, uid)
  })
}
</script>

<style scoped lang="less">
@import '../css/common.less';
.collect-area {
  min-height: 650px;
}
.collect {
  padding: 20px;
}
.tip {
  font-size: 20px;
  text-align: center;
  padding-top: 200px;
}
</style>
