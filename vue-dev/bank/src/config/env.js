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
    // personId: window.app.getCurrentCardId(),
    // uid: JSON.parse(window.app.publicParameters()).uid,
    // token:JSON.parse(window.app.publicParameters()).token
   
    personId:7136,
    uid: 95,
    token:"16AFE6D0-E19C-1087-9FB2-74173B0E2A5E"
};

if (process.env.NODE_ENV == 'development') {
 
  baseUrl='http://171.221.228.25:9200'
  // baseUrl='http://192.168.31.179:8080'
  // baseUrl='http://api.lepayedu.com'
}else if(process.env.NODE_ENV == 'production'){
	// baseUrl='http://192.168.31.179:8080'
  // baseUrl='http://171.221.228.25:9200'
  baseUrl='http://api.lepayedu.com'

}

export {
	baseUrl,
  qrBaseUrl,
	routerMode,
	imgBaseUrl,
	user
}