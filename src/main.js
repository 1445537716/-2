import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import i18n from '@/lang'
import * as directives from '@/directives' // 注册所有自定义指令
import * as filters from '@/filters' // 注册所有过滤器
import Components from './components'
import '@/icons' // icon
import '@/permission' // permission control
import checkPermission from '@/mixin/checkPermission'

Vue.mixin(checkPermission)

// set ElementUI lang to EN
// Vue.use(ElementUI, {
//   locale
// })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value) // t方法会去对应的语言包寻找对应的内容
})

// 遍历所有自定义指令进行全局注册
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// 遍历所有过滤器进行全局注册
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.use(Components) // 注册自己的公用组件
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
