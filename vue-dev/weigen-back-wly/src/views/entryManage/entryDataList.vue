<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入姓名/终端名称/场所名称"></el-input>
				</el-form-item>
				<el-date-picker
					v-model="filters.date"
					type="datetimerange"
					@change="getSTime"
					placeholder="打卡时间"
					range-separator=" ~ "
					start-placeholder="开始日期"
					end-placeholder="结束日期">
				</el-date-picker>
				终端类型：
				<el-select v-model="filters.devType" style="width:100px;" placeholder="请选择">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				状态：
				<el-select v-model="filters.status" style="width:100px;" placeholder="请选择">
					<el-option label="全部" value=""></el-option>
					<el-option label="正常" value="0"></el-option>
					<el-option label="异常" value="1"></el-option>
				</el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="queryTeacher">查询</el-button>
				</el-form-item>
				<el-form-item>
					<a class="export-btn" :href= exportUrl  v-on:click="exportRecord">导出</a>
				</el-form-item>
				
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="teacherRecord" highlight-current-row style="width: 100%;">
			<el-table-column prop="personName" label="姓名" min-width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="telephone" label="手机号" min-width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="depart" label="所属组织" min-width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" min-width="200" :show-overflow-tooltip="true" :formatter="formatTime">
			</el-table-column>
			<el-table-column prop="entryTime" label="打卡时间" min-width="200" :show-overflow-tooltip="true" :formatter="formatTime1">
			</el-table-column>
			<el-table-column prop="devName" label="终端名称" min-width="200" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="devType" label="终端类型" min-width="100" :show-overflow-tooltip="true" :formatter="formaType">
			</el-table-column>
			<el-table-column prop="status" label="状态" min-width="120" :show-overflow-tooltip="true" :formatter="formatStatus">
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="total, prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		
	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import {base} from '../../config.js'
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { entryDataRecords, entryDataExport} from '../../api/api';

	export default {
		data() {
			return {
				exportUrl: '',
				filters:{
					kw: '',
					date: '',
					status: '',
					devType: '',
				},
				timeArr:[],
				options: [{
					value: '',
					label: '全部'
					},{
					value: '1',
					label: '闸机'
					},{
					value: '2',
					label: '单立柱'
				}],
				page: 1,
				total: 0,
				teacherRecord: [],
			}
		},
		computed:{
	
		},
		methods: {

			exportRecord: function(){
				let userId = sessionStorage.getItem("userId");
				let accessToken = sessionStorage.getItem("token");
				let kw = this.filters.kw||'';
				let devType = this.filters.devType||'';
				let status = this.filters.status||'';
				let startTime = this.dateToTimestemp(this.timeArr[0])||'';
				let endTime = this.dateToTimestemp(this.timeArr[1])||'';
				let url = base + "/manager/entry-data/export?userId="+userId+"&accessToken="+accessToken+"&kw="+kw+"&devType="+devType+"&status="+status+
						+"&startTime="+startTime+"&startTime="+startTime+"&endTime="+endTime
				this.exportUrl = url
			},
			formaDirect: function (row, column) {
				// 出入方式（1：进，2：出）
				if(row.inOutType==1){
					return "进"
				}else if(row.inOutType==2){
					return "出"
				}else{
					return "未知"
				}
			},
			formaType: function (row, column) {
				if(row.devType==1){
					return "闸机"
				}else if(row.devType==2){
					return "单立柱"
				}else{
					return "未知"
				}
			},

			getSTime(val) {
				if(val){
					this.timeArr = val.split("~")
				}else{
					this.timeArr = []
				}
			},
			
			formatStatus: function (row) {
				// 出入状态(0：正常，1：异常)
				if(row.status==0){
					return "正常"
				}else if(row.status==1){
					return "异常"
				}else{
					return "-"
				}
			},
	
			formatTime: function (row, column) {
				return util.formatDate.format(new Date(row.createTime*1000), 'yyyy-MM-dd hh:mm:ss');
			},
			formatTime1: function (row, column) {
				if(row.entryTime){
					return util.formatDate.format(new Date(row.entryTime*1000), 'yyyy-MM-dd hh:mm:ss');
				}else{
					return "-"
				}
			},
			dateToTimestemp: function(timeDate){
				// var timeDate = "2019-05-09 14:50:48";
				return new Date(timeDate).getTime()/1000||""
			},

			handleCurrentChange(val) {
				if(val==this.page) return
				this.page = val;
				let para = {
					kw: this.filters.kw||'',
					status: this.filters.status||'',
					devType: this.filters.devType||'',
					startTime: this.dateToTimestemp(this.timeArr[0]),
					endTime: this.dateToTimestemp(this.timeArr[1]),
					page: this.page,
					pageSize: 20
				}
				entryDataRecords(para).then((res) => {
					this.teacherRecord = res.data.dataList
					this.total = res.data.totalCount
				});
			},
	

			queryTeacher(){
				let para = {
					kw: this.filters.kw,
					status: this.filters.status,
					devType: this.filters.devType,
					startTime: this.dateToTimestemp(this.timeArr[0]),
					endTime: this.dateToTimestemp(this.timeArr[1]),
					page: 1,
					pageSize: 20
				}
				entryDataRecords(para).then((res) => {
					this.teacherRecord = res.data.dataList
					this.total = res.data.totalCount
					this.page = 1
				});
			},

		
		},
		mounted() {
			this.queryTeacher();
		}
	}

</script>

<style >
 .el-tooltip__popper {
    /* max-width: 10px; */
    /* line-height: 180%; */
  }
  .preview-dialog .el-dialog{
	  width: 80%!important;
  }
   .preview-table thead{
	   background-color: #fafafa;
   }
  .preview-table tr td{
	  /* border: 1px solid red; */
	  padding: 5px 10px;
  }
  .preview-img{
	  width: 100%;
  }

  .export-btn{
	  height: 40px;
	  width: 70px;
	  background-color: #FF4040;
	  text-align: center;
	  line-height: 40px;
	  text-decoration: none;
	  color: #fff;
	  display: block;
	  border-radius: 4px;
  }
   .export-btn:hover{
	   opacity: 0.8;
   }
</style>