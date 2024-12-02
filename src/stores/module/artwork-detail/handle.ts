import useArtworkStore from './index'
import useMainStore from '../main'

import type { IArtworkInfoData } from '@/service/artwork/type'
import { formatPicUrl, objCompare } from '@/utils/data-format'
import { hasOwn } from '@/utils/verify-type'
import type { commentType } from './type'
import type { IPostLikeData } from '@/service/comment/type'

//保存请求到的 作品信息
export function saveArtInfo(data: IArtworkInfoData) {
  const store = useArtworkStore()
  const mainStore = useMainStore()
  //解构需要的数据
  const { avatarName, userId } = data
  for (const key in data) {
    if (hasOwn(store.artInfo, key)) {
      const item = data[key]
      store.artInfo[key] = item
    }
  }
  // 合成 图片地址
  store.artInfo.avatarName = formatPicUrl(avatarName, userId, 'avatars', 's')
  // 排序后 拼接路径 保存
  store.artworks = data.picture.sort(objCompare('sort'))
  for (let index = 0; index < store.artworks.length; index++) {
    const item = store.artworks[index]
    const fileName = item.fileName
    // 如果是上传完跳转到作品页 这里会有上传到图片 使用这个 服务器可能没有压缩这么快
    const tempUrl = mainStore.tempImg[index]
    item.fileName = tempUrl ?? formatPicUrl(fileName, userId, 'artworks', 'l')
    item.smallFile = tempUrl ?? formatPicUrl(fileName, userId, 'artworks', 's')
    item.smallFile = tempUrl ?? item.smallFile.replace('/webp', '/blur')
    item.highQuality =
      tempUrl ?? formatPicUrl(fileName, userId, 'artworks', '', true)
    item.isShow = false
    item.isShowHd = false
  }
  mainStore.tempImg = []
  store.authorOtherArt = data.otherArtwork ?? []
  store.authorOtherArt.forEach((item) => {
    item.cover = formatPicUrl(item.cover, userId, 'cover', 'm')
  })
  //首先显示一张
  store.artworks[0].isShow = true
  if (userId === mainStore.userId) {
    // 如果是自己的作品 把关注设置成true 解除粉丝评论限制
    store.artInfo.interact.isFocusAuthor = 1
    store.isOwn = true
  }
}

//保存作品评论数据
export function saveComment(data: commentType[]) {
  const store = useArtworkStore()
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
  const store = useArtworkStore()
  //如果小于20 一组说明这是最后一组评论
  if (data.length < 20) store.commentEnd = true
  data.forEach((item) => {
    item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
    store.comments.push(item)
  })
}

//修改选中的根评论中的子评论
export function changeChildComment(cid: string, comment: commentType[]) {
  const store = useArtworkStore()
  //如果小于20 一组说明这是最后一组评论
  if (comment.length < 20) store.childCommentEnd = true
  store.comments.forEach((item) => {
    //找到请求的根评论
    if (item.cId === cid) {
      //将之前的评论保存
      store.tempComments = item.childComments!
      //赋值新的子评论
      item.childComments = comment
      //赋值查找 replyUser 回复的名字
      item.childComments?.forEach((item) => {
        if (item.replyId === '0') return
        const tempItem = comment.find((i) => {
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
  })
}

//继续添加子评论
export function addChildComment(cid: string, data: commentType[]) {
  const store = useArtworkStore()
  //如果小于20 一组说明这是最后一组评论
  if (data.length < 20) store.childCommentEnd = true
  const item = store.comments.find((i) => i.cId === cid) as commentType
  item.childComments?.push(...data)
  item.childComments?.forEach((ic) => {
    if (ic.replyId === '0') return
    const tempItem = item!.childComments?.find((i) => {
      return i.cId === ic.replyId
    })
    // 理论上不会找不到 如果找不到 设置成单独回复
    if (!tempItem) {
      console.warn(`no fount replyId ${item.replyId}`, item)
      item.replyId = '0'
      return
    }
    ic.replyUserName = tempItem!.userName
    ic.replyUserId = tempItem!.userId
  })
}

//重新赋值给根评论
export function reSetComment(cid: string) {
  const store = useArtworkStore()
  //返回查看所有根评论 意味着重置 子评论的数据
  store.childCommentEnd = false
  //重新赋值
  store.comments.forEach((item) => {
    if (item.cId === cid) {
      item.childComments = store.tempComments
    }
  })
  store.tempComments = []
}

//发布完成后添加自己的评论
export function addOwnComment(comment: commentType) {
  const store = useArtworkStore()
  comment.isNew = true
  //发布意味着不是0回复了
  store.zeroComment = false
  //格式化头像地址
  comment.avatar = formatPicUrl(comment.avatar, comment.userId, 'avatars', 's')
  //如果是直接评论作品 在最上面显示
  if (comment.rootId === '0') {
    store.comments.unshift(comment)
    return
  }
  //如果回复的评论属于子评论
  store.comments.forEach((item) => {
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
}
// 处理评论点赞
export function handleCommentLike(data: IPostLikeData) {
  const isLike = !data.isCancel
  const store = useArtworkStore()
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

  for (let index = 0; index < store.tempComments.length; index++) {
    const item = store.tempComments[index]
    if (item.cId === data.cId) {
      item.isLike = isLike
      if (isLike) item.likes += 1
      if (!isLike) item.likes -= 1
      break
    }
  }
}

// 删除评论
export function handleCommentDelete(cId: string) {
  const store = useArtworkStore()
  for (let index = 0; index < store.comments.length; index++) {
    const item = store.comments[index]
    if (item.cId === cId) {
      item.text = '「该评论已删除」'
      item.isDelete = true
      item.childComments = []
      item.rootCount = 0
      store.tempComments = []
      break
    }
    const child = item.childComments?.find((i) => i.cId == cId)
    if (child) {
      child.text = '「该评论已删除」'
      child.isDelete = true
    }
  }

  for (let index = 0; index < store.tempComments.length; index++) {
    const item = store.tempComments[index]
    if (item.cId === cId) {
      item.text = '「该评论已删除」'
      item.isDelete = true
      break
    }
  }
}
