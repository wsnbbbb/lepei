/**
 * 意外事件管理-models
 */
 import  {getAllClass,getAllAccidentTypes,getAccidentListByPage,getAccidentDetail,addAccidentRecord,modAccidentRecord,deleteAccidentRecord,getAllPubStudents,commonPersonList,getGradeName,getClassName}  from 'services/index';
 export default {

   namespace: 'accidentManagement',

   state: {

   },

   subscriptions: {
     setup({ dispatch, history }) {  // eslint-disable-line
     },
   },

   effects: {
    * getAllAccidentTypes({ payload, callback }, { call, put }) {
      let res = yield call(getAllAccidentTypes, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
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
    * getAccidentListByPage({ payload, callback }, { call, put }) {
      let res = yield call(getAccidentListByPage, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getAccidentDetail({ payload, callback }, { call, put }) {
      let res = yield call(getAccidentDetail, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * addAccidentRecord({ payload, callback }, { call, put }) {
      let res = yield call(addAccidentRecord, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * modAccidentRecord({ payload, callback }, { call, put }) {
      let res = yield call(modAccidentRecord, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * deleteAccidentRecord({ payload, callback }, { call, put }) {
      let res = yield call(deleteAccidentRecord, payload)
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

   },
   reducers: {
     save(state, action) {
       return { ...state, ...action.payload };
     },
   }
 }
