import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404']
// 前置路由守卫
// eslint-disable-next-line space-before-function-paren
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度条
  if (store.getters.token) {
    // token是否存在
    if (to.path === '/login') { // 目标是否是跳转到登录页
      next('/') // 跳转到主页
    } else {
      if (!store.getters.userId) { // 如果没有用户id 才会调用用户的资料
        // 获取完资料再放行
        // async 函数所return的内容 用 await就可以接收到
        const {
          roles
        } = await store.dispatch('user/getUserInfo')
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // 此时routes是已筛选的动态路由  用router的addRoute方法添加动态路由
        router.addRoutes([...routes, {
          path: '*',
          redirect: '/404',
          hidden: true
        }]) // 添加动态路由到路由表
        // router.addRoutes(routes)
        // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        next(to.path)
      } else {
        next() // 放行
      }
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) { // 目标是否处于白名单中
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置路由守卫
router.afterEach((to, from, next) => {
  NProgress.done() // 关闭进度条
})
