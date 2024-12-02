import { encryptParams } from '@/utils/encrypt'
import type { InternalAxiosRequestConfig } from 'axios'

export function encryptInterceptors(config: InternalAxiosRequestConfig) {
  config.params['timestamp'] = new Date().getTime()
  config.params['sign'] = encryptParams(config.params)
  return config
}
