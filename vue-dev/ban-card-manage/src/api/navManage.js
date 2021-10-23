import request from '@/utils/request'

// 获取导航管理列表
export function navManageList(params) {
  return request({
    url: `/navigations/list`,
    method: 'get',
    params: params
  })
}
// 导航管理-删除
export function delNav(params) {
  return request({
    url: `/navigations`,
    method: 'delete',
    params: params
  })
}
// 导航管理-添加
export function addNav(data) {
  return request({
    url: `/navigations`,
    method: 'post',
    data
  })
}
// 导航管理-详情
export function getNavDetail(params) {
  return request({
    url: `/navigations`,
    method: 'get',
    params: params
  })
}
// 导航管理-编辑
export function editNav(params) {
  return request({
    url: `/navigations`,
    method: 'put',
    params: params
  })
}

