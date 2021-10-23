// 详情请求参数-教师端
export interface RelateDetailParm {
  recordId: string;
  type: string;
}
// 详情页面数据
export interface DetailList {
  applyPersonName: string;
  portrait: string;
  examines: Array<object>;
  target: string;
  content: string;
  applyTime: string;
  pics: Array<object>;
  copyPersons: Array<object>;
  status: number;
  canExamine: boolean;
}
// 查看详情参数-家长端
export interface ReadDetailParm {
  recordId: string;
}
// 查看家庭作业详情数据-家长端
export interface ReadHomework {
  title: string;
  publisherName: string;
  applyTime: string;
  content: string;
  pics: Array<object>;
  homeworkId: number;
  hasRead: boolean;
}
// 确认收到-家庭作业
export interface ConfirmRead {
  recordId: number;
}
// 测评报告详情数据-家长端
export interface TextReport {
  type: number;
  personName: string;
  applyTime: string;
  content: string;
  pics: Array<object>;
}
// 学生请假详情页面数据-家长端
export interface LeaveDetail {
  personName: string;
  applyTime: string;
  remark: string;
  pics: Array<object>;
  status: number;
  type:string;
  canExamine: boolean;
  startTime: string;
  endTime: string;
  days: number;
  typeName: string;
}
// 请假审批页面数据-教师端
export interface examineLeave {
  applyPersonName: string;
  applyTime: string;
  content: string;
  pics: Array<object>;
  status: number;
  type:string;
  canExamine: boolean;
  startTime: string;
  endTime: string;
  days: number;
  typeName: string;
  portrait: string;
  examines: Array<object>;
  copyPersons: Array<object>;
}
// 审批学生请假
export interface clickExamine {
  recordId: string;
  type: string;
  status: string;
}
// 查看通知详情数据-家长端
export interface ReadNotice {
  title: string;
  publisherName: string;
  schoolName: string;
  applyTime: string;
  content: string;
  contentType: number;
  pics: Array<object>;
  noticeId: number;
  hasRead: boolean;
}
// 通知详情页面数据
export interface noticeData {
  applyPersonName: string;
  title: string;
  portrait: string;
  examines: Array<object>;
  target: string;
  content: string;
  typeName: string;
  applyTime: string;
  pics: Array<object>;
  copyPersons: Array<object>;
  canExamine: boolean;
}