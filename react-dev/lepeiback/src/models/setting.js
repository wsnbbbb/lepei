
import  {deleteGrade,addGrade,updateGrade, getAccount, addAccount, deleteAccount, accountDetail, updateAccount, 
accessList, getjobList, accessDetail, allGrades, updataAccredit, getCadres}  from 'services/index';
export default {

    namespace: 'setting',
  
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
      * accountDetail({ payload,callback }, { call, put }) {  // 查询账户信息
        let res=yield call(accountDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateAccount({ payload,callback }, { call, put }) {  // 查询账户信息
        let res=yield call(updateAccount,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * deleteAccount({ payload,callback }, { call, put }) {  // 删除账户信息
        let res=yield call(deleteAccount,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * accessList({ payload,callback }, { call, put }) {  // 获取权限列表
        let res=yield call(accessList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveAccess',payload:res.data });
        }
      },
      * getjobList({ payload,callback }, { call, put }) {  // 获取权限列表
        let res=yield call(getjobList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveJob',payload:res.data.dataList });
        }
      },
      * getCadres({ payload,callback }, { call, put }) {
        let res=yield call(getCadres,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveCadres',payload:res.data });
        }
      },

      * accessDetail({ payload,callback }, { call, put }) {
        let res=yield call(accessDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * allGrades({ payload,callback }, { call, put }) {
        let res=yield call(allGrades,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveGrades',payload:res.data.dataList });
        }
      },
      * updataAccredit({ payload,callback }, { call, put }) {  // 更新权限列表
        let res=yield call(updataAccredit,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
    },
  
    reducers: {
      saveAccount(state, action) {
        return{...state, accountData:{...action.payload}}
      },
      saveAccess(state, action) {
        return{...state, accessData:{...action.payload}}
      },
      saveJob(state, action) {
        return{...state, jobData:[...action.payload]}
      },
      saveCadres(state, action) {
        return{...state, cadresData:[...action.payload]}
      },
      saveGrades(state, action) {
        return{...state, gradeData:[...action.payload]}
      },
      // saveGradeName(state,action){
      //   return{...state,gradeData:[...action.payload]}
      // }
    },
  
  };
  