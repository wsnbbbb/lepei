
import  {getApplyLeave,delLeaveApply,leaveDetail,delLeaveType,getLeaveRule,delLeaveRule,getLeaveBarData,getLeavePieData,
  addLeaveType,updateLeaveType,addLeaveRule,getLeaveRuleDetail,updateLeaveRuleDetail,getLeaveTypeDetail
}  from 'services/index';
export default {

    namespace: 'leave',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getApplyLeave({ payload }, { call, put }) {  // 获取教职工请假列表
        let res=yield call(getApplyLeave,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * delLeaveApply({ payload,callback }, { call, put }) {  // 删除教职工请假申请
        let res=yield call(delLeaveApply,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * leaveDetail({ payload,callback }, { call, put }) {  // 获取教职工请假详情
        let res=yield call(leaveDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
        }
      },
      * delLeaveType({ payload,callback }, { call, put }) {  // 删除请假类型
        let res=yield call(delLeaveType,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addLeaveType({ payload,callback }, { call, put }) {  // 创建请假类型
        let res=yield call(addLeaveType,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getLeaveTypeDetail({ payload,callback }, { call, put }) {  // 获取请假类型详情
        let res=yield call(getLeaveTypeDetail,payload)
        console.log(res)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveLeaveTypeDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * updateLeaveType({ payload,callback }, { call, put }) {  // 更新请假类型
        let res=yield call(updateLeaveType,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getLeaveRule({ payload,callback }, { call, put }) {  // 获取审批规则列表
        let res=yield call(getLeaveRule,payload)
        console.log(res)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveLeaveRule',payload:res.data });
        }
      },
      * getLeaveRuleDetail({ payload,callback }, { call, put }) {  // 获取审批规则详情
        let res=yield call(getLeaveRuleDetail,payload)
        console.log(res)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveLeaveRuleDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * addLeaveRule({ payload,callback }, { call, put }) {  // 创建审批规则
        let res=yield call(addLeaveRule,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateLeaveRuleDetail({ payload,callback }, { call, put }) {  // 更新审批规则
        let res=yield call(updateLeaveRuleDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delLeaveRule({ payload,callback }, { call, put }) {  // 删除审批规则
        let res=yield call(delLeaveRule,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getLeaveBarData({ payload,callback }, { call, put }) {  //获取请假柱状图
        let res=yield call(getLeaveBarData,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getLeavePieData({ payload,callback }, { call, put }) {  //获取请假饼状图
        let res=yield call(getLeavePieData,payload)
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
        return { ...state, leaveDetails:{...action.payload} };
      },
      saveLeaveRule(state, action) {
        return { ...state, leaveRules:[...action.payload ]};
      },
      saveLeaveTypeDetail(state, action) {
        return { ...state, leaveTypeDetail:{...action.payload }};
      },
      saveLeaveRuleDetail(state, action) {
        return { ...state, leaveRuleDetail:{...action.payload }};
      },
    },
  
  };
  