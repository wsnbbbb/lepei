import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Homework from '@/views/HomeWork.vue'
import CheckHomework from '@/views/CheckHomework.vue'
import EvaluationReport from '@/views/EvaluationReport.vue'
import CheckReport from '@/views/CheckReport.vue'
import CheckStudentLeave from '@/views/CheckStudentLeave.vue'
import StudentLeave from '@/views/StudentLeave.vue'
import TeacherLeave from '@/views/TeacherLeave.vue'
import NoticeDetail from '@/views/NoticeDetail.vue'
import ReleasingNotice from '@/views/ReleasingNotice.vue'
import GrowthAssessment from '@/views/GrowthAssessment.vue'
import WordsToBaby from '@/views/WordsToBaby.vue'

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/homework",
    name: "Homework",
    component: Homework
  },
 
  {
    path: "/check-homework",
    name: "CheckHomework",
    component: CheckHomework
  },
  {
    path: "/evaluation-report",
    name: "EvaluationReport",
    component: EvaluationReport
  },
  {
    path: "/check-report",
    name: "CheckReport",
    component: CheckReport
  },
  {
    path: "/check-student-leave",
    name: "CheckStudentLeave",
    component: CheckStudentLeave
  },
  {
    path: "/student-leave",
    name: "StudentLeave",
    component: StudentLeave
  },
  {
    path: "/teacher-leave",
    name: "TeacherLeave",
    component: TeacherLeave
  },
  {
    path: "/notice-detail",
    name: "NoticeDetail",
    component: NoticeDetail
  },
  {
    path: "/releasing-notice",
    name: "ReleasingNotice",
    component: ReleasingNotice
  },
  {
    path: "/releasing-notice",
    name: "ReleasingNotice",
    component: ReleasingNotice
  },
  {
    path: "/growth-assessment",
    name: "GrowthAssessment",
    component: GrowthAssessment
  },
  {
    path: "/words-toBaby",
    name: "WordsToBaby",
    component: WordsToBaby
  },

  

];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
