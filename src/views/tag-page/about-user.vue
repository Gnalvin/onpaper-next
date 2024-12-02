<template>
  <section class="about-user">
    <ul class="info-show">
      <li v-for="user in users" :key="user.userId" class="row">
        <UserBigCard
          :userInfo="user"
          @focus="postFocus"
          :maxShowArt="5"
        ></UserBigCard>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, watch, onActivated, onDeactivated } from 'vue'
import useTagPageStore from '@/stores/module/tag-page'
import UserBigCard from '@/components/user-card/user-big-card.vue'
import { MessageBox } from '@/components/message-box'
import { debounce } from '@/utils/debounce'
import { useRoute } from 'vue-router'
import type { focusPayloadType } from '@/stores/module/tag-page/type'

const route = useRoute()
const tagStore = useTagPageStore()
const users = computed(() => tagStore.recommendUsers)

//发送关注作者请求
const postFocus = debounce((payload: focusPayloadType) => {
  //取消关注时 弹出提示
  if (payload.isFocus) {
    MessageBox({
      text: `是否取消关注 @${payload.userName} ?`
    }).then(() => {
      tagStore.postUserFocusAction(payload)
    })
    return
  }
  tagStore.postUserFocusAction(payload)
}, 300)

let isAlive = true
let oldTag = ''
onActivated(() => {
  isAlive = true
  const nowTag = route.params.tagName as string

  if (oldTag !== nowTag) {
    tagStore.getTagAboutUserAction(nowTag)
    oldTag = nowTag
  }
})
onDeactivated(() => (isAlive = false))

watch(
  () => route.params.tagName,
  (tag) => {
    if (tag === undefined) return
    if (!isAlive) return
    const tagName = tag as string
    tagStore.getTagAboutUserAction(tagName)
    oldTag = tagName
  },
  { immediate: true }
)
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
@media (max-width: 1550px) {
  .info-show {
    :deep(.userInfo) {
      width: 380px !important;
    }
  }
}

@media (max-width: 1450px) {
  .info-show {
    :deep(.artwork-info) {
      ul {
        grid-template-columns: repeat(4, 1fr) !important;
      }
      ul > :nth-of-type(1n + 5) {
        display: none;
      }
    }
  }
}

@media (max-width: 1260px) {
  .info-show {
    :deep(.userInfo) {
      width: 340px !important;
    }
  }
}

@media (max-width: 1200px) {
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
