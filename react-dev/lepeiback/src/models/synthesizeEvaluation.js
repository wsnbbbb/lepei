
import  {getMessageList, importMessage, sendWord, teacherMsgDetail,delTeacherMsg, getSubjects, getSubjectScore, importScore, getScore,evaTemplateDetail,
  editScore, getReportList, allTemplate, allTopQuotas, importReport, delFile, allReport, progressList, remind, qualityTemplate, addTemplate, templateEdit,
  delTemplate,switchStatus, scoreLevelList, saveLevels, showTemplateList, templateQuotas, addTemplateQuotas, getRater, addEvaPoint,pointsList, delEvaPoint,
  delTarget, uploadTargetIcon,editTarget, editRater, changeRater}  from 'services/index';
export default {

    namespace: 'synthesizeEvaluation',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
      * getMessageList({ payload, callback }, { call, put }) {  //获取学期寄语列表
        let res=yield call(getMessageList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importMessage({ payload, callback }, { call, put }) {  // 导入寄语
        let res=yield call(importMessage, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * sendWord({ payload, callback }, { call, put }) {  // 教师寄语提交
        let res=yield call(sendWord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * teacherMsgDetail({ payload, callback }, { call, put }) {  // 教师寄语提交
        let res=yield call(teacherMsgDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delTeacherMsg({ payload, callback }, { call, put }) {  // 删除评论
        let res=yield call(delTeacherMsg, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getSubjects({ payload, callback }, { call, put }) {  // 获取科目
        let res=yield call(getSubjects, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getSubjectScore({ payload, callback }, { call, put }) {  // 获取分数列表
        let res=yield call(getSubjectScore, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importScore({ payload, callback }, { call, put }) {  // 导入成绩
        let res=yield call(importScore, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getScore({ payload, callback }, { call, put }) {  // 个人成绩详情
        let res=yield call(getScore, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editScore({ payload, callback }, { call, put }) {  // 分数修改
        let res=yield call(editScore, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getReportList({ payload, callback }, { call, put }) {  // 学生报告列表
        let res=yield call(getReportList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * allTemplate({ payload, callback }, { call, put }) {  // 获取所有模板
        let res=yield call(allTemplate, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * allTopQuotas({ payload, callback }, { call, put }) {  // 获取所有顶级指标
        let res=yield call(allTopQuotas, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importReport({ payload, callback }, { call, put }) {  // 报告导入
        let res=yield call(importReport, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delFile({ payload, callback }, { call, put }) {  // 删除文档
        let res=yield call(delFile, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * allReport({ payload, callback }, { call, put }) {  // 报告列表
        let res=yield call(allReport, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * progressList({ payload, callback }, { call, put }) {  // 素质评价进度
        let res=yield call(progressList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * remind({ payload, callback }, { call, put }) {  // 一键提醒
        let res=yield call(remind, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * qualityTemplate({ payload, callback }, { call, put }) {  // 评价模板
        let res=yield call(qualityTemplate, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addTemplate({ payload, callback }, { call, put }) {  // 添加模板
        let res=yield call(addTemplate, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * evaTemplateDetail({ payload, callback }, { call, put }) {  // 模板详情
        let res=yield call(evaTemplateDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * templateEdit({ payload, callback }, { call, put }) {  // 模板编辑
        let res=yield call(templateEdit, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delTemplate({ payload, callback }, { call, put }) {  // 删除评价模板
        let res=yield call(delTemplate, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * switchStatus({ payload, callback }, { call, put }) {  // 开关状态修改
        let res=yield call(switchStatus, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * scoreLevelList({ payload, callback }, { call, put }) {  // 分数等级列表
        let res=yield call(scoreLevelList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * saveLevels({ payload, callback }, { call, put }) {  // 等级设置
        let res=yield call(saveLevels, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * showTemplateList({ payload, callback }, { call, put }) {  // 模板管理列表
        let res=yield call(showTemplateList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * templateQuotas({ payload, callback }, { call, put }) {  // 获取指标
        let res=yield call(templateQuotas, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addTemplateQuotas({ payload, callback }, { call, put }) {  // 添加指标
        let res=yield call(addTemplateQuotas, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getRater({ payload, callback }, { call, put }) {  // 获取评价人
        let res=yield call(getRater, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addEvaPoint({ payload, callback }, { call, put }) {  // 添加要点
        let res=yield call(addEvaPoint, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * pointsList({ payload, callback }, { call, put }) {  // 获取要点列表
        let res=yield call(pointsList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delEvaPoint({ payload, callback }, { call, put }) {  // 删除要点
        let res=yield call(delEvaPoint, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delTarget({ payload, callback }, { call, put }) {  // 删除指标
        let res=yield call(delTarget, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * uploadTargetIcon({ payload, callback }, { call, put }) {  // 删除指标
        let res=yield call(uploadTargetIcon, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editTarget({ payload, callback }, { call, put }) {  // 修改指标/要点
        let res=yield call(editTarget, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editRater({ payload, callback }, { call, put }) {  // 修改评价人-获取
        let res=yield call(editRater, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * changeRater({ payload, callback }, { call, put }) {  // 修改评价人
        let res=yield call(changeRater, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
                     
      
      
      
     



    },
  
    reducers: {
      save(state,action){
        return{...state,...action.payload}
      }
      
     
     
    },
  
  }