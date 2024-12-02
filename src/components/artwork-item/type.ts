export interface ISquareArtwork {
  artworkId: string
  title?: string
  userId?: string
  cover: string
  zone?: string
  picCount: number
  whoSee?: 'public' | 'onlyFans' | 'privacy'
  isDelete?: Boolean
  adults?: Boolean
  likes?: number
  views?: number
  collects?: number
  createAT?: string
  userName?: string
  isOwner?: boolean
  isFocus?: boolean
  userAvatar?: string
}

export interface IRectangleArtwork {
  id?: string
  artworkId: string
  userId: string
  userName: string
  userAvatar: string
  width: number
  height: number
  firstPic: string
  title: string
  picCount: number
}
