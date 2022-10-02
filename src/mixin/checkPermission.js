import store from '@/store'
export default {
  // 判断是否有按钮的权限
  methods: {
    checkPermission(key) {
      // 找到当前用户角色的权限
      const {
        userInfo
      } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key) // 判断是否有该权限
      }
      return false
    }
  }
}
