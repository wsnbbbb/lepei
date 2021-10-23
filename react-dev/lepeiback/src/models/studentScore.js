
import  {classList,classDetail, getStudentScore, deleteStudentScore, importStudentScore, getScoreDetail, updateItemScore, delPersonScore, updateScoreTitle}  from 'services/index';

export default {

    namespace: 'studentScore',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getClassList({ payload }, { call, put }) {  // 获取班级列表
        let res=yield call(classList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * getClassDetail({ payload,callback }, { call, put }) {  // 获取班级详情
        let res=yield call(classDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getStudentScore({ payload,callback }, { call, put }) {
        let res=yield call(getStudentScore,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * deleteStudentScore({ payload,callback }, { call, put }) {
        let res=yield call(deleteStudentScore,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * importStudentScore({ payload,callback }, { call, put }) {
        let res=yield call(importStudentScore,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getScoreDetail({ payload,callback }, { call, put }) {  // 获取成绩详情
        let res=yield call(getScoreDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * updateItemScore({ payload,callback }, { call, put }) {
        let res=yield call(updateItemScore,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delPersonScore({ payload,callback }, { call, put }) {
        let res=yield call(delPersonScore,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateScoreTitle({ payload,callback }, { call, put }) {  // 名称修改
        let res=yield call(updateScoreTitle,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      
      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveDetail(state, action) {
        return { ...state, classDetail:{...action.payload }};
      },
      saveDetail(state, action) {
        return { ...state, salaryDetail:{...action.payload }};
      }
    },
  
  };
  