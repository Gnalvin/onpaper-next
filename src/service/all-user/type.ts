export type userQuery = {
  next: string
  type: 'hot' | 'new' | 'active'
}

export interface IUserInfo {
  userId: string
  userName: string
  avatar: string
  intro: string
  isFocus: 0 | 1 | 2
  artworks: {
    artworkId: string
    title: string
    userId: string
    picCount: number
    cover: string
    adults: boolean
    createAT: string
  }[]
  workEmail: string
  QQ: string
  Weibo: string
  Twitter: string
  Pixiv: string
  WeChat: string
  Bilibili: string
  vStatus: number
  vTag: string
  score: string
}
