
import  {getAllClass,personList,delPerson,createPerson,updatePerson,personDetail,delAllPerson,uploadStaff,uploadStudents, secondUploadStaff,
  getTeacherPersonnelInfo, updateTeacherPersonnelInfo,getAllSubject}  from 'services/index';
export default {

    namespace: 'person',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getPersonList({ payload,callback }, { call, put }) {  // 获取人员列表
        let res=yield call(personList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getPersonDetail({ payload,callback }, { call, put }) {  // 获取人员详情
        let res=yield call(personDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * delAllPerson({ payload,callback }, { call, put }) {  // 批量删除人员
        let res=yield call(delAllPerson,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * deletePerson({ payload,callback }, { call, put }) {  // 删除人员
        let res=yield call(delPerson,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * createPerson({ payload,callback }, { call, put }) {  // 创建人员
        let res = yield call(createPerson,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * updatePerson({ payload,callback }, { call, put }) {  // 更新人员
        let res=yield call(updatePerson,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * uploadStaff({ payload,callback }, { call, put }) {  // 批量导入教职工
        let res=yield call(uploadStaff,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * secondUploadStaff({ payload,callback }, { call, put }) {  // 二次导入教职工
        let res=yield call(secondUploadStaff,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * uploadStudents({ payload,callback }, { call, put }) {  // 批量导入学生
        let res=yield call(uploadStudents,payload)
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

      *getAllSubject({ payload, callback }, { call, put }) {
        // 获取学科列表
        let res = yield call(getAllSubject, payload);
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      },

      * getTeacherPersonnelInfo({ payload, callback }, { call, put }) {
        let res=yield call(getTeacherPersonnelInfo, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      
      * updateTeacherPersonnelInfo({ payload, callback }, { call, put }) {
        let res=yield call(updateTeacherPersonnelInfo, payload)
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
  