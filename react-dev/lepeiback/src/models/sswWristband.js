
import  {getSswPositionList,setSswPosition,delSswPosition,sswPositionDetail,updateSswPosition,getSswPersonMacList,sswPersonMacDetail,updateSswPersonMac,
  setSswPersonMacInfo,sswPersonMacImport,getSswPersonMacStatus,getSswPersonMacData,getSswTrackList,getSswHeartList,getSswHealthList,getSswMessageList,
  getSswMessageDetail,getSswMessageRecordList,getSswResendMessage,addSswMessage,delSswMessage,getBlueToothAttendList
}  from 'services/index';
export default {

    namespace: 'sswWristband',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getSswPositionList({ payload, callback }, { call, put }) {  //获取顺势为定位终端列表
        let res=yield call(getSswPositionList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload: res.data });
        }
      },
      * sswPositionDetail({ payload, callback }, { call, put }) {  //获取顺势为定位终端详情
        let res=yield call(sswPositionDetail, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * setSswPosition({ payload, callback }, { call, put }) {  //创建顺势为定位终端
        let res=yield call(setSswPosition, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },  
      * updateSswPosition({ payload, callback }, { call, put }) {  //更新顺势为定位终端
        let res=yield call(updateSswPosition, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * delSswPosition({ payload, callback }, { call, put }) {  //删除顺势为定位终端
        let res=yield call(delSswPosition, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },   
      * getSswPersonMacList({ payload, callback }, { call, put }) {  //获取顺势为手环标签配置列表
        let res=yield call(getSswPersonMacList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'savePersonMacList',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * sswPersonMacDetail({ payload, callback }, { call, put }) {  //获取顺势为手环信息
        let res=yield call(sswPersonMacDetail, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'savePersonMacDetail',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * updateSswPersonMac({ payload, callback }, { call, put }) {  //修改手环mac
        let res=yield call(updateSswPersonMac, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },  
      * setSswPersonMacInfo({ payload, callback }, { call, put }) {  //设置用户信息
        let res=yield call(setSswPersonMacInfo, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * sswPersonMacImport({ payload, callback }, { call, put }) {  //获取顺势为手环信息
        let res=yield call(sswPersonMacImport, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getSswPersonMacStatus({ payload, callback }, { call, put }) {  //获取顺势为手环状态人员信息
        let res=yield call(getSswPersonMacStatus, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'savePersonMacStatus',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getSswPersonMacData({ payload, callback }, { call, put }) {  //获取顺势为手环状态当前信息
        let res=yield call(getSswPersonMacData, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'savePersonMacData',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getSswTrackList({ payload, callback }, { call, put }) {  //顺势为手环轨迹查询
        let res=yield call(getSswTrackList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSswTrackList',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getSswHealthList({ payload, callback }, { call, put }) {  //顺势为手环健康查询
        let res=yield call(getSswHealthList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSswHealthList',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getSswHeartList({ payload, callback }, { call, put }) {  //顺势为手环心率查询
        let res=yield call(getSswHeartList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSswHeartList',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getSswMessageList({ payload, callback }, { call, put }) {  //顺势为手环信息发送列表
        let res=yield call(getSswMessageList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSswMessageList',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getSswMessageDetail({ payload, callback }, { call, put }) {  //顺势为手环信息发送详情
        let res=yield call(getSswMessageDetail, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSswMessageDetail',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getSswMessageRecordList({ payload, callback }, { call, put }) {  //顺势为手环信息发送详情页列表
        let res=yield call(getSswMessageRecordList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSswMessageRecordList',payload: res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getSswResendMessage({ payload, callback }, { call, put }) {  //顺势为消息重新发送
        let res=yield call(getSswResendMessage, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      }, 
      * addSswMessage({ payload, callback }, { call, put }) {  //添加顺势为消息
        let res=yield call(addSswMessage, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      }, 
      * delSswMessage({ payload, callback }, { call, put }) {  //删除顺势为消息
        let res=yield call(delSswMessage, payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      }, 
      * getBlueToothAttendList({ payload, callback }, { call, put }) {  //顺势为手环蓝牙考勤列表
        let res=yield call(getBlueToothAttendList, payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveBlueToothList',payload: res.data });
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
        return { ...state, positionDetail:{...action.payload }};
      },
      savePersonMacList(state, action) {
        return { ...state, personMacList:{...action.payload }};
      },
      savePersonMacDetail(state, action) {
        return { ...state, personMacDetail:{...action.payload }};
      },
      savePersonMacStatus(state, action) {
        return { ...state, personMacStatus:{...action.payload }};
      },
      savePersonMacData(state, action) {
        return { ...state, personMacData:{...action.payload }};
      },
      saveSswTrackList(state, action) {
        return { ...state, sswTrackList:{...action.payload }};
      },
      saveSswHealthList(state, action) {
        return { ...state, sswHealthList:{...action.payload }};
      },
      saveSswHeartList(state, action) {
        return { ...state, sswHeartList:{...action.payload }};
      },
      saveSswMessageList(state, action) {
        return { ...state, sswMessageList:{...action.payload }};
      },
      saveSswMessageDetail(state, action) {
        return { ...state, sswMessageDetail:{...action.payload }};
      },
      saveSswMessageRecordList(state, action) {
        return { ...state, sswMessageRecordList:{...action.payload }};
      },
      saveBlueToothList(state, action) {
        return { ...state, blueToothList:{...action.payload }};
      },
    },
  
  };
  