<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入终端识别号/终端名称"></el-input>
				</el-form-item>
				当前状态：
				 <el-select v-model="filters.status" placeholder="请选择">
					 <el-option label="全部" value="-1"></el-option>
					 <el-option label="在线" value="1"></el-option>
					 <el-option label="离线" value="0"></el-option>
				</el-select>
				<el-form-item>
					<el-button type="primary" size="medium"  v-on:click="getThermometryDevices">查询</el-button>
				</el-form-item>
			
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="devSn" label="终端识别号" width="220">
			</el-table-column>
			<el-table-column prop="devName" label="终端名称" min-width="120">
			</el-table-column>
			<el-table-column prop="status" label="当前状态" min-width="100">
				 <template slot-scope="scope">
					<span v-if="scope.row.status== 0" style="color: #ff0000">离线</span>
					<span v-if="scope.row.status== 1" style="color: #20a0ff">在线</span>
                </template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="medium" type="text" @click="edit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="medium" type="text" @click="toDetail(scope.$index, scope.row)">历史记录</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<el-dialog title="编辑" width="60%" :visible.sync="editVisible" :close-on-click-modal="false">

			<div class="demo-input-suffix" >
				终端识别号：
				<el-input
					placeholder=""
					disabled="disabled"
					v-model="editDev.devSn">
				</el-input>
			</div>
			<div class="demo-input-suffix">
				终端名称：
				<el-input
					placeholder="请输入终端名称"
					v-model="editDev.devName">
				</el-input>
			</div>
			<div class="dialog-btn">
				<el-button size="medium" v-on:click="closeDialog">取消</el-button>
				<el-button type="primary" size="medium"  v-on:click="comfirmDialog">确定</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, createDevice, getThermometryDevices, getPlaces,  updateThermometryDevice, removeUser, batchRemoveUser, editUser, addUser , getRecord, checkOrder, cancelCheckOrder} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					kw: '',
					status: '-1',
				},
				editDev: {
					devSn: '',
					devName: ''
				},
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
				editVisible: false,
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
				
			}
		},
		computed:{
			
		},
		methods: {
			closeDialog(){
				this.editVisible = false
			},
			comfirmDialog(){
				let para = {
					devSn: this.editDev.devSn,
					devName: this.editDev.devName,
				};
				updateThermometryDevice(para).then((res) => {
					if(res.code == 200){
						this.$message({
							message: '数据更新成功！',
							type: 'success'
						});
						this.editVisible = false
						this.getThermometryDevices()
					}
				});
			},
			handleCurrentChange(val) {
				if(val==this.page) return
				this.page = val;
				let para = {
					kw: this.filters.kw,
					devType: this.filters.devType,
					buildId: this.filters.buildId,
					status: this.filters.status,
					page: this.page,
					prePage: 20
				};
				getThermometryDevices(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
				});
			},
	


			//获取列表
			getThermometryDevices() {
				let para = {
					kw: this.filters.kw,
					status: this.filters.status,
					page: 1,
					prePage: 20
				};
				getThermometryDevices(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
					this.page = 1
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认撤销该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					cancelCheckOrder(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '撤销成功',
							type: 'success'
						});
						// this.getUsers();
						this.getThermometryDevices();
					});
				}).catch(() => {

				});
			},
			//编辑
			edit: function (index, row) {
				this.editDev.devSn = row.devSn
				this.editDev.devName = row.devName
				this.editVisible = true
			},
			//去历史记录详情
			toDetail: function (index, row) {
				this.$router.push({ path: '/thermometryStatusQuery/'+row.devSn });
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
									this.getThermometryDevices();
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
		
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getThermometryDevices();
		}
	}

</script>

<style scoped>
 .el-tooltip__popper {
    max-width: 10px;
    /* line-height: 180%; */
  }
</style>