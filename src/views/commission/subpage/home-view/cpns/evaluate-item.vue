<template>
  <div class="evaluate top-mask-layer" @mousedown.self="$emit('close')">
    <div class="container">
      <div class="title">
        <span> 评价 {{ isArtist ? '企划方' : '画师' }} </span>
        <div class="close" @click="$emit('close')">
          <span>
            <svg
              t="1639580049786"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4204"
              width="15"
              height="15"
            >
              <path
                d="M886.784 746.496q29.696 30.72 43.52 56.32t-4.608 58.368q-4.096 6.144-11.264 14.848t-14.848 16.896-15.36 14.848-12.8 9.728q-25.6 15.36-60.416 8.192t-62.464-34.816l-43.008-43.008-57.344-57.344-67.584-67.584-73.728-73.728-131.072 131.072q-60.416 60.416-98.304 99.328-38.912 38.912-77.312 48.128t-68.096-17.408l-7.168-7.168-11.264-11.264-11.264-11.264q-6.144-6.144-7.168-8.192-11.264-14.336-13.312-29.184t2.56-29.184 13.824-27.648 20.48-24.576q9.216-8.192 32.768-30.72l55.296-57.344q33.792-32.768 75.264-73.728t86.528-86.016q-49.152-49.152-93.696-93.184t-79.872-78.848-57.856-56.832-27.648-27.136q-26.624-26.624-27.136-52.736t17.92-52.736q8.192-10.24 23.552-24.064t21.504-17.92q30.72-20.48 55.296-17.92t49.152 28.16l31.744 31.744q23.552 23.552 58.368 57.344t78.336 76.288 90.624 88.576q38.912-38.912 76.288-75.776t69.632-69.12 58.368-57.856 43.52-43.008q24.576-23.552 53.248-31.232t55.296 12.8q1.024 1.024 6.656 5.12t11.264 9.216 10.752 9.728 7.168 5.632q27.648 26.624 27.136 57.856t-27.136 57.856q-18.432 18.432-45.568 46.08t-60.416 60.416-70.144 69.632l-77.824 77.824q37.888 36.864 74.24 72.192t67.584 66.048 56.32 56.32 41.472 41.984z"
                p-id="4205"
              ></path>
            </svg>
          </span>
        </div>
      </div>
      <div class="user-info">
        <div class="avatar-item">
          <img draggable="false" :src="acceptUser.avatar" />
        </div>
        <div class="username">{{ acceptUser.userName }}</div>
      </div>
      <div class="rate">
        <div class="item">
          <span class="text"> {{ isArtist ? '付款及时' : '准时交稿' }}</span>
          <el-rate
            size="large"
            v-model="evaluate.rate1"
            :colors="colors"
            :texts="['非常差', '差', '一般', '满意', '超赞']"
            show-text
          />
        </div>
        <div class="item">
          <span class="text"> {{ isArtist ? '反馈及时' : '沟通能力' }}</span>
          <el-rate
            size="large"
            v-model="evaluate.rate2"
            :colors="colors"
            :texts="['非常差', '差', '一般', '满意', '超赞']"
            show-text
          />
        </div>
        <div class="item">
          <span class="text"> {{ isArtist ? '需求明确' : '作品质量' }}</span>
          <el-rate
            size="large"
            v-model="evaluate.rate3"
            :colors="colors"
            :texts="['非常差', '差', '一般', '满意', '超赞']"
            show-text
          />
        </div>
      </div>
      <div class="evaluate-text">
        <ElInput
          v-model="evaluate.text"
          size="large"
          maxlength="140"
          type="textarea"
          show-word-limit
          :autosize="{ minRows: 6, maxRows: 15 }"
          placeholder="请认真填写评价，这将对其他用户有很大帮助。&#10;不少于10个字"
        ></ElInput>
      </div>
      <div class="footer">
        <ElButton
          class="btn"
          @click="handlePost"
          :disable="detailStore.waiting"
        >
          提交
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useMainStore from '@/stores/module/main'
import useDetailStore from '@/stores/module/commission/detail'
import ElButton from '@/components/button/el-button.vue'
import { notification } from '@/components/notification'
import { formatPicUrl } from '@/utils/data-format'

const emits = defineEmits(['close', 'submit'])

const detailStore = useDetailStore()
const mainStore = useMainStore()

const { evaluate } = storeToRefs(detailStore)

const isArtist = computed(
  () => mainStore.userId === detailStore.planDetail!.artistId
)
const acceptUser = computed(() => {
  // 当前登陆是画师，则评价的是约稿用户，反之
  if (isArtist.value) {
    const userId = detailStore.planDetail!.userId
    const userName = detailStore.planDetail!.sender.userName
    let avatar = detailStore.planDetail!.sender.avatar
    avatar = formatPicUrl(avatar, userId, 'avatars')
    return { userId, avatar, userName }
  } else {
    const userId = detailStore.planDetail!.artist.userId
    const userName = detailStore.planDetail!.artist.userName
    let avatar = detailStore.planDetail!.artist.avatar
    avatar = formatPicUrl(avatar, userId, 'avatars')
    return { userId, avatar, userName }
  }
})

const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])

const handlePost = async () => {
  const { rate1, rate2, rate3, text } = evaluate.value
  if (!rate1 || !rate2 || !rate3) {
    notification({
      title: '发布评价',
      message: '请填写评分',
      type: 'error'
    })
    return
  }
  if (text.length < 10) {
    notification({
      title: '发布评价',
      message: '评价不得少于10个字',
      type: 'error'
    })
    return
  }
  emits('submit')
}
</script>

<style scoped lang="less">
.evaluate {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  width: 380px;
  background-color: var(--surface-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  border: 1px solid var(--border-color1);
  border-radius: 8px;
  padding: 15px 30px 20px;
}
.user-info {
  display: flex;
  align-items: center;
  .username {
    font-size: 15px;
    font-weight: 500;
    margin-left: 10px;
  }
}
.rate {
  margin-top: 10px;
  .item {
    display: flex;
    align-items: center;
    .text {
      margin-right: 10px;
    }
  }
}
.avatar-item {
  position: relative;
  img {
    width: 45px;
    height: 45px;
    border-radius: 45px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    background-color: #fff;
    object-fit: cover;
    box-sizing: border-box;
    transition: opacity 0.6s;
  }
  &::before {
    content: '';
    position: absolute;
    background-color: rgba(0, 0, 0, 0.02);
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    border-radius: 45px;
  }
}
.title {
  color: var(--color-text1);
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 700;
  margin: 0 -10px 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color2);
  .close {
    cursor: pointer;
    svg {
      fill: var(--color-text1);
    }
  }
}
.evaluate-text {
  margin-top: 20px;
}
.footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .btn {
    padding: 10px 65px;
  }
}
</style>
