// 返回的评论数据类型
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
  isLike: boolean
  isDelete: boolean
  createAT: string
  isNew?: boolean
  vStatus: number
  vTag: string
  childComments: ICommentType[] | null
}

export interface IFloorPanelReply {
  replyCid: string
  replyUserId: string
  replyRootId: string
  replyUserName: string
  text: string
}

export type IShowReply = { floor: number; childIndex: number; userName: string }
