
import  { unfiledList, getAllClass, batchFileByGroup, fileOne, getFiledPersonGroup, filedList, showFiledReason, unfileOne, getFiledGroup, unfileGroup}  from 'services/index';
export default {

    namespace: 'filePersons',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * unfiledList({ payload,callback }, { call, put }) {
        let res=yield call(unfiledList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getAllClass({ payload, callback }, { call, put }) {
        let res=yield call(getAllClass, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * batchFileByGroup({ payload, callback }, { call, put }) {
        let res=yield call(batchFileByGroup, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * fileOne({ payload, callback }, { call, put }) {
        let res=yield call(fileOne, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getFiledPersonGroup({ payload, callback }, { call, put }) {
        let res=yield call(getFiledPersonGroup, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * filedList({ payload, callback }, { call, put }) {
        let res=yield call(filedList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * showFiledReason({ payload, callback }, { call, put }) {
        let res=yield call(showFiledReason, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * unfileOne({ payload, callback }, { call, put }) {
        let res=yield call(unfileOne, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getFiledGroup({ payload, callback }, { call, put }) {
        let res=yield call(getFiledGroup, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * unfileGroup({ payload, callback }, { call, put }) {
        let res=yield call(unfileGroup, payload)
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
  