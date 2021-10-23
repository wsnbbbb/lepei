
import  {getGradeStatistics,getClassStatistics,getSwipeCardList,getSwipeCardDetail}  from 'services/index';
export default {

    namespace: 'swipeCard',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getGradeStatistics({ payload, callback }, { call, put }) {  // 获取学生刷卡年级统计
        let res=yield call(getGradeStatistics,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * getClassStatistics({ payload, callback }, { call, put }) {// 获取学生刷卡班级统计
        let res=yield call(getClassStatistics, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getSwipeCardList({ payload,callback }, { call, put }) {  // 获取学生刷卡统计列表
        let res=yield call(getSwipeCardList,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'save',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
      * getSwipeCardDetail({ payload,callback }, { call, put }) {  // 获取学生刷卡统计明细
        let res=yield call(getSwipeCardDetail,payload)
        if(res&&res.code&&res.code===200){
            yield put({ type: 'saveDetail',payload:res.data });
            if(callback && typeof callback === 'function'){
              callback(res)
            }
        }
      },
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveDetail(state, action) {
        return { ...state, swipeCardDetail:{...action.payload }};
      }
    },
  
  };
  