export interface INavUserData {
  avatar: string
  banner: string
  userName: string
  userId: string
  following: number
  fans: number
  likes: number
  notifyUnread: number
}

export interface ITagData {
  tagName: string
  tagId: string
}

export interface ITagNameSearchRes {
  searchData: ITagData[] | null
  likeData: ITagData[] | null
}

export interface IUserNameSearchRes {
  searchData: IUserData[] | null
  likeData: IUserData[] | null
}

export interface IUserData {
  avatar: string
  userName: string
  userId: string
  showName?: string
  likes?: number
  vStatus: number
  vTag: string
}

export interface IInvitationCode {
  userId: string
  avatar: string
  userName: string
  code: string
}
