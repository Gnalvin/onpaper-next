import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type { userQuery, IUserInfo } from './type'
import { encryptInterceptors } from '../utils/encrypt'
enum mainAPI {
  getAllUserShow = '/user/show'
}
//请求全站用户展示
export function getAllUserShowRequest(data: userQuery) {
  return wlRequest.get<IResultType<{ userData: IUserInfo[]; isEnd: boolean }>>({
    url: mainAPI.getAllUserShow,
    params: { ...data },
    interceptors: {
      requestInterceptors: encryptInterceptors
    }
  })
}
