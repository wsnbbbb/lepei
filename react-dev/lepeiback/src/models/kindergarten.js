
import  {getDirector, saveDirector}  from 'services/index';
export default {

    namespace: 'kindergarten',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getDirector({ payload, callback }, { call, put }) {  // 获取列表
        let res=yield call(getDirector,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * saveDirector({ payload, callback }, { call, put }) {
        let res=yield call(saveDirector,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
     
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveDetail(state, action) {
        return { ...state, jobDetail:{...action.payload} };
      }
    },
  
  };
  