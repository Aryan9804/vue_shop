import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 设置重定向路由规则
  {
    path: '/',
    redirect: '/login'
  },
  // 设置登录路由规则
  {
    path: '/login',
    component: Login
  },
  // 设置首页路由规则
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问哪个路径
  // from哪个路径跳转而来
  // next是一个函数，标识放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) {
    next('/login')
  } else {
    next()
  }
})

export default router
