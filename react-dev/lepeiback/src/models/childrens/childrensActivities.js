/**
 * 幼儿活动-models
 */
 import  {getAllClass,addChildActivityTemplate,modChildActivityTemplate,deleteChildActivityTemplate,getChildActivityTemplateDetail,getChildActivityTemplate,getChildActivityRecordByPage,getChildActivityRecordDetail,deleteChildActivityRecord,getGradeName,setChildActivityEnable}  from 'services/index';

 export default {

   namespace: 'childrensActivities',

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

    * addChildActivityTemplate({ payload, callback }, { call, put }) {
      let res = yield call(addChildActivityTemplate, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * modChildActivityTemplate({ payload, callback }, { call, put }) {
      let res = yield call(modChildActivityTemplate, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * deleteChildActivityTemplate({ payload, callback }, { call, put }) {
      let res = yield call(deleteChildActivityTemplate, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getChildActivityTemplateDetail({ payload, callback }, { call, put }) {
      let res = yield call(getChildActivityTemplateDetail, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getChildActivityTemplate({ payload, callback }, { call, put }) {
      let res = yield call(getChildActivityTemplate, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getChildActivityRecordByPage({ payload, callback }, { call, put }) {
      let res = yield call(getChildActivityRecordByPage, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getChildActivityRecordDetail({ payload, callback }, { call, put }) {
      let res = yield call(getChildActivityRecordDetail, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * deleteChildActivityRecord({ payload, callback }, { call, put }) {
      let res = yield call(deleteChildActivityRecord, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * setChildActivityEnable({ payload, callback }, { call, put }) {
      let res = yield call(setChildActivityEnable, payload)
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
