import type { ICommentType } from '@/service/comment/type'

// IArtworkState 的类型
export interface IArtworkState {
  isOwn: boolean
  noExist: boolean
  artInfo: IArtInfoType
  artworks: fileType[]
  authorOtherArt: otherArtworkType[]
  comments: commentType[]
  //是否根评论最后一组评论
  commentEnd: boolean
  //是否0个评论
  zeroComment: boolean
  //临时存放评论数组
  tempComments: commentType[]
  //子评论最后一组
  childCommentEnd: boolean
  lastChildComment: {
    cId: string
    sore: number
  }
  windowSize: number
}

//作品信息
export interface IArtInfoType {
  artworkId: string
  title: string
  userId: string
  picCount: number
  cover: string
  zone: string
  whoSee: 'public' | 'onlyFans' | 'privacy'
  adults: boolean
  comSetting: 'public' | 'onlyFans' | 'close'
  copyright: 'BY' | 'BY-ND' | 'BY-NC' | 'BY-NC-ND' | 'OWNER'
  likes: number
  views: number
  collects: number
  isOwner: boolean
  createAT: string
  intro: string
  userName: string
  avatarName: string
  vStatus: number
  vTag: string
  tag: { tagName: string; tagId: string }[]
  userCount: { likes: number; fans: number; collects: number }
  interact: {
    isCollect: boolean
    isLike: boolean
    isFocusAuthor: 0 | 1 | 2
  }
}
export interface commentType extends ICommentType {
  //是否是新添加的回复
  isNew?: boolean
}
// 图片信息
export type fileType = {
  fileName: string
  sort: number
  size: number
  smallFile?: string
  highQuality: string
  isLoading?: boolean
  isShow?: boolean
  isShowHd?: boolean
}

// 作者的其他作品信息
export type otherArtworkType = { artworkId: string; cover: string }

//与作品的互动数据
export interface IUserArtworkInteract {
  isCollect: number
  isLike: number
  isFocusAuthor: number
}

// 作品编辑时 保存数据
export interface IEditState {
  artworkId: string
  title: string
  zone: string
  intro: string
  tags: string[]
  comment: 'public' | 'onlyFans' | 'close'
  copyRight: string
  whoSee: string
  adult: boolean
}
