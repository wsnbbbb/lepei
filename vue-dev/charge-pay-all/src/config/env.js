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
// let redirectUrlIosForAlipay = "http://test.lepayedu.com:7023" +'/charge-pay-all-result/template/result-ios-alipay.html';

let alipayStr = "https://openapi.alipay.com/gateway.do?"


if (process.env.NODE_ENV == 'development') {
  // baseUrl='http://192.168.31.46:8080'
  // baseUrl = 'http://139.155.92.226:7005'
  baseUrl='http://api.lepayedu.com'
} else if (process.env.NODE_ENV == 'production') {
  // baseUrl='http://192.168.31.46:8080'
  // baseUrl = 'http://139.155.92.226:7005'
  baseUrl = 'http://api.lepayedu.com'

}

export {
  baseUrl,
  qrBaseUrl,
  routerMode,
  imgBaseUrl,
  redirectUrlAndroid,
  redirectUrlIos,
  alipayStr,
  redirectUrlIosForAlipay
}