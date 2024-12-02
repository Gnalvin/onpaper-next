import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type {
  INotifyBody,
  IUnreadCount,
  ICommentNotify,
  ILikeCommentNotify,
  ICommissionNotify
} from './type'

enum mainAPI {
  GetUnreadCountAPI = '/notify/unread',
  GetLikeAndCollectAPI = '/notify/like_collect',
  GetFocusNotifyAPI = '/notify/focus',
  GetCommentNotifyAPI = '/notify/comment',
  GetCommissionAPI = '/notify/commission'
}

// 请求导航栏的用户数据
export function getUnreadCountRequest() {
  return wlRequest.get<IResultType<IUnreadCount>>({
    url: mainAPI.GetUnreadCountAPI
  })
}

// 获取赞和收藏的通知
export function getLikeAndCollectRequest(nextId: string) {
  return wlRequest.get<IResultType<INotifyBody<ILikeCommentNotify>[]>>({
    url: mainAPI.GetLikeAndCollectAPI,
    params: { next: nextId }
  })
}

// 获取关注的通知
export function getFocusNotifyRequest(nextId: string) {
  return wlRequest.get<IResultType<INotifyBody[]>>({
    url: mainAPI.GetFocusNotifyAPI,
    params: { next: nextId }
  })
}

// 获取评论的通知
export function getCommentRequest(nextId: string) {
  return wlRequest.get<IResultType<INotifyBody<ICommentNotify>[]>>({
    url: mainAPI.GetCommentNotifyAPI,
    params: { next: nextId }
  })
}

// 获取约稿的通知
export function getCommissionRequest(nextId: string) {
  return wlRequest.get<IResultType<INotifyBody<ICommissionNotify>[]>>({
    url: mainAPI.GetCommissionAPI,
    params: { next: nextId }
  })
}
