
import  {classList,deleteClass,classDetail,addClass,updateClass,uploadClasses, uploadTeacher}  from 'services/index';
export default {

    namespace: 'class',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getClassList({ payload }, { call, put }) {  // 获取班级列表
        let res=yield call(classList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * getClassDetail({ payload,callback }, { call, put }) {  // 获取班级详情
        let res=yield call(classDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * delClass({ payload,callback }, { call, put }) {  // 删除班级
        let res=yield call(deleteClass,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addClass({ payload,callback }, { call, put }) {  // 添加班级
        let res=yield call(addClass,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateClass({ payload,callback }, { call, put }) {  // 更新班级
        let res=yield call(updateClass,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * uploadClasses({ payload,callback }, { call, put }) {  // 批量导入班级
        let res=yield call(uploadClasses,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },

      * uploadTeacher({ payload,callback }, { call, put }) {  // 教师导入班级
        let res=yield call(uploadTeacher,payload)
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
        return { ...state, classDetail:{...action.payload }};
      }
    },
  
  };
  