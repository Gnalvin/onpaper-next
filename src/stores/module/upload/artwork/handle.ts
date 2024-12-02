import useUploadArtworkStore from './index'
import { deepClone } from '@/utils/deep-clone'
import type { IUrlItem, IUploadingType, ISortList } from './type'

// 接受到图片数据时候 改变 store 里的数据
export function updateStoreUrlList(item: IUrlItem) {
  const store = useUploadArtworkStore()
  //index != -1 说明是替换操作
  if (store.changeIndx !== -1) {
    const oldItem = store.urlList[store.changeIndx]
    // 然后替换的是在上传中的 减掉计数
    if (oldItem.uploadIng) store.uploadingCount -= 1
    // 取出替换之前的 sortIndex
    item.sortIndx = oldItem.sortIndx
    store.urlList.splice(store.changeIndx, 1, item)
    store.changeIndx = -1
    store.uploadingCount += 1
    return
  }
  // index = -1 是尾部追加 修改sortIndex
  item.sortIndx = store.urlList.length
  // 代表等等上传的个数
  store.uploadingCount += 1
  store.urlList.push(item)
}

// 上传过程中修改 UrlList中 item 上传状态
export function changeUrlListItemStatus(uploadStatus: IUploadingType) {
  const store = useUploadArtworkStore()
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

// 删除制定img
export function deleteOneImg(index: number) {
  const store = useUploadArtworkStore()
  // 释放URL
  URL.revokeObjectURL(store.urlList[index].url)
  const item = store.urlList[index]
  // 如果还在上传的 减掉 1
  if (item.uploadIng) store.uploadingCount -= 1
  store.urlList.splice(index, 1)

  // 对 item的 sort 进行重拍 消除断层
  const length = store.urlList.length
  for (let i = 0; i < length; i++) {
    store.urlList[i].sortIndx = i
  }
}

// 改变urlList 的排序位置
export function changeSortUrlList(newList: ISortList) {
  const store = useUploadArtworkStore()
  const tempUrlList = deepClone(store.urlList)
  for (const item of newList) {
    store.urlList[item.sort] = tempUrlList[item.index]
    store.urlList[item.sort]['sortIndx'] = item.sort
  }
}
