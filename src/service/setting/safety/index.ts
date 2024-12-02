import wlRequest from '../../index' //拿到创建的网络请求实例
import type { IResultType } from '../../type'
import type {
  IUserBinding,
  IPasswordResult,
  IEmailResult,
  IPhoneResult
} from './type'
import { encryptInterceptors } from '@/service/utils/encrypt'

enum mainAPI {
  GetUserBindingAPI = '/auth/binding',
  GetSafetyPhoneCodeAPI = '/auth/code',
  GetAuthTokenAPI = '/auth/owner',
  PatchBindingEmail = '/auth/change/email',
  PatchPassword = '/auth/change/password',
  PatchBindingPhone = '/auth/change/phone',
  VerifyPhoneExists = '/auth/phoneexist',
  SendCodeToNewPhone = '/auth/newphone'
}

// 个人数据的请求 背景,头像,个人介绍等
export function getUserBindingRequest() {
  return wlRequest.get<IResultType<IUserBinding>>({
    url: mainAPI.GetUserBindingAPI
  })
}

// 验证手机是否存在过
export function getVerifyPhoneExistRequest(phone: string) {
  return wlRequest.get<IResultType<{ isExist: boolean }>>({
    url: mainAPI.VerifyPhoneExists,
    params: { phone }
  })
}

// 发送验证码到绑定手机
export function getSafetyPhoneCodeRequest() {
  return wlRequest.get<IResultType<{ status: 'ok' }>>({
    url: mainAPI.GetSafetyPhoneCodeAPI,
    params: {},
    interceptors: {
      requestInterceptors: encryptInterceptors
    }
  })
}

// 发送验证码到新的手机
export function getSendCodeToNewPhoneRequest(phone: string) {
  return wlRequest.get<IResultType<{ status: 'ok' }>>({
    url: mainAPI.SendCodeToNewPhone,
    params: { phone },
    interceptors: {
      requestInterceptors: encryptInterceptors
    }
  })
}

// 验证绑定手机验证码
export function getAuthTokenRequest(phone: string, code: string) {
  return wlRequest.get<IResultType<{ token: string }>>({
    url: mainAPI.GetAuthTokenAPI,
    params: { phone, code }
  })
}

// 改变绑定邮箱
export function patchBindingEmailRequest(
  email: string,
  code: string,
  token: string
) {
  return wlRequest.patch<IResultType<IEmailResult>>({
    url: mainAPI.PatchBindingEmail,
    data: { email, code, token }
  })
}
// 修改密码
export function patchPasswordRequest(password: string, token: string) {
  return wlRequest.patch<IResultType<IPasswordResult>>({
    url: mainAPI.PatchPassword,
    data: { password, token }
  })
}
// 修改绑定手机
export function patchBindingPhoneRequest(
  phone: string,
  code: string,
  token: string
) {
  return wlRequest.patch<IResultType<IPhoneResult>>({
    url: mainAPI.PatchBindingPhone,
    data: { phone, code, token }
  })
}
