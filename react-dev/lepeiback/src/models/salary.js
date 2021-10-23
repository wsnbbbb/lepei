
import  {getSalaryList,publishSalary,delSalary,uploadSalary,getSalaryDetail,delPersonSalary,updateSalaryRemark,updateSalaryItem,updateSalaryTitle}  from 'services/index';
export default {

    namespace: 'salary',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getSalaryList({ payload }, { call, put }) {  // 获取工资条列表
        let res=yield call(getSalaryList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * publishSalary({ payload,callback }, { call, put }) {  // 工资条发布
        let res=yield call(publishSalary,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * uploadSalary({ payload,callback }, { call, put }) {  // 工资条上传
        let res=yield call(uploadSalary,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getSalaryDetail({ payload,callback }, { call, put }) {  // 获取工资条详情
        let res=yield call(getSalaryDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * delSalary({ payload,callback }, { call, put }) {  // 删除工资条
        let res=yield call(delSalary,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delPersonSalary({ payload,callback }, { call, put }) {  // 删除个人工资条
        let res=yield call(delPersonSalary,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateSalaryRemark({ payload,callback }, { call, put }) {  // 个人备注修改
        let res=yield call(updateSalaryRemark,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateSalaryItem({ payload,callback }, { call, put }) {  // 工资项修改
        let res=yield call(updateSalaryItem,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateSalaryTitle({ payload,callback }, { call, put }) {  // 工资项名称修改
        let res=yield call(updateSalaryTitle,payload)
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
        return { ...state, salaryDetail:{...action.payload }};
      }
    },
  
  };
  