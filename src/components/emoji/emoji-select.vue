<template>
  <div class="emoji-select">
    <div
      class="emoji-picker"
      :class="{
        'down-show': position == 'down',
        'up-show': position == 'up',
        'left-show': position == 'left'
      }"
      ref="emojiEl"
      v-if="isShowEmoji"
    >
      <div class="container">
        <div class="category" v-for="(item, category) in data" :key="category">
          <span>{{ category }}</span>
          <div class="wrap">
            <div
              class="emoji"
              @click="handleEmojiClick(emoji)"
              v-for="(emoji, name) in item"
              :key="`emoji_${name}`"
            >
              <span> {{ emoji }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mask"></div>
      <div
        class="arrow"
        :class="{
          'arrow-down': position == 'down',
          'arrow-up': position == 'up'
        }"
      ></div>
    </div>
    <div class="svg-text" @click="handleShowEmoji">
      <svg
        width="21"
        height="21"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
          fill="none"
          stroke-width="4"
          stroke-linejoin="round"
        />
        <path
          d="M31 18V19"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17 18V19"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M31 31C31 31 29 35 24 35C19 35 17 31 17 31"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span v-if="showText" class="text"> 表情</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue'
import { useEventListener } from '@vueuse/core'
import data from './emojis-data.json'
const emits = defineEmits(['emoji'])
const props = defineProps({
  position: {
    type: String as PropType<'up' | 'down' | 'left'>,
    default: 'down'
  },
  left: {
    type: String,
    default: '-160px'
  },
  arrow: {
    type: String,
    default: '43%'
  },
  showText: {
    type: Boolean,
    default: true
  }
})
// 是否显示表情
const isShowEmoji = ref(false)
const handleShowEmoji = () => {
  isShowEmoji.value = !isShowEmoji.value
}

const handleEmojiClick = (emoji: string) => {
  emits('emoji', emoji)
  isShowEmoji.value = false
}
const emojiEl = ref<HTMLDivElement>()
onMounted(() => {
  //监听点击其他地方关闭
  useEventListener(document, 'mouseup', (event: MouseEvent) => {
    const clickEl = event.target as HTMLElement
    const area = emojiEl.value?.parentElement?.parentElement
    if (!(clickEl == area || area?.contains(clickEl))) {
      isShowEmoji.value = false
    }
  })
})
</script>

<style scoped lang="less">
.emoji-select {
  position: relative;
}
.emoji-picker {
  min-width: 320px;
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 20rem;
  height: 19rem;
  border: 0.5px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  z-index: 999;
}
.down-show {
  top: 35px;
  left: v-bind('props.left');
}

.up-show {
  bottom: 35px;
  left: v-bind('props.left');
}
.left-show {
  right: 35px;
  top: -135px;
  .arrow {
    right: -14px;
    bottom: 52%;
  }
}
.emoji-picker,
.arrow {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.0975);
}
.emoji-picker,
.container {
  border-radius: 0.5rem;
  background: var(--bgc);
}
.container {
  position: relative;
  padding: 1rem;
  overflow: auto;
  z-index: 999;
}
.category {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
.wrap {
  display: flex;
  flex-wrap: wrap;
}
.emoji {
  margin: 0.5rem;
  margin-left: 0;
  background: inherit;
  color: rgb(0, 149, 246);
  font-weight: 700;
  border: none;
  font-size: 1.75rem;
  padding: 0;
  cursor: pointer;
}
.arrow {
  position: absolute;
  right: v-bind('props.arrow');
  width: 0.75rem;
  height: 0.75rem;
  transform: translate(-50%, 50%) rotate(45deg);
  background: var(--bgc);
  border: 1px solid var(--border-color1);
}
.arrow-down {
  bottom: 100%;
}
.arrow-up {
  top: 95.3%;
}
.mask {
  width: 100%;
  position: absolute;
  bottom: 0px;
  z-index: 1;
  height: 10px;
  border-radius: 0.5rem;
  background: linear-gradient(to bottom, transparent 0%, var(--bgc) 100%);
}
.svg-text {
  display: flex;
  align-items: center;
  cursor: pointer;
  svg {
    stroke-width: 4;
    stroke: var(--color-text2);
  }
  .text {
    margin-left: 5px;
    line-height: 20px;
  }
  &:hover {
    color: var(--color-text4-hover);
    svg {
      stroke: var(--color-text4-hover);
    }
  }
}
</style>
