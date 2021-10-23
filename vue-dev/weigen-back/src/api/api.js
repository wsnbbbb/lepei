import axios from 'axios';
import rootVueObj from '../main.js';
import Qs from 'qs'
import { Message } from 'element-ui';
import { Loading } from 'element-ui';
let loading        //定义loading变量

const startLoading=()=> {    //使用Element loading-start 方法

    loading = Loading.service({
        target: ".content-container",
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.1)'
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

export const getEntryMacList = params => { return axios.get(`${base}/wg-entry/entry-mac`, { params: params }).then(res => res.data); };

export const getCameraList = params => { return axios.get(`${base}/wg-entry/entry-camera/list`, Qs.stringify(params)).then(res => res.data); };

export const getAllDevices = params => { return axios.get(`${base}/wg-entry/entry-mac/get-all-devices`, { params: params }).then(res => res.data); };

export const getBuilds = params => { return axios.get(`${base}/pub/place/get-builds`, Qs.stringify(params)).then(res => res.data); };

export const getPlaces = params => { return axios.get(`${base}/pub/place/get-places-by-build`, { params: params }).then(res => res.data); };

export const getDeviceList = params => { return axios.get(`${base}/wg-entry/entry-mac/device-list`, Qs.stringify(params)).then(res => res.data); };

export const createDevice = params => { return axios.post(`${base}/wg-entry/entry-mac/create-device`,JSON.stringify(params)).then(res => res.data); };

export const deleteDevice = params => { return axios.delete(`${base}/wg-entry/entry-mac/delete-device`, { params: params }).then(res => res.data); };

export const openDevice = params => { return axios.post(`${base}/wg-entry/entry-mac/open-device`, JSON.stringify(params)).then(res => res.data); };

export const records = params => { return axios.get(`${base}/wg-entry/entry-mac/records`, { params: params }).then(res => res.data); };

export const entryCamera = params => { return axios.get(`${base}/wg-entry/entry-camera`, { params: params }).then(res => res.data); };

export const entryTimeSlot = params => { return axios.get(`${base}/wg-entry/entry-time-slot`, { params: params }).then(res => res.data); };

export const preViewEntryTime= params => { return axios.get(`${base}/wg-entry/entry-time-slot/${params.id}`, params ).then(res => res.data); };

export const updateEntryTime= params => { return axios.put(`${base}/wg-entry/entry-time-slot/${params.index}`, params ).then(res => res.data); };

export const getTimeIndexs= params => { return axios.get(`${base}/wg-entry/entry-time-slot/get-time-indexs`, { params: params } ).then(res => res.data); };

export const getTimeSlot= params => { return axios.get(`${base}/wg-entry/entry-time-slot`, { params: params } ).then(res => res.data); };

export const addTimeSlot = params => { return axios.post(`${base}/wg-entry/entry-time-slot`,JSON.stringify(params)).then(res => res.data); };

export const getRelateTimeSlot= params => { return axios.get(`${base}/wg-entry/entry-time-slot/get-relate-time-slot`, { params: params } ).then(res => res.data); };

export const getEntryRule= params => { return axios.get(`${base}/wg-entry/entry-rule`, { params: params } ).then(res => res.data); };

export const addEntryRule = params => { return axios.post(`${base}/wg-entry/entry-rule`, JSON.stringify(params)).then(res => res.data); };

export const getPersonsList = params => { return axios.get(`${base}/wg-entry/entry-rule/get-persons-list`, { params: params } ).then(res => res.data); };

export const getJob = params => { return axios.get(`${base}/pub/job/get-job`, { params: params } ).then(res => res.data); };

export const getEntryRuleSend = params => { return axios.get(`${base}/wg-entry/entry-rule-send`, { params: params } ).then(res => res.data); };

export const distribute = params => { return axios.post(`${base}/wg-entry/entry-rule-send/distribute`, JSON.stringify(params) ).then(res => res.data); };

export const distributeByDevsn = params => { return axios.post(`${base}/wg-entry/entry-rule-send/distribute-by-dev-sn`, JSON.stringify(params) ).then(res => res.data); };

export const getGrade = params => { return axios.get(`${base}/pub/grades/get-grade`, { params: params } ).then(res => res.data); };

export const getClasses = params => { return axios.get(`${base}/pub/classes/get-classes-by-grade-id`, { params: params } ).then(res => res.data); };

export const entryDataStudent = params => { return axios.get(`${base}/wg-entry/entry-data/student`, { params: params } ).then(res => res.data); };

export const entryDataTeacher = params => { return axios.get(`${base}/wg-entry/entry-data/teacher`, { params: params } ).then(res => res.data); };

export const entryDataParent = params => { return axios.get(`${base}/wg-entry/entry-data/parent`, { params: params } ).then(res => res.data); };

export const entryDataRecords = params => { return axios.get(`${base}/wg-entry/entry-data/records`, { params: params } ).then(res => res.data); };

export const entryMacDetail = params => { return axios.get(`${base}/wg-entry/entry-mac/detail`, { params: params } ).then(res => res.data); };

export const updateDevice = params => { return axios.put(`${base}/wg-entry/entry-mac/update-device?devSn=${params.oldDevSn}`,JSON.stringify(params)).then(res => res.data); };

export const deleteTimeSlot= params => { return axios.delete(`${base}/wg-entry/entry-time-slot/${params.index}`, params ).then(res => res.data); };

export const deleteRule= params => { return axios.delete(`${base}/wg-entry/entry-rule/${params.id}`, params ).then(res => res.data); };

export const cameraRecords = params => { return axios.get(`${base}/wg-entry/entry-camera/records`, { params: params } ).then(res => res.data); };

export const entryRuleDetail = params => { return axios.get(`${base}/wg-entry/entry-rule/${params.id}`, { params: params }).then(res => res.data); };

export const updateRule = params => { return axios.put(`${base}/wg-entry/entry-rule/${params.id}`, params).then(res => res.data); };

export const getDepartment = params => { return axios.get(`${base}/pub/department/list`, { params: params }).then(res => res.data); };

export const getTimeSlots = params => { return axios.get(`${base}/wg-entry/entry-time-slot/get-time-slots`, { params: params }).then(res => res.data); };

export const authorize = params => { return axios.post(`${base}/pub/users/authorize`,  JSON.stringify(params)).then(res => res.data); };

export const savePicSet = params => { return axios.post(`${base}/wg-entry/entry-config/save-pic-set`,  JSON.stringify(params)).then(res => res.data); };

export const showPicSet = params => { return axios.get(`${base}/wg-entry/entry-config/show-pic-set`, { params: params }).then(res => res.data); };

export const getPersonByChipNo = params => { return axios.get(`${base}/pub/persons/get-person-by-chip-no`, { params: params }).then(res => res.data); };

export const getThermometryDevices = params => { return axios.get(`${base}/wg-entry/thermometry-devices`, { params: params }).then(res => res.data); };

export const updateThermometryDevice = params => { return axios.put(`${base}/wg-entry/thermometry-devices/update-device?devSn=${params.devSn}`, params).then(res => res.data); };

export const statusRecords = params => { return axios.get(`${base}/wg-entry/thermometry-devices/status-records`, { params: params }).then(res => res.data); };

export const searchRejistFail = params => { return axios.get(`${base}/wg-entry/kelu-face/register-fail-list`, { params: params }).then(res => res.data); };

export const retryFaceRegist = params => { return axios.post(`${base}/wg-entry/kelu-face/single-register`, JSON.stringify(params)).then(res => res.data); };

export const getStrategyPersons = params => { return axios.get(`${base}/wg-entry/person-rule`, { params: params }).then(res => res.data); };

export const getChoosablePerson = params => { return axios.get(`${base}/wg-entry/person-rule/rule-list`, { params: params }).then(res => res.data); };

export const chooseRule = params => { return axios.post(`${base}/wg-entry/person-rule/update-rule`, JSON.stringify(params) ).then(res => res.data); };

export const getSchoolDetail = params => { return axios.post(`${base}/pub/schools/detail`, JSON.stringify(params) ).then(res => res.data); };

export const getModules = params => { return axios.get(`${base}/pub/schools/get-modules`, { params: params }  ).then(res => res.data); };

export const getSocketServerules = params => { return axios.get(`${base}/wg-entry/entry-config/get-socket-server`, { params: params } ).then(res => res.data); };

// 人脸识别
export const getDuFaceDevice = params => { return axios.get(`${base}/du-face/device`, { params: params }).then(res => res.data); };

export const deviceDetail = params => { return axios.get(`${base}/du-face/device/detail`, { params: params }).then(res => res.data); };

export const creatDevice = params => { return axios.post(`${base}/du-face/device/create-device`, JSON.stringify(params)).then(res => res.data); };

export const editDevice = params => { return axios.put(`${base}/du-face/device/update-device?oldDevSn=${params.oldDevSn}`,JSON.stringify(params)).then(res => res.data); };

export const delDevice = params => { return axios.delete(`${base}/du-face/device/delete-device?devSn=${params.devSn}`,params).then(res => res.data); };

export const devInit = params => { return axios.post(`${base}/du-face/device-config-sync/init`, JSON.stringify(params)).then(res => res.data); };

export const getFaceLibrary = params => { return axios.get(`${base}/du-face/face-register/get-person-info-by-device`,{ params: params }).then(res => res.data); };

export const getGradesByType = params => { return axios.get(`${base}/pub/grades/get-grades-by-type`,{ params: params }).then(res => res.data); };

export const batchRegister = params => { return axios.post(`${base}/du-face/face-register/batch-register`,JSON.stringify(params)).then(res => res.data); };

export const personRegister = params => { return axios.post(`${base}/du-face/face-register/register-one`,JSON.stringify(params)).then(res => res.data); };

export const batchDelFace = params => { return axios.post(`${base}/du-face/face-register/batch-del`,JSON.stringify(params)).then(res => res.data); };

export const delPerson = params => { return axios.post(`${base}/du-face/face-register/del-one`,JSON.stringify(params)).then(res => res.data); };

export const getRecordList = params => { return axios.get(`${base}/du-face/face-recognize`,{ params: params }).then(res => res.data); };

export const getAllFace = params => { return axios.get(`${base}/du-face/face-register/person-info`,{ params: params }).then(res => res.data); };

export const registerDetail = params => { return axios.get(`${base}/du-face/face-register/sync-info-by-person-id`,{ params: params }).then(res => res.data); };

export const faceRegister = params => { return axios.post(`${base}/du-face/face-register/register-multiple`,JSON.stringify(params)).then(res => res.data); };

export const deviceSyncLog = params => { return axios.get(`${base}/du-face/device-config-sync/init-log`,{ params: params }).then(res => res.data); };

export const syneByDev = params => { return axios.post(`${base}/du-face/device-config-sync/sync-by-dev`,JSON.stringify(params)).then(res => res.data); };

export const syncByItem = params => { return axios.post(`${base}/du-face/device-config-sync/sync-by-item`,JSON.stringify(params)).then(res => res.data); };

export const dumuAllDevice = params => { return axios.get(`${base}/du-face/device/list`,{ params: params }).then(res => res.data); };

export const copyDev = params => { return axios.post(`${base}/du-face/face-register/copy`,JSON.stringify(params)).then(res => res.data); };

export const onlineRecord = params => { return axios.get(`${base}/du-face/device/status-records`,{ params: params }).then(res => res.data); };

export const screenSaver = params => { return axios.get(`${base}/du-face/system-config/display-img-list`,{ params: params }).then(res => res.data); };

export const setSystemItems = params => { return axios.post(`${base}/du-face/system-config/save-by-item`,JSON.stringify(params)).then(res => res.data); };

export const itemDetailList = params => { return axios.get(`${base}/du-face/device-config-sync/sync-info-by-item`,{ params: params }).then(res => res.data); };

export const reSyncByItem = params => { return axios.post(`${base}/du-face/device-config-sync/re-sync-by-item`,JSON.stringify(params)).then(res => res.data); };

export const fileUpload = params => { return axios.post(`${base}/pub/file/save`,params).then(res => res.data); };

export const addDisplayImg = params => { return axios.post(`${base}/du-face/system-config/add-display-img`,JSON.stringify(params)).then(res => res.data); };

export const editPlayingImg = params => { return axios.post(`${base}/du-face/system-config/update-display-img`,JSON.stringify(params)).then(res => res.data); };

export const delPlayingImg = params => { return axios.post(`${base}/du-face/system-config/del-display-img`,JSON.stringify(params)).then(res => res.data); };

export const playingImgDetail = params => { return axios.get(`${base}/du-face/system-config/display-img-detail`,{ params: params }).then(res => res.data); };

export const enableDisplayImg = params => { return axios.post(`${base}/du-face/system-config/enable-display-img`,JSON.stringify(params)).then(res => res.data); };

export const getCallbackDetail = params => { return axios.get(`${base}/du-face/system-config/callback-detail`).then(res => res.data); };

export const getSecurityDetail = params => { return axios.get(`${base}/du-face/system-config/security-detail`).then(res => res.data); };

export const getLogoDetail = params => { return axios.get(`${base}/du-face/system-config/logo-detail`).then(res => res.data); };

export const getPromptingDetail = params => { return axios.get(`${base}/du-face/system-config/prompting-detail`).then(res => res.data); };

export const devImport = params => { return axios.post(`${base}/du-face/device/import`,params).then(res => res.data); };


export const getStations = params => { return axios.get(`${base}/ssw-bluetooth/base-station`, { params: params }).then(res => res.data); };

export const getStationDetail = params => { return axios.get(`${base}/ssw-bluetooth/base-station/detail`, { params: params }).then(res => res.data); };

export const getStationDetail1 = params => { return axios.get(`${base}/ssw-bluetooth/base-station/list`, { params: params }).then(res => res.data); };

export const createStation = params => { return axios.post(`${base}/ssw-bluetooth/base-station/create-device`,params).then(res => res.data); };

export const updateStation = params => { return axios.put(`${base}/ssw-bluetooth/base-station/update-device?devSn=${params.devSn}`,params).then(res => res.data); };

export const deleteStation= params => { return axios.delete(`${base}/ssw-bluetooth/base-station/delete-device?devSn=${params.devSn}`, params ).then(res => res.data); };

export const getStationRecords = params => { return axios.get(`${base}/ssw-bluetooth/base-station/status-records`, { params: params }).then(res => res.data); };

export const getPositions = params => { return axios.get(`${base}/ssw-bluetooth/positions`, { params: params }).then(res => res.data); };

export const createPosition = params => { return axios.post(`${base}/ssw-bluetooth/positions`,params).then(res => res.data); };

export const getPositionDetail = params => { return axios.get(`${base}/ssw-bluetooth/positions/detail`, { params: params }).then(res => res.data); };

export const updatePosition = params => { return axios.put(`${base}/ssw-bluetooth/positions/update-data?oldPositionId=${params.oldPositionId}`,params).then(res => res.data); };

export const deletePosition= params => { return axios.delete(`${base}/ssw-bluetooth/positions/delete-data?positionId=${params.positionId}`, params ).then(res => res.data); };

export const positionImport = params => { return axios.post(`${base}/ssw-bluetooth/positions/import`,params).then(res => res.data); };

export const getPersonBracelet = params => { return axios.get(`${base}/ssw-bluetooth/person-bracelet`, { params: params }).then(res => res.data); };

export const getBraceletDetail = params => { return axios.get(`${base}/ssw-bluetooth/person-bracelet/${params.personId}`, {}).then(res => res.data); };

export const updateMac = params => { return axios.post(`${base}/ssw-bluetooth/person-bracelet/update-mac`,params).then(res => res.data); };

export const sendUserInfo = params => { return axios.post(`${base}/ssw-bluetooth/person-bracelet/send-user-info`,params).then(res => res.data); };

export const batchSendUserInfo = params => { return axios.post(`${base}/ssw-bluetooth/person-bracelet/batch-send-user-info`,params).then(res => res.data); };

export const personHealth = params => { return axios.get(`${base}/ssw-bluetooth/person-health`, { params: params }).then(res => res.data); };

export const personHealthRecords = params => { return axios.get(`${base}/ssw-bluetooth/person-health/records`, { params: params }).then(res => res.data); };

export const personTrack = params => { return axios.get(`${base}/ssw-bluetooth/person-track`, { params: params }).then(res => res.data); };

export const getDailyData = params => { return axios.get(`${base}/ssw-bluetooth/person-track/daily-data`, { params: params }).then(res => res.data); };

export const getTrackSummary = params => { return axios.get(`${base}/ssw-bluetooth/person-track/summary`, { params: params }).then(res => res.data); };

export const getTrackRecordList = params => { return axios.get(`${base}/ssw-bluetooth/person-track/records-list`, { params: params }).then(res => res.data); };

export const getElectricList = params => { return axios.get(`${base}/ssw-bluetooth/person-electric`, { params: params }).then(res => res.data); };

export const getBraceletSummary = params => { return axios.get(`${base}/ssw-bluetooth/statistics/bracelet-summary`, { params: params }).then(res => res.data); };

export const getBuildingBraceletSummary = params => { return axios.get(`${base}/ssw-bluetooth/statistics/building-bracelet-summary`, { params: params }).then(res => res.data); };

export const braceletImport = params => { return axios.post(`${base}/ssw-bluetooth/person-bracelet/import`,params).then(res => res.data); };

export const getBaseStation = params => { return axios.get(`${base}/ssw-bluetooth/base-station/list`, { params: params }).then(res => res.data); };

export const sswStationImport = params => { return axios.post(`${base}/ssw-bluetooth/base-station/import`,params).then(res => res.data); };

// ssw-bluetooth/person-bracelet/import