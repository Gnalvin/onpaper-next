export interface IStsToken {
  token: stsToken
  fileName: string[]
}

interface stsToken {
  accessKeyId: string
  accessKeySecret: string
  securityToken: string
}

export interface IStsQuery {
  type: string
  count: number
}
