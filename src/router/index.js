import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../views/Users.vue'
import Roles from '../views/Roles.vue'
import Rights from '../views/Rights.vue'
import Goods from '../views/Goods.vue'
import Params from '../views/Params.vue'
import Categories from '../views/Categories.vue'
import Orders from '../views/Orders.vue'
import Reports from '../views/Reports.vue'

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
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      // 用户列表路由配置
      {
        path: '/users',
        component: Users
      },
      // 角色列表路由配置
      {
        path: '/roles',
        component: Roles
      },
      // 权限列表路由配置
      {
        path: '/rights',
        component: Rights
      },
      // 商品列表路由配置
      {
        path: '/goods',
        component: Goods
      },
      // 分类参数路由配置
      {
        path: '/params',
        component: Params
      },
      // 商品分类路由配置
      {
        path: '/categories',
        component: Categories
      },
      // 订单列表路由配置
      {
        path: '/orders',
        component: Orders
      },
      // 数据报表路由配置
      {
        path: '/reports',
        component: Reports
      }
    ]
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
