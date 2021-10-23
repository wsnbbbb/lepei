
import  { cardlist, getBranchList, addAchievementTemplate, deleteAchievementTemplate, getAchievementTemplateList,
  getAchievementTemplateDetail, getBranchPersons, addBranch, updateBranch, deleteBranch, getBranchDetail, getBranchRelation,
  importBranchRelation, getAchievementTemplate, modifyMoney, getBranchRelation1, cancelPublish, publishTemplate}  from 'services/index';
export default {

    namespace: 'performance',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getAchievementTemplateList({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(getAchievementTemplateList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
      * getBranchList({ payload,callback }, { call, put }) {  
        let res=yield call(getBranchList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * addAchievementTemplate({ payload,callback }, { call, put }) {
        let res=yield call(addAchievementTemplate, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * deleteTemplate({ payload,callback }, { call, put }) {
        let res=yield call(deleteAchievementTemplate, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getAchievementTemplateDetail({ payload,callback }, { call, put }) {
        let res=yield call(getAchievementTemplateDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getBranchPersons({ payload,callback }, { call, put }) {
        let res=yield call(getBranchPersons, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * addBranch({ payload,callback }, { call, put }) {
        let res=yield call(addBranch, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deleteBranch({ payload,callback }, { call, put }) {
        let res=yield call(deleteBranch, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * updateBranch({ payload,callback }, { call, put }) {
        let res=yield call(updateBranch, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getBranchDetail({ payload,callback }, { call, put }) {
        let res=yield call(getBranchDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getBranchRelation({ payload,callback }, { call, put }) {
        let res=yield call(getBranchRelation, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
    
      * importBranchRelation({ payload,callback }, { call, put }) {
        let res=yield call(importBranchRelation, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getAchievementTemplate({ payload,callback }, { call, put }) {
        let res=yield call(getAchievementTemplate, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * modifyMoney({ payload,callback }, { call, put }) {
        let res=yield call(modifyMoney, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
    
      * getBranchRelation1({ payload,callback }, { call, put }) {
        let res=yield call(getBranchRelation1, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
    
      * cancelPublish({ payload,callback }, { call, put }) {
        let res=yield call(cancelPublish, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
    
      * publishTemplate({ payload,callback }, { call, put }) {
        let res=yield call(publishTemplate, payload)
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
  