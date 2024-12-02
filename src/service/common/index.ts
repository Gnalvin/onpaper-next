import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type {
  IPostUserFocusResult,
  IPostReport,
  IPostFeedback,
  IHotTag,
  IUserProfileData,
  ITag
} from './type'

enum mainAPI {
  PostUserFocusAPI = '/user/focus',
  PostReportAPI = '/feedback/report',
  PostFeedbackAPI = '/feedback',
  GetHotTag = '/tag/hot',
  GetTopUseTag = '/tag/top_use',
  GetUserPanel = '/user/panel'
}

//关注用户
export function postUserFocusRequest(focusId: string, isCancel: boolean) {
  return wlRequest.post<IResultType<IPostUserFocusResult>>({
    url: mainAPI.PostUserFocusAPI,
    data: { focusId, isCancel }
  })
}

// 提交举报
export function postReportRequest(data: IPostReport) {
  return wlRequest.post<IResultType>({
    url: mainAPI.PostReportAPI,
    data
  })
}

// 提交反馈
export function postFeedbackRequest(data: IPostFeedback) {
  return wlRequest.post<IResultType>({
    url: mainAPI.PostFeedbackAPI,
    data
  })
}

//获取热门tag 数据
export function getHotTagRequest() {
  return wlRequest.get<IResultType<IHotTag[]>>({
    url: mainAPI.GetHotTag
  })
}

//获取热门tag 数据
export function getTopUseRequest() {
  return wlRequest.get<IResultType<ITag[]>>({
    url: mainAPI.GetTopUseTag
  })
}

// 请求用户面板的数据
export function getUserPanelRequest(id: string) {
  return wlRequest.get<IResultType<IUserProfileData>>({
    url: mainAPI.GetUserPanel,
    params: { id }
  })
}
