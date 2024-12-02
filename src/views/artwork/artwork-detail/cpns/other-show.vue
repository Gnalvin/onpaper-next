<template>
  <div class="other-art" v-if="!isShowCpn">
    <div class="title">
      <span>其他作品</span>
      <router-link
        v-if="userId"
        :to="{
          name: 'userHome',
          params: { userId }
        }"
        target="_blank"
      >
        <span class="to-home">TA的主页</span>
      </router-link>
    </div>
    <div class="other-body">
      <template v-for="(item, index) in authorSmallShow" :key="item.artworkId">
        <div class="otherShow" :class="{ nowPic: index === 1 }">
          <router-link
            draggable="false"
            v-if="item.artworkId"
            :to="{
              name: 'ArtworkDetail',
              params: { artId: item.artworkId }
            }"
          >
            <img
              draggable="false"
              v-show="item.cover"
              :src="item.cover"
              alt=""
              @error="handleImgErr"
              title="当前图片"
            />
            <div :class="{ mask: index != 1 }">
              <span v-if="index === 0" title="上一张">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"
                    fill="rgba(255,255,255,1)"
                  />
                </svg>
              </span>
              <span v-if="index === 2" title="下一张">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"
                    fill="rgba(255,255,255,1)"
                  />
                </svg>
              </span>
            </div>
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useArtworkDetailStore from '@/stores/module/artwork-detail'
import { formatPicUrl } from '@/utils/data-format'
import { handleImgErr } from '@/utils/handle-img'

const artworkStore = useArtworkDetailStore()
const userId = computed(() => artworkStore.artInfo.userId)
const artId = computed(() => artworkStore.artInfo.artworkId)

const authorSmallShow = computed(() => {
  const artList = artworkStore.authorOtherArt
  // 查找当前的作品 所在排序的位置
  let index = artList.findIndex((item) => {
    return item.artworkId === artId.value
  })
  if (index === -1) {
    let { artworkId, cover, userId } = artworkStore.artInfo
    artList.unshift({
      artworkId,
      cover: formatPicUrl(cover, userId, 'cover', 'm')
    })
    index = 0
  }

  // 作品个数
  const artCount = artList.length
  // 如果当前作品是 第一张
  if (index === 0) {
    if (artCount === 1) return ['', artList[0], '']
    let resList: any = artList.slice(0, 2)
    resList = ['', ...resList]
    return resList
  }
  //如果作品数 是最后一张
  if (artCount === index + 1) {
    let resList: any = artList.slice(index - 1, index + 1)
    resList = [...resList, '']
    return resList
  }
  // 作品数大于两个 且不是第一张和最后一张
  return artList.slice(index - 1, index + 2)
})

//如果只有一个作品不展示
const isShowCpn = computed(() => {
  const last = authorSmallShow.value.length - 1
  return authorSmallShow.value[0] === '' && authorSmallShow.value[last] === ''
})
</script>

<style scoped lang="less">
.other-art {
  .title {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    line-height: 12px;
    font-size: 12px;
    font-weight: 700;
    .to-home {
      color: #ff8200;
      cursor: pointer;
      font-weight: 400;
    }
  }
  .other-body {
    display: flex;
    justify-content: center;
    border: 1px solid transparent;
    .mask {
      position: absolute;
      inset: 0px;
      opacity: 0;
      background: rgba(0, 0, 0, 0.35);
      transition: opacity 0.2s ease 0s;
      span {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
    }
    .mask:hover {
      opacity: 1;
    }
    .otherShow {
      flex: 1;
      position: relative;
      margin: 0 5px;
      border-radius: 8px;
      overflow: hidden;
      width: 101px;
      height: 101px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .otherShow::before {
      content: '';
      position: absolute;
      background-color: rgba(0, 0, 0, 0.02);
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }
  }
}
.nowPic {
  a {
    cursor: default;
  }
  img {
    opacity: 0.3;
  }
}
</style>
