
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

