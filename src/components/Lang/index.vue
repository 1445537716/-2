<template>
  <el-dropdown trigger="click" @command="changLanguage">
    <div>
      <svg-icon icon-class="language" style="color:#fff;font-size:20px" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="this.$i18n.locale === 'zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="this.$i18n.locale === 'en'" command="en">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import cookie from 'js-cookie'
export default {
  methods: {
    changLanguage(lang) {
      cookie.set('language', lang) // 切换语言
      this.$i18n.locale = lang // 设置给本地的i18n插件
      this.$message.success('切换语言成功')
    }
  }
}
</script>

<style>

</style>
