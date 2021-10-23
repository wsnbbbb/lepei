/**
 * 意外事件类型-models
 */
 import  {getAllClass,getAccidentTypesByPage,getAccidentTypesDetail,addAccidentTypes,modAccidentTypes,deleteAccidentTypes,getAllAccidentTypes}  from 'services/index';
 export default {

   namespace: 'accidentsTypes',

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
     * getAccidentTypesByPage({ payload, callback }, { call, put }) {
       let res = yield call(getAccidentTypesByPage, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * getAccidentTypesDetail({ payload, callback }, { call, put }) {
       let res = yield call(getAccidentTypesDetail, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * addAccidentTypes({ payload, callback }, { call, put }) {
       let res = yield call(addAccidentTypes, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * modAccidentTypes({ payload, callback }, { call, put }) {
       let res = yield call(modAccidentTypes, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * deleteAccidentTypes({ payload, callback }, { call, put }) {
       let res = yield call(deleteAccidentTypes, payload)
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
