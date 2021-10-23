import request from '@/utils/request'

export function checkToken(token) {
  return request({
    url: `/pub/check-token`,
    method: 'get',
    params: token
  })
}
