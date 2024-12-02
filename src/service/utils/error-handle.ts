import type { IResultType } from '@/service/type'
import { notification } from '@/components/notification'
import sessionStorage from '@/utils/session-storage'
import localStorage from '@/utils/local-storage'
import wlRequest, { getAccessToken, retryRequest } from '@/service/index'

// 获取对应 错误响应码 处理相关返回
const errorHandler = (res: any) => {
  switch (res.status) {
    case 1005:
      // console.log('无效token')
      // 看看是否是 之前有在刷新的请求 if没有 则去请求,else 添加到待重新请求列表中
      if (res.config.isNotRefreshing) {
        // accessToken 无效的话 则 请求 刷新token 并重新请求
        return getAccessToken
          .get<IResultType<{ accessToken: string }>>({})
          .then((result) => {
            // refreshToken 也过期了  也重新调用一次 getAccessToken拦截器当过期时已经清除过登陆信息
            if (result.status !== 200) {
              wlRequest.runRequest()
              return retryRequest.instance(res.config)
            }
            // 把获取的新accessToken 保存起来 然后调用 重新请求列表的 函数
            const token = result.data.accessToken
            //把 accessToken 清空再保存
            localStorage.deleteCache('accessToken')
            sessionStorage.deleteCache('accessToken')
            localStorage.setCache('accessToken', token)
            wlRequest.runRequest()
            // 同时把这一次请求 也重新调用
            return retryRequest.instance(res.config)
          })
      } else {
        return new Promise((resolve) => {
          //这里加入列表的是一个promise的解析函数
          // 将响应的config配置对应解析的请求函数存到requests中，等到刷新token回调后再执行
          wlRequest.addRequest(() => {
            resolve(retryRequest.instance(res.config))
          })
        })
      }
    case 1011:
      // server busy 服务器内部错误
      notification({
        type: 'error',
        title: '网络错误',
        message: '服务器开了小差, 请稍后再试...'
      })
      return res
    case 1020:
      notification({
        type: 'error',
        title: '请求失败',
        message: '长时间没有操作, 请刷新页面'
      })
      return res
    default:
      return res
  }
}

export default errorHandler
