import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type {
  INavUserData,
  ITagNameSearchRes,
  IUserNameSearchRes,
  IInvitationCode
} from './type'

enum mainAPI {
  GetUserNavData = '/user/nav',
  SearchTagName = 'tag/search',
  SearchUserName = 'user/search',
  InvitationCode = 'user/invitation'
}

// 请求导航栏的用户数据
export function getUserNavDataRequest(id: string) {
  return wlRequest.get<IResultType<INavUserData>>({
    url: mainAPI.GetUserNavData,
    params: { id }
  })
}

//通过tag名字搜索 标签
export function searchTagNameRequest(tag: string) {
  return wlRequest.get<IResultType<ITagNameSearchRes>>({
    url: mainAPI.SearchTagName,
    params: { tag, query: '1001' }
  })
}

//通过用户名搜索 用户
export function searchUserNameRequest(name: string) {
  return wlRequest.get<IResultType<IUserNameSearchRes>>({
    url: mainAPI.SearchUserName,
    params: { name }
  })
}

// 获取邀请码
export function getInvitationCodeRequest() {
  return wlRequest.get<IResultType<IInvitationCode[]>>({
    url: mainAPI.InvitationCode
  })
}
