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
let qrBaseUrl='';

let redirectUrlAndroid=window.location.protocol+"//"+window.location.host+'/pay-online/index.html#/detail-waiting-result';
let redirectUrlIos=window.location.protocol+"//"+window.location.host+'/pay-online/index.html#/detail-waiting-result-ios';

// let listUrl=window.location.protocol+"//"+window.location.host+'/pay-online/index.html#/index/list';
// let indexUrl=window.location.protocol+"//"+window.location.host+'/pay-online/index.html#/index';
let chargeAgreementUrl="/web/help/protocol?id=4"

if (process.env.NODE_ENV == 'development') {
  // baseUrl = 'http://139.155.92.226:7005'
  baseUrl='http://api.lepayedu.com'
}else if(process.env.NODE_ENV == 'production'){
  // baseUrl = 'http://139.155.92.226:7005'
  baseUrl='http://api.lepayedu.com'

}

export {
	baseUrl,
  qrBaseUrl,
	routerMode,
	imgBaseUrl,
  redirectUrlAndroid,
  redirectUrlIos,
  chargeAgreementUrl
}