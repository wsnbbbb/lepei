import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login'},
    {
      path: '/login',
      name: 'login',
      component: (resolve)=> require(['./pages/Login.vue'], resolve)
    },
    {
      path: '/home',
      name: 'home',
      component: (resolve)=> require(['./pages/Home.vue'], resolve)
    },
    {
      path: '/person-info',
      name: 'personInfo',
      component: (resolve)=> require(['./pages/PersonInfo.vue'], resolve)
    },
    {
      path: '/student-info',
      name: 'studentInfo',
      component: (resolve)=> require(['./pages/StudentInfo.vue'], resolve)
    },
    {
      path: '/custody-info',
      name: 'custodyInfo',
      component: (resolve)=> require(['./pages/CustodyInfo.vue'], resolve)
    },
    {
      path: '/traffic-info',
      name: 'trafficInfo',
      component: (resolve)=> require(['./pages/TrafficInfo.vue'], resolve)
    }, 
    {
      path: '/teacher-info',
      name: 'teacherInfo',
      component: (resolve)=> require(['./pages/TeacherInfo.vue'], resolve)
    },
    {
      path: '/sign-list',
      name: 'signList',
      component: (resolve)=> require(['./pages/SignList.vue'], resolve)
    },
    {
      path: '/sign-info',
      name: 'signInfo',
      component: (resolve)=> require(['./pages/SignInfo.vue'], resolve)
    },
    { 
      path: '/write-info-list',
      name: 'writeInfoList',
      component: (resolve)=> require(['./pages/WriteInfoList.vue'], resolve)
    },
    
    { 
      path: '/mess-person',
      name: 'messPerson',
      component: (resolve)=> require(['./pages/MessPerson.vue'], resolve)
    },
    
    { 
      path: '/dirver-list',
      name: 'dirverList',
      component: (resolve)=> require(['./pages/DirverList.vue'], resolve)
    },
    { 
      path: '/school-bus',
      name: 'schoolBus',
      component: (resolve)=> require(['./pages/SchoolBus.vue'], resolve)
    },
    { 
      path: '/mess-person-info',
      name: 'messPersonInfo',
      component: (resolve)=> require(['./pages/MessPersonInfo.vue'], resolve)
    },
    { 
      path: '/dirver-info', 
      name: '/dirverInfo',
      component: (resolve)=> require(['./pages/DirverInfo.vue'], resolve)
    },
    { 
      path: '/school-bus-info',
      name: 'schoolBusInfo',
      component: (resolve)=> require(['./pages/SchoolBusInfo.vue'], resolve)
    },
    { 
      path: '/alien-info-list',
      name: 'alienInfolist',
      component: (resolve)=> require(['./pages/AlienInfoList.vue'], resolve)
    },
    { 
      path: '/alien-info',
      name: 'alienInfo',
      component: (resolve)=> require(['./pages/AlienInfo.vue'], resolve)
    },
    { 
      path: '/alien-person-info',
      name: 'alienPersonInfo',
      component: (resolve)=> require(['./pages/AlienPersonInfo.vue'], resolve)
    },
    { 
      path: '/clock-query',
      name: 'clockQuery',
      component: (resolve)=> require(['./pages/ClockQuery.vue'], resolve)
    },
    { 
      path: '/clock-type-list',
      name: 'clockTypeList',
      component: (resolve) => require(['./pages/ClockTypeList.vue'],resolve)
    },
    { 
      path: '/bind-class-list',
      name: 'bindClassList',
      component: (resolve) => require(['./pages/BindClassList.vue'],resolve)
    },
    { 
      path: '/bind-class-info',
      name: 'bindClassInfo',
      component: (resolve) => require(['./pages/BindClassInfo.vue'],resolve)
    },
   
    
  ]
})
