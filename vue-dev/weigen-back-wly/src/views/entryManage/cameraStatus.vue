<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入摄像头MAC/终端名称/终端MAC"></el-input>
				</el-form-item>
				状态：
				<el-select v-model="filters.status" placeholder="请选择">
					<el-option label="全部" value="-1"></el-option>
					<el-option label="在线" value="1"></el-option>
					<el-option label="离线" value="0"></el-option>
				</el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getEntryMacList">查询</el-button>
				</el-form-item>
			
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="cameraSn" label="摄像头MAC" min-width="120">
			</el-table-column>
			<el-table-column prop="devName" label="绑定终端名称" width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="entryDevSn" label="终端MAC" min-width="120">
			</el-table-column>
			<el-table-column prop="status" label="当前状态" min-width="100">
				 <template scope="scope">
					<span v-if="scope.row.status== 0" style="color: #ff0000">离线</span>
					<span v-if="scope.row.status== 1" style="color: #20a0ff">在线</span>
                </template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="text" @click="toDetail(scope.$index, scope.row)">历史记录</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


		
	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, createDevice, entryCamera, deleteDevice, getEntryMacList, getBuilds, getPlaces, getDeviceList, removeUser, batchRemoveUser, editUser, addUser , getRecord, checkOrder, cancelCheckOrder} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					kw: '',
					status: '-1'
				},
				useCamera: "0",
				macType: "",
				buidingId: "",
				status: '',
				deviceList: [],
				placeList: [],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
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
			//去历史记录详情
			toDetail: function (index, row) {
				this.$router.push({ path: '/cameraStatusQuery/'+row.cameraSn });
			},
			formatTime: function (row, column) {
				return util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss');
			},
			handleCurrentChange(val) {
				if(val==this.page) return
				this.page = val;
				let para = {
					kw: this.filters.kw,
					status: this.filters.status,
					page: this.page,
					pageSize: 20
				};
				entryCamera(para).then((res) => {
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
			buildChange(value){
				console.log(value)
				let para = {
					buildId: value
				}
				this.listLoading = true;
				getPlaces(para).then((res) => {
					this.listLoading = false;
					this.placeList = res.data;
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
					status: this.filters.status,
					page: 1,
					pageSize: 20
				};
				entryCamera(para).then((res) => {
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
					let para = { devSn: row.devSn };
					deleteDevice(para).then((res) => {
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
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;

				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
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
								this.editFormVisible = false;
								
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
		
			this.getEntryMacList();
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