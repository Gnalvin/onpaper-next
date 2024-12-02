import type { IUserInfo, userQuery } from '@/service/all-user/type'

export interface IUserShowState {
  users: IUserInfo[]
  loading: boolean
  isEnd: boolean
  query: userQuery
  maxPage: number
}

// 关注用户API需要的数据
export type focusPayloadType = {
  userId: string
  isFocus: 0 | 1 | 2
  userName: string
}
