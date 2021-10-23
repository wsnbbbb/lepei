
import  {getEvaluationList, getEvaluationTemplate,getTemplateDetail, addEvaluation, editEvaluation, delEvaluation,getTemplateList, addEvaTemplate, editEvaTemplate,
  delEvaTemplate, getStatisticList, getDetailList, templateManage,getQuotasList,addIndexs,addPoints,delIndexs, getPoints,delPoints,editPoint}  from 'services/index';
export default {

    namespace: 'teacherEvaluation',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getEvaluationList({ payload,callback }, { call, put }) {  // 获取评课模板列表
        let res=yield call(getEvaluationList,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getEvaluationTemplate({ payload,callback }, { call, put }) {  // 获取所有评课模板
        let res=yield call(getEvaluationTemplate,payload)
          if(callback && typeof callback === 'function'){
            callback(res)
        }
      },
      * getTemplateDetail({ payload,callback }, { call, put }) {  // 获取评课管理详情
        let res=yield call(getTemplateDetail,payload)
          // yield put({ type: 'saveTemplateDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        
      },
      * addEvaluation({ payload,callback }, { call, put }) {  // 新建评课
        let res=yield call(addEvaluation,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * editEvaluation({ payload,callback }, { call, put }) {  // 编辑评课
        let res=yield call(editEvaluation,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * delEvaluation({ payload,callback }, { call, put }) {  // 删除评课
        let res=yield call(delEvaluation,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getTemplateList({ payload,callback }, { call, put }) {  // 评课模板列表
        let res=yield call(getTemplateList,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * addEvaTemplate({ payload,callback }, { call, put }) {  // 新建评课模板
        let res=yield call(addEvaTemplate,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * editEvaTemplate({ payload,callback }, { call, put }) {  // 编辑评课模板
        let res=yield call(editEvaTemplate,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * delEvaTemplate({ payload,callback }, { call, put }) {  // 删除评课模板
        let res=yield call(delEvaTemplate,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * templateManage({ payload,callback }, { call, put }) {  // 模板管理
        let res=yield call(templateManage,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getQuotasList({ payload,callback }, { call, put }) {  // 获取指标列表
        let res=yield call(getQuotasList,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * addIndexs({ payload,callback }, { call, put }) {  // 添加指标
        let res=yield call(addIndexs,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * addPoints({ payload,callback }, { call, put }) {  // 添加要点
        let res=yield call(addPoints,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * delIndexs({ payload,callback }, { call, put }) {  // 删除指标
        let res=yield call(delIndexs,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getPoints({ payload,callback }, { call, put }) {  // 获取要点列表
        let res=yield call(getPoints,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * delPoints({ payload,callback }, { call, put }) {  // 获取要点
        let res=yield call(delPoints,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * editPoint({ payload,callback }, { call, put }) {  // 修改要点
        let res=yield call(editPoint,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getStatisticList({ payload,callback }, { call, put }) {  // 获取评课统计列表
        let res=yield call(getStatisticList,payload)
        if(callback && typeof callback === 'function'){ 
          callback(res)
        }
      },
      * getDetailList({ payload,callback }, { call, put }) {  // 获取评课统计详情列表
        let res=yield call(getDetailList,payload)
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
  