import type { LocationQuery } from 'vue-router'
import type { ITrend } from '@/service/trend-page/type'
import type { ICollectArtwork, IArtwork } from '@/service/user-home/type'

type routeName = 'collect' | 'artwork' | 'trend' | 'main'
type historyQuery = Record<routeName, LocationQuery>

export interface IHomeState {
  userId: string
  owner: boolean
  isFocus: 0 | 1 | 2
  historyQuery: historyQuery
}

// 用户 state 的数据类型
export interface IProfileState {
  userId: string
  userName: string
  bannerName: string
  avatarName: string
  sex: 'privacy' | 'man' | 'woman'
  birthday: {
    Time: string
    Valid: boolean
  }
  count: userCount
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
  vStatus: number
  vTag: string
  commission: boolean
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

// 收藏state 的数据类型
export interface ICollectState {
  collects: ICollectArtwork[]
  collectCount: number
  path: string
  isNoCollects: 'unknown' | 'no' | 'yes'
}

// 作品 state的数据类型
export interface IArtworkState {
  artworks: IArtwork[]
  artworksCount: number
  path: string
  isNoArtworks: 'unknown' | 'no' | 'yes'
}

// 作品 state的数据类型
export interface ITrendState {
  trends: ITrend[]
  isEnd: Boolean
}

export type uploadPayload = { fileData: Blob; url: string }
