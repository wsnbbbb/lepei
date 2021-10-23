<template>
	<section>
		<!-- 面包屑 -->
		<el-col :span="24" class="breadcrumb-box">
		<strong class="title">{{ $route.meta.title }}</strong>
		<el-breadcrumb separator="/" class="breadcrumb-inner">
			<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
			{{ item.meta.title }}
			</el-breadcrumb-item>
		</el-breadcrumb>
		</el-col>
		 <el-tabs v-model="activeName">
			<el-tab-pane label="学生手环" name="first">
				 <el-col :span="24" class="toolbar">
					<el-form :inline="true" :model="filters1" ref="filters">
						<el-row :gutter="24">
							<el-col :span="4">
								<el-form-item prop="kw">
									<el-input
									clearable
									v-model="filters1.kw"
									placeholder="姓名"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="3">
								<el-form-item  prop="gradeType">
									<el-select v-model="filters1.gradeType" placeholder="学业阶段"  @change="changeGrade">
										<el-option label="幼儿园" value="1"></el-option>
										<el-option label="小学" value="2"></el-option>
										<el-option label="初中" value="3"></el-option>
										<el-option label="高中" value="4"></el-option>
										<el-option label="大学" value="5"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item  prop="buildId">
									<el-select v-model="filters1.gradeId" placeholder="年级" @change="change1">
										<el-option
											v-for="item in grandList"
											:key="item.gradeId"
											:label="item.gradeName"
											:value="item.gradeId">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item  prop="placeId">
									<el-select v-model="filters1.classId" placeholder="班级">
										<el-option
											v-for="item in classList"
											:key="item.classId"
											:label="item.className"
											:value="item.classId">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>

							<el-col :span="3">
								<el-form-item  prop="bindStatus">
									<el-select clearable v-model="filters1.bindStatus" placeholder="绑定状态" >
									<el-option label="已绑定" value="1"></el-option>
									<el-option label="未绑定" value="2"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						
							<el-col :span="6" style="text-align: right">
								<el-button type="primary" size="medium" @click="queryStudent">查询</el-button>&emsp;
								<el-button type="primary" size="medium" @click="resetForm('filters')" plain>重置</el-button>
							</el-col>
						</el-row>

					</el-form>
				</el-col>


				<!--列表-->
				<el-table max-height="700" :data="studentRecord" highlight-current-row  style="width: 100%;">
					<el-table-column prop="personName" label="姓名" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="sex" label="性别" min-width="60" :show-overflow-tooltip="true" :formatter="formaSex">
					</el-table-column>
					<el-table-column prop="buildName" label="建筑" min-width="60" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="placeName" label="场所" min-width="60" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="gradeType" label="学业阶段" min-width="100" :show-overflow-tooltip="true" :formatter="formatGradeType">
					</el-table-column>
					<el-table-column prop="gradeName" label="年级" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="className" label="班级" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="className" label="进入时间" min-width="160" :show-overflow-tooltip="true" :formatter="formatTime">
					</el-table-column>
					<el-table-column label="操作" width="220">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="toSecondPage(scope.row)">每日轨迹</el-button>
							<el-button type="text" size="small" @click="toHistory(scope.row)">历史记录</el-button>
					</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
					<el-pagination layout="total, prev, pager, next" :current-page="page1" @current-change="handleCurrentChange1" :page-size="20" :total="total1" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>
			<el-tab-pane label="教师手环" name="second">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters2" ref="filters2">
						<el-row :gutter="24">
							<el-col :span="4">
								<el-form-item prop="kw">
									<el-input
									clearable
									v-model="filters2.kw"
									placeholder="姓名"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item  prop="bindStatus">
									<el-select clearable v-model="filters2.bindStatus" placeholder="绑定状态" >
									<el-option label="已绑定" value="1"></el-option>
									<el-option label="未绑定" value="2"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="10">
								<el-form-item  prop="sendStatus">
									<el-select clearable v-model="filters2.sendStatus" placeholder="下发状态" >
										<el-option label="下发中" value="1"></el-option>
										<el-option label="成功" value="2"></el-option>
										<el-option label="失败" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="6" style="text-align: right">
								<el-button type="primary" size="medium" @click="queryTeacher">查询</el-button>&emsp;
								<el-button type="primary" size="medium" @click="resetForm('filters')" plain>重置</el-button>
							</el-col>
						</el-row>

					</el-form>
				</el-col>
				<!--列表-->
				<el-table max-height="700" :data="teacherRecord" highlight-current-row  style="width: 100%;">
					<el-table-column prop="personName" label="姓名" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="sex" label="性别" min-width="60" :show-overflow-tooltip="true" :formatter="formaSex">
					</el-table-column>
					<el-table-column prop="buildName" label="建筑" min-width="60" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="placeName" label="场所" min-width="60" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="className" label="进入时间" min-width="160" :show-overflow-tooltip="true" :formatter="formatTime">
					</el-table-column>
					<el-table-column label="操作" width="220">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="toSecondPage(scope.row)">每日轨迹</el-button>
							<el-button type="text" size="small" @click="toHistory(scope.row)">历史记录</el-button>
					</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" :current-page="page2" @current-change="handleCurrentChange2" :page-size="20" :total="total2" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>

			<el-tab-pane label="职工手环" name="third">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters3" ref="filters3">
						<el-row :gutter="24">
							<el-col :span="4">
								<el-form-item prop="kw">
									<el-input
									clearable
									v-model="filters3.kw"
									placeholder="姓名"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item  prop="bindStatus">
									<el-select clearable v-model="filters3.bindStatus" placeholder="绑定状态" >
									<el-option label="已绑定" value="1"></el-option>
									<el-option label="未绑定" value="2"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="10">
								<el-form-item  prop="sendStatus">
									<el-select clearable v-model="filters3.sendStatus" placeholder="下发状态" >
										<el-option label="下发中" value="1"></el-option>
										<el-option label="成功" value="2"></el-option>
										<el-option label="失败" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-col>


							<el-col :span="6" style="text-align: right">
								<el-button type="primary" size="medium" @click="queryParent">查询</el-button>&emsp;
								<el-button type="primary" size="medium" @click="resetForm('filters3')" plain>重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</el-col>
				<!--列表-->
				<el-table max-height="700" :data="parentRecord" highlight-current-row  style="width: 100%;">
					<el-table-column prop="personName" label="姓名" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="sex" label="性别" min-width="60" :show-overflow-tooltip="true" :formatter="formaSex">
					</el-table-column>
					<el-table-column prop="buildName" label="建筑" min-width="60" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="placeName" label="场所" min-width="60" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="className" label="进入时间" min-width="160" :show-overflow-tooltip="true" :formatter="formatTime">
					</el-table-column>
				
					<el-table-column label="操作" width="220">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="toSecondPage(scope.row)">每日轨迹</el-button>
							<el-button type="text" size="small" @click="toHistory(scope.row)">历史记录</el-button>
					</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" :current-page="page3" @current-change="handleCurrentChange3" :page-size="20" :total="total3" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>
			

		</el-tabs>
	



	 <!-- 新增/编辑 -->
    <el-drawer
		:title="drawerTitle"
		:before-close="handleClose"
		:visible.sync="addDialog"
		direction="rtl"
		custom-class="demo-drawer"
		ref="drawer"
		class="device-drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="editDraceletData" ref="editDraceletData" :rules="rules" label-width="120px">
          <el-row :gutter="24">
			<el-col :span="20" :offset="1">
              <el-form-item label="姓名：" prop="personName">
                <el-input clearable disabled v-model="editDraceletData.personName" placeholder="" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="1">
				<el-form-item label="手环MAC：" prop="wristbandNo">
					<el-input clearable maxlength="12" v-model="editDraceletData.wristbandNo" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
            </el-col>
			<el-col :span="20" :offset="1">
              <el-form-item label="手环类型：" prop="wristbandType">
				    <el-radio v-model="editDraceletData.wristbandType" label="1">普通版</el-radio>
  					<el-radio v-model="editDraceletData.wristbandType" label="2">测温版</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="btns">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submitForm('editDraceletData')" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	import {base} from '../../config'
	import { getGrade,
	getClasses, getBuilds, getGradesByType, personTrack, getBraceletDetail, updateMac, sendUserInfo, batchSendUserInfo} from '../../api/api';

	export default {
    name:"locationData",
		data() {
			return {
				exportUrl1: '',
				exportUrl2: '',
				exportUrl3: '',
				filters1:{
					kw: '',
					gradeType: '',
					gradeId: '',
					classId: '',
					bindStatus: '',
				},
				filters2:{
					kw: '',
					bindStatus: '',
					sendStatus: ''
				},
				filters3:{
					kw: '',
					bindStatus: '',
					sendStatus: ''
				},

				activeName: 'first',
				total1: 0,
				page1: 1,
				total2: 0,
				page2: 1,
				total3: 0,
				page3: 1,
		
				grandList: [],
				classList: [],
				classList1: [],
				studentRecord: [],
				teacherRecord: [],
				parentRecord: [],
				flag1: false,
				flag2: false,
				flag3: false,
				isShow1: false,
				isShow2: false,
				isShow3: false,
				drawerTitle: '',
				addDialog: false,
				editDraceletData:{
					devSn: "",
					devName: "",
					wristbandType: ''
				},
				rules: {
					personName: [
						{ required: false, message: '请输入姓名', trigger: 'blur' }
					],
					wristbandNo: [
						{ required: true, message: '请输入手环MAC', trigger: 'blur' }
					],
					wristbandType: [
						{ required: true, message: '请选择手环类型', trigger: 'blur' }
					]
				},
				loading: false,
				oldPersonId: '',
				importVisible1: false,
				importVisible2: false,
				importVisible3: false,
				importData1: {},
				importData2: {},
				importData3: {},
				importForm1:{
					deviceFile:'',
				},
				importForm2:{
					deviceFile:'',
				},
				importForm3:{
					deviceFile:'',
				},
				action:'',
				fileList1:[],
				href1:'',
				fileList2:[],
				href2:'',
				fileList3:[],
				href3:'',
			}
		},

		methods: {
			toSecondPage (row) {
				this.$router.push({ path: '/daily-track/' + row.personId });
			},
			toHistory (row) {
				this.$router.push({ path: '/locationData-history/' + row.personId });
			},
			// 重置
			resetForm (formName) {
				this.$refs[formName].resetFields();
			},

			sendUserInfo (row) {
				let params = {"personId": row.personId}
				sendUserInfo(params).then((res) =>{
					if(res.code == 200) {
						this.$message({
							message: '下发成功',
							type: 'success'
						});

						let para = {
							personType: 1,
							kw: this.filters1.kw,
							gradeType: this.filters1.gradeType,
							gradeId: this.filters1.gradeId,
							classId: this.filters1.classId,
							bindStatus: this.filters1.bindStatus,
							sendStatus: this.filters1.sendStatus,
							page: this.page,
							pageSize: this.prePage
						}

						personTrack(para).then((res) => {
						
							this.studentRecord = res.data.dataList
							this.total1 = res.data.totalCount
							this.page1 = 1
						});
					}else{
						this.$message({
							message: '下发失败',
							type: 'error'
						});
					}
				})
			},

			// 编辑按钮
			editDracelet (row) {
				this.drawerTitle = '编辑'
				let params = {"personId": row.personId}
				getBraceletDetail(params).then((res) =>{
				if(res.code == 200) {
					this.editDraceletData = Object.assign({}, res.data);
					this.oldPersonId = row.personId
				}
				})
				// this.editType = type
				this.addDialog = true
			},

			// 改变事件
			changeFile1 (file, fileList) {
				// 这边是开启是否是只能一张一张传
				if (fileList.length > 0) {
					this.fileList = [fileList[fileList.length - 1]];
					this.imageUrl = URL.createObjectURL(file.raw);
				}
				this.file = file.raw;
				console.log(this.file);
				const isExcel = file.raw.name.substring(file.raw.name.lastIndexOf('.') + 1)
				if (isExcel !== 'xls' && isExcel !== 'xlsx') {
					this.$message.error("上传文件只能是 .xls或.xlsx 格式!");
					this.clearFiles();
					this.file = ''
					this.fileList = []
					return;
				}
			},
			  // 导入保存
			submitUpload1() {
				if (!this.file1) {
					this.$message.error('请先选择文件，再导入！');
					return;
				}
				const form = new FormData();
				form.append("excel",this.file1);
				devImport(form).then(res => {
					if (res.code === 200) {
					if (res.data.error) {
						this.$message({message: '导入成功',type: 'success'});
						this.importVisible1 = false;
						this.file1 = '';
						this.fileList1 = [];
						let params = JSON.parse(JSON.stringify(this.filters1)) 
						params.page = this.page1
						params.prePage = this.prePage1
						// this.getStations(params)
					} else {
						this.$message.error(res.msg);
						this.file1 = ""
						this.fileList1 = []
						if (res.data.header && res.data.sheetData) {
						let headerArr = []
						let sheetDataArr = []
						for (let index in res.data.header) {
							headerArr.push(res.data.header[index])
						}
						headerArr.push("提示")
						res.data.headerArr = headerArr

						res.data.sheetData.map(item => {
							let sheetDataArrItem = []
							for (let index in item) {
							sheetDataArrItem.push(item[index])
							}
							if(!item.error){
							item.err = "无"
							}
							sheetDataArr.push(sheetDataArrItem)
						})
						res.data.sheetDataArr = sheetDataArr
						this.importData1 = res.data
						}
					}
					} else {
					this.$message.error(res.msg);
					}
				})
			},

			// 新增/编辑 - 取消
			handleClose() {

				let _this = this
					this.$confirm('确认关闭？')
					.then(_ => {
						this.addDialog = false
						_this.resetForm('editDraceletData')

					// done()
					})
				.catch(_ => {});
			},
					
			// 展开/收起
			toggle1 () {
				this.flag1 = !this.flag1;
				if (this.flag1) {
					this.isShow1 = true;
				} else {
					this.isShow1 = false;
				}
			},
			// 展开/收起
			toggle2 () {
				this.flag2 = !this.flag2;
				if (this.flag2) {
					this.isShow2 = true;
				} else {
					this.isShow2 = false;
				}
			},
			// 展开/收起
			toggle3 () {
				this.flag3 = !this.flag3;
				if (this.flag3) {
					this.isShow3 = true;
				} else {
					this.isShow3 = false;
				}
			},
			 // 导入取消
			cancelImport1 () {
				this.file1 = ''
				this.fileList1 = []
				this.importData1 = {}
				this.importVisible1 = false
			},

			// 文件移除
			handleRemove1(file, fileList) {
				this.file1 = ''
				this.fileList1 = []
			},

			// 文件个数限制
			handleExceed1(files, fileList) {
				this.$message.error('只允许上传一个文件！');
			},

			// 导入取消
			cancel1(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.file1 = ''
						this.fileList1 = []
						this.importData1 = {}
						this.importVisible1 = false
					})
				.catch(_ => {});
			},
			// 导入取消
			cancel2(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.file2 = ''
						this.fileList2 = []
						this.importData2 = {}
						this.importVisible2 = false
					})
				.catch(_ => {});
			},
			// 导入取消
			cancel3(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.file3 = ''
						this.fileList3 = []
						this.importData3 = {}
						this.importVisible3 = false
					})
				.catch(_ => {});
			},
			
			batchSend1(){
				let para = {
					personType: 1,
					kw: this.filters1.kw,
					gradeType: this.filters1.gradeType,
					gradeId: this.filters1.gradeId,
					classId: this.filters1.classId,
					bindStatus: this.filters1.bindStatus,
					sendStatus: this.filters1.sendStatus
				}
				batchSendUserInfo(para).then((res) => {
					if(res.code === 200){
						this.$message({message: '下发成功',type: 'success'});
					}
				});
			},
			
			changeGrade: function(type){
				let para = {
					type: type
				}
				getGradesByType(para).then((res) => {
					this.grandList = res.data;
					this.filters1.gradeId = ''
					this.filters1.classId = ''
					this.classList = []
				});
			},
			closeDialog: function(){
				this.picVisible = false
			},
			change1: function(val){
				this.filters1.classId = ''
				let para = {
					gradeId: val
				}
				getClasses(para).then((res) => {
					this.classList = res.data;

				});
			},
			change2: function(val){
				this.filters3.classId = ''
				let para = {
					gradeId: val
				}
				getClasses(para).then((res) => {
					this.classList1 = res.data;
				});
			},
			formaSex: function (row, column) {
				if(row.sex==1){
					return "男"
				}else if(row.sex==2){
					return "女"
				}else{
					return "保密"
				}
			},
			formatBandType: function (row, column) {
				// 手环类型(1：普通版，2：测温版)
				if(row.wristbandType==1){
					return "普通版"
				}else if(row.wristbandType==2){
					return "测温版"
				}else{
					return "-"
				}
			},
			formaResidence: function (row, column) {
				if(row.inResidence==1){
					return "住读"
				}else if(row.inResidence==2){
					return "走读"
				}else{
					return "未知"
				}
			},
			formaDirect: function (row, column) {
				// 出入方式（1：进，2：出）
				if(row.inOutType==1){
					return "进"
				}else if(row.inOutType==2){
					return "出"
				}else{
					return "未知"
				}
			},
			formatSendStatus: function (row) {
				//下发状态(1：下发中，2：成功，3：失败)
				if(row.sendStatus==1){
					return "下发中"
				}else if(row.sendStatus==2){
					return "成功"
				}else if(row.sendStatus==3){
					return "失败"
				}else{
					return "-"
				}
			},
			formatStatus: function (row) {
				// 出入状态(0：正常，1：异常)
				if(row.status==0){
					return "正常"
				}else if(row.status==1){
					return "异常"
				}else{
					return "-"
				}
			},
				// 1：幼儿园 2：小学 3：初中 4：高中 5：大学
			formatGradeType: function (row) {
				if(row.gradeType==1){
					return "幼儿园"
				}else if(row.gradeType==2){
					return "小学"
				}else if(row.gradeType==3){
					return "初中"
				}else if(row.gradeType==4){
					return "高中"
				}else if(row.gradeType==5){
					return "大学"
				}
			},
			formatTime: function (row, column) {
				if(!row.entryTime) return '-'
				return util.formatDate.format(new Date(row.entryTime*1000), 'yyyy-MM-dd hh:mm:ss');
			},
			formatTime1: function (timestep) {
				if(!timestep) return '-'
				return util.formatDate.format(new Date(timestep*1000), 'yyyy-MM-dd hh:mm');
			},
	
			dateToTimestemp: function(timeDate){
			// var timeDate = "2019-05-09 14:50:48";
				return new Date(timeDate).getTime()/1000||""
			},
			// 新增/编辑-提交
			submitForm (formName) {
				this.$refs[formName].validate((valid) => {
					let params = this.editDraceletData
					if (valid) {
						params.personId = this.oldPersonId
						updateMac(params).then((res) =>{
							if(res.code == 200) {
								this.$message({message: '编辑成功',type: 'success'});
								let params = JSON.parse(JSON.stringify(this.filters)) 
								params.page = this.page
								params.prePage = this.prePage
								// this.queryStudent()

								let para = {
									personType: 1,
									kw: this.filters1.kw,
									gradeType: this.filters1.gradeType,
									gradeId: this.filters1.gradeId,
									classId: this.filters1.classId,
									bindStatus: this.filters1.bindStatus,
									page: this.page,
									pageSize: this.prePage
								}

								personTrack(para).then((res) => {
									
									this.studentRecord = res.data.dataList
									this.total1 = res.data.totalCount
									this.page1 = 1
								});

								this.addDialog = false
								this.resetForm('editDraceletData')
							}
						})

					} else {
					console.log('error submit!!');
					return false;
					}
				});

			},
	
			handleCurrentChange1(val) {
				if(val==this.page1) return
				this.page1 = val;
				let para = {
					personType: 1,
					kw: this.filters1.kw,
					gradeType: this.filters1.gradeType,
					gradeId: this.filters1.gradeId,
					classId: this.filters1.classId,
					bindStatus: this.filters1.bindStatus,
					page: this.page1,
					pageSize: 20
				}
				personTrack(para).then((res) => {
					
					this.studentRecord = res.data.dataList
					this.total1 = res.data.totalCount
				});
			},
			handleCurrentChange2(val) {
				if(val==this.page2) return
				this.page2 = val;
				let para = {
					personType: 2,
					kw: this.filters2.kw,
					bindStatus: this.filters2.bindStatus,
					sendStatus: this.filters2.sendStatus,
					page: this.page2,
					pageSize: 20
				}
				personTrack(para).then((res) => {
				
					this.teacherRecord = res.data.dataList
					this.total2 = res.data.totalCount
				});
			},

			handleCurrentChange3(val) {
				if(val==this.page3) return
				this.page3 = val;
				let para = {
					personType: 3,
					kw: this.filters3.kw,
					bindStatus: this.filters3.bindStatus,
					sendStatus: this.filters3.sendStatus,
					page: this.page3,
					pageSize: 20
				}
				personTrack(para).then((res) => {
					this.parentRecord = res.data.dataList
					this.total3 = res.data.totalCount
				});
			},

			getClasses(id){
				let para = {
					gradeId: id
				}
				getClasses(para).then((res) => {
					// this.$message({
					// 	message: '成功',
					// 	type: 'success'
					// });
				});
			},
	
	
			queryStudent(){
				let para = {
					personType: 1,
					kw: this.filters1.kw,
					gradeType: this.filters1.gradeType,
					gradeId: this.filters1.gradeId,
					classId: this.filters1.classId,
					bindStatus: this.filters1.bindStatus,
					page: 1,
					pageSize: 20
				}
				personTrack(para).then((res) => {	
					this.studentRecord = res.data.dataList
					this.total1 = res.data.totalCount
					this.page1 = 1
				});
			},

			queryTeacher(){
				let para = {
					personType: 2,
					kw: this.filters2.kw,
					bindStatus: this.filters2.bindStatus,
					sendStatus: this.filters2.sendStatus,
					page: 1,
					pageSize: 20
				}
				personTrack(para).then((res) => {
			
					this.teacherRecord = res.data.dataList
					this.total2 = res.data.totalCount
					this.page2 = 1
				});
			},

			queryParent(){
				let para = {
					personType: 3,
					kw: this.filters3.kw,
					bindStatus: this.filters3.bindStatus,
					sendStatus: this.filters3.sendStatus,
					page: 1,
					pageSize: 20
				}
				personTrack(para).then((res) => {
				
					this.parentRecord = res.data.dataList
					this.total3 = res.data.totalCount
					this.page3 = 1
				});
			},
			

			getGrade() {
				let para = {}
				this.listLoading = true;
				getGrade(para).then((res) => {
					this.grandList = res.data;

					
				});
			},


			//获取建筑
			getBuilds() {
				let para = {}
				this.listLoading = true;
				getBuilds(para).then((res) => {
					this.listLoading = false;
					// this.invokePushItems(res.data)
				});
			},


		},
		mounted() {
			// this.getGrade()
			this.getBuilds();
			this.queryStudent();
			this.queryTeacher();
			this.queryParent();
			this.href1 = util.getUpload('人脸设备导入模板.xlsx')
			this.href2 = util.getUpload('人脸设备导入模板.xlsx')
			this.href3 = util.getUpload('人脸设备导入模板.xlsx')
		}
	}

</script>

<style lang="scss">
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
	.preview-img{
		width: 100%;
	}
	.data-export{
		text-decoration: none;
		color:#fff;
		display: inline-block;
		width: 160px;
		height: 36px;
		background-color: #20a0ff;
		border-radius: 5px;
		line-height: 36px;
		text-align: center;
	}
	.orage{
		background-color: #ff9800;
		border-color: #ff9800;
	}

	.device-drawer, .copyDevice{
		.el-form-item__content{
			.el-select{
				display: block;
			}
		}
		.btns{
			position: absolute;
			right:0;
			bottom: 0;
			width: 100%;
			border-top: 1px solid #e9e9e9;
			padding: 10px 16px;
			text-align: right
		}
	}
	.step-p{
		padding: 0;
		margin: 0;
	}


</style>