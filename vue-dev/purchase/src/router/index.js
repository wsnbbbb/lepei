import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/pages/Index'
import detail from '@/pages/detail'
import detailMyapply from '@/pages/detail-myApply'
import detailExamine from '@/pages/detail-examine'
import add from '@/pages/add'
import submitlist from '@/pages/submitlist'
import addGoods from '@/pages/add-goods'
import addGoodsList from '@/pages/add-goods-list'
import addGoodsDetail from '@/pages/add-goods-detail'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/index/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/index/detailMyapply',
      name: 'detailMyapply',
      component: detailMyapply
    },
    {
      path: '/index/detailExamine',
      name: 'detailExamine',
      component: detailExamine
    },
    {
      path: '/index/add',
      name: 'add',
      component: add
    },
    {
      path: '/index/submitlist',
      name: 'submitlist',
      component: submitlist
    },
    {
      path: '/index/add-goods',
      name: 'addGoods',
      component: addGoods
    },
    {
      path: '/index/add-goods-list',
      name: 'addGoodsList',
      component: addGoodsList
    },
    {
      path: '/index/add-goods-detail',
      name: 'addGoodsDetail',
      component: addGoodsDetail
    }
  ]
})

