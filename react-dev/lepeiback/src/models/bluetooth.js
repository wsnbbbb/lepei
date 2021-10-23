import  { bluetoothStudentRecord, bluetoothTeacherRecord, getCardInfo, setTimeSections,atSchoolStatisticsPerson,schoolListData}  from 'services/index';
export default {

    namespace: 'bluetooth',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * bluetoothStudentRecord({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(bluetoothStudentRecord,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * atSchoolStatisticsPerson({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(atSchoolStatisticsPerson,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
      * bluetoothTeacherRecord({ payload,callback }, { call, put }) {  
        let res=yield call(bluetoothTeacherRecord,payload)
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
      * schoolListData({ payload,callback }, { call, put }) {
        let res=yield call(schoolListData,payload)
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
  