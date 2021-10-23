import imgUrl from './config'

// 获取图片
  export function getImg (path:string) {
    if(path){
        return `${imgUrl}${path}`;
    }else{ 
      return '';
    }
  };

  export function examineType (type:string) { //审批状态
    // 0：待审批，1：同意，2：未通过
    // const types = type && type.toString()
    switch(type) {
      case "1":
        return "已同意";
      case "2":
        return "已拒绝";
      case "0":
        return "待审批";
      default:
        return ""
    }
  }
//获取QueryString的数组
  export function getQueryString() {
    let result = window.location.search.match(
      new RegExp("[?&][^?&]+=[^?&]+", "g")
    );
    if (result == null) {
      return "";
    }
    for (let i = 0; i < result.length; i++) {
      result[i] = result[i].substring(1);
    }
    return result;
  }
  //根据 QueryString 参数名称获取值
  export function getQueryStringByName(name: string) {
    let result = window.location.search.match(
      new RegExp("[?&]" + name + "=([^&]+)", "i")
    );
    if (result == null || result.length < 1) {
      return "";
    }
    return result[1];
  }
  //获取页面顶部被卷起来的高度
  export function getScrollTop() {
    return Math.max(
      //chrome
      document.body.scrollTop,
      //firefox/IE
      document.documentElement.scrollTop
    );
  }
  //获取页面文档的总高度
  export function getDocumentHeight() {
    //现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }

  //页面浏览器视口的高度
  export function getWindowHeight() {
    return document.compatMode === "CSS1Compat"
      ? document.documentElement.clientHeight
      : document.body.clientHeight;
  }

  //时间戳转换为时间 2018-12-17 14:14
  export function notSeconds (now:number) { 
    if(now){
      const date = new Date(now*1000);//如果date为13位不需要乘1000
      const Y = date.getFullYear() + '/';
      const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
      const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
      const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      const m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes());
      return Y + M + D + h + m;
    }else{
      return ''
    }
  }
  
  // 根据条件返回不同的时间格式 2020/06/07 12:12
  export function formatDate (timestamp:number) {
    //获取当前时间年，月，日
    const currentTime = new Date()
    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth() + 1 < 10 ? '0' + (currentTime.getMonth() + 1) : currentTime.getMonth() + 1;
    const currentDate = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate();
    // 传入的时间
    const date = new Date(timestamp*1000)
    const Y = date.getFullYear();  //取得4位数的年份
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;  //取得日期中的月份，其中0表示1月，11表示12月
    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();      //返回日期月份中的天数（1到31）
    const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();     //返回日期中的小时数（0到23）
    const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); //返回日期中的分钟数（0到59）
    const s = date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds(); //返回日期中的秒数（0到59）
    //判断
    if(Y == currentYear) { //等于当前年份
      if(M == currentMonth && D == currentDate) {
        return h + ":" + m
      }else{
        return M + "/" + D + " " + h + ": "+ m
      }
    }
    if(Y < currentYear) { //小于当前年份
      return Y + "/" + M + "/" + D + " " + h + ":" + m
    }
  }

  //判断是移动端还是 pc 端 ，true 表示是移动端，false 表示是 pc 端
  export function isMobileOrPc() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  }