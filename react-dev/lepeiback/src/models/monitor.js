
import  { getMonitorList, getMonitorDetail, getMonitorAuth, getUnAuthList, batchAddPerson, delAuthPerson, searchDev, createMonitor, updateMonitor, deleteMonitor}  from 'services/index';
export default {

    namespace: 'monitor',
  
    state: {

    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getMonitorList({ payload,callback }, { call, put }) {
        let res=yield call(getMonitorList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getMonitorDetail({ payload,callback }, { call, put }) {
        let res=yield call(getMonitorDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getMonitorAuth({ payload,callback }, { call, put }) {
        let res=yield call(getMonitorAuth, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getUnAuthList({ payload,callback }, { call, put }) {
        let res=yield call(getUnAuthList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * batchAddPerson({ payload,callback }, { call, put }) {
        let res=yield call(batchAddPerson, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * delAuthPerson({ payload,callback }, { call, put }) {
        let res=yield call(delAuthPerson, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * searchDev({ payload,callback }, { call, put }) {
        let res=yield call(searchDev, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * createMonitor({ payload,callback }, { call, put }) {
        let res=yield call(createMonitor, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * updateMonitor({ payload,callback }, { call, put }) {
        let res=yield call(updateMonitor, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deleteMonitor({ payload,callback }, { call, put }) {
        let res=yield call(deleteMonitor, payload)
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
  