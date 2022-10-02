const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userName: state => state.user.userInfo.username, // 建立用户名称的快捷访问
  userId: state => state.user.userInfo.userId, // 建立用户ID的快捷访问
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立头像地址的快捷访问
  companyId: state => state.user.userInfo.companyId, // 建立公司ID的快捷访问
  routes: state => state.permission.routes // 建立路由权限的快捷访问
}
export default getters
