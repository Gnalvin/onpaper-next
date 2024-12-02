<template>
  <div
    v-if="picCount"
    class="img-show"
    :class="{
      'one-img': picCount == 1,
      'more-img': picCount > 1,
      'four-multiple': picCount % 4 == 0 || picCount == 7,
      'more-than-nine': picCount > 9
    }"
    :style="onePicStyle"
  >
    <div
      @click.stop="handleShowLargePic(i)"
      class="img-wrap"
      v-for="(p, i) in pics.slice(0, 9)"
      :key="i"
    >
      <img v-lazy-img="p.preShowUrl" alt="" @error="handleImgErr" />
      <div v-if="i == 8 && picCount > 9" class="more">+{{ picCount - 9 }}</div>
    </div>
  </div>
  <ImgView
    v-if="isShowImgLarge"
    :pic-list="pics"
    :index="showPicIndex"
    :background-color="'rgba(0, 0, 0, 0.75)'"
    @close="handleShowLargePic"
  ></ImgView>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { handleImgErr } from '@/utils/handle-img'
import type { picsType } from '@/service/trend-page/type'
import ImgView from '@/components/img-view/img-view.vue'
import { stopBodyScroll } from '@/utils/stopScroll'

const props = defineProps({
  pics: {
    type: Object as PropType<picsType[]>,
    required: true
  }
})
// 1图单独样式
// 4,7,8图一行4张
// 2,3,5,6,9图 一行3张
const picCount = computed(() => props.pics.length)

//设置单图的样式
const onePicStyle = computed(() => {
  const height = props.pics[0].height + 'px'
  const width = props.pics[0].width + 'px'
  if (picCount.value === 1) {
    return { height, width }
  }
  return ''
})

// 展示大图
const isShowImgLarge = ref(false)
const showPicIndex = ref(0)
const handleShowLargePic = (index: number) => {
  showPicIndex.value = index
  isShowImgLarge.value = !isShowImgLarge.value
  stopBodyScroll(isShowImgLarge.value)
}
</script>

<style scoped lang="less">
@import '../css/img-show.less';
</style>
