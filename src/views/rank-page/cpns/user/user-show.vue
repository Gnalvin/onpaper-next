<template>
  <ul class="info-show">
    <li v-for="(user, index) in userInfo" :key="user.userId" class="row">
      <div class="rank">
        <span>{{ index + 1 }}</span>
      </div>
      <UserBigCard :userInfo="user" @focus="postFocus"></UserBigCard>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { MessageBox } from '@/components/message-box'
import { debounce } from '@/utils/debounce'
import type {
  focusPayloadType,
  userRankType
} from '@/stores/module/rank-page/type'
import type { PropType } from 'vue'
import type { IUserInfo } from '@/service/rank-page/type'
import useRankPageStore from '@/stores/module/rank-page'

import UserBigCard from '@/components/user-card/user-big-card.vue'

const props = defineProps({
  userInfo: {
    type: Array as PropType<IUserInfo[]>,
    required: true
  },
  rankType: {
    type: String as PropType<userRankType>,
    required: true
  }
})

const rankStore = useRankPageStore()

//发送关注作者请求
const postFocus = debounce((payload: focusPayloadType) => {
  payload.rankType = props.rankType
  //取消关注时 弹出提示
  if (payload.isFocus) {
    MessageBox({
      text: `是否取消关注 @${payload.userName} ?`
    }).then(() => {
      rankStore.postUserFocusAction(payload)
    })
    return
  }
  rankStore.postUserFocusAction(payload)
}, 300)
</script>

<style scoped lang="less">
.rank {
  display: flex;
  height: 80px;
  width: 60px;
  justify-content: flex-start;
  align-items: center;
  span {
    font-weight: 700;
    font-size: 27px;
    color: var(--color-text1);
  }
}
.info-show {
  display: flex;
  flex-direction: column;
  width: 1450px;
  .row {
    display: flex;
    flex-shrink: 0;
    padding-top: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-color1);

    &:last-child {
      border: none;
    }
  }
}

@media (max-width: 1450px) {
  .info-show {
    :deep(.userInfo) {
      width: 380px !important;
    }
  }
}

@media (max-width: 1200px) {
  .info-show {
    :deep(.userInfo) {
      width: 340px !important;
    }
  }
}

@media (max-width: 1300px) {
  .info-show {
    :deep(.artwork-info) {
      ul {
        grid-template-columns: repeat(3, 1fr) !important;
      }
      ul > :nth-of-type(1n + 4) {
        display: none;
      }
    }
  }
}
</style>
