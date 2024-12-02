<template>
  <div class="pagination-wrap">
    <span class="next" @click="subNum" :class="{ noSee: choiceNum === 1 }">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"
        />
      </svg>
    </span>
    <ul class="content">
      <li
        class="number"
        @click="clickNum(1)"
        :class="{ choice: choiceNum === 1 }"
      >
        1
      </li>
      <li class="first" v-show="choiceNum > 4 && pageCount > 8"></li>
      <template v-for="index in numList" :key="index">
        <li
          class="number"
          :class="{ choice: choiceNum === index }"
          @click="clickNum(index)"
        >
          {{ index }}
        </li>
      </template>
    </ul>
    <span
      class="next"
      @click="addNum"
      :class="{ noSee: choiceNum === pageCount }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"
        />
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
const props = defineProps({
  pageCount: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  itemHight: {
    type: String,
    default: '35px'
  },
  choiceColor: {
    type: String,
    default: 'black'
  }
})
const emits = defineEmits(['choiceNum'])
// 监听点击的数字
const choiceNum = ref(1)
watch(
  () => props.page,
  (newPage) => {
    choiceNum.value = newPage
  },
  { immediate: true }
)

const clickNum = (num: number) => {
  choiceNum.value = num
  // 将页数传出
  emits('choiceNum', num)
}

// 上一页
const subNum = () => {
  if (choiceNum.value > 1) choiceNum.value -= 1
  // 将页数传出
  emits('choiceNum', choiceNum.value)
}
//下一页
const addNum = () => {
  if (choiceNum.value < props.pageCount) choiceNum.value += 1
  // 将页数传出
  emits('choiceNum', choiceNum.value)
}
const numList = computed(() => {
  const num: any = []
  let starNum = 2
  let endNum = props.pageCount
  // choiceNum < 5 时 最大显示 7页
  if (props.pageCount > 7) endNum = 7

  // 如果大于5时
  if (choiceNum.value >= 5) {
    // 开始的序号为 选择的数 -1  最大多显示 5页
    starNum = choiceNum.value - 1
    endNum = choiceNum.value + 3
    // 如果最多显示 的页数超过总页数 则 end 最大页数 开始页数为 end-4
    if (endNum > props.pageCount) {
      endNum = props.pageCount
      starNum = endNum - 4
      if (starNum === 1) starNum = 2
    }
  }
  // 建立数组
  for (let index = starNum; index <= endNum; index++) {
    num.push(index)
  }
  return num
})
</script>

<style scoped lang="less">
.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 374px;
  user-select: none;
  span {
    display: flex;
    margin: 0 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  span:hover {
    transform: scale(1.2);
  }
}
.content {
  display: flex;
  justify-content: center;
  .number {
    font-weight: 600;
    font-size: 14px;
    color: var(--color-regular);
    display: flex;
    align-items: center;
    justify-content: center;
    width: v-bind('props.itemHight');
    height: v-bind('props.itemHight');
    margin: 5px;
    cursor: pointer;
    border-radius: 100%;
  }
  .number:hover {
    transition: all 0.3s ease;
    transform: scale(1.2);
    background-color: var(--transparent-hover);
  }
}
.choice {
  color: white !important;
  background-color: v-bind('props.choiceColor') !important;
}
.noSee {
  opacity: 0;
  cursor: auto !important;
}
.first:after {
  margin: 0 3px;
  content: '\2022\2022\2022';
  display: block;
  letter-spacing: 1px;
  color: var(--color-regular);
  text-align: center;
  line-height: 45px;
  font-size: 13px;
}
.next {
  svg {
    fill: var(--color-regular);
  }
}
</style>
