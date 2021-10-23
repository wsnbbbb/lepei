import request from '@/utils/request'

// 获取数据同步列表
export function logList(params) {
  return request({
    url: `/sync-log/list`,
    method: 'get',
    params: params
  })
}
// 数据同步-配置详情
export function getSetDetail() {
  return request({
    url: `/sync-log/get-set`,
    method: 'get'
  })
}
// 数据同步-初始化
export function dataInit(data) {
  return request({
    url: `/sync-log/init`,
    method: 'post',
    data
  })
}
// 数据同步-配置
export function logConfig(data) {
  return request({
    url: `/sync-log/save-set`,
    method: 'post',
    data
  })
}
// 数据同步-同步状态
export function setSyncStatus(data) {
  return request({
    url: `/sync-log/operate`,
    method: 'post',
    data
  })
}
// 数据同步-查看日志
export function logDetail(params) {
  return request({
    url: `sync-log`,
    method: 'get',
    params: params
  })
}

