import { defineStore } from 'pinia'
import type { IRankPageState, focusPayloadType, userRankType } from './type'
import {
  getArtworkRankRequest,
  getUserRankRequest
} from '@/service/rank-page/rank-page'
import { postUserFocusRequest } from '@/service/common'
import { saveArtworkData, saveUserData, changeFocus } from './handle'
import { notification } from '@/components/notification'

const useRankPageStore = defineStore('rankPage', {
  state: (): IRankPageState => ({
    artDayRank: [],
    artWeekRank: [],
    artMonthRank: [],
    userLikeRank: [],
    userCollectRank: [],
    userGirlRank: [],
    userBoyRank: [],
    userNewRank: []
  }),
  actions: {
    //获取作品排行数据
    async getArtworkRankAction(payload: string) {
      const result = await getArtworkRankRequest(payload)
      if (result.status === 200) {
        const data = { artworks: result.data, rankType: payload }
        saveArtworkData(data)
      }
    },
    //获取用户排行数据
    async getUserRankAction(payload: userRankType) {
      const result = await getUserRankRequest(payload)
      if (result.status === 200) {
        const data = { userInfo: result.data, rankType: payload }
        saveUserData(data)
      }
    },
    //关注作者请求
    async postUserFocusAction(payload: focusPayloadType) {
      const isCancel = payload.isFocus > 0
      const result = await postUserFocusRequest(payload.userId, isCancel)
      //请求成功后处理
      if (result.status === 200) {
        const focusData = { data: result.data, rankType: payload.rankType }
        changeFocus(focusData)
        if (!result.data.isCancel) {
          notification({
            type: 'success',
            title: '关注画师',
            message: '关注成功~'
          })
        } else {
          notification({
            type: 'success',
            title: '关注画师',
            message: '取消关注成功~'
          })
        }
      }
    }
  }
})

export default useRankPageStore
