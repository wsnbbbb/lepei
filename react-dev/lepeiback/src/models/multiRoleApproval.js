
import  {approvalRuleList, delRoleApproval, addApproval, getApprovalDetail, editApproval }  from 'services/index';
export default {

    namespace: 'multiRoleApproval',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
      * approvalRuleList({ payload,callback }, { call, put }) {  // 获取多角色审批流列表
        let res=yield call(approvalRuleList,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * delRoleApproval({ payload,callback }, { call, put }) {  // 多角色审批流删除
        let res=yield call(delRoleApproval,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * addApproval({ payload,callback }, { call, put }) {  // 多角色审批添加
        let res=yield call(addApproval,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getApprovalDetail({ payload,callback }, { call, put }) {  // 多角色审批详情获取
        let res=yield call(getApprovalDetail,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * editApproval({ payload,callback }, { call, put }) {  // 多角色审批修改
        let res=yield call(editApproval,payload)
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
  