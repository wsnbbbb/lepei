
import  { getVoteList, deleteVoting, votingChange, getVotingDetail, votingModify, votingAdd, 
getVotingStatistics}  from 'services/index';
export default {

    namespace: 'vote',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getVoteList({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getVoteList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
      * deleteVoting({ payload,callback }, { call, put }) {  
        let res=yield call(deleteVoting,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * votingChange({ payload,callback }, { call, put }) {
        let res=yield call(votingChange,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getVotingDetail({ payload,callback }, { call, put }) {
        let res=yield call(getVotingDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * votingModify({ payload,callback }, { call, put }) {
        let res=yield call(votingModify, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * votingAdd({ payload,callback }, { call, put }) {
        let res=yield call(votingAdd, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getVotingStatistics({ payload,callback }, { call, put }) {
        let res=yield call(getVotingStatistics, payload)
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
  