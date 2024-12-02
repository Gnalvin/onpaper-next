<template>
  <section class="details main-area">
    <div class="title">
      <div class="black" @click="handleBack">
        <span class="icon">
          <svg
            width="28"
            height="28"
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
        </span>

        返回
      </div>
      <div class="name">
        <span>{{ detailStore.trendDetail?.userName }}</span>
      </div>
    </div>
    <div
      v-if="detailStore.trendDetail?.whoSee === 'onlyFans' && !isFans"
      class="no-see"
    >
      动态仅粉丝可见
    </div>
    <div v-else-if="detailStore.isNoExist" class="no-see">
      动态已删除或不存在
    </div>
    <div v-else-if="detailStore.trendDetail">
      <TrendItem
        :trend-item="detailStore.trendDetail"
        @goToForward="goToForward"
        @like="handleLike"
        @delete="handleDelete"
        @update="handleUpdatePermission"
        :quick-reply="false"
      ></TrendItem>
      <CommentPart :cType="tType"></CommentPart>
    </div>
  </section>
  <section class="side-wrap">
    <div class="side">
      <UserPanel></UserPanel>
      <SuggestUser></SuggestUser>
      <IcpInfo></IcpInfo>
    </div>
  </section>
</template>

<script setup lang="ts">
import { watch, ref, onDeactivated, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { TrendItem } from '@/components/trend'
import UserPanel from '../cpns/user-panel.vue'
import SuggestUser from '../cpns/suggest-user.vue'
import useTrendStore from '@/stores/module/trend'
import useDetailStore from '@/stores/module/trend/detail'
import CommentPart from '../cpns/comment-part.vue'
import type { ITrend, IPermission } from '@/service/trend-page/type'
import IcpInfo from '../cpns/icp-info.vue'

const route = useRoute()
const router = useRouter()

const trendStore = useTrendStore()
const detailStore = useDetailStore()
const tType = ref<'aw' | 'tr'>('tr')
watch(
  () => route.params.trendId,
  async (trendId) => {
    if (route.name == 'trendDetail') {
      const userName = route.params.user as string
      tType.value = route.query.type as 'aw' | 'tr'
      // 先查询 详情再查询其他
      await detailStore.getTrendDetailAction(trendId as string, tType.value)
      // 没有查询到
      if (!detailStore.trendDetail) return
      const detailName = detailStore.trendDetail!.userName
      trendStore.getUserProfileAction(detailStore.trendDetail.userId)
      detailStore.getTrendCommentAction(trendId as string, tType.value)
      // 如果用户改了 地址导致名字不正确(对业务没啥影响)  改回来
      if (detailName !== userName) {
        router.replace({
          name: 'trendDetail',
          params: { trendId, user: detailName },
          query: { type: tType.value }
        })
      }
    }
  },
  { immediate: true }
)

const isFans = computed(
  () =>
    detailStore.trendDetail?.interact.isFocusAuthor ||
    detailStore.trendDetail?.isOwner
)

//跳转到动态详情
const goToForward = (trend: ITrend) => {
  router.push({
    name: 'trendDetail',
    params: {
      user: trend.userName,
      trendId: trend.trendId
    },
    query: {
      type: trend.type
    }
  })
}
//处理点赞
const handleLike = async (trend: ITrend) => {
  trendStore.postLikeAction(trend)
}

// 删除动态
const handleDelete = async (trendId: string) => {
  const res = await trendStore.deleteTrendAction(trendId)
  if (res.status === 200) {
    detailStore.$reset()
    detailStore.isNoExist = true
    //如果是从feed流里面进来的 feed流也删除
    for (let index = 0; index < trendStore.trends.length; index++) {
      const item = trendStore.trends[index]
      if (item.trendId === res.data.trendId) {
        trendStore.trends.splice(index, 1)
        break
      }
    }
  }
}

// 更新权限
const handleUpdatePermission = async (data: IPermission) => {
  const res = await trendStore.updatePermissionAction(data)
  if (res.status == 200) {
    const trend = trendStore.trends.find((i) => i.trendId === data.trendId)
    const { comment, whoSee } = data
    if (trend) {
      trend.comment = comment
      trend.whoSee = whoSee
    }
    detailStore.trendDetail!.comment = comment
    detailStore.trendDetail!.whoSee = whoSee
  }
}

onDeactivated(() => {
  detailStore.$reset()
})
const handleBack = () => {
  router.back()
}
</script>

<style scoped lang="less">
@import '../css/common.less';
.details {
  border-radius: 5px;
  background-color: var(--surface-color4);
}

.title {
  position: sticky;
  top: 55px;
  display: flex;
  font-size: 18px;
  height: 50px;
  align-items: center;
  background-color: var(--surface-color4);
  z-index: 99;
  border-radius: 5px;
  .black {
    position: absolute;
    display: flex;
    align-items: center;
    font-weight: 700;
    cursor: pointer;
    .icon {
      display: flex;
    }
    svg {
      stroke: var(--color-regular);
    }
  }
  .name {
    font-weight: 400;
    flex: 1;
    display: flex;
    justify-content: center;
  }
}
.no-see {
  padding: 90px 20px;
  text-align: center;
  font-size: 18px;
}
</style>
