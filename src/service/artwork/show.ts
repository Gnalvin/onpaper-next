import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type { IBaseArtwork, channelQuery } from './type'
import { encryptInterceptors } from '../utils/encrypt'
enum mainAPI {
  GetChannelArtwork = '/artwork/show'
}
//请求分区作品数据
export function getChannelArtworkRequest(data: channelQuery) {
  return wlRequest.get<IResultType<IBaseArtwork[]>>({
    url: mainAPI.GetChannelArtwork,
    params: { ...data },
    interceptors: {
      requestInterceptors: encryptInterceptors
    }
  })
}
