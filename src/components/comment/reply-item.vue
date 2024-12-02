<template>
  <div class="reply">
    <div class="avatar" v-if="avatar">
      <img :src="avatar" alt="" />
    </div>
    <div class="reply-who" v-if="replyWho">回复 @{{ replyWho }}</div>
    <div class="textarea-wrap">
      <textarea
        ref="textareaEl"
        type="text"
        v-model.trim="replyText"
        :placeholder="placeholder"
      ></textarea>
      <Emoji
        @emoji="handleEmoji"
        :show-text="false"
        :position="emojiPosition"
        :left="'-200px'"
        :arrow="'30%'"
      ></Emoji>
    </div>
    <ElButton class="btn" :verifyLogin="true" @click="handleReply">
      发布
    </ElButton>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, type PropType } from 'vue'
import ElButton from '../button/el-button.vue'
import Emoji from '@/components/emoji/emoji-select.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  replyWho: {
    type: String,
    default: ''
  },
  emojiPosition: {
    type: String as PropType<'up' | 'down' | 'left'>,
    default: 'up'
  },
  placeholder: {
    type: String,
    default: '发布你的评论'
  }
})

const emits = defineEmits(['reply', 'update:modelValue'])

const textareaEl = ref<HTMLTextAreaElement>()
//自动改变回复框大小
const changHeight = () => {
  // 这行为了退行时 自动变小
  textareaEl.value!.style.height = '20px'
  //如果大于150px 则锁定高度
  if (textareaEl.value!.scrollHeight > 150) {
    textareaEl.value!.style.height = '150px'
    return
  }
  // 把高度变为 元素 scrollHeight  撑起盒子
  textareaEl.value!.style.height = textareaEl.value!.scrollHeight + 'px'
}

const replyText = ref(props.modelValue)
watch(replyText, (val) => {
  changHeight()
  emits('update:modelValue', val)
})

watch(
  () => props.modelValue,
  (val) => (replyText.value = val)
)

//挂载时先改变一次大小
onMounted(changHeight)

const handleEmoji = (emoji: string) => {
  const index = textareaEl.value?.selectionStart
  replyText.value =
    replyText.value.slice(0, index) + emoji + replyText.value.slice(index)
  emits('update:modelValue', replyText.value)
}

const handleReply = () => {
  // 没有长度不发送事件
  if (replyText.value.length === 0) return
  emits('reply')
}
</script>

<style scoped lang="less">
.reply {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 0 35px 5px;
  font-size: 12px;
  margin: 0 -20px;
  padding-left: 25px;
  background-color: var(--surface-color4);
  .btn {
    margin-left: 10px;
    padding: 6px 15px;
    margin: auto 10px 10px;
  }
  .avatar {
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.05);
      background-color: #fff;
      object-fit: cover;
    }
    margin-right: 15px;
  }
  .reply-who {
    position: absolute;
    bottom: 10px;
    left: 75px;
    color: var(--color-regular);
  }
  .textarea-wrap {
    display: flex;
    padding: 10px;
    border: 1px solid var(--color-text2);
    border-radius: 8px;
    user-select: none;
  }
  textarea {
    height: 20px;
    line-height: 20px;
    font-size: 15px;
    width: 170px;
    padding: 0px;
    color: var(--color-regular);
    resize: none;
    border: none;
    text-align: justify;
    box-shadow: none;
    outline: none;
    background-color: transparent;
    overflow: hidden;
    &:focus-visible {
      outline: none;
    }
    &::-webkit-input-placeholder {
      color: var(--color-regular);
      font-weight: 400;
      font-size: 13px;
    }
  }
}
</style>
