
import  { getModules, saveNav, screenTypelist, getNavDetail}  from 'services/index';
export default {

    namespace: 'bigScreen',
  
    state: {

    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getModules({ payload,callback }, { call, put }) {
        let res=yield call(getModules, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * saveNav({ payload,callback }, { call, put }) {
        let res=yield call(saveNav, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * screenTypelist({ payload,callback }, { call, put }) {
        let res=yield call(screenTypelist, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getNavDetail({ payload,callback }, { call, put }) {
        let res=yield call(getNavDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      
      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
    
    },
  
  };
  