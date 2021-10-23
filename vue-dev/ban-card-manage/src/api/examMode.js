import request from '@/utils/request'
/* 标准模式*/
// 获取静默时间
export function silenceTime() {
  return request({
    url: `/normal-mode/silence-detail`,
    method: 'get'
  })
}
// 设置静默时间
export function setSilenceTime(data) {
  return request({
    url: `/normal-mode/update-silence`,
    method: 'post',
    data
  })
}

/* 考试模式*/
// 获取考试名称列表
export function examList(params) {
  return request({
    url: `/exams/list`,
    method: 'get',
    params: params
  })
}
// 考试模式编辑详情
export function examDetail(params) {
  return request({
    url: `/exams`,
    method: 'get',
    params: params
  })
}
// 考试模式-添加
export function addExam(data) {
  return request({
    url: `/exams`,
    method: 'post',
    data
  })
}
// 考试模式-编辑
export function editExam(params) {
  return request({
    url: `/exams`,
    method: 'put',
    params: params
  })
}
// 考试模式-配置
export function examCofig(data) {
  return request({
    url: `/exams/save-set`,
    method: 'post',
    data
  })
}
// 考试模式-配置详情
export function examCofigDetail(params) {
  return request({
    url: `/exams/get-set`,
    method: 'get',
    params: params
  })
}
// 考试模式-删除
export function delExam(params) {
  return request({
    url: `/exams`,
    method: 'delete',
    params: params
  })
}
/* 科目管理*/
// 考试模式-科目管理-列表
export function getSubjectList(params) {
  return request({
    url: `/exam-info/list`,
    method: 'get',
    params: params
  })
}
// 获取所有考试科目
export function examSubjects(params) {
  return request({
    url: `/pub/subject-list`,
    method: 'get',
    params: params
  })
}
// 获取所有教室
export function examClassroom(params) {
  return request({
    url: `/pub/room-list`,
    method: 'get',
    params: params
  })
}
// 获取所有教师
export function allTeachers(params) {
  return request({
    url: `/pub/get-teacher-list`,
    method: 'get',
    params: params
  })
}
// 添加科目
export function addSubjects(data) {
  return request({
    url: `/exam-info`,
    method: 'post',
    data
  })
}
// 编辑科目
export function editSubjects(params) {
  return request({
    url: `/exam-info`,
    method: 'put',
    params: params
  })
}
// 获取科目详情
export function subjectDetail(params) {
  return request({
    url: `/exam-info`,
    method: 'get',
    params: params
  })
}
// 删除科目
export function delSubject(params) {
  return request({
    url: `/exam-info`,
    method: 'delete',
    params: params
  })
}
/* 教室信息查询*/
export function classroomList(params) {
  return request({
    url: `/rooms/list`,
    method: 'get',
    params: params
  })
}
// 考生列表
export function examineesList(params) {
  return request({
    url: `/examinees/list`,
    method: 'get',
    params: params
  })
}
// 考生删除
export function delExaminees(params) {
  return request({
    url: `/examinees`,
    method: 'delete',
    params: params
  })
}
// 添加考生
export function addExaminees(data) {
  return request({
    url: `/examinees`,
    method: 'post',
    data
  })
}
// 导入考试模式
export function modeImport(data) {
  return request({
    url: `/exam-info/import`,
    method: 'post',
    data
  })
}
// 导入考生
export function batchImport(data) {
  return request({
    url: `/examinees/import`,
    method: 'post',
    data
  })
}
