
import  {getSubjectList,getSubjectDetail,createSubject,updateSubject,delSubject}  from 'services/index';
export default {

    namespace: 'subject',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getSubjectList({ payload }, { call, put }) {  // 获取学科列表
        let res=yield call(getSubjectList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * getSubjectDetail({ payload,callback }, { call, put }) {  // 获取学科详情
        let res=yield call(getSubjectDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * delSubject({ payload,callback }, { call, put }) {  // 删除学科
        let res=yield call(delSubject,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * createSubject({ payload,callback }, { call, put }) {  // 添加学科
        let res=yield call(createSubject,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateSubject({ payload,callback }, { call, put }) {  // 更新学科
        let res=yield call(updateSubject,payload)
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
        return { ...state, subjectDetail:{...action.payload }};
      }
    },
  
  };
  