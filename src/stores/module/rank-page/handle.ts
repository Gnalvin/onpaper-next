import useRankPageStore from './index'
import type { artPayloadType, userPayloadType, IPostFocusResult } from './type'
import type { IArtwork, IUserInfo } from '@/service/rank-page/type'
import { formatPicUrl } from '@/utils/data-format'

function formatArtUrl(payload: IArtwork[]) {
  payload.forEach((item) => {
    // 拼接 图像地址
    item.cover = formatPicUrl(item.cover, item.userId, 'cover', 'm')
    item.userAvatar = formatPicUrl(item.userAvatar, item.userId, 'avatars', 's')
  })
  return payload
}

function formatUserUrl(payload: IUserInfo[]) {
  payload.forEach((item) => {
    // 拼接 图像地址
    item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
    item.artworks?.forEach((art) => {
      art.cover = formatPicUrl(art.cover, item.userId, 'cover', 'm')
    })
  })
  return payload
}
//保存作品排行
export function saveArtworkData(payload: artPayloadType) {
  const store = useRankPageStore()
  const { rankType, artworks } = payload
  switch (rankType) {
    case 'today':
      store.artDayRank = formatArtUrl(artworks)
      break
    case 'week':
      store.artWeekRank = formatArtUrl(artworks)
      break
    default:
      store.artMonthRank = formatArtUrl(artworks)
      break
  }
}
//保存作者排行
export function saveUserData(payload: userPayloadType) {
  const store = useRankPageStore()
  const { rankType, userInfo } = payload
  switch (rankType) {
    case 'like':
      store.userLikeRank = formatUserUrl(userInfo)
      break
    case 'collect':
      store.userCollectRank = formatUserUrl(userInfo)
      break
    case 'girl':
      store.userGirlRank = formatUserUrl(userInfo)
      break
    case 'boy':
      store.userBoyRank = formatUserUrl(userInfo)
      break
    default:
      store.userNewRank = formatUserUrl(userInfo)
      break
  }
}

//关注后改变此 用户卡片的 关注状态
export function changeFocus(payload: IPostFocusResult) {
  const store = useRankPageStore()
  // 每一个user有关的列表都要循环 因为可能同一个用户出现在不同排名
  const needLoop = [
    store.userLikeRank,
    store.userCollectRank,
    store.userGirlRank,
    store.userBoyRank,
    store.userNewRank
  ]
  needLoop.forEach((storeList) => {
    const length = storeList.length
    for (let index = 0; index < length; index++) {
      const item = storeList[index]
      if (item.userId === payload.data.focusId) {
        if (!payload.data.isCancel) {
          item.isFocus = 1
        } else {
          item.isFocus = 0
        }
        break
      }
    }
  })
}
