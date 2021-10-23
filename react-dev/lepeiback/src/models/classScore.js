
import  {getGradeScoreBar,getClassScoreBar,getClassScoreList,getClassScoreType,delClassScoreType,getTermTypes,getClassScoreLog,
  getTypeDetail,addClassScoreType,updateClassScoreType,getClassScoreDetail,getSingleClassScore,setSingleClassScore}  from 'services/index';
export default {

    namespace: 'classScore',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getGradeScoreBar({ payload,callback }, { call, put }) {  // 获取指定时间段的年级排行
        let res=yield call(getGradeScoreBar,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * getClassScoreBar({ payload,callback }, { call, put }) {  // 获取指定时间段的班级排行
        let res=yield call(getClassScoreBar,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * getClassScoreList({ payload,callback }, { call, put }) {  // 考评统计列表
        let res=yield call(getClassScoreList,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'save',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getClassScoreType({ payload,callback }, { call, put }) {  // 考评项列表
        let res=yield call(getClassScoreType,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'saveTypes',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * delClassScoreType({ payload,callback }, { call, put }) {  // 删除考评项
        let res=yield call(delClassScoreType,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * addClassScoreType({ payload,callback }, { call, put }) {  // 创建考评项
        let res=yield call(addClassScoreType,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * updateClassScoreType({ payload,callback }, { call, put }) {  // 更新考评项
        let res=yield call(updateClassScoreType,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * getTermTypes({ payload,callback }, { call, put }) {  // 获取指定学期的考评项
        let res=yield call(getTermTypes,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTermTypes',payload:res.data });
        }
      },
      * getTypeDetail({ payload,callback }, { call, put }) {  // 获取考评项详情
        let res=yield call(getTypeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTypeDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getClassScoreDetail({ payload,callback }, { call, put }) {  // 获取考评明细
        let res=yield call(getClassScoreDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassScoreDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getSingleClassScore({ payload,callback }, { call, put }) {  // 获取单项考评明细
        let res=yield call(getSingleClassScore,payload)
        // if(res&&res.code&&res.code===200){
          // yield put({ type: 'saveSingleClassScore',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        // }
      },
      * setSingleClassScore({ payload,callback }, { call, put }) {  // 设置单项考评
        let res=yield call(setSingleClassScore,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getClassScoreLog({ payload,callback }, { call, put }) {  // 获取考评日志
        let res=yield call(getClassScoreLog,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassScoreLog',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveTypes(state, action) {
        return { ...state, classScoreType:{...action.payload }};
      },
      saveTermTypes(state, action) {
        return { ...state, termTypes:[...action.payload ]};
      },
      saveTypeDetail(state, action) {
        return { ...state, typeDetails:{...action.payload }};
      },
      saveClassScoreDetail(state, action) {
        return { ...state, classScoreDetails:{...action.payload }};
      },
      saveSingleClassScore(state, action) {
        return { ...state, singleClassScore:{...action.payload }};
      },
      saveClassScoreLog(state, action) {
        return { ...state, classScoreLog:{...action.payload }};
      },
    },
  
  };
  