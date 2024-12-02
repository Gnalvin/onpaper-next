//作品信息
export interface IArtwork {
  id?: string
  artworkId: string
  title: string
  userId: string
  userName: string
  userAvatar: string
  picCount: number
  cover: string
  width: number
  height: number
  firstPic: string
}

export interface IBaseArtwork {
  artworkId: string
  title: string
  userId: string
  userName: string
  userAvatar: string
  picCount: number
  cover: string
  adults: Boolean
  whoSee: 'public' | 'onlyFans' | 'privacy'
  isDelete: boolean
  isOwner?: boolean
  isFocus?: boolean
  createAT: string
}

export interface IRecommendUser {
  userId: string
  userName: string
  avatar: string
  isFocus: boolean
  tags: string[]
  artworks: ISimpleArtwork[]
  count: {
    artCount: number // 作品数
    collectCount: number // 收藏作品数
    collects: number // 被收藏数
    fans: number // 粉丝数
    following: number // 关注数
    likes: number // 被点赞数
    trendCount: number // 动态数
  }
}

export interface ISimpleArtwork {
  artworkId: string
  userId: string
  cover: string
}

export interface ISimpleUser {
  userId: string
  userName: string
  avatar: string
}
