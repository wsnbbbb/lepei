
import  { getSpecialCase, delSpecialCase, getPubApprovalRules, addSpecialCase, editSpecialCase, getTypeList, specialMasterRecord, getSpecialCaseDetail, getRecordsDetail}  from 'services/index';
export default {
    namespace: 'infantSpecialCase',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
      * getSpecialCase({ payload,callback }, { call, put }) {  // 获取特殊情况管理列表
        let res = yield call(getSpecialCase,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * delSpecialCase({ payload,callback }, { call, put }) {  // 特殊情况管理列表-删除
        let res = yield call(delSpecialCase,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getPubApprovalRules({ payload,callback }, { call, put }) { // 获取审批规则
        let res = yield call(getPubApprovalRules, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addSpecialCase({ payload,callback }, { call, put }) { // 特殊情况-添加
        let res = yield call(addSpecialCase, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getSpecialCaseDetail({ payload,callback }, { call, put }) { // 获取详情
        let res = yield call(getSpecialCaseDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editSpecialCase({ payload,callback }, { call, put }) { // 特殊情况-编辑
        let res = yield call(editSpecialCase, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getTypeList({ payload,callback }, { call, put }) { // 特殊情况记录-获取类型列表
        let res = yield call(getTypeList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * specialMasterRecord({ payload,callback }, { call, put }) { // 特殊情况记录列表
        let res = yield call(specialMasterRecord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getRecordsDetail({ payload,callback }, { call, put }) { // 特殊情况记录详情
        let res = yield call(getRecordsDetail, payload)
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
  