
import  { personHonorRecords, getHonorTypes, saveHonorLevel, levelTypList, getApprovalRules, getPersonHonorHandler, savePersonHonorHandler,
  personHonorRecordsDetail, deletePersonHonorRecords, personStatistics}  from 'services/index';
export default {

    namespace: 'honor',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {

      * personHonorRecords({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(personHonorRecords, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getHonorTypes({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(getHonorTypes, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
      * saveHonorLevel({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(saveHonorLevel, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * levelTypList({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(levelTypList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getApprovalRules({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(getApprovalRules, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getPersonHonorHandler({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(getPersonHonorHandler, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * savePersonHonorHandler({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(savePersonHonorHandler, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * personHonorRecordsDetail({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(personHonorRecordsDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deletePersonHonorRecords({ payload, callback }, { call, put }) {  // 删除
        let res=yield call(deletePersonHonorRecords, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * personStatistics({ payload, callback }, { call, put }) {  // 删除
        let res=yield call(personStatistics, payload)
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
  