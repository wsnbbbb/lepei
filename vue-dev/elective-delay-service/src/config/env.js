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
// let websocketUrl='ws://39.108.73.183:1011'
let websocketUrl = 'ws://api.lepayedu.com:1011';

if (process.env.NODE_ENV == 'development') {
    // baseUrl='http://139.155.92.226:7005'
  baseUrl='http://api.lepayedu.com'
}else if(process.env.NODE_ENV == 'production'){
  // baseUrl='http://139.155.92.226:7005'
  baseUrl='http://api.lepayedu.com'
}

export {
	baseUrl,
	routerMode,
	user,
  websocketUrl
}