// 导出组织架构的路由规则
import Layout from '@/layout'
// 每个子模块其实外层都是包裹着 layout 组件位于layout的二级路由里面
export default {
  path: '/departments', // 路径
  name: 'departments', // 路由规则的name
  component: Layout, // 组件
  // 配置二级路由
  children: [{
    path: '', // 二级路由什么都不写的时候 表示该路由为当前二级路由的默认路由   /employees
    component: () => import('@/views/departments'),
    name: 'departments',
    // 路由元信息，其实就是存储数据的对象 可以放置一些自定义的信息
    meta: {
      // 左侧导航要读取路由规则的meta信息中title 作为显示菜单的名称
      title: '组织架构',
      icon: 'tree'
    }
  }]
}
