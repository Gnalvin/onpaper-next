export interface ISafetySettingState {
  phone: string
  email: string
  password: Boolean
  sendCodeStatus: 'unknown' | 'success' | 'fail'
  waiting: boolean
  token: string
  //邮箱是否存在
  verifyEmailStatus: 'unknown' | 'success' | 'fail'
  //手机是否存在
  verifyPhoneStatus: 'unknown' | 'success' | 'fail'
}
