<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				终端名称：
				<el-select style="width: 600px;" v-model="value1" multiple placeholder="全部">
					<el-option
						v-for="item in options"
						:key="item.devSn"
						:label="item.devName"
						:value="item.devSn">
					</el-option>
				</el-select>&nbsp;&nbsp;&nbsp;&nbsp;
				<el-form-item class="query-btn">
					<el-button type="primary" v-on:click="entryDataRecords">查询</el-button>
					<!-- <el-button type="primary" v-on:click="play(3)">play</el-button> -->
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-col :span="24" class="ul-col">
			<li class="items items1" v-bind:class="{ putIn: showKeyframe}" v-show="showKeyframe">
				<div class="img-box">
					<img :src="newData.pic?imgBase + newData.pic:defaultImg" alt="">
					<p class="tag1" v-show="newData.status==1">
						<img src="../../assets/icon-notice.png" alt="">&nbsp;&nbsp;禁止通行
					</p>
					<!-- <p class="tag3">
						<img src="../../assets/icon-time.png" alt="">&nbsp;&nbsp;请假
					</p> -->
					<p class="tag2" v-bind:class="{ blue: newData.personType==1&&newData.inResidence==1, orage: newData.personType==1&&newData.inResidence==2}">
						{{newData.personType==1?(newData.inResidence==1?"住读":"走读"):newData.personType==2?"教师":"职工"}}
					</p>
				</div>
				<p class="info-top">
					<span class="person-name">{{newData.personName}}</span>
					<span class="entry-type">{{newData.entryType==1?"进校":"出校"}}</span>
				</p>
				<p v-show="newData.personType==1">{{newData.gradeName}}</p>
				<p>{{formatTime(newData.entryTime)}}</p>
				<p>{{newData.devName}}</p>
			</li>
			<div class="ul-wrap">
				<li class="items" :key="index" v-for="(item, index) in list">
					<div class="img-box">
						<img :src="item.pic?imgBase + item.pic:defaultImg" alt="">
						<p class="tag1" v-show="item.status==1">
							<img src="../../assets/icon-notice.png" alt="">&nbsp;&nbsp;禁止通行
						</p>
						<!-- <p class="tag3">
							<img src="../../assets/icon-time.png" alt="">&nbsp;&nbsp;请假
						</p> -->
						<p class="tag2" v-bind:class="{ blue: item.personType==1&&item.inResidence==1, orage: item.personType==1&&item.inResidence==2}">
							{{item.personType==1?(item.inResidence==1?"住读":"走读"):item.personType==2?"教师":"职工"}}
						</p>
					</div>
					<p class="info-top">
						<span class="person-name">{{item.personName}}</span>
						<span class="entry-type">{{item.entryType==1?"进校":"出校"}}</span>
					</p>
					<p v-show="item.personType==1">{{item.gradeName}}</p>
					<p>{{formatTime(item.entryTime)}}</p>
					<p>{{item.devName}}</p>
				</li>
			</div>
		</el-col>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="total, prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	
		<video id="audio" style="display: none;" 
			controls="controls"
			src="">
		</video>
		<!-- <iframe id="audio" allow="autoplay" style="display:none" src="../../assets/voice/1.mp3"></iframe> -->
		<!-- <audio id="audio" controls="controls" hidden>
			<source src=""/>
		</audio> -->
		<!-- <iframe allow="autoplay" style="display:none" src = "http://fjdx.sc.chinaz.com/Files/DownLoad/sound1/201808/10467.wav"/> -->
	</section>
</template>

<script>
	import {mapState, mapGetters, mapActions} from 'vuex';
	import util from '../../common/js/util'
	import {imgBase } from '../../config.js'
	let audio1 = require('../../../static/voice/不允许通行.mp3')
	let audio2 = require('../../../static/voice/住校生.mp3')
	let audio3 = require('../../../static/voice/卡片已挂失.mp3')
	let audio4 = require('../../../static/voice/教师卡.mp3')
	let audio5 = require('../../../static/voice/职工卡.mp3')
	let audio6 = require('../../../static/voice/走读生.mp3')

	//import NProgress from 'nprogress'
	import { getUserListPage, getAllDevices, getPersonByChipNo, entryDataRecords, createDevice, getEntryMacList, getBuilds, getPlaces, getDeviceList, removeUser, batchRemoveUser, editUser, addUser , getRecord, checkOrder, cancelCheckOrder} from '../../api/api';

	export default {
		data() {
			return {
				imgBase: imgBase,
				defaultImg: require('../../assets/default.png'),
				socketUrl: "",
				devSns: [],
				list: [],
				newData: {},
				filters: {
					kw: '',
					devType: '',
					buildId: '',
					status: '',

				},
				value1: [],
				options: [],
				useCamera: "0",
				macType: "",
				buidingId: "",
				curStatus: '',
				deviceList: [],
				placeList: [],
				users: [],
				total: 0,
				page: 1,

				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				showKeyframe: false,
				ws: ''
			}
		},
		computed:{
			// ...mapState({  //这里的...是超引用，ES6的语法，意思是state里有多少属性值我可以在这里放多少属性值
			// 	buildingList: state=>state.common.buildingList //注意这些与上面的区别就是state.footerStatus,
			// }),
			...mapGetters('common',{ //用mapGetters来获取collection.js里面的getters
				buildingList: 'renderBuilding'
			})
		},
		methods: {
			...mapActions('common',[ //collection是指modules文件夹下的collection.js
				'invokePushItems'  //collection.js文件中的actions里的方法，在上面的@click中执行并传入实参
			]),

			formatTime: function (timeStep) {
				return util.formatDate.format(new Date(timeStep*1000), 'yyyy-MM-dd hh:mm:ss');
			},
			getPersonByChipNo(obj) {
				let _this = this
				let para = {
					chipNo: obj.cardNo
				};
				getPersonByChipNo(para).then((res) => {
					if(res.code==200){
						if(Array.isArray(res.data)){

						}else{
							let devName=''
							_this.options.map(item=>{
								if(item.devSn==obj.iDevSn){
									devName = item.devName
								}
							})
							let object = Object.assign({
								devName: devName,
								entryType: obj.direction.toString(),
								status: obj.valid==1?0:1,
							 	entryTime: new Date(obj.dateTime).getTime()/1000}, res.data);
							_this.newData = object
							console.log(object)
							if(obj.valid == 0){
								if(_this.newData.cardStatusId==2){
									_this.play(3)
								}else{
									_this.play(1)
								}
							}else{
								if(res.data.personType==1){//学生
									if(res.data.inResidence==1){//1: 住读, 2: 走读
										_this.play(2)
									}else{
										_this.play(6)
									}
								}else if(res.data.personType==2){
									_this.play(4)
								}else if(res.data.personType==3){
									_this.play(5)
								}
							}
							_this.showKeyframe = true
							setTimeout(() => {
								_this.list.pop()
								_this.list = [object, ..._this.list]
								_this.showKeyframe = false
								console.log(_this.list)
							}, 1000);

						}
					}
				});
			},
			handleCurrentChange(val) {
				if(val==this.page) return
				this.page = val;
				let para = {
					page: this.page,
					pageSize: 20,
					devSns: this.value1&&this.value1.join(",")||''
				};
				entryDataRecords(para).then((res) => {
					if(res.code==200){
						this.list = res.data.dataList
						this.total = res.data.totalCount
					}
				});
			},
			
		
			getAllDevices() {
				let para = {}
				getAllDevices(para).then((res) => {
					if(res.code==200){
						this.options = res.data
						let devSns = []
						res.data.map(item=>{
							devSns.push(item.devSn)
						})
						this.devSns = devSns
					}
				});
			},

			entryDataRecords() {
				let para = {
					page: 1,
					pageSize: 20,
					devSns: this.value1&&this.value1.join(",")||''
				};
				entryDataRecords(para).then((res) => {
					if(res.code==200){
						this.list = res.data.dataList
						this.total = res.data.totalCount
					}
				});
			},
			
			play(type) {

				let buttonAudio = document.getElementById('audio');
				buttonAudio.pause()
				switch (type) {
					case 1:
						buttonAudio.setAttribute('src', audio1)
						break;
					case 2:
						buttonAudio.setAttribute('src', audio2)
						break;
					case 3:
						buttonAudio.setAttribute('src', audio3)
						break;
					case 4:
						buttonAudio.setAttribute('src', audio4)
						break;
					case 5:
						buttonAudio.setAttribute('src', audio5)
						break;
					case 6:
						buttonAudio.setAttribute('src', audio6)
						break;
					default:
						break;
				}
				buttonAudio.play()
			},
			socket() {
				let _this = this
				this.ws = new WebSocket(this.socketUrl);
				// 建立 web socket 连接成功触发事件
				this.ws.onopen = function () {
					console.log("连接建立")
					// 使用 send() 方法发送数据
					setTimeout(_this.ws.send(JSON.stringify("keep-alive")),15000);
				};
				this.ws.onmessage = function (evt) {
					console.log("收到消息")
					var received_msg = JSON.parse(evt.data);
					console.log(received_msg)
					if(this.page===1) return
					if(received_msg.cardNo){
						if(_this.value1.length==0&&_this.devSns.includes(received_msg.iDevSn.toString())){
							_this.getPersonByChipNo(received_msg)
							console.log("发请求")
						}else if(_this.value1.length>0&&_this.value1.includes(received_msg.iDevSn.toString())){
							_this.getPersonByChipNo(received_msg)
							console.log("发请求")
						}
					}
				}
				// 断开 web socket 连接成功触发事件
				this.ws.onclose = function (evt) {
					console.log('连接已关闭。');
				};
			}


		},
		created(){
			this.socketUrl = 'ws://' + sessionStorage.getItem("socketUrl")
		},
		mounted() {
			this.getAllDevices()
			this.entryDataRecords()
			this.socket();
			
		},
		destroyed(){
			this.ws.close();
		}

	}

</script>

<style scoped>
 .el-tooltip__popper {
    max-width: 10px;
    /* line-height: 180%; */
  }
  .query-btn{
	  vertical-align: middle;
	  margin-top: 5px;
  }
  .toolbar{
	  padding-bottom: 10px!important;
  }
  .ul-wrap, .items{
	  list-style: none;
	 	position: relative;
  }
   .items{
	   height: 400px;
	   width: 210px;
	   float: left;
	   margin: 0px 10px 10px 0;
	   background-color: #eee;
	   padding: 10px;
   }

    .img-box>img{
	   height: 230px;
	   width: 100%;
	   object-fit: cover;
   }
   .items>p{
	   font-size: 18px;
	   padding: 2px 0;
	   margin: 0;
   }
   .img-box{
	   position: relative;
	   height: 280px;
	   background: #cacaca;
   }
    .img-box>.tag1{
	   position: absolute;
	   bottom: 50px;
	   margin: 0;
	   width: 100%;
	   font-size: 24px;
	   height: 50px;
	   display: flex;
	   justify-content: center;
	   align-items: center;
	   background-color: rgba(0, 0, 0, 0.2);
	   color: #f61617;
	}
	.img-box>.tag3{
	   position: absolute;
	   bottom: 50px;
	   margin: 0;
	   width: 100%;
	   font-size: 24px;
	   height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
	   background-color: rgba(0, 0, 0, 0.2);
	   color: #f4ea29;
	}
	
   .img-box>.tag2{
	   position: absolute;
	   bottom: 0px;
	   height: 50px;
	   margin: 0;
	   width: 100%;
	   font-size: 24px;
	   line-height: 50px;
	   text-align: center;
	   background-color: #fff;
   }
   .tag1>img{
	   width: 36px;
   }
   .info-top .entry-type{
	   float: right;
   }
   .blue{
	   background: #469cfd!important;
   }
   .orage{
	   background: #f39800!important;
   }
   .ul-col{
	   position: relative;
   }
   @keyframes fade-in {  /*定义关键帧*/
        0%{
			display: block;
            transform:  scale(1);  /*开始为原始大小*/
            opacity:0;
            position: absolute;
            left:40%;top:10%;
			z-index: 999999;
        }
        25%{
			display: block;
            transform: scale(1.5);
            opacity:0;
            position: absolute;
            left:40%;top: 10%;
			z-index: 999999;
        }

        50%{
			display: block;
            transform: scale(2);
            opacity:1;
            position: absolute;
            left:40%;top:10%;
			z-index: 999999;
        }
        75%{
			display: block;
            transform: scale(1.5);
            opacity:1;
            position: absolute;
            left:20%;top:5%;
			z-index: 999999;
        }
        100%{
			display: none!important;
            transform:  scale(1);
            opacity:1;
            position: absolute;
            left:0%;top:0%;
			z-index: 999999;
			
        }

    }
    .putIn {

        /*animation: fade-in;!*动画名称*!*/
        /*animation-duration: 0.5s;!*动画持续时间*!*/
        /*-webkit-animation:fade-in 0.5s;!*针对webkit内核*!*/
        /*z-index: 1000;*/
        -webkit-animation-name: fade-in; /*关键帧名称*/
        -webkit-animation-timing-function: linear ; /*动画的速度曲线*/
        -webkit-animation-iteration-count: 1;  /*动画播放的次数*/
        -webkit-animation-duration: 1s; /*动画所花费的时间*/
		animation-fill-mode: forwards;
    }
	.ul-wrap>.items:first-child{
		transition: margin-left 0.5s;
		/* margin-left: 100px; */
	}
	.items1 .tag1{
		/* display: none; */
	}
</style>