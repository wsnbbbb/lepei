
import  {getRoomNotice,setRoomNotice,delRoomNotice,roomNoticeDetail,updateRoomNotice}  from 'services/index';
export default {

    namespace: 'roomNotice',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getRoomNotice({ payload }, { call, put }) {  // 获取教室通知列表
        let res=yield call(getRoomNotice,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * roomNoticeDetail({ payload,callback }, { call, put }) {  // 获取教室通知详情
        let res=yield call(roomNoticeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * setRoomNotice({ payload,callback }, { call, put }) {  // 创建教室通知
        let res=yield call(setRoomNotice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateRoomNotice({ payload,callback }, { call, put }) {  // 更新教室通知
        let res=yield call(updateRoomNotice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delRoomNotice({ payload,callback }, { call, put }) {  // 删除教室通知
        let res=yield call(delRoomNotice,payload)
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
        return { ...state, roomNoticeDetail:{...action.payload} };
      },
    },
  
  };
  