<template>
  <div class="artwork-show">
    <div
      class="wrap"
      v-lazy-loading="artStore.getChannelArtworkAction"
      :lazy-loading-immediate="false"
      :lazy-loading-delay="600"
      :lazy-loading-distance="1000"
      :lazy-loading-disabled="artStore.isEnd || artStore.loading"
    >
      <div class="header">
        <div class="channel-container">
          <SlideShow
            :array-item="channelOpt"
            :item-key="'value'"
            class="slide-show"
          >
            <template v-slot:default="{ item }">
              <div
                class="channel"
                :class="{ active: artStore.query.zone == item.value }"
                @click="handleChannelClick(item.value)"
              >
                <span> {{ item.label }}</span>
              </div>
            </template>
          </SlideShow>
        </div>
        <div class="sort">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <span class="text">
                {{ artStore.query.sort == 'hot' ? '热度' : '最新' }}
              </span>
              <svg
                class="icon"
                width="26"
                height="26"
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
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleSortClick('hot')">
                  热度排序
                </el-dropdown-item>
                <el-dropdown-item @click="handleSortClick('new')">
                  最新发布
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="show">
        <div class="show-wrap">
          <SquareShow :artworks="artStore.artworks" class="square-show">
            <template v-slot:default="slotProps">
              <SquareArtItem
                :padding-top="'100%'"
                :artwork-item="slotProps.item"
                :is-show-time="false"
                :big-title="true"
              ></SquareArtItem>
            </template>
          </SquareShow>
        </div>
      </div>
    </div>
  </div>
  <TopButton></TopButton>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useArtworkShowStore from '@/stores/module/artwork-show'
import { SquareArtItem } from '@/components/artwork-item'
import SquareShow from '@/components/artwork-show/square-show.vue'
import SlideShow from '@/components/slide-show/slide-show.vue'
import TopButton from '@/components/top-button/top-button.vue'
import { zoneOptions } from '@/const/zone-config'

const route = useRoute()
const router = useRouter()
const channelOpt = [{ label: '全站', value: 'all' }, ...zoneOptions]
const artStore = useArtworkShowStore()

const verifyQuery = (val: any) => {
  // 如果不在配置的分区
  if (channelOpt.findIndex((i) => i.value == val.zone) == -1) return false
  if (val.sort != 'hot' && val.sort != 'new') return false
  return true
}
//请求数据
watch(
  () => route.query,
  (val) => {
    if (route.name != 'ArtworkShow') return
    if (!verifyQuery(val)) {
      const { zone, sort } = artStore.query
      router.replace({ name: 'ArtworkShow', query: { zone, sort } })
      return
    }
    artStore.artworks = []
    artStore.query.page = 0
    artStore.query.next = '0'
    artStore.isEnd = false
    artStore.loading = false
    artStore.query.zone = val.zone as string
    artStore.query.sort = val.sort as 'hot' | 'new'
    artStore.getChannelArtworkAction()
  },
  { immediate: true }
)

const handleChannelClick = (value: string) => {
  const { sort } = artStore.query
  router.push({ name: 'ArtworkShow', query: { zone: value, sort } })
}
const handleSortClick = (val: 'hot' | 'new') => {
  const { zone } = artStore.query
  router.push({ name: 'ArtworkShow', query: { zone, sort: val } })
}
</script>

<style scoped lang="less">
.artwork-show {
  width: 100%;
  background-color: var(--bgc);
  height: 100%;
}
.wrap {
  margin-top: 55px;
  padding: 65px 85px 100px 65px;
}
.show {
  display: flex;
  max-width: 1350px;
  margin: 5px auto 0;
}
.header {
  margin: auto;
  max-width: 1350px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .channel-container {
    width: calc(100% - 115px);
    .channel {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      height: 40px;
      padding: 0 16px;
      cursor: pointer;
      border-radius: 30px;
      user-select: none;
      -webkit-user-select: none;
    }
    :deep(.slide-show) {
      .wrap {
        li {
          margin: 0;
        }
      }
    }
  }
  .sort {
    cursor: pointer;
    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
    .text {
      font-size: 15px;
      margin-right: 8px;
      user-select: none;
    }
    .icon {
      stroke: var(--color-regular);
    }
  }
  .active {
    background: var(--transparent-hover);
    font-weight: 700;
    color: var(--color-text1);
  }
}

.show-wrap {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  margin-top: 20px;
  --column-count: 6;
}

@media (max-width: 1290px) {
  .show-wrap {
    --column-count: 5;
  }
}

@media (max-width: 1050px) {
  .show-wrap {
    --column-count: 4;
  }
}
</style>
