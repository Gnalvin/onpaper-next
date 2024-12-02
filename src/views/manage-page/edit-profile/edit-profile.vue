<template>
  <div class="edit-profile" v-if="editProfileStore.userId">
    <div class="avatar">
      <AvatarPart></AvatarPart>
    </div>
    <div class="profile-content">
      <div class="back-home" @click="goBackHome">
        返回主页
        <span>
          <svg
            t="1640348277019"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1636"
            width="16"
            height="16"
          >
            <path
              d="M312.888889 995.555556c-17.066667 0-28.444444-5.688889-39.822222-17.066667-22.755556-22.755556-17.066667-56.888889 5.688889-79.644445l364.088888-329.955555c11.377778-11.377778 17.066667-22.755556 17.066667-34.133333 0-11.377778-5.688889-22.755556-17.066667-34.133334L273.066667 187.733333c-22.755556-22.755556-28.444444-56.888889-5.688889-79.644444 22.755556-22.755556 56.888889-28.444444 79.644444-5.688889l364.088889 312.888889c34.133333 28.444444 56.888889 73.955556 56.888889 119.466667s-17.066667 85.333333-51.2 119.466666l-364.088889 329.955556c-11.377778 5.688889-28.444444 11.377778-39.822222 11.377778z"
              p-id="1637"
              fill="#676e7e"
            ></path>
          </svg>
        </span>
      </div>
      <div class="user-name">
        <div class="name" v-if="isShowNameEdit">
          <div>{{ editProfileStore.userName }}</div>
          <span class="edit-name" @click="isShowNameEdit = false">
            <svg
              width="16"
              height="16"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 42H43"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11 26.7199V34H18.3172L39 13.3081L31.6951 6L11 26.7199Z"
                fill="none"
                stroke-width="3"
                stroke-linejoin="round"
              />
            </svg>
            修改
          </span>
        </div>
        <NickInput
          v-else
          @update="updateProfile"
          @reSet="resSetMes"
          :tip-mes="updateMessage"
          :originalUserName="editProfileStore.userName"
        ></NickInput>
      </div>
      <div class="profile-fields">
        <SexPart
          :birthday="editProfileStore.sex"
          :tip-mes="updateMessage"
          @update="updateProfile"
          @reSet="resSetMes"
        ></SexPart>
        <BirthdayPart
          :birthday="editProfileStore.birthdayObj"
          :tip-mes="updateMessage"
          @update="updateProfile"
          @reSet="resSetMes"
        ></BirthdayPart>
        <WorkEmail
          :email="editProfileStore.workEmail"
          :tip-mes="updateMessage"
          @update="updateProfile"
          @reSet="resSetMes"
        ></WorkEmail>
        <RegionPart
          :region="editProfileStore.address"
          :tip-mes="updateMessage"
          @update="updateProfile"
          @reSet="resSetMes"
        ></RegionPart>
        <SnsPart
          :sns-link="editProfileStore.snsLink"
          :tip-mes="updateMessage"
          @update="updateProfile"
          @reSet="resSetMes"
        ></SnsPart>
        <StylePart
          :style-list="editProfileStore.createStyleList"
          :tip-mes="updateMessage"
          @update="updateProfile"
          @reSet="resSetMes"
        ></StylePart>
        <SoftwarePart
          :software="editProfileStore.softwareList"
          :tip-mes="updateMessage"
          @update="updateProfile"
          @reSet="resSetMes"
        ></SoftwarePart>
        <ExpectPart
          :work-type="editProfileStore.expectWork"
          :tip-mes="updateMessage"
          @update="updateProfile"
          @reSet="resSetMes"
        ></ExpectPart>
        <OtherPart
          :text="editProfileStore.introduce"
          :tip-mes="updateMessage"
          @update="updateProfile"
          @reSet="resSetMes"
        ></OtherPart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import useEditProfileStore from '@/stores/module/setting/edit-profile'
import router from '@/router'
import AvatarPart from './cpns/avatar-part.vue'
import NickInput from './cpns/nick-input.vue'
import SexPart from './cpns/sex-part.vue'
import WorkEmail from './cpns/work-email.vue'
import BirthdayPart from './cpns/birthday-part.vue'
import RegionPart from './cpns/region-part.vue'
import StylePart from './cpns/style-part.vue'
import SoftwarePart from './cpns/software-part.vue'
import ExpectPart from './cpns/expect-part.vue'
import OtherPart from './cpns/other-part.vue'
import SnsPart from './cpns/sns-part.vue'
import type { propMesType } from './type'
import type { IUpdateData } from '@/service/setting/edit-profile/type'

const editProfileStore = useEditProfileStore()
editProfileStore.getUserProfileAction()
const isShowNameEdit = ref(true)

const updateMessage = reactive<propMesType>({
  profileType: 'unknown',
  tipType: 'unknown',
  mes: ''
})

const updateProfile = async (data: IUpdateData) => {
  const status = await editProfileStore.updateUseProfileAction(data)
  if (status === 200) {
    updateMessage.profileType = data.profileType
    editProfileStore.birthday.Time = data.profile
    updateMessage.mes = '修改成功'
    updateMessage.tipType = 'success'
  }
}

const resSetMes = () => {
  updateMessage.profileType = 'unknown'
  updateMessage.mes = ''
  updateMessage.tipType = 'unknown'
}

// 返回主页
const goBackHome = () => {
  router.replace({
    name: 'userHome',
    params: { userId: editProfileStore.userId }
  })
}

onUnmounted(() => {
  editProfileStore.$reset()
})
</script>

<style scoped lang="less">
.profile-content {
  padding-top: 16px;
  padding-left: 16px;
  margin-left: 175px;
  .user-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 0;
    .name {
      display: flex;
      align-items: center;
      height: 30px;
      font-size: 26px;
      font-weight: 600;
      .edit-name {
        display: flex;
        position: relative;
        top: 3px;
        margin-left: 20px;
        font-size: 13px;
        font-weight: 500;
        color: #409eff;
        cursor: pointer;
        svg {
          margin-right: 5px;
          stroke: #409eff;
        }
      }
    }
  }
}
.edit-profile {
  position: relative;
  margin: 0 20px 24px;
}
.avatar {
  position: absolute;
  top: -30px;
  border: 3px solid var(--bgc);
  border-radius: 5px;
  cursor: pointer;
}
.back-home {
  position: absolute;
  right: 20px;
  font-weight: 600;
  top: 25px;
  color: var(--color-text2);
  cursor: pointer;
  z-index: 1;
  span {
    position: relative;
    top: 3px;
  }
}

.profile-fields {
  padding-bottom: 100px;
  margin-top: 10px;
}
</style>
