
import  { outsideApplyList, delOutsideApply, getPubApprovalRules, addOutsideApply, editOutsideApply, outsideTypeList, outsideApplyRecord, getOutsideApplyDetail, outsideApplyDetail}  from 'services/index';
export default {
   namespace: 'outsideApply',
 
   state: {
       
   },
 
   subscriptions: {
     setup({ dispatch, history }) {  // eslint-disable-line
     },
   },
   effects: {
     * outsideApplyList({ payload,callback }, { call, put }) {  // 获取校外申请类型列表
       let res = yield call(outsideApplyList,payload)
       if(callback && typeof callback === 'function'){ 
         callback(res)
       }
     },
     * delOutsideApply({ payload,callback }, { call, put }) {  // 类型管理-删除
       let res = yield call(delOutsideApply,payload)
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
     * addOutsideApply({ payload,callback }, { call, put }) { // 类型管理-添加
       let res = yield call(addOutsideApply, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * getOutsideApplyDetail({ payload,callback }, { call, put }) { // 获取详情
       let res = yield call(getOutsideApplyDetail, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * editOutsideApply({ payload,callback }, { call, put }) { // 类型管理-编辑
       let res = yield call(editOutsideApply, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * outsideTypeList({ payload,callback }, { call, put }) { // 校外申请记录-获取类型列表
       let res = yield call(outsideTypeList, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * outsideApplyRecord({ payload,callback }, { call, put }) { // 校外申请记录列表
       let res = yield call(outsideApplyRecord, payload)
       if(callback && typeof callback === 'function'){
         callback(res)
       }
     },
     * outsideApplyDetail({ payload,callback }, { call, put }) { // 校外申请记录详情
       let res = yield call(outsideApplyDetail, payload)
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
 