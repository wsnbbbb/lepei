
import  {faceRegList, personFaceReg, personFaceCancel, personBatchReg,personBatchCancel, getHeadPic, updateHeadPics, facilityList, checkDeviceStatus,
  clearFacility, getAuthList, getAllDevice, copyAuth, unauthPerson, submitAuth}  from 'services/index';
export default {

    namespace: 'faceManage',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
      * faceRegList({ payload, callback }, { call, put }) {  //获取人员列表
        let res=yield call(faceRegList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * personFaceReg({ payload, callback }, { call, put }) {  //人脸注册
        let res=yield call(personFaceReg, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * personFaceCancel({ payload, callback }, { call, put }) {  //注销
        let res=yield call(personFaceCancel, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * personBatchReg({ payload, callback }, { call, put }) {  //批量注册
        let res=yield call(personBatchReg, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * personBatchCancel({ payload, callback }, { call, put }) {  //批量注销
        let res=yield call(personBatchCancel, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * changeHeadr({ payload, callback }, { call, put }) {  //头像管理
        let res=yield call(getHeadPic, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateHeadr({ payload, callback }, { call, put }) {  // 修改头像
        let res=yield call(updateHeadPics, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * facilityList({ payload, callback }, { call, put }) {  // 获取设备列表
        let res=yield call(facilityList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * checkDeviceStatus({ payload, callback }, { call, put }) {  // 获取设备详情
        let res=yield call(checkDeviceStatus, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * clearFacility({ payload, callback }, { call, put }) {  // 清空授权
        let res=yield call(clearFacility, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAuthList({ payload, callback }, { call, put }) {  // 授权记录列表
        let res=yield call(getAuthList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAllDevice({ payload, callback }, { call, put }) {  // 所有设备
        let res=yield call(getAllDevice, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * copyAuth({ payload, callback }, { call, put }) {  // 复制授权
        let res=yield call(copyAuth, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * unauthPerson({ payload, callback }, { call, put }) {  // 未授权人员列表
        let res=yield call(unauthPerson, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * submitAuth({ payload, callback }, { call, put }) {  // 提交授权人员
        let res=yield call(submitAuth, payload)
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
  
  }