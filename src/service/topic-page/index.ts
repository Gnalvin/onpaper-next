import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type { ITopicDetail } from './type'
import type { ITrend } from '@/service/trend-page/type'

enum mainAPI {
  GetTopicDetail = '/topic/detail',
  GetTopicTrend = '/topic/trend'
}

//获取话题详情数据
export function getTopicDetailRequest(topicId: string) {
  return wlRequest.get<IResultType<ITopicDetail>>({
    url: mainAPI.GetTopicDetail,
    params: { id: topicId, topic: '0' }
  })
}
// 获取话题的动态
export function getTopicTrendRequest(id: string, sort: string, page: number) {
  return wlRequest.get<IResultType<ITrend[]>>({
    url: mainAPI.GetTopicTrend,
    params: { id, sort, page }
  })
}
