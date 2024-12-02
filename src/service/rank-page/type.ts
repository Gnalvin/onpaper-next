//作品信息
export interface IArtwork {
  artworkId: string
  title: string
  userId: string
  userName: string
  userAvatar: string
  picCount: number
  cover: string
  zone: string
  whoSee?: 'public' | 'onlyFans' | 'privacy'
  isDelete?: boolean
  adults: Boolean
}

export interface IUserInfo {
  userId: string
  userName: string
  avatar: string
  intro: string
  isFocus: 0 | 1 | 2
  workEmail: string
  Weibo: string
  QQ: string
  Pixiv: string
  Twitter: string
  WeChat: string
  Bilibili: string
  vStatus: number
  vTag: string
  artworks: ISimpleArtwork[]
}

export interface ISimpleArtwork {
  artworkId: string
  title: string
  userId: string
  picCount: number
  cover: string
}
