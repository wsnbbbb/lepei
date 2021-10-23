
import  {getGradeScoreBar,getMoralClassScoreBar,getMoralClassScoreList,getMoralEvaluationType,delClassScoreType,getTermTypes,getClassScoreLog,
  getTypeDetail,addClassScoreType,updateClassScoreType,getMoralDayDetail,getMoralWeekDetail,getMoralMonthDetail,getEvaluationType,
  getSingleClassScore,setSingleClassScore,saveEvaluationType, showScore, getMoralTypeDetail, getLogs, updateScore, getMoralWeek, deleteEvaluationType, getEvaluationDetail, updateEvaluation, flagDetail, setFlag}  from 'services/index';
export default {

    namespace: 'moralEvaluation',
  
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
        let res=yield call(getMoralClassScoreBar,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * getMoralWeek({ payload,callback }, { call, put }) {  // 考评统计列表
        let res=yield call(getMoralWeek,payload)
        if(res&&res.code&&res.code===200){
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getClassScoreList({ payload,callback }, { call, put }) {  // 考评统计列表
        let res=yield call(getMoralClassScoreList,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'save',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getClassScoreType({ payload,callback }, { call, put }) {  // 考评项列表
        let res=yield call(getMoralEvaluationType,payload)
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
        // debugger
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTermTypes',payload:res.data });
        }
      },
      * getTypeDetail({ payload,callback }, { call, put }) {  // 获取考评项详情
        let res=yield call(getMoralTypeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTypeDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getMoralDayDetail({ payload,callback }, { call, put }) {  // 获取日考评明细
        let res=yield call(getMoralDayDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassScoreDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getMoralWeekDetail({ payload,callback }, { call, put }) {  // 获取周考评明细
        let res=yield call(getMoralWeekDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassScoreDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getMoralMonthDetail({ payload,callback }, { call, put }) {  // 获取月考评明细
        let res=yield call(getMoralMonthDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassScoreDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getEvaluationType({ payload,callback }, { call, put }) {
        let res=yield call(getEvaluationType,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      
      * deleteEvaluationType({ payload,callback }, { call, put }) {
        let res=yield call(deleteEvaluationType,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },

      * getEvaluationDetail({ payload,callback }, { call, put }) {
        let res=yield call(getEvaluationDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * saveEvaluationType({ payload,callback }, { call, put }) {
        let res=yield call(saveEvaluationType,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
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

      * updateEvaluation({ payload,callback }, { call, put }) {
        let res=yield call(updateEvaluation,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },

      * flagDetail({ payload,callback }, { call, put }) {
        let res=yield call(flagDetail,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },

      * setFlag({ payload,callback }, { call, put }) {
        let res=yield call(setFlag,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },

      * showScore({ payload,callback }, { call, put }) {
        let res=yield call(showScore, payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },

      * getLogs({ payload,callback }, { call, put }) {
        let res=yield call(getLogs, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassScoreLog',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      
      * updateScore({ payload,callback }, { call, put }) {
        let res=yield call(updateScore, payload)
        if(res&&res.code&&res.code===200){
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
  