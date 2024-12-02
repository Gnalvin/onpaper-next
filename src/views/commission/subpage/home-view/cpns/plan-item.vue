<template>
  <div class="plan" @click="$emit('goToDetail', plan.inviteId)">
    <div class="header">
      <div class="content">
        <div class="title one-line">{{ plan.name }}</div>
        <div class="intro one-line">{{ plan.intro }}</div>
      </div>
      <div class="pic" v-if="plan.fileList.length">
        <img :src="plan.fileList[0].fileName" alt="" />
      </div>
    </div>
    <div class="footer">
      <div class="left">
        <div class="item">
          <svg
            v-if="plan.status == 0"
            width="14"
            height="14"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 4H41" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 44H41" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M11 44C13.6667 30.6611 18 23.9944 24 24C30 24.0056 34.3333 30.6722 37 44H11Z"
              fill="none"
              stroke-linejoin="round"
            />
            <path
              d="M37 4C34.3333 17.3389 30 24.0056 24 24C18 23.9944 13.6667 17.3278 11 4H37Z"
              fill="none"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else-if="plan.status === 1"
            width="15"
            height="15"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M44 6H4V36H13V41L23 36H44V6Z"
              fill="none"
              stroke="#409eff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 19.5V22.5"
              stroke="#409eff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M24 19.5V22.5"
              stroke="#409eff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M34 19.5V22.5"
              stroke="#409eff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else-if="plan.status == 2"
            width="15"
            height="15"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 4H37L26 18H41L17 44L22 25H8L19 4Z"
              fill="#30d288"
              stroke="#30d288"
              stroke-width="4"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else-if="plan.needEvaluate"
            width="15"
            height="15"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36 35H12V21C12 14.3726 17.3726 9 24 9C30.6274 9 36 14.3726 36 21V35Z"
              fill="none"
              stroke="#cc3333"
              stroke-width="4"
              stroke-linejoin="round"
            />
            <path
              d="M8 42H40"
              stroke="#cc3333"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 13L7 14"
              stroke="#cc3333"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13 3.9999L14 6.9999"
              stroke="#cc3333"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.0001 9.99989L7.00009 6.99989"
              stroke="#cc3333"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else-if="plan.status == 3"
            width="15"
            height="15"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.8712 33.0437L15.9976 44.7037C15.9362 45.5231 16.6646 46.0874 17.3161 45.7222C21.9289 43.1384 36.3783 33.6481 43.7017 12.7901C44.0376 11.8333 43.1352 10.9699 42.3646 11.5096C38.0387 14.5391 28.5846 20.8008 22.7421 21.9935C22.7421 21.9935 26.4836 19.3948 28.7231 15.4055C28.9426 15.0144 28.9244 14.5138 28.6796 14.1608L20.5127 2.38942C20.0287 1.69163 19.0354 1.98074 18.8606 2.87019L16.3181 15.8074L4.38437 26.2228C3.78602 26.7448 3.90808 27.7998 4.5989 28.0792L16.8712 33.0437Z"
              fill="#f5a623"
              stroke="none"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M37.9745 28.4481C37.2188 29.5026 35.5908 31.6718 34.0876 32.9975C33.7871 33.2625 33.8276 33.707 34.1724 33.9235L42.1145 38.9092C42.5926 39.2092 43.2384 38.853 43.1576 38.3325C42.7882 35.9498 41.7237 30.982 39.0328 28.3743C38.7322 28.0832 38.2142 28.1138 37.9745 28.4481Z"
              fill="#f5a623"
              stroke="none"
            />
          </svg>
          <svg
            v-else-if="plan.status < 0"
            width="15"
            height="15"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 14L34 34"
              stroke="#d0021b"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 34L34 14"
              stroke="#d0021b"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span
            :class="{
              talk: plan.status === 1,
              ing: plan.status === 2,
              over: plan.status === 3,
              close: plan.status < 0,
              need: plan.needEvaluate
            }"
          >
            {{ status }}</span
          >
        </div>
        <div class="item" style="width: 100px">
          <svg
            width="15"
            height="15"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.9998 44.3332C34.1251 44.3332 42.3332 36.1251 42.3332 25.9999C42.3332 15.8747 34.1251 7.66656 23.9998 7.66656C13.8746 7.66656 5.6665 15.8747 5.6665 25.9999C5.6665 36.1251 13.8746 44.3332 23.9998 44.3332Z"
              fill="none"
              stroke-linejoin="round"
            />
            <path
              d="M23.7594 15.3536L23.7582 26.3624L31.5305 34.1347"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 9.00001L11 4.00001"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M44 9.00001L37 4.00001"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ plan.date }}
        </div>
        <div class="item" style="width: 72px">
          <svg
            width="15"
            height="15"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42.1691 29.2451L29.2631 42.1511C28.5879 42.8271 27.6716 43.2069 26.7161 43.2069C25.7606 43.2069 24.8444 42.8271 24.1691 42.1511L8 26V8H26L42.1691 24.1691C43.5649 25.5732 43.5649 27.841 42.1691 29.2451Z"
              fill="none"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18.5 21C19.8807 21 21 19.8807 21 18.5C21 17.1193 19.8807 16 18.5 16C17.1193 16 16 17.1193 16 18.5C16 19.8807 17.1193 21 18.5 21Z"
              fill="#ffffff"
            />
          </svg>
          {{ plan.category }}
        </div>
      </div>
      <div class="money">¥ {{ plan.money }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { IPlanCard } from '@/service/commission/type'

defineEmits(['goToDetail'])

const props = defineProps({
  plan: {
    type: Object as PropType<IPlanCard>,
    required: true
  }
})

const status = computed(() => {
  switch (props.plan.status) {
    case 0:
      return '待接受'
    case 1:
      return '沟通中'
    case 2:
      return '创作中'
    case 3:
      if (props.plan.needEvaluate) return '待评价'
      return '完成'
    case -2:
      if (props.plan.needEvaluate) return '待评价'
      return '终止'
    default:
      return '关闭'
  }
})
</script>

<style scoped lang="less">
.plan {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  padding: 20px 20px;
  margin: 5px;
  user-select: none;
  cursor: pointer;
  background-color: var(--surface-color4);
  &:hover {
    transition: box-shadow 0.5s;
    box-shadow: 0 1px 3px var(--transparent-hover),
      0 3px 7px var(--transparent-hover);
  }
}
.header {
  flex: 1;
  display: flex;
  justify-content: space-between;
  .pic {
    position: relative;
    img {
      width: 90px;
      height: 90px;
      border-radius: 5px;
      object-fit: cover;
    }
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.02);
      pointer-events: none;
      z-index: 1;
      border-radius: 5px;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 10px;
    .title {
      color: var(--color-text1);
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    .intro {
      color: var(--color-text2);
      font-size: 13px;
      line-height: 1.6;
      -webkit-line-clamp: 2;
    }
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--transparent-hover);
  .left {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    overflow: hidden;
    max-height: 15px;
    justify-content: flex-end;
    .item {
      display: flex;
      margin-right: 18px;
      font-size: 13px;
      color: var(--color-text3);
      svg {
        stroke: var(--color-text3);
        stroke-width: 4;
        margin-right: 5px;
      }
    }
    .talk {
      color: #409eff;
    }
    .ing {
      color: #30d288;
    }
    .over {
      color: #f5a623;
    }
    .close {
      color: #d0021b;
    }
    .need {
      color: #cc3333 !important;
      font-weight: 600;
    }
  }
  .money {
    text-align: right;
    font-weight: bold;
    color: #ff83a4;
    flex-shrink: 0;
    width: 103px;
  }
}
</style>
