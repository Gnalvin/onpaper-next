<template>
  <div class="collect">
    <div
      class="container"
      v-lazy-loading="loadMore"
      :lazy-loading-disabled="isEnd || collectStore.loading"
      :lazy-loading-delay="250"
    >
      <h2 class="title">我的收藏</h2>
      <template v-if="collectStore.isNoCollects == 'no'">
        <SquareShow :artworks="collectStore.collects" class="square-show">
          <template v-slot:default="slotProps">
            <SquareArtItem
              :artwork-item="slotProps.item"
              :is-show-time="false"
              :big-title="true"
              :is-show-cancel="true"
              @cancel="handleCancelCollect"
            ></SquareArtItem>
          </template>
        </SquareShow>
        <div class="end" v-if="collectStore.isEnd">
          …（⊙＿⊙；）… &nbsp;&nbsp; 没有更多了
        </div>
      </template>
    </div>
  </div>
  <div v-if="collectStore.isNoCollects == 'yes'" class="tip">
    你还没有收藏过作品哦&nbsp; ,,Ծ‸Ծ,,
  </div>
</template>

<script setup lang="ts">
import SquareShow from '@/components/artwork-show/square-show.vue'
import { SquareArtItem } from '@/components/artwork-item'
import useCollectStore from '@/stores/module/home-page/module/collect'
import useMainStore from '@/stores/module/main'
import { MessageBox } from '@/components/message-box'
import { computed, onUnmounted } from 'vue'

const mainStore = useMainStore()
const collectStore = useCollectStore()

const isEnd = computed(() => collectStore.isEnd)

let page = 1
const loadMore = () => {
  collectStore.getUserCollectAction({ userId: mainStore.userId, page })
  page += 1
}

const handleCancelCollect = (artId: string, uid: string) => {
  MessageBox({ text: '是否取消收藏' }).then(() => {
    collectStore.cancelArtworkCollectAction(artId, uid)
  })
}

onUnmounted(() => {
  collectStore.$reset()
})
</script>

<style scoped lang="less">
.collect {
  width: 100%;
  margin: 0 auto 100px;
  max-width: 1450px;
  --column-count: 6;
  .container {
    margin: 20px 0 60px;
    padding-right: 30px;
  }
}
.title {
  display: flex;
  padding-bottom: 15px;
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
}
.end {
  font-weight: 400;
  margin-top: 70px;
  font-size: 13px;
  text-align: center;
}

.tip {
  margin-top: 150px;
  margin-right: 240px;
  font-size: 20px;
  text-align: center;
}

@media (max-width: 1780px) {
  .collect {
    --column-count: 6;
  }
}
@media (max-width: 1580px) {
  .collect {
    max-width: 1130px;
    --column-count: 5;
  }
}

@media (max-width: 1200px) {
  .collect {
    max-width: 910px;
    --column-count: 4;
  }
}
</style>
