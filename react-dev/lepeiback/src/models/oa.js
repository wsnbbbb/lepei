
import  {getOaTemplateList, getApprovalRules, createOaTemplate, getOaTemplateDetail, deleteOaTemplate, updateOaTemplate,
  copyOaTemplate, getOaRecordList, getOaRecordsDetail, endOaRecord, deleteOaRecord
  }  from 'services/index';
export default {

    namespace: 'oa',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getOaTemplateList({ payload,callback }, { call, put }) {
        let res=yield call(getOaTemplateList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getApprovalRules({ payload,callback }, { call, put }) {
        let res=yield call(getApprovalRules,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * createOaTemplate({ payload,callback }, { call, put }) {
        let res=yield call(createOaTemplate,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getOaTemplateDetail({ payload,callback }, { call, put }) {
        let res=yield call(getOaTemplateDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deleteOaTemplate({ payload,callback }, { call, put }) {
        let res=yield call(deleteOaTemplate,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * updateOaTemplate({ payload,callback }, { call, put }) {
        let res=yield call(updateOaTemplate,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * copyOaTemplate({ payload,callback }, { call, put }) {
        let res=yield call(copyOaTemplate,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getOaRecordList({ payload,callback }, { call, put }) {
        let res=yield call(getOaRecordList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getOaRecordsDetail({ payload,callback }, { call, put }) {
        let res=yield call(getOaRecordsDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * endOaRecord({ payload,callback }, { call, put }) {
        let res=yield call(endOaRecord,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
            
      * deleteOaRecord({ payload,callback }, { call, put }) {
        let res=yield call(deleteOaRecord,payload)
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
        return { ...state, canteenMenuDetail:{...action.payload }};
      }
    },
  
  };
  