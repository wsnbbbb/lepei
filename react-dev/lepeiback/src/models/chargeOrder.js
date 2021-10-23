
import  { chargeOrderList,  }  from 'services/index';
export default {

    namespace: 'chargeOrder',
  
    state: { 
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {
      },
    },
  
    effects: {
      * chargeOrderList({ payload, callback }, { call, put }) {
        let res=yield call(chargeOrderList, payload)
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
  