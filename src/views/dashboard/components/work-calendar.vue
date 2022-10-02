<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="dateChange">
        <el-option v-for="item in yearList" :key="item" :value="item" :label="item" />
      </el-select>
      <el-select v-model="currentMouth" size="small" style="width: 120px;margin-left:10px" @change="dateChange">
        <el-option v-for="item in 12" :key="item" :value="item" :label="item" />
      </el-select>
    </el-row>
    <!-- 根据传进来的年 生成可选年份 前后各加5年 -->
    <!-- 日历 -->
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{ date,data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      yearList: [], // 年份数组
      currentDate: null, // 当前日期
      currentMouth: null, // 月
      currentYear: null // 年份
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear()
    this.currentMouth = this.startDate.getMonth() + 1
    // Array(xx) 可以创建一个有xx长度的数组，Array.from给数组添加元素
    this.yearList = Array.from(Array(11), (v, i) => i + this.currentYear - 5)
    this.dateChange()
  },
  methods: {
    // 判断是不是休息日
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    },
    // 年月份改变之后
    dateChange() {
      const year = this.currentYear
      const mouth = this.currentMouth
      this.currentDate = new Date(`${year}-${mouth}-1`) // 生成新日期 以每月1号作为起始
    }
  }
}
</script>

<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
