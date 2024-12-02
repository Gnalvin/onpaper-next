import 'normalize.css' // 样式初始化
import './css/index.less'
import 'element-plus/theme-chalk/dark/css-vars.css' // element 暗黑模式

import ColorScheme from '@/utils/color-scheme'

//nprogress
import 'nprogress/nprogress.css' // 这个nprogress样式必须引入
import NProgress from 'nprogress' // 引入nprogress插件

export function initStyle() {
  //设置网站背景色
  ColorScheme.init()
  // 进度环显示隐藏
  NProgress.configure({ showSpinner: false })
}
