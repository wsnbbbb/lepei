
import  { staffAttendList, setAttendance,attendanceRecord,attendanceTime, personAttendance}  from 'services/index';
export default {
    namespace: 'staffAttendance',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
      * staffAttendList({ payload,callback }, { call, put }) {  // 教职工考勤列表
        let res=yield call(staffAttendList,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * attendanceTime({ payload,callback }, { call, put }) {  // 获取上下班时间
        let res=yield call(attendanceTime,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * setAttendance({ payload,callback }, { call, put }) {  // 设置上下班时间
        let res=yield call(setAttendance,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * attendanceRecord({ payload,callback }, { call, put }) {  // 考勤详情
        let res=yield call(attendanceRecord,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * personAttendance({ payload,callback }, { call, put }) {  // 个人考勤
        let res=yield call(personAttendance,payload)
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
  