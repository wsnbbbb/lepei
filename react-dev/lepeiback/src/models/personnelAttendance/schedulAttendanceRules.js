/**
 * 排班制考勤规则-models
 */
import  {getAttendanceScheduleList,setAttendanceScheduleRule,getAttendanceScheduleRule,importScheduleRule,deleteScheduleRuleByPerson,setScheduleRuleByPerson}  from 'services/index';
export default {

  namespace: 'scheduleRule',

  state: {

  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    * getAttendanceScheduleList({ payload, callback }, { call, put }) {
      let res = yield call(getAttendanceScheduleList, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getAttendanceScheduleRule({ payload, callback }, { call, put }) {
      let res = yield call(getAttendanceScheduleRule, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

    * setAttendanceScheduleRule({ payload, callback }, { call, put }) {
      let res = yield call(setAttendanceScheduleRule, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

    * deleteScheduleRuleByPerson({ payload, callback }, { call, put }) {
      let res = yield call(deleteScheduleRuleByPerson, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

    * importScheduleRule({ payload, callback }, { call, put }) {
      let res = yield call(importScheduleRule, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * setScheduleRuleByPerson({ payload, callback }, { call, put }) {
      let res = yield call(setScheduleRuleByPerson, payload)
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
