<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  methods: {
    async success({ header, results }) {
      // 此时导入的键值是中文的  需要替换成英文再发起请求
      // 导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      var arr = []
      results.forEach(item => {
        var obj = {}
        Object.keys(item).forEach(key => {
          // 此时key还是中文
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            obj[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有转换成日期对象才能入库
            return
          }
          obj[userRelations[key]] = item[key]
        })
        arr.push(obj)
      })
      await importEmployee(arr) // 调用导入员工接口
      this.$message.success('导入成功')
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
