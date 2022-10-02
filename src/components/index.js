import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
import TagsView from './TagsView'

//  注册全局的通用栏组件对象
export default {
  install(Vue) {
    //   参数一：组件名称；参数二：组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('TagsView', TagsView) // 多页签
    Vue.use(Print) // 注册打印插件
  }
}
