import { defineStore } from 'pinia'
import router from '@/router'
import useMainStore from '../../main'
import { getOssClient } from '@/utils/get-sts'
import type { IUploadArtworkState, IUrlItem } from './type'
import type { IMoreFilePayload } from '@/components/upload/type'
import { compress, syncLoadImg, verifySize } from '@/utils/handle-img'
import { uploadSpeed, objCompare } from '@/utils/data-format'
import { addImgSuffix } from '@/utils/handle-img'
import { saveArtworkInfoRequest } from '@/service/artwork'
import { notification } from '@/components/notification'
import { updateStoreUrlList, changeUrlListItemStatus } from './handle'

const useUploadArtworkStore = defineStore('uploadArtwork', {
  state: (): IUploadArtworkState => ({
    uploadFormData: {
      fileList: [],
      title: '',
      description: '',
      zone: '',
      tags: [],
      cover: '',
      whoSee: '',
      adult: null,
      comment: '',
      copyright: '',
      device: 'PC'
    },
    coverBlob: null,
    coverUrl: '',
    urlList: [],
    isRetry: false,
    loading: false,
    changeIndx: -1,
    uploadingCount: 0
  }),
  getters: {
    // 获取第几个item 还在上传
    getUploadingItem: (state) => {
      const listLength = state.urlList.length
      // 逆向循环
      for (let i = listLength - 1; i != -1; i--) {
        if (state.urlList[i].uploadIng) {
          return state.urlList[i].sortIndx
        }
      }
    },
    // 获取第几个失败
    getUploadFailItem: (state) => {
      const listLength = state.urlList.length
      for (let i = 0; i < listLength; i++) {
        const item = state.urlList[i]
        if (item.isFail) {
          return state.urlList[i].sortIndx
        }
      }
    }
  },
  actions: {
    //修改图片urlList
    async changeUrlListAction(fileData: IMoreFilePayload) {
      const mainStore = useMainStore()
      // 压缩图片的过程 全部压缩完 为false 可以排序
      this.loading = true
      // 获取文件个数 用于循环
      const fileCount = fileData.urlList.length
      //获取上传凭证
      await mainStore.getSTSTokenAction({
        type: 'artworks',
        count: fileCount
      })
      // 获取到sts 后构建 fileItem
      for (let i = 0; i < fileCount; i++) {
        // 循环一次取把服务器返回的名字取出一个
        const fileName = mainStore.sts.fileName.pop()!
        // 验证图片尺寸是否符合要求 不符合的不添加
        const { width, height } = await syncLoadImg(fileData.urlList[i])
        if (!verifySize(width, height, 500)) {
          notification({
            type: 'error',
            title: '上传图片',
            message: `${fileData.fileDataList[i].name} , 图片尺寸不符合要求`,
            duration: 5500
          })
          continue
        }
        const suffix = addImgSuffix(fileData.fileDataList[i].type)

        // 获取 压缩过的 图片url
        const blobData = await compress(fileData.urlList[i], 0.7)
        //释放没有压缩过的 URL
        URL.revokeObjectURL(fileData.urlList[i])
        const item: IUrlItem = {
          url: URL.createObjectURL(blobData), //使用压缩过的图片来预览
          isPut: false,
          fileData: fileData.fileDataList[i],
          sortIndx: i,
          fileName: fileName + suffix,
          uploadIng: false,
          progress: 0,
          speed: '',
          width,
          height,
          isFail: false
        }
        updateStoreUrlList(item)
      }
      // 图片全部压缩完 在urlList中
      this.loading = false
      // 上传图片
      this.uploadArtworkImgAction()
    },
    //上传作品图片
    async uploadArtworkImgAction() {
      const mainStore = useMainStore()
      //创建 oss 实例
      const oss = getOssClient(mainStore.sts)

      for (let i = 0; i < this.urlList.length; i++) {
        const item = this.urlList[i]
        // 如果是在上传中或者 上传完成的 跳过
        if (item.uploadIng || item.isPut) continue
        //如果是 上传失败的 跳过
        if (item.isFail) continue
        // 改变上传状态
        changeUrlListItemStatus({ status: 1, fileName: item.fileName })
        // 上传文件
        const startTime = new Date().valueOf()
        let uploadSize = 0
        const options = {
          // 获取分片上传进度、断点和返回值。
          progress: (p: number, cpt: any) => {
            uploadSize += cpt?.partSize
            const speed = uploadSpeed(startTime, uploadSize)
            // 上传进度
            changeUrlListItemStatus({
              status: 3,
              fileName: item.fileName,
              progress: p * 100,
              speed: speed
            })
          },
          // 设置并发上传的分片数量。
          parallel: 5,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: 1024 * 1024 * 2
        }
        //上传的路径
        const path = 'artworks/' + mainStore.userId + '/' + item.fileName
        oss
          .multipartUpload(path, item.fileData, options)
          .then(() => {
            //上传成功 改变对应数据状态
            changeUrlListItemStatus({
              status: 2,
              fileName: item.fileName
            })
          })
          .catch(() => {
            changeUrlListItemStatus({
              status: 4,
              fileName: item.fileName
            })
            notification({
              type: 'error',
              title: '上传作品',
              message: '有图片上传失败, 请删除后重试',
              duration: 0,
              showClose: true
            })
          })
      }
    },
    // // 上传作品封面
    async uploadCoverAction() {
      const mainStore = useMainStore()
      //获取上传凭证
      const res = await mainStore.getSTSTokenAction({
        type: 'artworks',
        count: 1
      })
      if (res.status !== 200) {
        notification({
          type: 'error',
          title: '上传作品',
          message: '发生网络错误, 请重试上传',
          duration: 0,
          showClose: true
        })
        this.isRetry = true
        return
      }
      // 把服务器返回的 名字取出
      const fileName =
        mainStore.sts.fileName.pop() + addImgSuffix(this.coverBlob!.type)
      //上传的路径
      const path = 'artworks/' + mainStore.userId + '/' + fileName
      //创建 oss 实例
      const oss = getOssClient(mainStore.sts)
      try {
        // 上传封面
        await oss.multipartUpload(path, this.coverBlob, {
          parallel: 3,
          partSize: 1024 * 1024
        })
      } catch (e) {
        this.isRetry = true
        return
      }
      // 上传成功后 封面添加到 图片列表
      this.uploadFormData.cover = fileName!
    },
    // 上传整个作品信息
    async uploadArtworkAction(isRetry = false) {
      // 因为是先上传封面后再保存整体数据 如果封面上传失败 则返回不发送请求
      if (!this.uploadFormData.cover) return
      if (!isRetry) {
        this.urlList.forEach((item) => {
          this.uploadFormData.fileList.push({
            fileName: item.fileName,
            sort: item.sortIndx,
            width: item.width,
            height: item.height
          })
        })
        const mainStore = useMainStore()
        this.urlList.sort(objCompare('sortIndx'))
        mainStore.tempImg = this.urlList.map((i) => i.url)
      }
      const res = await saveArtworkInfoRequest(this.uploadFormData)
      if (res.status == 200) {
        router.push({
          name: 'ArtworkDetail',
          params: { artId: res.data.artworkId }
        })
      } else {
        notification({
          type: 'error',
          title: '上传作品',
          message: '发生网络错误, 请重试上传',
          duration: 0,
          showClose: true
        })
        this.uploadFormData.cover = ''
        this.isRetry = true
      }
    }
  }
})

export default useUploadArtworkStore
