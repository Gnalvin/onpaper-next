<template>
  <Teleport to="body">
    <div class="forward">
      <div class="container">
        <div class="title" @click="emits('close')">
          <svg
            width="26"
            height="26"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 14L34 34"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 34L34 14"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="body">
          <div class="left">
            <AvatarItem
              :height="48"
              :width="48"
              :user-id="mainStore.userId"
              :img-url="mainStore.avatarUrl"
              :lazyLoad="'close'"
              :notLink="true"
            ></AvatarItem>
          </div>
          <div class="right">
            <div class="editor">
              <div class="editor-wrap" v-focus>
                <textarea
                  ref="textareaEl"
                  class="textarea"
                  @input="changHeight"
                  v-model.trim="text"
                  placeholder="有什么想和大家分享的？"
                ></textarea>
              </div>
            </div>
            <div class="trend">
              <div class="mask"></div>
              <div class="info">
                <AvatarItem
                  :height="24"
                  :width="24"
                  :user-id="forwardItem.userId"
                  :img-url="forwardItem.avatar"
                  :lazyLoad="'close'"
                  :notLink="true"
                ></AvatarItem>
                <div class="name">{{ forwardItem.userName }}</div>
              </div>
              <div class="link" v-if="forwardItem.type == 'tr'">
                <span
                  class="topic"
                  v-if="forwardItem.topic.topicId"
                  @click.stop
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 26.7117 4.53967 29.2974 5.51747 31.6554C6.02232 32.8729 6.64396 34.0297 7.36843 35.1119C7.61157 35.4751 7.15543 37.7711 6 42C10.2289 40.8446 12.5249 40.3884 12.8881 40.6316C13.9703 41.356 15.1271 41.9777 16.3446 42.4825C18.7026 43.4603 21.2883 44 24 44Z"
                      fill="#1bad1b"
                      stroke="#1bad1b"
                      stroke-width="3"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.6045 19.8201H33.3838"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.8467 15.7378L18.933 32.2622"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M28.8467 15.7378L25.933 32.2622"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.6045 28H31.3838"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="topic-text"> {{ forwardItem.topic.text }}</span>
                </span>
              </div>
              <div class="intro">
                <span v-html="$xss(forwardItem.intro)"></span>
              </div>
              <ImgWrap :pics="forwardItem.pics"></ImgWrap>
            </div>
          </div>
        </div>
        <div class="foot">
          <div class="tool">
            <Emoji
              @emoji="handleEmoji"
              :show-text="false"
              :position="'up'"
            ></Emoji>
            <WhoSeeChose @chose="handleWhoSeeChose"></WhoSeeChose>
          </div>
          <div class="post">
            <TextCount :text="text"></TextCount>
            <ElButton
              v-if="uploadTrendStore.isRetry"
              class="btn"
              @click="handlePost"
              >发布
            </ElButton>
            <ElButton v-else class="btn" disable> 发布中... </ElButton>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import AvatarItem from '@/components/avatar/avatar-item.vue'
import useMainStore from '@/stores/module/main'
import useTrendStore from '@/stores/module/trend'
import useUploadTrendStore from '@/stores/module/upload/trend'
import { ref, watch, onUnmounted, type PropType } from 'vue'
import type { ITrend } from '@/service/trend-page/type'
import ElButton from '../../button/el-button.vue'
import WhoSeeChose from './who-see.vue'
import ImgWrap from '../cpn/img-wrap.vue'
import Emoji from '@/components/emoji/emoji-select.vue'
import TextCount from './text-count.vue'
import { notification } from '@/components/notification'

const uploadTrendStore = useUploadTrendStore()
const props = defineProps({
  forwardItem: {
    type: Object as PropType<ITrend>,
    required: true
  }
})
const trendStore = useTrendStore()
const emits = defineEmits(['close'])
const mainStore = useMainStore()

const text = ref('')
watch(text, (val) => {
  uploadTrendStore.uploadFormData.text = val
})

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
  text.value = text.value.slice(0, index) + emoji + text.value.slice(index)
}

const handleWhoSeeChose = (whoSee: 'public' | 'privacy' | 'onlyFans') => {
  uploadTrendStore.uploadFormData.whoSee = whoSee
}

//发布
const handlePost = async () => {
  if (text.value.length > 350) {
    notification({
      title: '发布动态',
      type: 'error',
      message: '发布的动态文字过长'
    })
    return
  }
  uploadTrendStore.uploadFormData.forwardInfo = {
    id: props.forwardItem.trendId,
    type: props.forwardItem.type
  }
  const res = await uploadTrendStore.uploadTrendAction({ ...props.forwardItem })
  // 发布成功
  if (res.status === 200) {
    // 前端显示 转发 +1
    const id = props.forwardItem.trendId
    const item = trendStore.trends.find((i) => i.trendId == id)
    if (item) item.count.forwards++

    emits('close')
    uploadTrendStore.$reset()
  }
}

onUnmounted(() => {
  uploadTrendStore.$reset()
})
</script>

<style scoped lang="less">
@import '../css/img-show.less';
.forward {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.75);
}
.container {
  width: 600px;
  margin: auto;
  background-color: var(--surface-color4);
  border-radius: 8px;

  .title {
    height: 35px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    svg {
      margin-right: 16px;
      cursor: pointer;
      stroke: var(--color-text2);
    }
  }
  .body {
    display: flex;
    padding: 15px 15px 0px;
    .left {
      flex-shrink: 0;
      width: 55px;
    }
    .right {
      flex-grow: 1;
      overflow: hidden;
      padding-right: 5px;
      .editor {
        padding-bottom: 10px;
        .editor-wrap {
          padding: 6px 11px;
          user-select: none;
          .textarea {
            width: 100%;
            height: 48px;
            padding: 0px;
            line-height: 24px;
            font-size: 17px;
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

      .trend {
        position: relative;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid var(--border-color1);
        .link {
          padding: 5px 0;
        }
        .info {
          padding: 10px 0;
          display: flex;
          align-items: center;
          .name {
            font-size: 15px;
            font-weight: 700;
            margin-left: 5px;
          }
        }
        .mask {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        .intro {
          padding-bottom: 10px;
          line-height: 25px;
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
.foot {
  display: flex;
  justify-content: space-between;
  padding: 15px 0px 10px;
  margin: 0 20px 0 70px;
  .btn {
    margin: 0;
    margin-left: 20px;
    padding: 7px 25px;
  }
  .tool {
    display: flex;
    align-items: center;
    font-size: 14px;
    .emoji-select {
      margin-right: 15px;
    }
  }
  .post {
    display: flex;
    align-items: center;
  }
}

img {
  cursor: auto;
}
</style>
