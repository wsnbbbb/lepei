import  {getAccount, addAccount, templateList, essentialList, deleteTemplate, getAllTemplate, 
getAllSemesters, commonGradeList, createTemplate, deletePoint, pointDetail, getPointTeacher, getPointTeacher1,
updatePoint, templateDetail, getQuotas, addQuotas, deleteQuotas, deletePoint1, getPointByQuota,
editQuota, addPoint, termList, allGrades, classList, classScoreDetail, classPointDetail, classPointRank,
personScore, studentTemplateDetail, editTemplate, personScoredetail, personRecordDetail, 
personPieData, studentPointRank, groupList, groupRecordDetail, groupPointRank}  from 'services/index';
export default {

    namespace: 'evaluation',  
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getAccount({ payload,callback }, { call, put }) {  // 获取所有账户信息
        let res=yield call(getAccount,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveAccount',payload:res.data });
        }
      },
      * addAccount({ payload,callback }, { call, put }) {  // 添加账户信息
        let res=yield call(addAccount,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * templateList({ payload,callback }, { call, put }) {  // 获取评价模板
        let res=yield call(templateList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTemplate',payload:res.data });
        }
      },
      * essentialList({ payload,callback }, { call, put }) {  // 获取评价模板
        let res=yield call(essentialList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveEssential',payload:res.data });
        }
      },
      * deleteTemplate({ payload,callback }, { call, put }) {  // 删除评价模板
        let res=yield call(deleteTemplate,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAllTemplate({ payload,callback }, { call, put }) {  // 删除评价模板
        let res=yield call(getAllTemplate,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveAllTemplate',payload:res.data });
        }
      },
      * getAllSemesters({ payload,callback }, { call, put }) {  // 删除评价模板
        let res=yield call(getAllSemesters,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveAllSemesters',payload:res.data });
        }
      },
      * commonGradeList({ payload,callback }, { call, put }) {  // 获取所有年级
        let res=yield call(commonGradeList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * createTemplate({ payload, callback }, { call, put }) {  
        let res=yield call(createTemplate, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * deletePoint({ payload, callback }, { call, put }) {  
        let res=yield call(deletePoint, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * pointDetail({ payload, callback }, { call, put }) {  
        let res=yield call(pointDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getPointTeacher({ payload, callback }, { call, put }) {  
        let res=yield call(getPointTeacher, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getPointTeacher1({ payload, callback }, { call, put }) {  
        let res=yield call(getPointTeacher1, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'savePointTeacher',payload:res.data });
        }
      },
      * updatePoint({ payload, callback }, { call, put }) {  
        let res=yield call(updatePoint, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addPoint({ payload, callback }, { call, put }) {  
        let res=yield call(addPoint, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * templateDetail({ payload, callback }, { call, put }) {  
        let res=yield call(templateDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getQuotas({ payload, callback }, { call, put }) {  
        let res=yield call(getQuotas, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addQuotas({ payload, callback }, { call, put }) {  
        let res=yield call(addQuotas, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * deleteQuotas({ payload, callback }, { call, put }) {  
        let res=yield call(deleteQuotas, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * deletePoint1({ payload, callback }, { call, put }) {  
        let res=yield call(deletePoint1, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getPointByQuota({ payload, callback }, { call, put }) {  
        let res=yield call(getPointByQuota, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'savePoint',payload:res.data });
        }
      },
      * editQuota({ payload, callback }, { call, put }) {  
        let res=yield call(editQuota, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * termList({ payload, callback }, { call, put }) {  
        let res=yield call(termList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTerm', payload:res.data.dataList });
        }
      },
      * allGrades({ payload, callback }, { call, put }) {  
        let res=yield call(allGrades, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveGrades', payload:res.data.dataList });
        }
      },
      * getClassList({ payload }, { call, put }) {
        let res=yield call(classList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClass', payload:res.data.dataList});
        }
      },
      * termList1({ payload, callback }, { call, put }) {  
        let res=yield call(termList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTerm1', payload:res.data.dataList });
        }
      },
      * allGrades1({ payload, callback }, { call, put }) {  
        let res=yield call(allGrades, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveGrades1', payload:res.data.dataList });
        }
      },
      * getClassList1({ payload }, { call, put }) {
        let res=yield call(classList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClass1', payload:res.data.dataList});
        }
      },
      
      * classScoreDetail({ payload, callback }, { call, put }) {
        let res=yield call(classScoreDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * classPointDetail({ payload, callback }, { call, put }) {
        let res=yield call(classPointDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * classPointRank({ payload, callback }, { call, put }) {
        let res=yield call(classPointRank,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * personScore({ payload, callback }, { call, put }) {
        let res=yield call(personScore,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * studentTemplateDetail({ payload, callback }, { call, put }) {
        let res=yield call(studentTemplateDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * editTemplate({ payload, callback }, { call, put }) {
        let res=yield call(editTemplate,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * personScoredetail({ payload, callback }, { call, put }) {
        let res=yield call(personScoredetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * personRecordDetail({ payload, callback }, { call, put }) {
        let res=yield call(personRecordDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * personPieData({ payload, callback }, { call, put }) {
        let res=yield call(personPieData,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * studentPointRank({ payload, callback }, { call, put }) {
        let res=yield call(studentPointRank,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * groupList({ payload, callback }, { call, put }) {
        let res=yield call(groupList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * groupRecordDetail({ payload, callback }, { call, put }) {
        let res=yield call(groupRecordDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * groupPointRank({ payload, callback }, { call, put }) {
        let res=yield call(groupPointRank,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      
      
    },
  
    reducers: {
      saveAccount(state, action) {
        return{...state, accountData:{...action.payload}}
      },
      saveTemplate(state, action) {
        return{...state, templateData:{...action.payload}}
      },
      saveEssential(state, action) {
        return{...state, essentialData:{...action.payload}}
      },
      saveAllTemplate(state, action) {
        return{...state, allTemplateData: [...action.payload]}
      },
      saveAllSemesters(state, action) {
        return{...state, semestersData: [...action.payload]}
      },
      saveGrade(state, action) {
        return{...state, gradesData: [...action.payload]}
      },
      savePointTeacher(state, action) {
        return{...state, pointTeacherData: [...action.payload]}
      },
      saveQuotas(state, action) {
        return{...state, quotasData: [...action.payload]}
      },
      savePoint(state, action) {
        return{...state, pointData: [...action.payload]}
      },
      saveTerm(state, action) {
        return{...state, termList: [...action.payload]}
      },
      saveGrades(state, action) {
        return{...state, gradeData:[...action.payload]}
      },
      saveClass(state, action) {
        return { ...state, classData: [...action.payload]};
      },
      saveTerm1(state, action) {
        return{...state, termList1: [...action.payload]}
      },
      saveGrades1(state, action) {
        return{...state, gradeData1:[...action.payload]}
      },
      saveClass1(state, action) {
        return { ...state, classData1: [...action.payload]};
      },
      // saveGradeName(state,action){
      //   return{...state,gradeData:[...action.payload]}
      // }
    },
  
  };
  