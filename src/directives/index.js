// 注册自定义指令
export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted: (dom, options) => {
    // 第一个参数是当前指令作用的DOM对象
    // 第二个参数是指令中变量的解释  其中有一个属性叫做value
    // 当图片有地址 但是地址没有加载成功时 就会触发图片的onerror事件
    // 用DOM注册onerror事件
    //   图片异常的逻辑
    //  监听img标签的错误事件  因为图片加载失败 会触发  onerror事件
    dom.src = dom.src || options.value
    dom.onerror = () => {
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    // 该钩子函数会在当前指令作用的组件  更新数据完毕后 执行
    // inserted只会执行依次
    // 组件初始化 一旦更新就会再进入 inserted函数  会进去componentUpdated
    dom.src = dom.src || options.value
  }
}
