import useUploadTrendsStore from './index'
import type { ISortList, IUploadingType } from './type'

// 改变urlList 的排序位置
export function changeSortUrlList(newList: ISortList) {
  const store = useUploadTrendsStore()
  for (const item of newList) {
    store.urlList[item.index].sortIndx = item.sort
  }
}

// 上传过程中修改 UrlList中 item 上传状态
export function changeUrlListItemStatus(uploadStatus: IUploadingType) {
  const store = useUploadTrendsStore()
  const listLength = store.urlList.length
  for (let i = listLength - 1; i != -1; i--) {
    // 循环找到 文件名一样的 item
    if (store.urlList[i].fileName === uploadStatus.fileName) {
      const item = store.urlList[i]
      switch (uploadStatus.status) {
        // status = 1 上传第一步 改变上传状态为 上传中
        case 1:
          item.uploadIng = true
          break
        case 2:
          //status = 2 上传完成时
          item.uploadIng = false
          item.fileData = null
          item.isPut = true
          // 等待上传的个数 -1
          store.uploadingCount -= 1
          break
        case 3:
          //上传进度和速度
          item.progress = uploadStatus.progress!
          item.speed = uploadStatus.speed!
          break
        case 4:
          // status =4 上传失败
          item.isPut = false
          item.uploadIng = false
          item.isFail = true
          // 等待上传的个数 -1
          store.uploadingCount -= 1
          break
        default:
          break
      }
      break
    }
  }
}
