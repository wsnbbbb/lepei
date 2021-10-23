
import  { getStepInfoByClass, getUnReachPersons, getInfoByClass, getAbnormalPersons}  from 'services/index';
export default {

    namespace: 'lepayHealth',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getStepInfoByClass({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getStepInfoByClass, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getUnReachPersons({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getUnReachPersons, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getInfoByClass({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getInfoByClass, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getAbnormalPersons({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getAbnormalPersons, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
      
    },
  
    reducers: {
      
    },
  
  };
  