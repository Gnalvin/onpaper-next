<template>
  <Skeleton :loading="focusStore.isNoFocus === 'unknown'">
    <template #default>
      <div v-if="focusStore.isNoFocus == 'yes'" class="tip">
        你还没有关注其他人哦&nbsp; ,,Ծ‸Ծ,,
      </div>
      <div class="focus-area" v-else>
        <div
          class="container"
          v-lazy-loading="loadMoreArtwork"
          :lazy-loading-delay="250"
          :lazy-loading-disabled="isFreeze || focusStore.isEnd"
        >
          <FocusList></FocusList>
          <section class="art-show">
            <div class="title">
              <span>{{ choseUser.userName }}的作品</span>

              <RouterLink
                class="go-home"
                title="前往主页"
                v-if="choseUser.userId !== 'all'"
                :to="{ name: 'userHome', params: { userId: choseUser.userId } }"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18V42H39V18L24 6L9 18Z"
                    fill="none"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19 29V42H29V29H19Z"
                    fill="none"
                    stroke-width="4"
                    stroke-linejoin="round"
                  />
                  <path d="M9 42H39" stroke-width="4" stroke-linecap="round" />
                </svg>
              </RouterLink>
            </div>
            <div class="one" v-if="choseUser.userId !== 'all'">
              <SquareShow :artworks="userArtworks" class="square-show">
                <template v-slot:default="{ item }">
                  <SquareArtItem
                    :is-fans="1"
                    :big-title="true"
                    :artworkItem="item"
                    :isShowUser="false"
                  ></SquareArtItem>
                </template>
              </SquareShow>
            </div>
            <div class="more" v-else>
              <SquareShow
                :artworks="feeds"
                :open-time="true"
                class="square-show"
              >
                <template v-slot:default="{ item }">
                  <SquareArtItem
                    :is-fans="1"
                    :big-title="true"
                    :artworkItem="item"
                    :is-show-time="false"
                  ></SquareArtItem>
                </template>
              </SquareShow>
            </div>
            <div class="zero" v-if="focusStore.isZero">
              {{ choseUser.userName }} 暂时还没有作品
            </div>
            <div class="end" v-if="focusStore.isEnd">
              …（⊙＿⊙；）… &nbsp;&nbsp; 没有更多了
            </div>
          </section>
        </div>
      </div>
    </template>
  </Skeleton>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted, ref } from 'vue'
import useFocusStore from '@/stores/module/home-page/module/focus'
import SquareShow from '@/components/artwork-show/square-show.vue'
import FocusList from './focus-list.vue'
import Skeleton from './focus-skeleton.vue'
import { SquareArtItem } from '@/components/artwork-item'

const focusStore = useFocusStore()

const userArtworks = computed(() => focusStore.userArtworks)
const feeds = computed(() => focusStore.feeds)
const choseUser = computed(() => focusStore.choseUser)

// 请求登录用户关注的 画师列表
focusStore.getUserFocusLitsAction(1)

//冻结 v-lazy-loading 避免重复请求
const isFreeze = ref(false)
watch(
  () => focusStore.choseUser,
  async () => {
    isFreeze.value = true
    await focusStore.getArtwork(true)
    isFreeze.value = false
  }
)
const loadMoreArtwork = () => {
  focusStore.getArtwork()
}

onUnmounted(() => {
  focusStore.$reset()
})
</script>

<style scoped lang="less">
.focus-area {
  padding-right: 30px;
  margin: 20px auto 100px;
  max-width: 1450px;
  --column-count: 6;
  .container {
    //和area 的高度保持一致 避免懒加载抖动
    margin-bottom: 100px;
  }
}

.art-show {
  margin: 30px auto 0px;
  .title {
    display: flex;
    padding-bottom: 15px;
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    .go-home {
      display: flex;
      align-items: center;
      margin-left: 10px;
      cursor: pointer;
      svg {
        stroke: var(--color-text2);
      }
    }
  }
  .one {
    padding-top: 10px;
  }
  .zero {
    margin-top: 150px;
    font-size: 20px;
    text-align: center;
  }
  .end {
    font-weight: 400;
    margin-top: 70px;
    font-size: 13px;
    text-align: center;
  }
}

.tip {
  margin-top: 150px;
  margin-right: 240px;
  font-size: 20px;
  text-align: center;
}

@media (max-width: 1780px) {
  .focus-area {
    --column-count: 6;
  }
}
@media (max-width: 1580px) {
  .focus-area {
    max-width: 1130px;
    --column-count: 5;
  }
}

@media (max-width: 1200px) {
  .focus-area {
    max-width: 910px;
    --column-count: 4;
  }
}
</style>
