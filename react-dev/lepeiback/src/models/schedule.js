
import  {getClassTree, termList, getSchedules, saveSchedules, getStudent, getSemesters, 
  queryStudentSchedule, queryTeacherSchedule, getClassRoom, queryClassSchedule, uploadSchedules, getScheduleConfig, setScheduleConfig, getScheduleDetail
, getweeksBySemester, getAllSubject, commonPersonList, updateWeekSchedule, getAllSemesters, getAllRooms,scheduleSync, scheduleSync1,updateSchedules}  from 'services/index';
export default {

    namespace: 'schedule',
  
    state: {
      
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getClassTree({ payload, callback }, { call, put }) {  
        let res=yield call(getClassTree, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * termList({ payload, callback }, { call, put }) {  
        let res=yield call(termList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
    
      * getSchedules({ payload, callback }, { call, put }) {  
        let res=yield call(getSchedules, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getSubject({ payload, callback }, { call, put }) {  
        let res=yield call(getAllSubject, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSubject',payload:res.data });
        }
      },

      * getTeacher({ payload, callback }, { call, put }) {  
        let res=yield call(commonPersonList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTeacher',payload:res.data });
        }
      },

      * saveSchedules({ payload, callback }, { call, put }) {  
        let res=yield call(saveSchedules, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getStudent({ payload, callback }, { call, put }) {  
        let res=yield call(getStudent, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveStudent',payload:res.data.dataList });
        }
      },
      
      * getSemesters({ payload, callback }, { call, put }) {  
        let res=yield call(getSemesters, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSemesters',payload:res.data.dataList });
        }
      },

      * getScheduleDetail({ payload, callback }, { call, put }) {  
        let res=yield call(getScheduleDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * queryStudentSchedule({ payload, callback }, { call, put }) {  
        let res=yield call(queryStudentSchedule, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveQuery',payload:res.data });
        }
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * queryTeacherSchedule({ payload, callback }, { call, put }) {  
        let res=yield call(queryTeacherSchedule, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveQuery',payload:res.data });
        }
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * queryClassSchedule({ payload, callback }, { call, put }) {  
        let res=yield call(queryClassSchedule, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveQuery',payload:res.data });
        }
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getClassRoom({ payload, callback }, { call, put }) {  
        let res=yield call(getClassRoom, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassRoom',payload:res.data });
        }
      },

      * uploadSchedules({ payload, callback }, { call, put }) {  
        let res=yield call(uploadSchedules, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getScheduleConfig({ payload, callback }, { call, put }) {  
        let res=yield call(getScheduleConfig, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * setScheduleConfig({ payload, callback }, { call, put }) {  
        let res=yield call(setScheduleConfig, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getweeksBySemester({ payload, callback }, { call, put }) {  
        let res=yield call(getweeksBySemester, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * updateWeekSchedule({ payload, callback }, { call, put }) {  
        let res=yield call(updateWeekSchedule, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * commonPersonList({ payload, callback }, { call, put }) {  
        let res=yield call(commonPersonList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getAllSemesters({ payload, callback }, { call, put }) {  
        let res=yield call(getAllSemesters, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getAllRooms({ payload, callback }, { call, put }) {  
        let res=yield call(getAllRooms, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * scheduleSync({ payload, callback }, { call, put }) {  
        let res=yield call(scheduleSync, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * scheduleSync1({ payload, callback }, { call, put }) {  
        let res=yield call(scheduleSync1, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateSchedules({ payload, callback }, { call, put }) {   // 课表更新
        let res=yield call(updateSchedules, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, dataList: action.payload };
      },
      saveSubject(state, action) {
        return { ...state, subject: [...action.payload] };
      },
      saveTeacher(state, action) {
        return { ...state, teacher: [...action.payload] };
      },
      saveStudent(state, action) {
        return { ...state, student: [...action.payload] };
      },
      saveSemesters(state, action) {
        return { ...state, semesters: [...action.payload] };
      },
      saveQuery(state, action) {
        return { ...state, query: [...action.payload] };
      },
      saveClassRoom(state, action) {
        return { ...state, classRooms: [...action.payload] };
      },
      clearQuery(state, action) {
        return { ...state, query: [] };
      },
      
    },
  
  };
  