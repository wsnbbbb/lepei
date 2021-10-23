<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入终端名称/终端MAC/场所名称"></el-input>
				</el-form-item>
				终端类型：
				<el-select v-model="filters.devType" placeholder="请选择">
					<el-option label="全部" value=""></el-option>
					<el-option label="闸机" value="1"></el-option>
					<el-option label="单立柱" value="2"></el-option>
				</el-select>
				
				所属建筑：
				<el-select v-model="filters.buildId" placeholder="请选择">
					<el-option label="全部" value=""></el-option>
					<el-option
						v-for="item in buildingList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select>
				当前状态：
				 <el-select v-model="filters.status" placeholder="请选择">
					 <el-option label="全部" value="-1"></el-option>
					 <el-option label="在线" value="1"></el-option>
					 <el-option label="离线" value="0"></el-option>
				</el-select>
				<el-form-item>
					<el-button type="primary" size="medium"  v-on:click="getEntryMacList">查询</el-button>
				</el-form-item>
			
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="devName" label="终端名称" width="120" :show-overflow-tooltip="true">
			</el-table-column>
			
			<el-table-column prop="devType" label="终端类型" min-width="120" :formatter="formaType">
			</el-table-column>

			<el-table-column prop="devSn" label="终端MAC" min-width="120">
			</el-table-column>

			<el-table-column prop="cameraMacs" label="摄像头" min-width="120">
			</el-table-column>
			<el-table-column prop="buildName" label="所属建筑" width="200" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="roomName" label="场所名称" width="200" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="status" label="当前状态" min-width="100">
				 <template slot-scope="scope">
					<span v-if="scope.row.status== 0" style="color: #ff0000">离线</span>
					<span v-if="scope.row.status== 1" style="color: #20a0ff">在线</span>
                </template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="medium" type="text" @click="toDetail(scope.$index, scope.row)">历史记录</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="total, prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, createDevice, getEntryMacList, getBuilds, getPlaces, getDeviceList, removeUser, batchRemoveUser, editUser, addUser , getRecord, checkOrder, cancelCheckOrder} from '../../api/api';

	export default {
    name:"devStatus",
		data() {
			return {
				filters: {
					kw: '',
					devType: '',
					buildId: '',
					status: '',
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
			// ...mapState({  //这里的...是超引用，ES6的语法，意思是state里有多少属性值我可以在这里放多少属性值
			// 	buildingList: state=>state.common.buildingList //注意这些与上面的区别就是state.footerStatus,
			// }),
			...mapGetters('common',{ //用mapGetters来获取collection.js里面的getters
				buildingList: 'renderBuilding'
			})
		},
		methods: {
			...mapActions('common',[ //collection是指modules文件夹下的collection.js
				'invokePushItems'  //collection.js文件中的actions里的方法，在上面的@click中执行并传入实参
			]),
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
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

			formatTime: function (row, column) {
				return util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss');
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
				getEntryMacList(para).then((res) => {
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
			

			//获取列表
			getEntryMacList() {
				// this.page = 1
				// if(this.page)
				let para = {
					kw: this.filters.kw,
					devType: this.filters.devType,
					buildId: this.filters.buildId,
					status: this.filters.status,
					page: 1,
					prePage: 20
				};
				getEntryMacList(para).then((res) => {
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
						this.getEntryMacList();
					});
				}).catch(() => {

				});
			},
			//去历史记录详情
			toDetail: function (index, row) {
				this.$router.push({ path: '/devStatusQuery/'+row.devSn });
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
							debugger
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
								this.getUsers();
							});
						// });
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
			this.getEntryMacList();
			this.getBuilds();
		}
	}

</script>

<style scoped>
 .el-tooltip__popper {
    max-width: 10px;
    /* line-height: 180%; */
  }
</style>