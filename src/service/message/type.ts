export interface IChatRelation {
  sender: IUserInfo
  receiver: IUserInfo
  chatId: string
  unread: number
  message: IMessage[]
}

export interface IMessage {
  chatId?: string
  msgId: string
  sender: string
  receiver: string
  content: string
  msgType: string
  sendTime: string
  showTime?: string
  width?: number
  height?: number
}

export type IUserInfo = {
  userId: string
  userName: string
  avatar: string
}

export type IQueryMsgRecord = {
  sender: string
  receiver: string
  chatid: string
  nextid: string
}

export type ISendMessage = {
  sender: string
  receiver: string
  content: string
  msgType: string
  width?: number
  height?: number
}
