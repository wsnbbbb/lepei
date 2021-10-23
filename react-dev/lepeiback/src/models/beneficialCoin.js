
import  { getAllCions, getCions, setRate, classProperty, propertyRecord, teacherProperty, teacherCount, commonPersonList, grantCoin, rateDetail }  from 'services/index';
export default {

    namespace: 'beneficialCoin',
  
    state: { 
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getAllCions({ payload, callback }, { call, put }) {  // 获取总益小币
        let res=yield call(getAllCions, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getCions({ payload, callback }, { call, put }) {  // 获取益小币管理列表
        let res=yield call(getCions, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * rateDetail({ payload, callback }, { call, put }) {  // 年利率详情
        let res=yield call(rateDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * setRate({ payload, callback }, { call, put }) {  // 设置年利率
        let res=yield call(setRate, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * classProperty({ payload, callback }, { call, put }) {  // 获取班级资产
        let res=yield call(classProperty, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * propertyRecord({ payload, callback }, { call, put }) {  // 收支记录
        let res=yield call(propertyRecord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * teacherProperty({ payload, callback }, { call, put }) {  // 获取教师资产
        let res=yield call(teacherProperty, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * teacherCount({ payload, callback }, { call, put }) {  // 获取教师类型数量
        let res=yield call(teacherCount, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * teachersList({ payload, callback }, { call, put }) {  // 获取全部教师
        let res=yield call(commonPersonList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * grantCoin({ payload, callback }, { call, put }) {  // 发放益小币
        let res=yield call(grantCoin, payload)
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
  