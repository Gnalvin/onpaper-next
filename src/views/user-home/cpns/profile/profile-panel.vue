<template>
  <Teleport to="body">
    <Transition appear>
      <div class="top-mask-layer" v-if="isShowPanel" @click.self="handleClose">
        <div class="panel">
          <div class="cancel-svg" @click="handleClose">
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
                  fill="#8a8a8a"
                ></path>
              </svg>
            </span>
          </div>
          <div class="profile-head">
            <div class="head-contain">
              <div class="avatar">
                <div class="avatar-warp">
                  <img :src="profileStore.avatarUrl" alt="" />
                </div>
              </div>
              <div class="user-name">
                {{ profileStore.userName }}
                <VTag
                  :v-status="profileStore.vStatus"
                  style="margin-left: 5px"
                ></VTag>
              </div>
              <div class="is-focus" v-if="!userHomeStore.owner">
                <ElButton
                  class="btn focused"
                  :verifyLogin="true"
                  @click="emits('focus')"
                  v-if="userHomeStore.isFocus"
                >
                  {{ userHomeStore.isFocus == 1 ? '已关注' : '相互关注' }}
                </ElButton>
                <ElButton
                  class="btn focus"
                  :verifyLogin="true"
                  @click="emits('focus')"
                  v-else
                >
                  <div>
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
                      </svg> </span
                    >关注
                  </div>
                </ElButton>
              </div>
            </div>
          </div>
          <div class="profile-body">
            <div class="body-contain">
              <SnsLink
                :Email="profileStore.workEmail"
                :Pixiv="profileStore.Pixiv"
                :QQ="profileStore.QQ"
                :Weibo="profileStore.Weibo"
                :Twitter="profileStore.Twitter"
                :WeChat="profileStore.WeChat"
                :Bilibili="profileStore.Bilibili"
              ></SnsLink>
              <div class="introduction">
                {{ profileStore.introduce }}
              </div>
              <div class="other-profile" v-if="peopleInfoShow">
                <div class="item" v-if="sex">
                  <div class="item-title">性别</div>
                  <div>{{ sex }}</div>
                </div>
                <div class="item" v-if="profileStore.birthdayStr">
                  <div class="item-title">生日</div>
                  <div>
                    {{ profileStore.birthdayStr }}
                  </div>
                </div>
                <div class="item" v-if="address">
                  <div class="item-title">居住地</div>
                  <div>{{ profileStore.addressStr }}</div>
                </div>
              </div>
              <div class="other-profile" v-if="workInfoShow">
                <div class="item" v-if="createStyle">
                  <div class="item-title">创作风格</div>
                  <div>{{ createStyle.split(',').join(' , ') }}</div>
                </div>
                <div class="item" v-if="software">
                  <div class="item-title">常用软件</div>
                  <div>{{ software.split(',').join(' , ') }}</div>
                </div>
                <div class="item" v-if="expectWork">
                  <div class="item-title">倾向工作</div>
                  <div>{{ expectWork }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SnsLink from '@/components/sns-link/src/sns-link.vue'
import ElButton from '@/components/button/el-button.vue'
import VTag from '@/components/avatar/verify-tag.vue'
import useUserProfileStore from '@/stores/module/user-home/module/profile'
import useUserHomeStore from '@/stores/module/user-home'

const emits = defineEmits(['close', 'focus'])
const profileStore = useUserProfileStore()
const userHomeStore = useUserHomeStore()

const sex = computed(() => {
  if (profileStore.sex === 'man') return '男'
  if (profileStore.sex === 'woman') return '女'
  return ''
})
const address = computed(() => profileStore.address)
const createStyle = computed(() => profileStore.createStyle)
const software = computed(() => profileStore.software)
const expectWork = computed(() => profileStore.expectWork)
const peopleInfoShow = computed(() => {
  return profileStore.address || sex.value || profileStore.birthdayStr
})
const workInfoShow = computed(() => {
  return createStyle.value || software.value || expectWork.value
})

// 关闭组件事件
const isShowPanel = ref(true)
const handleClose = () => {
  isShowPanel.value = false
  // 300毫秒渐变 完成后关闭
  setTimeout(() => {
    emits('close')
  }, 300)
}
</script>

<style scoped lang="less">
.panel {
  position: relative;
  margin: 140px auto;
  display: flex;
  flex-direction: column;
  width: 650px;
  box-sizing: border-box;
  background-color: var(--surface-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  border: 1px solid var(--border-color1);
  border-radius: 24px;
  overflow: hidden;
}
.profile-head {
  background-color: var(--surface-color2);
  padding-bottom: 18px;
  .avatar {
    display: flex;
    justify-content: center;
    margin: 35px auto 8px;
    .avatar-warp {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      background: #fff;
      width: 83px;
      height: 83px;
      img {
        width: 80px;
        height: 80px;
        border-radius: 100%;
        object-fit: cover;
      }
    }
  }
  .user-name {
    display: flex;
    font-size: 16px;
    font-weight: bold;
    margin: 8px 0 13px;
    color: var(--color-text2);
    svg {
      margin-left: 5px;
    }
  }
}

.head-contain {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.is-focus {
  .btn {
    padding: 8px 45px;
    font-size: 14px;
    border-radius: 16px;
  }
  .focus {
    div {
      position: relative;
      right: 6px;
      span {
        margin-right: 6px;
      }
    }
  }
  .focused {
    color: var(--color-text2);
    background-color: var(--transparent-hover);
    &:hover {
      background-color: var(--btn-color3-hover);
    }
  }
}

.cancel-svg {
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
}

.body-contain {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 0 80px;
  padding: 15px 45px 15px;
  color: var(--color-text2);
  font-size: 14px;
}
.introduction {
  max-width: 100%;
  line-height: 22px;
  text-align: left;
  font-weight: 400;
  padding-bottom: 20px;
  white-space: pre-line;
  margin-top: 15px;
}

.other-profile {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px 24px 0px 20px;
  color: var(--color-text2);
  border-top: 1px solid var(--border-color1);
  .item {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 13px;
    .item-title {
      font-weight: 700;
    }
    div {
      line-height: 20px;
      flex: 1;
    }
  }
}
</style>
