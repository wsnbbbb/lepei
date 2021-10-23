<template>
	<section>
		<!-- 面包屑 -->
		<el-col :span="24" class="breadcrumb-box">
			<strong class="title">{{ $route.name }}</strong>
			<el-breadcrumb separator="/" class="breadcrumb-inner">
				<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">{{ item.name }}</el-breadcrumb-item>
			</el-breadcrumb>
		</el-col>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item>
						<el-date-picker
						v-model="value"
						value-format="yyyy-MM-dd"
						type="date"
						placeholder="请选择要查询的日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium"  v-on:click="records">查询</el-button>
					</el-form-item>
				
				</el-form>
			</el-col>
		</el-row>
		<el-row class="table-row">
            <el-col :span="24">
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="title">运动数据</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag>{{sportData.totalSteps}}步</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag type="success">{{sportData.totalDistances&&Number(sportData.totalDistances)/1000}}km</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag type="danger">{{sportData.totalCalories}}卡</el-tag>
                <div id="chartColumn1" style="width:100%; height:400px;"></div>
            </el-col>
		</el-row>
		<el-row class="table-row">
            <el-col :span="24">
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="title">心率数据</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag>最高：{{heartRateData.maxHeartRate}}</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag type="success">最低：{{heartRateData.minHeartRate}}</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag type="danger">平均：{{heartRateData.averageHeartRate}}</el-tag>
                <div id="chartColumn2" style="width:100%; height:400px;"></div>
            </el-col>
		</el-row>
		<el-row class="table-row" v-show="braceletType==2">
            <el-col :span="24" >
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="title">体温数据</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag>最高：{{temperatureData.maxTemperature}}</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag type="success">最低：{{temperatureData.minTemperature}}</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag type="danger">平均：{{temperatureData.averageTemperature}}</el-tag>
                <div id="chartColumn3" style="width:100%; height:400px;"></div>
            </el-col>
		</el-row>
		<!-- <el-row class="table-row table-row-last">
            <el-col :span="24">
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="title">睡眠数据</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag>深睡：{{sleepData.deepSleep&&(Number(sleepData.deepSleep)/60)}}h</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag type="success">浅睡：{{sleepData.shallowSleep&&(Number(sleepData.shallowSleep)/60)}}h</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;
				<el-tag type="danger">总计：{{sleepData.totalSleep&&(Number(sleepData.totalSleep)/60)}}h</el-tag>
            </el-col>
		</el-row> -->
		<a href="javascript:;" @click="back" class="btn-return">返回</a>
	</section>
</template>

<script>
	import { mapState, mapGetters, mapActions} from 'vuex';
	import util from '../../common/js/util'
	import echarts from 'echarts'
	//import NProgress from 'nprogress'
	import { personHealthRecords} from '../../api/api';

	export default {
		data() {
			return {
				value: "",
				heartRateData: {},
				sleepData: {},
				sportData: {},
				temperatureData: {},
				braceletType: 2

			}
		},
		computed:{
		
		},
		methods: {
		
			monthChange(val) {
				console.log(val);
				this.value = val;
			},
			drawColumnChart(container, x, y) {
				let	option = {
					color: ['#3398DB'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {            // 坐标轴指示器，坐标轴触发有效
							type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						top: '4%',
						containLabel: true
					},
					xAxis: [
						{
							type: 'category',
							data: x,
							axisTick: {
								alignWithLabel: true
							}
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: '',
							type: 'bar',
							barWidth: '60%',
							data: y
						}
					]
			
				
				};
				echarts.init(document.getElementById(container)).setOption(option);
            },
	
			//查询
			records() {
				let _this = this
				let para = {
					date: this.value,
					personId: this.$route.params.personId
				};
				this.listLoading = true;
				personHealthRecords(para).then((res) => {
					this.braceletType = res.data.braceletData.braceletType
					this.sportData = res.data.sportData
					let arr  = []
					let arr1 = []
					res.data.sportData.dataList.map(i=>{
						arr.push(i.steps)
						arr1.push(i.time)
					})
					_this.drawColumnChart("chartColumn1", arr1, arr)

					this.heartRateData = res.data.heartRateData
					let arr2  = []
					let arr3 = []
					res.data.heartRateData.dataList.map(i=>{
						arr2.push(i.time)
						arr3.push(i.heartRate)
					})
					_this.drawColumnChart("chartColumn2", arr2, arr3)


					this.temperatureData = res.data.temperatureData
					let arr4  = []
					let arr5 = []
					res.data.temperatureData.dataList.map(i=>{
						arr4.push(i.time)
						arr5.push(i.temperature)
					})
					_this.drawColumnChart("chartColumn3", arr4, arr5)

					_this.sleepData = res.data.sleepData
					_this.listLoading = false;
				});
			},

			back(){
				window.history.go(-1)
			},

			getCurrentDate(){
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate();
				if (month < 10) {
					month = "0" + month;
				}
				if (day < 10) {
					day = "0" + day;
				}
				return year + '-' + month + '-' + day;
			},	
	
		},
		beforeMount(){
			this.value = this.getCurrentDate()
		},
		mounted() {

			this.records()
		}
	}

</script>

<style scoped>
 .el-tooltip__popper {
    max-width: 10px;
    /* line-height: 180%; */
  }
  .btn-return{
	  display: inline-block;
	  position: fixed;
	  bottom: 20px;
	  left: 230px;
	  background-color: #1890ff;
	  width: 80px;
	  height: 36px;
	  color: #fff;
	  text-align: center;
	  line-height: 36px;
	  text-decoration: none;
	  border-top-right-radius: 18px;
	  border-bottom-right-radius: 18px;

  }
   .btn-return:hover{
	   opacity: 0.85;
   }
   .title{
	   font-size: 20px;

   }
   .table-row{
	   padding-bottom: 30px;
   }
   .table-row-last{
	   padding-bottom: 100px;
   }
</style>