import useTrendStore from './index'
import useDetailStore from './detail'
import useMainStore from '@/stores/module/main'
import type { IShowTrend, commentType } from './type'
import type { ITrend, IInteractData } from '@/service/trend-page/type'
import { formatPicUrl, objCompare } from '@/utils/data-format'
import type { IPostLikeData } from '@/service/comment/type'

// isBig 在用户主页展示时 大号一的封面比较清楚
export function formatTrendData(
  trend: IShowTrend,
  isBig = false,
  tempUrl: string[] = []
) {
  // 这个id 是避免出现 重复图片 vue KEY 报错
  trend.id = trend.trendId + Date.parse(String(new Date()))

  trend.avatar = formatPicUrl(trend.avatar, trend.userId, 'avatars', 's')
  trend.pics = trend.pics ? trend.pics : []
  // 排序后 拼接路径 保存
  trend.pics = trend.pics.sort(objCompare('sort'))
  for (let index = 0; index < trend.pics.length; index++) {
    const p = trend.pics[index]
    const temp = tempUrl[index]
    // 合成图片地址
    const picType = trend.type == 'aw' ? 'artworks' : 'trends'
    const size = p.width / p.height
    // 横图
    if (size >= 1) {
      const scale = p.height / 200
      p.height = 200
      p.width = p.width / scale
      //是否长图 size > 3
      const pSize = size > 3 ? 'm' : isBig ? 'm' : 's'
      p.preShowUrl = formatPicUrl(p.fileName, trend.userId, picType, pSize)
    } else {
      const scale = p.width / 180
      p.height = p.height / scale
      p.width = 180
      //是否长图 size < 0.35
      const pSize = size < 0.35 ? 'm' : isBig ? 'm' : 'xs'
      p.preShowUrl = formatPicUrl(p.fileName, trend.userId, picType, pSize)
    }
    const fileName = p.fileName
    p.preShowUrl = temp ?? p.preShowUrl
    p.fileName = temp ?? formatPicUrl(fileName, trend.userId, picType, 'l')
    p.highQuality =
      temp ?? formatPicUrl(fileName, trend.userId, picType, '', true)
    p.isShowHd = false
  }
  // \n 换成br
  trend.intro = trend.intro.split('\n').join('<br>')
  if (trend.forward) {
    trend.forward = formatTrendData(trend.forward as IShowTrend, isBig)
  }
  return trend
}

//保存作品评论数据
export function saveComment(data: commentType[]) {
  const store = useDetailStore()
  //如果小于20 一组说明这是最后一组评论
  if (data.length < 20) store.commentEnd = true
  store.zeroComment = false
  store.comments = data
  store.comments.forEach((item) => {
    item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
  })
}

//向评论数组里面继续添加根评论
export function addRootComment(data: commentType[]) {
  const store = useDetailStore()
  //如果小于20 一组说明这是最后一组评论
  if (data.length < 20) store.commentEnd = true
  data.forEach((item) => {
    item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
    store.comments.push(item)
  })
}

//发布完成后添加自己的评论
export function addOwnComment(comment: commentType) {
  const detailStore = useDetailStore()
  const trendStore = useTrendStore()

  const trend = trendStore.trends.find((i) => i.trendId == comment.ownId)
  if (trend) trend.count.comments += 1

  if (!detailStore.trendDetail) return
  comment.isNew = true
  //发布意味着不是0回复了
  detailStore.zeroComment = false
  //格式化头像地址
  comment.avatar = formatPicUrl(comment.avatar, comment.userId, 'avatars', 's')
  //在评论总数 +1
  detailStore.trendDetail.count.comments += 1
  //如果是直接评论作品 在最上面显示
  if (comment.rootId === '0') {
    detailStore.comments.unshift(comment)
    return
  }
  //如果回复的评论属于子评论
  detailStore.comments.forEach((item) => {
    if (item.cId === comment.rootId) {
      //属于子回复 则根回复的数据 +1
      item.rootCount++
      // 尝试查找 是不是回复里面的子评论 如是 index != undefine
      const index = item.childComments?.findIndex(
        (i) => i.cId === comment.replyId
      )
      if (index != undefined) {
        //如果是回复里面的子回复 在子回复下面显示
        item.childComments?.splice(index + 1, 0, comment)
      } else {
        //如果是回复根回复 在根回复下面显示
        item.childComments?.unshift(comment)
      }
    }
  })
  // 添加到子回复面板
  if (detailStore.commentDetail) {
    detailStore.commentDetail.rootCount++
    const childComments = detailStore.commentDetail.childComments

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

//修改选中的根评论中的子评论
export function changeChildComment(comment: commentType[]) {
  const store = useDetailStore()
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

// 发布完动态添加到第一条
export function unshiftToTrends(item: ITrend, forward: ITrend | undefined) {
  const store = useTrendStore()
  const mainStore = useMainStore()
  item.userName = mainStore.userName
  if (store.loadType == 'focus' || store.loadType == 'new') {
    store.trends.unshift(
      formatTrendData(item as IShowTrend, false, mainStore.tempImg)
    )
    item.avatar = mainStore.avatarUrl
    if (forward) item.forward = forward
  }
  mainStore.tempImg = []
}

// 处理评论点赞
export function handleCommentLike(data: IPostLikeData) {
  const isLike = !data.isCancel
  const store = useDetailStore()
  for (let index = 0; index < store.comments.length; index++) {
    const item = store.comments[index]
    if (item.cId === data.cId) {
      item.isLike = isLike
      if (isLike) item.likes += 1
      if (!isLike) item.likes -= 1
      break
    }
    const child = item.childComments?.find((i) => i.cId == data.cId)
    if (child) {
      child.isLike = isLike
      if (isLike) child.likes += 1
      if (!isLike) child.likes -= 1
    }
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

// 删除评论
export function handleCommentDelete(cId: string) {
  const store = useDetailStore()
  for (let index = 0; index < store.comments.length; index++) {
    const item = store.comments[index]
    if (item.cId === cId) {
      item.text = '「该评论已删除」'
      item.isDelete = true
      item.childComments = []
      item.rootCount = 0
      break
    }
    const child = item.childComments?.find((i) => i.cId == cId)
    if (child) {
      child.text = '「该评论已删除」'
      child.isDelete = true
    }
  }
  // 使用评论详情面板的时候
  if (!store.commentDetail) return
  if (cId == store.commentDetail.cId) {
    store.commentDetail.text = '「该评论已删除」'
    store.commentDetail.isDelete = true
    store.commentDetail.childComments = []
    store.commentDetail.rootCount = 0
    return
  }
  const child = store.commentDetail.childComments?.find((i) => i.cId == cId)
  if (child) {
    child.text = '「该评论已删除」'
    child.isDelete = true
  }
}
//处理点赞
export const handleLike = async (data: IInteractData) => {
  const trendStore = useTrendStore()
  const detailStore = useDetailStore()

  const forward = trendStore.trends.find(
    (i) => i.forward?.trendId == data.msgId
  )
  const detail = detailStore.trendDetail
  const item = trendStore.trends.find((i) => i.trendId == data.msgId)!
  if (!data.isCancel) {
    item.count.likes++
    item.interact.isLike = true
    if (detail) {
      detail.count.likes++
      detail.interact.isLike = true
    }
    if (forward) {
      forward.forward!.count.likes++
      forward.forward!.interact.isLike = true
    }
  } else {
    item.count.likes--
    item.interact.isLike = false
    if (detail) {
      detail.count.likes--
      detail.interact.isLike = false
    }
    if (forward) {
      forward.forward!.count.likes--
      forward.forward!.interact.isLike = false
    }
  }
}
