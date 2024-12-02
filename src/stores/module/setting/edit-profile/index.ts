import { defineStore } from 'pinia'
import useMainStore from '../../main'
import { notification } from '@/components/notification'
import type {
  IEditProfileState,
  snsName,
  snsLinkListItem,
  uploadPayload
} from './type'
import {
  getUserProfileRequest,
  saveAvatarInfoRequest,
  updateUserProfileRequest
} from '@/service/setting/edit-profile'
import type { IUpdateData } from '@/service/setting/edit-profile/type'
import localStorage from '@/utils/local-storage'
import { compress } from '@/utils/handle-img'
import { formatPicUrl, formatUtcString } from '@/utils/data-format'
import { addImgSuffix } from '@/utils/handle-img'
import { getOssClient } from '@/utils/get-sts'

const useEditProfileStore = defineStore('editProfile', {
  state: (): IEditProfileState => ({
    userId: '',
    email: '',
    workEmail: '',
    userName: '',
    sex: 'privacy',
    birthday: {
      Time: '',
      Valid: false
    },
    introduce: '',
    Weibo: '',
    QQ: '',
    Pixiv: '',
    Twitter: '',
    WeChat: '',
    Bilibili: '',
    address: '',
    expectWork: '暂不考虑',
    createStyle: '',
    software: '',
    avatarName: ''
  }),
  getters: {
    avatarUrl(state) {
      return formatPicUrl(state.avatarName, state.userId, 'avatars')
    },
    snsLink(state) {
      const labels: snsName[] = [
        'QQ',
        'Weibo',
        'Pixiv',
        'Twitter',
        'Bilibili',
        'WeChat'
      ]
      const snsLink = []
      for (const label of labels) {
        if (state[label] === '') continue
        const temp = {} as snsLinkListItem
        temp['label'] = label
        temp['value'] = state[label]
        snsLink.push(temp)
      }
      // 如果 没有添加过社交链接 默认添加一条 展示
      if (!snsLink.length) {
        const temp: snsLinkListItem = { value: '', label: 'Weibo' }
        snsLink.push(temp)
      }
      return snsLink
    },
    birthdayObj(state) {
      const { Time, Valid } = state.birthday
      let time = { year: '', month: '', day: '' }
      if (Valid) {
        time = {
          year: formatUtcString(Time, 'YYYY'),
          month: formatUtcString(Time, 'MM'),
          day: formatUtcString(Time, 'DD')
        }
      }
      return time
    },
    createStyleList(state) {
      if (state.createStyle === '') return []
      return state.createStyle.split(',')
    },
    softwareList(state) {
      if (state.software === '') return []
      return state.software.split(',')
    }
  },
  actions: {
    // 获取用户个人资料信息
    async getUserProfileAction() {
      const mainStore = useMainStore()
      const result = await getUserProfileRequest({ id: mainStore.userId })
      // 如果数据请求成功 保存数据
      if (result.status == 200) {
        const profile = result.data.profile
        for (const key in profile) {
          if (Object.prototype.hasOwnProperty.call(this, key)) {
            this[key] = profile[key]
          }
        }
      }
    },
    //上传头像图片
    async uploadAvatarAction(payload: uploadPayload) {
      const mainStore = useMainStore()
      //创建 oss 实例
      const oss = getOssClient(mainStore.sts)
      //图片后缀
      const suffix = addImgSuffix(payload.fileData.type)
      //文件名
      const fileName = mainStore.sts.fileName[0]
      const path = `avatars/${this.userId}/${fileName}`
      const smallAvatar = await compress(payload.url, 0.9, 120)
      try {
        await Promise.all([
          oss.put(path + suffix, payload.fileData),
          oss.put(path + '_s' + suffix, smallAvatar)
        ])
      } catch (e) {
        notification({
          type: 'error',
          title: '个人头像',
          message: '修改头像图片失败, 请稍后再试...',
          duration: 0,
          showClose: true
        })
        return
      }
      // 上传oss 后发送数据到后端同步数据
      const res = await saveAvatarInfoRequest({
        fileName: fileName + suffix,
        type: payload.fileData.type,
        size: payload.fileData.size
      })
      if (res.status === 200) {
        // 改变导航栏的头像
        mainStore.avatar = res.data.fileName
        //改变主页的头像
        this.avatarName = res.data.fileName
        notification({
          type: 'success',
          title: '个人头像',
          message: '上传头像图片成功!'
        })
      }
    },
    //更新用户资料
    async updateUseProfileAction(data: IUpdateData) {
      const mainStore = useMainStore()
      const result = await updateUserProfileRequest(data)
      const { profile, profileType } = result.data
      // 如果数据请求成功 保存数据
      if (result.status === 200 && profileType === 'userName') {
        this.userName = profile
        localStorage.deleteCache('userInfo')
        localStorage.setCache('userInfo', {
          userId: this.userId,
          userName: profile
        })
        mainStore.userName = profile
      }
      //返回让外部Promise 拿到
      return result.status
    }
  }
})

export default useEditProfileStore
