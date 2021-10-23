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
		<el-row class="map-box">
			<div class="track-box" >
				<div class="track-point" :key="index" v-for="(item, index) in trackArr" :style="{left : item.x - 65 + 'px', top: item.y -10 + 'px'}">
					<ul>
						<li :key="idx" v-for="(i, idx) in item.trackList">
							<p>{{i.buildName}} {{i.entryTime}}</p>
						</li>
					</ul>
				</div>
			</div>
			<canvas id="canvas"></canvas>
			<div id='map-box-mask' :style="{background: 'rgba(0, 0, 0,'+brightness/100+')'}"></div>
			<div id='map-box' :style="{backgroundImage: img}"></div>
		</el-row>
		<a href="javascript:;" @click="back" class="btn-return">返回</a>
	</section>
</template>

<script>
	import { mapState, mapGetters, mapActions} from 'vuex';
	import util from '../../common/js/util'
	import echarts from 'echarts'
	import {imgBase } from '../../config'
	//import NProgress from 'nprogress'
	import { getDailyData} from '../../api/api';

	export default {
		data() {
			return {
				value: "",
				brightness: '',
				img: '',
				trackArr: []
			}
		},
		methods: {
		
			dateChange(val) {
				console.log(val);
				this.value = val;
			},
			//查询
			query() {
				let para = {
					date: this.value,
					personId: this.$route.params.personId
				};
				this.listLoading = true;
				getDailyData(para).then((res) => {
					this.listLoading = false;
					if(res.code == 200){

						let trackArr = []
						let pointArr = []
						res.data.trackData.map(i=>{
							pointArr.push([Number(i.xCoordinate), Number(i.yCoordinate)])
							let obj = {}
							obj.x = Number(i.xCoordinate)
							obj.y = Number(i.yCoordinate)
							let dataArr = []
							let dataObj = {}
							dataObj.buildName = i.buildName
							dataObj.entryTime = i.entryTime
							let flag = false
							trackArr.map( item => {
								if(item.x == i.xCoordinate && item.y ==  i.yCoordinate){
									item.trackList.push(dataObj)
									flag = true
								}
							})
							if(!flag){
								dataArr.push(dataObj)
								obj.trackList = dataArr
								trackArr.push(obj)
							}
						})
						this.trackArr = trackArr
						this.img = "url(" + imgBase + res.data.aerialView+ ")"
						this.brightness = res.data.brightness
						this.drawImg(pointArr, res.data.aerialView)
					}
				});
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


			animate(ctx, points) {

				// ctx.drawImage(img, 0, 0);
				// ctx.fillStyle="rgba(0,0,0,0.6)";
				// ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				points.forEach(([x, y]) => {
					this.drawDot(ctx, x, y);
				});

				this.lineMove(ctx, points);
				// ctx.fillStyle="#fff";
				// ctx.font="30px Verdana";
				// ctx.fillText('World', 300,300);

			},
			lineMove(ctx, points, speed = 5) {

				if (!points||points.length < 2) {
					return;
				}

				// const [[x1, y1], [x2, y2]] = points;
				let [x1, y1] = points[0]
				let [x2, y2] = points[1]
				let dx = x2 - x1;
				let dy = y2 - y1;
				if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
					points = points.slice(1);
					this.lineMove(ctx, points);

					return;
				}
				let x = x1,
					y = y1; //线条绘制过程中的终点
				if (dx === 0) {
					(x = x2), (y += (speed * dy) / Math.abs(dy));
				} else if (dy === 0) {
					x += (speed * dx) / Math.abs(dx);
					y = y2;
				} else if (Math.abs(dx) >= 1) {
					let rate = dy / dx;
					x += (speed * dx) / Math.abs(dx);
					y += (speed * rate * dx) / Math.abs(dx);
				}
				x = parseInt(x)
				y = parseInt(y)
				this.drawLine(ctx, x1, y1, x2, y2);
				points = points.slice(1);

				// points[0] = [x, y];
				let _this = this
				window.requestAnimationFrame(function () {
					_this.lineMove(ctx, points, speed = 5);
					// console.log('8989898')
				});
			},
		
			drawLine(ctx, x1, y1, x2, y2) {

				ctx.clearRect(0,0,ctx.width,ctx.height);

				ctx.save();
				ctx.beginPath(); //不写每次都会重绘上次的线
				// ctx.lineCap = "round";
				// ctx.lineJoin = "round";

				// var grd = ctx.createLinearGradient(x1, y1, x2, y2);
			
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.closePath();
				ctx.strokeStyle = "#ffff02";
				ctx.stroke();
				ctx.restore();
			},
				
			drawDot(ctx, x1, y1) {

				ctx.save();
				ctx.beginPath(); //不写会和线连起来
				ctx.fillStyle = "#ffff02";
				//绘制成矩形
				ctx.arc(x1, y1, 5, 0, 10 * Math.PI);
				ctx.fill();
				ctx.restore();

			},

			drawImg(pointsArr, bgImg){
				let points = [
					[200, 100], //上
					[300, 200], //右
					[100, 200], //左
					[240, 100], //上
					[230, 300], //下
					[10, 200], //左
					[310, 200], //右
					[290, 300]
				];
				points = pointsArr
				// debugger

				const canvas = document.querySelector("canvas");
				const ctx = canvas.getContext("2d");
				

				// const img = new Image();
				const speed = 5; //速度
				// img.src = `http://test.qiniu.lepayedu.com/${bgImg}`;
				// // debugger
				// img.onload = function() {
					canvas.width = 868;
					canvas.height = 618;
					this.animate(ctx , points);
					

					
				// };
				
			}
	
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

   #canvas{
		background:rgba(255,255,255,0);/*关键点*/
		position:absolute;
		z-index:6;/*确保在遮盖的元素的上方*/
		top:0px;
		left:0px;
		height: 618px;
		width: 868px;
		/* margin-bottom: 50px; */
   }
   .bg-box{
	   width: 868px;
	   height: 618px;
	   /* background-color: tomato; */
   }
   .map-box-mask{
	   position: relative;

   }
   .bg-mask{
	   position: absolute;
	   left: 0;
	   top: 0;
	   width: 868px;
	   height: 618px;
   }
   	#map-box{
		height: 618px;
		width: 868px;
		background-size: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 3;
		height: 760px;
		background-repeat: no-repeat;
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
	.track-box{
		position: absolute;
		left: 0;
		top: 0;
		height: 618px;
		width: 868px;
		z-index: 9;
	}
	.track-point{
		width: 120px;
		min-height: 32px;
		padding: 5px;
		border-radius: 5px;
		background-color: #fff;
		position: absolute;
		transform: translateY(-100%);
	}
	.track-point ul{
		padding: 0;
		margin: 0;
	}
	.track-point ul li{
		list-style: none;
	}
	.track-point ul li p{
		padding: 0;
		margin: 0;
	}
</style>