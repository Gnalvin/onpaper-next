import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type { IPostCommentData, ICommentType, IPostLikeData } from './type'

enum mainAPI {
  GetCommentAPI = '/comment/root',
  GetChildCommentAPI = '/comment/reply',
  PostCommentAPI = '/comment',
  PostCommentLike = '/comment/like',
  GetOneRootCommentAPI = '/comment/root/one',
  DelCommentAPI = '/comment'
}

// 获取动态的评论信息
export function getRootCommentRequest(
  ownid: string,
  type: string,
  cid = '0',
  sore = 1
) {
  return wlRequest.get<IResultType<ICommentType[]>>({
    url: mainAPI.GetCommentAPI,
    params: { ownid, cid, sore, type }
  })
}

//获取作品评论的子评论信息
export function getChildCommentRequest(
  rid: string,
  type: string,
  cid = '0',
  sore = 1
) {
  return wlRequest.get<IResultType<ICommentType[]>>({
    url: mainAPI.GetChildCommentAPI,
    params: { cid, sore, rid, type }
  })
}

//发布作品评论信息
export function postCommentRequest(data: IPostCommentData) {
  return wlRequest.post<IResultType<ICommentType>>({
    url: mainAPI.PostCommentAPI,
    data
  })
}

// 获取一条根评论数据
export function getOneRootCommentRequest(rid: string, type: 'aw' | 'tr') {
  return wlRequest.get<IResultType<ICommentType>>({
    url: mainAPI.GetOneRootCommentAPI,
    params: { rid, type }
  })
}

// 评论点赞
export function postLikeCommentRequest(data: IPostLikeData) {
  return wlRequest.post<IResultType<IPostLikeData>>({
    url: mainAPI.PostCommentLike,
    data: data
  })
}

// 删除评论
export function deleteCommentRequest(cid: string) {
  return wlRequest.delete<IResultType>({
    url: mainAPI.DelCommentAPI,
    data: { cid }
  })
}
