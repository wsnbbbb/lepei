
import  { getTrainList, getTrainDetail,getBarData,getPieData}  from 'services/index';
export default {
    namespace: 'train',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
      * getTrainList({ payload,callback }, { call, put }) {  // 获取外出培训列表
        let res=yield call(getTrainList,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getTrainDetail({ payload,callback }, { call, put }) {  // 获取培训详情
        let res=yield call(getTrainDetail,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getBarData({ payload,callback }, { call, put }) {  // 培训人次统计
        let res=yield call(getBarData,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getPieData({ payload,callback }, { call, put }) {  // 培训类别统计
        let res=yield call(getPieData,payload)
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
  