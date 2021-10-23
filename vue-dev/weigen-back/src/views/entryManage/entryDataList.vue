<template>
	<section>

		 <el-tabs v-model="activeName">
			<el-tab-pane label="学生" name="first">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters1">
						<el-form-item>
							<el-input v-model="filters1.kw" style="width: 280px" placeholder="请输入姓名/终端名称/场所名称"></el-input>
						</el-form-item>
						年级：
						<el-select v-model="filters1.gradeId" placeholder="请选择" @change="change1">
							<el-option
								v-for="item in grandList"
								:key="item.gradeId"
								:label="item.gradeName"
								:value="item.gradeId">
							</el-option>
						</el-select>
						班级：
						<el-select v-model="filters1.classId" placeholder="请选择">
							<el-option
								v-for="item in classList"
								:key="item.classId"
								:label="item.className"
								:value="item.classId">
							</el-option>
						</el-select>
						读书形式：
						<el-select v-model="filters1.inResidence" style="width:100px;" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="住读" value="1"></el-option>
							<el-option label="走读" value="2"></el-option>
						</el-select>
						<el-date-picker
							v-model="filters1.date"
							type="datetimerange"
							@change="getSTime1"
							placeholder="打卡时间"
							range-separator=" ~ "
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
						终端类型：
						<el-select v-model="filters1.devType" style="width:100px;" placeholder="请选择">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						
						所属建筑：
						<el-select v-model="filters1.buildId" placeholder="请选择">
							<el-option label="全部" value="0"></el-option>
							<el-option
								v-for="item in buildingList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
						状态：
						<el-select v-model="filters1.status" style="width:100px;" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="正常" value="0"></el-option>
							<el-option label="异常" value="1"></el-option>
						</el-select>
						请假：
						<el-select v-model="filters1.isApplyLeave" style="width:100px;" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
						</el-select>
						<el-form-item>
							<el-button type="primary" size="medium"  v-on:click="queryStudent">查询</el-button>
							<a :href="exportUrl" @click="dataExport" style="width: 140px" class="data-export">导出（最多3000条）</a>
						</el-form-item>

					</el-form>
				</el-col>
				<!--列表-->
				<el-table :data="studentRecord" highlight-current-row  @selection-change="selsChange" style="width: 100%;">
					<el-table-column prop="personName" label="姓名" min-width="120" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="sex" label="性别" min-width="80" :show-overflow-tooltip="true" :formatter="formaSex">
					</el-table-column>
					<el-table-column prop="gradeType" label="学业阶段" min-width="100" :show-overflow-tooltip="true" :formatter="formatGradeType">
					</el-table-column>
					<el-table-column prop="gradeName" label="年级" min-width="150" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="className" label="班级" min-width="150" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="inResidence" label="读书形式" min-width="100" :show-overflow-tooltip="true" :formatter="formaResidence">
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" min-width="200" :show-overflow-tooltip="true" :formatter="formatTime">
					</el-table-column>
					<el-table-column prop="entryTime" label="打卡时间" min-width="200" :show-overflow-tooltip="true" :formatter="formatTime1">
					</el-table-column>
					<el-table-column prop="devName" label="终端名称" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="devType" label="终端类型" min-width="100" :show-overflow-tooltip="true" :formatter="formaType">
					</el-table-column>
					<el-table-column prop="buildName" label="所属建筑" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="placeName" label="场所名称" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="inOutType" label="方向" min-width="100" :show-overflow-tooltip="true" :formatter="formaDirect">
					</el-table-column>
					<el-table-column prop="status" label="状态" min-width="120" :show-overflow-tooltip="true" :formatter="formatStatus">
					</el-table-column>
					<el-table-column prop="isApplyLeave" label="请假" min-width="120" :show-overflow-tooltip="true" :formatter="formatApplyLeave">
					</el-table-column>
					<el-table-column label="图片" width="150">
						<template slot-scope="scope">
							<el-button type="text" v-if="!!scope.row.pic" size="small" @click="handlePreview(scope.$index, scope.row)">查看</el-button>
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
			<el-tab-pane label="教职工" name="second">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters2">
						<el-form-item>
							<el-input v-model="filters2.kw" style="width: 280px" placeholder="请输入姓名/终端名称/场所名称"></el-input>
						</el-form-item>
						部门：
						<el-select v-model="filters2.departmentId" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option
								v-for="item in departmentList"
								:key="item.departmentId"
								:label="item.departmentName"
								:value="item.departmentId">
							</el-option>
						</el-select>
						<br/>
						<el-date-picker
							v-model="filters2.date"
							type="datetimerange"
							@change="getSTime2"
							placeholder="打卡时间"
							range-separator=" ~ "
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
						终端类型：
						<el-select v-model="filters2.devType" style="width:100px;" placeholder="请选择">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						
						所属建筑：
						<el-select v-model="filters2.buildId" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option
								v-for="item in buildingList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
						状态：
						<el-select v-model="filters2.status" style="width:100px;" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="正常" value="0"></el-option>
							<el-option label="异常" value="1"></el-option>
						</el-select>
						<el-form-item>
							<el-button type="primary" size="medium"  v-on:click="queryTeacher">查询</el-button>
							<a :href="exportTeacherUrl" style="width: 140px" @click="dataTeacherExport" class="data-export">导出（最多3000条）</a>
						</el-form-item>
					</el-form>
				</el-col>
				<!--列表-->
				<el-table :data="teacherRecord" highlight-current-row  @selection-change="selsChange" style="width: 100%;">
					<el-table-column prop="personName" label="姓名" min-width="120" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="sex" label="性别" min-width="80" :show-overflow-tooltip="true" :formatter="formaSex">
					</el-table-column>
					<el-table-column prop="departmentName" label="部门" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" min-width="200" :show-overflow-tooltip="true" :formatter="formatTime">
					</el-table-column>
					<el-table-column prop="entryTime" label="打卡时间" min-width="200" :show-overflow-tooltip="true" :formatter="formatTime1">
					</el-table-column>
					<el-table-column prop="devName" label="终端名称" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="devType" label="终端类型" min-width="100" :show-overflow-tooltip="true" :formatter="formaType">
					</el-table-column>
					<el-table-column prop="buildName" label="所属建筑" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="placeName" label="场所名称" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="inOutType" label="方向" min-width="100" :show-overflow-tooltip="true" :formatter="formaDirect">
					</el-table-column>
					<el-table-column prop="status" label="状态" min-width="120" :show-overflow-tooltip="true" :formatter="formatStatus">
					</el-table-column>
					<el-table-column label="图片" width="150">
						<template slot-scope="scope">
							<el-button type="text" v-if="!!scope.row.pic" size="small" @click="handlePreview(scope.$index, scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
					<el-pagination layout="total, prev, pager, next" :current-page="page2" @current-change="handleCurrentChange2" :page-size="20" :total="total2" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>

			<el-tab-pane label="家长" name="third">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters3">
						<el-form-item>
							<el-input v-model="filters3.kw" style="width: 280px" placeholder="请输入学生姓名/家长姓名/场所名称"></el-input>
						</el-form-item>
						年级：
						<el-select v-model="filters3.gradeId" placeholder="请选择" @change="change2">
							<el-option
								v-for="item in grandList"
								:key="item.gradeId"
								:label="item.gradeName"
								:value="item.gradeId">
							</el-option>
						</el-select>
						班级：
						<el-select v-model="filters3.classId" placeholder="请选择" >
							<el-option
								v-for="item in classList1"
								:key="item.classId"
								:label="item.className"
								:value="item.classId">
							</el-option>
						</el-select>
						读书形式：
						<el-select v-model="filters3.inResidence" style="width:100px;" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="住读" value="1"></el-option>
							<el-option label="走读" value="2"></el-option>
						</el-select>
						<el-date-picker
							v-model="filters3.date"
							type="datetimerange"
							@change="getSTime4"
							placeholder="打卡时间"
							range-separator=" ~ "
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
						终端类型：
						<el-select v-model="filters3.devType" style="width:100px;" placeholder="请选择">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						
						所属建筑：
						<el-select v-model="filters3.buildId" placeholder="请选择">
							<el-option label="全部" value="0"></el-option>
							<el-option
								v-for="item in buildingList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
						状态：
						<el-select v-model="filters3.status" style="width:100px;" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="正常" value="0"></el-option>
							<el-option label="异常" value="1"></el-option>
						</el-select>
						<el-form-item>
							<el-button type="primary" size="medium"  v-on:click="queryParent">查询</el-button>
							<a :href="exportParentUrl" @click="dataParentExport" style="width: 140px" class="data-export">导出（最多3000条）</a>
						</el-form-item>

					</el-form>
				</el-col>
				<!--列表-->
				<el-table :data="parentRecord" highlight-current-row  @selection-change="selsChange" style="width: 100%;">
					<el-table-column prop="parentName" label="家长姓名" min-width="120" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="relationName" label="关系" min-width="120" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="personName" label="学生姓名" min-width="120" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="sex" label="性别" min-width="80" :show-overflow-tooltip="true" :formatter="formaSex">
					</el-table-column>
					<el-table-column prop="gradeType" label="学业阶段" min-width="100" :show-overflow-tooltip="true" :formatter="formatGradeType">
					</el-table-column>
					<el-table-column prop="gradeName" label="年级" min-width="150" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="className" label="班级" min-width="150" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="inResidence" label="读书形式" min-width="100" :show-overflow-tooltip="true" :formatter="formaResidence">
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" min-width="200" :show-overflow-tooltip="true" :formatter="formatTime">
					</el-table-column>
					<el-table-column prop="entryTime" label="打卡时间" min-width="200" :show-overflow-tooltip="true" :formatter="formatTime1">
					</el-table-column>
					<el-table-column prop="devName" label="终端名称" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="devType" label="终端类型" min-width="100" :show-overflow-tooltip="true" :formatter="formaType">
					</el-table-column>
					<el-table-column prop="buildName" label="所属建筑" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="placeName" label="场所名称" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="inOutType" label="方向" min-width="100" :show-overflow-tooltip="true" :formatter="formaDirect">
					</el-table-column>
					<el-table-column prop="status" label="状态" min-width="120" :show-overflow-tooltip="true" :formatter="formatStatus">
					</el-table-column>
					<el-table-column label="图片" width="150">
						<template slot-scope="scope">
							<el-button type="text" v-if="!!scope.row.pic" size="small" @click="handlePreview(scope.$index, scope.row)">查看</el-button>
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
	

	<el-dialog title="预览" width="70%" class="preview-dialog" :visible.sync="picVisible" >
		<div class="dialog-btn">
			<img class="preview-img" :src="previewPic" alt="">
			<el-button type="primary" size="medium"  v-on:click="closeDialog">关闭</el-button>
		</div>
	</el-dialog>
		
	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	import {base} from '../../config'
	import { getUserListPage, getDepartment, getGrade, entryDataStudent, entryDataParent, entryDataTeacher, entryDataRecords, getClasses, distribute, distributeByDevsn, getEntryRule, preViewEntryTime , createDevice, deleteDevice, getEntryRuleSend, getBuilds, getPlaces, getDeviceList, removeUser, batchRemoveUser, editUser, addUser , getRecord, checkOrder, cancelCheckOrder} from '../../api/api';

	export default {
		data() {
			return {
				exportUrl: '',
				exportTeacherUrl: '',
				exportParentUrl: '',
				filters1:{
					kw: '',
					gradeId: '',
					classId: '',
					inResidence: '',
					date: '',
					status: '',
					devType: '',
					buildId: '',
					isApplyLeave:''
				},
				filters2:{
					kw: '',
					departmentId: '',
					inResidence: '',
					date: '',
					status: '',
					devType: '',
					buildId: ''
				},
				filters3:{
					kw: '',
					gradeId: '',
					classId: '',
					inResidence: '',
					date: '',
					status: '',
					devType: '',
					buildId: ''
				},
		
				timeArr:[],
				timeArr1: [],
				timeArr2: [],
				timeArr3: [],
				timeArr4: [],
				activeName: 'first',
				filters: {
					name: ''
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
					value: '1',
					label: '闸机'
					},{
					value: '2',
					label: '单立柱'
				}],
				deviceList: [],
				placeList: [],
				users: [],
				total1: 0,
				page1: 1,
				total2: 0,
				page2: 1,
				total3: 0,
				page3: 1,
				departmentList: [],
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
				passwords: "1",
				grandList: [],
				classList: [],
				classList1: [],
				studentRecord: [],
				teacherRecord: [],
				parentRecord: [],
				laborRecord: [],
				jobList: [],
				picVisible: false,
				previewPic: ""
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
					return "未知"
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
			formaType: function (row, column) {
				if(row.devType==1){
					return "闸机"
				}else if(row.devType==2){
					return "单立柱"
				}else{
					return "未知"
				}
			},
			formatApplyLeave: function (row, column) {
				if(row.isApplyLeave == 1){
					return "是"
				}else if(row.isApplyLeave == 0){
					return "否"
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
			getSTime(val) {
				if(val){
					this.timeArr = val
				}else{
					this.timeArr = []
				}
			},
			getSTime1(val) {
				if(val){
					this.timeArr1 = val
				}else{
					this.timeArr1 = []
				}
			},
			getSTime2(val) {
				if(val){
					this.timeArr2 = val
				}else{
					this.timeArr2 = []
				}

			},
			getSTime3(val) {
				if(val){
					this.timeArr3 = val
				}else{
					this.timeArr3 = []
				}
			},
			getSTime4(val) {
				if(val){
					this.timeArr4 = val
				}else{
					this.timeArr4 = []
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
				return util.formatDate.format(new Date(row.createTime*1000), 'yyyy-MM-dd hh:mm:ss');
			},
			formatTime1: function (row, column) {
				if(row.entryTime){
					return util.formatDate.format(new Date(row.entryTime*1000), 'yyyy-MM-dd hh:mm:ss');
				}else{
					return "-"
				}
			},
			dateToTimestemp: function(timeDate){
				// var timeDate = "2019-05-09 14:50:48";
				return new Date(timeDate).getTime()/1000||""
			},
			handleCurrentChange1(val) {
				if(val==this.page1) return
				this.page1 = val;
				let para = {
					kw: this.filters1.kw,
					gradeId: this.filters1.gradeId,
					classId: this.filters1.classId,
					buildId: this.filters1.buildId,
					inResidence: this.filters1.inResidence,
					status: this.filters1.status,
					devType: this.filters1.devType,
					startTime: this.dateToTimestemp(this.timeArr1[0]),
					endTime: this.dateToTimestemp(this.timeArr1[1]),
					page: this.page1,
					pageSize: 20
				}
				entryDataStudent(para).then((res) => {
					this.studentRecord = res.data.dataList
					this.total1 = res.data.totalCount
				});
			},
			handleCurrentChange2(val) {
				if(val==this.page2) return
				this.page2 = val;
				let para = {
					kw: this.filters2.kw,
					departmentId: this.filters2.departmentId,
					inResidence: this.filters2.inResidence,
					status: this.filters2.status,
					buildId: this.filters2.buildId,
					devType: this.filters2.devType,
					startTime: this.dateToTimestemp(this.timeArr2[0]),
					endTime: this.dateToTimestemp(this.timeArr2[1]),
					page: this.page2,
					pageSize: 20
				}
				entryDataTeacher(para).then((res) => {
					this.teacherRecord = res.data.dataList
					this.total2 = res.data.totalCount
				});
			},

			handleCurrentChange3(val) {
				if(val==this.page3) return
				this.page3 = val;
				let para = {
					kw: this.filters3.kw,
					gradeId: this.filters3.gradeId,
					classId: this.filters3.classId,
					buildId: this.filters3.buildId,
					inResidence: this.filters3.inResidence,
					status: this.filters3.status,
					devType: this.filters3.devType,
					startTime: this.dateToTimestemp(this.timeArr4[0]),
					endTime: this.dateToTimestemp(this.timeArr4[1]),
					page: this.page3,
					pageSize: 20
				}
				entryDataParent(para).then((res) => {
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
			getDepartment(){
				let para = {}
				getDepartment(para).then((res) => {
					if(res.code==200){
						// this.previewVisible = true
						this.departmentList = res.data
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			handleDistribute(type){
				let para = {
					type: type
				}
				distribute(para).then((res) => {
					this.$message({
						message: '成功',
						type: 'success'
					});
				});
			},
			queryStudent(){
				let para = {
					kw: this.filters1.kw,
					gradeId: this.filters1.gradeId,
					classId: this.filters1.classId,
					buildId: this.filters1.buildId,
					inResidence: this.filters1.inResidence,
					status: this.filters1.status,
					isApplyLeave: this.filters1.isApplyLeave,
					devType: this.filters1.devType,
					startTime: this.dateToTimestemp(this.timeArr1[0]),
					endTime: this.dateToTimestemp(this.timeArr1[1]),
					page: 1,
					pageSize: 20
				}
				entryDataStudent(para).then((res) => {
					this.studentRecord = res.data.dataList
					this.total1 = res.data.totalCount
					this.page1 = 1
				});
			},
			queryParent(){
				let para = {
					kw: this.filters3.kw,
					gradeId: this.filters3.gradeId,
					classId: this.filters3.classId,
					buildId: this.filters3.buildId,
					inResidence: this.filters3.inResidence,
					status: this.filters3.status,
					devType: this.filters3.devType,
					startTime: this.dateToTimestemp(this.timeArr4[0]),
					endTime: this.dateToTimestemp(this.timeArr4[1]),
					page: 1,
					pageSize: 20
				}
				entryDataParent(para).then((res) => {
					this.parentRecord = res.data.dataList
					this.total3 = res.data.totalCount
					this.page3 = 1
				});
			},
			// 导出
			dataExport() {
				let token=sessionStorage.getItem("token");
				let userId=sessionStorage.getItem("userId");
				let kw = this.filters1.kw || '';
				let inResidence = this.filters1.inResidence || '';
				let gradeId = this.filters1.gradeId || '';
				let classId = this.filters1.classId || '';
				let devType = this.filters1.devType || '';
				let buildId = this.filters1.buildId || '';
				let status = this.filters1.status || '';
				let isApplyLeave = this.filters1.isApplyLeave || '';
				let startTime = this.dateToTimestemp(this.timeArr1[0]) || '';
				let endTime = this.dateToTimestemp(this.timeArr1[1]) || '';
				let url = util.portUrl("/wg-entry/entry-data/student-export?userId="+userId+"&accessToken="+token+"&kw="+kw+
				"&inResidence="+inResidence+"&gradeId="+gradeId+"&classId="+classId+"&isApplyLeave="+isApplyLeave+
				"&devType="+devType+"&buildId="+buildId+"&status="+status+"&startTime="+startTime+"&endTime="+endTime)
				this.exportUrl = url
			},
			// 导出
			dataTeacherExport() {
				let token=sessionStorage.getItem("token");
				let userId=sessionStorage.getItem("userId");
				let kw = this.filters2.kw || '';
				let departmentId = this.filters2.departmentId || '';
				let devType = this.filters2.devType || '';
				let buildId = this.filters2.buildId || '';
				let status = this.filters2.status || '';
				let startTime = this.dateToTimestemp(this.timeArr2[0]) || '';
				let endTime = this.dateToTimestemp(this.timeArr2[1]) || '';
				let url = util.portUrl("/wg-entry/entry-data/teacher-export?userId="+userId+"&accessToken="+token+"&kw="+kw+"&departmentId="+departmentId+
				"&devType="+devType+"&buildId="+buildId+"&status="+status+"&startTime="+startTime+"&endTime="+endTime)
				this.exportTeacherUrl = url
			},
			// 导出
			dataParentExport() {
				let token=sessionStorage.getItem("token");
				let userId=sessionStorage.getItem("userId");
				let kw = this.filters3.kw || '';
				let inResidence = this.filters3.inResidence || '';
				let gradeId = this.filters3.gradeId || '';
				let classId = this.filters3.classId || '';
				let devType = this.filters3.devType || '';
				let buildId = this.filters3.buildId || '';
				let status = this.filters3.status || '';
				let startTime = this.dateToTimestemp(this.timeArr4[0]) || '';
				let endTime = this.dateToTimestemp(this.timeArr4[1]) || '';
				let url = util.portUrl("/wg-entry/entry-data/parent-export?userId="+userId+"&accessToken="+token+"&kw="+kw+
				"&inResidence="+inResidence+"&gradeId="+gradeId+"&classId="+classId+
				"&devType="+devType+"&buildId="+buildId+"&status="+status+"&startTime="+startTime+"&endTime="+endTime)
				this.exportParentUrl = url
			},
			queryTeacher(){
				let para = {
					kw: this.filters2.kw,
					departmentId: this.filters2.departmentId,
					inResidence: this.filters2.inResidence,
					status: this.filters2.status,
					buildId: this.filters2.buildId,
					devType: this.filters2.devType,
					startTime: this.dateToTimestemp(this.timeArr2[0]),
					endTime: this.dateToTimestemp(this.timeArr2[1]),
					page: 1,
					pageSize: 20
				}
				entryDataTeacher(para).then((res) => {
					this.teacherRecord = res.data.dataList
					this.total2 = res.data.totalCount
					this.page2 = 1
				});
			},
			queryLabor(){
				let para = {
					kw: this.filters3.kw,
					departmentId: this.filters3.departmentId,
					inResidence: this.filters3.inResidence,
					status: this.filters3.status,
					devType: this.filters3.devType,
					startTime: this.dateToTimestemp(this.timeArr3[0]),
					endTime: this.dateToTimestemp(this.timeArr3[1]),
					page: this.page3,
					pageSize: 20
				}
				entryDataTeacher(para).then((res) => {
					this.laborRecord = res.data.dataList
					this.total3 = res.data.totalCount
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
			

			//获取列表
			getEntryRuleSend() {
				let para = {
					page: this.page,
					prePage: 20
				};
				this.listLoading = true;
				getEntryRuleSend(para).then((res) => {
					this.total = res.data.totalCount;
					this.users = res.data;
					this.listLoading = false;
				});
			},

			//预览图片
			handlePreview: function (index, row) {
				this.previewPic = row.pic
				this.picVisible = true
			},
			//添加
			handleAdd: function () {
				this.$router.push({ path: '/addEntryTime' });
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
									this.getEntryRuleSend();
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
								this.getEntryRuleSend();
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
			this.getGrade()
			this.getBuilds();
			this.getDepartment();
			this.queryTeacher();
			this.queryStudent();
			this.queryParent();
		}
	}

</script>

<style >
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

</style>