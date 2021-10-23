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
export function stringCheck(str) {
  if ( str == "" ) return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
}

export const formatIdcard=(value)=>{ //身份证脱敏显示4
  let val=''
  if(value){
    val=value.substring(0,4)+'**********'+value.substring(value.length-4)
  }
    return val;
}
export const getBirthdayFromIdCard=(idCard)=> {  
  var birthday = "";  
  if(idCard != null && idCard != ""){  
      if(idCard.length == 15){  
          birthday = "19"+idCard.substr(6,6);  
      } else if(idCard.length == 18){  
          birthday = idCard.substr(6,8);  
      }  
      birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");  
  }  
  return birthday;  
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
export const notSeconds=(now)=>{ //时间戳转换为时间 2018-12-17 14:14
  if(now){
    var date = new Date(now*1000);//如果date为13位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes());
    return Y+M+D+h+m;
  }else{
    return ''
  }
}


export const formatDate1=(now)=>{ //时间戳转换为时间 2018-12-17
  if(now){
    var date = new Date(now*1000);//如果date为13位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    return Y+M+D;
  }else{
    return ''
  }
}

export const dateToStep=(dataStr)=>{ //时间转换为时间戳 2018-12-17  3323232323
  return (new Date(`${dataStr} 12:00:00`)).getTime()/1000;
}

export const getBeforeDate=(n)=>{ //获取当前日期前n天的日期 n取1，2，3 等
  var n = n;
  var d = new Date();
  var year = d.getFullYear();
  var mon=d.getMonth()+1;
  var day=d.getDate();
  if(day <= n){
    if(mon>1) {
        mon=mon-1;
    }else {
      year = year-1;
      mon = 12;
      }
    }
  d.setDate(d.getDate()-n);
  year = d.getFullYear();
  mon=d.getMonth()+1;
  day=d.getDate();
  var s = year+"年"+(mon<10?('0'+mon):mon)+"月"+(day<10?('0'+day):day)+'日';
  return s;
}
