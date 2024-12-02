import type {
  IArtwork,
  IRecommendUser,
  IBaseArtwork
} from '@/service/home-page/type'
import type { ITag } from '@/service/common/type'
import type { IArtwork as FocusArtwork } from '@/service/user-home/type'
import type Waterfall from '@/views/home-page/subarea/discover/waterfall'

//首页的主要 store类型
export interface IHomePageState {
  sidebar: 'big' | 'small'
}

//首页的首页 store类型
export interface IHomeAreaState {
  artworkRank: IArtwork[]
  hotArtwork: IArtwork[]
  recommendUser: IRecommendUser[]
  hotTags: ITag[]
  loadMoreSpace: {
    goToRouter?: {
      name: string
      query: any
    } // 查看更多的路由名字
    title?: string
    artwork: IBaseArtwork[]
  }[]
}

//发现页 store类型
export interface IDiscoverState {
  discoverArtwork: IDiscoverArtwork[]
  page: number
}

export interface IDiscoverArtwork extends IArtwork {
  id?: string
}

export interface IDataAndWaterfall {
  data: IDiscoverArtwork[]
  waterfall: Waterfall
}

//收藏页 store类型
export interface ICollectAreaState {
  collects: IBaseArtwork[]
  isEnd: boolean
  loading: boolean
  isNoCollects: 'yes' | 'no' | 'unknown'
}

//关注页 store类型
export interface IFocusAreaState {
  focusList: ISimpleUserType[]
  userArtworks: FocusArtwork[]
  feeds: IBaseArtwork[]
  choseUser: ISimpleUserType
  page: number
  isEnd: boolean // 作品加载到头
  isZero: boolean
  isNoFocus: 'yes' | 'no' | 'unknown'
  searchUser: ISimpleUserType[]
  isUserEnd: boolean //用户关注列表翻页到头
}

export interface ISimpleUserType {
  userId: string
  avatar: string
  userName: string
}

// 关注用户API需要的数据
export type focusPayloadType = {
  userId: string
  isFocus: boolean
  userName: string
}
