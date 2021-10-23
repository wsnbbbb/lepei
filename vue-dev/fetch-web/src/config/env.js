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
let user={
        personId: 1,
        uid: 1,
        token:"1"
};

if (process.env.NODE_ENV == 'development') {
  // baseUrl = 'http://192.168.100.124:8080';
  // baseUrl='http://192.168.100.17:8080'
  // baseUrl='https://192.168.2.240:9980'
  // baseUrl='http://171.221.228.25:9200'
  // qrBaseUrl='http://171.221.228.25:9200';
  baseUrl='http://api.lepayedu.com'
  qrBaseUrl='http://html5.lepayedu.com';
}else if(process.env.NODE_ENV == 'production'){
	baseUrl='http://api.lepayedu.com'
  qrBaseUrl='http://html5.lepayedu.com/fetch-web/index.html#/index/rateWeb';
}

export {
	baseUrl,
  qrBaseUrl,
	routerMode,
	imgBaseUrl,
	user
}