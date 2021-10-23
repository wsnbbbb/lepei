
import  {getRoomApply,getRoomBarData,getRoomApplyNum,getApplyHandlers,setApplyHandlers,delRoomApply,getRoomApplyDetail
  }  from 'services/index';
  export default {
  
      namespace: 'room',
    
      state: {
        //   current:1
      },
    
      subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
      },
    
      effects: {
        * getRoomApply({ payload }, { call, put }) {  // 获取教师申请列表
          let res=yield call(getRoomApply,payload)
          if(res&&res.code&&res.code===200){
            yield put({ type: 'save',payload:res.data });
          }
        },
        * getRoomApplyDetail({ payload }, { call, put }) {  // 获取申请详情
          let res=yield call(getRoomApplyDetail,payload)
          if(res&&res.code&&res.code===200){
            yield put({ type: 'saveDetails',payload:res.data });
          }
        },
        * getApplyHandlers({ payload }, { call, put }) {  // 获取审批规则
          let res=yield call(getApplyHandlers,payload)
          if(res&&res.code&&res.code===200){
            yield put({ type: 'saveHanders',payload:res.data });
          }
        },
        * setApplyHandlers({ payload,callback }, { call, put }) {  //设置审批规则
          let res=yield call(setApplyHandlers,payload)
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        },
        * getRoomApplyNum({ payload,callback }, { call, put }) {  // 获取功能教室申请次数
          let res=yield call(getRoomApplyNum,payload)
          if(res&&res.code&&res.code===200){
            yield put({ type: 'saveNum',payload:res.data });
          }
        },
        * getRoomBarData({ payload,callback }, { call, put }) {  //获取教室申请柱状图
          let res=yield call(getRoomBarData,payload)
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        },
        * delRoomApply({ payload,callback }, { call, put }) {  //删除教室申请记录
          let res=yield call(delRoomApply,payload)
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        },
      },
    
      reducers: {
        save(state, action) {
          return { ...state, ...action.payload };
        },
        saveDetails(state, action) {
          return { ...state, saveDetails:{...action.payload }};
        },
        saveHanders(state, action) {
          return { ...state, saveHanders:{...action.payload }};
        },
        saveNum(state, action) {
          return { ...state, roomNums:{...action.payload} };
        },
      },
    
    };
    