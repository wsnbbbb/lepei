
import  { getDstmList, delDstm, getDstmHandler, commonPersonList, saveDstmHandler, dstmTypes, addDstm, getAllPubStudents,
  dstmRoles, saveDstmRoles, getDstmDetail, dstmActivityFile, dstmTypesList, saveDstmTypes, unfileDstmActivity, dstmActivityComment,
  deldstmComment, getApplyDetail, modifyDstmActivity
}  from 'services/index';
export default {

    namespace: 'dstm',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getDstmList({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getDstmList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
      * delete({ payload,callback }, { call, put }) {
        let res=yield call(delDstm,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getDstmHandler({ payload,callback }, { call, put }) {
        let res=yield call(getDstmHandler,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * saveDstmHandler({ payload,callback }, { call, put }) {
        let res=yield call(saveDstmHandler,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * dstmTypes({ payload,callback }, { call, put }) {
        let res=yield call(dstmTypes,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * addDstm({ payload,callback }, { call, put }) {
        let res=yield call(addDstm,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getAllPubStudents({ payload,callback }, { call, put }) {
        let res=yield call(getAllPubStudents,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * dstmRoles({ payload,callback }, { call, put }) {
        let res=yield call(dstmRoles,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * saveDstmRoles({ payload,callback }, { call, put }) {
        let res=yield call(saveDstmRoles,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getDstmDetail({ payload,callback }, { call, put }) {
        let res=yield call(getDstmDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * dstmActivityFile({ payload,callback }, { call, put }) {
        let res=yield call(dstmActivityFile,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * commonPersonList({ payload,callback }, { call, put }) {
        let res=yield call(commonPersonList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * dstmTypesList({ payload,callback }, { call, put }) {
        let res=yield call(dstmTypesList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
           
      * saveDstmTypes({ payload,callback }, { call, put }) {
        let res=yield call(saveDstmTypes,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * unfileDstmActivity({ payload,callback }, { call, put }) {
        let res=yield call(unfileDstmActivity,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * dstmActivityComment({ payload,callback }, { call, put }) {
        let res=yield call(dstmActivityComment,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deldstmComment({ payload,callback }, { call, put }) {
        let res=yield call(deldstmComment,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getApplyDetail({ payload,callback }, { call, put }) {
        let res=yield call(getApplyDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * modifyDstmActivity({ payload,callback }, { call, put }) {
        let res=yield call(modifyDstmActivity,payload)
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
  