<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入时段名称"></el-input>
				</el-form-item>
				有效星期：
				<el-select v-model="filters.week" placeholder="请选择">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				状态：
				<el-select v-model="filters.status" placeholder="请选择">
					<el-option label="全部" value=""></el-option>
					<el-option label="有效" value="1"></el-option>
					<el-option label="过期" value="2"></el-option>
					<el-option label="未开始" value="3"></el-option>
				</el-select>
			
				<el-form-item>
					<el-button type="primary" v-on:click="getEntryMacList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row  @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column prop="index" label="序号" width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="name" label="时段名称" width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="period" label="有效期" min-width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="week" label="有效星期" min-width="120">
			</el-table-column>
			<el-table-column prop="timeSections" label="有效时区" min-width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="nextTimeSlot" label="关联时间序号" min-width="120">
				 <template scope="scope">
					<span >{{scope.row.nextTimeSlot==0?"":scope.row.nextTimeSlot}}</span>
					<el-button v-if="scope.row.nextTimeSlot>0" type="text" @click="preView(scope.$index, scope.row)">预览</el-button>
                </template>
			</el-table-column>
			<el-table-column prop="updateTime" label="更新时间" width="200" :show-overflow-tooltip="true" :formatter="formatTime">
			</el-table-column>
			<el-table-column prop="status" label="状态" min-width="100">
				 <template scope="scope">
					<span v-if="scope.row.status== 1">有效</span>
					<span v-if="scope.row.status== 2" style="color: #ff0000">过期</span>
					<span v-if="scope.row.status== 3">未开始</span>
                </template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="total, prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--预览界面-->
		<el-dialog title="预览" width="80%" class="preview-dialog" v-model="previewVisible" :close-on-click-modal="false">
		
			<div :key="item.index" v-for="(item, index) in preViewData" >
				<div v-show="index>0" class="img-div">
					<img src="../../assets/arrow-down.png" alt=""> 关联时段
				</div>
				<table class="preview-table" v-bind:class="{ tableRed: item.status==2 }" border="1" cellspacing="0" style="border-collapse:collapse;" cellpadding="0">
					<thead>
						<tr>
							<td>序号</td>
							<td>时段名称</td>
							<td>有效期</td>
							<td>有效星期</td>
							<td>有效时区</td>
							<td>状态</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{item.index}}</td>
							<td>{{item.name}}</td>
							<td>{{item.period}}</td>
							<td>{{item.week}}</td>
							<td>{{item.timeSections}}</td>
							<td>{{formatStatus(item.status)}}</td>
						</tr>
					</tbody>
				</table>
			</div>
	
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="previewVisible = false">关闭</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加终端" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
				<el-form-item label="终端名称" prop="name">
					<el-input v-model="addForm.devName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="终端MAC(唯一标识符)">
					<el-select v-model="addForm.devSn" filterable placeholder="请选择">
						<el-option
							v-for="item in deviceList"
							:key="item.devSn"
							:label="item.devSn"
							:value="item.devSn">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="终端类型">
					<el-select v-model="addForm.devType" placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				
				<!-- <el-form-item label="所属建筑">
					<el-select v-model="addForm.buidingId" filterable placeholder="请选择" @change="buildChange">
						<el-option
							v-for="item in buildingList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="场所名称">
					<el-select v-model="addForm.placeId" filterable placeholder="请选择">
						<el-option
							v-for="item in placeList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="超级密码">
					<!-- <el-radio-group v-model="addForm.passwords">
						<el-radio class="radio" :label="1">启用</el-radio>
						<el-radio class="radio" :label="0">不启用</el-radio>
					</el-radio-group> -->
					<el-radio v-model="passwords" label="1">不启用</el-radio>
  					<el-radio v-model="passwords" label="2">启用</el-radio>
				</el-form-item>
				<el-form-item label="" prop="password1" v-show="passwords==2">
					<el-input v-model="addForm.password1" show-password placeholder="请输入第一组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="" prop="password2" v-show="passwords==2">
					<el-input v-model="addForm.password2" show-password placeholder="请输入第二组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="" prop="password3" v-show="passwords==2">
					<el-input v-model="addForm.password3" show-password placeholder="请输入第三组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="" prop="password4" v-show="passwords==2">
					<el-input v-model="addForm.password4" show-password placeholder="请输入第四组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="门禁抓拍摄像头">
					<!-- <el-radio-group v-model="useCamera"> -->
					<el-radio class="radio" v-model="useCamera"  label="0">不启用</el-radio>
					<el-radio class="radio" v-model="useCamera"  label="1">启用</el-radio>
					<!-- </el-radio-group> -->
				</el-form-item>
					<el-form-item label="" prop="camera1" v-show="useCamera==1">
					<el-input v-model="addForm.camera1" show-password placeholder="请输入摄像头编号"></el-input>
				</el-form-item>
				<el-form-item label="" prop="camera2" v-show="useCamera==1">
					<el-input v-model="addForm.camera2" show-password placeholder="请输入摄像头编号"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, preViewEntryTime , deleteTimeSlot, getRelateTimeSlot, createDevice, deleteDevice,entryTimeSlot, getEntryMacList, getBuilds, getPlaces, getDeviceList, removeUser, batchRemoveUser, editUser, addUser , getRecord, checkOrder, cancelCheckOrder} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					kw: '',
					week: '',
					status: '',
				},
				
				preViewData: {},
				useCamera: "0",
				macType: "",
				buidingId: "",
				options: [{
					value: '',
					label: '全部'
					},{
					value: '1',
					label: '星期一'
					},{
					value: '2',
					label: '星期二'
					},{
					value: '3',
					label: '星期三'
					},{
					value: '4',
					label: '星期四'
					},{
					value: '5',
					label: '星期五'
					},{
					value: '6',
					label: '星期六'
					},{
					value: '7',
					label: '星期日'
					}],
				statusOptions: [{
					value: '',
					label: '全部'
					},{
					value: '1',
					label: '有效'
					},{
					value: '2',
					label: '过期'
					},{
					value: '3',
					label: '未开始'
					}],
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
			formatStatus: function (status) {
				// 状态(1：有效，2：过期，3：未开始)
				if(status==1){
					return "有效"
				}else if(status==2){
					return "过期"
				}else if(status==3){
					return "未开始"
				}
			},
			formatTime: function (row, column) {
				return util.formatDate.format(new Date(row.updateTime*1000), 'yyyy-MM-dd hh:mm:ss');
			},
			handleCurrentChange(val) {
				if(val==this.page) return
				this.page = val;
				let para = {
					kw: this.filters.kw,
					week: this.filters.week,
					status: this.filters.status,
					page: this.page,
					pageSize: 20
				};
				entryTimeSlot(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
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
					index: row.index
				}
				this.listLoading = true;
				getRelateTimeSlot(para).then((res) => {
					this.listLoading = false;
					this.previewVisible = true
					this.preViewData = res.data
				});
			},
			
			getDeviceList() {
				let para = {}
				this.listLoading = true;
				getDeviceList(para).then((res) => {
					this.listLoading = false;
					this.deviceList = res.data.dataList
					
				});
			},

			//获取列表
			getEntryMacList() {
				let para = {
					kw: this.filters.kw,
					week: this.filters.week,
					status: this.filters.status,
					page: 1,
					pageSize: 20
				};
				entryTimeSlot(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
					this.page = 1
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { index: row.index };
					deleteTimeSlot(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getEntryMacList();
					});
				}).catch(() => {

				});
			},

			//跳转到编辑界面
			handleEdit: function (index, row) {
				this.$router.push({ path: '/editEntryTime/'+ row.index });
			},
			//添加
			handleAdd: function () {
				this.$router.push({ path: '/addEntryTime' });
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							let param={
								"id": para.id,
								"bonus": para.bonus
							}
							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							checkOrder(param).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								if(res.code==0){
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.getEntryMacList();
								}else{
									this.$message({
										message: res.msg,
										type: 'error'
									});
								}
							
								this.$refs['editForm'].resetFields();
								this.previewVisible = false;
								
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				// debugger
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						// this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							// debugger
							let param ={
								devName: this.addForm.devName,
								devSn: this.addForm.devSn,
								devType: this.addForm.devType,
								buidId: this.addForm.buidingId,
								roomId: this.addForm.placeId,
								passwords: [this.addForm.password1, this.addForm.password2, this.addForm.password3, this.addForm.password4],
								cameraMacs: [this.addForm.camera1, this.addForm.camera2]
								
							}

							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							createDevice(param).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getEntryMacList();
							});
						// });
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		
		},
		mounted() {
			// this.buildChange();
			this.getEntryMacList();
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
   .preview-table{
	   /* margin-bottom: 30px; */
   }
   .preview-table thead{
	   background-color: #fafafa;
   }
  .preview-table tr td{
	  /* border: 1px solid red; */
	  padding: 5px 10px;
  }
  .img-div{
		padding: 10px 0;
		padding-left: 200px;
  }
  .img-div>img{
		width: 30px;
		height: 30px;
		vertical-align: middle;
		transform: rotate(-45deg);
 }
 .tableRed{
	 color: red;
 }
</style>