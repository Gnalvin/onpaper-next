class SessionCache {
  setCache(key: string, value: any) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  }
  getCache(key: string) {
    const value = window.sessionStorage.getItem(key)
    if (value) {
      // 把json 转回对象
      return JSON.parse(value)
    }
  }
  deleteCache(key: string) {
    window.sessionStorage.removeItem(key)
  }
  clearCache() {
    window.sessionStorage.clear()
  }
}

export default new SessionCache()
