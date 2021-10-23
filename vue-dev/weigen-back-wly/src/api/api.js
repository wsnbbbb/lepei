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

export const getEntryMacList = params => { return axios.get(`${base}/manager/entry-mac`, { params: params }).then(res => res.data); };

export const getCameraList = params => { return axios.get(`${base}/manager/entry-camera/list`, Qs.stringify(params)).then(res => res.data); };

export const getAllDevices = params => { return axios.get(`${base}/manager/entry-mac/get-all-devices`, { params: params }).then(res => res.data); };

export const getBuilds = params => { return axios.get(`${base}/pub/place/get-builds`, Qs.stringify(params)).then(res => res.data); };

export const getPlaces = params => { return axios.get(`${base}/pub/place/get-places-by-build`, { params: params }).then(res => res.data); };

export const getDeviceList = params => { return axios.get(`${base}/manager/entry-mac/device-list`, Qs.stringify(params)).then(res => res.data); };

export const createDevice = params => { return axios.post(`${base}/manager/entry-mac/create-device`,JSON.stringify(params)).then(res => res.data); };

export const deleteDevice = params => { return axios.delete(`${base}/manager/entry-mac/delete-device`, { params: params }).then(res => res.data); };

export const records = params => { return axios.get(`${base}/manager/entry-mac/records`, { params: params }).then(res => res.data); };

export const entryCamera = params => { return axios.get(`${base}/manager/entry-camera`, { params: params }).then(res => res.data); };

export const entryTimeSlot = params => { return axios.get(`${base}/manager/entry-time-slot`, { params: params }).then(res => res.data); };

export const preViewEntryTime= params => { return axios.get(`${base}/manager/entry-time-slot/${params.id}`, params ).then(res => res.data); };

export const updateEntryTime= params => { return axios.put(`${base}/manager/entry-time-slot/${params.index}`, params ).then(res => res.data); };

export const getTimeIndexs= params => { return axios.get(`${base}/manager/entry-time-slot/get-time-indexs`, { params: params } ).then(res => res.data); };

export const getTimeSlot= params => { return axios.get(`${base}/manager/entry-time-slot`, { params: params } ).then(res => res.data); };

export const addTimeSlot = params => { return axios.post(`${base}/manager/entry-time-slot`,JSON.stringify(params)).then(res => res.data); };

export const getRelateTimeSlot= params => { return axios.get(`${base}/manager/entry-time-slot/get-relate-time-slot`, { params: params } ).then(res => res.data); };

export const getEntryRule= params => { return axios.get(`${base}/manager/entry-rule`, { params: params } ).then(res => res.data); };

export const addEntryRule = params => { return axios.post(`${base}/manager/entry-rule`, JSON.stringify(params)).then(res => res.data); };

export const getPersonsList = params => { return axios.get(`${base}/manager/entry-rule/get-persons-list`, { params: params } ).then(res => res.data); };

export const getJob = params => { return axios.get(`${base}/pub/job/get-job`, { params: params } ).then(res => res.data); };

export const getEntryRuleSend = params => { return axios.get(`${base}/manager/entry-rule-send`, { params: params } ).then(res => res.data); };

export const distribute = params => { return axios.post(`${base}/manager/entry-rule/distribute`, JSON.stringify(params) ).then(res => res.data); };

export const getGrade = params => { return axios.get(`${base}/pub/grades/get-grade`, { params: params } ).then(res => res.data); };

export const getClasses = params => { return axios.get(`${base}/pub/classes/get-classes-by-grade-id`, { params: params } ).then(res => res.data); };

export const entryDataRecords = params => { return axios.get(`${base}/manager/entry-data`, { params: params } ).then(res => res.data); };

export const entryMacDetail = params => { return axios.get(`${base}/manager/entry-mac/detail`, { params: params } ).then(res => res.data); };

export const updateDevice = params => { return axios.put(`${base}/manager/entry-mac/update-device?devSn=${params.oldDevSn}`,JSON.stringify(params)).then(res => res.data); };

export const deleteTimeSlot= params => { return axios.delete(`${base}/manager/entry-time-slot/${params.index}`, params ).then(res => res.data); };

export const deleteRule= params => { return axios.delete(`${base}/manager/entry-rule/${params.id}`, params ).then(res => res.data); };

export const cameraRecords = params => { return axios.get(`${base}/manager/entry-camera/records`, { params: params } ).then(res => res.data); };

export const entryRuleDetail = params => { return axios.get(`${base}/manager/entry-rule/${params.id}`, { }).then(res => res.data); };

export const updateRule = params => { return axios.put(`${base}/manager/entry-rule/${params.id}`, params).then(res => res.data); };

export const getDepartment = params => { return axios.get(`${base}/pub/department/list`, { params: params }).then(res => res.data); };

export const getTimeSlots = params => { return axios.get(`${base}/manager/entry-time-slot/get-time-slots`, { params: params }).then(res => res.data); };

export const authorize = params => { return axios.post(`${base}/pub/users/authorize`,  JSON.stringify(params)).then(res => res.data); };

export const savePicSet = params => { return axios.post(`${base}/manager/entry-config/save-pic-set`,  JSON.stringify(params)).then(res => res.data); };

export const showPicSet = params => { return axios.get(`${base}/manager/entry-config/show-pic-set`, { params: params }).then(res => res.data); };

export const getPersonByChipNo = params => { return axios.get(`${base}/pub/persons/get-person-by-chip-no`, { params: params }).then(res => res.data); };

export const getPersonList = params => { return axios.get(`${base}/manager/persons`, { params: params }).then(res => res.data); };

export const getPersonDetail = params => { return axios.get(`${base}/manager/persons/${params.id}`, { }).then(res => res.data); };

export const updataPersonDetail = params => { return axios.put(`${base}/manager/persons/${params.id}`, params).then(res => res.data); };

export const deletePerson = params => { return axios.delete(`${base}/manager/persons/${params.id}`, { }).then(res => res.data); };

export const addPerson = params => { return axios.post(`${base}/manager/persons`, JSON.stringify(params)).then(res => res.data); };

export const batchDeletePerson = params => { return axios.post(`${base}/manager/persons/batch-delete`, params).then(res => res.data); };

export const getAccountList = params => { return axios.get(`${base}/manager/account`, { params: params }).then(res => res.data); };

export const createAccount = params => { return axios.post(`${base}/manager/account`, JSON.stringify(params)).then(res => res.data); };

export const searchPerson = params => { return axios.get(`${base}/pub/persons/get-list-by-kw`, { params: params }).then(res => res.data); };

export const getAccountDetail = params => { return axios.get(`${base}/manager/account/${params.id}`, { }).then(res => res.data); };

export const editAccount = params => { return axios.put(`${base}/manager/account/${params.id}`, JSON.stringify(params)).then(res => res.data); };

export const deleteAccount = params => { return axios.delete(`${base}/manager/account/${params.id}`, { }).then(res => res.data); };

export const entryDataExport = params => { return axios.get(`${base}/manager/entry-data/export`, { params: params }).then(res => res.data); };



// pub/persons/get-person-by-chip-no