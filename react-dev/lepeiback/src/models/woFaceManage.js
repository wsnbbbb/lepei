
import  {faceRegList2, personFaceReg2, personFaceCancel2, personBatchReg2,personBatchCancel2, getHeadPic, updateHeadPics, facilityList2, checkDeviceStatus2,
  clearFacility2, getAuthList2, getAllDevice2, copyAuth2, unauthPerson2, submitAuth2 }  from 'services/index';
export default {

    namespace: 'woFaceManage',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
      * faceRegList({ payload, callback }, { call, put }) {  //获取人员列表
        let res=yield call(faceRegList2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * personFaceReg({ payload, callback }, { call, put }) {  //人脸注册
        let res=yield call(personFaceReg2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * personFaceCancel({ payload, callback }, { call, put }) {  //注销
        let res=yield call(personFaceCancel2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * personBatchReg({ payload, callback }, { call, put }) {  //批量注册
        let res=yield call(personBatchReg2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * personBatchCancel({ payload, callback }, { call, put }) {  //批量注销
        let res=yield call(personBatchCancel2, payload)
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
        let res=yield call(facilityList2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * checkDeviceStatus({ payload, callback }, { call, put }) {  // 获取设备详情
        let res=yield call(checkDeviceStatus2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * clearFacility({ payload, callback }, { call, put }) {  // 清空授权
        let res=yield call(clearFacility2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAuthList({ payload, callback }, { call, put }) {  // 授权记录列表
        let res=yield call(getAuthList2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAllDevice({ payload, callback }, { call, put }) {  // 所有设备
        let res=yield call(getAllDevice2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * copyAuth({ payload, callback }, { call, put }) {  // 复制授权
        let res=yield call(copyAuth2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * unauthPerson({ payload, callback }, { call, put }) {  // 未授权人员列表
        let res=yield call(unauthPerson2, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * submitAuth({ payload, callback }, { call, put }) {  // 提交授权人员
        let res=yield call(submitAuth2, payload)
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