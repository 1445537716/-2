// 多语言实例化包
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cookie from 'js-cookie'
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么中文语言包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么英文语言包
import customZH from './zh' // 引入自定义中文语言包
import customEN from './en' // 引入自定义英文语言包

Vue.use(VueI18n) // 全局注册多语言包
export default new VueI18n({
  locale: cookie.get('language') || 'zh', // 从cookie中获取语言类型  cookie中没有则使用中文语言包
  messages: { // 获取当前语言类型的语言包
    zh: {
      ...elementZH,
      ...customZH
    },
    en: {
      ...elementEN,
      ...customEN
    }
  }
})
