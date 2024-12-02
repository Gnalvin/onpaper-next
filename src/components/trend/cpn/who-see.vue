<template>
  <div class="who-see" @click="isShowWhoSeeChose = true" ref="whoSeeEL">
    <span>{{ whoSee }}</span>
    <svg
      width="16"
      height="16"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M36 18L24 30L12 18"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <div
      class="who-see-chose"
      v-show="isShowWhoSeeChose"
      ref="whoSeeChoseEl"
      :class="{ top: !isShowBottom, bottom: isShowBottom }"
    >
      <template v-for="item in whoSeeMenu" :key="item.data">
        <span
          :class="{ chose: item.text === whoSee }"
          @click.stop="handleChoseWhoSee(item)"
        >
          {{ item.text }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { clickOtherClose } from '@/hooks/click-close'

const emits = defineEmits(['chose'])

// 下拉的位置
const isShowBottom = ref(true)

const isShowWhoSeeChose = ref(false)
type whoSeeType = { text: string; data: 'public' | 'privacy' | 'onlyFans' }
const whoSeeMenu: whoSeeType[] = [
  { text: '公开', data: 'public' },
  { text: '仅粉丝可见', data: 'onlyFans' },
  { text: '自己可见', data: 'privacy' }
]
const whoSee = ref('公开')
const handleChoseWhoSee = (item: whoSeeType) => {
  whoSee.value = item.text
  isShowWhoSeeChose.value = false
  emits('chose', item.data)
}

watch(isShowWhoSeeChose, () => {
  nextTick(() => {
    isShowBottom.value = isInViewPort(whoSeeChoseEl.value!)
  })
})

const whoSeeChoseEl = ref<HTMLDivElement>()
// 是否下拉框全部在视口中
function isInViewPort(el: HTMLDivElement) {
  const viewPortHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  const top = el.getBoundingClientRect() && el.getBoundingClientRect().top
  return top + el.offsetHeight < viewPortHeight
}

const whoSeeEL = ref<HTMLDivElement>()
clickOtherClose(whoSeeEL, () => (isShowWhoSeeChose.value = false))

const reset = () => {
  whoSee.value = '公开'
}

defineExpose({ reset })
</script>

<style scoped lang="less">
.who-see {
  display: flex;
  align-items: center;
  margin-right: 15px;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  color: var(--color-text2);
  svg {
    stroke: var(--color-text2);
  }
  .who-see-chose {
    width: 180px;
    position: absolute;
    right: -45px;
    display: flex;
    flex-direction: column;
    background-color: var(--surface-color4);
    border-radius: 10px;
    border: 1px solid var(--border-color1);
    span {
      z-index: 1;
      padding: 15px 20px;
      font-size: 15px;
      &:hover {
        background-color: var(--surface-color3);
      }
    }
    span:first-child {
      overflow: hidden;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    span:last-child {
      overflow: hidden;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    &::before {
      content: '';
      position: absolute;
      right: 65px;
      height: 12px;
      width: 12px;
      transition: background-color 0.3s ease;
      background-color: var(--surface-color4);
      transform: rotate(45deg);
    }
    .chose {
      color: var(--primary-middle-color);
    }
  }
}

.top {
  bottom: 30px;
  &::before {
    bottom: -7px;
    border-bottom: 1px solid var(--border-color1);
    border-right: 1px solid var(--border-color1);
  }
}
.bottom {
  top: 30px;
  &::before {
    top: -7px;
    border-top: 1px solid var(--border-color1);
    border-left: 1px solid var(--border-color1);
  }
}
</style>
