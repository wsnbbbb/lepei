import request from '@/utils/request'

// 获取紧急模式列表
export function urgencyList(params) {
  return request({
    url: `emergency-mode/list`,
    method: 'get',
    params: params
  })
}
// 紧急模式-删除
export function delUrgency(params) {
  return request({
    url: `/emergency-mode`,
    method: 'delete',
    params: params
  })
}
// 紧急模式-配置保存
export function urgencyModeConfig(data) {
  return request({
    url: `/emergency-mode/save-set`,
    method: 'post',
    data
  })
}
// 紧急模式-配置详情
export function setDetail(params) {
  return request({
    url: `/emergency-mode/get-set`,
    method: 'get',
    params: params
  })
}
// 紧急模式-根据条件获取教室及其班级
export function classRoomList(params) {
  return request({
    url: `/pub/get-classroom-list`,
    method: 'get',
    params: params
  })
}
// 紧急模式-编辑详情
export function modeDetail(params) {
  return request({
    url: `/emergency-mode`,
    method: 'get',
    params: params
  })
}
// 紧急模式-编辑保存
export function updateDetail(data) {
  return request({
    url: `/emergency-mode`,
    method: 'put',
    data
  })
}
// 紧急模式-添加
export function modeAdd(data) {
  return request({
    url: `/emergency-mode`,
    method: 'post',
    data
  })
}
// 紧急模式-文件上传
export function fileUpload(data) {
  return request({
    url: `/file/upload`,
    method: 'post',
    data
  })
}
