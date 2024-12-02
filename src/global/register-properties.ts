import type { App } from 'vue'
import {
  formatUtcString,
  formatAccuracyTime,
  formatNum,
  formatUtcToShowTime
} from '@/utils/data-format'
import { handleHtml } from '@/utils/xss'
import type { IFilterXSSOptions } from 'xss'

export default function registerProperties(app: App) {
  const config = app.config.globalProperties
  config.$filters = {
    formatUtcToShowTime(strTime: string, offset: number) {
      return formatUtcToShowTime(strTime, offset)
    },
    formatTime(data: string, format?: string, offset = 8) {
      return formatUtcString(data, format, offset)
    },
    formatAccuracyTime(data: string, offset: number, alwaysTime: boolean) {
      return formatAccuracyTime(data, offset, alwaysTime)
    },
    formatNum(num: number, chinese = true) {
      return formatNum(num, chinese)
    }
  }
  // 防xss攻击过滤
  config.$xss = function (html: string, opt?: IFilterXSSOptions) {
    return handleHtml(html, opt)
  }
}
