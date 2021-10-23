
import  { getBabys, getTestReportList, delTestReport, getTestReportDetail }  from 'services/index';
export default {

    namespace: 'kindergartenManage',
  
    state: {
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getBabys({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getBabys,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getTestReportList({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getTestReportList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delTestReport({ payload,callback }, { call, put }) {  // 删除报告
        let res=yield call(delTestReport,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getTestReportDetail({ payload,callback }, { call, put }) {  // 报告详情列表
        let res=yield call(getTestReportDetail,payload)
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
  