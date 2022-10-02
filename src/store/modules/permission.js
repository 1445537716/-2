// 权限模块
import {
  constantRoutes,
  asyncRoutes
} from '@/router'
// 用户所能访问的页面 = 默认页面 + 权限分配的动态路由页面
const state = {
  routes: constantRoutes // 放置所有用户都拥有默认静态路由
}
const mutations = {
  //  newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state, newRoutes) {
    // state.routes = [...state.routes, ...newRoutes]
    // 有一种情况  张三 登录 获取了动态路由 追加到路由上  李四登录 4个动态路由
    // 应该是每次更新 都应该在静态路由的基础上进行追加
    // 用户的权限由默认路由加上分配的动态路由
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    // 筛选权限路由
    // 第二个参数为当前用户所拥有的菜单权限
    // menus=['settings','xxx','xxx']
    const routes = []
    menus.forEach(key => {
      // key 是权限标识符
      // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的 动态路由的权限
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
