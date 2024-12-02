// 发送关注作者后 返回的数据类型
export interface IPostUserFocusResult {
  focusId: string
  isCancel: boolean
}

// 发送举报的类型
export interface IPostReport {
  msgId: string
  msgType: string
  reportType: string
  describe: string
  defendant: string
}

export interface IPostFeedback {
  type: string
  describe: string
  contact: string
}

export interface ITag {
  tagName: string
  tagId: string
}

export interface IHotTag extends ITag {
  status: 'up' | 'down' | 'keep' | 'new'
}

export interface IUserProfileData {
  avatar: string
  banner: string
  userName: string
  userId: string
  collects: number
  fans: number
  likes: number
  isOwner: boolean
  vStatus: number
  rating: number
  vTag: string
  commission: boolean
  havePlan: boolean
}
