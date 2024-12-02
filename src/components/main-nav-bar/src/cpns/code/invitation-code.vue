<template>
  <Teleport to="body">
    <Transition appear>
      <div
        class="invitation top-mask-layer"
        @click.self="handleClose"
        v-if="isShowPanel"
      >
        <div class="container">
          <div class="close" @click="handleClose">
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
          <div class="text">
            <p>亲爱的画师:</p>
            <p>
              感谢你加入Onpaper，我们很高兴你能在这与大家分享你的创作和想法。我们正努力打造这里能成为一个友好、开放、有趣的地方，让每个人都能享受画画的乐趣。
            </p>
            <p>
              为了保持社区的质量和秩序，我们需要你的帮助。每个用户都有三个邀请码，你可以用它来邀请你认为合适的人加入社区。请不要随意泄露或出售邀请码，也不要给那些使用AI生成、不尊重他人、不热爱画画的讨厌鬼。希望你能把邀请码当作一份礼物，送给那些真正值得信赖、有才华、有热情的画师。
            </p>
            <p>
              如果你有任何问题或建议，请随时联系我们。非常感谢你对社区的支持和贡献。
            </p>
            <p style="text-align: end">祝你画画愉快！</p>
            <p style="text-align: end">Onpaper 运营团队</p>
          </div>
          <div class="bottom">
            <template
              v-for="item in navBarStore.invitationCode"
              :key="item.code"
            >
              <div class="code-wrap">
                <span> 邀请码：</span>
                <div
                  class="code"
                  title="点击复制"
                  @click="handleCopy(item.code)"
                >
                  {{ item.code }}
                </div>
                <div
                  class="user"
                  v-if="item.userId != '0'"
                  @click="handleClose"
                >
                  使用者：
                  <RouterLink
                    :to="{ name: 'userHome', params: { userId: item.userId } }"
                  >
                    <AvatarItem
                      :user-id="item.userId"
                      :img-url="item.avatar"
                      :width="30"
                      :height="30"
                    ></AvatarItem>
                    <span class="name">{{ item.userName }}</span>
                  </RouterLink>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AvatarItem from '@/components/avatar/avatar-item.vue'
import useNavBarStore from '@/stores/module/nav-bar'
import { TipBox } from '@/components/message-box'
import { copyText } from '@/utils/system'

const emits = defineEmits(['close'])
const navBarStore = useNavBarStore()
navBarStore.getInvitationCodeAction()

const handleCopy = (code: string) => {
  copyText(code)
  TipBox({ text: '复制成功' })
}
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
.invitation {
  display: flex;
  justify-content: center;
}
.container {
  position: relative;
  overflow: auto;
  padding: 30px;
  width: 600px;
  margin: 130px auto;
  background-color: var(--surface-color4);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  border: 1px solid var(--border-color1);
  border-radius: 24px;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
}
p {
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.9;
  margin: 10px 0;
}
.bottom {
  border-top: 1px solid var(--border-color1);
  margin-top: 20px;
  padding-top: 10px;
  .code-wrap {
    display: flex;
    align-items: center;
    font-size: 15px;
    margin-top: 20px;
    .code {
      cursor: pointer;
      border-radius: 6px;
      text-align: center;
      width: 100px;
      font-weight: 600;
      font-size: 15px;
      line-height: 1.7;
      background-color: var(--surface-color3);
    }
    .user {
      display: flex;
      align-items: center;
      a {
        display: flex;
        align-items: center;
      }
      margin-left: 150px;
      .name {
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }
}
</style>
