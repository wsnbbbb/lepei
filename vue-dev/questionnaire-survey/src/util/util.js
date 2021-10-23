export function emailCheck(email) {
  var emailreg = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  if (!emailreg.test(email)) {
    return false;
  }
  return true;
}
export function pwdCheck(pwd) {
  var pwdreg = /^[a-zA-Z]\w{5,17}$/;
  if (!pwdreg.test(pwd)) {
    return false;
  }
  return true;
}
export function phoneNumCheck(phoneNUm) {
  var phoneNumreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!phoneNumreg.test(phoneNUm)) {
    return false;
  }
  return true;
}
export function stringCheck(string) {
  var result = removeSpace(string);
  if (result.length === 0) {
    return false;
  }
  return true;
}

function removeSpace(string) {
  var result;
  result = string.trim();
  result = result.replace(/\s/g, '');
  return result;
}

export function timeFormat(time) {
  let date = new Date(time);
  let month = date.getMonth() + 1;
  let day = date.getDay();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let str = `${month}-${day} ${hour}:${minutes}`;
  return str;
}
export const getQueryString=(name)=>{ //获取地址栏参数
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  // const query = window.location.search;
  
  const href = window.location.href;
  const index = href.indexOf('?');
  const query = href.substr(index);
  const r = query.substr(1).match(reg);
  
  if(r!=null) {
    return unescape(r[2]);
  }
  return null;  
}
export const formatDate=(now)=>{ //时间戳转换为时间 2018-12-17 14:14:30
  if(now){
    var date = new Date(now*1000);//如果date为13位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
  }else{
    return ''
  }
}

