import type { AxiosResponse } from 'axios'
import type { WLInterceptorsConfig } from './request/type'

// 服务器返回的数据类型 叠加 axios 自带的数据
export interface IResultType<T = any> extends AxiosResponse<any> {
  config: WLInterceptorsConfig
  status: number
  data: T
}
