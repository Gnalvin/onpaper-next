import localStorage from './local-storage'

type theme = 'light' | 'dark' | 'auto'

const htmlEL = document.querySelector('html') as HTMLHtmlElement
const media = window.matchMedia('(prefers-color-scheme: dark)')

class ColorScheme {
  init() {
    const theme = this.getNowTheme()
    this.setTheme(theme)

    // 监听 系统颜色切换
    media.addEventListener('change', (event) => {
      // 查看主题设置
      const setting = localStorage.getCache('data-theme')
      // 如果设置auto 跟随系统变化
      if (setting === 'auto') {
        const theme = event.matches ? 'dark' : 'light'
        this.setTheme(theme)
      }
    })
  }
  setTheme(theme: theme, isLock = false) {
    //是否固定 主题样式
    if (isLock) localStorage.setCache('data-theme', theme)
    htmlEL.setAttribute('data-theme', theme)
    //如果 设置自动样式 则查看浏览器目前主题 再设置
    if (theme === 'auto') {
      theme = media.matches ? 'dark' : 'light'
    }
    // 适配 element 的暗黑模式
    if (theme === 'dark') {
      htmlEL.classList.remove('light')
      htmlEL.classList.add('dark')
    } else {
      htmlEL.classList.remove('dark')
      htmlEL.classList.add('light')
    }
  }

  // 获取当前实际主题的函数
  // window.matchMedia('(prefers-color-scheme: dark)').matches 判断是否处于深色模式 true/false
  getNowTheme(): theme {
    // 从 localStorage 检测主题
    let nowTheme = localStorage.getCache('data-theme')
    // 第一次进入网站 设置 auto
    if (!nowTheme) {
      nowTheme = 'auto'
      localStorage.setCache('data-theme', 'auto')
    }
    //  通过系统主题设置
    if (nowTheme === 'auto') {
      return media.matches ? 'dark' : 'light'
    } else {
      return nowTheme === 'dark' ? 'dark' : 'light'
    }
  }
}

export default new ColorScheme()
