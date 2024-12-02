import { defineStore } from 'pinia'
import type { ILoginState } from './type'
import type { ILogin, ILoginByEmail } from '@/service/login/type'
import {
  loginRequest,
  verifyEmailRequest,
  getPhoneCodeRequest,
  userSignUpRequest,
  getEmailCodeRequest,
  loginByEmailRequest
} from '@/service/login/login'
import { notification } from '@/components/notification'
import { MessageBox } from '@/components/message-box/index'
import { handleLoginSuccess } from './handle'

const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    account: {
      phone: '',
      verifyCode: '',
      password: '',
      inviteCode: ''
    },
    loginStatus: 'unknown',
    verifyEmailStatus: 'unknown',
    sendCodeStatus: 'unknown',
    codeStatus: 'unknown',
    isShowRegister: false,
    waiting: false
  }),
  actions: {
    // 账号登录
    async accountLoginAction(payload: ILogin) {
      // 每次请求前重置状态
      this.loginStatus = 'unknown'
      //1.实现登录逻辑
      this.waiting = true
      const res = await loginRequest(payload)
      this.waiting = false

      // 2.请求成功则保存数据
      if (res.status === 200) {
        handleLoginSuccess(res.data)
        this.loginStatus = 'success'
        return
      }
      // 不是200 都是登陆错误
      this.loginStatus = 'fail'
      //账号被封
      if (res.status == 1031) {
        MessageBox({
          text: '账号禁止登陆，如有疑问请联系我们',
          onlyTip: true
        })
      }
    },
    //验证邮箱是否存在
    async verifyEmailExistAction(email: string) {
      // 每次请求前重置状态
      this.verifyEmailStatus = 'unknown'
      const res = await verifyEmailRequest({ email })
      // 如果 返回的状态码 1009 邮箱存在
      if (res.status == 1009) {
        this.verifyEmailStatus = 'success'
      }
      // 如果 返回的状态码 1010 邮箱不存在不能登陆
      if (res.status === 1010) {
        this.verifyEmailStatus = 'fail'
      }
    },
    //获取手机验证码
    async getPhoneCode(phone: string, code: string) {
      // 每次请求前重置状态
      this.sendCodeStatus = 'unknown'
      const res = await getPhoneCodeRequest(phone, code)
      if (res.status === 200) {
        this.sendCodeStatus = 'success'
      } else if (res.status !== 1024 && res.status !== 1025) {
        notification({
          type: 'error',
          title: '验证码',
          message: '服务器错误，稍后再试'
        })
        this.sendCodeStatus = 'fail'
      }
      return res
    },
    //发送手机登陆请求
    async phoneLoginAction() {
      // 每次请求前重置状态
      this.codeStatus = 'unknown'
      this.waiting = true
      const res = await userSignUpRequest(this.account)
      this.waiting = false
      // 验证码错误
      if (res.status === 1018) {
        this.codeStatus = 'codeErr'
        return res
      }
      //用户不存在 展示注册页
      if (res.status === 1003) {
        this.isShowRegister = true
        return res
      }
      //登陆成功
      if (res.status === 200) {
        handleLoginSuccess(res.data)
        this.loginStatus = 'success'
        return res
      }
      //账号被封
      if (res.status == 1031) {
        MessageBox({
          text: '账号禁止登陆，如有疑问请联系我们',
          onlyTip: true
        })
        return res
      }
      return res
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
    async loginByEmailAction(payload: ILoginByEmail) {
      // 每次请求前重置状态
      this.codeStatus = 'unknown'
      const res = await loginByEmailRequest(payload)
      // 验证码错误
      if (res.status === 1018) this.codeStatus = 'codeErr'
      if (res.status === 200) {
        handleLoginSuccess(res.data)
        this.loginStatus = 'success'
      }
      //账号被封
      if (res.status == 1031) {
        MessageBox({
          text: '账号禁止登陆，如有疑问请联系我们',
          onlyTip: true
        })
      }
    }
  }
})

export default useLoginStore
