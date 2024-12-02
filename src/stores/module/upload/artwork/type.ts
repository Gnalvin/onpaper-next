export interface IUploadArtworkState {
  urlList: IUrlItem[]
  loading: boolean
  changeIndx: number
  uploadingCount: number
  coverUrl: string
  coverBlob: Blob | null
  isRetry: boolean
  uploadFormData: IArtworkFormData
}

// 排序时用到
export type ISortList = { el: HTMLElement; sort: number; index: number }[]

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

// 上传的数据需要的格式
export interface IArtworkFormData {
  title: string
  description: string
  fileList: { fileName: string; sort: number; width: number; height: number }[]
  zone: string
  whoSee: string
  tags: string[]
  adult: boolean | null
  cover: string
  comment: string
  copyright: string
  device: 'PC'
}

// 更改上传状态时 commit 的 payload类型
export type IUploadingType = {
  //上传到哪部
  status: number
  fileName: string
  progress?: number
  speed?: string
}
