
import  {deleteGrade,addGrade,updateGrade,uploadGrade}  from 'services/index';
export default {

    namespace: 'grade',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * delGrade({ payload,callback }, { call, put }) {  // 删除年级
        let res=yield call(deleteGrade,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addGrade({ payload,callback }, { call, put }) {  // 添加年级
        let res=yield call(addGrade,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateGrade({ payload,callback }, { call, put }) {  // 添加年级
        let res=yield call(updateGrade,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * uploadGrade({ payload,callback }, { call, put }) {  // 批量导入年级
        let res=yield call(uploadGrade,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      
    },
  
    reducers: {
      // saveGradeName(state,action){
      //   return{...state,gradeData:[...action.payload]}
      // }
    },
  
  };
  