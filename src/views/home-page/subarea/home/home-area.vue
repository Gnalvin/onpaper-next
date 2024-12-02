<template>
  <div
    class="main-home"
    v-lazy-loading="loadMore"
    :lazy-loading-immediate="false"
    :lazy-loading-delay="300"
    :lazy-loading-distance="600"
    :lazy-loading-disabled="!isShowFistScreen || loadMoreEnd"
  >
    <Transition appear>
      <div class="fist-screen" v-if="isShowFistScreen">
        <div class="about-tag">
          <SlideShow :array-item="hotTags" :item-key="'tagId'">
            <template v-slot:default="{ item }">
              <RouterLink
                class="tag-item"
                v-random-color
                :to="{
                  name: 'TagPage',
                  params: { tagName: item.tagName },
                  query: { query: item.tagId }
                }"
              >
                <span> #{{ item.tagName }} </span>
              </RouterLink>
            </template>
          </SlideShow>
        </div>
        <div class="item art-area">
          <h2 class="title">
            热门作品
            <RouterLink :to="{ name: 'homeDiscover' }">
              <span class="all">查看更多</span>
            </RouterLink>
          </h2>
          <SquareShow :artworks="hotArtworks" class="square-show">
            <template v-slot:default="slotProps">
              <SquareArtItem
                :artwork-item="slotProps.item"
                :is-show-time="false"
                :big-title="true"
              ></SquareArtItem>
            </template>
          </SquareShow>
        </div>
        <div class="item rank slide">
          <h2 class="title">
            当日排行榜
            <router-link :to="{ name: 'ArtworkRank' }" target="_blank">
              <span class="all">查看全部</span>
            </router-link>
          </h2>
          <SlideShow
            :arrayItem="rankArtworks"
            :item-key="'artworkId'"
            :offset="10"
          >
            <template v-slot:default="slotProps">
              <SquareArtItem
                :padding-top="'100%'"
                :rank="slotProps.index + 1"
                :artwork-item="slotProps.item"
                :is-show-time="false"
                :item-style="{
                  width: '220px'
                }"
                :big-title="true"
              ></SquareArtItem>
            </template>
          </SlideShow>
        </div>
        <div class="item user slide" v-if="recommendUser?.length">
          <h2 class="title">
            推荐画师
            <router-link :to="{ name: 'AllUserShow', query: { type: 'hot' } }">
              <span class="all">查看更多</span>
            </router-link>
          </h2>
          <SlideShow :arrayItem="recommendUser" :item-key="'userId'">
            <template v-slot:default="slotProps">
              <UserCard
                :userInfo="slotProps.item"
                @focus="handleFocus"
                :loginUserId="mainStore.userId"
              ></UserCard>
            </template>
          </SlideShow>
        </div>
        <div
          class="item art-area"
          v-for="(item, index) in loadMoreSpace"
          :key="index"
        >
          <h2 class="title" v-if="item.title">
            {{ item.title }}
            <RouterLink
              :to="{ name: item.goToRouter.name, query: item.goToRouter.query }"
              v-if="item.goToRouter"
            >
              <span class="all">查看更多</span>
            </RouterLink>
          </h2>
          <SquareShow :artworks="item.artwork" class="load-more-space">
            <template v-slot:default="slotProps">
              <SquareArtItem
                :artwork-item="slotProps.item"
                :is-show-time="false"
                :big-title="true"
              ></SquareArtItem>
            </template>
          </SquareShow>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import useHomeAreaStore from '@/stores/module/home-page/module/home'
import useMainStore from '@/stores/module/main'
import SlideShow from '@/components/slide-show/slide-show.vue'
import { SquareArtItem } from '@/components/artwork-item'
import UserCard from '@/components/user-card/user-card.vue'
import SquareShow from '@/components/artwork-show/square-show.vue'
import { debounce } from '@/utils/debounce'
import { MessageBox } from '@/components/message-box'
import type { focusPayloadType } from '@/stores/module/home-page/type'

const homeAreaStore = useHomeAreaStore()
const mainStore = useMainStore()
homeAreaStore.initZoneArt()
// 是否显示首屏
const isShowFistScreen = ref(false)
Promise.all([
  homeAreaStore.getHotArtworkAction(),
  homeAreaStore.getArtworkRankAction(),
  homeAreaStore.getRecommendUserAction(),
  homeAreaStore.getHotTagAction()
]).then(() => (isShowFistScreen.value = true))

const rankArtworks = computed(() => homeAreaStore.artworkRank)
const hotArtworks = computed(() => homeAreaStore.hotArtwork)
const recommendUser = computed(() => homeAreaStore.recommendUser)
const hotTags = computed(() => homeAreaStore.hotTags.slice(0, 15))
const loadMoreSpace = computed(() => homeAreaStore.loadMoreSpace)

// 关注/取消关注
const handleFocus = debounce((payload: focusPayloadType) => {
  //取消关注时 弹出提示
  if (payload.isFocus) {
    MessageBox({
      text: `是否取消关注 @${payload.userName} ?`
    }).then(() => {
      homeAreaStore.postUserFocusAction(payload)
    })
    return
  }
  homeAreaStore.postUserFocusAction(payload)
}, 350)

let zone = -1
const loadMoreEnd = ref(false)
const loadMore = () => {
  if (zone === -1) {
    homeAreaStore.getNewArtworkAction()
  } else {
    homeAreaStore.getZoneArtworkAction(zone)
  }
  zone += 1
  if (zone >= 9) loadMoreEnd.value = true
}

onUnmounted(() => {
  homeAreaStore.$reset()
})
</script>

<style scoped lang="less">
.main-home {
  width: 100%;
  margin: 0 auto 100px;
  max-width: 1450px;
  --column-count: 6;
  .item {
    margin: 20px 0 90px;
  }
}
.title {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  .all {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-regular);
    margin-right: 15px;
    cursor: pointer;
  }
}

.art-area {
  padding-right: 30px;
}
.slide {
  min-height: 240px;
  margin-right: 45px !important;
  .all {
    margin-right: 0px;
  }
}

.about-tag {
  font-size: 14px;
  line-height: 22px;
  font-weight: bold;
  margin-top: 35px;
  margin-bottom: 10px;
  padding-bottom: 15px;
  .tag-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 55px;
    max-width: 130px;
    height: 34px;
    padding: 0 10px;
    border-radius: 4px;
    user-select: none;
    span {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all; // 只对英文起作用，以字母作为依据，强制换行
      line-break: anywhere; // 任意位置都可以作为换行点，包括任意的标点。
      white-space: normal !important;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      color: #fff;
    }
  }
}

@media (max-width: 1780px) {
  .main-home {
    --column-count: 6;
  }
}
@media (max-width: 1580px) {
  .main-home {
    --column-count: 5;
    max-width: 1200px;
  }
}

@media (max-width: 1200px) {
  .main-home {
    --column-count: 4;
    max-width: 910px;
  }
}

@media (max-width: 1580px) and (min-width: 1201px) {
  :deep(.load-more-space) {
    .wrap > :nth-last-of-type(-n + 2) {
      display: none;
    }
  }
}
</style>
