export interface configType {
  // 是否要求必传
  require: requireType
  blur?: rule
  call?: rule
}
export type rule = {
  verifyAll: boolean // 验证全部规则 还是 满足其一
  pattern: {
    rule: RegExp
    message: string
  }[]
}

export type requireType = {
  must: boolean
  message: string
}
