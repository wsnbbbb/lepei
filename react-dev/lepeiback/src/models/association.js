
import  {associationClassList, associationCourseList, getAllSemesters, getAllRooms, getTeacherStaffs, getAllClass,commonPersonList,
    termDetail, getAllBuildings, placeList, getAllgrade, getClasses, creatCourse, deleteCourse, getChosenCourseStudent, getAllSubject,
    getClassName, getChosenStudent, getPreStudent, preSetStudent, courseDetail, updateCourse, courseImport, getNotChosenCourseStudent,
    createSchedule,importStudent, getAllPlacesByBuild}  from 'services/index';
export default {

    namespace: 'association',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getAllClass({ payload, callback }, { call, put }) {
        let res=yield call(getAllClass, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAllSubject({ payload, callback }, { call, put }) {
        let res=yield call(getAllSubject, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * associationCourseList({ payload, callback }, { call, put }) {
        let res=yield call(associationCourseList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * associationClassList({ payload, callback }, { call, put }) {  //获取列表
        let res=yield call(associationClassList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * associationCourseList1({ payload, callback }, { call, put }) {
        let res=yield call(associationCourseList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAllSemesters({ payload, callback }, { call, put }) {
        let res=yield call(getAllSemesters, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSemesters',payload: res.data });
        }
      },
      * getAllClassRooms({ payload, callback }, { call, put }) {
        let res=yield call(getAllRooms, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassRooms',payload: res.data });
        }
      },
      
      * getTeacherStaffs({ payload, callback }, { call, put }) {
        let res=yield call(commonPersonList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTeacherStaff',payload: res.data });
        }
      },
      * termDetail({ payload, callback }, { call, put }) {
        let res=yield call(termDetail, payload)
        // if(res&&res.code&&res.code===200){
        //   yield put({ type: 'saveTermDetail', payload: res.data });
        // }
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * buildingList({ payload, callback }, { call, put }) {  
        let res=yield call(getAllBuildings, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveBuilding', payload: res.data });
        }
      },
      * placeList({ payload, callback }, { call, put }) {  
        let res=yield call(placeList, payload)
        // if(res&&res.code&&res.code===200){
        //   yield put({ type: 'saveRoom', payload: res.data });
        // }
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAllPlacesByBuild({ payload, callback }, { call, put }) {  
        let res=yield call(getAllPlacesByBuild, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * placeList1({ payload, callback }, { call, put }) {  
        let res=yield call(placeList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveRoom', payload: res.data });
        }
      },
      * getAllgrade({ payload, callback }, { call, put }) {  
        let res=yield call(getAllgrade, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveGrade',payload: res.data });
        }
      },
      * getAllgrade1({ payload, callback }, { call, put }) {  
        let res=yield call(getAllgrade, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveGrade1',payload: res.data });
        }
      },
      * getClasses({ payload, callback }, { call, put }) {  
        let res=yield call(getClasses, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClasses',payload: res.data.dataList });
        }
      },
      * creatCourse({ payload, callback }, { call, put }) {  
        let res=yield call(creatCourse, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * deleteCourse({ payload, callback }, { call, put }) {  
        let res=yield call(deleteCourse, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getChosenCourseStudent({ payload, callback }, { call, put }) {  
        let res=yield call(getChosenCourseStudent, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      // * getAllgrade({ payload, callback }, { call, put }) {  
      //   let res=yield call(getAllgrade, payload)
      //   if(callback && typeof callback === 'function'){
      //     callback(res)
      //   }
      // },
      * getClassName1({ payload, callback }, { call, put }) {  
        let res=yield call(getClassName, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClasses1',payload: res.data });
        }
      },
      * getClassName2({ payload, callback }, { call, put }) {  
        let res=yield call(getClassName, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClasses2',payload: res.data });
        }
      },
      
      * getChosenStudent({ payload, callback }, { call, put }) {  
        let res=yield call(getChosenStudent, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveChosenStudent',payload: res.data });
        }
      },
      * getPreStudent({ payload, callback }, { call, put }) {  
        let res=yield call(getPreStudent, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * preSetStudent({ payload, callback }, { call, put }) {  
        let res=yield call(preSetStudent, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * courseDetail({ payload, callback }, { call, put }) {  
        let res=yield call(courseDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateCourse({ payload, callback }, { call, put }) {  
        let res=yield call(updateCourse, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * courseImport({ payload, callback }, { call, put }) {  
        let res=yield call(courseImport, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getNotChosenCourseStudent({ payload, callback }, { call, put }) {  
        let res=yield call(getNotChosenCourseStudent, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * createSchedule({ payload, callback }, { call, put }) {  
        let res=yield call(createSchedule, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importStudent({ payload, callback }, { call, put }) {  //导入预设学生
        let res=yield call(importStudent, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      // getAllSubject
      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveList(state, action) {
        return { ...state, ...action.payload };
      },
      saveCourseList(state, action) {
        return { ...state, ...action.payload };
      },
      saveSemesters(state, action) {
        return { ...state, semestersList: [...action.payload] };
      },
      saveClassRooms(state, action) {
        return { ...state, classRoomList: [...action.payload] };
      },
      saveTeacherStaff(state, action) {
        return { ...state, teacherList: [...action.payload] };
      },
      saveTermDetail(state, action) {
        return{...state, scheduleTimes: [...action.payload.scheduleTimes]}
      },
      saveBuilding(state, action) {
        return{...state, buildingList: [...action.payload]}
      },
      saveRoom(state, action) {
        return{...state, placeList: [...action.payload]}
      },
      saveGrade(state, action) {
        return { ...state, gradeList: [...action.payload] };
      },
      saveClasses(state, action) {
        return { ...state, classList: [...action.payload] };
      },
      saveGrade1(state, action) {
        return { ...state, gradeList1: [...action.payload] };
      },
      saveClasses1(state, action) {
        return { ...state, classList1: [...action.payload] };
      },
      saveClasses2(state, action) {
        return { ...state, classList2: [...action.payload] };
      },
      saveChosenStudent(state, action) {
        return { ...state, chosenStudentData: {...action.payload} };
      },
    },
  
  };
  