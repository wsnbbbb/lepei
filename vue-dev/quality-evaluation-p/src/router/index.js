import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/pages/Index'
import login from '@/pages/login'
import save from '@/pages/save'
import draw from '@/pages/draw'
import query from '@/pages/query'
import qualityEvaluation from '@/pages/quality-evaluation'
import selfEvaluation from '@/pages/self-evaluation'
import selfEvaluationFilter from '@/pages/self-evaluation-filter'
import parentsWord from '@/pages/parents-word'
import teacherWord from '@/pages/teacher-word'
import evaluationReport from '@/pages/evaluation-report'
import selfEvaluationDetail from '@/pages/self-evaluation-detail'
import qualityEvaluationFilter from '@/pages/quality-evaluation-filter'
import rateSubmit from '@/pages/rateSubmit'
import rateShow from '@/pages/rateShow'
import parentsWordFilter from '@/pages/parents-word-filter'
import teacherWordFilter from '@/pages/teacher-word-filter'
import parentsWordDetail from '@/pages/parents-word-detail'
import teacherWordDetail from '@/pages/teacher-word-detail'
import qualityReportFilter from '@/pages/quality-report-filter'
import evaluationReportParent from '@/pages/evaluation-report-parent'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/index',
      name: 'index',
      component: Index
    }, {
      path: '/login',
      name: 'login',
      component: login
    }, {
      path: '/index/save',
      name: 'save',
      component: save
    }, {
      path: '/index/draw',
      name: 'draw',
      component: draw
    }, {
      path: '/index/query',
      name: 'query',
      component: query
    }, {
      path: '/quality-evaluation',
      name: 'qualityEvaluation',
      component: qualityEvaluation
    }, {
      path: '/self-evaluation',
      name: 'selfEvaluation',
      component: selfEvaluation
    }, {
      path: '/self-evaluation-filter',
      name: 'selfEvaluationFilter',
      component: selfEvaluationFilter
    },


    {
      path: '/parents-word',
      name: 'parentsWord',
      component: parentsWord
    }, {
      path: '/teacher-word',
      name: 'teacherWord',
      component: teacherWord
    }, {
      path: '/evaluation-report',
      name: 'evaluationReport',
      component: evaluationReport
    }, {
      path: '/self-evaluation-detail',
      name: 'selfEvaluationDetail',
      component: selfEvaluationDetail
    }, {
      path: '/quality-evaluation-filter',
      name: 'qualityEvaluationFilter',
      component: qualityEvaluationFilter
    }, {
      path: '/rateSubmit',
      name: 'rateSubmit',
      component: rateSubmit
    }, {
      path: '/parents-word-filter',
      name: 'parentsWordFilter',
      component: parentsWordFilter
    }, {
      path: '/teacher-word-filter',
      name: 'teacherWordFilter',
      component: teacherWordFilter
    }, {
      path: '/parents-word-detail',
      name: 'parentsWordDetail',
      component: parentsWordDetail
    }, {
      path: '/teacher-word-detail',
      name: 'teacherWordDetail',
      component: teacherWordDetail
    }, {
      path: '/quality-report-filter',
      name: 'qualityReportFilter',
      component: qualityReportFilter
    }, {
      path: '/evaluation-report-parent',
      name: 'evaluationReportParent',
      component: evaluationReportParent
    }, {
      path: '/rateShow',
      name: 'rateShow',
      component: rateShow
    },
  ]
})