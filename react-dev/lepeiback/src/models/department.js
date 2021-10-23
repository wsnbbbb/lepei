import  {getAllPerson,addDepartment,updateDepartment,delDepartment,departmentDetail,delDepartmentPerson,addDepartmentPerson,delAllDepartmentPerson, 
  changeDepartment, setManager,batchAddTeacher}  from 'services/index';
export default {

    namespace: 'department',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getAllPerson({ payload,callback }, { call, put }) {  // 获取人员列表
        let res=yield call(getAllPerson,payload)
        if(res&&res.code&&res.code===200){
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * departmentDetail({ payload,callback }, { call, put }) {  // 部门详情
        let res=yield call(departmentDetail,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'save',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * delDepartment({ payload,callback }, { call, put }) {  // 删除部门
        let res=yield call(delDepartment,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delDepartmentPerson({ payload,callback }, { call, put }) {  // 删除部门下对应人员
        let res=yield call(delDepartmentPerson,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delAllDepartmentPerson({ payload,callback }, { call, put }) {  // 批量删除部门下对应人员
        let res=yield call(delAllDepartmentPerson,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addDepartmentPerson({ payload,callback }, { call, put }) {  // 添加部门下对应人员
        let res=yield call(addDepartmentPerson,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addDepartment({ payload,callback }, { call, put }) {  // 添加部门
        let res=yield call(addDepartment,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateDepartment({ payload,callback }, { call, put }) {  // 更新部门
        let res=yield call(updateDepartment,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * changeDepartment({ payload,callback }, { call, put }) {  // 更改部门
        let res=yield call(changeDepartment,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * setManager({ payload,callback }, { call, put }) {  // 设置/取消管理员
        let res=yield call(setManager,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * batchAddTeacher({ payload,callback }, { call, put }) {  // 批量添加
        let res=yield call(batchAddTeacher,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
    },
  
    reducers: {
      save(state,action){
        return{...state,...action.payload}
      }
    },
  
  };
  