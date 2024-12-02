// service 的统一出口
import WLRequest from './request'
import useMainStore from '@/stores/module/main'
import { BASE_URL, TIME_OUT } from './request/config'
import localStorage from '@/utils/local-storage'
import errorHandler from './utils/error-handle'

import { notification } from '@/components/notification'
import router from '@/router'
import { AxiosError } from 'axios'

const wlRequest = new WLRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    // 传入拦截器
    requestInterceptors: (config) => {
      // 拦截 添加  token
      const token = localStorage.getCache('accessToken')
      if (token) {
        config.headers!.Authorization = `Bearer ${token}`
      }
      //拦截器必须 return 不然就直接拦断了
      return config
    },
    requestInterceptorsCatch: (err) => {
      return Promise.reject(err)
    },
    responseInterceptors: (res) => {
      console.log({ wlRequest: res })
      const result = errorHandler(res)

      return result
    },
    responseInterceptorsCatch: (err) => {
      //如果没有网络
      if (err.code === AxiosError.ERR_NETWORK) {
        notification({
          type: 'error',
          title: '网络错误',
          message: '没有网络链接'
        })
        return Promise.reject(err)
      }
      return Promise.reject(err)
    }
  }
})

// 获取 临时token的 请求
export const getAccessToken = new WLRequest({
  baseURL: BASE_URL + '/auth/accesstoken',
  timeout: TIME_OUT,
  interceptors: {
    // 传入拦截器
    requestInterceptors: (config) => {
      // 拦截 添加  token
      const token = localStorage.getCache('refreshToken')
      if (token) {
        config.headers!.Authorization = `Bearer ${token}`
      }
      //拦截器必须 return 不然就直接拦断了
      return config
    },
    responseInterceptors: (res) => {
      console.log({ getAccessToken: res })
      // 如果refreshToken 过期重新登录
      if (res.status === 1005) {
        localStorage.clearCache()
        //清空 mainStore 的登陆信息
        const mainStore = useMainStore()
        mainStore.$reset()
        notification({
          type: 'error',
          title: '登陆已过期',
          message: '请重新登陆'
        })
        router.replace({ name: 'LoginPage' })
      }
      return res
    }
  }
})

/*
1.重新请求传入的 之前请求的 config,是不会调用之前的单个类拦截器
2.重新请求调用拦截器流程:
  第一次请求 总类返回拦截 -> 单类返回拦截 ->(发生问题需要二次请求)->
  第二次请求 总类返回拦截 -> 重新请求类的返回拦截 -> 第一次单请求返回拦截
3.最后一次拦截是 第一次请求的 单请求拦截,
  因为 第一次请求 有三个拦截,到第二个拦截的时候重新请求了,第三个拦截还未调用
  重新请求拦截流程结束 会回到第一次请求的第三个拦截
*/
// 重新请求类
export const retryRequest = new WLRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    // 传入拦截器
    requestInterceptors: (config) => {
      // 拦截 添加  token
      const token = localStorage.getCache('accessToken')
      // 重新请求时 如果 有token 说明是新的 token 带上
      // 否则 把之前配置的 token 请求头取消
      if (token) {
        config.headers!.Authorization = `Bearer ${token}`
      } else {
        config.headers!.Authorization = ''
      }
      return config
    },
    responseInterceptors: (res) => {
      console.log({ retryRequest: res })

      return res
    }
  }
})

export default wlRequest
