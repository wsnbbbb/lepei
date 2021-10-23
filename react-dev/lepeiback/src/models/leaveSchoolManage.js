
import  { getLeaveSchool,leaveSchoolList,setAdmin,getAdmins,getChargeOfTeacher,setResponsibleTeacher,delLeaveSchool,importClassFile,importStudentFile,
  getStudentList,delLeaveStudent,leaveSchoolClasses,getAllClass,batchDelRecord,getAllPubStudents,getTeachersList,getResponsibleTeacher,editResponsibleTeacher }  from 'services/index';
export default {

    namespace: 'leaveSchoolManage',
  
    state: { 
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getLeaveSchool({ payload,callback }, { call, put }) {  // 可选班级
        let res=yield call(getLeaveSchool,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * leaveSchoolList({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(leaveSchoolList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * setAdmin({ payload,callback }, { call, put }) {  // 设置超级管理员
        let res=yield call(setAdmin,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAdmins({ payload,callback }, { call, put }) {  // 获取超级管理员详情
        let res=yield call(getAdmins,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getChargeOfTeacher({ payload,callback }, { call, put }) {  // 获取负责老师详情
        let res=yield call(getChargeOfTeacher,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * setResponsibleTeacher({ payload,callback }, { call, put }) {  // 新建负责老师
        let res=yield call(setResponsibleTeacher,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delLeaveSchool({ payload,callback }, { call, put }) {  // 删除
        let res=yield call(delLeaveSchool,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importClassFile({ payload,callback }, { call, put }) {  // 班级导入
        let res=yield call(importClassFile,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importStudentFile({ payload,callback }, { call, put }) {  // 学生导入
        let res=yield call(importStudentFile,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getStudentList({ payload,callback }, { call, put }) {  // 学生列表
        let res=yield call(getStudentList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delLeaveStudent({ payload,callback }, { call, put }) {  // 删除学生
        let res=yield call(delLeaveStudent,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * leaveSchoolClasses({ payload,callback }, { call, put }) {  // 已放学班级列表
        let res=yield call(leaveSchoolClasses,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAllClass({ payload, callback }, { call, put }) {  //获取所有班级
        let res=yield call(getAllClass, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * batchDelRecord({ payload, callback }, { call, put }) {  //批量删除
        let res=yield call(batchDelRecord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getAllPubStudents({ payload,callback }, { call, put }) { //获取所有学生
        let res=yield call(getAllPubStudents,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getTeachersList({ payload,callback }, { call, put }) { //获取所有教职工
        let res=yield call(getTeachersList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getResponsibleTeacher({ payload,callback }, { call, put }) { //获取班级和负责老师详情
        let res=yield call(getResponsibleTeacher,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editResponsibleTeacher({ payload,callback }, { call, put }) { //修改班级和负责老师详情
        let res=yield call(editResponsibleTeacher,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
    
    },
  
    reducers: {

    }
  
  };
  