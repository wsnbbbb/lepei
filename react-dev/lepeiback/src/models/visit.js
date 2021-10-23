
import  {getVisitList,updateVisit,getVisitDetail}  from 'services/index';
export default {

    namespace: 'visit',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getVisitList({ payload, callback }, { call, put }) {  //获取访客列表
        let res=yield call(getVisitList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload: res.data });
        }
      },
      * getVisitDetail({ payload, callback }, { call, put }) {  //获取访客详情
        let res=yield call(getVisitDetail, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload: res.data });
        }
      },
      * updateVisit({ payload, callback }, { call, put }) {  //标记使用
        let res=yield call(updateVisit, payload)
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
        return { ...state, detail:{...action.payload} };
      },
    },
  
  };
  