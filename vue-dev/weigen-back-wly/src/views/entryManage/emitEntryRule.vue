<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" v-on:click="handleDistribute(1)">全量下发策略</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleDistribute(2)">增量下发策略</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getEntryRuleSend">刷新</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="devName" label="终端名称" min-width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="devType" label="终端类型" min-width="120" :show-overflow-tooltip="true" :formatter="formaType">
			</el-table-column>
			<el-table-column prop="devSn" label="终端MAC" min-width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="sendTime" label="末次下发时间" min-width="200" :show-overflow-tooltip="true" :formatter="formatTime">
			</el-table-column>
			<el-table-column prop="status" label="状态" min-width="120" :show-overflow-tooltip="true" :formatter="formatStatus">
			</el-table-column>
			<el-table-column prop="executeTime" label="成功时间" width="200" :show-overflow-tooltip="true" :formatter="formatTime1">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="text" v-if="scope.row.status==2" size="small" @click="handleEmit(scope.$index, scope.row)">重试</el-button>
				</template>
			</el-table-column>
		</el-table>
	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, distribute, distributeByDevsn, getEntryRule, preViewEntryTime , createDevice, deleteDevice, getEntryRuleSend, getBuilds, getPlaces, getDeviceList, removeUser, batchRemoveUser, editUser, addUser , getRecord, checkOrder, cancelCheckOrder} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				preViewData: {},
				useCamera: "0",
				macType: "",
				buidingId: "",
				type: '',
		
				deviceList: [],
				placeList: [],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				previewVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					devName: [
						{ required: true, message: '请输入终端名称', trigger: 'blur' }
					],
					devSn: [
						{ required: true, message: '请选择终端MAC', trigger: 'change' }
					],

				},
				//新增界面数据
				addForm: {
					devName: '',
					devSn: '',
					devType: '',
					buidingId: '',
					placeId: '',
					useCamera: "1",
					password1: '',
					password2: '',
					password3: '',
					password4: '',
					camera1: '',
					camera2: ''
				},
				passwords: "1"

			}
		},
		computed:{
		
		},
		methods: {
		
			formaType: function (row, column) {
				if(row.devType==1){
					return "闸机"
				}else if(row.devType==2){
					return "单立柱"
				}else{
					return "未知"
				}
			},
			formatWeek: function (weekArr) {

				if(typeof weekArr=="Object"){
					let str = ''
					str+=weekArr.map(item=>{

						if(item==1){
							return "星期一"
						}else if(item==2){
							return "星期二"
						}else if(item==3){
							return "星期三"
						}else if(item==4){
							return "星期四"
						}else if(item==5){
							return "星期五"
						}else if(item==6){
							return "星期六"
						}else if(item==7){
							return "星期日"
						}
					})
					return str
				}
				
			},
			formatStatus: function (row) {
				// 0：下发中，1：下发成功，2：下发失败
				if(row.status==0){
					return "下发中"
				}else if(row.status==1){
					return "下发成功"
				}else if(row.status==2){
					return "下发失败"
				}
			},
			formatTime: function (row, column) {
				return util.formatDate.format(new Date(row.sendTime*1000), 'yyyy-MM-dd hh:mm:ss');
			},
			formatTime1: function (row, column) {
				if(row.executeTime&&row.status!=2){
					return util.formatDate.format(new Date(row.executeTime*1000), 'yyyy-MM-dd hh:mm:ss');
				}else{
					return "-"
				}
			},

			handleDistribute(type){
				let para = {
					type: type
				}
				distribute(para).then((res) => {
					if(res.code==200){
						this.$message({
							message: '操作成功',
							type: 'success'
						});
						this.getEntryRuleSend();
					}else{
						this.$message({
							message: res.msg,
							type: 'error'
						});
					}
				});
			},
			//获取建筑
			getBuilds() {
				let para = {}
				this.listLoading = true;
				getBuilds(para).then((res) => {
					this.listLoading = false;
					this.invokePushItems(res.data)
				});
			},
			preView(index, row){
				let para = {
					id: row.index
				}
				this.listLoading = true;
				preViewEntryTime(para).then((res) => {
					this.listLoading = false;
					this.previewVisible = true
					this.preViewData = res.data
				});
			},
			

			//获取列表
			getEntryRuleSend() {
				let para = {
				
				};
				this.listLoading = true;
				getEntryRuleSend(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data;
					this.listLoading = false;
				});
			},

			//重新下发
			handleEmit: function (index, row) {
				let param={
					"devSn": row.devSn
				}
				distributeByDevsn(param).then((res) => {
					if(res.code==200){
						this.$message({
							message: '操作成功',
							type: 'success'
						});
						this.getEntryRuleSend();
					}else{
						this.$message({
							message: res.msg,
							type: 'error'
						});
					}
					
				});
			},
	
		
			selsChange: function (sels) {
				this.sels = sels;
			},
		
		},
		mounted() {
			// this.buildChange();
			this.getEntryRuleSend();
			// this.getBuilds();
			// this.getDeviceList();
			// debugger;
			// this.invokePushItems([1,2,3,4])
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
</style>