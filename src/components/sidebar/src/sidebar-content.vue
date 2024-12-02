<template>
  <div class="sidebar-content" :class="{ 'small-style': barStyle === 'small' }">
    <div class="item" @click="emits('clickItem')">
      <RouterLink :to="{ name: 'mainHome' }">
        <span class="icon">
          <svg
            class="home-icon"
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18V42H39V18L24 6L9 18Z"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19 29V42H29V29H19Z"
              stroke-width="3"
              stroke-linejoin="round"
            />
            <path d="M9 42H39" stroke-width="4" stroke-linecap="round" />
          </svg>
        </span>
        <span>首页</span>
      </RouterLink>
    </div>
    <div class="item" @click="emits('clickItem')">
      <RouterLink :to="{ name: 'homeFocus' }">
        <span class="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.8579 9.85803C7.23858 13.4773 5 18.4773 5 24.0002C5 29.523 7.23858 34.523 10.8579 38.1423"
              fill="none"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M39.1421 38.1423C42.7614 34.523 45 29.523 45 24.0002C45 18.4773 42.7614 13.4773 39.1421 9.85803"
              fill="none"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M34.8994 33.8997C37.4329 31.3662 38.9999 27.8662 38.9999 24.0002C38.9999 20.1342 37.4329 16.6342 34.8994 14.1007"
              fill="none"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M15.1005 14.1007C12.567 16.6342 11 20.1342 11 24.0002C11 27.8662 12.567 31.3662 15.1005 33.8997"
              fill="none"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M28.1818 20C30.2905 20 32 21.6118 32 23.6C32 26.1882 29.4545 28.4 28.1818 29.6C27.3333 30.4 26.2727 31.2 25 32C23.7273 31.2 22.6667 30.4 21.8182 29.6C20.5455 28.4 18 26.1882 18 23.6C18 21.6118 19.7095 20 21.8182 20C23.1463 20 24.316 20.6393 25 21.6093C25.684 20.6393 26.8537 20 28.1818 20Z"
              stroke-width="3"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span v-if="barStyle == 'big'">关注的人</span>
        <span v-else>关注</span>
      </RouterLink>
    </div>
    <div class="item" @click="emits('clickItem')">
      <RouterLink :to="{ name: 'homeCollect' }">
        <span class="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z"
              stroke-width="3"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span v-if="barStyle == 'big'">收藏作品</span>
        <span v-else>收藏</span>
      </RouterLink>
    </div>
    <div class="item" @click="emits('clickItem')">
      <RouterLink :to="{ name: 'RankPage' }">
        <span class="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 42H35L41 21L31 26L24 12L17 26L7 21L13 42Z"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="7" cy="18" r="3" stroke-width="4" />
            <circle cx="24" cy="9" r="3" stroke-width="4" />
            <circle cx="41" cy="18" r="3" stroke-width="4" />
          </svg>
        </span>
        <span v-if="barStyle == 'big'">排行榜单</span>
        <span v-else>排行</span>
      </RouterLink>
    </div>
    <div class="item border" @click="emits('clickItem')">
      <RouterLink :to="{ name: 'homeDiscover' }">
        <span class="icon">
          <svg
            class="discover-icon"
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 20C40 26.8077 35.7484 32.6224 29.7555 34.9336H24H18.2445C12.2516 32.6224 8 26.8077 8 20C8 11.1634 15.1634 4 24 4C32.8366 4 40 11.1634 40 20Z"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M29.7557 34.9336L29.0766 43.0831C29.0334 43.6014 28.6001 44 28.08 44H19.9203C19.4002 44 18.9669 43.6014 18.9238 43.0831L18.2446 34.9336"
              fill="none"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18 17V23L24 20L30 23V17"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span v-if="barStyle == 'big'">发现更多作品</span>
        <span v-else>发现</span>
      </RouterLink>
    </div>
    <!-- <div class="item border" @click="emits('clickItem')">
      <RouterLink :to="{ name: 'RankPage' }">
        <span class="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 20C27.866 20 31 16.866 31 13C31 9.13401 27.866 6 24 6C20.134 6 17 9.13401 17 13C17 16.866 20.134 20 24 20Z"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 7.25488C10.1865 8.51983 9 10.6214 9 13.0002C9 15.5465 10.3596 17.7753 12.3924 19.0002"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M36 7.25488C37.8135 8.51983 39 10.6214 39 13.0002C39 15.3789 37.8135 17.4806 36 18.7455"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 40V42H36V40C36 36.2725 36 34.4087 35.391 32.9385C34.5791 30.9783 33.0217 29.4209 31.0615 28.609C29.5913 28 27.7275 28 24 28C20.2725 28 18.4087 28 16.9385 28.609C14.9783 29.4209 13.4209 30.9783 12.609 32.9385C12 34.4087 12 36.2725 12 40Z"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M43.9999 42.0001V40.8001C43.9999 36.3197 43.9999 34.0795 43.128 32.3682C42.361 30.8629 41.1371 29.6391 39.6318 28.8721"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.00009 42.0001V40.8001C4.00009 36.3197 4.00009 34.0795 4.87204 32.3682C5.63902 30.8629 6.86287 29.6391 8.36816 28.8721"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span v-if="barStyle == 'big'">画师推荐</span>
        <span v-else>画师</span>
      </RouterLink>
    </div> -->
    <div class="item" @click="emits('clickItem')" v-if="mainStore.userId">
      <RouterLink
        :to="{ name: 'CommissionHome', params: { userId: mainStore.userId } }"
      >
        <span class="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M41 44V20H7V44H41Z"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
            />
            <path
              d="M24 44V20"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
            />
            <path
              d="M41 44H7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
            />
            <rect
              x="4"
              y="12"
              width="40"
              height="8"
              fill="none"
              stroke-width="3"
              stroke-linejoin="round"
            />
            <path
              d="M16 4L24 12L32 4"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span v-if="barStyle == 'big'">我的约稿</span>
        <span v-else>约稿</span>
      </RouterLink>
    </div>
    <div class="item" @click="emits('clickItem')">
      <RouterLink :to="{ name: 'trendPage', query: { mode: trendQuery } }">
        <span class="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 44C32.2347 44 38.9998 37.4742 38.9998 29.0981C38.9998 27.0418 38.8953 24.8375 37.7555 21.4116C36.6157 17.9858 36.3861 17.5436 35.1809 15.4279C34.666 19.7454 31.911 21.5448 31.2111 22.0826C31.2111 21.5231 29.5445 15.3359 27.0176 11.6339C24.537 8 21.1634 5.61592 19.1853 4C19.1853 7.06977 18.3219 11.6339 17.0854 13.9594C15.8489 16.2849 15.6167 16.3696 14.0722 18.1002C12.5278 19.8308 11.8189 20.3653 10.5274 22.4651C9.23596 24.565 9 27.3618 9 29.4181C9 37.7942 15.7653 44 24 44Z"
              stroke-width="3"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span v-if="barStyle == 'big'">热门动态</span>
        <span v-else>动态</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import useMainStore from '@/stores/module/main'
const emits = defineEmits(['clickItem'])
defineProps({
  barStyle: {
    type: String as PropType<'big' | 'small'>,
    default: 'big'
  }
})
const mainStore = useMainStore()
const trendQuery = computed(() => (mainStore.userId ? 'focus' : 'hot'))
</script>

<style scoped lang="less">
.sidebar-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 17px;
  .item {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    a {
      height: 48px;
      margin: 5px 25px 5px 10px;
      padding: 0 15px;
      border-radius: 30px;
      flex: 1;
      display: flex;
      align-items: center;
      color: var(--color-regular);
      .icon {
        margin-right: 15px;
        transition: scale 0.3s ease;
        svg {
          stroke: var(--color-text1);
        }
      }
      &:hover {
        background-color: var(--surface-color1-hover);
        .icon {
          scale: 1.2;
        }
      }
    }
  }
  .border {
    margin-bottom: 5px;
    padding-bottom: 5px;
    &::after {
      content: '';
      position: absolute;
      width: 85%;
      bottom: 0;
      border-top: 1px solid var(--border-color1);
    }
  }
}
.router-link-exact-active {
  font-weight: 600;
  font-size: 17px;
  color: var(--color-text1) !important;
  .icon {
    scale: 1.15;
    svg {
      fill: var(--color-text1);
    }
    .discover-icon {
      path:last-child {
        stroke: var(--bgc);
      }
    }
    .home-icon {
      path:nth-child(2) {
        stroke: var(--bgc) !important;
        fill: var(--bgc) !important;
      }
    }
  }
}

.small-style {
  font-size: 13px;
  .router-link-exact-active {
    font-size: 13px;
  }
  .item {
    margin: 5px 0;
    a {
      flex-direction: column;
      border-radius: 10px;
      height: auto;
      padding-bottom: 2px;
      .icon {
        margin: 5px 0 3px 0;
      }
    }
  }
  .border {
    &::before {
      border-top: transparent;
    }
  }
}
</style>
