export function getname(name) {
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
