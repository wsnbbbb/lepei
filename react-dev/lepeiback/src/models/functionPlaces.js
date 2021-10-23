
import  { getFunctionPlaces, getFunctionRelateEntry, setFunctionRelateEntry, getApprovalRules, getPubApprovalRules,
  addFunctionPlaces, getFunctionPlaceDetail, updateFunctionPlaceDetail, deleteFunctionPlace,
  getFunctionPlacesApplyList, deleteFunctionPlacesApplyItem, getFunctionPlacesApplyDetail,
  getPlaceStatistics, getApplicantStatistics
 }  from 'services/index';
export default {

    namespace: 'functionPlaces',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getFunctionPlaces({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getFunctionPlaces,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
      * getFunctionRelateEntry({ payload,callback }, { call, put }) {  
        let res=yield call(getFunctionRelateEntry,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * setFunctionRelateEntry({ payload,callback }, { call, put }) {
        let res=yield call(setFunctionRelateEntry,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getApprovalRules({ payload,callback }, { call, put }) {
        let res=yield call(getApprovalRules, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getPubApprovalRules({ payload,callback }, { call, put }) {
        let res=yield call(getPubApprovalRules, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * addFunctionPlaces({ payload,callback }, { call, put }) {
        let res=yield call(addFunctionPlaces, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getFunctionPlaceDetail({ payload,callback }, { call, put }) {
        let res=yield call(getFunctionPlaceDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * updateFunctionPlaceDetail({ payload,callback }, { call, put }) {
        let res=yield call(updateFunctionPlaceDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deleteFunctionPlace({ payload,callback }, { call, put }) {
        let res=yield call(deleteFunctionPlace, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getFunctionPlacesApplyList({ payload,callback }, { call, put }) {
        let res=yield call(getFunctionPlacesApplyList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deleteFunctionPlacesApplyItem({ payload,callback }, { call, put }) {
        let res=yield call(deleteFunctionPlacesApplyItem, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getFunctionPlacesApplyDetail({ payload,callback }, { call, put }) {
        let res=yield call(getFunctionPlacesApplyDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getPlaceStatistics({ payload,callback }, { call, put }) {
        let res=yield call(getPlaceStatistics, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      
      * getApplicantStatistics({ payload,callback }, { call, put }) {
        let res=yield call(getApplicantStatistics, payload)
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
  