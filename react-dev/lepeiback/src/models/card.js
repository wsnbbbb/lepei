
import  {getPersonCard,openPersonCard,uploadPersonCard,getPeopleCard,getCardData,getStRechargeDetail,getSxRechargeDetail,
  getStCustomerConsumeDetail,getSxCustomerConsumeDetail,getCustomerCircleDetail,getStIcCircleDetail,getSxIcCircleDetail,
  getStIcConsumeDetail,getSxIcConsumeDetail,getStIcConsumeByTimesDetail,getStIcCircleByTimesDetail,setStIcConsumeLimit,
  getStIcConsumeLimitDetail,getStCustomerConsumeByTimesDetail,getSxIcConsumeLimitDetail,lePeiOperate,getSxMoney,getStMoney,
  setSxIcConsumeLimit,getStIcBalance,yksCustomerRechargeDetail,yksCustomerConsumeDetail,yksCustomerCircleDetail,yksIcCircleDetail,
  yksIcConsumeDetail,getYksIcMoney,getYksCustomerMoney, getParentsCardList, importParentsCard, openParentsCard, getParentsCard, getParentsCardData,operateParentsCard,
  getConsumeList
}  from 'services/index';
export default {

    namespace: 'card',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getPersonCard({ payload,callback }, { call, put }) {  // 获取人员开卡列表
        let res=yield call(getPersonCard,payload)
        // if(res&&res.code&&res.code===200){
        //   yield put({ type: 'save',payload:res.data });
        // }
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * openPersonCard({ payload,callback }, { call, put }) {  // 开卡
        let res=yield call(openPersonCard,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * uploadPersonCard({ payload,callback }, { call, put }) {  // 批量开卡
        let res=yield call(uploadPersonCard,payload)
        if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      // 卡片管理
      * getPeopleCard({ payload,callback }, { call, put }) {  // 获取个人信息
        let res=yield call(getPeopleCard,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getCardData({ payload,callback }, { call, put }) {  // 获取个人卡片信息
        let res=yield call(getCardData,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getStRechargeDetail({ payload,callback }, { call, put }) {  // 获取商通客户充值明细
        let res=yield call(getStRechargeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveStRecharge',payload:res.data });
        }
      },
      * getSxRechargeDetail({ payload,callback }, { call, put }) {  // 获取松涬客户充值明细
        let res=yield call(getSxRechargeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSxRecharge',payload:res.data });
        }
      },
      * getStCustomerConsumeDetail({ payload,callback }, { call, put }) {  // 获取商通客户金额消费明细
        let res=yield call(getStCustomerConsumeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveStCustomerConsume',payload:res.data });
        }
      },
      * getStCustomerConsumeByTimesDetail({ payload,callback }, { call, put }) {  // 获取商通客户计次消费明细
        let res=yield call(getStCustomerConsumeByTimesDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveStCustomerConsume',payload:res.data });
        }
      },
      
      * getSxCustomerConsumeDetail({ payload,callback }, { call, put }) {  // 获取松涬客户消费明细
        let res=yield call(getSxCustomerConsumeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSxCustomerConsume',payload:res.data });
        }
      },
      * getCustomerCircleDetail({ payload,callback }, { call, put }) {  // 获取松涬客户圈存明细
        let res=yield call(getCustomerCircleDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveCustomerCircle',payload:res.data });
        }
      },
      * getStIcCircleDetail({ payload,callback }, { call, put }) {  // 获取商通IC卡金额圈存明细
        let res=yield call(getStIcCircleDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveStIcCircle',payload:res.data });
        }
      },
      * getStIcCircleByTimesDetail({ payload,callback }, { call, put }) {  // 获取商通IC卡计次圈存明细
        let res=yield call(getStIcCircleByTimesDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveStIcCircle',payload:res.data });
        }
      },
      * getSxIcCircleDetail({ payload,callback }, { call, put }) {  // 获取松涬IC卡圈存明细
        let res=yield call(getSxIcCircleDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSxIcCircle',payload:res.data });
        }
      },
      * getStIcConsumeDetail({ payload,callback }, { call, put }) {  // 获取商通IC卡金额消费明细
        let res=yield call(getStIcConsumeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveStIcConsume',payload:res.data });
        }
      },
      * getStIcConsumeByTimesDetail({ payload,callback }, { call, put }) {  // 获取商通IC卡计次消费明细
        let res=yield call(getStIcConsumeByTimesDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveStIcConsume',payload:res.data });
        }
      },
      * getSxIcConsumeDetail({ payload,callback }, { call, put }) {  // 获取松涬IC卡消费明细
        let res=yield call(getSxIcConsumeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveSxIcConsume',payload:res.data });
        }
      },
      * setStIcConsumeLimit({ payload,callback }, { call, put }) {  // 商通IC卡限额设置
        let res=yield call(setStIcConsumeLimit,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getStIcConsumeLimitDetail({ payload,callback }, { call, put }) {  // 商通IC卡限额详情
        let res=yield call(getStIcConsumeLimitDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveStIcConsumeLimit',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * getSxIcConsumeLimitDetail({ payload,callback }, { call, put }) {  // 松涬IC卡限额详情
        let res=yield call(getSxIcConsumeLimitDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveStIcConsumeLimit',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * setSxIcConsumeLimit({ payload,callback }, { call, put }) {  // 松涬IC卡限额设置
        let res=yield call(setSxIcConsumeLimit,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * lePeiOperate({ payload,callback }, { call, put }) {  //乐陪卡操作
        let res=yield call(lePeiOperate,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getSxMoney({ payload,callback }, { call, put }) {  //查询松涬余额
        let res=yield call(getSxMoney,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getStMoney({ payload,callback }, { call, put }) {  //查询商通余额
        let res=yield call(getStMoney,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getStIcBalance({ payload,callback }, { call, put }) {  //获取商通卡片余额
        let res=yield call(getStIcBalance,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * yksCustomerConsumeDetail({ payload,callback }, { call, put }) {  // 获取易科士个人消费记录明细
        let res=yield call(yksCustomerConsumeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveYksCustomerConsume',payload:res.data });
        }
      },
      * yksCustomerRechargeDetail({ payload,callback }, { call, put }) {  // 获取易科士个人充值记录明细
        let res=yield call(yksCustomerRechargeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveYksCustomerRecharge',payload:res.data });
        }
      },
      * yksCustomerCircleDetail({ payload,callback }, { call, put }) {  // 获取易科士个人圈存记录明细
        let res=yield call(yksCustomerCircleDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveYksCustomerCircle',payload:res.data });
        }
      },
      * yksIcCircleDetail({ payload,callback }, { call, put }) {  // 获取易科士卡片圈存记录明细
        let res=yield call(yksIcCircleDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveYksIcCircle',payload:res.data });
        }
      },
      * yksIcConsumeDetail({ payload,callback }, { call, put }) {  // 获取易科士卡片消费记录明细
        let res=yield call(yksIcConsumeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveYksIcConsume',payload:res.data });
        }
      },
      * getYksIcMoney({ payload,callback }, { call, put }) {  //查询易科士卡片圈存余额
        let res=yield call(getYksIcMoney,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getYksCustomerMoney({ payload,callback }, { call, put }) {  //查询易科士个人圈存余额
        let res=yield call(getYksCustomerMoney,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getParentsCardList({ payload,callback }, { call, put }) {  //家长开卡人员列表
        let res=yield call(getParentsCardList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importParentsCard({ payload,callback }, { call, put }) {  //家长开卡管理-批量开卡
        let res=yield call(importParentsCard,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * openParentsCard({ payload,callback }, { call, put }) {  //家长开卡管理-开卡
        let res=yield call(openParentsCard,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getParentsCard({ payload,callback }, { call, put }) {  //家长卡片管理-查询
        let res=yield call(getParentsCard,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getParentsCardData({ payload,callback }, { call, put }) {  //家长卡片管理-卡片信息
        let res=yield call(getParentsCardData,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * operateParentsCard({ payload,callback }, { call, put }) {  //家长卡片管理-卡片操作
        let res=yield call(operateParentsCard,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getConsumeList({ payload,callback }, { call, put }) {  //天四消费概况列表
        let res=yield call(getConsumeList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },


    },
  
    reducers: {
      saveStRecharge(state, action) {
        return { ...state, stRechargeDetail:{...action.payload} };
      },
      saveSxRecharge(state, action) {
        return { ...state, sxRechargeDetail:{...action.payload} };
      },
      saveStCustomerConsume(state, action) {
        return { ...state, stCustomerConsumeDetail:{...action.payload} };
      },
      saveSxCustomerConsume(state, action) {
        return { ...state, sxCustomerConsumeDetail:{...action.payload} };
      },
      saveCustomerCircle(state, action) {
        return { ...state, customerCircleDetail:{...action.payload} };
      },
      saveStIcCircle(state, action) {
        return { ...state, stIcCircleDetail:{...action.payload} };
      },
      saveSxIcCircle(state, action) {
        return { ...state, sxIcCircleDetail:{...action.payload} };
      },
      saveStIcConsume(state, action) {
        return { ...state, stIcConsumeDetail:{...action.payload} };
      },
      saveSxIcConsume(state, action) {
        return { ...state, sxIcConsumeDetail:{...action.payload} };
      },
      saveStIcConsumeLimit(state, action) {
        return { ...state, stIcConsumeLimitDetail:{...action.payload} };
      },
      saveYksCustomerConsume(state, action) {
        return { ...state, yksCustomerConsumeDetail:{...action.payload} };
      },
      saveYksCustomerRecharge(state, action) {
        return { ...state, yksCustomerRechargeDetail:{...action.payload} };
      },
      saveYksCustomerCircle(state, action) {
        return { ...state, yksCustomerCircleDetail:{...action.payload} };
      },
      saveYksIcCircle(state, action) {
        return { ...state, yksIcCircleDetail:{...action.payload} };
      },
      saveYksIcConsume(state, action) {
        return { ...state, yksIcConsumeDetail:{...action.payload} };
      },
    },
  
  };
  