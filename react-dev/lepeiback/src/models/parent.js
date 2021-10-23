
import  {getAllClass,getParents,getParentsDetail,deleteRelation,parentsAdd,parentsImport}  from 'services/index';
export default {

    namespace: 'parent',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getParentList({ payload , callback}, { call, put }) {  // 获取列表
        let res=yield call(getParents,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getParentsDetail({ payload,callback }, { call, put }) {
        let res=yield call(getParentsDetail,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * deleteRelation({ payload,callback }, { call, put }) {
        let res=yield call(deleteRelation,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
    
      * parentsAdd({ payload,callback }, { call, put }) {
        let res=yield call(parentsAdd,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * parentsImport({ payload,callback }, { call, put }) {  // 批量导入学生
        let res=yield call(parentsImport,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * getAllClass({ payload,callback }, { call, put }) {  // 获取所有班级
        let res=yield call(getAllClass,payload)
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
        return { ...state, personDetail:{...action.payload }};
      },
    },
  
  };
  