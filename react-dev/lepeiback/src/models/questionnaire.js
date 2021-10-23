
import  { deleteDevice, getCardInfo, setTimeSections, getQuestionnaireList, createQuestionnaire, 
  deleteQuestionnaire, getQuestionnaireDetail, updateQuestionnaire}  from 'services/index';
export default {

    namespace: 'questionnaire',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getQuestionnaireList({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getQuestionnaireList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * createQuestionnaire({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(createQuestionnaire,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deleteQuestionnaire({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(deleteQuestionnaire,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getQuestionnaireDetail({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getQuestionnaireDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * updateQuestionnaire({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(updateQuestionnaire,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      
      
      
      * deleteDevice({ payload,callback }, { call, put }) {  
        let res=yield call(deleteDevice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getCardInfo({ payload,callback }, { call, put }) {
        let res=yield call(getCardInfo,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * setTimeSections({ payload,callback }, { call, put }) {
        let res=yield call(setTimeSections,payload)
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
  