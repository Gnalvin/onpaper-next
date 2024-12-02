import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

// 定义一个拦截器接口
//T = AxiosResponse 设置默认类型
export interface WLRequestInterceptors<T = AxiosResponse<any>> {
  // 请求的拦截
  requestInterceptors?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig
  requestInterceptorsCatch?: (error: any) => any
  //响应的拦截
  responseInterceptors?: (res: T) => T
  responseInterceptorsCatch?: (error: any) => any
}

// 定义一个借口 通过继承 AxiosRequestConfig
export interface WLRequestConfig<T = AxiosResponse<any>>
  extends AxiosRequestConfig {
  // 在添加一些属性
  interceptors?: WLRequestInterceptors<T> // 拦截器
  requestKey?: string
  isNotRefreshing?: boolean // 判断这次请求是否 是刷新token的请求
  retryCount?: number
}

export interface WLInterceptorsConfig<T = AxiosResponse<any>>
  extends InternalAxiosRequestConfig {
  // 在添加一些属性
  interceptors?: WLRequestInterceptors<T> // 拦截器
  requestKey?: string
  isNotRefreshing?: boolean // 判断这次请求是否 是刷新token的请求
  retryCount?: number
}

// 定义一个返回类型的接口
export interface WLResponse extends AxiosResponse<any> {
  config: WLInterceptorsConfig
}
