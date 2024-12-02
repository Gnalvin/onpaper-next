<template>
  <div class="artwork" :key="refresh" ref="artworkEl">
    <div class="color-mask">
      <ul
        v-lazy-loading="loadArt"
        :lazy-loading-immediate="false"
        :lazy-loading-disabled="isCloseScroll"
        :lazy-loading-distance="500"
        :lazy-loading-delay="500"
      >
        <template v-for="(item, index) in artworkList" :key="item.fileName">
          <li class="artwork-item" v-if="item.isShow">
            <img
              v-show="!item.isLoading"
              class="small-img"
              :src="item.smallFile"
              @load="ProgressFn(index)"
              @error="item.isLoading = true"
            />
            <img
              style="cursor: pointer"
              v-show="item.isLoading && item.fileName"
              :src="item.fileName"
              @load="imgLoadSuccess(index)"
              @click="showLargePic(index)"
              @error="handleImgErr"
            />
            <div class="loading">
              <span>
                <svg width="50px" height="50px" viewBox="0 0 100 100">
                  <circle
                    r="25"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    stroke="#FFFFFF"
                    stroke-width="50"
                  ></circle>
                </svg>
              </span>
            </div>
          </li>
        </template>
      </ul>
      <div class="temp">
        <div class="temp-hover">
          <div class="like-bar" :style="showStyle">
            <div class="like" :title="interact.isLike ? '取消点赞' : '点赞'">
              <span :class="{ liked: interact.isLike }" @click="emits('like')">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div
              class="collect"
              :title="interact.isCollect ? '取消收藏' : '收藏'"
            >
              <span
                :class="{ collected: interact.isCollect }"
                @click="emits('collect')"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z"
                    stroke-width="4"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div class="share">
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 28.6292C26.5104 28.6292 28.5455 26.6004 28.5455 24.0979C28.5455 21.5954 26.5104 19.5667 24 19.5667C21.4897 19.5667 19.4546 21.5954 19.4546 24.0979C19.4546 26.6004 21.4897 28.6292 24 28.6292Z"
                    fill="none"
                    stroke-width="4"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16 15C10.6667 19.9706 10.6667 28.0294 16 33"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M32 33C37.3333 28.0294 37.3333 19.9706 32 15"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.85786 10C2.04738 17.7861 2.04738 30.4098 9.85786 38.1959"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M38.1421 38.1959C45.9526 30.4098 45.9526 17.7861 38.1421 10"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div class="show-more" v-if="isShowMore && artworkLen">
          <div class="more-wrap"></div>
          <ElButton class="btn" @click="showMore">查看全部图片</ElButton>
        </div>
      </div>
    </div>
  </div>
  <ImgView
    v-if="isShowImgLarge"
    :pic-list="artworkList"
    :index="showPicIndex"
    @close="showLargePic"
  ></ImgView>
</template>

<script setup lang="ts">
import { computed, ref, watch, reactive, type CSSProperties } from 'vue'
import useArtworkDetailStore from '@/stores/module/artwork-detail'
import ElButton from '@/components/button/el-button.vue'
import ImgView from '@/components/img-view/img-view.vue'
import { handleImgErr } from '@/utils/handle-img'
import { stopBodyScroll } from '@/utils/stopScroll'

const emits = defineEmits(['collect', 'like'])

const props = defineProps({
  scrollValue: {
    type: Number,
    required: true
  }
})

const artworkStore = useArtworkDetailStore()
// 图片列表
const artworkList = computed(() => artworkStore.artworks)
// 互动数据
const interact = computed(() => artworkStore.artInfo.interact)

// 每次切换作品 重置属性
const isCloseScroll = ref(true) // 是否可以开启懒加载列表 默认TRUE禁止
const refresh = ref(1) // 强制刷新组件避免 imgLoadSuccess 不能调用
watch(
  () => artworkStore.artInfo.artworkId,
  () => {
    refresh.value++
    isCloseScroll.value = true
    starNum = 1 // 用于 切割返回的 数组列表 懒加载时 starNum +=2
    isShowMore.value = true
  }
)
// 当作品超过一张时显示按钮 点击后允许显示更多开启懒加载
const artworkLen = computed(() => {
  return artworkList.value.length > 1
})
// 是否显示更多按钮
const isShowMore = ref(true)
const showMore = () => {
  isCloseScroll.value = false
  isShowMore.value = false
  loadArt()
}

//当清晰图片挂载完成 调用
const imgLoadSuccess = (index: number) => {
  // 当图片加载完成 100毫秒后显示清晰图片
  setTimeout(() => {
    // isLoading 为 true 表示加载完成 svg和模糊图 消失
    artworkList.value[index].isLoading = true
  }, 100)
}

let starNum = 1
// 懒加载触发的函数 每次获取五张
const loadArt = () => {
  for (let index = starNum; index < starNum + 5; index++) {
    //如果已经最后一张了 关闭滚动加载更多
    if (index >= artworkList.value.length) {
      isCloseScroll.value = true
      return
    }
    artworkList.value[index].isShow = true
  }
  starNum += 5
}

// 加载进度条函数
const ProgressFn = (index: number) => {
  //获取每个元素对应的 svg加载图片
  const artItemEL =
    document.querySelectorAll<HTMLElement>('.artwork-item')[index]
  const loadingEl = artItemEL.querySelectorAll<HTMLElement>('.loading')[0]
  const svgEl = loadingEl.getElementsByTagName('circle')[0]

  //初始进度
  let prog = 20
  // 每50毫秒 执行函数 随机修改 svg 的进度
  let timer = setInterval(function () {
    //显示 svg图片
    loadingEl.style.opacity = '1'
    // 当 这个元素还没有加载完成持续循环添加进度
    if (!artworkList.value[index].isLoading) {
      // 120 就停顿 等待
      if (prog > 120) return
      prog = prog + Math.random() * 5
      svgEl.setAttribute('stroke-dasharray', `${prog} 158`)
    } else {
      clearInterval(timer)
      loadingEl.style.opacity = '0'
      svgEl.setAttribute('stroke-dasharray', `158 158`)
    }
  }, 100)
}

//展示大图
const showPicIndex = ref(0)
const isShowImgLarge = ref(false)
const showLargePic = (index: number) => {
  showPicIndex.value = index
  isShowImgLarge.value = !isShowImgLarge.value
  stopBodyScroll(isShowImgLarge.value)
}

//是否显示 点赞栏 添加位移样式
const showStyle = reactive<CSSProperties>({
  transform: 'translateY(0%)',
  transition: 'transform 0.2s',
  backgroundColor: 'var(--bgc)'
})

const artworkEl = ref<Element>()
watch(
  () => props.scrollValue,
  (newValue, oldValue) => {
    //如果 还没有点击显示更多 就直接返回 不需要动态显示
    if (isShowMore.value) {
      return
    }
    //artwork 元素高度等于 likeBar位置
    const scrollHeight = artworkEl.value!.scrollHeight
    // 说明 窗口底部 到达了 likeBar距离
    if (newValue + document.body.clientHeight > scrollHeight - 50) {
      showStyle.transform = 'translateY(0%)'
      showStyle.transition = 'all 0.3s'
      showStyle.backgroundColor = 'var(--bgc)'
      return
    }
    if (newValue - oldValue > 0) {
      //向下滚不显示
      showStyle.transition = 'all 0.3s'
      showStyle.transform = 'translateY(100%)'
      showStyle.backgroundColor = 'var(--transparent-theme-color1)'
    } else {
      //向上滚显示
      showStyle.transition = 'all 0.3s'
      showStyle.transform = 'translateY(0%)'
      showStyle.backgroundColor = 'var(--transparent-theme-color1)'
    }
  }
)
</script>

<style scoped lang="less">
.color-mask {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--transparent-little-hover);
}
.artwork {
  margin: 0 50px;
  width: 100%;
  min-height: 70vh;
  border-radius: 5px 5px 0 0;
  background-color: var(--bgc);
  .artwork-item {
    min-height: 50vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding-top: 40px;
    img {
      width: 100%;
      object-fit: contain;
      max-height: calc(100vh - 50px - 10px);
    }
  }
  .artwork-item:first-child {
    padding-top: 0px;
  }
}

.small-img {
  filter: blur(4px);
}
.loading {
  position: absolute;
  top: 50%;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0.85;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid #fff;
  transform: rotate(-90deg);
  opacity: 0;
  span {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.show-more {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 48px;
  height: 100px;
  width: 100%;
  .btn {
    position: absolute;
    background-color: var(--color-text1);
    color: var(--bgc);
    border-radius: 16px;
    font-weight: 700;
    font-size: 13px;
    padding: 10px 22px;
    bottom: 25px;
    z-index: 1;
  }
  .more-wrap {
    z-index: -1;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    background-color: var(--bgc);
    mask-image: linear-gradient(
      transparent,
      rgb(255, 255, 255) 100%,
      rgb(255, 255, 255) 0px
    );
    -webkit-mask-image: linear-gradient(
      transparent,
      var(--bgc) 100%,
      var(--bgc) 0px
    );
  }
}
.temp {
  position: sticky;
  width: 100%;
  height: 48px;
  bottom: 0px;
  .temp-hover {
    height: 48px;
  }
  .temp-hover:hover {
    .like-bar {
      transform: translateY(0%) !important;
    }
  }
  .like-bar {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: 0px;
    bottom: 0px;
    padding: 8px 0;
    width: 100%;
    box-sizing: border-box;
    background-color: var(--bgc);
    div {
      margin-right: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      span {
        display: flex;
        align-items: center;
        svg {
          fill: none;
          stroke: var(--color-text1);
        }
      }
    }
    .liked {
      svg {
        fill: rgb(251, 52, 85);
        stroke: rgb(251, 52, 85);
      }
    }
    .collected {
      svg {
        fill: #ff9c33;
        stroke: #ff9c33;
      }
    }
  }
}

@media (max-width: 1400px) {
  .artwork {
    margin: 0 30px;
  }
}

@media (max-width: 1200px) {
  .artwork {
    min-height: 50vh;
  }
}
@media (min-width: 1200px) {
  .temp {
    height: 0px;
    .show-more {
      bottom: 0;
    }
    .like-bar {
      display: none !important;
    }
    .temp-hover {
      height: 0px;
    }
  }
}
</style>
