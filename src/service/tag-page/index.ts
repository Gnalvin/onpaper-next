import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type { IRelevantTag, ITagAboutArt, ITagAboutUser } from './type'

enum mainAPI {
  GetRelevantTag = '/tag/relevant',
  GetTagAboutArt = '/tag/search/art',
  GetTagAboutUser = '/tag/user',
  PostUserFocusAPI = '/user/focus'
}

// 请求相似tag数据
export function getRelevantTagRequest(tag: string, query: string) {
  return wlRequest.get<IResultType<IRelevantTag>>({
    url: mainAPI.GetRelevantTag,
    params: { tag, query }
  })
}

// 请求tag相关的 作品
export function getGetTagAboutArtRequest(
  tag: string,
  sort: 'score' | 'time',
  page: number,
  query: string
) {
  return wlRequest.get<IResultType<ITagAboutArt[]>>({
    url: mainAPI.GetTagAboutArt,
    params: { tag, sort, page, query }
  })
}

// 请求tag相关的 用户
export function getGetTagAboutUserRequest(tag: string, query: string) {
  return wlRequest.get<IResultType<ITagAboutUser[]>>({
    url: mainAPI.GetTagAboutUser,
    params: { tag, query }
  })
}
