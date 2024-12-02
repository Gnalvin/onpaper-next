import type { ITopicDetail } from '@/service/topic-page/type'
import type { IHotTopic } from '@/service/trend-page/type'

export interface ITopicPageState {
  topicDetail: ITopicDetail
  sort: 'hot' | 'new'
  hotTopic: IHotTopic[]
  noHaveTrends: boolean
}
