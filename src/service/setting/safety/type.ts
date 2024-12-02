export interface IUserBinding {
  phone: string
  email: null | string
  password: string
}

export interface IPasswordResult {
  password: boolean
  refreshToken: string
  accessToken: string
}

export interface IPhoneResult {
  phone: string
  refreshToken: string
  accessToken: string
}

export interface IEmailResult {
  email: string
  refreshToken: string
  accessToken: string
}
