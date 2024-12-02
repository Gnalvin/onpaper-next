export interface IAcceptPlan {
  planId: string
  name: string
  intro: string
  preference: string
  refuse: string
  money: string
  change: number
  finish: number
  contactType: 'QQ' | 'Phone' | 'WeChat'
  contact: ''
  payment: '1' | '2' | '3' | '4' | '5'
  fileType: string[]
}

export interface IInvitePlan {
  artistId: string
  planId: string
  category: string
  name: string
  intro: string
  fileList: { fileName: string; sort: number; width: number; height: number }[]
  purpose: string
  fileSize: 'game' | 'weibo' | 'pc' | 'a4' | 'diy'
  color: 'RGB' | 'CMYK'
  fileType: string[]
  date: string
  money: string
  feedBack: 0 | 3 | 5 | 7 | 15
  payment: '1' | '2' | '3' | '4' | '5'
  openOption: 'open' | 'appoint' | 'privacy'
  contactType: 'QQ' | 'Phone' | 'WeChat'
  contact: ''
}

export interface IUserAcceptPlan extends IAcceptPlan {
  userId: string
  userName: string
  avatar: string
  vTag: string
  vStatus: number
  planId: string
  status: 0 | 1 // 约稿中 / 暂不约稿
  isDelete: boolean
  updateAt: string
  createAt: string
}

export interface IUserInvitePlan extends IInvitePlan {
  artist: IUserScore
  sender: IUserScore
  userId: string
  status: 0 | 1 | 2 | 3 | -1 | -2
  inviteId: string
  isDelete: boolean
  evaluates: IShowEvaluate[] | null
  evaluateStatus: 0 | 1 | 2 // 1 画师完成评价 2 约稿方完成评价 0 都完成评价
  updateAt: string
  createAt: string
}

export interface IUserScore {
  userId: string
  userName: string
  avatar: string
  score: number
  finish: number
}

export interface IPlanCard {
  inviteId: string
  userId: string
  name: string
  category: string
  intro: string
  fileList: { fileName: string; sort: number; width: number; height: number }[]
  status: 0 | 1 | 2 | 3 | -1 | -2
  date: string
  money: string
  updateAt: string
  needEvaluate?: boolean
}

export interface IPlanNext {
  inviteId: string
  status: 0 | 1 | 2 | 3 | -1 | -2
}

export interface IUserContact {
  userId: string
  userName: string
  avatar: string
  contactType: string
  contact: string
}

export interface IEvaluate {
  inviteId: string
  sender: string
  receiver: string
  text: string
  rate1: number
  rate2: number
  rate3: number
  status: 3 | -2 | null
  only?: boolean // 仅评论（一方完成评论，另一方没有，另一方上传评论时设定 true）
}

export interface IShowEvaluate extends IEvaluate {
  inviteOwn: string
  userName: string
  avatar: string
  score: number
}
// 评价展示卡片
export interface IEvaluateCard {
  evaluateId: string
  userId: string
  userName: string
  avatar: string
  inviteId: string
  text: string
  createAt: string
  score: number
}
