
import  {doorList,doorNew,doorUpdate,doorDelete,doorDetail}  from 'services/index';
export default {

    namespace: 'doorList',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * doorDelete({ payload,callback }, { call, put }) {  // 删除门禁
        let res=yield call(doorDelete,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * doorNew({ payload,callback }, { call, put }) {  // 添加门禁
        let res=yield call(doorNew,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * doorUpdate({ payload,callback }, { call, put }) {  // 更新门禁
        let res=yield call(doorUpdate,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * doorList({ payload,callback }, { call, put }) {  // 获取门禁列表
        let res=yield call(doorList,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * doorDetail({ payload,callback }, { call, put }) {  // 门禁详情
      let res=yield call(doorDetail,payload)
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
  