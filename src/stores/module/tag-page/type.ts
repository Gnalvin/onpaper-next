import type { ITagAboutArt, ITagAboutUser } from '@/service/tag-page/type'

export interface ITagPageState {
  tagName: string
  totalArt: number
  tagId: string
  relevantTagList: { tagId: string; tagName: string }[]
  recommendUsers: ITagAboutUser[]
  artworksByHot: ITagAboutArt[]
  artworksByTime: ITagAboutArt[]
  noHaveArts: boolean
}

// 关注用户API需要的数据
export type focusPayloadType = {
  userId: string
  isFocus: 0 | 1 | 2
  userName: string
}
