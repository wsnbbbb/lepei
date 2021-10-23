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

let user = {
  // personId: window.app.getCurrentCardId(),
  // uid: JSON.parse(window.app.publicParameters()).uid,
  // token: JSON.parse(window.app.publicParameters()).token

  // personId: 39,
  // uid: 9,
  // token: "6D45C0A6-0135-97E7-37C7-E80DAA059169"
};


if (process.env.NODE_ENV == 'development') {
  // baseUrl='http://192.168.1.12:8092'
  baseUrl = 'http://39.108.73.183'
  // baseUrl = 'http://171.221.228.25:9200'
  // baseUrl='http://api.lepayedu.com'
  // baseUrl = 'http://171.221.228.25:7008'
} else if (process.env.NODE_ENV == 'production') {
  // baseUrl='http://192.168.31.46:8080'
  // baseUrl = 'http://171.221.228.25:7008'
  // baseUrl = 'http://39.108.73.183'
     baseUrl = "http://wechat.lepayedu.com"
  // baseUrl = 'http://api.lepayedu.com'

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