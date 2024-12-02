// 上传保存作品信息接口 需要的数据
export interface IArtworkFormData {
  title: string
  description: string
  fileList: { fileName: string; sort: number; width: number; height: number }[]
  zone: string
  whoSee: string
  tags: string[]
  adult: boolean | null
  cover: string
  comment: string
  copyright: string
  device: 'PC'
}

// 返回的的单个作品信息
export interface IArtworkInfoData {
  artworkId: string
  title: string
  userId: string
  intro: string
  picCount: number
  cover: string
  zone: string
  whoSee: string
  adults: Boolean
  comSetting: 'public' | 'onlyFans' | 'close'
  copyright: string
  likes: number
  views: number
  userName: string
  avatarName: string
  collects: number
  interact: { isCollect: boolean; isFocusAuthor: boolean; isLike: boolean }
  userCount: { likes: number; fans: number; collects: number }
  isOwner: boolean
  createAT: string
  tag: { tag: string; tagId: string }[]
  picture: {
    fileName: string
    sort: number
    size: number
    highQuality: string
  }[]
  otherArtwork: IOtherArtworkData[]
}

//作品的其他信息
export type IOtherArtworkData = { artworkId: string; cover: string }

// 返回的作品评论数据类型
export type ICommentType = {
  cId: string
  ownId: string
  userId: string
  avatar: string
  userName: string
  replyId: string
  replyUserId: string
  replyUserName: string
  rootId: string
  rootCount: number
  text: string
  likes: number
  sore: number
  disLikes: number
  isDelete: boolean
  createAT: string
  childComments: ICommentType[] | null
}

// 发送点赞收藏作品后返回的数据类型
export interface IInteractResult {
  authorId: string
  isCancel: boolean
  msgId: string
  type: 'aw' | 'tr'
}

export interface updateArtInfo {
  artworkId: string
  title: string
  zone: string
  tags: string[]
  whoSee: string
  adult: Boolean
  comment: 'public' | 'onlyFans' | 'close'
  copyRight: string
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

export type channelQuery = {
  next: string
  zone: string
  sort: 'hot' | 'new'
  page: number
}
