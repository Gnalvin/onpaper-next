import useNotifyStore from './index'
import type { commentType } from './type'
import type { IPostLikeData } from '@/service/comment/type'
import { formatPicUrl } from '@/utils/data-format'

//修改选中的根评论中的子评论
export function changeChildComment(comment: commentType[]) {
  const store = useNotifyStore()
  //如果小于20 一组说明这是最后一组评论
  if (comment.length < 20) store.childCommentEnd = true
  const cDetail = store.commentDetail!
  //赋值新的子评论
  cDetail.childComments?.push(...comment)
  //赋值查找 replyUser 回复的名字
  cDetail.childComments?.forEach((item) => {
    if (item.replyId === '0') return
    const tempItem = cDetail.childComments!.find((i) => {
      return i.cId === item.replyId
    })
    // 理论上不会找不到 如果找不到 设置成单独回复
    if (!tempItem) {
      console.warn(`no fount replyId ${item.replyId}`, item)
      item.replyId = '0'
      return
    }
    item.replyUserName = tempItem!.userName
    item.replyUserId = tempItem!.userId
  })
}

//发布完成后添加自己的评论
export function addOwnComment(comment: commentType) {
  const store = useNotifyStore()
  if (!store.commentDetail) return
  comment.isNew = true
  //格式化头像地址
  comment.avatar = formatPicUrl(comment.avatar, comment.userId, 'avatars', 's')

  // 添加到子回复面板
  if (store.commentDetail) {
    store.commentDetail.rootCount++
    const childComments = store.commentDetail.childComments
    // 尝试查找 是不是回复里面的子评论 如是 index != undefine
    const index = childComments!.findIndex((i) => i.cId === comment.replyId)
    if (index != undefined) {
      //如果是回复里面的子回复 在子回复下面显示
      childComments!.splice(index + 1, 0, comment)
    } else {
      //如果是回复根回复 在根回复下面显示
      childComments!.unshift(comment)
    }
  }
}

// 处理评论点赞
export function handleCommentLike(data: IPostLikeData) {
  const isLike = !data.isCancel
  const store = useNotifyStore()
  // 如果是在查看评论提醒时 还需要把消息列表的也同步
  if (store.notifyType == 'comment') {
    const item = store.notify.find((i) => i.content.sendCId == data.cId)
    if (item) item.content.isLike = isLike
  }
  // 使用评论详情面板的时候
  if (!store.commentDetail) return
  if (data.cId == store.commentDetail.cId) {
    store.commentDetail.isLike = isLike
    if (isLike) store.commentDetail.likes += 1
    if (!isLike) store.commentDetail.likes -= 1
    return
  }
  const child = store.commentDetail.childComments?.find(
    (i) => i.cId == data.cId
  )
  if (child) {
    child.isLike = isLike
    if (isLike) child.likes += 1
    if (!isLike) child.likes -= 1
  }
}
