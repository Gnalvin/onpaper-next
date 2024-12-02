import type {
  IHotTopic,
  ITrend,
  IRecommendUser
} from '@/service/trend-page/type'
import type { ICommentType } from '@/service/comment/type'
import type { IUserProfileData } from '@/service/common/type'

export interface ITrendPageStore {
  hotTags: IHotTopic[]
  trends: IShowTrend[]
  userPanel: IUserProfileData | null
  recommendUser: ISuggestUser[]
  loadType: 'hot' | 'new' | 'focus'
  //动态到底
  isEnd: boolean
  //加载中
  waiting: boolean
  //用户页请求时没有动态
  noHaveTrend: boolean
}

export interface ITrendDetailStore {
  trendDetail: IShowTrend | null
  comments: commentType[]
  commentDetail: commentType | null
  childCommentEnd: boolean
  //是否根评论最后一组评论
  commentEnd: boolean
  //是否0个评论
  zeroComment: boolean
  //动态是否已经删除
  isNoExist: boolean
}

export interface commentType extends ICommentType {
  //是否是新添加的回复
  isNew?: boolean
}

export interface ISuggestUser extends Omit<IRecommendUser, 'tags'> {
  tags: string[]
}

export interface IShowTrend extends ITrend {
  id: string
}

export interface ISimpleUserType {
  userId: string
  avatar: string
  userName: string
}
