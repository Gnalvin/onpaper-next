import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type {
  IHotTopic,
  ITrend,
  IRecommendUser,
  IRelevantTopic,
  ITrendFormData,
  IInteractData,
  IPermission
} from './type'
import { notification } from '@/components/notification'

enum mainAPI {
  GetHotTopic = '/topic/hot',
  GetFeeds = '/feed/all',
  GetNewTrend = '/trend/new',
  GetOneTrend = '/trend/one',
  GetRecommendUser = '/user/recommend',
  GetHotTrend = '/trend/hot',
  GetRelevantTopicAPI = '/topic/relevant',
  PostTrendAPI = '/save/trend',
  PostLikeAPI = '/user/like',
  DeleteTrendAPI = '/trend/delete',
  UpdatePermission = '/trend/permission'
}

//获取热门tag 数据
export function getHotTopicRequest() {
  return wlRequest.get<IResultType<IHotTopic[]>>({
    url: mainAPI.GetHotTopic
  })
}

// 请求关注的用户最近动态数据
export function getFeedsRequest(nextid: string) {
  return wlRequest.get<IResultType<ITrend[]>>({
    url: mainAPI.GetFeeds,
    params: { nextid }
  })
}

//请求热门用户数据
export function getRecommendUserRequest() {
  return wlRequest.get<IResultType<IRecommendUser[] | null>>({
    url: mainAPI.GetRecommendUser
  })
}

// 获取最新的动态
export function getNewTrendRequest(nextid: string) {
  return wlRequest.get<IResultType<ITrend[]>>({
    url: mainAPI.GetNewTrend,
    params: { nextid }
  })
}
//获取动态详情
export function getTrendDetailRequest(id: string, type: string) {
  return wlRequest.get<IResultType<ITrend>>({
    url: mainAPI.GetOneTrend,
    params: { id, type }
  })
}
// 获取热门动态
export function getHotTrendRequest() {
  return wlRequest.get<IResultType<ITrend[]>>({
    url: mainAPI.GetHotTrend
  })
}

//模糊查找 相关话题
export function getRelevantTopic(query: string, id = '0') {
  return wlRequest.get<IResultType<IRelevantTopic[]>>({
    url: mainAPI.GetRelevantTopicAPI,
    params: { topic: query, id }
  })
}

// 发布动态信息 请求
export function saveTrendInfoRequest(data: ITrendFormData) {
  return wlRequest.post<IResultType<ITrend>>({
    url: mainAPI.PostTrendAPI,
    data: data
  })
}

//点赞动态请求
export function postTrendLikeRequest(data: IInteractData) {
  return wlRequest.post<IResultType<IInteractData>>({
    url: mainAPI.PostLikeAPI,
    data
  })
}

// 删除动态
export function deleteTrendRequest(id: string) {
  return wlRequest.delete<IResultType<{ trendId: string }>>({
    url: mainAPI.DeleteTrendAPI,
    params: { id, type: 'tr' },
    interceptors: {
      responseInterceptors: (res) => {
        if (res.status == 200) {
          notification({
            type: 'success',
            title: '删除动态',
            message: '删除动态成功~',
            zIndex: 9999
          })
        } else {
          notification({
            type: 'error',
            title: '删除动态',
            message: '删除动态失败，请稍后再试',
            zIndex: 9999
          })
        }
        return res
      }
    }
  })
}

//更新动态权限
export function updatePermissionRequest(data: IPermission) {
  return wlRequest.patch<IResultType<IPermission>>({
    url: mainAPI.UpdatePermission,
    data
  })
}
