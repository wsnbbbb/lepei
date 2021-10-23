/**
 * 流水记录-models
 */
import  {getAttendanceRecordByPage}  from 'services/index';
export default {

  namespace: 'attendanceRecord',

  state: {

  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    * getAttendanceRecordByPage({ payload, callback }, { call, put }) {
      let res=yield call(getAttendanceRecordByPage, payload)
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
