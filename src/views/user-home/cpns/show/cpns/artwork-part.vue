<template>
  <div class="artwork-area">
    <div class="artwork" v-if="artworkStore.isNoArtworks == 'no'">
      <div class="count">
        <div>
          全部作品<span class="num">{{ artworkStore.artworksCount }}</span>
        </div>
        <div class="sort">
          <div class="rank" v-if="isShowSort">
            <template v-for="(item, i) in sortText" :key="item.sort">
              <div
                @click="choiceSortFN(item.sort, i)"
                :class="{ 'choice-sort': i === sortNum }"
              >
                {{ item.text }}
              </div>
            </template>
          </div>
          <span @click="handleShowSort">
            <div v-if="!isShowSort" class="sort-text">排序</div>
            <svg
              class="icon"
              width="22"
              height="22"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 11.5H29"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 24.5H29"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M36 11.5V37.5L42 30.5"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 37.5H29"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
      <Transition>
        <ul class="container-wrap" v-show="artworkStore.artworks.length">
          <template v-for="item in artworks" :key="item.artworkId">
            <li>
              <SquareArtItem
                :is-fans="userHomeStore.isFocus"
                :artworkItem="item"
                :isShowUser="false"
              ></SquareArtItem>
            </li>
          </template>
        </ul>
      </Transition>
      <div class="page-num">
        <PaginationItem
          v-if="artworkStore.artworks.length"
          :pageCount="pageCount"
          :page="pageNum"
          @choiceNum="handleToPage"
        ></PaginationItem>
      </div>
    </div>
    <div v-if="artworkStore.isNoArtworks == 'yes'" class="tip">
      ta还没有发布过作品！&nbsp; ヽ(°〇°)ﾉ
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onActivated, inject } from 'vue'
import useUserHomeStore from '@/stores/module/user-home'
import useArtworkStore from '@/stores/module/user-home/module/artwork'
import { useRoute, useRouter } from 'vue-router'
import { SquareArtItem } from '@/components/artwork-item'
import { PaginationItem } from '@/components/pagination'

const userHomeStore = useUserHomeStore()
const artworkStore = useArtworkStore()
const route = useRoute()
const router = useRouter()

const userId = route.params.userId as string
// 获取作品
const artworks = computed(() => artworkStore.artworks)

// '最近发布', '最多喜欢', '最多收藏'
const sortText: { text: string; sort: sortType }[] = [
  { text: '最近发布', sort: 'now' },
  { text: '最多喜欢', sort: 'like' },
  { text: '最多收藏', sort: 'collect' }
]
const sortNum = ref(0)
type sortType = 'like' | 'now' | 'collect'
let sortQuery: sortType = 'now'

// 向上取整 计算需要多少页
const pageCount = computed(() => Math.ceil(artworkStore.artworksCount / 30))
// 当前页数
const pageNum = ref(1)

// 跳转路由
const replaceRouterAndRequest = () => {
  const query = { page: String(pageNum.value), sort: sortQuery }
  router.replace({ name: 'userHomeArtwork', query })
  artworkStore.getUserHomeArtworkAction({
    userId,
    page: pageNum.value,
    sort: sortQuery
  })
  userHomeStore.historyQuery['artwork'] = query
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
  // 如果 地址框输入 的排序不符合格式
  const sort = route.query.sort as string
  if (sort != 'like' && sort != 'artwork' && sort != 'now') {
    sortNum.value = 0
    sortQuery = 'now'
    route.query.sort = sortQuery
  } else {
    sortNum.value = sortText.findIndex((item) => item.sort === route.query.sort)
    sortQuery = sortText[sortNum.value].sort
  }
}

onActivated(() => {
  // 首次加载 如果在route有 参数 取出作为当前页数
  if (route.query.page) {
    verifyQuery()
    artworkStore.getUserHomeArtworkAction({
      userId,
      page: pageNum.value,
      sort: sortQuery
    })
    userHomeStore.historyQuery['artwork'] = route.query
  } else {
    // 没有参数 则 跳转补充 page=1 sort=now
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

// 是否展示 排序
const isShowSort = ref(false)
const handleShowSort = () => {
  isShowSort.value = !isShowSort.value
}

// 选择哪种排序
const choiceSortFN = (sort: sortType, index: number) => {
  pageNum.value = 1
  sortNum.value = index
  sortQuery = sort
  replaceRouterAndRequest()
}
</script>

<style scoped lang="less">
@import '../css/common.less';
.artwork-area {
  min-height: 650px;
}
.artwork {
  padding: 20px;
  background-color: var(--bgc);
  border-radius: 10px;
}
.sort {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 15px;
  user-select: none;
  .sort-text {
    margin-right: 10px;
    cursor: pointer;
  }
  .icon {
    stroke: var(--color-regular);
  }
  .rank {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    margin-right: 10px;
    div {
      margin: 0 5px;
      line-height: 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: border-color 0s;
    }
  }
  span {
    display: flex;
    align-items: center;
    margin: 0 10px;
    cursor: pointer;
  }
}
.choice-sort {
  color: var(--primary-middle-color);
  border-color: var(--color-text4-hover) !important;
}
.tip {
  font-size: 20px;
  text-align: center;
  padding-top: 200px;
}
</style>
