// 引入 axios
import axios from 'axios';
import qs from 'qs';
import { Toast } from 'vant';
import router from '@/router';
import { log } from 'util';

// 环境的切换
if (process.env.NODE_ENV == 'development') {
  // axios.defaults.baseURL = 'http://110.185.100.173:9901';
  axios.defaults.baseURL = 'http://139.155.92.226:7005';//准生产网址
  // axios.defaults.baseURL = 'http://api.lepayedu.com';
  // axios.defaults.baseURL = 'http://192.168.31.178:8095';//王飞电脑
} else {
  // axios.defaults.baseURL = 'http://192.168.1.22:8083';
  // axios.defaults.baseURL = 'http://47.108.214.53:10002';
  axios.defaults.baseURL = 'http://139.155.92.226:7005';//准生产网址
  // axios.defaults.baseURL = 'http://api.lepayedu.com';
  // axios.defaults.baseURL = 'http://47.108.214.53:10002';
}

// 超时时间
axios.defaults.timeout = 10000;
// axios.defaults.withCredentials = true;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  Toast.loading({
    duration: 0,
    mask: false,
    message: '加载中...'
  });
  return config;
}, function (error) {
  // 对请求错误做些什么
  // Toast.loading({
  //   mask: false,
  //   message: '加载中...'
  // });
  return Promise.reject(error);
});

// 响应拦截
axios.interceptors.response.use(
  response => {
    Toast.clear()
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    Toast.clear()
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          let id=sessionStorage.getItem("shoolId");
          console.log(id)
          router.replace({
            path: `/login/${id}`
          });
          break;
        case 404:
          Toast({
            message: '网络请求不存在',
            duration: 1500,
            forbidClick: true
          });
          break;
        default:
          Toast({
            message: error.response.data.description,
            duration: 1500,
            forbidClick: true
          });
      }
      return Promise.reject(error.response);
    }
  }
);

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
       console.log(err);
        // reject(err.data);
      });
  });
}
export function upLoaderImg (file) {	//file为你读取成功的回调文件信息
	let params = new FormData()
  params.append('file', file)
  params.append('token', sessionStorage.getItem("qiniutoken"))
  // console.log(sessionStorage.getItem("token"));
	let config = {
        headers: { //添加请求头
          	'Content-Type': 'multipart/form-data'
        }
  	}
	return new Promise((resolve, reject) => {
		axios.post('http://upload.qiniup.com', params, config).then(res => {
	        if (res.status === 200) {			//如果为真 resolve出去
	        	resolve(res.data)
	        } else {
	        	//否则 Toast 提示
	        	// Toast.fail(res.data && (res.data.description))
	        	reject(res.data)
	        }
        }).catch(err => {
          	Toast.fail('系统异常')
          	reject(err)
    	});
	})
}
 