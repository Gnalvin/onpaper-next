export interface IRelevantTag {
  tags: { tagId: string; tagName: string }[]
  total: number
  tagName: string
}

export interface ITagAboutArt {
  artworkId: string
  title: string
  userId: string
  userName: string
  userAvatar: string
  picCount: number
  cover: string
  adults: boolean
  createAT: string
  width: number
  height: number
  firstPic: string
}

export interface ITagAboutUser {
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
