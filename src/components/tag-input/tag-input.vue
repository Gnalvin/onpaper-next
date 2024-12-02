<template>
  <div class="tag-input" :class="{ 'border-none': isMoreThanMax }">
    <div class="container" ref="containerEl">
      <div class="tags" ref="tagContainerEL">
        <template v-for="(tag, index) in tags" :key="tag">
          <span class="tag">
            <span class="tag-text">{{ tag }}</span>
            <span class="delete" @click="handleDelete(index)"></span>
          </span>
        </template>
      </div>
      <div class="input" v-if="!isMoreThanMax">
        <input
          v-model="inputText"
          ref="inputEL"
          type="text"
          @focus="isFocus = true"
          :maxlength="maxText"
          placeholder="输入文字再按空格进行添加"
          @keydown.enter="handleEnter"
          @keydown.delete="handleDelete(-1)"
          @keydown="handleComma"
        />
      </div>
      <AutoComplete
        :is-show="showAuto && !isMoreThanMax"
        :data-list="autoComplete"
        :search="inputText"
        :always="true"
        @click-item="handleClickItem"
        ref="autoCompleteCpn"
      ></AutoComplete>
    </div>
    <div class="max-count" v-if="!isMoreThanMax && isFocus">{{ maxCount }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, type PropType } from 'vue'
import { EVENT_CODE } from '../config/event_code'
import AutoComplete from '../auto-complete/auto-complete.vue'
import { clickOtherClose } from '@/hooks/click-close'

const props = defineProps({
  maxTags: {
    type: Number,
    default: -1
  },
  maxText: {
    type: Number,
    default: -1
  },
  autoComplete: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  focusTipAll: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})
const emits = defineEmits(['change', 'update:modelValue'])
const tags = ref<string[]>(props.modelValue)
const containerEl = ref<HTMLDivElement>()
const tagContainerEL = ref<HTMLDivElement>()
const autoCompleteCpn = ref<InstanceType<typeof AutoComplete>>()
const inputEL = ref<HTMLInputElement>()
const inputText = ref('')

watch(
  () => tags.value,
  () => {
    emits('change', [...tags.value])
    emits('update:modelValue', [...tags.value])
  },
  { deep: true }
)

const isMoreThanMax = computed(
  () => props.maxTags !== -1 && tags.value.length >= props.maxTags
)
const handleEnter = () => {
  // 如果超出最大限制静止添加
  if (isMoreThanMax.value) {
    return
  }
  const choseIndex = autoCompleteCpn.value!.choseIndex
  //不是空字符添加到 tag里
  if (inputText.value.trim() && choseIndex === -1) {
    if (!tags.value.includes(inputText.value))
      tags.value.push(inputText.value.trim())
  }
  // 重置 input
  setTimeout(() => (inputText.value = ''))
}

// 输入完文字最后一个是空格 添加标签
watch(inputText, (val) => {
  const reg = /[^a-zA-Z0-9\u4e00-\u9fa5\u3040-\u30ff가-힣]/g
  // 使用正则表达式匹配除了中文、日文、韩文字符以外的所有字符，并替换为空字符串
  inputText.value = inputText.value.replace(reg, '')
  if (val.charAt(val.length - 1) === ' ') {
    handleEnter()
  }
})

//点击其他区域自动选中
clickOtherClose(containerEl, () => {
  isFocus.value = false
  handleEnter()
})

const handleDelete = (index: number) => {
  //如果是 点叉 删除 直接删除
  if (index !== -1) {
    inputEL.value?.focus()
    tags.value.splice(index, 1)
    return
  }

  // 还有字的时候 不删除元素
  if (inputEL.value!.value.trim()) return

  const tagElList = Array.from(tagContainerEL.value!.children)
  let deleteIndex = index

  // 如果是 按键盘删除 拿到最后一个元素 添加 预删除样式
  if (index === -1) {
    if (tagElList.length < 1) return
    // 删除带有 .pre-delete class 的元素
    const delEl = tagContainerEL.value!.querySelector('.pre-delete')
    if (delEl) return tags.value.splice(deleteIndex, 1)
    // 如果上一步没有找到元素 则添加 .pre-delete
    deleteIndex = tagElList.length - 1
    const choseTagEL = tagElList[deleteIndex]
    choseTagEL.classList.add('pre-delete')
    setTimeout(() => {
      // 1秒后移除
      choseTagEL.classList.remove('pre-delete')
    }, 1000)
    return
  }
}

// 处理按下逗号
const handleComma = (event: KeyboardEvent) => {
  if (event.code === EVENT_CODE.comma) {
    handleEnter()
  } else if (event.code === EVENT_CODE.period) {
    handleEnter()
  }
}

//总是出现自动完成
const isFocus = ref(false)

const showAuto = computed(
  () => (props.focusTipAll || !!inputText.value) && isFocus.value
)

//点击自动完成里面的内容时 添加到 tag
const handleClickItem = (text: string) => {
  if (isMoreThanMax.value) return
  if (!tags.value.includes(text)) tags.value.push(text)
  inputText.value = ''
  inputEL.value?.focus()
}

const maxCount = computed(() => {
  if (inputText.value && props.maxText !== -1) {
    return `${inputText.value.length} / ${props.maxText}`
  }
  if (props.maxTags !== -1) {
    return `${tags.value.length} / ${props.maxTags}`
  }
  return ''
})
</script>

<style scoped lang="less">
.tag-input {
  position: relative;
  display: flex;
  width: 330px;
  min-height: 46px;
  border-radius: 5px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  border: 1.3px solid var(--border-color1);
  &:focus-within {
    border-color: var(--primary-middle-color) !important;
  }
  &:hover {
    border-color: var(--border-color1-hover);
  }
}
.container {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  height: auto;
  padding: 0px 4px 2px;
  .tag {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 5px 13px;
    border-radius: 5px;
    border: 1px solid var(--border-color1);
    background-color: var(--btn-color3);
    margin: 0 5px 3px 0;
    .tag-text {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-regular);
    }
    // tag 的删除图标
    .delete {
      position: relative;
      background-color: hsla(0, 0%, 4%, 0.2);
      border-radius: 100%;
      height: 20px;
      width: 20px;
      cursor: pointer;
      margin-left: 5px;
      &:hover {
        background-color: hsla(0, 0%, 4%, 0.3);
      }
      .fake {
        background-color: #fff;
        content: '';
        display: block;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translateX(-50%) translateY(-50%) rotate(45deg);
        transform-origin: center center;
      }
      &::after {
        .fake();
        height: 50%;
        width: 2px;
      }
      &::before {
        .fake();
        height: 2px;
        width: 50%;
      }
    }
  }
  .input {
    flex: 1;
    input {
      color: var(--color-regular);
      font-weight: 400;
      // 让input 的宽度 由插槽决定
      max-width: 100%;
      width: 100%;
      height: 100%;
      min-width: 160px;
      font-size: 13px;
      background-color: transparent;
      &::-webkit-input-placeholder {
        color: var(--color-regular);
      }
    }
  }
}
.pre-delete {
  background-color: rgba(247, 107, 131, 0.7) !important;
  span {
    color: #fff !important;
  }
}
.border-none {
  border: none;
}
.max-count {
  position: absolute;
  right: -50px;
  bottom: 0;
  color: var(--color-regular);
  font-size: 12px;
}
</style>
