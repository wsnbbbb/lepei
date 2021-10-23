
import  { temperatureQuery, }  from 'services/index';
export default {

    namespace: 'temperatureCheck',
  
    state: { 
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * temperatureQuery({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(temperatureQuery,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
    
    },
  
    reducers: {

    }
  
  };
  