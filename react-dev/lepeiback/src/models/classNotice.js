
import  {getClassNotice,setClassNotice,delClassNotice,classNoticeDetail,updateClassNotice,classNoticeBarData,classNoticeList,classNoticePublisher,
  getReceipt}  from 'services/index';
export default {

    namespace: 'classNotice',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getClassNotice({ payload,callback }, { call, put }) {  // 获取班级通知列表
        let res=yield call(getClassNotice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getReceipt({ payload,callback }, { call, put }) {  // 获取阅读回执
        let res=yield call(getReceipt,payload)
         if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * classNoticeDetail({ payload,callback }, { call, put }) {  // 获取班级通知详情
        let res=yield call(classNoticeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * setClassNotice({ payload,callback }, { call, put }) {  // 创建班级通知
        let res=yield call(setClassNotice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateClassNotice({ payload,callback }, { call, put }) {  // 更新班级通知
        let res=yield call(updateClassNotice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delClassNotice({ payload,callback }, { call, put }) {  // 删除班级通知
        let res=yield call(delClassNotice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * classNoticeBarData({ payload,callback }, { call, put }) {  // 班级通知折线图
        let res=yield call(classNoticeBarData,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * classNoticeList({ payload,callback }, { call, put }) {  // 班级通知统计列表
        let res=yield call(classNoticeList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassNoticeList',payload:res.data });
        }
      },
      * classNoticePublisher({ payload,callback }, { call, put }) {  // 班级通知发布人列表
        let res=yield call(classNoticePublisher,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveClassNoticePublisher',payload:res.data });
        }
      },
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveDetail(state, action) {
        return { ...state, classNoticeDetail:{...action.payload} };
      },
      saveClassNoticeList(state, action) {
        return { ...state, classNoticeList:{...action.payload} };
      },
      saveClassNoticePublisher(state, action) {
        return { ...state, classNoticePublisher:{...action.payload} };
      },
    },
  
  };
  