import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type {
  IArtwork,
  IRecommendUser,
  ISimpleUser,
  IBaseArtwork
} from './type'

enum mainAPI {
  GetUserFocusArtwork = '/feed/art',
  GetArtworkRank = '/artwork/rank',
  GetHotArtwork = '/artwork/hot',
  GetRecommendUser = '/user/recommend',
  PostUserFocus = '/user/focus',
  GetDiscoverArtwork = '/artwork/discover',
  GetUserCollect = '/user/profile/collect',
  GetUserFocus = '/user/follow',
  SearchFocusUser = '/user/focus/search',
  GetZoneArt = '/artwork/hot/zone'
}

// 请求关注的用户最近作品数据
export function getUserFocusArtworkRequest(nextid: string) {
  return wlRequest.get<IResultType<IBaseArtwork[]>>({
    url: mainAPI.GetUserFocusArtwork,
    params: { nextid }
  })
}

//请求今日排行榜数据
export function getArtworkRankRequest() {
  return wlRequest.get<IResultType<IArtwork[]>>({
    url: mainAPI.GetArtworkRank,
    params: { type: 'today' }
  })
}

//请求热门作品数据
export function getHotArtworkRequest() {
  return wlRequest.get<IResultType<IArtwork[]>>({
    url: mainAPI.GetHotArtwork
  })
}

//请求热门用户数据
export function getRecommendUserRequest() {
  return wlRequest.get<IResultType<IRecommendUser[]>>({
    url: mainAPI.GetRecommendUser
  })
}

//获取主页收藏作品信息
export function getUserCollectRequest(userId: string, page: number) {
  return wlRequest.get<IResultType<IBaseArtwork[] | null>>({
    url: mainAPI.GetUserCollect,
    params: { uid: userId, page }
  })
}

// 获取用户关注列表
export function getUserFocusRequest(userId: string, page: number) {
  return wlRequest.get<IResultType<ISimpleUser[] | null>>({
    url: mainAPI.GetUserFocus,
    params: { uid: userId, page, type: 'following' }
  })
}

//在关注的用户中搜索
export function searchFocusUserRequest(name: string) {
  return wlRequest.get<IResultType<ISimpleUser[] | null>>({
    url: mainAPI.SearchFocusUser,
    params: { name }
  })
}

//获取分区热门数据
export function getZoneArtworkRequest(type: number) {
  return wlRequest.get<IResultType<{ title: string; artwork: IBaseArtwork[] }>>(
    {
      url: mainAPI.GetZoneArt,
      params: { type }
    }
  )
}
