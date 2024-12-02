import wlRequest from '../../index' //拿到创建的网络请求实例
import type { IResultType } from '../../type'

import type { INotifyConfig } from './type'

enum mainAPI {
  GetNotifyConfigAPI = '/notify/setting',
  PatchNotifyConfigAPI = '/notify/setting'
}

// 获取通知配置
export function getNotifyConfigRequest() {
  return wlRequest.get<IResultType<INotifyConfig>>({
    url: mainAPI.GetNotifyConfigAPI
  })
}
//更新通知配置
export function updateNotifyConfigRequest(config: INotifyConfig) {
  return wlRequest.patch<IResultType<INotifyConfig>>({
    url: mainAPI.PatchNotifyConfigAPI,
    data: { ...config }
  })
}
