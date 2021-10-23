
import  {getInformation,updatePsd,verifiyCode,bindCount,unbindCount,updateInformation,updateSchoolBrief,getSchoolBrief}  from 'services/index';
export default {

    namespace: 'information',
  
    state: {
        // current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getInformation({ payload,callback }, { call, put }) {  // 获取账号详情
        let res=yield call(getInformation,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * updateInformation({ payload,callback }, { call, put }) {  // 更新账号信息
        let res=yield call(updateInformation,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updatePsd({ payload,callback }, { call, put }) {  // 更新密码
        let res=yield call(updatePsd,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * verifiyCode({ payload,callback }, { call, put }) {  // 校验验证码
        let res=yield call(verifiyCode,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * bindCount({ payload,callback }, { call, put }) {  // 账号绑定
        let res=yield call(bindCount,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * unbindCount({ payload,callback }, { call, put }) {  // 账号解绑
        let res=yield call(unbindCount,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * getSchoolBrief({ payload,callback }, { call, put }) {  // 获取校园简介
        let res=yield call(getSchoolBrief,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveBrief',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * updateSchoolBrief({ payload,callback }, { call, put }) {  // 更新校园简介
        let res=yield call(updateSchoolBrief,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveBrief(state, action) {
        return { ...state, schoolBrief:{...action.payload} };
      },
    },
  
  };
  