<template>
  <div class="setting-panel" ref="panelEl">
    <div class="item" @click="handleCopyUrl">复制动态地址</div>
    <div class="item" v-if="type == 'aw'" @click="handleGotoAw">前往作品页</div>
    <div
      class="item"
      v-if="isOwner && type !== 'aw'"
      @click="$emit('permission')"
    >
      权限设置
    </div>
    <div class="item" v-if="isOwner && type != 'aw'" @click="$emit('delete')">
      删除动态
    </div>
    <div class="item" v-if="!isOwner" @click="$emit('report')">举报</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import useMainStore from '@/stores/module/main'
import { TipBox } from '@/components/message-box'
import { copyText } from '@/utils/system'
import { clickOtherClose } from '@/hooks/click-close'

const emits = defineEmits(['close', 'delete', 'permission', 'report'])
const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  trendId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})
const router = useRouter()
const mainStore = useMainStore()

const panelEl = ref<HTMLDivElement>()
clickOtherClose(panelEl, () => emits('close'))

const isOwner = computed(() => props.userId == mainStore.userId)

const handleCopyUrl = () => {
  const url = router.resolve({
    name: 'trendDetail',
    params: {
      user: props.userName,
      trendId: props.trendId
    },
    query: {
      type: props.type
    }
  })
  copyText('http://' + window.location.host + url.href)
  TipBox({ text: '复制成功' })
}

const handleGotoAw = () => {
  const url = router.resolve({
    name: 'ArtworkDetail',
    params: { artId: props.trendId }
  })
  window.open(url.href, '_blank')
}
</script>

<style scoped lang="less">
.setting-panel {
  position: absolute;
  z-index: 999;
  background-color: var(--surface-color4);
  border-radius: 8px;
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  right: 5px;
  top: 25px;
  .item {
    padding: 13px 20px;
    white-space: nowrap;
    &:hover {
      background-color: var(--bgc-chose-color);
    }
  }
}
</style>
