
import  {associationClassList, associationCourseList, trustList,commonGradeList,commonPersonList,
  getTeachersAndWorks, creatTrust, deleteTrust, trustDetail, updateTrust, trustRecords, recordDetail, 
  getClassName, refund
}  from 'services/index';
export default {

    namespace: 'trustManage',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * associationClassList({ payload, callback }, { call, put }) {  //获取列表
        let res=yield call(associationClassList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveList',payload: res.data });
        }
      },
      * associationCourseList({ payload, callback }, { call, put }) {  //获取列表
        let res=yield call(associationCourseList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * trustList({ payload, callback }, { call, put }) {  //获取列表
        let res=yield call(trustList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * commonGradeList({ payload, callback }, { call, put }) {  //获取列表
        let res=yield call(commonGradeList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getTeachersAndWorks({ payload, callback }, { call, put }) {  //获取列表
        let res=yield call(commonPersonList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveTeacher',payload: res.data });
        }
      },
      * creatTrust({ payload, callback }, { call, put }) {
        let res=yield call(creatTrust, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * deleteTrust({ payload, callback }, { call, put }) {
        let res=yield call(deleteTrust, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * trustDetail({ payload, callback }, { call, put }) {
        let res=yield call(trustDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateTrust({ payload, callback }, { call, put }) {
        let res=yield call(updateTrust, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * trustRecords({ payload, callback }, { call, put }) {
        let res=yield call(trustRecords, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * commonGradeList({ payload, callback }, { call, put }) {
        let res=yield call(commonGradeList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getClassName({ payload, callback }, { call, put }) {
        let res=yield call(getClassName, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * recordDetail({ payload, callback }, { call, put }) {
        let res=yield call(recordDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * refund({ payload, callback }, { call, put }) {
        let res=yield call(refund, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      
      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveList(state, action) {
        return { ...state, ...action.payload };
      },
      saveTeacher(state, action) {
        return { ...state, teacherList: [...action.payload] };
      },
      
    
    },
  
  };
  