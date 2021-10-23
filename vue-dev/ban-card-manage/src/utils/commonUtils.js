import { base, imgBase, templateUrl } from '@/config'

var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'
function padding(s, len) {
  var leng = len - (s + '').length
  for (var i = 0; i < leng; i++) { s = '0' + s }
  return s
}
// 获取地址栏参数
export function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const href = window.location.href
  const index = href.indexOf('?')
  const query = href.substr(index)
  const r = query.substr(1).match(reg)
  console.log(555, index, href)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

export function getImg(path) {
  if (path) {
    return `${imgBase}${path}`
  } else {
    return ''
  }
}
// 下载模板
export function getUpload(path) {
  return `${templateUrl}${path}`
}
// 导出
export function portUrl(path) {
  return `${base}${path}`
}
// 时间转换
export function formatDate(date, pattern) {
  pattern = pattern || DEFAULT_PATTERN
  return pattern.replace(SIGN_REGEXP, function($0) {
    switch ($0.charAt(0)) {
      case 'y': return padding(date.getFullYear(), $0.length)
      case 'M': return padding(date.getMonth() + 1, $0.length)
      case 'd': return padding(date.getDate(), $0.length)
      case 'w': return date.getDay() + 1
      case 'h': return padding(date.getHours(), $0.length)
      case 'm': return padding(date.getMinutes(), $0.length)
      case 's': return padding(date.getSeconds(), $0.length)
    }
  })
}
// 日期转换成时间戳
export function dateToTimestamp(str) {
  var T = new Date(str)
  var timestamp = T.getTime() / 1000 // 转换成秒
  return timestamp
}
// 判断间隔时间差大于10分钟, 如果任一为空 返回true
export function judgeTimeDiffer(startTime, endTime) {
  if (!startTime || !endTime) return true
  var start = new Date(('2000-01-01 ' + startTime).replace('//-/g', '//'))
  var end = new Date(('2000-01-01 ' + endTime).replace('//-/g', '//'))
  var result = parseFloat((end.getTime() - start.getTime()) / 1000 / 60)
  if (result > 10) return true
  return false
}
