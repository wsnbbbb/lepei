<template>
	<section>
		
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入名称/手机号/所属组织"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getPersonList">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
				<el-form-item>
					<el-dropdown @command="handleCommand">
						<span class="el-dropdown-link">
							展开<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="import">导入</el-dropdown-item>
							<el-dropdown-item :disabled="this.sels.length==0" command="delete">批量删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-form-item> -->
			</el-form>
			
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column
				type="selection"
				width="55">
			</el-table-column>
			<el-table-column prop="personName" label="姓名" min-width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="telephone" label="手机号" min-width="120">
			</el-table-column>
			<el-table-column prop="depart" label="所属组织" min-width="120">
			</el-table-column>
			<!-- <el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column> -->
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" :current-page="page"  @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="personName">
					<el-input v-model="editForm.personName" style="width: 250px" :maxlength="30" placeholder="请输入姓名" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="telephone">
					<el-input v-model="editForm.telephone" style="width: 250px" :maxlength="30" placeholder="请输入手机号" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属组织" prop="depart">
					<el-input v-model="editForm.depart" style="width: 250px" :maxlength="30" placeholder="请输入所属组织" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updataPersonDetail">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="180px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="personName">
					<el-input v-model="addForm.personName" style="width: 250px" :maxlength="30" placeholder="请输入" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="telephone">
					<el-input v-model="addForm.telephone" style="width: 250px" :maxlength="30" placeholder="请输入" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属组织" prop="depart">
					<el-input v-model="addForm.depart" style="width: 250px" :maxlength="30" placeholder="请输入" auto-complete="off"></el-input>
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
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getPersonDetail, updataPersonDetail, deletePerson, getPersonList, editUser,
	addPerson, batchDeletePerson} from '../../api/api';

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
				},

				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {
					id: '',
					personName: '',
					telephone: '',
					depart: '',
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					personName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					telephone: [
						{ required: true, trigger: 'blur', validator: checkPhone  }
					],
					depart: [
						{ required: false}
					],
					
				},
				editFormRules: {
					personName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					telephone: [
						{ required: true, trigger: 'blur', validator: checkPhone  }
					],
					depart: [
						{ required: false}
					]
				},
	
				//新增界面数据
				addForm: {
					personName: '',
					telephone: '',
					depart: ''
				},

			}
		},
		computed:{
			
		},
		methods: {
			...mapActions([ 
				'TOG2COMMON',
				'TOG2SUPER'
			]),
			 handleCommand(command) {
				 let me = this
				if(command=='delete'){
					this.$confirm('确认批量删除这些数据吗?', '提示', {
						type: 'warning'
					}).then(() => {
						let arr = []
						me.sels.map(item=>{
							arr.push(item.personId)
						})
						let para = { personIds: arr };
						// debugger
						batchDeletePerson(para).then((res) => {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getPersonList();
						});
					}).catch(() => {

					});
				}else if(command=='import'){
					 this.$router.push({ path: '/personImport' });
				}
			},
				
			handleCurrentChange(val) {
				if(val==this.page) return
				this.page = val;
				let para = {
					devType: this.filters.devType,
					page: this.page,
					pageSize: 20
				};
				getPersonList(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
				});
			},
	
			//获取列表
			getPersonList() {
				let para = {
					kw: this.filters.kw,
					page: 1,
					pageSize: 20
				};
				getPersonList(para).then((res) => {
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
					let para = { id: row.personId };
					deletePerson(para).then((res) => {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getPersonList();

					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				if(this.$refs.editForm){
					this.$refs.editForm.resetFields();
				}
				this.oldDevSn = row.personId
				let param={
					"id": row.personId
				}
				getPersonDetail(param).then((res) => {
					if(res.code==200){
						this.editFormVisible = true;
						this.editForm = Object.assign({}, res.data);
						this.editForm.id = row.personId;
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

			toggle: function () {
				this.$store.commit("TOG2SUPER")
			},
		
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						// this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let param = Object.assign({}, this.addForm);
							addPerson(param).then((res) => {
								if(res.code==200){
									this.$message({
										message: '添加成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getPersonList();
								}
							});
					}
				});
			},
			//更新
			updataPersonDetail: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						// this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							let param ={
								id: this.editForm.id,
								personName: this.editForm.personName,
								telephone: this.editForm.telephone,
								depart: this.editForm.depart,
							}
							updataPersonDetail(param).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '更新成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getPersonList();
								// this.useCamera==0

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
			this.getPersonList();
			
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