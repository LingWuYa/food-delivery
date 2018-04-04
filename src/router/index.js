import Vue from 'vue'
import Router from 'vue-router'
import Goods from '../components/goods/Goods'
import Ratings from '../components/ratings/Ratings'
import Seller from '../components/seller/Seller'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/goods' // 默认首页重定向
    },
    {
      path: '/goods',
      name: 'goods',
      component: Goods
    },
    {
      path: '/ratings',
      name: 'Ratings',
      component: Ratings
    },
    {
      path: '/seller',
      name: 'Seller',
      component: Seller
    }
  ]
})
