// 引入 axios
import axios from 'axios';
import qs from 'qs';
import router from '@/router';

// 环境的切换
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'http://171.221.228.25:9200';//准生产网址
  // axios.defaults.baseURL = 'http://192.168.1.22:8083';//王飞电脑
} else {
  // axios.defaults.baseURL = 'http://192.168.1.22:8083';
  axios.defaults.baseURL = 'http://171.221.228.25:9200';
  // axios.defaults.baseURL = 'http://api.lepayedu.com';
 

}

// 超时时间
axios.defaults.timeout = 10000;
// axios.defaults.withCredentials = true;

// // 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   Toast.loading({
//     duration: 0,
//     mask: false,
//     message: '加载中...'
//   });
//   return config;
// }, function (error) {
//   // 对请求错误做些什么
//   // Toast.loading({
//   //   mask: false,
//   //   message: '加载中...'
//   // });
//   return Promise.reject(error);
// });

// 响应拦截
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          router.replace({
            path: '/web/visit-records/logo',
            query: {
              redirect: router.currentRoute.fullPath
            }
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
            message: error.response.data.message,
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
