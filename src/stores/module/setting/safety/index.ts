import { defineStore } from 'pinia'
import type { ISafetySettingState } from './type'
import {
  getUserBindingRequest,
  getSafetyPhoneCodeRequest,
  getAuthTokenRequest,
  patchBindingEmailRequest,
  patchPasswordRequest,
  getVerifyPhoneExistRequest,
  getSendCodeToNewPhoneRequest,
  patchBindingPhoneRequest
} from '@/service/setting/safety'
import { verifyEmailRequest, getEmailCodeRequest } from '@/service/login/login'
import { handleChangeToken } from './handle'
import { notification } from '@/components/notification'

const useSafetyStore = defineStore('safetySetting', {
  state: (): ISafetySettingState => ({
    phone: '',
    email: '',
    password: false,
    sendCodeStatus: 'unknown',
    waiting: false,
    token: '',
    verifyEmailStatus: 'unknown',
    verifyPhoneStatus: 'unknown'
  }),
  actions: {
    // 获取用户绑定信息
    async getUserBindingInfoAction() {
      const res = await getUserBindingRequest()
      if (res.status === 200) {
        const { phone, email, password } = res.data
        this.email = email ? email : ''
        this.phone = phone
        this.password = Boolean(password)
      }
    },
    // 向绑定手机发送验证码
    async getSafetyPhoneCodeAction() {
      const res = await getSafetyPhoneCodeRequest()
      if (res.status !== 200) {
        notification({
          type: 'error',
          title: '验证码',
          message: '验证码发送失败'
        })
      }
    },
    // 发送验证码到新手机
    async getSendCodeToNewPhoneAction(phone: string) {
      const res = await getSendCodeToNewPhoneRequest(phone)
      if (res.status !== 200) {
        notification({
          type: 'error',
          title: '验证码',
          message: '验证码发送失败'
        })
      }
    },
    // 验证绑定手机验证码
    async authSafetyCodeAction(code: string) {
      const res = await getAuthTokenRequest(this.phone, code)
      if (res.status === 200) {
        this.token = res.data.token
      }
      return res
    },
    //验证邮箱是否存在
    async verifyEmailExistAction(email: string) {
      // 每次请求前重置状态
      this.verifyEmailStatus = 'unknown'
      const res = await verifyEmailRequest({ email })
      // 如果 返回的状态码 1009 邮箱存在
      if (res.status == 1009) {
        this.verifyEmailStatus = 'fail'
      }
      // 如果 返回的状态码 1010 邮箱不存可以绑定
      if (res.status === 1010) {
        this.verifyEmailStatus = 'success'
      }
    },
    //获取邮箱验证码
    async getEmailCode(email: string) {
      // 每次请求前重置状态
      this.sendCodeStatus = 'unknown'
      const res = await getEmailCodeRequest(email)
      if (res.status === 200) {
        this.sendCodeStatus = 'success'
      } else {
        this.sendCodeStatus = 'fail'
      }
    },
    // 更换绑定邮箱
    async changeBindingEmailAction(email: string, code: string) {
      this.waiting = true
      const res = await patchBindingEmailRequest(email, code, this.token)
      this.waiting = false
      if (res.status == 200) {
        const { accessToken, refreshToken, email } = res.data
        handleChangeToken(accessToken, refreshToken)
        this.email = email
        notification({
          type: 'success',
          title: '邮箱绑定',
          message: '邮箱绑定成功～'
        })
      }
      return res
    },
    //修改密码
    async changePasswordAction(password: string) {
      this.waiting = true
      const res = await patchPasswordRequest(password, this.token)
      this.waiting = false
      if (res.status == 200) {
        const { accessToken, refreshToken, password } = res.data
        handleChangeToken(accessToken, refreshToken)
        this.password = password
        notification({
          type: 'success',
          title: '密码修改',
          message: '密码修改成功～'
        })
      }
      return res
    },
    //验证手机号是否存在
    async verifyPhoneExistAction(phone: string) {
      // 每次请求前重置状态
      this.verifyPhoneStatus = 'unknown'
      const res = await getVerifyPhoneExistRequest(phone)
      if (res.status === 200) {
        if (res.data.isExist) {
          // true 表示被注册过
          this.verifyPhoneStatus = 'fail'
        } else {
          this.verifyPhoneStatus = 'success'
        }
      }
    },
    // 修改绑定的 手机
    async changeBindingPhoneAction(phone: string, code: string) {
      this.waiting = true
      const res = await patchBindingPhoneRequest(phone, code, this.token)
      this.waiting = false
      if (res.status === 200) {
        const { accessToken, refreshToken, phone } = res.data
        handleChangeToken(accessToken, refreshToken)
        this.phone = phone
        notification({
          type: 'success',
          title: '手机修改',
          message: '手机修改成功～'
        })
      }
      return res
    }
  }
})

export default useSafetyStore
