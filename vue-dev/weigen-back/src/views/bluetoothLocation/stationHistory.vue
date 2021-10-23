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
		<a href="javascript:;" @click="back" class="btn-return">返回</a>
	</section>
</template>

<script>
	import { mapState, mapGetters, mapActions} from 'vuex';
	import util from '../../common/js/util'
	import echarts from 'echarts'
	//import NProgress from 'nprogress'
	import { records , getStationRecords} from '../../api/api';

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
				getStationRecords(para).then((res) => {
					_this.listLoading = false;
					_this.chartData.x = res.data.time
					_this.chartData.y = res.data.status
					_this.drawColumnChart()
				});
			},

			back(){
				window.history.go(-1)
			}

	
	
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
</style>