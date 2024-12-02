import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

const PreviewOssUrl = import.meta.env.VITE_OSS_PREVIEW_URL
const OriginalOssUrl = import.meta.env.VITE_OSS_ORIGINAL_URL
const OssWebpUrl = '/webp'
const DefaultAvatarUrl = import.meta.env.VITE_DEFAULT_AVATAR

dayjs.extend(utc)
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const MM_DD_HH_MM = 'MM-DD HH:mm'
const YYYY_MM_DD = 'YYYY-MM-DD'

// 处理时间格式
export function formatUtcString(
  utcString: string,
  format: string = DATE_TIME_FORMAT,
  offset = 8
) {
  return dayjs.utc(utcString).utcOffset(offset).format(format)
}

// 处理时间格式 为展示的时间 当年的日期 为 MM-DD HH:mm ,不是当年 YYYY-MM-DD
export function formatUtcToShowTime(utcString: string, offset = 8) {
  const nowDate = new Date()
  const strYear = parseInt(formatUtcString(utcString, 'YYYY', 0))
  const nowYear = nowDate.getFullYear()

  if (strYear === nowYear) {
    // 如果是当年 显示日期 时分秒
    return dayjs.utc(utcString).utcOffset(offset).format(MM_DD_HH_MM)
  } else {
    // 不是 则 年月日
    return dayjs.utc(utcString).utcOffset(offset).format(YYYY_MM_DD)
  }
}

// 处理返回精确时间 1小时内 刚刚发布 24小时内 x小时前 大于24小时 当年月日,alwaysTime 是否总是显示 x时x分
export function formatAccuracyTime(
  timeStr: string,
  offset = 8,
  alwaysTime = false
) {
  const nowDate = new Date()
  const oldDate = new Date(timeStr)

  // 获取时间差 秒
  const diffSec = (nowDate.getTime() - oldDate.getTime()) / 1000
  //获取事件差 小时
  const diffHour = diffSec / (60 * 60) + offset

  // 时间差 分钟
  const diffMinute = diffSec / 60 + offset * 60
  console.log(oldDate)

  //如果小于5分钟
  if (diffMinute < 5) {
    return '刚刚发布'
  }

  //如果小于一小时
  if (diffHour < 1) {
    return Math.floor(diffMinute) + ' 分钟前'
  }
  //如果小于24小时
  if (diffHour < 24) {
    return Math.floor(diffHour) + ' 小时前'
  }

  // 如果七天内
  if (diffHour < 24 * 7) {
    return Math.floor(diffHour / 24) + '天前'
  }

  const oldYear = oldDate.getUTCFullYear()
  const oldMonth = padLeftZero(String(oldDate.getUTCMonth() + 1))
  const oldDay = padLeftZero(String(oldDate.getUTCDate()))

  //补 0
  const oldHour = padLeftZero(oldDate.getUTCHours())
  const oldMinute = padLeftZero(oldDate.getUTCMinutes())

  // 如果大于24小时 且是今年
  if (diffHour >= 24 && oldYear === nowDate.getUTCFullYear()) {
    if (alwaysTime) {
      return dayjs.utc(timeStr).utcOffset(offset).format('MM-DD HH:mm')
    }
    return dayjs.utc(timeStr).utcOffset(offset).format('MM-DD')
  }
  //oldDate.getMonth() 从 0 开始是 1月
  //如果不是今年
  if (alwaysTime) {
    return `${oldYear}-${oldMonth}-${oldDay} ${oldHour}:${oldMinute}`
  }
  return (
    oldDate.getUTCFullYear() +
    '-' +
    (oldDate.getUTCMonth() + 1) +
    '-' +
    oldDate.getUTCDate()
  )
}

// 把 数字转成 字符串 12999 -> 1.30 万
export function formatNum(num: number, chinese = true) {
  //如果大于10万 保留1位
  if (num > 100000) {
    const formatNum = (num / 10000).toFixed(1)
    return chinese ? formatNum + ' 万' : formatNum + 'w'
  }
  // 如果大于1万 保留2位
  if (num > 10000) {
    const formatNum = (num / 10000).toFixed(2)
    return chinese ? formatNum + ' 万' : formatNum + 'w'
  }
  return num
}

// 合成 Oss 图片路径
type fileType =
  | 'banners'
  | 'avatars'
  | 'artworks'
  | 'cover'
  | 'trends'
  | 'messages'
  | 'commission'
type size = 'l' | 'm' | 's' | 'xs' | ''
export function formatPicUrl(
  fileName: string,
  uid: string,
  fileType: fileType,
  size: size = '',
  original = false
) {
  // 最终返回的 图片 url
  let url = ''
  // 文件后缀
  const sizeType = size ? `_${size}.` : '.'
  fileName = fileName.split('.').join(sizeType)
  //如果是头像时
  if (fileType === 'avatars') {
    // 如果没有头像 返回默认头像
    if (!fileName) return PreviewOssUrl + DefaultAvatarUrl
    // 头像不需要 加 webp
    url = `${PreviewOssUrl}${fileType}/${uid}/${fileName}`
  }

  // 如果是作品时
  if (fileType == 'artworks' || fileType == 'trends') {
    // 是否原图
    const OssUrl = original ? OriginalOssUrl : PreviewOssUrl
    url = `${OssUrl}${fileType}/${uid}/${fileName}${OssWebpUrl}`
  }

  if (fileType == 'cover') {
    url = `${PreviewOssUrl}artworks/${uid}/${fileName}`
  }

  // 如果是背景时
  if (fileType == 'banners') {
    if (!fileName) return url
    url = `${PreviewOssUrl}${fileType}/${uid}/${fileName}${OssWebpUrl}`
  }
  // 如果是私信图片
  if (fileType == 'messages') {
    url = `${PreviewOssUrl}${fileType}/${uid}/${fileName}`
  }
  // 如果是约稿
  if (fileType == 'commission') {
    if (!fileName) return ''
    url = `${OriginalOssUrl}${fileType}/${uid}/${fileName}${OssWebpUrl}`
  }

  return url
}

type format = {
  userId: string
  cover: string
  userAvatar: string
}
// 处理图片地址
export function handleFormatUrl<T extends format>(payload: T[]) {
  if (!payload) return []
  payload.forEach((item) => {
    // 拼接 图像地址
    item.cover = formatPicUrl(item.cover, item.userId, 'cover', 'm')
    item.userAvatar = formatPicUrl(item.userAvatar, item.userId, 'avatars', 's')
  })
  return payload
}

// arr.sort(compare("age")); 会改变原数组,根据 "age" 排序
export function objCompare(sort: string) {
  //这是比较函数
  return function (m: any, n: any) {
    const a = m[sort]
    const b = n[sort]
    return a - b //升序
  }
}

// 不足10 补0️
export function padLeftZero(str: string | number) {
  str = str.toString()
  return ('00' + str).slice(str.length)
}

// 根据字节个数截取字符串截取开头字符
export function reBytesStr(str: string, len: number) {
  if (!str || str == undefined) return ''
  let num = 0
  let result = ''
  for (let i = 0; i < str.length; i++) {
    num += str.charCodeAt(i) > 255 ? 2 : 1 // 中文两个字节，英文一个字节
    if (num > len) {
      break
    } else {
      result = str.substring(0, i + 1)
    }
  }
  return result
}

//洗牌算法
export function shuffle<T>(arr: T[]) {
  let len = arr.length,
    random
  while (len != 0) {
    random = (Math.random() * len--) >>> 0 // 无符号右移位运算符向下取整(注意这里必须加分号，否则报错)
    ;[arr[len], arr[random]] = [arr[random], arr[len]] // ES6的结构赋值实现变量互换
  }
  return arr
}

//匹配搜索的文本 改变颜色
export function formatMatchText(searchText: string, fullText: string) {
  const re = new RegExp(searchText, 'i')
  return fullText.replace(re, '<span style="color:red;">$&</span>')
}

// 计算上传速度
export function uploadSpeed(oldTimestamp: number, uploadSize: number) {
  const timestamp = new Date().valueOf()
  const duration = timestamp - oldTimestamp // 间隔时间（毫秒）
  let speed = ''
  if (duration > 0) {
    const bitrate = (uploadSize / duration / 1024) * 1000 // kbps
    if (bitrate > 1000) {
      speed = (bitrate / 1000).toFixed(2) + ' Mb/s'
    } else {
      speed = Math.round(bitrate) + ' Kb/s'
    }
    return speed
  }
  return speed
}
