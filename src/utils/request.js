import axios from 'axios'
import store from '@/store'
import router from '@/router'
import {
  Message
} from 'element-ui'
import {
  getTimeStamp
} from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间

const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 请求超过五秒就是超时
})
// 请求拦截器
service.interceptors.request.use(config => {
  // 统一注入token
  if (store.getters.token) {
    // 只有在token存在的时候进行检验token是否有效
    if (IsCheckTimeOut()) { // 如果true 就是token超时了
      // 登出功能
      store.dispatch('user/logout')
      // 跳转主页
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }
    // 如果token存在 则注入
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error) // 返回错误信息
})
// 响应拦截器
service.interceptors.response.use(
  response => {
    //   axios默认加了一层data
    const {
      data,
      message,
      success
    } = response.data
    // 根据success的成功与否执行操作
    if (success) {
      return data
    } else {
      // 业务错误 需进入catch
      Message.error(message) // 提示错误信息
      return Promise.reject(new Error(message))
    }
  }, error => {
    // 被动介入 根据后端数据判断token超时
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 当请求返回的数据里的code值等于10002的时候 表示 后端告诉我token超时
      store.dispatch('user/logout') // 登出功能
      router.push('/login') // 跳转首页
    }
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error) // 返回执行错误 跳出执行链 进入catch
  }
)
// 检验时间戳是否超时
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
