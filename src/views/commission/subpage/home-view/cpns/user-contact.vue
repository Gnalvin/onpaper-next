<template>
  <div
    class="contact-wrap top-mask-layer"
    @click.self="$emit('close')"
    v-if="detailStore.contact"
  >
    <div class="container">
      <div class="title">
        联系方式
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
      <div class="content" v-for="(v, k) in detailStore.contact" :key="k">
        <div class="who">{{ k == 'artist' ? '画师' : '企划方' }} :</div>
        <div class="info">
          <AvatarItem
            :width="45"
            :height="45"
            :user-id="v.userId"
            :file-name="v.avatar"
          ></AvatarItem>
          <div class="left">
            <div class="username">{{ v.userName }}</div>
            <div class="contact">
              <div class="type">
                {{ formatContactType(v?.contactType) }} : &nbsp;
              </div>
              <div class="text one-line" :title="v.contact">
                {{ v.contact }}
              </div>
              <span
                class="copy"
                title="点击复制"
                @click="handleCopy(v.contact)"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z"
                    fill="none"
                    stroke-width="4"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AvatarItem } from '@/components/avatar'
import useDetailStore from '@/stores/module/commission/detail'
import { TipBox } from '@/components/message-box'
import { copyText } from '@/utils/system'

defineEmits(['close'])

const detailStore = useDetailStore()

const formatContactType = (text: string | undefined) => {
  if (text === 'WeChat') return '微信'
  if (text === 'Phone') return '手机'
  return 'QQ'
}

const handleCopy = (code: string) => {
  copyText(code)
  TipBox({ text: '复制成功' })
}
</script>

<style scoped lang="less">
.contact-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  width: 320px;
  background-color: var(--surface-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  border: 1px solid var(--border-color1);
  border-radius: 8px;
  padding: 15px 25px;
}

.title {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color2);
  .close {
    cursor: pointer;
    svg {
      fill: var(--color-text1);
    }
  }
}
.content {
  flex: 1;
  padding-top: 5px;
  margin-bottom: 30px;
  .who {
    margin-bottom: 10px;
    font-weight: 500;
  }
  .info {
    display: flex;
    align-items: center;
    .left {
      margin-left: 10px;
    }
    .username {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 5px;
    }
  }
  .contact {
    display: flex;
    position: relative;
    .type {
      flex-shrink: 0;
    }
  }
}
.copy {
  cursor: pointer;
  margin-left: 10px;
  svg {
    stroke: var(--color-text1);
  }
}
</style>
