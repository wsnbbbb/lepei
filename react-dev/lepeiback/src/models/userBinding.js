
import  { getPersonList,bindDetail,updateBind  }  from 'services/index';
export default {
    namespace: 'userBinding',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
      * personList({ payload, callback }, { call, put }) {  //获取人员列表
        let res=yield call(getPersonList, payload)
        yield put({ type: 'savePerson',payload:res.data });
      },
      * bindDetail({ payload,callback }, { call, put }) {  // 绑定详情
        let res=yield call(bindDetail,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * updateBind({ payload,callback }, { call, put }) {  // 更新绑定
        let res=yield call(updateBind,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },




    },
  
    reducers: {
      // save(state, action) {
      //   return { ...state, ...action.payload };
      // },
      savePerson(state, action) {
        return { ...state, savePerson:action.payload };
      },
     
     
    },
  
  };
  