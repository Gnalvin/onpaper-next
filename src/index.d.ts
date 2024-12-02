import type {
  formatUtcString,
  formatAccuracyTime,
  formatNum,
  formatUtcToShowTime
} from '@/utils/data-format'
import type { handleHtml } from '@/utils/xss'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      formatTime: formatUtcString
      formatAccuracyTime: formatAccuracyTime
      formatNum: formatNum
      formatUtcToShowTime: formatUtcToShowTime
    }
    $xss: handleHtml
  }
}
