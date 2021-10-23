<template>
	<section>
     <!-- 面包屑 -->
    <el-col :span="24" class="breadcrumb-box">
      <strong class="title">{{ $route.name }}</strong>
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item>人脸识别管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/du-face-device' }">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="times" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item>
						<el-date-picker
              @change="getTime"
              v-model="times"
              type="month"
              value-format="yyyy-MM"
              format="yyyy-MM"
              placeholder="请选择要查询的月份">
            </el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium"  v-on:click="records">查询</el-button>
					</el-form-item>
				
				</el-form>
			</el-col>
		</el-row>
		<el-row>
      <el-col :span="24">
        <div id="chartColumn" style="width:100%; height:400px;"></div>
      </el-col>
		</el-row>
	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	import echarts from 'echarts'
	import { onlineRecord} from '../../api/api';

	export default {
		data() {
			return {
				times:'',
				chartData: {
					x: [],
					y: []
        },
        listLoading:false,
			}
		},
		computed:{
		
		},
		methods: {
		
			getTime(val) {
				console.log(val);
				this.times = val;
      },

      // 在线记录折线图表
			onlineRecordChart() {
				let	option = {
					 xAxis: {
						type: 'category',
						data: this.chartData.x
					},
					yAxis: {
						type: 'value'
					},
					series: [{
						data: this.chartData.y,
						type: 'line'
					}],
					dataZoom: [
						{
							show: true,
							realtime: true,
							start: 65,
							end: 85
						},
						{
							type: 'inside',
							realtime: true,
							start: 65,
							end: 85
						}
					],
				};

        this.chartColumn = echarts.init(document.getElementById('chartColumn'));
        this.chartColumn.setOption(option);
      },
	
			//查询
			records() {
				let _this = this
				let para = {
					date: this.times,
					devSn: this.$route.params.devSn
				};
				this.listLoading = true;
				onlineRecord(para).then((res) => {
					_this.listLoading = false;
					_this.chartData.x = res.data.time
					_this.chartData.y = res.data.status
					_this.onlineRecordChart()
				});
			},
		},
		mounted() {
      let date = util.formatDate.format(new Date(), 'yyyy-MM');
      this.times = date
      this.records()
		}
	}

</script>

<style scoped>
.times{
  padding:15px;
}
 .el-tooltip__popper {
    max-width: 10px;
    /* line-height: 180%; */
  }
</style>