
import  {jobList,deleteJob,addJob,updateJob,jobDetail, getAllNodes, allGrades}  from 'services/index';
export default {

    namespace: 'job',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getJobList({ payload,callback }, { call, put }) {  // 获取职务列表
        let res=yield call(jobList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delJob({ payload,callback }, { call, put }) {  // 删除职务
        let res=yield call(deleteJob,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addJob({ payload,callback }, { call, put }) {  // 添加职务
        let res=yield call(addJob,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
    
      * updateJob({ payload,callback }, { call, put }) {  // 编辑职务
        let res=yield call(updateJob,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getJobDetail({ payload,callback }, { call, put }) {  // 获取职务详情
        let res=yield call(jobDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getAllNodes({ payload,callback }, { call, put }) {  // 获取功能权限列表
        let res=yield call(getAllNodes,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * allGrades({ payload,callback }, { call, put }) { // 获取所有年级
        let res=yield call(allGrades,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveGrades',payload:res.data.dataList });
        }
      },



    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveDetail(state, action) {
        return { ...state, jobDetail:{...action.payload} };
      },
      saveGrades(state, action) {
        return{...state, gradeData:[...action.payload]}
      },
    },
  
  };
  