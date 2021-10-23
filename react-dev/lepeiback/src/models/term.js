
import  {commonGradeList,termList, addTerm, delTerm, termDetail, updateTerm,getCalendar,addCalendar}  from 'services/index';
export default {

    namespace: 'term',
  
    state: { 
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getCommonGradeList({ payload,callback }, { call, put }) {  // 获取公共年级列表
        let res=yield call(commonGradeList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * termList({ payload, callback }, { call, put }) {  
        let res=yield call(termList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addTerm({ payload, callback }, { call, put }) {  // 创建学期
        let res=yield call(addTerm, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * delTerm({ payload, callback }, { call, put }) {  // 删除学期
        let res=yield call(delTerm, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * termDetail({ payload, callback }, { call, put }) {  // 学期详情
        let res=yield call(termDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateTerm({ payload, callback }, { call, put }) {  // 学期详情
        let res=yield call(updateTerm, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getCalendar({ payload, callback }, { call, put }) {  // 获取学校校历
        let res=yield call(getCalendar, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveCalendar',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * addCalendar({ payload, callback }, { call, put }) {  // 调整学校校历
        let res=yield call(addCalendar, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
   
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
     
      saveCalendar(state, action) {
        return{...state, calendarData: action.payload}
      },
    },
  
  };
  