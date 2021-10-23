
import  { syncRecords, syncData, }  from 'services/index';
export default {

    namespace: 'syncRecords',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * syncRecords({ payload,callback }, { call, put }) {
        let res=yield call(syncRecords,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * syncData({ payload,callback }, { call, put }) {
        let res=yield call(syncData,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

    },
  
    reducers: {
     
     
    },
  
  };
  