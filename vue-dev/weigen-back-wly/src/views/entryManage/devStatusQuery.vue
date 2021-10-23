<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-date-picker
						v-model="value2"
						type="month"
						value-format="yyyy-MM"
						format="yyyy-MM"
						@change="monthChange"
						placeholder="请选择要查询的月份">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="records">查询</el-button>
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
	//import NProgress from 'nprogress'
	import { records} from '../../api/api';

	export default {
		data() {
			return {
				value2: "",
				filters: {
					name: ''
				},
				chartData: {
					x: [],
					y: []
				}

			}
		},
		computed:{
		
		},
		methods: {
		
			monthChange(val) {
				console.log(val);
				this.value2 = val;
			},
			drawColumnChart() {
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
					date: this.value2,
					devSn: this.$route.params.devSn
				};
				this.listLoading = true;
				//NProgress.start();
				records(para).then((res) => {
					_this.listLoading = false;
					_this.chartData.x = res.data.time
					_this.chartData.y = res.data.status
					_this.drawColumnChart()
					//NProgress.done();
				});
			},

	
	
		},
		mounted() {
			// this.getUsers();
			// this.getEntryMacList();
			// this.getBuilds();
			// this.getDeviceList();

		
			// debugger;
			// this.invokePushItems([1,2,3,4])
		}
	}

</script>

<style scoped>
 .el-tooltip__popper {
    max-width: 10px;
    /* line-height: 180%; */
  }
</style>