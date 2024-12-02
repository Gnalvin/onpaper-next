import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type { IStsToken, IStsQuery } from './type'

enum mainAPI {
  GetStsData = '/uploadimg/sts'
}

// 请求 上传的 的sts ,PutType 为 上传的文件夹类型
export function GetSTSTokenRequest(query: IStsQuery) {
  return wlRequest.get<IResultType<IStsToken>>({
    url: mainAPI.GetStsData,
    params: query
  })
}
