import axios from 'axios';
import rootVueObj from '../main.js';
import Qs from 'qs'
import { Message } from 'element-ui';
import { Loading } from 'element-ui';
let loading        //定义loading变量

const startLoading=()=> {    //使用Element loading-start 方法

    loading = Loading.service({
        lock: true,
        text: '加载中……',
        // background: 'rgba(0, 0, 0, 0.8)'
    })

}
const endLoading=()=> {    //使用Element loading-close 方法
    loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}
export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
      endLoading()
  }
}

//设置全局的
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['Authorization'] = "Bearer "+sessionStorage.getItem("token");
axios.defaults.headers.common['User-Id'] = sessionStorage.getItem("userId");
axios.defaults.timeout = 30000

axios.interceptors.request.use(
  config => {
      // var token = ''
      // if(typeof Cookies.get('user') === 'undefined'){
      //     //此时为空
      // }else {
      //     token = JSON.parse(Cookies.get('user')).token
      // }//注意使用的时候需要引入cookie方法，推荐js-cookie
      // config.data = JSON.stringify(config.data);
      // config.headers = {
      //     'Content-Type':'application/json'
      // }
      // if(token != ''){
      //   config.headers.token = token;
      // }
      showFullScreenLoading()
      return config;
  },
  error => {
      tryHideFullScreenLoading()
      return Promise.reject(error);
  }
);

axios.interceptors.response.use(function (response) {
  // let loadingInstance = Loading.service({ fullscreen: true })
   
    // 对响应数据做点什么
    tryHideFullScreenLoading()

    
    return response;
  }, function (error) {
    // this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
    //   loadingInstance.close();
    // });
    // 对响应错误做点什么
    tryHideFullScreenLoading()
    
  
    if(error.response&&error.response.data.code==401){
      Message({
          message: "登陆过期，请重新登陆",
          type: 'error'
      });
      setTimeout(() => {
        rootVueObj.$router.push({ path: '/login' });
      }, 1000);
    }else if(error.response&&error.response.data.code==409){
      Message({
          message: error.response.data.msg,
          type: 'error'
      });
    }else{
      Message({
          message: "网络不给力",
          type: 'error'
      });
    }
 
    return Promise.reject(error);
  });


import {base} from '../config'

export const requestLogin = params => { return axios.post(`${base}/pub/users/login`, params).then(res => res.data); };

export const getGradesByType = params => { return axios.get(`${base}/pub/grades/get-grades-by-type`, { params: params } ).then(res => res.data); };

export const personCount = params => { return axios.get(`${base}/manager/school-statistics/person-count`, { params: params } ).then(res => res.data); };

export const schoolPersonCount = params => { return axios.get(`${base}/manager/school-statistics/school-person-count`, { params: params } ).then(res => res.data); };

export const getGradeByType = params => { return axios.get(`${base}/manager/school-statistics/get-grade-student-count-by-type`, { params: params } ).then(res => res.data); };

export const getClassByType = params => { return axios.get(`${base}/manager/school-statistics/get-class-student-count-by-grade`, { params: params } ).then(res => res.data); };

export const studentScoreList = params => { return axios.get(`${base}/manager/school-statistics/student-score-list`, { params: params } ).then(res => res.data); };

export const placeRepairCount = params => { return axios.get(`${base}/manager/business-statistics/place-repair-count`, { params: params } ).then(res => res.data); };

export const teacherLeaveCount = params => { return axios.get(`${base}/manager/business-statistics/teacher-leave-count-by-month`, { params: params } ).then(res => res.data); };

export const studentLeaveCount = params => { return axios.get(`${base}/manager/business-statistics/student-leave-count-by-month`, { params: params } ).then(res => res.data); };

export const repairCount = params => { return axios.get(`${base}/manager/business-statistics/repair-count-by-month`, { params: params } ).then(res => res.data); };

export const entryDeviceCount = params => { return axios.get(`${base}/manager/business-statistics/entry-device-count`, { params: params } ).then(res => res.data); };

export const entryDataCountByMonth = params => { return axios.get(`${base}/manager/business-statistics/entry-data-count-by-month`, { params: params } ).then(res => res.data); };

export const entryDataCountByDay = params => { return axios.get(`${base}/manager/business-statistics/entry-data-count-by-day`, { params: params } ).then(res => res.data); };

export const getSchoolDetail = params => { return axios.get(`${base}/pub/schools/detail`, { params: params } ).then(res => res.data); };

export const getAccounts = params => { return axios.get(`${base}/manager/account`, { params: params } ).then(res => res.data); };

export const getAccountDeatail= params => { return axios.get(`${base}/manager/account/${params.id}`, params ).then(res => res.data); };

export const addAccount = params => { return axios.post(`${base}/manager/account`, JSON.stringify(params)).then(res => res.data); };

export const updateAccount= params => { return axios.put(`${base}/manager/account/${params.id}`, params ).then(res => res.data); };

export const deleteAccount= params => { return axios.delete(`${base}/manager/account/${params.id}`, params ).then(res => res.data); };

export const getRole= params => { return axios.get(`${base}/manager/role`, { params: params } ).then(res => res.data); };

export const getRoleDeatail= params => { return axios.get(`${base}/manager/role/${params.id}`, params ).then(res => res.data); };

export const addRole = params => { return axios.post(`${base}/manager/role`, JSON.stringify(params)).then(res => res.data); };

export const updateRole= params => { return axios.put(`${base}/manager/role/${params.id}`, params ).then(res => res.data); };

export const deleteRole= params => { return axios.delete(`${base}/manager/role/${params.id}`, params ).then(res => res.data); };

export const getMenu= params => { return axios.get(`${base}/pub/users/get-menu`, params ).then(res => res.data); };

export const getRelatedUser= params => { return axios.get(`${base}/manager/role/related-user-detail`, { params: params }  ).then(res => res.data); };

export const saveRelatedUser= params => { return axios.post(`${base}/manager/role/save-relate-users`, params ).then(res => res.data); };

export const getTypes= params => { return axios.get(`${base}/pub/grades/get-types`, { params: params }  ).then(res => res.data); };
