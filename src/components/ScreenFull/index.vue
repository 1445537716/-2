<template>
  <div>
    <!-- 放置一个svg图标 -->
    <svg-icon
      icon-class="fullscreen"
      style="color:#fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    changeScreen() {
    //   document.documentElement.requestFullscreen() // 原生js全屏
      if (!ScreenFull.isEnabled) {
        this.$message.warning('全屏组件不可用')
        return
      }
      ScreenFull.toggle() // 包括全屏和退出全屏
    }
  }
}
</script>

<style>

</style>
