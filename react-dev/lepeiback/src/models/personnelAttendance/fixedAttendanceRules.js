/**
 * 固定班制考勤规则-models
 */
import  {getAttendanceFixRuleList,getFixRuleDetail,getAttendanceAllClass,addFixRule,updateFixRule,deleteFixRule,getDepartmentTree,commonPersonList,getAttendanceEarlyWarning,setAttendanceEarlyWarning}  from 'services/index';
export default {

  namespace: 'fixAttendance',

  state: {

  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    * getFixRuleList({ payload, callback }, { call, put }) {
      let res = yield call(getAttendanceFixRuleList, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getFixRuleDetail({ payload, callback }, { call, put }) {
      let res = yield call(getFixRuleDetail, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

    * getAttendanceAllClass({ payload, callback }, { call, put }) {
      let res = yield call(getAttendanceAllClass, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * addFixRule({ payload, callback }, { call, put }) {
      let res = yield call(addFixRule, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * updateFixRule({ payload, callback }, { call, put }) {
      let res = yield call(updateFixRule, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * deleteFixRule({ payload, callback }, { call, put }) {
      let res = yield call(deleteFixRule, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getDepartmentTree({ payload, callback }, { call, put }) {
      let res = yield call(getDepartmentTree, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

    * getAttendanceAllPersons({ payload, callback }, { call, put }) {
      let res = yield call(commonPersonList, Object.assign({status:"1"},payload))
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getAttendanceEarlyWarning({ payload, callback }, { call, put }) {
      let res = yield call(getAttendanceEarlyWarning, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * setAttendanceEarlyWarning({ payload, callback }, { call, put }) {
      let res = yield call(setAttendanceEarlyWarning, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  }
}
