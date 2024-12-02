import wlRequest from '../../index' //拿到创建的网络请求实例
import type { IResultType } from '../../type'
import type {
  IUserId,
  IProfileData,
  ICallBackData,
  IUploadFileResult,
  IUpdateData
} from './type'

enum mainAPI {
  GetProfileAPI = '/user/profile',
  PostSaveAvatarAPI = '/save/avatar',
  UpdateUserProfile = '/user/profile',
  VerifyName = '/auth/verifyname' // 验证用户名是否存在
}

// 个人数据的请求 背景,头像,个人介绍等
export function getUserProfileRequest(userId: IUserId) {
  return wlRequest.get<IResultType<IProfileData>>({
    url: mainAPI.GetProfileAPI,
    params: userId
  })
}

// 保存头像图片信息 请求
export function saveAvatarInfoRequest(data: ICallBackData) {
  return wlRequest.post<IResultType<IUploadFileResult>>({
    url: mainAPI.PostSaveAvatarAPI,
    data: data
  })
}

//更新用户资料
export function updateUserProfileRequest(data: IUpdateData) {
  return wlRequest.patch<IResultType<IUpdateData>>({
    url: mainAPI.UpdateUserProfile,
    data: data
  })
}

// 判断用户名是否存在
export function userNameVerifyRequest(userName: string) {
  return wlRequest.get<IResultType>({
    url: mainAPI.VerifyName,
    params: { username: userName }
  })
}
