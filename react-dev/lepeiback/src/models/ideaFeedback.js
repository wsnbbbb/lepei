
import  { getFeedbackList, delFeedback, getFeedbackDetail, suggestionReply, getOpinionType,opinionTypeDetail,getAllTeachers,addOpinionType,editOpinionType,delOpinionType }  from 'services/index';
export default {
    namespace: 'ideaFeedback',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
      * getFeedbackList({ payload,callback }, { call, put }) {  // 获取意见反馈列表
        let res=yield call(getFeedbackList,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * delFeedback({ payload,callback }, { call, put }) {  // 删除
        let res=yield call(delFeedback,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getFeedbackDetail({ payload,callback }, { call, put }) {  // 意见反馈详情
        let res=yield call(getFeedbackDetail,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * suggestionReply({ payload,callback }, { call, put }) {  // 意见回复
        let res=yield call(suggestionReply,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getOpinionType({ payload,callback }, { call, put }) {  // 意见类型管理
        let res=yield call(getOpinionType,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * opinionTypeDetail({ payload,callback }, { call, put }) {  // 获取类型详情
        let res=yield call(opinionTypeDetail,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getAllTeachers({ payload,callback }, { call, put }) {  // 获取所有教师
        let res=yield call(getAllTeachers,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * addOpinionType({ payload,callback }, { call, put }) {  // 添加意见类型
        let res=yield call(addOpinionType,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * editOpinionType({ payload,callback }, { call, put }) {  // 编辑意见类型
        let res=yield call(editOpinionType,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * delOpinionType({ payload,callback }, { call, put }) {  // 删除意见类型
        let res=yield call(delOpinionType,payload)
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
  