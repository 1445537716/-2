import {
  getToken,
  setToken,
  removeToken,
  setTimeStamp
} from '@/utils/auth'
import {
  login,
  getUserInfo,
  getUserDetailById
} from '@/api/user'
import {
  resetRouter
} from '@/router'
// 状态
const state = {
  token: getToken(), // token的共享状态 从缓存中读取token数据
  userInfo: {} // 存放用户资料
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token // 修改vuex中的token
    setToken(token) // 修改缓存中的token  同步操作
  },
  removeToken(state) {
    state.token = null // 删除vuex中的token
    removeToken() // 清除缓存中的token  实行同步
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo // 存放用户资料
  },
  removeUserInfo(state) {
    state.userInfo = {} // 删除用户资料
  }
}
// 执行异步
const actions = {
  // 调用action时传过来的参数（手机号，密码）
  async login(context, data) {
    // 经过axios响应拦截器返回到这里的数据都是成功的
    const result = await login(data)
    // 将成功登录用户的token存入到vuex和缓存中
    context.commit('setToken', result)
    // 登录成功，存入时间戳
    setTimeStamp()
  },
  async getUserInfo(context) {
    // 获取用户基本资料（没有头像地址）
    const result = await getUserInfo() // 请求获取返回值
    // 获取用户详情资料（头像地址）
    const base = await getUserDetailById(result.userId)
    context.commit('setUserInfo', {
      ...result,
      ...base
    }) // 合并用户资料  调用mutations存放数据
    return result // 为后期做权限埋下伏笔
  },
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], {
      root: true
    })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
