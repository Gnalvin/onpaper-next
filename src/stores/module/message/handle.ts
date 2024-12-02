import { formatUtcString } from '@/utils/data-format'

// 处理聊天记录的时间
const today = new Date()
const yesterday = new Date(new Date().setDate(today.getDate() - 1)) // 昨天
const BYDay = new Date(new Date().setDate(today.getDate() - 2)) // 前天

export function formaMessageTime(utcString: string, lastTime: string) {
  const fiveMin = 60 * 5 * 1000
  // 间隔五分钟内部显示时间
  if (new Date(utcString).getTime() - new Date(lastTime).getTime() < fiveMin) {
    return ''
  }

  // 当前年份
  const strYear = parseInt(formatUtcString(utcString, 'YYYY', 0))
  const nowYear = today.getFullYear()
  // 当前日期
  const strDay = formatUtcString(utcString, 'YYYY-MM-DD', 0)
  const nowDay = formatUtcString(today.toLocaleDateString(), 'YYYY-MM-DD', 0)
  const yDay = formatUtcString(yesterday.toLocaleDateString(), 'YYYY-MM-DD', 0)
  const bDay = formatUtcString(BYDay.toLocaleDateString(), 'YYYY-MM-DD', 0)
  // 如果是当天日期 显示时分
  if (strDay == nowDay) {
    return formatUtcString(utcString, 'HH:mm')
  }
  // 如果是昨天日期 显示时分
  if (strDay == yDay) {
    return formatUtcString(utcString, '昨天 HH:mm')
  }
  // 如果是前天日期 显示时分
  if (strDay == bDay) {
    return formatUtcString(utcString, '前天 HH:mm')
  }
  // 如果是当年 显示日期
  if (strYear === nowYear) {
    return formatUtcString(utcString, 'MM-DD HH:mm')
  }
  // 年月日
  return formatUtcString(utcString, 'YYYY年MM月DD日 HH:mm')
}

// 处理聊天的时间格式 为展示的时间 当年的日期 为 MM-DD HH:mm ,不是当年 YYYY-MM-DD
export function formatChatListTime(utcString: string) {
  // 当前年份
  const strYear = parseInt(formatUtcString(utcString, 'YYYY', 0))
  const nowYear = today.getFullYear()
  // 当前日期
  const strDay = formatUtcString(utcString, 'YYYY-MM-DD', 0)
  const nowDay = formatUtcString(today.toLocaleDateString(), 'YYYY-MM-DD', 0)

  // 如果是当天日期 显示时分秒
  if (strDay == nowDay) {
    return formatUtcString(utcString, 'HH:mm')
  }
  // 如果是当年 显示日期
  if (strYear === nowYear) {
    return formatUtcString(utcString, 'MM-DD')
  }
  // 年月日
  return formatUtcString(utcString, 'YYYY-MM-DD')
}
