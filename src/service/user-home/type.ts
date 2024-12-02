export interface IUserId {
  id: string
}

// 请求传回来的 profile 数据类型
export interface IUserProfileResult {
  owner: boolean
  isFocus: 0 | 1 | 2
  profile: IProfileData
}
//请求传回来的 profile 数据类型
export interface IProfileData {
  userId: string
  userName: string
  email: string
  sex: string
  birthday: birthdayType
  avatarName: string
  bannerName: string
  createTime: string
  introduce: string
  workEmail: string
  Weibo: string
  QQ: string
  Pixiv: string
  Twitter: string
  WeChat: string
  Bilibili: string
  address: string
  expectWork: string
  createStyle: string
  software: string
  count: userCount
}

export interface userCount {
  artCount: number
  collectCount: number
  collects: number
  fans: number
  following: number
  likes: number
  trendCount: number
}

type birthdayType = {
  Time: string
  Valid: boolean
}

// 更新个人数据 上传和返回新的 数据接口
export interface IUpdateProfile {
  userProfile: {
    userName: string
    sex: string
    workEmail: string
    birthday: string
    pixiv: string
    qq: string
    twitter: string
    weibo: string
    introduce: string
  }
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

// 用户作品请求返回的数据类型
export interface IHomeArtworkResult {
  artworks: IArtwork[]
}

//作品展示信息
export interface IArtwork {
  artworkId: string
  title: string
  userId: string
  cover: string
  zone: string
  picCount: number
  whoSee: 'public' | 'onlyFans' | 'privacy'
  isDelete: boolean
  adults: Boolean
  likes: number
  isOwner: boolean
  views: number
  collects: number
  createAT: string
}

//用户收藏的作品信息
export interface ICollectArtwork {
  artworkId: string
  title: string
  userId: string
  userName: string
  userAvatar: string
  picCount: number
  cover: string
  zone: string
  whoSee: 'public' | 'onlyFans' | 'privacy'
  isDelete: boolean
  adults: Boolean
  isOwner?: boolean
}

// 发送关注作者后 返回的数据类型
export interface IPostUserFocusResult {
  focusId: string
  isCancel: string
}
