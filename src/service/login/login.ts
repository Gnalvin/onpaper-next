import wlRequest from '../index' //拿到创建的网络请求实例
import type {
  IPhoneLoginInfo,
  IUserEmail,
  ILogin,
  ILoginResult,
  ISignUpRespondData,
  ILoginByEmail
} from './type'
import type { IResultType } from '../type'
import { encryptInterceptors } from '@/service/utils/encrypt'

enum LoginAPI {
  LoginByPhone = '/auth/login/phone', // 用户手机登陆接口
  LoginByPassword = '/auth/login/password', // 用户密码登录
  LoginByEmail = '/auth/login/email', // 用户邮箱登录
  VerifyEmail = '/auth/emailexist', // 验证邮箱是否存在
  GetPhoneCode = '/auth/phonecode', // 获取手机验证码
  GetEmailCode = '/auth/emailcode' // 获取邮件验证码
}

// 注册用户 请求函数 <IResultType> 定义返回数据的类型
export function userSignUpRequest(registerInfo: IPhoneLoginInfo) {
  return wlRequest.post<IResultType<ISignUpRespondData>>({
    url: LoginAPI.LoginByPhone,
    data: registerInfo
  })
}

// 判断邮箱是否存在
export function verifyEmailRequest(userEmail: IUserEmail) {
  return wlRequest.get<IResultType>({
    url: LoginAPI.VerifyEmail,
    params: userEmail
  })
}

// 发送登录请求
export function loginRequest(loginInfo: ILogin) {
  return wlRequest.post<IResultType<ILoginResult>>({
    url: LoginAPI.LoginByPassword,
    data: loginInfo
  })
}

//获取手机验证码
export function getPhoneCodeRequest(phone: string, code: string) {
  return wlRequest.get<IResultType<{ status: string }>>({
    url: LoginAPI.GetPhoneCode,
    params: { phone, code },
    interceptors: {
      requestInterceptors: encryptInterceptors
    }
  })
}

//获取邮件验证码
export function getEmailCodeRequest(email: string) {
  return wlRequest.get<IResultType<{ status: string }>>({
    url: LoginAPI.GetEmailCode,
    params: { email },
    interceptors: {
      requestInterceptors: encryptInterceptors
    }
  })
}

// 通过邮件验证码登陆
export function loginByEmailRequest(data: ILoginByEmail) {
  return wlRequest.post<IResultType<ILoginResult>>({
    url: LoginAPI.LoginByEmail,
    data: data
  })
}
