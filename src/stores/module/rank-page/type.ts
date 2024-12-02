import type { IArtwork, IUserInfo } from '@/service/rank-page/type'
import type { IPostUserFocusResult } from '@/service/common/type'

export interface IRankPageState {
  artDayRank: IArtwork[]
  artWeekRank: IArtwork[]
  artMonthRank: IArtwork[]
  userLikeRank: IUserInfo[]
  userCollectRank: IUserInfo[]
  userGirlRank: IUserInfo[]
  userBoyRank: IUserInfo[]
  userNewRank: IUserInfo[]
}

export type artPayloadType = {
  artworks: IArtwork[]
  rankType: string
}

export type userRankType = 'like' | 'collect' | 'girl' | 'boy' | 'new'

export type userPayloadType = {
  userInfo: IUserInfo[]
  rankType: userRankType
}

export type focusPayloadType = {
  userId: string
  isFocus: 0 | 1 | 2
  userName: string
  rankType: userRankType
}

export interface IPostFocusResult {
  rankType: userRankType
  data: IPostUserFocusResult
}
