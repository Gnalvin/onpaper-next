import type { IStsToken } from '@/service/sts/type'

export interface IRootState {
  userId: string
  userName: string
  refreshToken: string | undefined
  accessToken: string | undefined
  avatar: string
  sts: IStsToken
  //刷新页面
  refreshPage: number
  //是否显示登陆模块
  isShowLogin: boolean
  //上传完图片 有时需要临时保存给跳转用
  tempImg: string[]
  //是否是移动端
  isMobile: boolean
}
