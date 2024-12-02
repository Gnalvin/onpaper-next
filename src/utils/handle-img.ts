const PreviewOssUrl = import.meta.env.VITE_OSS_PREVIEW_URL
const OriginalOssUrl = import.meta.env.VITE_OSS_ORIGINAL_URL

function limitSize(
  size: { width: number; height: number },
  maximumPixels: number = 16777216
) {
  const { width, height } = size

  const requiredPixels = width * height
  if (requiredPixels <= maximumPixels) return { width, height }

  const scalar = Math.sqrt(maximumPixels) / Math.sqrt(requiredPixels)
  return {
    width: Math.floor(width * scalar),
    height: Math.floor(height * scalar)
  }
}

/**
 *
 * @param imgUrl 图片url
 * @param quality 图片质量
 * @param size 生成的图片尺寸
 * @returns
 */
export function compress(imgUrl: string, quality: number, size = 0) {
  return new Promise<Blob>((resolve) => {
    const canvas = document.createElement('canvas') // 创建一个canvas
    const context = canvas.getContext('2d')
    // 开始画图
    const img = new Image()
    img.src = imgUrl // 获取的文件url

    img.onload = function () {
      const scale = size ? size / img.width : 1
      canvas.width = img.width * scale // 把canvas的宽高设置为图片的宽高
      canvas.height = img.height * scale
      const { width, height } = limitSize({
        width: canvas.width,
        height: canvas.height
      })
      canvas.width = width
      canvas.height = height

      context!.drawImage(img, 0, 0, canvas.width, canvas.height)
      const base64Data = canvas.toDataURL('image/jpeg', quality)
      const blobData = DataURIToBlob(base64Data)
      resolve(blobData)

      // iOS Safari canvas 内存限制 如果没有回收会出问题 手动缩小画布
      canvas.width = 1
      canvas.height = 1
      context && context.clearRect(0, 0, 1, 1)
    }
  })
}

// 如果图片压缩图可能错误 使用原图兜底
export const handleImgErr = (event: Event) => {
  const el = event.target as HTMLImageElement

  // 总失败次数，此时设定为2
  const allTimes = 2
  const times = Number(el.dataset.times) || 0 // 以失败的次数，默认为0

  if (times >= allTimes) return
  el.dataset.times = String(times + 1)

  // 去掉 webp 压缩 解决码率错误问题
  if (times == 0) {
    const pattern = /\/webp/
    el.src = el.src.replace(pattern, '')
    return
  }

  // // 第二次尝试 可能 我们自己的服务器没有生成对应尺寸 到原图里面找
  if (times == 1) {
    el.src = el.src.replace(/_.*?\./, '.')
    el.src = OriginalOssUrl + el.src.split(PreviewOssUrl).join('') + '/webp'
  }
}

export const verifySize = (w: number, h: number, min: number, max = 10000) => {
  //图片 太小或 太大
  if (w < min || w > max || h < min || h > max) return false
  //长宽比大于7倍 不处理
  if (h / w > 7 || w / h > 7) return false
  return true
}

// 同步加载图片
export function syncLoadImg(url: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = function () {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = reject
  })
}

//返回图片后缀
export function addImgSuffix(text: string) {
  if (text == 'image/jpeg') {
    return '.jpg'
  } else {
    return '.png'
  }
}

//处理 data:image/png;base64 转成Blob 方便上传
export function DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(',')
  const byteString = atob(splitDataURI[1])
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)

  return new Blob([ia], { type: mimeString })
}

// base64 转 file 格式
export const base64ConvertFile = function (urlData: string, filename = 'file') {
  // 64转file
  if (typeof urlData != 'string') {
    console.error('urlData不是字符串')
    return
  }
  const arr = urlData.split(',')
  //截取文件类型
  const headStr = arr[0].match(/:(.*?);/)
  if (headStr == null) return console.error('urlData 头部类型描述格式不正确')
  const type = headStr[1]
  const fileExt = type.split('/')[1]
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${fileExt}`, {
    type: type
  })
}
