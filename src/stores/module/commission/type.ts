import type {
  IAcceptPlan,
  IUserAcceptPlan,
  IInvitePlan,
  IPlanCard,
  IUserInvitePlan,
  IUserContact,
  IEvaluate,
  IEvaluateCard
} from '@/service/commission/type'
import type { IUserProfileData } from '@/service/common/type'

// ICommissionState 的类型
export interface ICommissionState {
  acceptPlan: IAcceptPlan // 上传接稿计划的数据类型
  userPlan: IUserAcceptPlan | null //用户接稿计划展示
  userNoPlan: boolean // 用户没有接稿计划
  useStopPlan: boolean // 用户暂时不接稿
  userPanel: IUserProfileData | null // 用户资料面板
  invitePlan: IInvitePlan // 上传邀请计划的数据类型
  userInvitePlans: IPlanCard[] // 计划items
  planStatus: number // 查询计划的类型
  isEnd: boolean // 没有更多
  userNoExist: boolean // 用户不存在
  acceptPermission: {
    isOk: boolean
    artCount: number
  } | null
  evaluate: IEvaluateCard[]
  waiting: boolean
}

export interface ICommissionDetailState {
  planDetail: IUserInvitePlan | null
  contact: {
    artist: IUserContact
    sender: IUserContact
  } | null
  evaluate: IEvaluate
  waiting: boolean
}
