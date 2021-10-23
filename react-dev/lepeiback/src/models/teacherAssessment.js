

import  { assessmentList, delAssessConfig, getAssessDetail, addAssessConfig, updateAssessConfig, assessmentQuotas, addAssessTarget, delAssessTarget, updateAssessTarget,
  getFirstTargetScore,saveFirstTargetScore,getSecondTargetScore, saveSecondTargetScore, assessmentRecords, delAssessRecord, getAssessmentRecordDetail, assessmentRecordsApprove,
  assessmentRecordsReject, getAssessmentItemList, getAssessmentScoreDetail, getMaterial, departmentTree}  from 'services/index';
export default {

    namespace: 'teacherAssessment',
  
    state: { 
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * assessmentList({ payload,callback }, { call, put }) {  // 列表
        let res=yield call(assessmentList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delAssessConfig({ payload,callback }, { call, put }) {  // 删除
        let res=yield call(delAssessConfig,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * assessmentRecords({ payload,callback }, { call, put }) {
        let res=yield call(assessmentRecords,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAssessDetail({ payload,callback }, { call, put }) {  // 获取详情
        let res=yield call(getAssessDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delAssessRecord({ payload,callback }, { call, put }) {
        let res=yield call(delAssessRecord,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addAssessConfig({ payload,callback }, { call, put }) {  // 添加考核配置
        let res=yield call(addAssessConfig,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAssessmentRecordDetail({ payload,callback }, { call, put }) {
        let res=yield call(getAssessmentRecordDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateAssessConfig({ payload,callback }, { call, put }) {  // 修改考核配置
        let res=yield call(updateAssessConfig,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * assessmentRecordsApprove({ payload,callback }, { call, put }) {
        let res=yield call(assessmentRecordsApprove,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * assessmentQuotas({ payload,callback }, { call, put }) {  // 获取指标配置
        let res=yield call(assessmentQuotas,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * assessmentRecordsReject({ payload,callback }, { call, put }) {
        let res=yield call(assessmentRecordsReject,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addAssessTarget({ payload,callback }, { call, put }) {  // 新增指标
        let res=yield call(addAssessTarget,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getAssessmentItemList({ payload,callback }, { call, put }) {
        let res=yield call(getAssessmentItemList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delAssessTarget({ payload,callback }, { call, put }) {  // 删除指标
        let res=yield call(delAssessTarget,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getAssessmentScoreDetail({ payload,callback }, { call, put }) {
        let res=yield call(getAssessmentScoreDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateAssessTarget({ payload,callback }, { call, put }) {  // 修改指标
        let res=yield call(updateAssessTarget,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getMaterial({ payload,callback }, { call, put }) {
        let res=yield call(getMaterial, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getFirstTargetScore({ payload,callback }, { call, put }) {  // 获取一级指标分值
        let res=yield call(getFirstTargetScore,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * saveFirstTargetScore({ payload,callback }, { call, put }) {  // 保存一级指标分值
        let res=yield call(saveFirstTargetScore,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getSecondTargetScore({ payload,callback }, { call, put }) {  // 获取二级指标分值
        let res=yield call(getSecondTargetScore,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * saveSecondTargetScore({ payload,callback }, { call, put }) {  // 保存二级指标分值
        let res=yield call(saveSecondTargetScore,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * departmentTree({ payload,callback }, { call, put }) {  // 保存二级指标分值
        let res=yield call(departmentTree,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
    
    },
  
    reducers: {

    }
  
  };
  