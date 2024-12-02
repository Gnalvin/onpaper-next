import type { IRelevantTopic, ITrendFormData } from '@/service/trend-page/type'

// 排序时用到
export type ISortList = { el: HTMLElement; sort: number; index: number }[]

export interface IUploadTrendState {
  uploadFormData: ITrendFormData
  relevantTopic: IRelevantTopic[] | null
  urlList: IUrlItem[]
  uploadingCount: number
  loading: boolean
  isRetry: boolean
}

// 构建的 URLItem
export type IUrlItem = {
  url: string
  isPut: boolean
  fileData: File | null | Blob
  sortIndx: number
  fileName: string
  uploadIng: boolean
  progress: number
  speed: string
  width: number
  height: number
  isFail: boolean
}

// 更改上传状态时 commit 的 payload类型
export type IUploadingType = {
  //上传到哪部
  status: number
  fileName: string
  progress?: number
  speed?: string
}
