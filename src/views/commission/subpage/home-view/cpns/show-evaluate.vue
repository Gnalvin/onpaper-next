<template>
  <div class="evaluate top-mask-layer" @mousedown.self="$emit('close')">
    <div class="container">
      <div class="title">
        <span
          v-for="item in nav"
          :key="item.val"
          @click="chose = item.val"
          :class="{ chose: item.val === chose }"
        >
          {{ item.label }}
        </span>
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
      <template v-if="evaluate">
        <div class="user-info">
          <AvatarItem
            :width="45"
            :height="45"
            :user-id="userInfo?.userId"
            :file-name="userInfo?.avatar"
            :go-to-commission="true"
            :openNew="true"
          ></AvatarItem>
          <span class="username one-line">{{ userInfo?.userName }}</span>
        </div>
        <div class="rate">
          <div class="item">
            <span class="text">
              {{ chose === 'sender' ? '付款及时' : '准时交稿' }}
            </span>
            <el-rate
              :model-value="evaluate.rate1"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value} 分"
            />
          </div>
          <div class="item">
            <span class="text">
              {{ chose === 'sender' ? '反馈及时' : '沟通能力' }}
            </span>
            <el-rate
              :model-value="evaluate.rate2"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value} 分"
            />
          </div>
          <div class="item">
            <span class="text">
              {{ chose === 'sender' ? '需求明确' : '作品质量' }}
            </span>
            <el-rate
              :model-value="evaluate.rate3"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value} 分"
            />
          </div>
        </div>
        <div class="describe">
          <div class="tip">
            {{ chose === 'sender' ? '画师' : '企划方' }}对Ta的评价 :
          </div>
          <span>{{ evaluate.text }}</span>
        </div>
      </template>
      <template v-else>
        <div class="no-have">评价已删除或暂时没有收到评价</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import useDetailStore from '@/stores/module/commission/detail'
import { AvatarItem } from '@/components/avatar'
import type { IShowEvaluate } from '@/service/commission/type'

const props = defineProps({
  info: {
    type: Object as PropType<IShowEvaluate[]>,
    required: true
  }
})
defineEmits(['close'])

const detailStore = useDetailStore()

const nav = [
  { val: 'artist', label: '画师' },
  { val: 'sender', label: '企划方' }
]
const chose = ref('artist')

const evaluate = computed(() => {
  if (chose.value === 'artist') {
    return props.info.find((i) => i.inviteOwn == i.sender)
  } else {
    return props.info.find((i) => i.inviteOwn != i.sender)
  }
})
const userInfo = computed(() => {
  if (chose.value === 'artist') {
    return detailStore.planDetail?.artist
  } else {
    return detailStore.planDetail?.sender
  }
})
</script>

<style scoped lang="less">
.evaluate {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 280px;
  height: 420px;
  background-color: var(--surface-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  border: 1px solid var(--border-color1);
  border-radius: 8px;
  padding: 0px 30px 20px;
  overflow-y: auto;
}
.title {
  position: sticky;
  z-index: 1;
  background-color: var(--surface-color1);
  top: 0px;
  font-size: 17px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 22px;
  padding: 20px 0 5px;
  span {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0s;
    padding: 10px 15px;
    border-bottom: 2px solid transparent;
  }
  .close {
    position: absolute;
    right: -35px;
    top: 0px;
    cursor: pointer;
    svg {
      fill: var(--color-text1);
    }
  }
}
.user-info {
  display: flex;
  align-items: center;
  .username {
    font-size: 16px;
    font-weight: 500;
    margin-left: 10px;
  }
}
.rate {
  margin-top: 15px;
  .item {
    display: flex;
    align-items: center;
    .text {
      margin-right: 10px;
    }
  }
}
.describe {
  padding: 15px 0 10px;
  line-height: 1.8;
  color: var(--color-text1);
  .tip {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text5);
    margin-bottom: 7px;
  }
}
.chose {
  color: var(--color-text1);
  font-weight: 700;
  border-bottom: 2px solid var(--primary-middle-color) !important;
}
.no-have {
  text-align: center;
  padding-top: 70px;
  font-size: 15px;
}
</style>
