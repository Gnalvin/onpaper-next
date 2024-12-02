//作品信息
export interface IArtwork {
  artworkId: string
  title: string
  userId: string
  userName?: string
  userAvatar?: string
  picCount: number
  cover: string
  adults?: Boolean
  whoSee?: 'public' | 'onlyFans' | 'privacy'
  isDelete?: boolean
  isOwner?: boolean
  isFocus?: boolean
  createAT?: string
}
