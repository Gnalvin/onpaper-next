<template>
  <div class="user-show">
    <div
      class="wrap"
      v-lazy-loading="userStore.getUserShowAction"
      :lazy-loading-immediate="false"
      :lazy-loading-delay="300"
      :lazy-loading-distance="1000"
      :lazy-loading-disabled="isStopLoadMore"
    >
      <div class="header">
        <template v-for="item in navList" :key="item.val">
          <div
            class="nav-item"
            :class="{ active: item.value == userStore.query.type }"
            @click="handleChoseNav(item.value)"
          >
            {{ item.label }}
          </div>
        </template>
      </div>
      <Transition mode="out-in" appear>
        <Skeleton
          v-if="userStore.loading && userStore.query.next == '0'"
        ></Skeleton>
        <section v-else class="about-user">
          <ul class="info-show">
            <li
              v-for="(user, index) in userStore.users"
              :key="user.userId + index"
              class="row"
            >
              <UserBigCard
                :userInfo="user"
                @focus="postFocus"
                :maxShowArt="5"
              ></UserBigCard>
            </li>
          </ul>
        </section>
      </Transition>
    </div>
  </div>
  <TopButton></TopButton>
</template>

<script setup lang="ts">
import { watch, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useUserShow from '@/stores/module/all-user'
import UserBigCard from '@/components/user-card/user-big-card.vue'
import TopButton from '@/components/top-button/top-button.vue'
import { debounce } from '@/utils/debounce'
import { MessageBox } from '@/components/message-box'
import Skeleton from './user-skeleton.vue'
import type { focusPayloadType } from '@/stores/module/all-user/type'

const route = useRoute()
const router = useRouter()
const userStore = useUserShow()

const navList = [
  {
    label: '人气画师',
    value: 'hot'
  },
  {
    label: '最近活跃',
    value: 'active'
  },
  {
    label: '最新入驻',
    value: 'new'
  }
]
const isStopLoadMore = computed(
  () => userStore.isEnd || userStore.loading || userStore.maxPage > 25
)
const verifyQuery = (val: any) => {
  if (navList.findIndex((i) => i.value == val) == -1) return false
  return true
}
//请求数据
watch(
  () => route.query,
  (val) => {
    if (route.name != 'AllUserShow') return
    if (!verifyQuery(val.type)) {
      router.replace({ name: 'AllUserShow', query: { type: 'hot' } })
      return
    }
    userStore.maxPage = 0
    userStore.query.next = '0'
    userStore.query.type = val.type as 'hot' | 'new'
    userStore.users = []
    userStore.isEnd = false
    userStore.loading = false
    userStore.getUserShowAction()
  },
  { immediate: true }
)

const handleChoseNav = (val: string) => {
  router.push({ name: 'AllUserShow', query: { type: val } })
}

//发送关注作者请求
const postFocus = debounce((payload: focusPayloadType) => {
  //取消关注时 弹出提示
  if (payload.isFocus) {
    MessageBox({
      text: `是否取消关注 @${payload.userName} ?`
    }).then(() => {
      userStore.postUserFocusAction(payload)
    })
    return
  }
  userStore.postUserFocusAction(payload)
}, 300)

onUnmounted(() => {
  userStore.$reset()
})
</script>

<style scoped lang="less">
.user-show {
  width: 100%;
  background-color: var(--bgc);
  height: 100%;
}
.wrap {
  margin-top: 55px;
  padding: 65px 85px 100px 65px;
}
.header {
  display: flex;
  font-size: 18px;
  max-width: 1550px;
  margin: auto;
  .nav-item {
    margin-right: 30px;
    color: var(--color-text3);
    padding-bottom: 10px;
    transition: all 0s;
    cursor: pointer;
  }
}
.active {
  color: var(--color-text1) !important;
  font-weight: 500;
  border-bottom: 2px solid var(--primary-middle-color);
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

.about-user {
  max-width: 1550px;
  margin: 30px auto 0;
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
