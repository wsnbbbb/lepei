
import  { getHandholdList, statisticsPerson, handStatistics}  from 'services/index';
export default {

    namespace: 'handhold',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getHandholdList({ payload, callback}, { call, put }) {
        let res=yield call(getHandholdList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * statisticsPerson({ payload, callback}, { call, put }) {
        let res=yield call(statisticsPerson, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * handStatistics({ payload, callback}, { call, put }) {
        let res=yield call(handStatistics, payload)
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
  