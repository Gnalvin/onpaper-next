export type ImageViewerAction =
  | 'zoomIn'
  | 'zoomOut'
  | 'clockwise'
  | 'anticlockwise'

// 图片信息
export type fileType = {
  fileName: string
  sort: number
  size?: number
  highQuality?: string
  isShowHd?: boolean
  isHDOk?: boolean
  isFinish?: boolean
}
