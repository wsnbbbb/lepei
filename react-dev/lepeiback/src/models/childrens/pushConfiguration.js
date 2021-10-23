/**
 * 推送配置-models
 */
 import  {getAllClass,getChildActivityCront,getChildActivityCrontDetail,addChildActivityCront,modChildActivityCront,deleteChildActivityCront}  from 'services/index';
 export default {

   namespace: 'pushConfiguration',

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
     * getChildActivityCront({ payload, callback }, { call, put }) {
       let res = yield call(getChildActivityCront, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * getChildActivityCrontDetail({ payload, callback }, { call, put }) {
       let res = yield call(getChildActivityCrontDetail, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * addChildActivityCront({ payload, callback }, { call, put }) {
       let res = yield call(addChildActivityCront, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * modChildActivityCront({ payload, callback }, { call, put }) {
       let res = yield call(modChildActivityCront, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * deleteChildActivityCront({ payload, callback }, { call, put }) {
       let res = yield call(deleteChildActivityCront, payload)
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
