export interface IFilePayload {
  // 太大为 TRUE
  isLarge: boolean
  // 不是图片为 false
  isImage: boolean
  url: string
  fileData: File
  formData: FormData
}

export interface IMoreFilePayload {
  // 太大为 TRUE
  isLarge: boolean
  // 不是图片为 false
  isImage: boolean
  urlList: string[]
  fileDataList: File[]
  formDataList: FormData[]
  tooMuch: boolean
}
