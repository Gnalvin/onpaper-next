import type { IChatRelation, IMessage } from '@/service/message/type'

export interface IMessageState {
  chatList: IChatRelation[]
  messageRecord: IRecord[]
  messageEnd: boolean
  chatListEnd: boolean
  isLoading: boolean
  tipMsg: string
  noReceiveMsg: boolean
  senderText: string
}

export interface IRecord extends IMessage {
  uploadFail?: boolean
  uploading?: boolean
}
