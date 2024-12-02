export interface IEditProfileState {
  userId: string
  email: string
  workEmail: string
  userName: string
  sex: 'privacy' | 'man' | 'woman'
  birthday: {
    Time: string
    Valid: boolean
  }
  introduce: string
  Weibo: string
  QQ: string
  Pixiv: string
  Twitter: string
  Bilibili: string
  WeChat: string
  address: string
  expectWork: exceptWorkType
  createStyle: string
  software: string
  avatarName: string
  [key: string]: any
}

export type exceptWorkType = '全职工作' | '约稿创作' | '项目外包' | '暂不考虑'
export type snsName =
  | 'QQ'
  | 'Pixiv'
  | 'Weibo'
  | 'Twitter'
  | 'Bilibili'
  | 'WeChat'
export type snsLinkListItem = { value: string; label: snsName }
export type uploadPayload = { fileData: Blob; url: string }
