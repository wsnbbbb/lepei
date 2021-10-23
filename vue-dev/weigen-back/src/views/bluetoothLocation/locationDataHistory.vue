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
						v-model="datePick"
						type="daterange"
						value-format='yyyy-MM-dd'
						size="small"
						:picker-options="pickerOptions"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium"  v-on:click="query">查询</el-button>
					</el-form-item>
				
				</el-form>
			</el-col>
		</el-row>
		<el-row>
		 <el-tabs v-model="activeName">
			<el-tab-pane label="概览" name="first">
				<div id="chartColumn3" style="width:100%; height:400px;"></div>
			</el-tab-pane>
			<el-tab-pane label="明细" name="second">

				<!--列表-->
				<el-table :data="dataList" highlight-current-row  style="width: 100%;">
					<el-table-column prop="buildName" label="建筑" min-width="60">
					</el-table-column>
					<el-table-column prop="placeName" label="场所" min-width="60">
					</el-table-column>
					<el-table-column prop="entryTime" label="进入时间" min-width="60" :show-overflow-tooltip="true" :formatter="formatTime">
					</el-table-column>
					<el-table-column prop="leaveTime" label="离开时间" min-width="60" :show-overflow-tooltip="true" :formatter="formatTime1">
					</el-table-column>
					<el-table-column prop="stayTime" label="停留时长" min-width="60" :show-overflow-tooltip="true" :formatter="formatTime2">
					</el-table-column>
					
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>

	
			

		</el-tabs>
		</el-row>
		<a href="javascript:;" @click="back" class="btn-return">返回</a>
	</section>
</template>

<script>
	import { mapState, mapGetters, mapActions} from 'vuex';
	import util from '../../common/js/util'
	import echarts from 'echarts'
	//import NProgress from 'nprogress'
	import { getTrackSummary, getTrackRecordList} from '../../api/api';

	export default {
		data() {
			let _minTime = null
 			let _maxTime = null
			return {
				value: "",
				dataList: [],
				activeName: 'first',
				page: 1,
				total: 0,
				prePage: 10,
				pickerDate: '',
				datePick: [], 
				pickerOptions:{
					onPick(time){
						// 如果选择了只选择了一个时间
						if (!time.maxDate) {
						let timeRange = 6*24*60*60*1000 // 6天
						_minTime = time.minDate.getTime() - timeRange // 最小时间
						_maxTime = time.minDate.getTime() + timeRange // 最大时间
						// 如果选了两个时间，那就清空本次范围判断数据，以备重选
						} else {
						_minTime = _maxTime = null
						}
					},
					disabledDate(time) {
						// onPick后触发
						// 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
						if(_minTime && _maxTime){
						return time.getTime() < _minTime || time.getTime() > _maxTime
						}
					}
				}
			


			}
		},
		computed:{
		
		},
		methods: {

			formaSex: function (row, column) {
				if(row.sex==1){
					return "男"
				}else if(row.sex==2){
					return "女"
				}else{
					return "保密"
				}
			},
			formatTime: function (row, column) {
				if(!row.entryTime) return '-'
				return util.formatDate.format(new Date(row.entryTime*1000), 'yyyy-MM-dd hh:mm:ss');
			},
			formatTime1: function (row, column) {
				if(!row.leaveTime) return '-'
				return util.formatDate.format(new Date(row.leaveTime*1000), 'yyyy-MM-dd hh:mm:ss');
			},
			formatTime2(row) {
				var theTime = parseInt(row.stayTime);// 秒
				var middle= 0;// 分
				var hour= 0;// 小时
				if(theTime > 60) {
					middle= parseInt(theTime/60);
					theTime = parseInt(theTime%60);
					if(middle> 60) {
						hour= parseInt(middle/60);
						middle= parseInt(middle%60);
					}
				}
				var result = ""+parseInt(theTime)+"秒";
				if(middle > 0) {
					result = ""+parseInt(middle)+"分"+result;
				}
				if(hour> 0) {
					result = ""+parseInt(hour)+"小时"+result;
				}
				return result;
			},
			formatTime3(stayTime) {
				var theTime = parseInt(stayTime);// 秒
				var middle= 0;// 分
				var hour= 0;// 小时
				if(theTime > 60) {
					middle= parseInt(theTime/60);
					theTime = parseInt(theTime%60);
					if(middle> 60) {
						hour= parseInt(middle/60);
						middle= parseInt(middle%60);
					}
				}
				var result = ""+parseInt(theTime)+"秒";
				if(middle > 0) {
					result = ""+parseInt(middle)+"分"+result;
				}
				if(hour> 0) {
					result = ""+parseInt(hour)+"小时"+result;
				}
				return result;
			},
			getList() {
				let para = {
					startDate: this.datePick[0]||'',
					endDate: this.datePick[1]||'',
					personId: this.$route.params.personId,
					page: 1,
					prePage: 20
				};
				this.listLoading = true;
				getTrackRecordList(para).then((res) => {
					this.listLoading = false;
					if(res.code == 200){
						this.dataList = res.data.dataList
						this.total = res.data.totalCount
					}

				});
			},
			
			handleCurrentChange(val) {
				if(val==this.page) return
				this.page = val;
				let para = {
					startDate: this.datePick[0]||'',
					endDate: this.datePick[1]||'',
					personId: this.$route.params.personId,
					page: this.page,
					prePage: 20
				};
				this.listLoading = true;
				getTrackRecordList(para).then((res) => {
					this.listLoading = false;
					this.dataList = res.data.dataList
					this.total = res.data.totalCount
				});
			},

			drawColumnChart(container, data) {
				let me = this
				let option = {
						title: {
							text: '',
							subtext: '',
							left: 'center'
						},
						tooltip: {
							trigger: 'item',
							formatter: function (params) {
								return `${params.name}：` + me.formatTime3(params.value) + ` (${params.percent}%)`
							}
						},
						series: [
							{
								type: 'pie',
								radius: '65%',
								center: ['50%', '50%'],
								selectedMode: 'single',
								data: data,
								emphasis: {
									itemStyle: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									}
								},
							}
						]
					};
				echarts.init(document.getElementById(container)).setOption(option);
            },
	
			//查询
			query() {
				if(!this.datePick||this.datePick.length==0) return
				let _this = this
				let para = {
					startDate: this.datePick[0]||'',
					endDate: this.datePick[1]||'',
					personId: this.$route.params.personId
				};
				this.listLoading = true;
				let me = this
				getTrackSummary(para).then((res) => {
					let arr = []
					this.sportData = res.data.map(i=>{
						arr.push({
							name: i.placeName,
							value: i.stayTime
						})
					})

					_this.drawColumnChart("chartColumn3", arr)
					_this.listLoading = false;
				});

				this.getList()


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
			getLastSevenDays(date){
				var date = date || new Date(),
					timestamp, 
					newDate;
				if(!(date instanceof Date)){
					date = new Date(date.replace(/-/g, '/'));
				}
				timestamp = date.getTime();
				newDate = new Date(timestamp - 6 * 24 * 3600 * 1000);
				var month = newDate.getMonth() + 1;
				month = month.toString().length == 1 ? '0' + month : month; 
				var day = newDate.getDate().toString().length == 1 ? '0' + newDate.getDate() :newDate.getDate();
				return [newDate.getFullYear(), month, day].join('-');
			}
		
		},
		beforeMount(){
			this.datePick = [this.getLastSevenDays(), this.getCurrentDate()]
		},
		mounted() {
			this.getList()
			this.query()
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