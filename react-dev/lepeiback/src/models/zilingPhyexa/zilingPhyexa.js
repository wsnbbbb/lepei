/**
 * 意外事件管理-models
 */
 import  {getAllClass,getAllPubStudents,commonPersonList,getGradeName,getClassName,getBodyExaminationByPage,getBodyExaminationConfigData,setBodyExaminationConfigData,getBodyExaminationPerson,getBodyExaminationSurvey,getBodyExaminationDetail,updateBodyExaminationDetail,deleteBodyExaminationDetail}  from 'services/index';
 export default {

   namespace: 'zilingPhyexa',

   state: {

   },

   subscriptions: {
     setup({ dispatch, history }) {  // eslint-disable-line
     },
   },

   effects: {
    * getAllClass({ payload, callback }, { call, put }) {
      let res = yield call(getAllClass, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getGradeName({ payload, callback }, { call, put }) {
      let res=yield call(getGradeName, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getClassName({ payload, callback }, { call, put }) {
      let res=yield call(getClassName, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getAllPubStudents({ payload, callback }, { call, put }) {
      let res = yield call(getAllPubStudents, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

    * getAllPersons({ payload, callback }, { call, put }) {
      let res = yield call(commonPersonList, Object.assign({status:"1"},payload))
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },


    * getBodyExaminationByPage({ payload, callback }, { call, put }) {
      let res = yield call(getBodyExaminationByPage,payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getBodyExaminationConfigData({ payload, callback }, { call, put }) {
      let res = yield call(getBodyExaminationConfigData,payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

    * setBodyExaminationConfigData({ payload, callback }, { call, put }) {
      let res = yield call(setBodyExaminationConfigData,payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

    * getBodyExaminationPerson({ payload, callback }, { call, put }) {
      let res = yield call(getBodyExaminationPerson,payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getBodyExaminationSurvey({ payload, callback }, { call, put }) {
      let res = yield call(getBodyExaminationSurvey,payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getBodyExaminationDetail({ payload, callback }, { call, put }) {
      let res = yield call(getBodyExaminationDetail,payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * deleteBodyExaminationDetail({ payload, callback }, { call, put }) {
      let res = yield call(deleteBodyExaminationDetail,payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * updateBodyExaminationDetail({ payload, callback }, { call, put }) {
      let res = yield call(updateBodyExaminationDetail,payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },


   },
   reducers: {
     save(state, action) {
       return { ...state, ...action.payload };
     },
   }
 }
