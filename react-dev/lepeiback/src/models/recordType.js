
import  { getRecordTypeList, saveRecordTypes  }  from 'services/index';
export default {

    namespace: 'recordType',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getRecordTypeList({ payload,callback }, { call, put }) {  // 类型列表
        let res=yield call(getRecordTypeList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * saveRecordTypes({ payload,callback }, { call, put }) {  // 保存类型
        let res=yield call(saveRecordTypes,payload)
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
  