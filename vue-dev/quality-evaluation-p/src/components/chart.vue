<template>
  <div class="x-bar">
    <div :id="id"
    :option="option"></div>
  </div>
</template>
<script>
import HighCharts from 'highcharts'
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts)
export default {
  // 验证类型
  props: {
    id: {
      type: String
    },
    option: {
      type: Object
    }
  },
  mounted() {
    // HighCharts.chart(this.id,this.option)
  }
}
</script>