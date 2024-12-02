import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type {
  IUploadFileResult,
  IUserId,
  IUserProfileResult,
  ICallBackData,
  IHomeArtworkResult,
  ICollectArtwork
} from './type'
import type { ITrend } from '../trend-page/type'
import router from '@/router'

enum mainAPI {
  PostSaveAvatarAPI = '/save/avatar',
  PostSaveBannerAPI = '/save/banner',
  DeleteBannerAPI = 'delete/banner',
  GetProfileAPI = '/user/profile',
  UpdateProfileApi = '/user/profile',
  GetHomeArtwork = '/user/profile/artwork',
  GetHomeCollect = '/user/profile/collect',
  GetHomeTrend = '/trend/user',
  PostUserFocusAPI = '/user/focus'
}

// 保存背景图片信息 请求
export function saveBannerInfoRequest(data: ICallBackData) {
  return wlRequest.post<IResultType<IUploadFileResult>>({
    url: mainAPI.PostSaveBannerAPI,
    data: data
  })
}

// 保存头像图片信息 请求
export function saveAvatarInfoRequest(data: ICallBackData) {
  return wlRequest.post<IResultType<IUploadFileResult>>({
    url: mainAPI.PostSaveAvatarAPI,
    data: data
  })
}

// 主页数据的请求 背景,头像,个人介绍等
export function getUserProfileRequest(userId: IUserId) {
  return wlRequest.get<IResultType<IUserProfileResult>>({
    url: mainAPI.GetProfileAPI,
    params: userId,
    interceptors: {
      responseInterceptors: (res) => {
        // 如果 请求的主页数据是错的用户id 跳转到 404
        if (res.status == 1003) {
          router.push({ name: 'NotFount' })
        }
        return res
      }
    }
  })
}

// 删除个人主页背景
export function deleteUserBannerRequest(fileName: string) {
  return wlRequest.delete<IResultType>({
    url: mainAPI.DeleteBannerAPI,
    data: { bannerName: fileName }
  })
}

// 获取主页作品信息
export function getUserHomeArtworkRequest(
  userId: string,
  page: number,
  sort: 'like' | 'collect' | 'now'
) {
  return wlRequest.get<IResultType<IHomeArtworkResult>>({
    url: mainAPI.GetHomeArtwork,
    params: { id: userId, page, sort }
  })
}

//获取主页收藏作品信息
export function getUserHomeCollectRequest(userId: string, page: number) {
  return wlRequest.get<IResultType<ICollectArtwork[] | null>>({
    url: mainAPI.GetHomeCollect,
    params: { uid: userId, page }
  })
}

// 获取主页动态
export function getUserHomeTrendRequest(userId: string, next: string) {
  return wlRequest.get<IResultType<ITrend[]>>({
    url: mainAPI.GetHomeTrend,
    params: { uid: userId, next }
  })
}
