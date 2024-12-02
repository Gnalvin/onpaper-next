import type { profileType } from '@/views/manage-page/edit-profile/type'

export interface IUserId {
  id: string
}

//请求传回来的 profile 数据类型
export interface IProfileData {
  userName: string
  email: string
  sex: string
  birthday: birthdayType
  avatarName: string
  bannerName: string
  createTime: string
  fans: number
  following: number
  introduce: string
  likes: number
  pixiv: string
  qq: string
  twitter: string
  userId: string
  weibo: string
  workEmail: string
  address: string
  expectWork: string
  createStyle: string
  software: string
  artworkCount: number
  collectCount: number
  [key: string]: any
}

type birthdayType = {
  Time: string
  Valid: boolean
}

// 保存上传图片信息数据类型
export interface ICallBackData {
  fileName: string
  type: string
  size: number
}

// 保存成功后返回的数据类型
export interface IUploadFileResult {
  fileName: string
}

export interface IUpdateData {
  profileType: profileType
  profile: string
}
