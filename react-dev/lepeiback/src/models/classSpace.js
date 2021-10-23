
import  {getAllgrade, getClassesByGradeId, getAllClasses, getStyleDetail, deleteStyle, 
  showPublishers, setPublishers, studentStyle, getStatisticsList}  from 'services/index';
export default {

    namespace: 'classSpace',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getAllgrade({ payload, callback }, { call, put }) {  
        let res=yield call(getAllgrade, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveGrade',payload: res.data });
        }
      },
      
      * getClassesByGradeId({ payload, callback }, { call, put }) {  
        let res=yield call(getClassesByGradeId, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClasses',payload: res.data });
        }
      },
      
      * getAllClasses({ payload, callback }, { call, put }) {  
        let res=yield call(getAllClasses, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getStyleDetail({ payload, callback }, { call, put }) {  
        let res=yield call(getStyleDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * deleteStyle({ payload, callback }, { call, put }) {  
        let res=yield call(deleteStyle, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * showPublishers({ payload, callback }, { call, put }) {  
        let res=yield call(showPublishers, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * setPublishers({ payload, callback }, { call, put }) {  
        let res=yield call(setPublishers, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * studentStyle({ payload, callback }, { call, put }) {  
        let res=yield call(studentStyle, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getStatisticsList({ payload, callback }, { call, put }) {  
        let res=yield call(getStatisticsList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveGrade(state, action) {
        return { ...state, gradeList: [...action.payload] };
      },
      saveClasses(state, action) {
        return { ...state, classesList: [...action.payload] };
      },
    },
  
  };
  