<template>
	<section>
		<!--工具条-->
		<el-col :span="24" style="padding-top: 20px;">
			<el-form :inline="true" :model="filters">
			
				<el-form-item>
					上传表格：
					<el-upload
						class="upload-demo"
						action= base
						:limit="1"
						:on-change="fileChange"
						:on-exceed="handleExceed"
						:http-request="uploadSectionFile"
						>
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
		
				</el-form-item>
				<br/>
				<el-form-item>
					支持文件格式：xls xlsx
					&nbsp;&nbsp;&nbsp;&nbsp;<a class="download" :href= this.templateUrl >下载模板</a>
				</el-form-item>
				
			</el-form>
		</el-col>

		<!--选人界面-->
		<el-dialog title="错误提示" v-model="errorVisible" :close-on-click-modal="false">
			<span style="color: red">{{error}}</span>
			<table class="error-table" border="0" cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<td :key="index" v-for="(item, index) in errorData.header">{{item}}</td>
						<td v-if="errorData.header">说明</td>
					</tr>
				</thead>
				<tbody>
					<tr :key="index" v-for="(item, index) in errorData.sheetData">
						<td :key="idx" v-for="(i, idx) in item">{{i}}</td>
					</tr>
				</tbody>
			</table>
				<div slot="footer" class="dialog-footer">
				<el-button @click.native="errorVisible = false">关闭</el-button>

			</div>
		</el-dialog>


	

	

	</section>
</template>

<script>
	import axios from 'axios';
	import {base, base_upload} from '../../config.js'
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
				errorVisible: false,
				error: '',
				errorData: {},
				uploadUrl: base + 'manager/persons/import',
				templateUrl: base_upload + '/人员信息导入模板.xls',
				fileList: [],
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
			uploadSectionFile(param){
				var fileObj = param.file;
				// FormData 对象
				var form = new FormData();
				// 文件对象
				form.append("excel", fileObj);
				axios({
					method: 'post',
					url: this.uploadUrl,
					headers: {
						'Content-Type': 'multipart/form-data'
					},
					data:form
				}).then(res => {
					if(res.data.data&&res.data.data.error==false){
						this.errorVisible = true
						this.errorData = res.data.data
						this.error = res.data.msg
					}else{
						this.$message({
							message: '导入成功',
							type: 'success'
						});
					}
				})
			},
			fileChange(files, fileList){
				fileList = []
			},
			 handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			 handleCommand(command) {
				if(command=='delete'){
					this.$confirm('确认批量删除这些数据吗?', '提示', {
						type: 'warning'
					}).then(() => {
						let para = { personIds: this.sels };
						batchDeletePerson(para).then((res) => {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getPersonList();
						});
					}).catch(() => {

					});
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
					let para = { devSn: row.devSn };
					deletePerson(para).then((res) => {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getPersonList();
						this.getDeviceList();
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
	.download{
		text-decoration: none;
		color: #409EFF;
	}
	.error-table{
		border: none;
		border-collapse:collapse;
	}
	.error-table td{
		padding: 0 5px;
		border: 1px solid red;
	}
	.el-upload-list, .el-upload-list--text{
		display: none!important;
	}
</style>