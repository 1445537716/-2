<template>
  <div ref="radar" class="radar-echart" />
</template>

<script>
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])

export default {
  created() {
    // 此时页面的渲染还未完成
  },
  mounted() {
    var myChart = echarts.init(this.$refs.radar)
    var option = {
      title: {
        text: '基础雷达图'
      },
      legend: {
        data: ['张三', '李四']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '考勤', max: 6500 },
          { name: '新技术', max: 16000 },
          { name: '工作产出', max: 30000 },
          { name: '帮助同事', max: 38000 },
          { name: '培训新人', max: 52000 },
          { name: '修复bug', max: 25000 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: 'Allocated Budget'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: 'Actual Spending'
            }
          ]
        }
      ]
    }

    option && myChart.setOption(option)
  }
}
</script>

<style>
.radar-echart{
    width: 600px;
    height: 400px;

}
</style>
