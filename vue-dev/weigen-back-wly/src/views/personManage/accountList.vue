<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入账户名"></el-input>
				</el-form-item>
				<el-form-item>
				当前状态：
					<el-select v-model="filters.status" placeholder="请选择">
						<el-option label="全部" value="0"></el-option>
						<el-option label="启用" value="1"></el-option>
						<el-option label="禁用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAccountList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row style="width: 100%;">
			<el-table-column prop="accountName" label="账户名" min-width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="personName" label="所有人" min-width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="telephone" label="手机号" min-width="120">
			</el-table-column>
			<el-table-column prop="status" label="当前状态" min-width="100">
				 <template scope="scope">
					<span v-if="scope.row.status== 1">启用</span>
					<span v-if="scope.row.status== 2" style="color: #ff0000">禁用</span>
                </template>
			</el-table-column>
			<el-table-column prop="lastLoginTime" label="最后登陆时间" width="200" :show-overflow-tooltip="true" :formatter="formatTime">
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
			<el-pagination layout="total, prev, pager, next" :current-page="page"  @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm">
				<el-form-item label="账户名" prop="accountName">
					<el-input v-model="editForm.accountName" disabled style="width: 250px" :maxlength="30" placeholder="请输入" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="账户所有人" prop="relatePersonName">
					<el-input v-model="editForm.relatePersonName" style="width: 250px" disabled :maxlength="30" placeholder="请输入" auto-complete="off"></el-input>
					<el-button @click.native="selectBtn">选择</el-button>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="editForm.password" type='password' style="width: 250px" :maxlength="30" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPassword">
					<el-input v-model="editForm.checkPassword" type='password' style="width: 250px" :maxlength="30" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio v-model="editForm.status" label='2'>禁用</el-radio>
  					<el-radio v-model="editForm.status" label='1'>启用</el-radio>
				</el-form-item>
				<el-form-item label="超级管理员" prop="type">
					<el-radio v-model="editForm.type" label='2'>是&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
  					<el-radio v-model="editForm.type" label='1'>否</el-radio>
				</el-form-item>
			</el-form>
		
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updataAccountDetail">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="180px" :rules="addFormRules" ref="addForm">
				<el-form-item label="账户名" prop="accountName">
					<el-input v-model="addForm.accountName" style="width: 250px" :maxlength="30" placeholder="请输入" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="账户所有人" prop="relatePersonName">
					<el-input v-model="addForm.relatePersonName" style="width: 250px" disabled :maxlength="30" placeholder="请输入" auto-complete="off"></el-input>
					<el-button @click.native="selectBtn">选择</el-button>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password" type='password' style="width: 250px" :maxlength="30" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPassword">
					<el-input v-model="addForm.checkPassword" type='password' style="width: 250px" :maxlength="30" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio v-model="addForm.status" label='2'>禁用</el-radio>
  					<el-radio v-model="addForm.status" label='1'>启用</el-radio>
				</el-form-item>
				<el-form-item label="超级管理员" prop="type">
					<el-radio v-model="addForm.type" label='2'>是&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
  					<el-radio v-model="addForm.type" label='1'>否</el-radio>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>

		<!--选人界面-->
		<el-dialog title="选人" v-model="selectVisible" :close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters1" ref="selectForm">
					<el-form-item prop="kw">
						<el-input v-model="filters1.kw" style="width: 280px" placeholder="请输入账户所有人"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="searchPerson">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-table :data="personList" highlight-current-row style="width: 100%;">
				<el-table-column prop="personName" label="帐户名" min-width="120" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button type="text" size="small" @click="selectPerson(scope.$index, scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>

	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	const md5 = require('md5');
	//import NProgress from 'nprogress'
	import { getPersonDetail, updataPersonDetail, getAccountList, removeUser, batchRemoveUser, editUser,
	addPerson, searchPerson, createAccount,
	getAccountDetail, editAccount, deleteAccount
	} from '../../api/api';

	export default {
		data() {
			var checkPhone = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('手机号不能为空'));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
					console.log(reg.test(value));
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error('请输入正确的手机号'));
					}
				}
			};
			return {
				filters: {
					kw: '',
					status: '',
				},
				filters1: {
					kw: '',
				},
				input: '',
				users: [],
				personList: [],
				total: 0,
				page: 1,
				sels: [],//列表选中列
				selectVisible: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {
					accountName: '',
					relatePersonName: '',
					password: '',
					checkPassword: '',
					status: '',
					type: '',
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					accountName: [
						{ required: true, message: '请输入账户名', trigger: 'blur' }
					],
					relatePersonName: [
						{ required: false, message: '请选择', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur'  }
					],
					checkPassword: [
						{ required: true, message: '请输入密码', trigger: 'blur'  }
					],
					status: [
						{ required: true, message: '请选择状态', trigger: 'blur'  }
					],
					type: [
						{ required: true, message: '请选择超级管理员', trigger: 'blur'  }
					],
				},
				editFormRules: {
					accountName: [
						{ required: true, message: '请输入账户名', trigger: 'blur' }
					],
					relatePersonName: [
						{ required: false }
					],
					password: [
						{ required: false }
					],
					checkPassword: [
						{ required: false }
					],
					status: [
						{ required: true, message: '请选择状态', trigger: 'blur'  }
					],
					type: [
						{ required: true, message: '请选择超级管理员', trigger: 'blur'  }
					],
				},
	
				//新增界面数据
				addForm: {
					accountName: '',
					relatePersonName: '',
					password: '',
					checkPassword: '',
					status: '2',
					type: '1',
				},

			}
		},
		computed:{
			
		},
		methods: {
	
			selectBtn: function(){
				this.selectVisible = true
			},
			formatTime: function (row, column) {
				if(!row.lastLoginTime) return ''
				return util.formatDate.format(new Date(row.lastLoginTime*1000), 'yyyy-MM-dd hh:mm:ss');
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
				getAccountList(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
				});
			},
	
			searchPerson() {
				let para = {
					kw: this.filters1.kw,
				};
				searchPerson(para).then((res) => {
					this.personList = res.data;
				});
			},
			//获取列表
			getAccountList() {
				let para = {
					kw: this.filters.kw,
					status: this.filters.status,
					page: 1,
					pageSize: 20
				};
				getAccountList(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
					this.page = 1
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确定删除该账号吗?', '提示', {
					type: 'warning'
				}).then(() => {
					let para = { id: row.accountId };
					deleteAccount(para).then((res) => {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getAccountList();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				if(this.$refs.editForm){
					this.$refs.editForm.resetFields();
				}
				this.oldDevSn = row.accountId
				let param={
					"id": row.accountId
				}
				getAccountDetail(param).then((res) => {
					if(res.code==200){
						this.editFormVisible = true;
						this.editForm = Object.assign({}, res.data);
					
						// this.editForm.id = row.accountId;

					}else{
						this.$message({
							message: res.msg,
							type: 'error'
						});
					}
					
				})
			},
			//显示新增界面
			handleAdd: function () {
				this.placeList = []
				this.addFormVisible = true;
				this.$refs['addForm']&&this.$refs['addForm'].resetFields();
			},

			selectPerson: function (index, row) {
				if(this.$refs.selectForm){
					this.$refs.selectForm.resetFields();
				}
				if(this.addFormVisible==true){
					this.addForm.relatePersonId = row.personId
					this.addForm.relatePersonName = row.personName
				}else{
					this.editForm.relatePersonId = row.personId
					this.editForm.relatePersonName = row.personName
				}
				this.selectVisible = false
				this.personList = []
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						// this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let param = Object.assign({}, this.addForm);
							param.password = md5(param.password)
							param.checkPassword = md5(param.checkPassword)
							if(param.password!==param.checkPassword){
								this.$message({
									message: '密码输入不一致',
									type: 'error'
								});
								return
							}
							delete param.relatePersonName
							createAccount(param).then((res) => {
								if(res.code==200){
									this.$message({
										message: '添加成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getAccountList();
								}
							});
					}
				});
			},
			//更新
			updataAccountDetail: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						// this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let param = Object.assign({}, this.editForm);
							if(this.editForm.password||this.editForm.checkPassword){
								if(this.editForm.password!=this.editForm.checkPassword){
									this.$message({
										message: '密码输入不一致',
										type: 'error'
									});
									return
								}
								delete param.password
							}
						
							if(this.editForm.password&&this.editForm.checkPassword){
								param.password = md5(this.editForm.password)
								param.checkPassword = md5(this.editForm.checkPassword)
							}

							editAccount(param).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '更新成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getAccountList();
								// this.useCamera==0

							});
						// });
					}
				});
			},
		},
		mounted() {
			this.getAccountList();
		}
	}

</script>

<style scoped>
 .el-tooltip__popper {
    max-width: 10px;
    /* line-height: 180%; */
  }
 .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>