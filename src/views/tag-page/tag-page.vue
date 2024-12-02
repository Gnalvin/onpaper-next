<template>
  <div class="tag-wrap" v-title="pageTitle">
    <div class="container">
      <section class="head">
        <div class="head-area">
          <div class="cover">#</div>
          <div class="info">
            <div class="tag-name">
              #{{ tagStore.tagName ? tagStore.tagName : route.params.tagName }}
            </div>
            <div class="total">
              {{ tagStore.totalArt.toLocaleString('en-US') }} &nbsp;个作品
            </div>
          </div>
        </div>
      </section>
      <div class="about-tag">
        <SlideShow :array-item="relatedTags" :item-key="'tagId'">
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
      <section class="nav">
        <ul class="nav-bar">
          <template v-for="(item, index) in category" :key="item">
            <li class="title" @click="handleChoseTab(index)">{{ item }}</li>
          </template>
        </ul>
        <div class="sort" v-show="currentTab === 0">
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
        </div>
      </section>
      <KeepAlive>
        <component
          :is="tabs[currentTab]"
          :sort="sortText[sortNum].sort"
          @scrollTop="handleScrollTop"
        ></component>
      </KeepAlive>
    </div>
  </div>
  <TopButton ref="topButtonEl"></TopButton>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import useTagPageStore from '@/stores/module/tag-page'
import SlideShow from '@/components/slide-show/slide-show.vue'
import AboutArtwork from './about-artwork.vue'
import AboutUser from './about-user.vue'
import TopButton from '@/components/top-button/top-button.vue'

const route = useRoute()
const tagStore = useTagPageStore()

//页面标题
const pageTitle = computed(() => `# ${tagStore.tagName} - 纸上`)
const relatedTags = computed(() => tagStore.relevantTagList)

const currentTab = ref(0)
const category = ['相关作品', '推荐画师']
const tabs = [AboutArtwork, AboutUser]

//排序文本
const sortText = [
  { text: '热度排序', sort: 'score' },
  { text: '最近发布', sort: 'time' }
]
const sortNum = ref(0)
// 是否展示 排序
const isShowSort = ref(false)
const handleShowSort = () => {
  isShowSort.value = !isShowSort.value
}

watch(
  () => route.params.tagName,
  (tag) => {
    if (tag === undefined) return
    const tagName = tag as string
    const query = route.query.query as string
    tagStore.tagId = query
    sortNum.value = 0
    isShowSort.value = false
    tagStore.getRelevantTagAction(tagName)
  },
  { immediate: true }
)

const moveStyle = reactive({
  x: '0%'
})

const handleChoseTab = (index: number) => {
  currentTab.value = index
  moveStyle.x = index * 25 + '%'
}

// 选择哪种排序
const choiceSortFN = (sort: string, index: number) => {
  sortNum.value = index
}

const topButtonEl = ref<InstanceType<typeof TopButton>>()
const handleScrollTop = () => {
  topButtonEl.value?.toTop()
}
</script>

<style scoped lang="less">
.tag-wrap {
  margin: 55px 50px 0px;
  padding-bottom: 100px;
  .container {
    max-width: 1650px;
    padding-top: 50px;
    margin: 0 auto;
    .title {
      padding-bottom: 15px;
      font-size: 18px;
      line-height: 28px;
      font-weight: 500;
    }
  }
}
.head {
  .head-area {
    display: flex;
    .cover {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 400;
      font-size: 65px;
      border-radius: 5px;
      background-color: var(--surface-color1);
      border: 1px solid var(--border-color1);
      margin-right: 25px;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .tag-name {
        display: flex;
        align-items: center;
        font-weight: 700;
        font-size: 20px;
      }
      .total {
        margin-top: 10px;
        font-size: 15px;
        font-family: system-ui;
      }
    }
  }
}
.nav {
  display: flex;
  justify-content: space-between;
  .nav-bar {
    position: relative;
    margin: 40px 0;
    display: inline-flex;

    .title {
      margin: 0px 30px;
      cursor: pointer;
    }
    &::after {
      content: '';
      position: absolute;
      left: 0px;
      bottom: 0px;
      height: 4px;
      transition: transform 0.16s ease-in-out 0s;
      width: 200%;
      transform: translateX(v-bind('moveStyle.x'));
      background: linear-gradient(
        to right,
        var(--color-text4-hover) 0%,
        var(--color-text4-hover) 25%,
        rgba(255, 255, 255, 0) 25%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, 0) 75%,
        rgba(255, 255, 255, 0) 75%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  }
  .sort {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
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
      font-size: 15px;
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
}

.about-tag {
  font-size: 14px;
  line-height: 22px;
  font-weight: bold;
  margin-top: 35px;
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
</style>
