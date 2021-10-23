import { imgUrl } from "../config"

export const dealImg=(img)=>{
    return `${imgUrl}${img}`
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

export const getFormatDate =(value)=>{ //获取当前日期或者转换为日期格式 2020-03-12
  var _date ;
  if(value){
    _date = new Date(value)
  }else{
    _date = new Date()
  }
  var year = _date.getFullYear();
  var month = _date.getMonth() + 1;
  var nowDate = _date.getDate();
  if (month >= 1 && month <= 9) {
  month = "0" + month;
  }
  if (nowDate >= 0 && nowDate <= 9) {
  nowDate = "0" + nowDate;
  }
  return year + "-" + month + "-" + nowDate;
}

export const getStr = (str) => { //截取图片hash值
  let index = str.lastIndexOf("/")
  let hash = str.substring(index + 1,str.length);
  return hash
}

export const applyType = (type) =>{ //审核状态
  let types = type.toString()
  switch(types){
    case "0":
      return "待审批";
    case "1":
      return "审批中";
    case "2":
      return "已通过";
    case "3":
      return "已拒绝";
    case "4":
      return "已驳回";
    case "5":
      return "已取消";
    case "6":
      return "已过期";
    case "7":
      return "已结束";
    default:
      return ""
  }
}
