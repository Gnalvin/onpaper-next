<template>
  <div class="recommend-user">
    <div class="title">
      你可能感兴趣的人<span class="page">
        <svg
          @click="() => (userPage = userPage <= 1 ? 1 : userPage - 1)"
          width="16"
          height="16"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M31 36L19 24L31 12"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ userPage }}/{{ totalNum }}
        <svg
          @click="
            () => (userPage = userPage >= totalNum ? totalNum : userPage + 1)
          "
          width="16"
          height="16"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12L31 24L19 36"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>
    <template v-for="item in recommend" :key="item.userId">
      <div class="user-item">
        <AvatarItem
          :user-id="item.userId"
          :height="46"
          :width="46"
          :img-url="item.avatar"
          :open-new="true"
        ></AvatarItem>
        <div class="name-tag">
          <div class="nick one-line">
            {{ item.userName }}
          </div>
          <div class="tags">
            <div class="tag" :title="item.tags[0]">
              <span class="one-line">{{ item.tags[0] }}</span>
            </div>
            <div class="tag" :title="item.tags[1]" v-if="item.tags[1]">
              <span class="one-line">{{ item.tags[1] }}</span>
            </div>
          </div>
        </div>
        <div class="button">
          <ElButton
            class="btn"
            :class="{ focused: item.isFocus }"
            :verifyLogin="true"
            @click="handleFocus(item.userId, item.userName, item.isFocus)"
          >
            {{ item.isFocus == 1 ? '已关注' : '关注' }}
          </ElButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useTrendStore from '@/stores/module/trend'
import { MessageBox } from '@/components/message-box'
import AvatarItem from '@/components/avatar/avatar-item.vue'
import ElButton from '@/components/button/el-button.vue'

const props = defineProps({
  showCount: {
    type: Number,
    default: 4
  }
})

const trendStore = useTrendStore()

trendStore.getRecommendUserAction()

const userPage = ref(1)
const totalNum = computed(() =>
  Math.ceil(trendStore.recommendUser.length / props.showCount)
)
//一页四个
const recommend = computed(() =>
  trendStore.recommendUser.slice(
    (userPage.value - 1) * props.showCount,
    userPage.value * props.showCount
  )
)

const handleFocus = (userId: string, userName: string, isFocus: 0 | 1) => {
  //取消关注时 弹出提示
  if (isFocus) {
    MessageBox({
      text: `是否取消关注 @${userName} ?`
    }).then(() => {
      trendStore.postUserFocusAction(userId, isFocus)
    })
    return
  }
  trendStore.postUserFocusAction(userId, isFocus)
}
</script>

<style scoped lang="less">
.recommend-user {
  margin-top: 5px;
  border-radius: 5px;
  padding: 18px 12px 5px;
  background-color: var(--surface-color4);
  user-select: none;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-text2);
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
    .page {
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 12px;
      svg {
        padding: 5px;
        cursor: pointer;
        stroke: var(--color-text2);
      }
    }
  }
  .user-item {
    padding: 12px 0;
    display: flex;
    align-items: flex-end;
    .name-tag {
      flex-shrink: 0;
      width: 135px;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .nick {
        font-size: 13px;
        margin-left: 10px;
        font-weight: 500;
      }
      .tags {
        display: flex;
        margin-left: 5px;
        margin-top: 5px;
        .tag {
          margin-left: 5px;
          max-width: 50px;
          color: var(--color-text3);
          font-size: 12px;
          padding: 2px 5px;
          background-color: var(--surface-color3);
          border-radius: 5px;
        }
      }
    }
    .button {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
      .btn {
        margin: 0;
        font-size: 12px;
        padding: 7px 18px;
        border-radius: 20px;
        cursor: pointer;
        color: var(--color-text1);
        background-color: var(--btn-color2);
        border: 1px solid var(--color-text3);
        &:hover {
          background-color: var(--btn-color2-hover);
        }
      }
      .focused {
        padding: 7px 13px;
        color: var(--color-regular);
        background-color: var(--bgc);
      }
      .focused:hover {
        background-color: var(--btn-cancel-color);
      }
    }
  }
}
</style>
