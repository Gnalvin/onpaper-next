import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type {
  IArtworkFormData,
  IArtworkInfoData,
  IInteractResult,
  updateArtInfo
} from './type'

enum mainAPI {
  PostSaveArtworkAPI = '/save/artwork',
  GetArtworkInfoAPI = '/artwork/info',
  GetAuthorOtherArtAPI = '/artwork/other',
  PostCollectAPI = '/user/collect',
  PostLikeAPI = '/user/like',
  PostUserFocusAPI = '/user/focus',
  UpdateArtInfoAPI = '/artwork/info',
  DeleteArtInfoAPI = '/artwork/delete'
}

// 保存作品信息 请求
export function saveArtworkInfoRequest(data: IArtworkFormData) {
  return wlRequest.post<IResultType<{ artworkId: string }>>({
    url: mainAPI.PostSaveArtworkAPI,
    data: data
  })
}

// 获取作品信息请求
export function getArtworkInfoRequest(artid: string) {
  return wlRequest.get<IResultType<IArtworkInfoData>>({
    url: mainAPI.GetArtworkInfoAPI,
    params: { artid }
  })
}

//收藏作品请求
export function postArtworkCollectRequest(
  artworkId: string,
  authorId: string,
  isCancel: boolean,
  force = false
) {
  return wlRequest.post<IResultType<IInteractResult>>({
    url: mainAPI.PostCollectAPI,
    data: { msgId: artworkId, isCancel, authorId, type: 'aw', force }
  })
}

//点赞作品请求
export function postArtworkLikeRequest(
  artworkId: string,
  authorId: string,
  isCancel: boolean
) {
  return wlRequest.post<IResultType<IInteractResult>>({
    url: mainAPI.PostLikeAPI,
    data: { msgId: artworkId, isCancel, authorId, type: 'aw' }
  })
}

// 更新作品信息
export function updateArtworkInfoRequest(data: updateArtInfo) {
  return wlRequest.patch<IResultType<updateArtInfo>>({
    url: mainAPI.UpdateArtInfoAPI,
    data: data
  })
}

// 删除作品
export function deleteArtworkInfoRequest(artid: string) {
  return wlRequest.delete<IResultType>({
    url: mainAPI.DeleteArtInfoAPI,
    params: { artid }
  })
}
