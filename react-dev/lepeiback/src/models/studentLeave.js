
import  {commonGradeList, getClassesByGradeId, studenLeaveType, studentLeaveList, deleteLeaveRecord, leaveRecordDetail,
  studentLeaveType, addStudentLeaveType, deleteStudentLeaveType, editStudentLeaveType, getHandlers, getTeachersAndWorks,
  setHandlers, recordsStatistics, recordsTypeStatistics
}  from 'services/index';
export default {

    namespace: 'studentLeave',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * commonGradeList({ payload,callback }, { call, put }) {  // 获取所有年级
        let res=yield call(commonGradeList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveCommonGradeList',payload:res.data });
        }
      },
      * getClassesByGradeId({ payload, callback }, { call, put }) {
        let res=yield call(getClassesByGradeId, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClasses',payload: res.data });
        }
      },
      * commonGradeList1({ payload,callback }, { call, put }) {  // 获取所有年级
        let res=yield call(commonGradeList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveCommonGradeList1',payload:res.data });
        }
      },
      * getClassesByGradeId1({ payload, callback }, { call, put }) {
        let res=yield call(getClassesByGradeId, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClasses1',payload: res.data });
        }
      },

      * studenLeaveType({ payload, callback }, { call, put }) {
        let res=yield call(studenLeaveType, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveLeaveType',payload: res.data.dataList });
        }
      },
      
      * studentLeaveList({ payload, callback }, { call, put }) {
        let res=yield call(studentLeaveList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deleteLeaveRecord({ payload, callback }, { call, put }) {
        let res=yield call(deleteLeaveRecord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * leaveRecordDetail({ payload, callback }, { call, put }) {
        let res=yield call(leaveRecordDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * studentLeaveType({ payload, callback }, { call, put }) {
        let res=yield call(studentLeaveType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addLeaveType({ payload, callback }, { call, put }) {
        let res=yield call(addStudentLeaveType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * deleteStudentLeaveType({ payload, callback }, { call, put }) {
        let res=yield call(deleteStudentLeaveType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editStudentLeaveType({ payload, callback }, { call, put }) {
        let res=yield call(editStudentLeaveType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getHandlers({ payload, callback }, { call, put }) {
        let res=yield call(getHandlers, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getTeachersAndWorks({ payload, callback }, { call, put }) {
        let res=yield call(getTeachersAndWorks, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * setHandlers({ payload, callback }, { call, put }) {
        let res=yield call(setHandlers, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * recordsStatistics({ payload, callback }, { call, put }) {
        let res=yield call(recordsStatistics, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * recordsTypeStatistics({ payload, callback }, { call, put }) {
        let res=yield call(recordsTypeStatistics, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveCommonGradeList(state, action) {
        return{...state, gradesData: [...action.payload]}
      },
      saveClasses(state, action) {
        return { ...state, classesList: [...action.payload] };
      },
      saveCommonGradeList1(state, action) {
        return{...state, gradesData1: [...action.payload]}
      },
      saveClasses1(state, action) {
        return { ...state, classesList1: [...action.payload] };
      },
      saveLeaveType(state, action) {
        return { ...state, leaveTypeList: [...action.payload] };
      },
      saveLeaveList(state, action) {
        return { ...state, leaveList: [...action.payload] };
      },

    },
  
  };
  