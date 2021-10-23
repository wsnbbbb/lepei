<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				终端类型：
				<el-select v-model="filters.devType" placeholder="请选择">
					<el-option label="全部" value=""></el-option>
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
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
		<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="devName" label="终端名称" min-width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="devType" label="终端类型" min-width="120" :formatter="formaType">
			</el-table-column>
			<el-table-column prop="devSn" label="终端MAC" min-width="120">
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
				<el-form-item label="终端名称" prop="devName">
					<el-input v-model="editForm.devName" style="width: 250px" :maxlength="30" placeholder="请输入终端名称" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="终端MAC(唯一标识符)" prop="devSn">
					<el-select v-model="editForm.devSn" filterable placeholder="请选择">
						<el-option
							v-for="item in deviceList"
							:key="item.devSn"
							:label="item.devSn"
							:disabled="item.status==1"
							:value="item.devSn">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="终端类型" prop="devType">
					<el-select v-model="editForm.devType" placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
<!-- 				
				<el-form-item label="所属建筑" prop="buildId">
					<el-select v-model="editForm.buildId" placeholder="请选择" @change="buildChange">
						<el-option
							v-for="item in buildingList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="场所名称" prop="roomId">
					<el-select v-model="editForm.roomId" placeholder="请选择">
						<el-option
							v-for="item in placeList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="超级密码">
					<el-radio v-model="passwords1" label="1">不启用</el-radio>
  					<el-radio v-model="passwords1" label="2">启用</el-radio>
				</el-form-item>
				<el-form-item label="" prop="password1" v-show="passwords1==2">
					<el-input v-model="editForm.password1" :maxlength=6 style="width: 240px;" show-password placeholder="请输入第一组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="" prop="password2" v-show="passwords1==2">
					<el-input v-model="editForm.password2" :maxlength=6 style="width: 240px;" show-password placeholder="请输入第二组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="" prop="password3" v-show="passwords1==2">
					<el-input v-model="editForm.password3" :maxlength=6 style="width: 240px;" show-password placeholder="请输入第三组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="" prop="password4" v-show="passwords1==2">
					<el-input v-model="editForm.password4" :maxlength=6 style="width: 240px;" show-password placeholder="请输入第四组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="门禁抓拍摄像头">
					<el-radio class="radio" v-model="useCamera1"  label="0">不启用</el-radio>
					<el-radio class="radio" v-model="useCamera1"  label="1">启用</el-radio>
					<br/>
	
					<el-select v-model="camera1" style="width: 80%;" v-show="useCamera1==1" multiple placeholder="请选择">
						<el-option
						v-for="(item, index) in cameraList"
						:key="index"
						:label="item.devSn"
						:value="item.devSn">
						</el-option>
					</el-select>
				</el-form-item> -->
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updateDevice">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加终端" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="180px" :rules="addFormRules" ref="addForm">
				<el-form-item label="终端名称" prop="devName">
					<el-input v-model="addForm.devName" style="width: 250px" :maxlength="30" placeholder="请输入终端名称" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="终端MAC(唯一标识符)" prop="devSn">
					<el-select v-model="addForm.devSn" filterable placeholder="请选择">
						<el-option
							v-for="item in deviceList"
							:key="item.devSn"
							:label="item.devSn"
							:disabled="item.status==1"
							:value="item.devSn">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="终端类型" prop="devType1">
					<el-select v-model="addForm.devType1" placeholder="请选择">
						<el-option label="闸机" value="1"></el-option>
						<el-option label="单立柱" value="2"></el-option>
						
					</el-select>
				</el-form-item>
				
				<!-- <el-form-item label="所属建筑" prop="buildId">
					<el-select v-model="addForm.buildId" filterable placeholder="请选择" @change="buildChange">
						<el-option
							v-for="item in buildingList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="场所名称" prop="placeId">
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
					<el-radio v-model="passwords" label="1">不启用</el-radio>
  					<el-radio v-model="passwords" label="2">启用</el-radio>
				</el-form-item>
				<el-form-item label="" prop="password1" v-show="passwords==2">
					<el-input v-model="addForm.password1" :maxlength=6 style="width: 240px;" show-password placeholder="请输入第一组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="" prop="password2" v-show="passwords==2">
					<el-input v-model="addForm.password2" :maxlength=6 style="width: 240px;" show-password placeholder="请输入第二组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="" prop="password3" v-show="passwords==2">
					<el-input v-model="addForm.password3" :maxlength=6 style="width: 240px;" show-password placeholder="请输入第三组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="" prop="password4" v-show="passwords==2">
					<el-input v-model="addForm.password4" :maxlength=6 style="width: 240px;" show-password placeholder="请输入第四组超级密码，6位纯数字"></el-input>
				</el-form-item>
				<el-form-item label="门禁抓拍摄像头">
					<el-radio class="radio" v-model="useCamera"  label="0">不启用</el-radio>
					<el-radio class="radio" v-model="useCamera"  label="1">启用</el-radio>
					<br/>
	
					<el-select v-model="addForm.camera" style="width: 80%;" v-show="useCamera==1" multiple placeholder="请选择">
						<el-option
						v-for="(item, index) in cameraList"
						:key="index"
						:label="item.devSn"
						:value="item.devSn">
						</el-option>
					</el-select>
				</el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>

		<!--设置界面-->
		<el-dialog title="门禁抓拍图片存储路径" v-model="setFormVisible" :close-on-click-modal="false">
			<el-form :model="setForm" label-width="180px" :rules="setFormRules" ref="setForm">
				<el-form-item label="存储路径" prop="picType">
					<el-select v-model="setForm.picType" placeholder="请选择">
						<el-option label="本地服务器" value="2"></el-option>
						<el-option label="云服务器" value="1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="setFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="setSubmit" >提交</el-button>
			</div>
	
		</el-dialog>
	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, showPicSet, savePicSet, getCameraList, updateDevice, entryMacDetail, createDevice, deleteDevice, getEntryMacList, getPlaces, getDeviceList, removeUser, batchRemoveUser, editUser, addUser , getRecord, checkOrder, cancelCheckOrder} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					kw: '',
					devType: '',
					buildId: ''
				},
				useCamera: "0",
				useCamera1: "",
				macType: "",
				buildId: "",
				options: [{
					value: 1,
					label: '闸机'
					},{
					value: 2,
					label: '单立柱'
					}],
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
					devName: '',
					devSn: '',
					devType: '',
					buildId: '',
					placeId: '',
					roomId: '',
					useCamera: '',
					password1: '',
					password2: '',
					password3: '',
					password4: '',
					camera: []
				},
				camera1: [],

				addFormVisible: false,//新增界面是否显示
				setFormVisible: false,//设置界面是否显示
				addLoading: false,
				addFormRules: {
					devName: [
						{ required: true, message: '请输入终端名称', trigger: 'blur' }
					],
					devSn: [
						{ required: true, message: '请选择终端MAC', trigger: 'change' }
					],
					devType1: [
						{ required: true, message: '请选择终端类型'}
					],
					buildId: [
						{ required: true, message: '请选择建筑', trigger: 'change' }
					],
					placeId: [
						{ required: true, message: '请选择场所', trigger: 'change' }
					]
				},
				editFormRules: {
					devName: [
						{ required: true, message: '请输入终端名称', trigger: 'blur' }
					],
					devSn: [
						{ required: true, message: '请选择终端MAC'}
					],
					devType: [
						{ required: true, message: '请选择终端类型' }
					],
					buildId: [
						{ required: true, message: '请选择建筑' }
					],
					roomId: [
						{ required: true, message: '请选择场所' }
					]
				},
				setFormRules: {
					picType: [
						{ required: true, message: '请选择存储类型' }
					]
				},
				//新增界面数据
				addForm: {
					devName: '',
					devSn: '',
					devType1: '',
					buildId: '',
					placeId: '',
					useCamera: "1",
					password1: '',
					password2: '',
					password3: '',
					password4: '',
					camera: []
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
			formatStatus: function (row, column) {
				// 状态0-待审核 1-已通过 2-已撤销
				if(row.status==0){
					return "待审核"
				}else if(row.status==1){
					return "已通过"
				}else if(row.status==1){
					return "已撤销"
				}
			},
			formatTime: function (row, column) {
				return util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss');
			},
			handleCurrentChange(val) {
				if(val==this.page) return
				this.page = val;
				let para = {
					// kw: this.filters.kw,
					// buildId: this.filters.buildId,
					devType: this.filters.devType,
					page: this.page,
					pageSize: 20
				};
				getEntryMacList(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
				});
			},
	
			
	
			buildChange(value){
				console.log(value)
				let para = {
					buildId: value
				}
				if(!value) return
				this.addForm.placeId = ''
				this.editForm.roomId = ''
				getPlaces(para).then((res) => {
					this.placeList = res.data;
				});
			},
			
			getDeviceList() {
				let para = {}
				getDeviceList(para).then((res) => {
					this.deviceList = res.data
				});
			},

			//获取列表
			getEntryMacList() {
				
				let para = {
					// kw: this.filters.kw,
					// buildId: this.filters.buildId,
					devType: this.filters.devType,
					page: 1,
					pageSize: 20
				};
				getEntryMacList(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data.dataList;
					this.page = 1

				});
				// this.page
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					let para = { devSn: row.devSn };
					deleteDevice(para).then((res) => {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getEntryMacList();
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
				this.oldDevSn = row.devSn
				let param={
					"devSn": row.devSn
				}
				entryMacDetail(param).then((res) => {
					if(res.code==200){
						this.editFormVisible = true;
						this.editForm = Object.assign({}, res.data);
						let temRoomId = res.data.roomId

						this.camera1 = []
						if(res.data.passwords.length>=1){
							this.passwords1 = "2"
							this.editForm.password1 = res.data.passwords[0]?res.data.passwords[0]:"";
							this.editForm.password2 = res.data.passwords[1]?res.data.passwords[1]:"";
							this.editForm.password3 = res.data.passwords[2]?res.data.passwords[2]:"";
							this.editForm.password4 = res.data.passwords[3]?res.data.passwords[3]:"";
						}else{
							this.passwords1 = "1"
						}
						if(res.data.cameraMacs.length>=1){
							this.useCamera1 = "1"
							this.camera1 = res.data.cameraMacs
						}else{
							this.useCamera1 = "0"
						}
						let para = {
							buildId: res.data.buildId
						}
						getPlaces(para).then((res) => {
							this.placeList = res.data;
							this.editForm.roomId = temRoomId

						});
						// _this.editForm.roomId = res.data.roomId

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
				let passwordArr = []
				if(this.passwords==2){
					// if(!this.addForm.password1&&!this.addForm.password2&&!this.addForm.password3&&!this.addForm.password4){
					// 	this.$message({
					// 		message: "请输入超级密码",
					// 		type: 'error'
					// 	});
					// 	return
					// }
					// if(this.addForm.password1&&(this.addForm.password1.length!=6||!this.isNumber(this.addForm.password1))){
					// 	this.$message({
					// 		message: "第一组超级密码格式不正确",
					// 		type: 'error'
					// 	});
					// 	return
					// }
					// if(this.addForm.password2&&(this.addForm.password2.length!=6||!this.isNumber(this.addForm.password2))){
					// 	this.$message({
					// 		message: "第二组超级密码格式不正确",
					// 		type: 'error'
					// 	});
					// 	return
					// }
					// if(this.addForm.password3&&(this.addForm.password3.length!=6||!this.isNumber(this.addForm.password3))){
					// 	this.$message({
					// 		message: "第三组超级密码格式不正确",
					// 		type: 'error'
					// 	});
					// 	return
					// }
					// if(this.addForm.password4&&(this.addForm.password4.length!=6||!this.isNumber(this.addForm.password4))){
					// 	this.$message({
					// 		message: "第四组超级密码格式不正确",
					// 		type: 'error'
					// 	});
					// 	return
					// }

					// let passwordArr1 = [this.addForm.password1, this.addForm.password2, this.addForm.password3, this.addForm.password4];
					// passwordArr = passwordArr1.filter(item=>{
					// 	return item&&item.length==6
					// })
					
				}else{
					passwordArr = []
				}

				if(this.useCamera==1){
					// if(this.addForm.camera.length==0){
					// 	this.$message({
					// 		message: "请选择摄像头",
					// 		type: 'error'
					// 	});
					// 	return
					// }
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						// this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							
							let param ={
								devName: this.addForm.devName,
								devSn: this.addForm.devSn,
								devType: this.addForm.devType1,
								// buildId: this.addForm.buildId,
								// roomId: this.addForm.placeId,
								// passwords: passwordArr,
								// cameraMacs: this.addForm.camera
								
							}
							createDevice(param).then((res) => {
								if(res.code==200){
									this.$message({
										message: '添加成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getEntryMacList();
									this.getDeviceList();
									// this.addForm.camera = []
									// this.passwords = "1"
									// this.useCamera = "0"
								}
							});
					}
				});
			},
			//更新
			updateDevice: function () {
				let passwordArr = []
				if(this.passwords1==2){
					// if(!this.editForm.password1&&!this.editForm.password2&&!this.editForm.password3&&!this.editForm.password4){
					// 	this.$message({
					// 		message: "请输入超级密码",
					// 		type: 'error'
					// 	});
					// 	return
					// }
					// if(this.editForm.password1&&(this.editForm.password1.length!=6||!this.isNumber(this.editForm.password1))){
					// 	this.$message({
					// 		message: "第一组超级密码格式不正确",
					// 		type: 'error'
					// 	});
					// 	return
					// }
					// if(this.editForm.password2&&(this.editForm.password2.length!=6||!this.isNumber(this.editForm.password2))){
					// 	this.$message({
					// 		message: "第二组超级密码格式不正确",
					// 		type: 'error'
					// 	});
					// 	return
					// }
					// if(this.editForm.password3&&(this.editForm.password3.length!=6||!this.isNumber(this.editForm.password3))){
					// 	this.$message({
					// 		message: "第三组超级密码格式不正确",
					// 		type: 'error'
					// 	});
					// 	return
					// }
					// if(this.editForm.password4&&(this.editForm.password4.length!=6||!this.isNumber(this.editForm.password4))){
					// 	this.$message({
					// 		message: "第四组超级密码格式不正确",
					// 		type: 'error'
					// 	});
					// 	return
					// }

					// let passwordArr1 = [this.editForm.password1, this.editForm.password2, this.editForm.password3, this.editForm.password4];
					// passwordArr = passwordArr1.filter(item=>{
					// 	return item&&item.length==6
					// })
					
				}else{
					passwordArr = []
				}

				if(this.useCamera==1){
					// if(this.editForm.camera.length==0){
					// 	this.$message({
					// 		message: "请选择摄像头",
					// 		type: 'error'
					// 	});
					// 	return
					// }
				}
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						// this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							let camera = []
							if(this.useCamera1 == "1"){
								camera = this.camera1
							}
							let param ={
								oldDevSn: this.oldDevSn,
								devName: this.editForm.devName,
								devSn: this.editForm.devSn,
								devType: this.editForm.devType,
								// buildId: this.editForm.buildId,
								// roomId: this.editForm.roomId,
								// passwords: passwordArr,
								// cameraMacs: camera
								
							}

							updateDevice(param).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '更新成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getEntryMacList();
								// this.useCamera==0

							});
						// });
					}
				});
			},
			setSubmit: function () {
				this.$refs.setForm.validate((valid) => {
					if (valid) {
						let param ={
							picType: this.setForm.picType
						}
						savePicSet(param).then((res) => {
							this.$message({
								message: '设置成功',
								type: 'success'
							});
							this.$refs['setForm'].resetFields();
							this.setFormVisible = false;
						});
					}
				});

			},
			selsChange: function (sels) {
				this.sels = sels;
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
			this.getEntryMacList();
			this.getDeviceList();
		
		}
	}

</script>

<style scoped>
 .el-tooltip__popper {
    max-width: 10px;
    /* line-height: 180%; */
  }
</style>