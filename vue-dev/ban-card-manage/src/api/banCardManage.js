import request from '@/utils/request'

// 获取班牌管理列表
export function banCardList(params) {
  return request({
    url: `/ban-card/list`,
    method: 'get',
    params: params
  })
}
// 获取所有教室
export function allClassRoom(params) {
  return request({
    url: `/pub/room-list`,
    method: 'get',
    params: params
  })
}
// 班牌管理-删除
export function delBancard(params) {
  return request({
    url: `/ban-card`,
    method: 'delete',
    params: params
  })
}
// 班牌管理-编辑详情
export function bancardDetail(params) {
  return request({
    url: `/ban-card`,
    method: 'get',
    params: params
  })
}
// 班牌管理-添加
export function banCardAdd(data) {
  return request({
    url: `/ban-card`,
    method: 'post',
    data
  })
}

// 班牌管理-编辑
export function banCardEdit(params) {
  return request({
    url: `/ban-card`,
    method: 'put',
    params: params
  })
}
// 班牌管理-密码管理详情
export function getPassword() {
  return request({
    url: `/ban-card/get-password`,
    method: 'get'
  })
}
// 班牌管理-密码设置
export function setPassword(data) {
  return request({
    url: `/ban-card/save-password`,
    method: 'post',
    data
  })
}
// 班牌管理-批量设置
export function batchSetTime(data) {
  return request({
    url: `/ban-card-set/save-boot-times`,
    method: 'post',
    data
  })
}
// 班牌管理-单个设置
export function singleSetTime(data) {
  return request({
    url: `/ban-card/save-boot-times`,
    method: 'post',
    data
  })
}
// 班牌管理-获取指定班牌配置
export function getTimeSet(params) {
  return request({
    url: `/ban-card/get-boot-times`,
    method: 'get',
    params: params
  })
}

