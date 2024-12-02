import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type { IArtwork, IUserInfo } from './type'

enum mainAPI {
  GetArtworkRank = 'artwork/rank',
  GetUserRank = 'user/rank'
}

//请求作品排行榜数据
export function getArtworkRankRequest(type: string) {
  return wlRequest.get<IResultType<IArtwork[]>>({
    url: mainAPI.GetArtworkRank,
    params: { type }
  })
}

//请求用户排行榜数据
export function getUserRankRequest(type: string) {
  return wlRequest.get<IResultType<IUserInfo[]>>({
    url: mainAPI.GetUserRank,
    params: { type }
  })
}
