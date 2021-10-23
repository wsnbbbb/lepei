
import  {canteenMenuDetail,getMaterialList,getMaterialDetail,createMaterial, deleteMaterial,
  getLabels, updateLabels, getLabelsByPid, getStudentMaterials, updateStudentMaterials}  from 'services/index';
export default {

    namespace: 'material',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getMaterialList({ payload ,callback}, { call, put }) {  //
        let res=yield call(getMaterialList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getMaterialDetail({ payload ,callback}, { call, put }) {  //
        let res=yield call(getMaterialDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * canteenMenuDetail({ payload,callback }, { call, put }) {  // 获取食堂菜谱详情
        let res=yield call(canteenMenuDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * createMaterial({ payload ,callback}, { call, put }) {  //
        let res=yield call(createMaterial,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * deleteMaterial({ payload ,callback}, { call, put }) {  //
        let res=yield call(deleteMaterial,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getLabels({ payload ,callback}, { call, put }) {  //
        let res=yield call(getLabels,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateLabels({ payload ,callback}, { call, put }) {  //
        let res=yield call(updateLabels,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getLabelsByPid({ payload ,callback}, { call, put }) {  //
        let res=yield call(getLabelsByPid,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getStudentMaterials({ payload ,callback}, { call, put }) {  //
        let res=yield call(getStudentMaterials,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateStudentMaterials({ payload ,callback}, { call, put }) {  //
        let res=yield call(updateStudentMaterials,payload)
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
  