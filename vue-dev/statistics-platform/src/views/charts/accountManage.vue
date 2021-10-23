<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入账号名或持有人姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAccounts">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row style="width: 100%;">
			<el-table-column prop="account" label="账号" width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="realName" label="账号持有人" min-width="120">
			</el-table-column>
			<el-table-column prop="type" label="账号角色" min-width="120" :formatter="formatType">
			</el-table-column>
			<el-table-column prop="telephone" label="联系电话" min-width="120">
			</el-table-column>
			<el-table-column prop="status" label="状态" min-width="100" :formatter="formatStatus">
			</el-table-column>
			<el-table-column prop="lastLoginIp" label="上次登录IP" min-width="120">
			</el-table-column>
			<el-table-column prop="lastLoginTime" label="上次登录时间" min-width="180" :formatter="formatTime">
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
				<el-form-item label="账号" prop="account">
					<el-input v-model="editForm.account" disabled style="width: 250px" :maxlength="30" placeholder="请输入账号" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="账号持有人" prop="realName">
					<el-input v-model="editForm.realName" style="width: 250px" :maxlength="30" placeholder="请输入账号持有人" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="telephone">
					<el-input v-model="editForm.telephone" style="width: 250px" :maxlength="11" placeholder="请输入联系电话" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="超级管理员">
					<el-radio class="radio" v-model="editForm.type"  label="1">是</el-radio>
					<el-radio class="radio" v-model="editForm.type"  label="2">否</el-radio>
				</el-form-item>
				<el-form-item label="当前状态">
					<el-radio class="radio" v-model="editForm.status"  label="1">启用</el-radio>
					<el-radio class="radio" v-model="editForm.status"  label="2">禁用</el-radio>
				</el-form-item>
				<el-form-item label="是否修改密码">
					<el-radio class="radio" v-model="isChangePwd"  label="1">是</el-radio>
					<el-radio class="radio" v-model="isChangePwd"  label="0">否</el-radio>
				</el-form-item>
				<el-form-item label="密码" prop="password" v-show="isChangePwd==1">
					<el-input v-model="editForm.password"  type="password" :maxlength=20 style="width: 240px;" placeholder="请输入密码"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPassword" v-show="isChangePwd==1">
					<el-input v-model="editForm.checkPassword" type="password" :maxlength=20 style="width: 240px;" placeholder="请再次输入密码"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updateAccount">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="180px" :rules="addFormRules" ref="addForm">
				<el-form-item label="账号" prop="account">
					<el-input v-model="addForm.account" style="width: 250px" :maxlength="30" placeholder="请输入账号" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="账号持有人" prop="realName">
					<el-input v-model="addForm.realName" style="width: 250px" :maxlength="30" placeholder="请输入账号持有人" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="telephone">
					<el-input v-model="addForm.telephone" style="width: 250px" :maxlength="11" placeholder="请输入联系电话" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="超级管理员">
					<el-radio class="radio" v-model="addForm.type"  label=1>是</el-radio>
					<el-radio class="radio" v-model="addForm.type"  label=2>否</el-radio>
				</el-form-item>
				<el-form-item label="当前状态">
					<el-radio class="radio" v-model="addForm.status"  label=1>启用</el-radio>
					<el-radio class="radio" v-model="addForm.status"  label=2>禁用</el-radio>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password" type="password" :maxlength=20 style="width: 240px;" placeholder="请输入密码"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPassword">
					<el-input v-model="addForm.checkPassword" type="password" :maxlength=20 style="width: 240px;" placeholder="请再次输入密码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	const md5 = require('md5');
	import { mapState, mapGetters, mapActions} from 'vuex';
	import util from '../../common/js/util'
	import {getAccounts, getAccountDeatail, addAccount, updateAccount, deleteAccount} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					kw: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				currentId: '',
				//编辑界面数据
				editForm: {
					account: '',
					realName: '',
					telephone: '',
					type: '',
					status: '',	
					password: '',
					checkPassword: ''
				},
				isChangePwd: '0',
				addFormVisible: false,//新增界面是否显示
				setFormVisible: false,//设置界面是否显示
				addLoading: false,
				addFormRules: {
					account: [
						{ required: true, message: '请输入账号', trigger: 'blur' }
					],
					realName: [
						{ required: false, message: '请输入账号持有人', trigger: 'change' }
					],
					telephone: [
						{ required: false, message: '请输入联系电话'}
					],
					type: [
						{ required: true, message: '', trigger: 'change' }
					],
					status: [
						{ required: true, message: '', trigger: 'change' }
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'change' },
						{pattern:/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{8,20}$/,message:'8-20位，必须包含字母和数字'}
					],
					checkPassword: [
						{ required: true, message: '请再次输入密码', trigger: 'change' },
						{pattern:/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{8,20}$/,message:'8-20位，必须包含字母和数字'}
					]
				},
				editFormRules: {
					account: [
						{ required: true, message: '请输入账号', trigger: 'blur' }
					],
					realName: [
						{ required: false, message: '请输入账号持有人', trigger: 'change' }
					],
					telephone: [
						{ required: false, message: '请输入联系电话'}
					],
					type: [
						{ required: true, message: '', trigger: 'change' }
					],
					status: [
						{ required: true, message: '', trigger: 'change' }
					],
					isChangePwd: [
						{ required: true, message: '', trigger: 'change' }
					],
					// password: [
					// 	{ required: this.isChangePwd==1?true:false, message: '请输入密码', trigger: 'change' },
					// 	{pattern:/^(?![0-7]+$)(?![a-zA-Z]+$)[0-7A-Za-z]{6,16}$/,message:'6-20位，必须包含字母和数字'}
					// ],
					// checkPassword: [
					// 	{ required: this.isChangePwd==1?true:false, message: '请再次输入密码', trigger: 'change' },
					// 	{pattern:/^(?![0-7]+$)(?![a-zA-Z]+$)[0-7A-Za-z]{6,16}$/,message:'6-20位，必须包含字母和数字'}
					// ]
				},
				setFormRules: {
					picType: [
						{ required: true, message: '请选择存储类型' }
					]
				},
				//新增界面数据
				addForm: {
					account: '',
					realName: '',
					telephone: '',
					type: "2",
					status: "1",
					password: '',
					checkPassword: ''
				},
				setForm: {
					picType: '2'
				},
				passwords: "1",
				passwords1: "1",
				cameraList: [],
				oldDevSn: ''

			}
		},
		computed:{

			...mapGetters('common',{ //用mapGetters来获取collection.js里面的getters
				buildingList: 'renderBuilding'
			})
		},
		methods: {
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			formatType: function (row, column) {
				if(row.type==1){
					return "超级管理员"
				}else if(row.type==2){
					return "普通管理员"
				}else{
					return "未知"
				}
			},
			formatStatus: function (row, column) {
				if(row.status==1){
					return "启用"
				}else if(row.status==2){
					return "禁用"
				}else{
					return "未知"
				}
			},
			formatTime: function (row, column) {
				if(!row.lastLoginTime) return
				return util.formatDate.format(new Date(parseInt(row.lastLoginTime)*1000), 'yyyy-MM-dd hh:mm:ss');
			},
			handleCurrentChange(val) {
				if(val==this.page) return
				this.page = val;
				let para = {
					kw: this.filters.kw,
					page: this.page,
					prePage: 20
				};
				getAccounts(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
				});
			},

			//获取列表
			getAccounts() {
				let para = {
					kw: this.filters.kw,
					page: 1,
					prePage: 20
				};
				getAccounts(para).then((res) => {
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
					let para = { id: row.id };
					deleteAccount(para).then((res) => {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getAccounts();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				if(this.$refs.editForm){
					this.$refs.editForm.resetFields();
				}
				let param={
					"id": row.id
				}
				this.currentId = row.id
				getAccountDeatail(param).then((res) => {
					if(res.code==200){
						this.editFormVisible = true;
						this.editForm = Object.assign({}, res.data);
						this.editForm.type = this.editForm.type + ''
						this.editForm.status = this.editForm.status + ''
						this.isChangePwd = '0'
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
				this.addFormVisible = true;
				this.$refs['addForm']&&this.$refs['addForm'].resetFields();
			},
		
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
							if(this.addForm.password!=this.addForm.checkPassword){
								this.$message({
									message: "两次输入密码不一致",
									type: 'error'
								});
								return
							}
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							let param ={
								account: this.addForm.account,
								realName: this.addForm.realName,
								telephone: this.addForm.telephone,
								type: this.addForm.type,
								status: this.addForm.status,
								password: md5(this.addForm.password),
								checkPassword: md5(this.addForm.checkPassword)
							}
							addAccount(param).then((res) => {
								if(res.code==200){
									this.$message({
										message: '添加成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getAccounts();

								}
							});
					}
				});
			},
			//更新
			updateAccount: function () {				
				this.$refs.editForm.validate((valid) => {
					if (valid) {
							let reg = /^(?![0-7]+$)(?![a-zA-Z]+$)[0-7A-Za-z]{6,16}$/
							if(this.isChangePwd == 1){
								if(!this.editForm.password||!this.editForm.checkPassword){
									this.$message({
										message: "请输入密码",
										type: 'error'
									});
									return
								}
								if(this.editForm.password!=this.editForm.checkPassword){
									this.$message({
										message: "两次输入密码不一致",
										type: 'error'
									});
									return
								}

								if(!this.editForm.password.match(reg)){
									this.$message({
										message: "密码为6-20位，必须包含字母和数字",
										type: 'error'
									});
									return
								}
							}

							this.addLoading = true;
							let para = Object.assign({}, this.editForm);
							let param ={
								id: this.currentId,
								account: this.editForm.account,
								realName: this.editForm.realName,
								telephone: this.editForm.telephone,
								type: this.editForm.type,
								status: this.editForm.status,
								isChangePwd: this.isChangePwd,
							}
							if(this.isChangePwd==1){
								param.password = this.editForm.password
								param.checkPassword = this.editForm.checkPassword
							}

							updateAccount(param).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '更新成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getAccounts();

							});
						// });
					}
				});
			},

			isNumber: function(val) {
				var regPos = /^\d+(\.\d+)?$/; //非负浮点数
				var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
				if(regPos.test(val) || regNeg.test(val)) {
					return true;
				} else {
					return false;
				}
			}
		
		},
		mounted() {
			this.getAccounts();
		
		}
	}

</script>

<style scoped>
 .el-tooltip__popper {
    max-width: 10px;
    /* line-height: 180%; */
  }
</style>