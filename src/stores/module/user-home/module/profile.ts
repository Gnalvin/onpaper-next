import { defineStore } from 'pinia'
import type { IProfileState, uploadPayload } from '../type'
import useMainStore from '@/stores/module/main'
import useUserHomeStore from '../index'
import useCollectStore from './collect'
import useArtworkStore from './artwork'

import {
  getUserProfileRequest,
  saveAvatarInfoRequest,
  saveBannerInfoRequest,
  deleteUserBannerRequest
} from '@/service/user-home'

import { notification } from '@/components/notification'
import { hasOwn } from '@/utils/verify-type'
import { formatPicUrl, formatUtcString } from '@/utils/data-format'
import { addImgSuffix } from '@/utils/handle-img'
import { compress } from '@/utils/handle-img'
import { getOssClient } from '@/utils/get-sts'

const useProfileStore = defineStore('userHomeProfile', {
  state: (): IProfileState => ({
    userId: '',
    workEmail: '',
    userName: '',
    count: {
      artCount: 0,
      collectCount: 0,
      collects: 0,
      fans: 0,
      following: 0,
      likes: 0,
      trendCount: 0
    },
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
    expectWork: '',
    createStyle: '',
    software: '',
    bannerName: '',
    avatarName: '',
    vStatus: 0,
    vTag: '',
    commission: false
  }),
  getters: {
    avatarUrl(state) {
      return formatPicUrl(state.avatarName, state.userId, 'avatars', '')
    },
    bannerUrl(state) {
      return formatPicUrl(state.bannerName, state.userId, 'banners', 'l')
    },
    birthdayStr(state) {
      if (state.birthday.Valid === false) return ''
      return formatUtcString(state.birthday.Time, 'MM 月 DD 日')
    },
    addressStr(state) {
      return state.address.split(',').join(' ')
    }
  },
  actions: {
    // 获取用户个人资料信息
    async getUserProfileAction(userId: string) {
      const collectStore = useCollectStore()
      const userHomeStore = useUserHomeStore()
      const artworkStore = useArtworkStore()
      const result = await getUserProfileRequest({ id: userId })
      // 如果数据请求成功 保存数据到 userHomeStore
      if (result.status == 200) {
        //保存收藏个数 到 collectStore
        collectStore.collectCount = result.data.profile.count.collectCount
        //保存作品个数 到 artworkStore
        artworkStore.artworksCount = result.data.profile.count.artCount
        //保存权限信息到 userHomeStore
        userHomeStore.userId = result.data.profile.userId
        userHomeStore.owner = result.data.owner
        userHomeStore.isFocus = result.data.isFocus
        //保存个人信息到 这个 store
        const profile = result.data.profile
        for (const key in profile) {
          if (hasOwn(this, key)) {
            this[key] = profile[key]
          }
        }
      }
    },
    //上传背景图片
    async uploadBannerAction(data: File) {
      const mainStore = useMainStore()
      //创建 oss 实例
      const oss = getOssClient(mainStore.sts)
      const fileName = mainStore.sts.fileName.pop() + addImgSuffix(data.type)
      //上传的路径
      const path = 'banners/' + this.userId + '/' + fileName
      try {
        await oss.put(path, data)
      } catch (e) {
        notification({
          type: 'error',
          title: '主页背景',
          message: '修改背景图片失败, 请稍后再试...'
        })
        return
      }
      const result = await saveBannerInfoRequest({
        fileName: fileName,
        type: data.type,
        size: data.size
      })
      if (result.status === 200) {
        this.bannerName = result.data.fileName
        notification({
          type: 'success',
          title: '主页背景',
          message: '上传背景图片成功!'
        })
      }
    },
    // 删除背景图片
    async deleteUserBannerAction() {
      const res = await deleteUserBannerRequest(this.bannerName)
      if (res.status == 200) {
        this.bannerName = ''
        notification({
          type: 'success',
          title: '主页背景',
          message: '删除背景图片成功!'
        })
      } else {
        notification({
          type: 'error',
          title: '主页背景',
          message: '删除背景图片失败, 请稍后再试...'
        })
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
      // 上传到oss 后发送数据到后端同步数据
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
    }
  }
})

export default useProfileStore
