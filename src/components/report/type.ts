export interface IReportPanelProps {
  msgId: string
  //消息属于的类型 aw,tr,cm（评论）,usr(用户)，ac(接稿计划)，in(邀请计划)，ev(评价)
  msgType: 'tr' | 'aw' | 'cm' | 'usr' | 'ac' | 'in' | 'ev'
  defendant: string // 被告者
}
