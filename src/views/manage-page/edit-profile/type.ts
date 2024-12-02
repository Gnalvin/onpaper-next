export type sex = 'man' | 'woman' | 'privacy'

export type birthdayType = {
  year: string
  month: string
  day: string
}

export type exceptWorkType = '全职工作' | '约稿创作' | '项目外包' | '暂不考虑'

export type messageType = 'success' | 'fail' | 'unknown'

export type profileType =
  | 'unknown'
  | 'userName'
  | 'sex'
  | 'birthday'
  | 'workEmail'
  | 'region'
  | 'snsLink'
  | 'createStyle'
  | 'software'
  | 'exceptWork'
  | 'introduce'

export type propMesType = {
  profileType: profileType
  tipType: messageType
  mes: string
}
