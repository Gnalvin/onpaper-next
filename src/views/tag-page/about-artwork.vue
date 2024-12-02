<template>
  <template v-if="artworks.length">
    <section class="about-artwork">
      <div class="artwork">
        <SquareShow :artworks="artworks" class="square-show">
          <template v-slot:default="slotProps">
            <SquareArtItem
              :big-title="true"
              :artworkItem="slotProps.item"
              :is-show-time="false"
            ></SquareArtItem>
          </template>
        </SquareShow>
      </div>
    </section>
  </template>
  <template v-if="tagStore.noHaveArts">
    <div class="no-have">暂时没有作品</div>
  </template>

  <div class="pagination">
    <PaginationItem
      v-if="artworks.length"
      :pageCount="pageCount"
      :page="pageNum"
      :item-hight="'40px'"
      @choiceNum="handleToPage"
    ></PaginationItem>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  watch,
  onActivated,
  onDeactivated,
  ref,
  type PropType
} from 'vue'
import useTagPageStore from '@/stores/module/tag-page'
import { SquareArtItem } from '@/components/artwork-item'
import { useRoute } from 'vue-router'
import SquareShow from '@/components/artwork-show/square-show.vue'
import { PaginationItem } from '@/components/pagination'

const props = defineProps({
  sort: {
    type: String as PropType<'score' | 'time'>,
    default: 'score'
  }
})

const emits = defineEmits(['scrollTop'])

const route = useRoute()
const tagStore = useTagPageStore()
const nowTag = computed(() => route.params.tagName as string)

const artworks = computed(() => {
  if (props.sort === 'score') {
    return tagStore.artworksByHot
  } else {
    return tagStore.artworksByTime
  }
})

const pageNum = ref(1)
const handleToPage = (page: number) => {
  if (pageNum.value === page) return
  pageNum.value = page
  emits('scrollTop')
  tagStore.getTagAboutArtAction(nowTag.value, props.sort, page)
}

let isAlive = true
let oldTag = ''
onActivated(() => {
  isAlive = true
  // 每次激活组件 检查当前的 tag 是不是和路由一致 不一致则请求
  if (oldTag !== nowTag.value) {
    tagStore.getTagAboutArtAction(nowTag.value, props.sort, 1)
    oldTag = nowTag.value
    pageNum.value = 1
  }
})
onDeactivated(() => (isAlive = false))

//监听路由变化
watch(
  () => route.params.tagName,
  (tag) => {
    if (tag === undefined) return
    // 如果不是激活状态不请求
    if (!isAlive) return
    const tagName = tag as string
    tagStore.getTagAboutArtAction(tagName, props.sort, 1)
    pageNum.value = 1
    oldTag = tagName
  },
  { immediate: true }
)
// 监听排序变化
watch(
  () => props.sort,
  () => {
    pageNum.value = 1
    tagStore.getTagAboutArtAction(nowTag.value, props.sort, 1)
  }
)
// 向上取整 计算需要多少页
const pageCount = computed(() => {
  //最多翻页10次
  if (tagStore.totalArt >= 360) {
    return 10
  } else {
    return Math.ceil(tagStore.totalArt / 36)
  }
})
</script>

<style scoped lang="less">
.about-artwork {
  .artwork {
    --column-count: 7;
  }
  @media (max-width: 1570px) {
    .artwork {
      --column-count: 6 !important;
    }
  }
  @media (max-width: 1380px) {
    .artwork {
      --column-count: 5 !important;
    }
  }

  @media (max-width: 1125px) {
    .artwork {
      --column-count: 4 !important;
    }
  }

  @media (min-width: 1570px) {
    :deep(.square-show) {
      .wrap > :nth-of-type(1n + 36) {
        display: none !important;
      }
    }
  }

  @media (min-width: 1125px) and (max-width: 1380px) {
    :deep(.square-show) {
      .wrap > :nth-of-type(1n + 36) {
        display: none !important;
      }
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.no-have {
  padding-top: 100px;
  font-size: 15px;
  text-align: center;
}
</style>
