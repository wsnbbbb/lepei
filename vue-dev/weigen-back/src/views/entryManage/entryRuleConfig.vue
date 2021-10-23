<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入策略名称"></el-input>
				</el-form-item>
				群体：
				<el-select v-model="filters.personType" placeholder="请选择">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			
				<el-form-item>
					<el-button type="primary" size="medium"  v-on:click="getEntryMacList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="medium"  @click="handleAdd">添加</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="medium" type="danger" @click="toEmit">下发策略</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column prop="id" label="编号" width="80" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="ruleName" label="策略名称" width="360" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="devName" label="终端名称" min-width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="timeName" label="时段名称" min-width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="personType" label="群体" min-width="40" :formatter="formatPerson">
			</el-table-column>
			<el-table-column prop="updateTime" label="更新时间" width="160" :show-overflow-tooltip="true" :formatter="formatTime">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
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
		<el-dialog title="预览" width="80%" class="preview-dialog" :visible.sync="previewVisible" :close-on-click-modal="false">

			<table class="preview-table"  border="1" cellspacing="0" style="border-collapse:collapse;" cellpadding="0">
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
						<td>{{preViewData.index}}</td>
						<td>{{preViewData.name}}</td>
						<td>{{preViewData.startDate}} ~ {{preViewData.endDate}}</td>
						<td>{{this.formatWeek(preViewData.week)}}</td>
						<td>{{preViewData.timeSections}}</td>
						<td>{{this.formatStatus(preViewData.index)}}</td>
					</tr>
				</tbody>
			</table>
			<div slot="footer" class="dialog-footer">
				<el-button size="medium" @click.native="previewVisible = false">取消</el-button>
				<el-button type="primary" size="medium"  @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, getEntryRule, deleteRule , preViewEntryTime , createDevice, deleteDevice, getEntryMacList, getBuilds, getPlaces, getDeviceList, removeUser, batchRemoveUser, editUser, addUser , getRecord, checkOrder, cancelCheckOrder} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					kw: '',
					type: '',
					personType: ''
				},
				preViewData: {},
				useCamera: "0",
				macType: "",
				buidingId: "",
				type: '',
				options: [{
					value: '',
					label: '全部'
					},{
					value: '2',
					label: '教职工'
					},{
					value: '1',
					label: '学生'
					},
					{
					value: '5',
					label: '家长'
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
			...mapActions('common',[ //collection是指modules文件夹下的collection.js
				'invokePushItems'  //collection.js文件中的actions里的方法，在上面的@click中执行并传入实参
			]),
			formatPerson: function (row, column) {
				// 群体（1：学生，2：教师）
				if(row.personType==1){
					return "学生"
				}else if(row.personType==2){
					return "教职工"
				}else if(row.personType==5){
					return "家长"
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
					personType: this.filters.personType,
					page: this.page,
					prePage: 20
				};
				getEntryRule(para).then((res) => {
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
					id: row.index
				}
				this.listLoading = true;
				preViewEntryTime(para).then((res) => {
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
					personType: this.filters.personType,
					page: 1,
					prePage: 20
				};
				getEntryRule(para).then((res) => {
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
					let para = { id: row.id };
					deleteRule(para).then((res) => {
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

			//编辑
			handleEdit: function (index, row) {
				this.$router.push({ path: '/editEntryRule/' + row.id });
			},
			//添加
			handleAdd: function () {
				this.$router.push({ path: '/addEntryRule' });
			},
			//下发策略
			toEmit: function () {
				this.$router.push({ path: '/emitEntryRule' });
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
   .preview-table thead{
	   background-color: #fafafa;
   }
  .preview-table tr td{
	  /* border: 1px solid red; */
	  padding: 5px 10px;
  }
</style>