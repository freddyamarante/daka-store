import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import ProductDetail from './pages/ProductDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetail,
      props: true
    }
  ]
})

export default router