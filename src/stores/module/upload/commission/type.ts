export interface IUploadState {
  urlList: IUrlItem[]
  uploadingCount: number
  loading: boolean
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

// 排序时用到
export type ISortList = { el: HTMLElement; sort: number; index: number }[]

// 更改上传状态时 commit 的 payload类型
export type IUploadingType = {
  //上传到哪部
  status: number
  fileName: string
  progress?: number
  speed?: string
}
