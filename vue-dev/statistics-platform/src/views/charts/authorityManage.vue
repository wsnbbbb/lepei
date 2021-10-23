<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRole">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row style="width: 100%;">
			<el-table-column prop="name" label="角色名称" width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="remark" label="说明" min-width="120">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="100" :formatter="formatStatus">
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button type="text" size="small" @click="getRelatedUser(scope.$index, scope.row)">选择用户</el-button>
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
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="editForm.name" style="width: 200px" :maxlength="30" placeholder="请输入角色名称" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="说明" prop="remark">
					<el-input v-model="editForm.remark" style="width: 200px" :maxlength="100" placeholder="请输入说明" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="当前状态">
					<el-radio class="radio" v-model="editForm.status"  label=1>启用</el-radio>
					<el-radio class="radio" v-model="editForm.status"  label=2>禁用</el-radio>
				</el-form-item>
				<el-form-item label="权限列表">
					<el-tree
						:data="data"
						show-checkbox
						node-key="nodeId"
						ref="tree"
						:props="defaultProps">
					</el-tree>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updateRole">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="180px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="addForm.name" style="width: 200px" :maxlength="30" placeholder="请输入角色名称" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="说明" prop="remark">
					<el-input v-model="addForm.remark" style="width: 200px" :maxlength="100" placeholder="请输入说明" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="当前状态">
					<el-radio class="radio" v-model="addForm.status"  label=1>启用</el-radio>
					<el-radio class="radio" v-model="addForm.status"  label=2>禁用</el-radio>
				</el-form-item>
				<el-form-item label="权限列表">
					<el-tree
						:data="data"
						show-checkbox
						node-key="nodeId"
						ref="tree1"
						:props="defaultProps">
					</el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>

		<!--选人界面-->
		<el-dialog title="选择用户" v-model="selectFormVisible" :close-on-click-modal="false">
			<!-- <el-form :model="selectForm" label-width="180px" :rules="addFormRules" ref="addForm"> -->
			<el-checkbox-group v-model="checkedUsers">
				<el-checkbox v-for="item in AllUsers" :label="item.account" :key="item.id">{{item.account}}</el-checkbox>
			</el-checkbox-group>
			<!-- </el-form> -->
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="selectFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="save" >保存</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import { mapState, mapGetters, mapActions} from 'vuex';
	import util from '../../common/js/util'
	import {getRole, getRoleDeatail, addRole, updateRole, deleteRole, getMenu, getRelatedUser, saveRelatedUser} from '../../api/api';

	export default {
		data() {
			return {
				data: [],
				defaultProps: {
					children: 'children',
					label: 'title'
				},
   				checkedUsers: [],
        		AllUsers: [],
				currentKey: [],
		
				filters: {
					kw: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				selectFormVisible: false,
				currentId: '',
				addFormVisible: false,//新增界面是否显示
				setFormVisible: false,//设置界面是否显示
				addLoading: false,
				//新增界面数据
				addForm: {
					name: '',
					remark: '',
					status: '1'
				},
				//编辑界面数据
				editForm: {
					name: '',
					remark: '',
					status: '',	
				},
				addFormRules: {
					name: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
					],
					status: [
						{ required: true, message: '', trigger: 'change' }
					],
				},
				editFormRules: {
					name: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
					],
					status: [
						{ required: true, message: '', trigger: 'change' }
					],
				},
			}
		},
		computed:{

			...mapGetters('common',{ //用mapGetters来获取collection.js里面的getters

			})
		},
		methods: {


			formatStatus: function (row, column) {
				if(row.status==1){
					return "启用"
				}else if(row.status==2){
					return "禁用"
				}else{
					return "未知"
				}
			},

			handleCurrentChange(val) {
				if(val==this.page) return
				this.page = val;
				let para = {
					kw: this.filters.kw,
					page: this.page,
					prePage: 20
				};
				getRole(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
				});
			},

			getMenu() {
				let para = {};
				let _this = this
				getMenu(para).then((res) => {
					if(res.code == 200){
						this.data = res.data.menu
					}
				});
			},

			getRelatedUser(index, row) {
				let para = {
					roleId: row.id
				};
				this.currentId = row.id
				getRelatedUser(para).then((res) => {
					if(res.code == 200){
						this.selectFormVisible = true
						this.AllUsers = res.data.users
						let arr = []
						res.data.selectUserIds.map(item=>{
							res.data.users.map(i=>{
								if(item == i.id){
									arr.push(i.account)
								}
							})
						})
						this.checkedUsers = arr
					}
				});
			},


			//获取列表
			getRole() {
				let para = {
					kw: this.filters.kw,
					page: 1,
					prePage: 20
				};

				getRole(para).then((res) => {
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
					deleteRole(para).then((res) => {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getRole();
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
				getRoleDeatail(param).then((res) => {
					if(res.code==200){
						this.editFormVisible = true;
						this.editForm = Object.assign({}, res.data);
						this.editForm.status = this.editForm.status + ''
						this.$nextTick(() => {
							this.$refs.tree.setCheckedKeys(res.data.selectNodeIds);
						}) 
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
				this.$nextTick(() => {
					this.$refs.tree1.setCheckedKeys([]);
				})
				this.addForm.status = '1'
				this.$refs['addForm']&&this.$refs['addForm'].resetFields();
			},
		
			//新增
			addSubmit: function () {
				let nodeIds = []
				nodeIds = this.$refs.tree1.getCheckedKeys()
				this.$refs.addForm.validate((valid) => {
					if (valid) {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							let param ={
								name: this.addForm.name,
								status: this.addForm.status,
								remark: this.addForm.remark,
								nodeIds: nodeIds,
							}
							addRole(param).then((res) => {
								if(res.code==200){
									this.$message({
										message: '添加成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getRole();

								}
							});
					}
				});
			},

		
			save: function () {
				this.addLoading = true;
				let arr = []
				this.AllUsers.map(item=>{
					this.checkedUsers.map(i=>{
						if(item.account == i){
							arr.push(item.id)
						}
					})
				})
				let param ={
					roleId: this.currentId,
					userIds: arr,
				}
				saveRelatedUser(param).then((res) => {
					if(res.code==200){
						this.$message({
							message: '保存成功',
							type: 'success'
						});
						this.selectFormVisible = false;
					}
				});
			},
			//更新
			updateRole: function () {				
				this.$refs.editForm.validate((valid) => {
					if (valid) {
							this.addLoading = true;
							let para = Object.assign({}, this.editForm);
							let param ={
								id: this.currentId,
								name: this.editForm.name,
								remark: this.editForm.remark,
								status: this.editForm.status,
								nodeIds: this.$refs.tree.getCheckedKeys()
							}
					
							updateRole(param).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '更新成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getRole();
							});
					}
				});
			},

		
		},
		mounted() {
			this.getRole();
			this.getMenu();
		}
	}

</script>

<style scoped>
 .el-tooltip__popper {
    max-width: 10px;
    /* line-height: 180%; */
  }
</style>