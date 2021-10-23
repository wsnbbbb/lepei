
import  { aerialViewDetail, getDeviceType, getDeviceList, getDeviceDetail, editDevice,addDevice, 
  delDevice,importDevice,getAllDevices, pointDel,aerialViewPoints,savePointPosition,aerialViewSet, getBuildPoints , getAllBuildings, setBuildPoints }  from 'services/index';
export default {

    namespace: 'dataScreem',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * aerialViewDetail({ payload,callback }, { call, put }) {  // 获取地图详情
        let res=yield call(aerialViewDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * aerialViewSet({ payload,callback }, { call, put }) {  // 地图上传
        let res=yield call(aerialViewSet,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getDeviceType({ payload,callback }, { call, put }) {  // 获取设备类型
        let res=yield call(getDeviceType,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getDeviceList({ payload,callback }, { call, put }) {  // 获取设备列表
        let res=yield call(getDeviceList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getDeviceDetail({ payload,callback }, { call, put }) {  // 获取设备详情
        let res=yield call(getDeviceDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editDevice({ payload,callback }, { call, put }) {  // 获取设备详情
        let res=yield call(editDevice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addDevice({ payload,callback }, { call, put }) {  // 添加
        let res=yield call(addDevice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delDevice({ payload,callback }, { call, put }) {  // 删除
        let res=yield call(delDevice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importDevice({ payload,callback }, { call, put }) {  // 导入
        let res=yield call(importDevice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAllDevices({ payload,callback }, { call, put }) {  // 获取树状结构设备
        let res=yield call(getAllDevices,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * pointDel({ payload,callback }, { call, put }) {  // 点位删除
        let res=yield call(pointDel,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * aerialViewPoints({ payload,callback }, { call, put }) {  // 点位列表
        let res=yield call(aerialViewPoints,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * savePointPosition({ payload,callback }, { call, put }) {  // 点位设置
        let res=yield call(savePointPosition,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getBuildPoints({ payload,callback }, { call, put }) {  // 点位列表
        let res=yield call(getBuildPoints,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getAllBuildings({ payload, callback }, { call, put }) {
        let res=yield call(getAllBuildings, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * setBuildPoints({ payload, callback }, { call, put }) {
        let res=yield call(setBuildPoints, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      
    },
  
    reducers: {
      save(state,action){
        return{...state,...action.payload}
      }
    },
  
  };
  