const env = process.env.NODE_ENV;
let _base = "";
let _imgBase = "";
let _templateUrl = "";

if(env === "development"){
  //开发
  _base = 'http://139.155.92.226:7012/api';
  _imgBase = 'http://test.qiniu.lepayedu.com/';
  _templateUrl = '/static/template/';
} else if(env === "test"){
  //测试
  _base = 'http://139.155.92.226:7012/api';
  _imgBase = 'http://test.qiniu.lepayedu.com/';
  _templateUrl = '/static/template/';
} else {
  //生产
  _base = 'http://139.155.92.226:7012/api';
  _imgBase = 'http://test.qiniu.lepayedu.com/';
  _templateUrl = '/static/template/';
}


export const base = _base;
export const imgBase = _imgBase;
export const templateUrl = _templateUrl;

