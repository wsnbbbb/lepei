
import  {getRepairList,addRepairType,getRepairTypeList,delRepairType,editRepairType,getRepairTypeDetail,getAllRepairTypes,
  getRepairApplyDetail,delRepairApply,getRepairBarData,getRepairPieData,getRepairApplicant,getRepairAddress
}  from 'services/index';
export default {

    namespace: 'repair',
  
    state: {
      //   current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getRepairList({ payload }, { call, put }) {  // 获取报事报修列表
        let res=yield call(getRepairList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * addRepairType({ payload,callback }, { call, put }) {  // 添加报事报修类型
        let res=yield call(addRepairType,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editRepairType({ payload,callback }, { call, put }) {  // 编辑报事报修类型
        let res=yield call(editRepairType,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delRepairType({ payload,callback }, { call, put }) {  // 删除报事报修类型
        let res=yield call(delRepairType,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delRepairApply({ payload,callback }, { call, put }) {  // 删除报事报修申请
        let res=yield call(delRepairApply,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getRepairTypeList({ payload,callback }, { call, put }) {  //获取报事报修类型列表
        let res=yield call(getRepairTypeList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveType',payload:res.data });
        }
      },
      * getAllRepairTypes({ payload,callback }, { call, put }) {  //获取所有报事报修类型
        let res=yield call(getAllRepairTypes,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveAllTypes',payload:res.data });
        }
      },
      * getRepairTypeDetail({ payload,callback }, { call, put }) {  //获取报事报修类型详情
        let res=yield call(getRepairTypeDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getRepairApplyDetail({ payload,callback }, { call, put }) {  //获取报事报修申请详情
        let res=yield call(getRepairApplyDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveApplyDetail',payload:res.data });
        }
      },
      * getRepairBarData({ payload,callback }, { call, put }) {  //获取报事报修事件数柱状图
        let res=yield call(getRepairBarData,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getRepairPieData({ payload,callback }, { call, put }) {  //获取报事报修类型占比饼状图
        let res=yield call(getRepairPieData,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getRepairApplicant({ payload,callback }, { call, put }) {  //获取报事报修申请统计
        let res=yield call(getRepairApplicant,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveApplicant',payload:res.data });
        }
      },
      * getRepairAddress({ payload,callback }, { call, put }) {  //获取报事报修地点统计
        let res=yield call(getRepairAddress,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveAddress',payload:res.data });
        }
      },
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveType(state, action) {
        return { ...state, typeList:{...action.payload} };
      },
      saveAllTypes(state, action) {
        return { ...state, allTypes:[...action.payload] };
      },
      saveApplicant(state, action) {
        return { ...state, applicantDatas:{...action.payload} };
      },
      saveAddress(state, action) {
        return { ...state, addressDatas:{...action.payload} };
      },
      saveApplyDetail(state, action) {
        return { ...state, applyDetail:{...action.payload} };
      },
    },
  
  };
  