import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

var router = new Router({
  routes: [
    // 设置重定向，打开页面就访问登录页面
    { path: '/', redirect: '/login' },
    // 设置登录的请求路由
    { path: '/login', name: 'login', component: () => import('@/views/login') },
    // 设置后台首页请求路由
    { path: '/home', name: 'home', component: () => import('@/views/home') }
  ]
})

// 若用户处于非登录状态，则禁止访问后台页面，而到登录页面：通过token限制实现
// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 说明：1. to.path:可获得要去哪的路由锚点信息；
  //       2.from.path： 获得从哪来的路由锚点信息；
  var token = window.sessionStorage.getItem('token')
  if (!token && to.path !== '/login') {
    // 如果现在没有token，要去的地址不是/login,则进入这里
    return next('/login')
  }
  next()
})

export default router
