/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *  
 */

let baseUrl = '';
let routerMode = 'hash';
let imgBaseUrl;
let qrBaseUrl = '';

let redirectUrlAndroid = window.location.protocol + "//" + window.location.host + '/charge-pay-all/index.html#/detail-waiting-result';
let redirectUrlIos = window.location.protocol + "//" + window.location.host + '/charge-pay-all-result/template/result-ios.html';
let redirectUrlIosForAlipay = window.location.protocol + "//" + window.location.host + '/charge-pay-all-result/template/result-ios-alipay.html';
let alipayStr = "https://openapi.alipay.com/gateway.do?"


let user = {}


if (process.env.NODE_ENV == 'development') {
  // baseUrl='http://192.168.31.77:80'
    // baseUrl='https://139.155.92.226:7011'
    baseUrl='http://139.155.92.226:7005'
  // baseUrl='http://api.lepayedu.com'


}else if(process.env.NODE_ENV == 'production'){
  // baseUrl='http://192.168.31.179:8080'
  baseUrl='http://139.155.92.226:7005'
  // baseUrl='http://api.lepayedu.com'
  // baseUrl='https://139.155.92.226:7011'
}

export {
  baseUrl,
  qrBaseUrl,
  routerMode,
  imgBaseUrl,
  user,
  redirectUrlAndroid,
  redirectUrlIos,
  alipayStr,
  redirectUrlIosForAlipay
}