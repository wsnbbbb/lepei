/**
 * 部门考勤统计-models
 */
import  {getAttendanceAllClass,getClassName,getGradeName,departmentTree,getClassDailySurveyByPage,getDepartmentDailySurveyByPage,getGroupDailySurverByPage} from 'services/index';
export default {

  namespace: 'departmentAttenStatistics',

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
    * getDepartmentTree({ payload, callback }, { call, put }) {
      let res=yield call(departmentTree, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getClassDailySurveyByPage({ payload, callback }, { call, put }) {
      let res=yield call(getClassDailySurveyByPage, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getDepartmentDailySurveyByPage({ payload, callback }, { call, put }) {
      let res=yield call(getDepartmentDailySurveyByPage, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getGroupDailySurverByPage({ payload, callback }, { call, put }) {
      let res=yield call(getGroupDailySurverByPage, payload)
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
