import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'

Vue.use(Router)

export default new Router({
  routes: [
    {
      mode:'hash',
      path: '/',
      name: 'GoodsList',
      component:GoodsList
    },
    {
      mode:'hash',
      path: '/cart',
      name: 'Cart',
      component:Cart
    },
    {
      mode:'hash',
      path:'/address',
      name:'Address',
      component:Address
    },
    {
      mode:'hash',
      path:'/orderConfirm',
      name:'OrderConfirm',
      component:OrderConfirm
    },
    {
      mode:'hash',
      path:'/orderSuccess',
      name:'OrderSuccess',
      component:OrderSuccess
    }
  ]
})
