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
							type="date"
							value-format="yyyy-MM-dd"
							format="yyyy-MM-dd"
							@change="dateChange"
							placeholder="请选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium"  v-on:click="query">查询</el-button>
					</el-form-item>
				
				</el-form>
			</el-col>
		</el-row>
		<el-row>
			<h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;全校手环在线趋势</h3>
			<div id="chart" style="width:100%; height:500px;"></div>
		</el-row>
		<el-row>
			<h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;各建筑手环在线情况</h3>
			<el-tooltip class="item" effect="dark" content="拖动滑块分时查看" placement="top">
				<i class="el-icon-warning-outline"></i>
			</el-tooltip>
			<div class="slider-box">
   				 <el-slider v-model="value1" :max="maxValue" :format-tooltip="formatTooltip"></el-slider>
			</div>
		</el-row>
		<el-row class="map-content">
			<div :key='i' v-for="(item, i) in onlineData" class="location-img"  :style="{left: item.xCoordinate + 'px', top: item.yCoordinate + 'px',
			width: item.type ==1? 10 +'px': (item.type ==2? 15 + 'px':(item.type ==3? 20+'px': 25+ 'px')),
			height: item.type ==1? 10 +'px': (item.type ==2? 15 + 'px':(item.type ==3? 20+'px': 25+ 'px'))
			}">
				<div class="tooltip-box">
					<h4>{{item.buildName}} {{currentTime}}在线情况</h4>
					<h4>总人数：{{item.totalCount}}</h4>
					<h4>学生：{{item.studentNum}}</h4>
					<h4>教师：{{item.teacherNum}}</h4>
					<h4>职工：{{item.laborNum}}</h4>
				</div>
				<img v-if="item.type==1" :src="locationImg1" alt="">
				<img v-if="item.type==2" :src="locationImg2" alt="">
				<img v-if="item.type==3" :src="locationImg3" alt="">
				<img v-if="item.type==4" :src="locationImg4" alt="">
			</div>
			<div id='map-box-mask' :style="{background: 'rgba(0, 0, 0,'+brightness/100+')'}"></div>
			<div id='map-box' :style="{backgroundImage: img}"></div>

			<div class="right-box">
				<h4>建筑总人数排名TOP5（{{currentTime}}）</h4>
				<div :key='index' class="right-box-item" v-for="(item, index) in topFive">
					<div class="right-box-item-left">
						<h4>{{item.buildName}}</h4>
						<h6>占总人数比例</h6>
						<h2>{{item.rate}}</h2>
					</div>
					<div class="right-box-item-right">
						<div class="circle">
							<div class="circle_left">
								<div class="left" v-if="item.rate.split('%')[0]*3.6>180" :style="{transform: 'rotate(' + (item.rate.split('%')[0]*3.6-180) + 'deg)'}"></div>
								<div class="left" v-if="item.rate.split('%')[0]*3.6<=180"></div>
							</div>
							<div class="circle_right">
								<div v-if="item.rate.split('%')[0]*3.6<=180" class="right" :style="{transform: 'rotate(' + item.rate.split('%')[0]*3.6 + 'deg)'}"></div>
								<div v-if="item.rate.split('%')[0]*3.6>180" class="right" :style="{transform: 'rotate(' + 180 + 'deg)'}"></div>
							</div>
							<div class="mask">
								<!-- <span>80</span>% -->
							</div>
						</div>
					</div>
				</div>

			</div>
		</el-row>
		<!-- <a href="javascript:;" @click="back" class="btn-return">返回</a> -->
	</section>
</template>

<script>

	import util from '../../common/js/util'
	import echarts from 'echarts'
	import {imgBase } from '../../config'
	//import NProgress from 'nprogress'
	import { delDevice, getBraceletSummary, getBuildingBraceletSummary} from '../../api/api';

	export default {
		data() {
			return {
				value: "",
				value1: 0,
				maxValue: 0,
				summaryData: [],
				img: '',
				visible: false,
				imgBase: imgBase,
				schoolLogo: '',
				defaultImg: require('../../assets/logo.png'),
				locationImg1: require('../../assets/location1.png'),
				locationImg2: require('../../assets/location2.png'),
				locationImg3: require('../../assets/location3.png'),
				locationImg4: require('../../assets/location4.png'),
				onlineData: [],
				currentTime: '',
				brightness: 0,
				topFive: []

				

			}
		},
		computed:{
		
		},
		methods: {
		
			dateChange(val) {
				console.log(val);
				this.value = val;
			},

			formatTooltip(val) {
				this.onlineData = this.summaryData[val]?this.dealData(this.summaryData[val].onlineData):[]
				this.currentTime = this.summaryData[val]?this.summaryData[val].time:''
				this.topFive = this.summaryData[val]?this.summaryData[val].topFive:[]
				return this.summaryData[val]&&this.summaryData[val].time||0;
			},

			drawColumnChart(container, xArr, xStudentArr, xTeacherArr, xLaborArr) {
				let	option = {
					color: ['#3ba1ff', '#279328', '#ffff02'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {            // 坐标轴指示器，坐标轴触发有效
							type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					// tooltip : {

					// 	formatter(params){

					// 		for (var i = 0; i < option.series[0].data.length; i++) {

					// 			if (option.series[0].data[i].name == params.seriesName) {

					// 				return params.seriesName +":"+ option.series[0].data[i].value+"起";
					// 			}
					// 		}
								
					// 	}
					// },
					legend: {
						data: ['数据概览', '学生手环', '教师手环', '职工手环']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [
						{
							type: 'category',
							data: xArr
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
					
						{
							name: '学生手环',
							type: 'bar',
							barWidth: 25,
							stack: '数据概览',
							data: xStudentArr
						},
						{
							name: '教师手环',
							type: 'bar',
							stack: '数据概览',
							data: xTeacherArr
						},
						{
							name: '职工手环',
							type: 'bar',
							stack: '数据概览',
							data: xLaborArr
						},
				
						
					]
				
				};
				echarts.init(document.getElementById(container)).setOption(option);
            },
			

			drawColumnChart1(container, data) {
				let	option = {
					 tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}: {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						left: 10,
						data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
					},
					series: [
						{
							name: '访问来源',
							type: 'pie',
							radius: ['50%', '70%'],
							avoidLabelOverlap: false,
							label: {
								show: false,
								position: 'center'
							},
							emphasis: {
								label: {
									show: true,
									fontSize: '30',
									fontWeight: 'bold'
								}
							},
							labelLine: {
								show: false
							},
							data: [
								{value: 335, name: '直接访问'},
								{value: 310, name: '邮件营销'},
								{value: 234, name: '联盟广告'},
								{value: 135, name: '视频广告'},
								{value: 1548, name: '搜索引擎'}
							]
						}
					]
				
				};
				echarts.init(document.getElementById(container)).setOption(option);
            },
	
			//查询
			query() {
				let para = {
					date: this.value,
					personId: this.$route.params.personId
				};
				this.listLoading = true;
				getBraceletSummary(para).then((res) => {
					this.listLoading = false;
					if(res.code == 200){
						let xArr = []
						let xStudentArr = []
						let xTeacherArr = []
						let xLaborArr = []
						res.data.map(i=>{
							xArr.push(i.time)
							let s =i.onlineBracelet.filter(e=>{
								return e.type == 1
							})
							xStudentArr.push(s[0].count)
							let t =i.onlineBracelet.filter(e=>{
								return e.type == 2
							})
							xTeacherArr.push(t[0].count)
							let l =i.onlineBracelet.filter(e=>{
								return e.type == 3
							})
							xLaborArr.push(l[0].count)
						})

						this.drawColumnChart('chart',  xArr, xStudentArr, xTeacherArr, xLaborArr)


						
					}
				});


				getBuildingBraceletSummary(para).then((res) => {
					if(res.code == 200){
						this.maxValue = res.data.list.length-1
						this.summaryData = res.data.list
						this.img = "url(" + imgBase + res.data.aerialView+ ")"
						this.brightness = res.data.brightness
						this.topFive = res.data.list[0].topFive

						this.onlineData = this.dealData(res.data.list[0].onlineData)
						this.currentTime = res.data.list[0].time
					}
				});
			},

			dealData(data){
				data.map(i=>{
					let arr1 = i.list.filter(item=>{
						return item.type == 1
					})
					i.studentNum = arr1[0].count
					let arr2 = i.list.filter(item=>{
						return item.type == 2
					})
					i.teacherNum = arr2[0].count
					let arr3 = i.list.filter(item=>{
						return item.type == 3
					})
					i.laborNum = arr3[0].count
					if(Number(i.totalCount)==0){
						i.type = 1
					}else if(1<=Number(i.totalCount)&&Number(i.totalCount)<=100){
						i.type = 2
					}else if(101<=Number(i.totalCount)&&Number(i.totalCount)<=300){
						i.type = 3
					}else if(301<=Number(i.totalCount)){
						i.type = 4
					}
				})
				return data
			},

			back(){
				window.history.go(-1)
			},

			getCurrentDate(){
				var day = new Date();
				day.setTime(day.getTime());
				var s = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
				return s
			},

		},
		beforeMount(){
			this.value = this.getCurrentDate()
		},
		mounted() {
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
	  z-index: 99999;

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
	h3{
		padding-top: 40px;
		margin: 0;
		display: inline-block;
	}
	.slider-box{
		padding: 0 40px;
		margin-top: 35px;
	}
	#map-box{
		height: 618px;
		width: 868px;
		background-size: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 3;
		/* background-color: red; */
	}
	#map-box-mask{
		position: absolute;
		left: 0;
		top: 0;
		height: 618px;
		width: 868px;
		z-index: 5;
		
		
	}
	section{
		padding-bottom: 100px;
	}
	.map-content{
		margin-bottom: 50px;
		height: 618px;
		position: relative;
	}
	.tooltip-box{
		width: 140px;
		height: 100px;
		position: absolute;
		z-index: 99999999999999;
		background: #fff;
		/* opacity: 0.78; */
		padding: 5px 10px;
		border-radius: 5px;
		top: -120px;
		left: -60px;
		display: none;
	}
	.tooltip-box h4{
		margin: 0;
		color: #000;
		font-size: 12px;
		font-weight: 400;
	}
	.location-img{
		width: 20px;
		height: 20px;
		position: absolute;
		/* z-index: 999; */
		left: 100px;
		top: 100px;
	}
	.location-img:hover .tooltip-box{
		display: block;
	}
	.location-img img{
		width: 100%;
		height: 100%;
		z-index: 9;
		position: absolute;
		left: 0;
		top: 0;
	}
	.right-box{
		height: 618px;
		width: 300px;
		margin-left: 868px;
		padding: 10px;
		box-sizing: border-box;
		color: #444;
	}
	.right-box>h4{
		text-align: center;
	}
	.right-box-item{
		height: 100px;
		padding: 10px 0;
		padding-left: 30px;
	}
	.right-box-item-left{
		width: 140px;
		height: 100%;
		float: left;
	}
	.right-box-item-right{
		width: 100px;
		height: 100%;
		float: left;
	}
	.right-box-item-left>h4{
		min-height: 40px;
		
	}
	h4,h6,h2{
		padding: 0;
		margin: 0;
		color: #444;
	}
	.circle {
		width: 100px;
		height: 100px;  
		position: absolute;
		border-radius: 50%;
		background: #99d5fd;
	}
	.circle_left, .circle_right 
	{
		width: 100px; 
		height: 100px;
		position: absolute;
		top: 0;left: 0;
	}
	.left, .right
	{
		display: block;
		width:100px; 
		height:100px;
		background:#e9e9e9;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
		transform: rotate(0deg);
	}
	.circle_right, .right {
		clip:rect(0,auto,auto,50px);
	}
	.circle_left, .left {
		clip:rect(0,50px,auto,0);
	}
	.mask {
		width: 75px;
		height: 75px;
		border-radius: 50%;
		left: 12px;
		top: 12px;
		background: #FFF;
		position: absolute;
		text-align: center;
		line-height: 75px;
		font-size: 16px;
	}
</style>