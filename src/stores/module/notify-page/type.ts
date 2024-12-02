import type { IUnreadCount, INotifyBody } from '@/service/notify-page/type'
import type { ICommentType } from '@/service/comment/type'

export interface INotifyState {
  notifyType: 'likeAndCollect' | 'focus' | 'comment' | 'commission'
  unread: IUnreadCount
  notify: INotifyBody[]
  isEnd: boolean
  noHavMsg: boolean
  commentDetail: commentType | null
  childCommentEnd: boolean
}

export interface commentType extends ICommentType {
  //是否是新添加的回复
  isNew?: boolean
}
