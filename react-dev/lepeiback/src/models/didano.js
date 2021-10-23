
import  { didanoDevices, deviceDetail, updateDevice, createDevice, deleteDevice, didanoSyncRecords, fullSync ,
  studentTakeawayRecords, didanoDetectionRecords}  from 'services/index';
export default {

    namespace: 'didano',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * didanoDevices({ payload,callback }, { call, put }) {  // 设备列表
        let res=yield call(didanoDevices,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * deviceDetail({ payload,callback }, { call, put }) {  // 设备详情
        let res=yield call(deviceDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateDevice({ payload,callback }, { call, put }) {  // 更新设备
        let res=yield call(updateDevice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * createDevice({ payload,callback }, { call, put }) {  // 创建设备
        let res=yield call(createDevice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deleteDevice({ payload,callback }, { call, put }) {  // 删除设备
        let res=yield call(deleteDevice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * didanoSyncRecords({ payload,callback }, { call, put }) {  // 同步信息记录
        let res=yield call(didanoSyncRecords,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * fullSync({ payload,callback }, { call, put }) {  // 全量同步
        let res=yield call(fullSync,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * studentTakeawayRecords({ payload,callback }, { call, put }) {  // 全量同步
        let res=yield call(studentTakeawayRecords,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * didanoDetectionRecords({ payload,callback }, { call, put }) {  // 全量同步
        let res=yield call(didanoDetectionRecords,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveDetail(state, action) {
        return { ...state, canteenMenuDetail:{...action.payload }};
      }
    },
  
  };
  