
import  {getLogin,getSchool,getCode,checkCode,gradeList,getGradeName,getInformation,getPicToken,
  getClassName,getTeachersAndWorks,getClassByGrade,jobList,personList,departmentList,hikVision,changhongSystem,readPaperSystem,
  commonJobList,commonPersonList,commonGradeList,classLeaderList,loginOut,getLeaveType,getAllSemesters,getPubStudents,getAllSubject,
  getApprovalRules,getAllSchool,weigen,getAllClassRooms,getAllSchoolUser,getAllBuildings,getAllPlacesByBuild,getCurrentSemesterSections,classBrand,
  jumpLogin,logOff, yuangaofen, vanlon,departmentTree, redirectSwyd,pubEntryDevicesList}  from 'services/index';
// import {message} from 'antd';
// import {routerRedux} from 'dva/router';
export default {

    namespace: 'user',

    state: {

    },

    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
        // console.log(history)
        // if(history.location.pathname!=='/login'){
        //   message.error('请登录账号',3)
        // }
      },
    },

    effects: {
      * hikVision({ payload,callback }, { call }) {  // 海康门禁
        let res=yield call(hikVision,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * changhongSystem({ payload,callback }, { call }) {  // 长虹系统
        let res=yield call(changhongSystem,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * readPaperSystem({ payload,callback }, { call }) {  // 阅卷系统
        let res=yield call(readPaperSystem,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * weigen({ payload,callback }, { call }) {  // 微耕门禁
        let res=yield call(weigen,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * classBrand({ payload,callback }, { call }) {  // 班牌系统
        let res=yield call(classBrand,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * yuangaofen({ payload,callback }, { call }) {  // 元高分
        let res=yield call(yuangaofen,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * vanlon({ payload,callback }, { call }) {  // 元高分
        let res=yield call(vanlon,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * jumpLogin({ payload,callback }, { call }) {  // 跳转登录
        let res=yield call(jumpLogin,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * redirectSwyd({ payload,callback }, { call }) {
          let res=yield call(redirectSwyd, payload)
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        },
      * login({ payload,callback }, { call,put }) {  // 登录
        let res=yield call(getLogin,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveLogin',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * loginOut({ payload,callback }, { call,put }) {  // 退出登录
        let res=yield call(loginOut,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * logOff({ payload,callback }, { call,put }) {  // 退出登录
        let res=yield call(logOff,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getPicToken({ payload,callback }, { call,put }) {  // 获取七牛token
        let res=yield call(getPicToken,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveToken',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getInformation({ payload,callback }, { call, put }) {  // 获取账号详情
        let res=yield call(getInformation,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveInformation',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getVerificationCode({ payload,callback }, { call }) {  // 获取验证码
        let res=yield call(getCode,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * checkCode({ payload,callback }, { call, put }) {  // 验证码校验
        let res=yield call(checkCode,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveCode',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getAllSchool({ payload }, { call, put }) {  // 获取所有学校
        let res=yield call(getAllSchool,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSchools',payload:res.data });
        }
      },
      * getSchoolDetail({ payload }, { call, put }) {  // 获取学校详情
        let res=yield call(getSchool,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * getGradeList({ payload }, { call, put }) {  // 获取年级列表
        let res=yield call(gradeList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveGrade',payload:res.data });
        }
      },
      * getAllGradeList({ payload, callback }, { call, put }) {  // 获取年级列表
        let res=yield call(getGradeName,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getGradeName({ payload,callback }, { call, put }) {  // 根据学业阶段获取年级名称
        let res=yield call(getGradeName,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveGradeName',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getClassName({ payload,callback }, { call, put }) {  // 获取指定年级下的班级
        let res=yield call(getClassName,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassName',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getTeachersAndWorks({ payload }, { call, put }) {  // 获取所有教职工信息
        let res=yield call(getTeachersAndWorks,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTeachersAndWorks',payload:res });
        }
      },
      * getClassByGrade({ payload,callback }, { call, put }) {  // 获取行政班所属班级（含年级及年级下对应的班级）
        let res=yield call(getClassByGrade,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassByGrade',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getJobList({ payload }, { call, put }) {  // 获取职务列表
        let res=yield call(jobList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveJobList',payload:res.data });
        }
      },
      * getPersonList({ payload,callback }, { call, put }) {  // 获取人员列表
        let res=yield call(personList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'savePersonList',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getDepartmentList({ payload,callback }, { call, put }) {  // 获取部门列表
        let res=yield call(departmentList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDepartmentList',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * departmentTree({ payload,callback }, { call, put }) {  // 获取部门树状结构
        let res=yield call(departmentTree,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDepartmentTree',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getCommonJobList({ payload }, { call, put }) {  // 获取公共职务列表
        let res=yield call(commonJobList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveCommonJobList',payload:res.data });
        }
      },
      * getCommonPersonList({ payload }, { call, put }) {  // 获取公共人员列表（type逗号分隔，可查询多种类型的人员）
        let res=yield call(commonPersonList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveCommonPersonList',payload:res.data });
        }
      },
      * getCommonGradeList({ payload,callback }, { call, put }) {  // 获取公共年级列表
        let res=yield call(commonGradeList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveCommonGradeList',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },



      * getAllSubject({ payload,callback }, { call, put }) {
        let res=yield call(getAllSubject,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getClassLeaderList({ payload,callback }, { call, put }) {  // 获取班干部
        let res=yield call(classLeaderList,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'saveClassLeader',payload:res.data });
        }
      },
      * getLeaveType({ payload,callback }, { call, put }) {  // 获取请假类型列表
        let res=yield call(getLeaveType,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'saveLeaveType',payload:res.data });
        }
      },
      * getAllSemesters({ payload,callback }, { call, put }) {  // 获取所有学期
        let res=yield call(getAllSemesters,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'saveAllTerms',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getPubStudents({ payload,callback }, { call, put }) {  // 获取所有学生姓名及学生所在班级
        let res=yield call(getPubStudents,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'savePubStudents',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getApprovalRules({ payload,callback }, { call, put }) {  // 获取所有审批规则
        let res=yield call(getApprovalRules,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'saveApprovalRules',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getAllClassRooms({ payload,callback }, { call, put }) {  // 获取所有教室
        let res=yield call(getAllClassRooms,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'saveAllClassRooms',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getAllSchoolUser({ payload,callback }, { call, put }) {  // 获取指定学校的后台账号
        let res=yield call(getAllSchoolUser,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'saveAllSchoolUsers',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getAllBuildings({ payload,callback }, { call, put }) {  // 获取建筑列表
        let res=yield call(getAllBuildings,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'saveBuildingList',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getAllPlacesByBuild({ payload,callback }, { call, put }) {  // 获取建筑下的场所
        let res=yield call(getAllPlacesByBuild,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'savePlaceList',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getCurrentSemesterSections({ payload,callback }, { call, put }) {  // 获取当前学期的所有节次
        let res=yield call(getCurrentSemesterSections,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'saveCurrentSections',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * pubEntryDevicesList({ payload,callback }, { call, put }) {  // 获取所有设备
        let res=yield call(pubEntryDevicesList,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'savePubEntryDevicesList',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },

      * setLastRoute ({ payload }, { call,put }) {
        yield put({ type: 'lastRoute',payload });
      },
    },

    reducers: {
      lastRoute(state, action) {
        return { ...state, lastRoute:{...action.payload} };
      },
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveSchools(state, action) {
        return { ...state, allSchools:[...action.payload ]};
      },
      saveLogin(state, action) {
        return { ...state, loginData:{...action.payload }};
      },
      saveToken(state, action) {
        return { ...state, qiniuToken:{...action.payload }};
      },
      saveCode(state, action) {
        return { ...state, codeData:{...action.payload }};
      },
      saveInformation(state, action) {
        return { ...state, information:{...action.payload }};
      },
      saveGrade(state, action) {
        return{...state,gradeData:{...action.payload}}
      },
      saveGradeName(state,action){
        return{...state,gradeNameData:[...action.payload]}
      },
      saveClassName(state,action){
        return{...state,classNameData:[...action.payload]}
      },
      saveTeachersAndWorks(state, action) {
        return{...state,teacherAndWorksData:{...action.payload}}
      },
      saveClassByGrade(state, action) {
        return{...state,classByGrade:[...action.payload]}
      },
      saveJobList(state, action) {
        return{...state,jobList:[...action.payload.dataList]}
      },
      savePersonList(state, action) {
        return{...state,personData:{...action.payload}}
      },
      saveDepartmentList(state, action) {
        return{...state,departmentData:{...action.payload}}
      },
      saveDepartmentTree(state, action) {
        return{...state,departmentTreeData:{...action.payload}}
      },
      saveCommonJobList(state, action) {
        return{...state,commonJobList:[...action.payload]}
      },
      saveCommonPersonList(state, action) {
        return{...state,commonPersonData:[...action.payload]}
      },
      saveCommonGradeList(state, action) {
        return{...state,commonGradeData:[...action.payload]}
      },
      saveClassLeader(state, action) {
        return{...state,commonClassLeader:[...action.payload]}
      },
      saveLeaveType(state, action) {
        return{...state,leaveTypes:[...action.payload]}
      },
      saveAllTerms(state,action) {
        return{...state,allTerms:[...action.payload]}
      },
      savePubStudents(state,action){
        return{...state,pubStudents:[...action.payload]}
      },
      saveApprovalRules(state,action){
        return{...state,approvalRules:[...action.payload]}
      },
      saveAllClassRooms(state,action){
        return{...state,allClassRooms:[...action.payload]}
      },
      saveAllSchoolUsers(state,action){
        return{...state,allSchoolUsers:[...action.payload]}
      },
      saveBuildingList(state,action){
        return{...state,buildingList:[...action.payload]}
      },
      savePlaceList(state,action){
        return{...state,placeList:[...action.payload]}
      },
      saveCurrentSections(state,action){
        return{...state,currentSections:[...action.payload]}
      },
      savePubEntryDevicesList(state,action){
        return{...state,pubEntryDevicesList:[...action.payload]}
      },
    },

  };
