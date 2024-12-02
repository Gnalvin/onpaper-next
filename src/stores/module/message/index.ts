import { defineStore } from 'pinia'
import useMainStore from '../main'
import type { IMessageState, IRecord } from './type'
import {
  getChatListRequest,
  getChatRecordRequest,
  postSendMessageRequest
} from '@/service/message'
import { formatChatListTime, formaMessageTime } from './handle'
import { formatPicUrl } from '@/utils/data-format'
import { addImgSuffix } from '@/utils/handle-img'
import type { ISendMessage } from '@/service/message/type'
import { notification } from '@/components/notification'
import { getOssClient } from '@/utils/get-sts'

const useMessageStore = defineStore('message', {
  state: (): IMessageState => ({
    chatList: [],
    messageRecord: [],
    messageEnd: false,
    chatListEnd: false,
    isLoading: false,
    tipMsg: '',
    noReceiveMsg: true,
    senderText: ''
  }),
  actions: {
    // 获取会话列表
    async getChatListAction() {
      const lastItem = this.chatList[this.chatList.length - 1]
      const nextid = lastItem ? lastItem.chatId : '0'
      const res = await getChatListRequest(nextid)
      if (res.status === 200) {
        res.data?.forEach((item) => {
          const { userId: sId, avatar: sAvatar } = item.sender
          const { userId: rId, avatar: rAvatar } = item.receiver
          item.sender.avatar = formatPicUrl(sAvatar, sId, 'avatars', 's')
          item.receiver.avatar = formatPicUrl(rAvatar, rId, 'avatars', 's')
          item.message[0].sendTime = formatChatListTime(
            item.message[0].sendTime
          )
          this.chatList.push(item)
        })
        // 小于30条说明到底
        if (!res.data || res.data.length < 30) this.chatListEnd = true
      }
    },
    // 查找聊天记录
    async getMessageRecordAction(sender: string, receiver: string) {
      const lastMsg = this.messageRecord[0]
      const nextid = lastMsg ? lastMsg.msgId : '0'
      const chatid = lastMsg ? lastMsg.chatId! : '0'
      const query = { sender, receiver, nextid, chatid }
      const res = await getChatRecordRequest(query)
      const status = [200, 1007, 1026]
      if (status.indexOf(res.status) !== -1) {
        const listLength = res.data.length
        for (let i = 0; i < listLength; i++) {
          const item = res.data[i]
          // 对比时间 相差不超过5分钟的 不显示时间
          const time = i == listLength - 1 ? '' : res.data[i + 1].sendTime
          item.showTime = formaMessageTime(item.sendTime, time)
          if (item.msgType == 'pic') {
            item.content = formatPicUrl(item.content, item.sender, 'messages')
          }
          this.messageRecord.unshift(item)
        }
        // 小于20条说明到底
        if (listLength < 20) this.messageEnd = true
      }
      if (res.status === 200) this.noReceiveMsg = false
      if (res.status === 1007) this.tipMsg = '对方不接受任何人的私信'
      if (res.status === 1026) this.tipMsg = '对方仅允许他关注的人发送私信'
    },
    // 发送聊天
    async sendMessageAction(data: ISendMessage) {
      const res = await postSendMessageRequest(data)
      if (res.status === 200) {
        const newMsg = this.messageRecord[this.messageRecord.length - 1]
        const lastTime = newMsg ? newMsg.sendTime : ''
        res.data.showTime = formaMessageTime(res.data.sendTime, lastTime)
        this.messageRecord.push(res.data)
        const chatItem = this.chatList.find((i) => i.chatId === res.data.chatId)
        if (chatItem) {
          chatItem.message[0].content = res.data.content
          chatItem.message[0].sendTime = formatChatListTime(res.data.sendTime)
        }
      } else {
        notification({
          type: 'error',
          title: '发送私信',
          message: '消息发送失败'
        })
      }
    },
    async uploadImgAction(imgData: Blob, msg: IRecord) {
      const mainStore = useMainStore()
      // 模拟一条数据
      const newMsg = this.messageRecord[this.messageRecord.length - 1]
      const lastTime = newMsg ? newMsg.sendTime : ''
      msg.showTime = formaMessageTime(msg.sendTime, lastTime)
      this.messageRecord.push(msg)
      // 之后使用这个 改变状态才有响应式
      const msgData = this.messageRecord.find((i) => i.msgId === msg.msgId)!
      //获取上传凭证
      await mainStore.getSTSTokenAction({ type: 'messages', count: 1 })
      //创建 oss 实例
      const oss = getOssClient(mainStore.sts, 'preview')
      //图片后缀
      const suffix = addImgSuffix(imgData.type)
      const fileName = mainStore.sts.fileName.pop()! + suffix
      const path = 'messages/' + mainStore.userId + '/' + fileName

      msgData.uploading = true
      try {
        oss.put(path, imgData)
      } catch (e) {
        msgData.uploadFail = true
        return
      }

      // 图片上传成功后 发送消息到服务器保存
      const res = await postSendMessageRequest({ ...msg, content: fileName })
      if (res.status === 200) {
        msgData.chatId = res.data.chatId
        msgData.msgId = res.data.msgId
        msgData.uploading = false
      } else {
        msgData.uploadFail = true
      }
      // 改变会话列表显示
      const chatItem = this.chatList.find((i) => i.chatId === res.data.chatId)
      if (chatItem) {
        chatItem.message[0].content = '[图片]'
        chatItem.message[0].sendTime = formatChatListTime(res.data.sendTime)
      }
    }
  }
})

export default useMessageStore
