import xss from 'xss'
import type { IFilterXSSOptions } from 'xss'

export function handleHtml(html: string, opt?: IFilterXSSOptions) {
  return xss(html, opt)
}
