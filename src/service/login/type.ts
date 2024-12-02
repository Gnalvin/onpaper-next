export interface IPhoneLoginInfo {
  phone: string
  password?: string
  verifyCode: string
  inviteCode: string
}

export interface IUserEmail {
  email: string
}

export interface ILogin {
  account: string
  password: string
}

export interface ILoginByEmail {
  email: string
  verifyCode: string
}

export interface ILoginResult {
  userId: string
  userName: string
  refreshToken: string
  accessToken: string
}

export interface ISignUpRespondData {
  userId: string
  userName: string
  refreshToken: string
  accessToken: string
}
