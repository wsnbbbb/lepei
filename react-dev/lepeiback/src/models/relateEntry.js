
import  {setRelateEntry, getRelateEntry, getDevicesList}  from 'services/index';
export default {

    namespace: 'relateEntry',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getRelateEntry({ payload , callback}, { call, put }) {
        let res=yield call(getRelateEntry,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * setRelateEntry({ payload, callback }, { call, put }) {
        let res=yield call(setRelateEntry,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },

      * getDevicesList({ payload, callback }, { call, put }) {
        let res=yield call(getDevicesList,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },


      
     
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
    
    },
  
  };
  