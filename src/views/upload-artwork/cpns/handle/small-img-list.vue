<template>
  <div class="img-list">
    <span @click="changMenu" v-if="urlList.length > 1"
      ><svg
        t="1647439817452"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2437"
        width="32"
        height="32"
      >
        <path
          d="M671.968176 911.99957c-12.287381 0-24.576482-4.67206-33.951566-14.047144L286.048434 545.984249c-18.751888-18.719204-18.751888-49.12028 0-67.872168L638.016611 126.111222c18.751888-18.751888 49.12028-18.751888 67.872168 0 18.751888 18.719204 18.751888 49.12028 0 67.872168l-318.016611 318.047574L705.888778 830.047574c18.751888 18.751888 18.751888 49.12028 0 67.872168C696.544658 907.32751 684.255557 911.99957 671.968176 911.99957z"
          p-id="2438"
        ></path>
      </svg>
    </span>
    <template v-for="(items, pageNum) in urlList" :key="pageNum">
      <div class="show-wrap" v-if="showMenu == pageNum">
        <template v-for="(item, index) in items" :key="item.url">
          <img class="item" :src="item.url" @click="toImg(index, pageNum)" />
        </template>
      </div>
    </template>
    <span @click="changMenu" v-if="urlList.length > 1"
      ><svg
        t="1647439870273"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2683"
        width="32"
        height="32"
      >
        <path
          d="M761.055557 532.128047c0.512619-0.992555 1.343475-1.823411 1.792447-2.848649 8.800538-18.304636 5.919204-40.703346-9.664077-55.424808L399.935923 139.743798c-19.264507-18.208305-49.631179-17.344765-67.872168 1.888778-18.208305 19.264507-17.375729 49.631179 1.888778 67.872168l316.960409 299.839269L335.199677 813.631716c-19.071845 18.399247-19.648112 48.767639-1.247144 67.872168 9.407768 9.791372 21.984142 14.688778 34.560516 14.688778 12.000108 0 24.000215-4.479398 33.311652-13.439914l350.048434-337.375729c0.672598-0.672598 0.927187-1.599785 1.599785-2.303346 0.512619-0.479935 1.056202-0.832576 1.567101-1.343475C757.759656 538.879828 759.199462 535.391265 761.055557 532.128047z"
          p-id="2684"
        ></path>
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import type { IUrlItem } from '@/stores/module/upload/artwork/type'
const emits = defineEmits(['toImg'])
const props = defineProps({
  urlList: {
    type: Array as PropType<IUrlItem[][]>,
    required: true
  }
})

const showMenu = ref(0) //展示第几组
// 跳页函数
const changMenu = () => {
  const allPage = props.urlList.length - 1
  // 小于总页数时 +1
  if (showMenu.value < allPage) {
    showMenu.value += 1
  } else {
    //大于总页数 回到第一页
    showMenu.value = 0
  }
}
//发出点击了哪个图事件
const toImg = (index: number, pageNum: number) => {
  emits('toImg', index, pageNum)
}
</script>

<style scoped lang="less">
.img-list {
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .show-wrap {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
