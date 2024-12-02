import type {
  ITagData as t,
  IUserNameSearchRes,
  IInvitationCode
} from '@/service/nav-bar/type'
import type { IHotTag } from '@/service/common/type'
import type { IRelevantTopic } from '@/service/trend-page/type'

export interface INavBarState {
  following: number
  fans: number
  likes: number
  isTransparentNav: boolean
  isShowPanel: boolean
  notifyUnread: number
  messageUnread: number
  invitationCode: IInvitationCode[]
}

export interface ISearchState {
  hotTag: IHotTag[]
  history: historyType[]
  searchText: string
  searchType: 'tag' | 'user' | 'topic'
  searchTagResult: {
    searchData: ISearchTagData[] | null
    likeData: ISearchTagData[] | null
  }
  oldTag: string
  oldUser: string
  oldTopic: string
  searchUserResult: IUserNameSearchRes
  searchTopicResult: IRelevantTopic[] | null
}

export interface ISearchTagData extends t {
  artCount: number
  showName: string
}

// n = name ,t = 0 | 1 (标签,用户),i 对应id
export type historyType = { n: string; t: number; i: string }
