<template>
  <div class="artwork-bottom">
    <div class="container">
      <div class="title-report">
        <div class="title">{{ artInfo.title }}</div>
        <span class="report" v-if="!isOwner" @click="handleShowReport"
          ><svg
            width="14"
            height="14"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36 35H12V21C12 14.3726 17.3726 9 24 9C30.6274 9 36 14.3726 36 21V35Z"
              fill="none"
              stroke-width="4"
              stroke-linejoin="round"
            />
            <path
              d="M8 42H40"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 13L7 14"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13 3.9999L14 6.9999"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.0001 9.99989L7.00009 6.99989"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          举报
        </span>
      </div>
      <div class="intro" v-if="artInfo.intro">{{ artInfo.intro }}</div>
      <div class="tag-list">
        <span class="zone">
          <RouterLink
            :to="{
              name: 'ArtworkPage',
              query: { zone: artInfo.zone, sort: 'hot' }
            }"
          >
            {{ artInfo.zone }}
          </RouterLink>
        </span>
        <template v-for="item in artInfo.tag" :key="item.tagId">
          <span class="tag">
            <RouterLink
              :to="{
                name: 'TagPage',
                params: { tagName: item.tagName },
                query: { query: item.tagId }
              }"
            >
              #{{ item.tagName }}#
            </RouterLink>
          </span>
        </template>
      </div>
      <div class="count">
        <span class="item">
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ $filters.formatNum(artInfo.likes) }}
        </span>
        <span class="item">
          <svg
            width="18"
            height="18"
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
          {{ $filters.formatNum(artInfo.collects) }}
        </span>
        <span class="item views">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 96 960 960"
            width="18"
            height="18"
          >
            <path
              d="M480 736q75 0 127.5-52.5T660 556q0-75-52.5-127.5T480 376q-75 0-127.5 52.5T300 556q0 75 52.5 127.5T480 736Zm0-72q-45 0-76.5-31.5T372 556q0-45 31.5-76.5T480 448q45 0 76.5 31.5T588 556q0 45-31.5 76.5T480 664Zm0 192q-146 0-266-81.5T40 556q54-137 174-218.5T480 256q146 0 266 81.5T920 556q-54 137-174 218.5T480 856Z"
            />
          </svg>
          {{ $filters.formatNum(artInfo.views) }}
        </span>
      </div>
      <div class="copyright-time">
        <div class="copyright">
          <Copyright :copyright="artInfo.copyright"></Copyright>
        </div>
        <div class="time">
          {{
            $filters.formatTime(artInfo.createAT, 'YYYY年MM月DD日 HH时mm分', 0)
          }}
        </div>
      </div>
      <div class="other-artwork">
        <div
          class="user"
          v-if="otherArt.length || artworkStore.windowSize < 1200"
        >
          <AvatarItem
            class="avatar"
            :userId="userId"
            :img-url="avatar"
          ></AvatarItem>
          <div class="name">
            <router-link
              v-if="userId"
              :to="{
                name: 'userHome',
                params: { userId }
              }"
            >
              {{ userName }}
            </router-link>
            <VTag :v-status="artInfo.vStatus" style="margin-left: 5px"></VTag>
          </div>
          <div class="is-focus" v-if="!isOwner" @click="emits('focus')">
            <ElButton class="btn focused" v-if="interact.isFocusAuthor">
              {{ interact.isFocusAuthor == 1 ? '已关注' : '相互关注' }}
            </ElButton>
            <ElButton class="btn focus" v-else>
              <span>
                <svg
                  t="1640765563982"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5755"
                  width="10"
                  height="10"
                >
                  <path
                    d="M925.696 384q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-287.744 0 0 287.744q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-287.744-287.744 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68l287.744 0 0-287.744q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68q39.936 0 68.096 28.16t28.16 68.096l0 287.744 287.744 0z"
                    p-id="5756"
                    fill="#fff"
                  ></path>
                </svg>
              </span>
              <span>关注</span>
            </ElButton>
          </div>
          <div
            class="edit"
            v-else-if="artworkStore.windowSize < 1200"
            @click="emits('showEdit')"
          >
            <ElButton class="btn" v-if="interact.isFocusAuthor">
              编辑作品
            </ElButton>
          </div>
        </div>
        <div class="artwork" v-if="otherArt.length">
          <SlideShow :array-item="otherArt" :item-key="'artworkId'">
            <template v-slot:default="slotProps">
              <SquareArtItem
                :item-style="{ width: '180px' }"
                :artwork-item="slotProps.item"
                :is-show-time="false"
                :isShowUser="false"
                :open-new="false"
              ></SquareArtItem>
            </template>
          </SlideShow>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useArtworkDetailStore from '@/stores/module/artwork-detail'
import useMainStore from '@/stores/module/main'
import ElButton from '@/components/button/el-button.vue'
import SlideShow from '@/components/slide-show/slide-show.vue'
import { SquareArtItem } from '@/components/artwork-item'
import { AvatarItem, VTag } from '@/components/avatar'
import { ReportPanel } from '@/components/report'
import Copyright from './copyright-icon.vue'

const emits = defineEmits(['focus', 'showEdit'])

const mainStore = useMainStore()
const artworkStore = useArtworkDetailStore()

// 作品相关信息
const userName = computed(() => artworkStore.artInfo.userName)
const userId = computed(() => artworkStore.artInfo.userId)
const avatar = computed(() => artworkStore.artInfo.avatarName)
const otherArt = computed(() => {
  // 去掉当前作品
  return artworkStore.authorOtherArt.filter((item) => {
    return item.artworkId !== artworkStore.artInfo.artworkId
  })
})
const artInfo = computed(() => artworkStore.artInfo)
const interact = computed(() => artworkStore.artInfo.interact)
const isOwner = computed(() => artworkStore.artInfo.isOwner)

const handleShowReport = () => {
  if (!mainStore.verifyIsLogin()) return
  ReportPanel({
    msgId: artworkStore.artInfo.artworkId,
    msgType: 'aw',
    defendant: userId.value
  })
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  margin: 0 50px;
  background-color: var(--bgc);
  .title-report {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 50px;
    .title {
      position: relative;

      font-size: 20px;
      line-height: 24px;
      font-weight: bold;
      color: var(--color-text1);
    }
    .report {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 13px;
      color: var(--color-text3);
      svg {
        margin-right: 2px;
        stroke: var(--color-text3);
      }
    }
  }

  .intro {
    margin: 20px 50px 5px;
    font-size: 14px;
    line-height: 26px;
    padding-right: 10px;
    word-break: break-all;
    white-space: pre-line;
    font-weight: 400;
  }
}
.tag-list {
  margin: 10px 50px 10px;
  span {
    white-space: nowrap;
    display: inline-block;
    margin-top: 7px;
    a {
      font-size: 16px;
      color: var(--primary-middle-color);
      margin-right: 15px;
      font-weight: 500;
    }
  }
}
.count {
  margin: 15px 50px 0 30px;
  color: var(--color-text2);
  .item {
    display: inline-flex;
    align-items: center;
    margin-left: 20px;
    font-weight: 500;
    svg {
      margin-right: 5px;
      stroke: var(--color-text2);
      fill: var(--color-text2);
    }
  }
}
.copyright-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 25px 50px 0;
  .copyright {
    display: flex;
    align-items: center;
  }
  .time {
    color: var(--color-text3);
    font-size: 12px;
    font-weight: 500;
    margin-left: 20px;
  }
}

.other-artwork {
  margin: 30px 0 10px;
}
.artwork {
  margin: 15px 40px 0 40px;
  min-height: 50px;
}
.user {
  display: flex;
  align-items: center;
  padding: 0 50px;
  height: 50px;
  .avatar {
    margin-right: 10px;
  }
  .name {
    display: flex;
    font-weight: bold;
    color: rgb(21, 21, 21);
    margin-left: 5px;
  }
  .is-focus {
    margin-left: 15px;
    .focused {
      color: var(--color-regular);
      background-color: var(--btn-cancel-color);
    }
    .focused:hover {
      background-color: var(--btn-cancel-hover-color);
    }
  }
  .btn {
    padding: 8px 20px;
    svg {
      margin-right: 5px;
    }
  }
}
@media (max-width: 1400px) {
  .container {
    margin: 0 30px;
  }
}

@media (min-width: 1200px) {
  .intro {
    display: none;
  }
}
</style>
