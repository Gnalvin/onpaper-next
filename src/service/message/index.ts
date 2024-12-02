import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type {
  IChatRelation,
  IMessage,
  IQueryMsgRecord,
  ISendMessage
} from './type'

enum mainAPI {
  GetChatListAPI = '/message/chat',
  GetChatRecordAPI = '/message/record',
  SendMessageAPI = '/message/send'
}

// 请求私信会话列表数据
export function getChatListRequest(nextid = '0') {
  return wlRequest.get<IResultType<IChatRelation[]>>({
    url: mainAPI.GetChatListAPI,
    params: { nextid }
  })
}

// 请求聊天记录数据
export function getChatRecordRequest(data: IQueryMsgRecord) {
  return wlRequest.get<IResultType<IMessage[]>>({
    url: mainAPI.GetChatRecordAPI,
    params: data
  })
}

// 发送私信
export function postSendMessageRequest(data: ISendMessage) {
  return wlRequest.post<IResultType<IMessage>>({
    url: mainAPI.SendMessageAPI,
    data: data
  })
}
