/**
 * 人员考勤统计-models
 */
import  {getGradeName,getClassName,getAttendanceAllClass,getStudentMonthlyByPage,departmentTree,getTeachingMonthlyByPage}  from 'services/index';
export default {

  namespace: 'personAttenStatistics',

  state: {

  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    * getAttendanceAllClass({ payload, callback }, { call, put }) {
      let res = yield call(getAttendanceAllClass, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getGradeName({ payload, callback }, { call, put }) {
      let res=yield call(getGradeName, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getClassName({ payload, callback }, { call, put }) {
      let res=yield call(getClassName, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getStudentMonthlyByPage({ payload, callback }, { call, put }) {
      let res=yield call(getStudentMonthlyByPage, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getDepartmentTree({ payload, callback }, { call, put }) {
      let res=yield call(departmentTree, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getTeachingMonthlyByPage({ payload, callback }, { call, put }) {
      let res=yield call(getTeachingMonthlyByPage, payload)
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
