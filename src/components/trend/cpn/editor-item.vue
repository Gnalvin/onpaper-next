<template>
  <div class="editor-container">
    <div class="header" v-if="isShowHeader">
      <div class="title">发布动态</div>
      <div class="close" @click="handleClose">
        <svg
          width="26"
          height="26"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 14L34 34"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14 34L34 14"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="editor">
      <div class="editor-wrap" v-focus>
        <textarea
          ref="textareaEl"
          class="textarea"
          v-model="trendText"
          placeholder="有什么想和大家分享的？"
          @input="handleInput"
        ></textarea>
      </div>
    </div>
    <div class="foot" :class="{ 'have-img': preImgUrls.length }">
      <div class="tool">
        <div class="left">
          <div class="emoji item">
            <Emoji :arrow-position="'136px'" @emoji="handleEmoji"></Emoji>
          </div>
          <div class="add-img item">
            <UploadUtil
              @fileData="handleFileData"
              :fileSize="10"
              :max-count="9"
              :multiple="true"
              style="display: none"
              ref="uploadUtils"
            ></UploadUtil>
            <div class="svg-text" @click="addImg">
              <svg
                width="22"
                height="22"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5 10C5 8.89543 5.89543 8 7 8L41 8C42.1046 8 43 8.89543 43 10V38C43 39.1046 42.1046 40 41 40H7C5.89543 40 5 39.1046 5 38V10Z"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.5 18C15.3284 18 16 17.3284 16 16.5C16 15.6716 15.3284 15 14.5 15C13.6716 15 13 15.6716 13 16.5C13 17.3284 13.6716 18 14.5 18Z"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15 24L20 28L26 21L43 34V38C43 39.1046 42.1046 40 41 40H7C5.89543 40 5 39.1046 5 38V34L15 24Z"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
              </svg>
              图片
            </div>
          </div>
          <div class="add-topic item" :class="{ 'chose-topic': topicText }">
            <Transition>
              <Topic
                @close="handleShowTopic"
                @chose="handleTopicChose"
                v-if="isShowTopic"
              ></Topic>
            </Transition>
            <div class="svg-text" @click="handleShowTopic">
              <svg
                class="topic-icon"
                width="22"
                height="22"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 26.7117 4.53967 29.2974 5.51747 31.6554C6.02232 32.8729 6.64396 34.0297 7.36843 35.1119C7.61157 35.4751 7.15543 37.7711 6 42C10.2289 40.8446 12.5249 40.3884 12.8881 40.6316C13.9703 41.356 15.1271 41.9777 16.3446 42.4825C18.7026 43.4603 21.2883 44 24 44Z"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.6045 19.8201H33.3838"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21.8467 15.7378L18.933 32.2622"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M28.8467 15.7378L25.933 32.2622"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.6045 28H31.3838"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span v-if="!topicText">话题</span>
              <template v-else>
                <span>{{ topicText }} </span>
                <span @click.stop="handleTopicCancel" class="topic-close">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 14L34 34"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14 34L34 14"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </template>
            </div>
          </div>
        </div>
        <div class="right">
          <WhoSee @chose="handleWhoSeeChose" ref="whoSeeEL"></WhoSee>
          <TextCount class="text-count" :text="trendText"> </TextCount>
        </div>
      </div>
      <PreviewImg
        v-if="preImgUrls.length"
        :loading="uploadTrendStore.loading"
        :url-list="uploadTrendStore.urlList"
        @add-img="addImg"
        @delete="delImg"
        @sort="changeSortUrlList"
      ></PreviewImg>
      <div class="post">
        <ElButton
          v-if="uploadTrendStore.isRetry"
          class="btn"
          @click="handlePost"
          :disable="!trendText.length"
          >发布</ElButton
        >
        <ElButton v-else class="btn posting" disable>
          发布中...
          <RingLoading></RingLoading>
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue'
import useUploadTrendStore from '@/stores/module/upload/trend'
import Topic from '../cpn/search-topic.vue'
import PreviewImg from '../cpn/preview-img.vue'
import Emoji from '@/components/emoji/emoji-select.vue'
import ElButton from '../../button/el-button.vue'
import UploadUtil from '@/components/upload/src/upload-util.vue'
import { MessageBox } from '@/components/message-box'
import { notification } from '@/components/notification'
import { changeSortUrlList } from '@/stores/module/upload/trend/handle'
import type { IMoreFilePayload } from '@/components/upload/type'
import RingLoading from '../../loading/src/ring-loading.vue'
import TextCount from '../cpn/text-count.vue'
import WhoSee from '../cpn/who-see.vue'

defineProps({
  isShowHeader: {
    type: Boolean,
    default: true
  }
})
const uploadTrendStore = useUploadTrendStore()
const emits = defineEmits(['close'])

const whoSeeEL = ref<InstanceType<typeof WhoSee>>()
const trendText = ref('')
const handleInput = () => {
  trendText.value = trendText.value.replace(/\n{3,}/g, '\n\n')
  changHeight()
  uploadTrendStore.uploadFormData.text = trendText.value.trim()
}

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
  const scrollHeight = textareaEl.value!.scrollHeight
  textareaEl.value!.style.height =
    (scrollHeight > 48 ? scrollHeight : 48) + 'px'
}

const handleEmoji = (emoji: string) => {
  const index = textareaEl.value?.selectionStart
  trendText.value =
    trendText.value.slice(0, index) + emoji + trendText.value.slice(index)
  uploadTrendStore.uploadFormData.text = trendText.value
}

// 是否显示添加话题
const isShowTopic = ref(false)
const handleShowTopic = () => {
  isShowTopic.value = !isShowTopic.value
}

const uploadUtils = ref<InstanceType<typeof UploadUtil>>()
// 调用函数添加图片
const addImg = () => {
  uploadUtils.value?.upload(true)
}
//删除图片
const delImg = (index: number) => {
  uploadTrendStore.urlList.splice(index, 1)
}
//预览图片
const preImgUrls = computed(() => uploadTrendStore.urlList)
const handleFileData = (fileData: IMoreFilePayload) => {
  if (fileData.urlList?.length === 0) return
  // 显示警告
  if (fileData.isLarge) {
    notification({
      title: '上传图片',
      type: 'error',
      message: '图片不能超过10M'
    })
    return
  }
  if (
    fileData.tooMuch ||
    preImgUrls.value.length + fileData.urlList.length > 9
  ) {
    notification({
      type: 'error',
      title: '上传作品',
      message: '最多不能超过9张图片'
    })
    return
  }

  // 把图片数据传到store 中处理
  uploadTrendStore.changeUrlListAction(fileData)
}

//处理选择了话题
const topicText = computed(() => uploadTrendStore.uploadFormData.topic.text)
const handleTopicChose = (topic: { text: string; topicId: string }) => {
  uploadTrendStore.uploadFormData.topic = topic
}
const handleTopicCancel = () => {
  uploadTrendStore.uploadFormData.topic = { text: '', topicId: '' }
}

const handleWhoSeeChose = (whoSee: 'public' | 'privacy' | 'onlyFans') => {
  uploadTrendStore.uploadFormData.whoSee = whoSee
}

const handlePost = async () => {
  //如果没有图片和文字
  if (!trendText.value && !uploadTrendStore.urlList.length) return
  if (uploadTrendStore.getUploadFailItem !== undefined) {
    notification({
      title: '发布动态',
      type: 'error',
      message: '请删除上传失败的图片'
    })
    return
  }
  // 如果还有图片等等上传
  if (uploadTrendStore.isHaveImgUpload) {
    notification({
      type: 'error',
      title: '发布动态',
      message: '请耐心等待所有图片上传完成'
    })
    return
  }
  if (trendText.value.length > 350) {
    notification({
      title: '发布动态',
      type: 'error',
      message: '发布的动态文字过长'
    })
    return
  }
  const res = await uploadTrendStore.uploadTrendAction()
  // 发布成功
  if (res.status === 200) {
    emits('close')
    trendText.value = ''
    whoSeeEL.value?.reset()
    uploadTrendStore.$reset()
  }
}

// 关闭组件
const handleClose = () => {
  if (!trendText.value) return emits('close')
  MessageBox({
    title: '确定关闭?',
    text: '关闭之后将不可恢复'
  }).then(() => emits('close'))
}
onUnmounted(() => {
  uploadTrendStore.$reset()
})
</script>

<style scoped lang="less">
.editor-container {
  width: 640px;
  margin: auto;
  background-color: var(--surface-color4);
  border-radius: 8px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px 0 20px;
    .title {
      font-size: 16px;
      font-weight: 700;
    }
    .close {
      cursor: pointer;
      svg {
        stroke: var(--color-text2);
      }
    }
  }

  .editor {
    padding: 20px 20px 10px;
    .editor-wrap {
      padding: 6px 11px;
      border: 1px solid var(--color-text2);
      border-radius: 8px;
      user-select: none;
      .textarea {
        width: 100%;
        height: 48px;
        padding: 0px;
        line-height: 24px;
        font-size: 14px;
        color: var(--color-regular);
        resize: none;
        border: none;
        text-align: justify;
        box-shadow: none;
        outline: none;
        background-color: transparent;
        &:focus-visible {
          outline: none;
        }
      }
    }
  }

  .foot {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    margin-bottom: 5px;
    min-height: 30px;
  }
  .have-img {
    flex-direction: column;
  }
  .tool {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text-count {
      margin-right: 25px;
    }
  }
  .left {
    display: flex;
    .item {
      margin-left: 20px;
      user-select: none;
    }
    .add-topic {
      position: relative;
    }
    .chose-topic {
      .svg-text {
        font-weight: 500;
        color: var(--color-text2);
        .topic-icon {
          stroke-width: 3;
          stroke: #fefefe;
          path:first-child {
            fill: #1bad1b;
            stroke: #1bad1b !important;
          }
        }
        .topic-close {
          display: flex;
          margin-left: 10px;
          border-radius: 50%;
          background-color: var(--transparent-hover);
          svg {
            margin: 0;
            stroke: var(--color-text3);
          }
        }
      }
      &:hover {
        .topic-close {
          align-items: center;
          justify-content: center;
          width: 15px;
          height: 15px;
        }
      }
    }
  }
  .right {
    display: flex;
  }

  .post {
    display: flex;
    margin-right: 20px;
    justify-content: flex-end;
    .btn {
      margin: 0;
      padding: 7px 25px;
    }
    .posting {
      display: flex;
      align-items: center;
      padding: 7px 15px;
      .loading {
        width: 12px;
        height: 10px;
        margin-left: 7px;
      }
    }
  }
}
.svg-text {
  display: flex;
  align-items: center;
  cursor: pointer;
  svg {
    stroke-width: 4;
    stroke: var(--color-text2);
    margin-right: 5px;
  }
  &:hover {
    color: var(--color-text4-hover);
    svg {
      stroke: var(--color-text4-hover);
    }
  }
}
</style>
