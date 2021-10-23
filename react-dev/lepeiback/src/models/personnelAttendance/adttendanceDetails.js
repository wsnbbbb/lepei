/**
 * 考勤明细-models
 */
import  {getAttendanceAllClass,getClassName,getGradeName,departmentTree,getClassDailyDetailByPage,getDepartmentDailyDetailByPage,getPersonalMonthDaily,updatePersonalMonthDaily}  from 'services/index';
export default {

  namespace: 'adttendanceDetails',

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

    * getClassDailyDetailByPage({ payload, callback }, { call, put }) {
      let res=yield call(getClassDailyDetailByPage, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getDepartmentDailyDetailByPage({ payload, callback }, { call, put }) {
      let res=yield call(getDepartmentDailyDetailByPage, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * getPersonalMonthDaily({ payload, callback }, { call, put }) {
      let res=yield call(getPersonalMonthDaily, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
    * updatePersonalMonthDaily({ payload, callback }, { call, put }) {
      let res=yield call(updatePersonalMonthDaily, payload)
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
