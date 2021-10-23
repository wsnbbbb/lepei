
import  {customTypeList, copyCustomType, delCustomType, addCustomType, customTypeDetail, editCustomType, getListByCate, teacherDataList,
  dataAuditDetail, auditSendBack, getTeacherHonorRecords, getItemQuestions, addTeacherHonorPersonnelRecords, auditApprove,
  changeTeacherHonorPersonnelRecords, deleteTeacherHonorPersonnelRecords, getHonorStatistics, getTeacherHonorPersonnelRecordsDetail,
  modifyTeacherHonorPersonnelRecords}  from 'services/index';
  
export default {

    namespace: 'teacherDataCollect',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * customTypeList({ payload,callback }, { call, put }) {  // 获取自定义类型列表
        let res=yield call(customTypeList,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * copyCustomType({ payload,callback }, { call, put }) {  // 复制
        let res=yield call(copyCustomType,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * delCustomType({ payload,callback }, { call, put }) {  // 删除
        let res=yield call(delCustomType,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * addCustomType({ payload,callback }, { call, put }) {  // 添加
        let res=yield call(addCustomType,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * customTypeDetail({ payload,callback }, { call, put }) {  // 详情
        let res=yield call(customTypeDetail,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * editCustomType({ payload,callback }, { call, put }) {  // 编辑
        let res=yield call(editCustomType,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getListByCate({ payload,callback }, { call, put }) {  // 根据所属类型获取项目列表
        let res=yield call(getListByCate,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * teacherDataList({ payload,callback }, { call, put }) {  // 获取教师数据审核列表
        let res=yield call(teacherDataList,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * dataAuditDetail({ payload,callback }, { call, put }) {  // 获取教师数据审核详情
        let res=yield call(dataAuditDetail,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },

      * getTeacherHonorRecords({ payload,callback }, { call, put }) {
        let res=yield call(getTeacherHonorRecords,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * auditSendBack({ payload,callback }, { call, put }) {  // 审核退回
        let res=yield call(auditSendBack,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * auditApprove({ payload,callback }, { call, put }) {  // 审核通过
        let res=yield call(auditApprove,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },

      * getItemQuestions({ payload,callback }, { call, put }) {
        let res=yield call(getItemQuestions,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      
      * addTeacherHonorPersonnelRecords({ payload,callback }, { call, put }) {
        let res=yield call(addTeacherHonorPersonnelRecords,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      

      * changeTeacherHonorPersonnelRecords({ payload,callback }, { call, put }) {
        let res=yield call(changeTeacherHonorPersonnelRecords,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      

      * deleteTeacherHonorPersonnelRecords({ payload,callback }, { call, put }) {
        let res=yield call(deleteTeacherHonorPersonnelRecords,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      
      
      * getHonorStatistics({ payload,callback }, { call, put }) {
        let res=yield call(getHonorStatistics,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      

      * getTeacherHonorPersonnelRecordsDetail({ payload,callback }, { call, put }) {
        let res=yield call(getTeacherHonorPersonnelRecordsDetail,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },

      * modifyTeacherHonorPersonnelRecords({ payload,callback }, { call, put }) {
        let res=yield call(modifyTeacherHonorPersonnelRecords,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      
      
      
      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
     
     
    },
  
  };
  