import wlRequest from '../index' //拿到创建的网络请求实例
import type { IResultType } from '../type'
import type {
  IAcceptPlan,
  IUserAcceptPlan,
  IInvitePlan,
  IPlanCard,
  IUserInvitePlan,
  IPlanNext,
  IUserContact,
  IEvaluate,
  IEvaluateCard
} from './type'

enum mainAPI {
  PostAcceptPlanAPI = '/commission/accept',
  GetPlanAPI = '/commission/plan',
  PostInviteAPI = '/commission/invite',
  GetReceiveAPI = '/commission/receive',
  GetSendAPI = '/commission/send',
  GetPlanDetailAPI = '/commission/detail',
  PatchPlanNextAPI = '/commission/next',
  GetUserContactAPI = '/commission/contact',
  PostEvaluateAPI = '/commission/evaluate',
  GetEvaluateAPI = '/commission/evaluate',
  UpdateStatusAPI = '/commission/status',
  GetAcceptPermission = '/commission/check'
}
//提交接稿计划
export function postAcceptPlanRequest(data: IAcceptPlan) {
  return wlRequest.post<IResultType>({
    url: mainAPI.PostAcceptPlanAPI,
    data
  })
}
// 获取某个用户接稿方案
export function getAcceptPlanRequest(userId: string) {
  return wlRequest.get<IResultType<IUserAcceptPlan>>({
    url: mainAPI.GetPlanAPI,
    params: { id: userId }
  })
}

// 向某个用户提交邀请
export function postInvitePlanRequest(data: IInvitePlan) {
  return wlRequest.post<IResultType>({
    url: mainAPI.PostInviteAPI,
    data
  })
}
// 获取用户收到的约稿邀请
export function getReceivePlanRequest(
  userId: string,
  type: number,
  next = '0'
) {
  return wlRequest.get<IResultType<IPlanCard[]>>({
    url: mainAPI.GetReceiveAPI,
    params: { uid: userId, type, next }
  })
}

// 获取用户发出的约稿邀请
export function getSendPlanRequest(userId: string, type: number, next = '0') {
  return wlRequest.get<IResultType<IPlanCard[]>>({
    url: mainAPI.GetSendAPI,
    params: { uid: userId, type, next }
  })
}

// 获取约稿计划详情
export function getPlanDetailRequest(inviteId: string) {
  return wlRequest.get<IResultType<IUserInvitePlan>>({
    url: mainAPI.GetPlanDetailAPI,
    params: { id: inviteId }
  })
}

// 对约稿邀请进行下一步
export function patchPlanNextRequest(data: IPlanNext) {
  return wlRequest.patch<IResultType>({
    url: mainAPI.PatchPlanNextAPI,
    data
  })
}

// 获取用户约稿联系方式
export function getUserContactRequest(inviteId: string) {
  return wlRequest.get<
    IResultType<{ artist: IUserContact; sender: IUserContact }>
  >({
    url: mainAPI.GetUserContactAPI,
    params: { id: inviteId }
  })
}

// 发送评价
export function postEvaluateRequest(data: IEvaluate) {
  return wlRequest.post<IResultType<IPlanNext>>({
    url: mainAPI.PostEvaluateAPI,
    data
  })
}

// 查找用户收到的评价
export function getUserReceiveEvaluateRequest(userId: string, page: number) {
  return wlRequest.get<IResultType<IEvaluateCard[]>>({
    url: mainAPI.GetEvaluateAPI,
    params: { uid: userId, page }
  })
}

// 更新约稿状态
export function updateCommissionStatusRequest(userId: string, status: boolean) {
  return wlRequest.patch<IResultType<{ status: boolean }>>({
    url: mainAPI.UpdateStatusAPI,
    data: { userId, status }
  })
}

// 检测约稿权限
export function checkAcceptPermissionRequest() {
  return wlRequest.get<IResultType<{ isOk: boolean; artCount: number }>>({
    url: mainAPI.GetAcceptPermission
  })
}
