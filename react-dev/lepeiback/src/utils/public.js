export const getQueryString = (name) =>{ //获取地址栏参数
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  const href = window.location.href;
  const index = href.indexOf('?');
  const query = href.substr(index);
  const r = query.substr(1).match(reg);
  if(r != null) {
    if(r[2] + "" === "null"){
      return null;
    }
    return unescape(r[2]);
  }
  return null;
}

export const scrollTop = () =>{
  document.getElementsByClassName("g-layout-content")[0].scrollTop = 0
}

export const duplicateRemoveArr = (arr) =>{
  var temp = {};   //用于name判断重复
  var result = [];  //最后的新数组
  arr.map(function (item, index) {
    if(!temp[item.personId]){
      result.push(item);
      temp[item.personId] = true;
    }
  });
  return result
}

export const addKeys = (dataSource) =>{
  if(Array.isArray(dataSource)){
    dataSource.map((item, index) =>{
      if(Object.prototype.toString.call(item) === '[Object Object]'){
        item.key = index
      }
    })
  }
}

export const getChargePlatform = (type) =>{
  switch(type+""){
    case "1":
      return "乐陪APP";
    case "2":
      return "微信公众号";
    default:
      return ""
  }
}

export const getPayChannel = (type) =>{
  switch(type+""){
    case "1":
      return "微信";
    case "2":
      return "支付宝";
    default:
      return ""
  }
}

export const getOrderStatus = (type) =>{
  switch(type+""){
    case "0":
      return "处理中";
    case "1":
      return "成功";
    case "2":
      return "失败";
    default:
      return ""
  }
}

export const getPayStatus = (type) =>{
  switch(type+""){
    case "0":
      return "未支付";
    case "1":
      return "第三方支付成功";
    case "2":
      return "第三方支付异常";
    case "5":
      return "第三方退款成功";
    default:
      return ""
  }
}

export const getChargeStatus = (type) =>{
  switch(type+""){
    case "0":
      return "待处理";
    case "1":
      return "充值成功";
    case "2":
      return "充值失败";
    default:
      return ""
  }
}

export const getOrderType = (type) =>{
  switch(type+""){
    case "1":
      return "乐陪";
    case "2":
      return "学校";
    default:
      return ""
  }
}


export const getScoreLevel = (type) =>{
  switch(type){
    case "0":
      return "";
    case "1":
      return "优秀";
    case "2":
      return "良好";
    case "3":
      return "合格";
    case "4":
      return "不合格";
    default:
      return ""
  }
}
export const getApplyType = (type) =>{ //证件类型
  switch(type){
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

export const formatVoteStatus = (type) =>{
  const types = type && type.toString()
  switch(types){
    case "1":
      return "未开始";
    case "2":
      return "进行中";
    case "3":
      return "已结束";
    case "4":
      return "已停止";
    default:
      return ""
  }
}

export const belongType = (type) =>{ //所属类型
  const types = type && type.toString()
  switch(types){
    case "1":
      return "师德师风";
    case "2":
      return "荣誉称号";
    case "3":
      return "教育教学";
    case "4":
      return "科研创新";
    case "5":
      return "支教扶薄";
    case "6":
      return "培养教师";
    case "7":
      return "指导学生";
    case "8":
      return "其他兼职";
    default:
      return ""
  }
}

export const actionType = (type) =>{ //功能类型
  // 1：教室，2：功能室，3：办公室，4：寝室，5：厕所，6：走廊，7：楼梯，8：其他
  const types=type&&type.toString()
  switch(types){
    case "1":
      return "教室";
    case "2":
      return "功能室";
    case "3":
      return "办公室";
    case "4":
      return "寝室";
    case "5":
      return "厕所";
    case "6":
      return "走廊";
    case "7":
      return "楼梯";
    case "8":
      return "其他";
  }
}

export const buildType = (type) =>{ // 建筑类型
  const types = type && type.toString()
  switch(types){
    case "1":
      return "教学楼";
    case "2":
      return "行政楼";
    case "3":
      return "宿舍楼";
    case "4":
      return "实验楼";
    case "5":
      return "操场";
    case "6":
      return "食堂";
    case "7":
      return "体育馆";
    case "8":
      return "活动中心";
    case "9":
      return "图书馆";
    case "10":
      return "校园出入口";
    default:
      return ""
  }
}

export const chartType = (type) =>{ //图标类型
  // 1：柱状图，2：气泡图，3：曲线图，4：饼状图，5：雷达图
  const types = type && type.toString()
  switch(types){
    case "1":
      return "柱状图";
    case "2":
      return "气泡图";
    case "3":
      return "曲线图";
    case "4":
      return "饼状图";
    case "5":
      return "雷达图";
    default:
      return "未知"
  }
}
export const assetStatus = (type) =>{ //资产审批状态
  // 0：撤销， 1：待审批，2：审批中，3：已通过，4：未通过，5：待领取，6：已发放
  const types = type && type.toString()
  switch(types){
    case "0":
      return "撤销";
    case "1":
      return "待审批";
    case "2":
      return "审批中";
    case "3":
      return "已通过";
    case "4":
      return "未通过";
    case "5":
      return "待领取";
    case "6":
      return "已发放";
    default:
      return "未知"
  }
}
export const getActivityType = (type) =>{ //科技馆活动类型
  // 1：待审核，3：已发布，5：已归档
  const types = type && type.toString()
  switch(types){
    case "1":
      return "待审核";
    case "3":
      return "已发布";
    case "5":
      return "已归档";
    default:
      return "未知"
  }
}

export const getTrainLevel = (type) =>{ //培训等级
  // 状态(1: 国家级, 2: 省级, 3: 市级, 4: 区县级, 5: 校级, 6:其他)
  const types = type && type.toString()
  switch(types){
    case "1":
      return "国家级";
    case "2":
      return "省级";
    case "3":
      return "市级";
    case "4":
      return "区县级";
    case "5":
      return "校级";
    case "6":
      return "其他";
    default:
      return ""
  }
}

export const getOaStatus = (type) =>{ //注册状态
  // 状态(1: 待审批, 2: 审批中, 3: 已通过, 4: 未通过, 5: 已结束)
  const types = type && type.toString()
  switch(types){
    case "1":
      return "待审批";
    case "2":
      return "审批中";
    case "3":
      return "已通过";
    case "4":
      return "未通过";
    case "5":
      return "已结束";
    default:
      return ""
  }
}

export const getSyncStatus = (type) =>{ //注册状态
  // 状态(1：同步中，2：成功，3：失败)
  const types = type && type.toString()
  switch(types){
    case "1":
      return "同步中";
    case "2":
      return "成功";
    case "3":
      return "失败";
    default:
      return ""
  }
}

export const getRegStatus = (type) =>{ //注册状态
  // 0：注册失败，1：注册成功，2：未注册
  const types = type && type.toString()
  switch(types){
    case "0":
      return "注册失败";
    case "1":
      return "成功";
    case "2":
      return "未注册";
    default:
      return ""
  }
}

export const getFileType = (type) =>{ //归档状态
  const types = type && type.toString()
  switch(types){
    case "1":
      return "正常";
    case "2":
      return "已归档";
    default:
      return ""
  }
}

export const getPersonType = (type) =>{ //人员类型(1：学生，2：教师，3：员工)
  const types = type && type.toString()
  switch(types){
    case "1":
      return "学生";
    case "2":
      return "教师";
    case "3":
      return "员工";
    default:
      return ""
  }
}

export const getAttendType=(type)=>{ //考勤类型(1: 签到, 2: 签退)
  const types=type&&type.toString()
  switch(types){
    case "1":
      return "签到";
    case "2":
      return "签退";
    default:
      return ""
  }
}

export const getHoldCheckType=(type)=>{ //考勤方式(1: 刷卡考勤, 2: 拍照考勤)
  const types=type&&type.toString()
  switch(types){
    case "1":
      return " 刷卡考勤";
    case "2":
      return "拍照考勤";
    default:
      return ""
  }
}

export const getScoreType=(type)=>{ //打分方式(1.得分值,2.扣分值,3.扣分点)
  const types=type&&type.toString()
  switch(types){
    case "1":
      return " 得分值";
    case "2":
      return "扣分值";
    case "3":
      return "扣分点";
    default:
      return ""
  }
}

export const getGradeType=(type)=>{ //学业阶段
  const types=type&&type.toString()
  switch(types){
    case "1":
      return "幼儿园";
    case "2":
      return "小学";
    case "3":
      return "初中";
    case "4":
      return "高中";
    case "5":
      return "大学";
    default:
      return ""
  }
}

export const syncStatus=(status)=>{ //状态(1：进行中，2：成功，3：失败)
  let status1=status&&status.toString()
  switch(status1){
    case "1":
      return "进行中";
    case "2":
      return "成功";
    case "3":
      return "失败";
    default:
      return ""
  }
}
export const getSexType=(type)=>{ //性别
  const types = type.toString()
  switch(types){
    case "0":
      return "保密";
    case "1":
      return "男";
    case "2":
      return "女";
    default:
      return ""
  }
}

export const getCheckType=(type)=>{ //晨检类型
  const types=type.toString()
  switch(types){
    case "0":
      return "复检";
    case "1":
      return "晨检";
    default:
      return ""
  }
}

export const getCycleType=(type)=>{ //评分周期(1.日,2.周,3.月)
  const types=type.toString()
  switch(types){
    case "1":
      return "日";
    case "2":
      return "周";
    case "3":
      return "月";
    default:
      return ""
  }
}

export const getCardType=(type)=>{ //班牌类型
  const types=type.toString()
  switch(types){
    case "1":
      return "横版";
    case "2":
      return "竖版";
    default:
      return ""
  }
}

export const getCardStatus=(status)=>{ //班牌状态
  status=status.toString()
  switch(status){
    case "0":
      return "离线";
    case "1":
      return "在线";
    default:
      return ""
  }
}

export const getResidence=(type)=>{ //读书形式
  const types=type.toString()
  switch(types){
    case "1":
      return "住读";
    case "2":
      return "走读";
    default:
      return ""
  }
}
export const getNumberType=(type)=>{ //证件类型
  switch(type){
    case "00":
      return "身份证";
    case "01":
      return "军官证";
    case "02":
      return "护照";
    case "03":
      return "入境证";
    case "04":
      return "临时身份证";
    case "05":
      return "其他";
    case "06":
      return "学生证";
    default:
      return ""
  }
}
export const getApplyStatus=(type)=>{ //审批状态
  const types=type.toString()
  switch(types){
    case "0":
      return "取消申请";
    case "1":
      return "待审核";
    case "2":
      return "审批中";
    case "3":
      return "已通过";
    case "4":
      return "未通过";
    case "5":
      return "已过期";
    default:
      return ""
  }
}
export const getDeviceStatus = (type) =>{ //设备状态
  const types=type.toString()
  switch(types){
    case "1":
      return "未绑定";
    case "2":
      return "绑定中";
    case "3":
      return "解绑中";
    case "4":
      return "未同步";
    case "5":
      return "同步中";
    case "6":
      return "已同步";
    case "7":
      return "已禁用";
    case "8":
      return "禁用中";
    case "9":
      return "启用中";
    default:
      return ""
  }
}
export const getCategory = (type) =>{ //事件类型
  const types=type.toString()
  switch(types){
    case "1":
      return "伤害类型";
    case "2":
      return "发生地点";
    case "3":
      return "伤害发生时活动";
    case "4":
      return "伤害同行";
    case "5":
      return "处理方式";
    case "6":
      return "转归";
    default:
      return ""
  }
}
export const formatDate = (now) =>{ //时间戳转换为时间 2018-12-17 14:14:30
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
export const notSeconds = (now) =>{ //时间戳转换为时间 2018-12-17 14:14
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
export const onlyDate = (now) =>{ //时间戳转换为日期 2018-12-17
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
export const dateTime=(now)=>{ //时间戳转换为时间 11月4日 12:00
  if(now){
    var date = new Date(now*1000);
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '日';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + '';
    return M+D+' '+h+m;
  }else{
    return ''
  }
}
export const isBlank=(str)=>{ //判断字符串不为空
  if(str == null || typeof str === "undefined" ||
    str == "" || str.replace(/(^\s*)|(\s*$)/g, "") == ""){
  return true;
  }
  return false;
};
export const formatIdcard=(value)=>{ //身份证脱敏显示4
  let val=''
  if(value){
    val=value.substring(0,4)+'**********'+value.substring(value.length-4)
  }
    return val;
}
export const formatPhone=(value)=>{ //手机号脱敏显示4
  let val=''
  if(value){
    val=value.substring(0,3)+'*****'+value.substring(value.length-4)
  }
    return val;
}
export const numFun=(nStr)=>{
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  console.log(x1,x2)
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

export const toTimestamp=(nStr,isStart=false)=>{
  var str=isStart?"00:00:00:00":"23:59:59:999"
  var date = new Date(`${nStr} ${str}`);
  var timestamp = Date.parse(date)/1000;
  return timestamp;
}

export const dateToTimestamp=(str)=>{
  var T = new Date(str);
  var timestamp = T.getTime()/1000; //转换成秒
  return timestamp;
}

export const getMonthTime=()=>{ //获取近一个月的时间戳
  let nowdate = new Date();
  let y = nowdate.getFullYear()+ '-';
  let m = (nowdate.getMonth()< 10 ? '0'+(nowdate.getMonth()) : (nowdate.getMonth()) )+ '-';
  let d = nowdate.getDate();
  let newDate=y+m+d+" 00:00:00";
  let preMonth=(new Date(newDate).getTime())/1000;
  console.log(preMonth)
  return preMonth;
}
export const getAttendTime=()=>{ //获取近一个月的时间
  let nowdate = new Date();
  let y = nowdate.getFullYear()+ '-';
  let m = (nowdate.getMonth()< 10 ? '0'+(nowdate.getMonth()) : (nowdate.getMonth()) )+ '-';
  let nextM = (nowdate.getMonth()+1< 10 ? '0'+(nowdate.getMonth()+1) : (nowdate.getMonth())+1 )+ '-';
  let d = nowdate.getDate();
  let attendTime=y+m+d+' 00:00:00'+' ~ '+y+nextM+d+' 23:59:59';
  console.log(attendTime)
  return attendTime;
}
export const getDays=(type)=>{ //判别是星期几
  const types=type.toString()
  switch(types){
    case "1":
      return "星期一";
    case "2":
      return "星期二";
    case "3":
      return "星期三";
    case "4":
      return "星期四";
    case "5":
      return "星期五";
    case "6":
      return "星期六";
    case "0":
      return "星期日";
    default:
      return "星期日"
  }
}
export const getWeek=(type)=>{ //判别是星期几
  const types=type.toString()
  switch(types){
    case "1":
      return "工作日（周一）";
    case "2":
      return "工作日（周二）";
    case "3":
      return "工作日（周三）";
    case "4":
      return "工作日（周四）";
    case "5":
      return "工作日（周五）";
    case "6":
      return "休息日（周六）";
    case "0":
      return "休息日（周日）";
    default:
      return "休息日（周日）"
  }
}
export const getAllDays=(begin, end)=>{
    let arr = [];
    let ab = begin.split("-");
    let ae = end.split("-");
    let db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    let de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    let unixDb = db.getTime() - 24 * 60 * 60 * 1000;
    let unixDe = de.getTime() - 24 * 60 * 60 * 1000;
    for (let k = unixDb; k<= unixDe;) {
      k = k + 24 * 60 * 60 * 1000;
      arr.push((new Date(parseInt(k))).format());
    }
    return arr;
  }

  export const getDate= (datestr) =>{
    var temp = datestr.split("-");
    if (temp[1] === '01') {
        temp[0] = parseInt(temp[0],10) - 1;
        temp[1] = '12';
    } else {
        temp[1] = parseInt(temp[1],10) - 1;
    }
    //new Date()的月份入参实际都是当前值-1
    var date = new Date(temp[0], temp[1], temp[2]);
    return date;
}

export const getDiffDate =(start, end)=> {
  var startTime = getDate(start);
  var endTime = getDate(end);
  var dateArr = [];
  while ((endTime.getTime() - startTime.getTime()) > 0) {
      var year = startTime.getFullYear();
      var month = (startTime.getMonth().toString().length === 1)&&(startTime.getMonth()!=9) ? "0" + (parseInt(startTime.getMonth().toString(),10) + 1) : (startTime.getMonth() + 1);
      var day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();
      dateArr.push(year + "-" + month + "-" + day);
      startTime.setDate(startTime.getDate() + 1);
  }
  return dateArr;
}
export const getDateData =(dateData)=> {
  let data=[]
  dateData&&dateData.map(item=>{
      let year = new Date(item).getFullYear();
      let month = (new Date(item).getMonth().toString().length === 1)&&(new Date(item).getMonth()!=9) ? "0" + (parseInt(new Date(item).getMonth().toString(),10) + 1) : (new Date(item).getMonth() + 1);
      let day = new Date(item).getDate().toString().length === 1 ? "0" + new Date(item).getDate() : new Date(item).getDate();
      data.push({
          "date":year + "-" + month + "-" + day,"week":new Date(item).getDay()
      })
  })
  return data;
}
//格式化日期：yyyy-MM-dd
export const  defaultDate=(date) =>{
  var myyear = date.getFullYear();
  var mymonth = date.getMonth()+1;
  var myweekday = date.getDate();

  if(mymonth < 10){
      mymonth = "0" + mymonth;
  }
  if(myweekday < 10){
      myweekday = "0" + myweekday;
  }
  return (myyear+"-"+mymonth + "-" + myweekday);
}
export const toDecimal2=(x)=> {
  var f = parseFloat(x);
  if (isNaN(f)) {
      return false;
  }
  var f = Math.round(x*100)/100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
      rs = s.length;
      s += '.';
  }
  while (s.length <= rs + 2) {
      s += '0';
  }
  return s;
}
export const getMonthDays=(nowYear,myMonth)=>{
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);
  return   days;
}
//判断数组是否有重复元素
export const arrIsRepeat = (arr)=>{
  var hash = {};
  for(var i in arr) {
    if(hash[arr[i]])
    return true;
    hash[arr[i]] = true;
  }
  return false;
}
export const getBeforeDate=(n)=>{
  var n = n;
  var d = new Date();
  var year = d.getFullYear();
  var mon=d.getMonth()+1;
  var day=d.getDate();
  var s
  if(day <= n){
          if(mon>1) {
             mon=mon-1;
          }
         else {
           year = year-1;
           mon = 12;
           }
         }
        d.setDate(d.getDate()-n);
        year = d.getFullYear();
        mon=d.getMonth()+1;
        day=d.getDate();
   s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
   return s;
}

//验证金额格式
export const isCorrectMoney=(money)=>{
  var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  if (reg.test(money)) {
      return true
  }else{
      return false
  }
  //000 错
  //0 对
  //0. 错
  //0.0 对
  //050 错
  //00050.12错
  //70.1 对
  //70.11 对
  //70.111错
  //500 正确
}

//验证金额格式(可为负)
export const isCorrectMoneyCanBeNegative=(money)=>{
  var reg = /(^(\-)?[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^(\-)?[0-9]\.[0-9]([0-9])?$)/;
  if (reg.test(money)) {
      return true
  }else{
      return false
  }
}

//判断间隔时间差大于20分钟, 如果任一为空 返回true
export const judgeTimeDiffer = (startTime,endTime)=> {
  if(!startTime||!endTime) return true
  var startTime =new Date(("2000-01-01 " + startTime).replace("//-/g", "//"));
  var endTime = new Date(("2000-01-01 " + endTime).replace("//-/g", "//"));
  var result = parseFloat((endTime.getTime() - startTime.getTime()) / 1000 / 60 );
  if(result > 20) return true
  return false
}

export const isNumber=(val)=> {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if(regPos.test(val) || regNeg.test(val)) {
      return true;
  } else {
      return false;
  }
}

export const isPositiveInteger=(val)=> { //正整数
  if(!(/(^[1-9]\d*$)/.test(val))){
    return false
  }
  return true
}

  // 上移数组元素
  export const upRecord = (arr, $index) => {
    if($index == 0) {
      return;
    }
    swapItems(arr, $index, $index - 1);
  };

  // 下移数组元素
  export const downRecord  = (arr, $index)=> {
    if($index == arr.length -1) {
      return;
    }
    swapItems(arr, $index, $index + 1);
  };

  // 交换数组元素
  function swapItems(arr, index1, index2){
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
  };

  export const deepClone = (obj) =>{
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
      for (let key in obj) {
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
    return objClone;
  }
