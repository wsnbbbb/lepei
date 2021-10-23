
import  { cardlist, deleteDevice, getCardInfo, setTimeSections}  from 'services/index';
export default {

    namespace: 'banCard',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * cardlist({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(cardlist,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
      * deleteDevice({ payload,callback }, { call, put }) {  
        let res=yield call(deleteDevice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getCardInfo({ payload,callback }, { call, put }) {
        let res=yield call(getCardInfo,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * setTimeSections({ payload,callback }, { call, put }) {
        let res=yield call(setTimeSections,payload)
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
        return { ...state, canteenMenuDetail:{...action.payload }};
      }
    },
  
  };
  