type status = 'unknown' | 'success' | 'fail'

export interface ILoginState {
  account: {
    phone: string
    verifyCode: string
    password: string
    inviteCode: string
  }
  //是否登录成功
  loginStatus: status
  //邮箱是存在 存在才能登陆
  verifyEmailStatus: status
  //发送验证码是否成功
  sendCodeStatus: status
  //验证码登陆是否成功
  codeStatus: 'unknown' | 'success' | 'codeErr'
  //是否显示注册界面
  isShowRegister: boolean
  //发送网络请求中
  waiting: boolean
}
