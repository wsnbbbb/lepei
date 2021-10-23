import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 全局的布局容器 */
import Layout from '@/layout'

export const constantRoutes = [
  { // 进入首页开启  欢迎页
    path: '/',
    component: Layout,
    redirect: '/welcome',
    hidden: true,
    children: [{
      path: 'welcome',
      name: 'Welcome',
      component: () => import('@/views/welcome/index')
    }]
  },
  { // 模式管理
    path: '/model-management',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ModelManagement',
    meta: { title: '模式管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'standard-mode',
        name: 'StandardMode',
        component: () => import('@/views/modelManagement/standardMode/index'),
        meta: { title: '标准模式', icon: 'el-icon-time' }
      },
      {
        path: 'exam-mode',
        name: 'ExamMode',
        component: () => import('@/views/modelManagement/examMode/father'),
        redirect: '/model-management/exam-mode/exam-mode-home',
        meta: { title: '考试模式', icon: 'el-icon-s-promotion' },
        children: [
          {
            path: 'exam-mode-home',
            name: 'ExamModeHome',
            component: () => import('@/views/modelManagement/examMode/index'),
            meta: { title: '考试模式', breadcrumb: false, keepAlive: true }
          },
          {
            path: 'subject-manage/:id',
            name: 'SubjectManage',
            hidden: true,
            component: () => import('@/views/modelManagement/examMode/subjectManage.vue'),
            meta: { title: '考试科目管理', keepAlive: true },
            children: [
              {
                path: 'classroom-list',
                name: 'ClassroomList',
                hidden: true,
                component: () => import('@/views/modelManagement/examMode/classroomList.vue'),
                meta: { title: '教室信息查询' }
              },
              {
                path: 'examinees-info',
                name: 'ExamineesInfo',
                hidden: true,
                component: () => import('@/views/modelManagement/examMode/examineesInfo.vue'),
                meta: { title: '考生信息' }
              }
            ]
          }
        ]
      },
      {
        path: 'urgency-mode',
        name: 'UrgencyMode',
        component: () => import('@/views/modelManagement/examMode/father'),
        redirect: '/model-management/urgency-mode/urgency-mode-home',
        meta: { title: '紧急模式', icon: 'el-icon-message-solid' },
        children: [
          {
            path: 'urgency-mode-home',
            name: 'UrgencyModeHome',
            component: () => import('@/views/modelManagement/urgencyMode/index'),
            meta: { title: '紧急模式', breadcrumb: false, keepAlive: true }
          },
          {
            path: 'urgency-mode-detail/:id',
            name: 'UrgencyDetail',
            hidden: true,
            component: () => import('@/views/modelManagement/urgencyMode/urgencyDetail.vue'),
            meta: { title: '编辑' }
          },
          {
            path: 'urgency-mode-detail',
            name: 'UrgencyDetail',
            hidden: true,
            component: () => import('@/views/modelManagement/urgencyMode/urgencyDetail.vue'),
            meta: { title: '添加' }
          }
        ]
      }
    ]
  },
  { // 导航管理
    path: '/nav-management',
    component: Layout,
    redirect: '/nav-management/nav-manage',
    meta: { title: '导航管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'nav-manage',
        name: 'NavManage',
        component: () => import('@/views/navManagement/index.vue'),
        meta: { title: '导航管理', icon: 'table', breadcrumb: false, keepAlive: true }
      },
      // 导航管理详情
      {
        path: 'nav-detail/:code',
        name: 'NavDetail',
        hidden: true,
        component: () => import('@/views/navManagement/detail.vue'),
        meta: { title: '导航管理编辑' }
      },
      {
        path: 'nav-detail',
        name: 'NavDetail',
        hidden: true,
        component: () => import('@/views/navManagement/detail.vue'),
        meta: { title: '导航管理添加' }
      }
    ]
  },
  { // 班牌管理
    path: '/ban-card-management',
    component: Layout,
    redirect: '/ban-card-management/banCard-manage',
    meta: { title: '班牌管理', icon: 'el-icon-s-platform' },
    children: [
      {
        path: 'banCard-manage',
        name: 'BanCardManage',
        component: () => import('@/views/bancardManagement/index.vue'),
        meta: { title: '班牌管理', icon: 'el-icon-s-platform', breadcrumb: false, keepAlive: true }
      },
      // 批量设置
      {
        path: 'batch-set',
        name: 'BatchSet',
        hidden: true,
        component: () => import('@/views/bancardManagement/batchSet.vue'),
        meta: { title: '批量设置' }
      },
      // 单个设置
      {
        path: 'batch-set/:id',
        name: 'BatchSet',
        hidden: true,
        component: () => import('@/views/bancardManagement/batchSet.vue'),
        meta: { title: '设置' }
      }
    ]
  },
  { // 数据同步
    path: '/data-sync-manage',
    component: Layout,
    redirect: '/data-sync-manage/data-sync',
    meta: { title: '数据同步', icon: 'el-icon-document' },
    children: [
      {
        path: 'data-sync',
        name: 'LogList',
        component: () => import('@/views/dataSync/logList.vue'),
        meta: { title: '数据同步', icon: 'el-icon-document', breadcrumb: false, keepAlive: true }
      },
      // 详情
      {
        path: 'data-log/:id',
        name: 'DataLog',
        hidden: true,
        component: () => import('@/views/dataSync/dataLog.vue'),
        meta: { title: '详情' }
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support  开启代表使用history模式
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
