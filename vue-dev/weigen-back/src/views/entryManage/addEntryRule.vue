<template>
	<el-form :model="form" :rules="rules" ref="form"  label-width="120px" style="margin:20px;width:90%;min-width:600px;">
		<el-form-item label="策略名称" prop="name">
			<el-input v-model="form.name" style="width:300px" placeholder="请输入"></el-input>
		</el-form-item>
		<el-form-item label="策略终端">
			<span class="span-label">*</span>
			<el-button type="primary" size="medium"  v-on:click="getDev" :disabled="selectTeacherList.length>0||selectStudentList.length>0||selectParentList.length>0">添加终端</el-button>
		</el-form-item>
		<el-form-item>
			<el-table :data="selDeviceList" highlight-current-row style="width: 100%;">
				<el-table-column prop="devName" label="终端名称" min-width="120" >
				</el-table-column>
				<el-table-column prop="devType" label="终端类型" min-width="120" :formatter="formaType">
				</el-table-column>
				<el-table-column prop="devSn" label="终端MAC" min-width="120">
				</el-table-column>
				<el-table-column prop="buildName" label="所属建筑" min-width="120">
				</el-table-column>
				<el-table-column prop="roomName" label="场所名称" min-width="120">
				</el-table-column>
			</el-table>
		</el-form-item>
		<el-form-item label="选择时段">
			<span class="span-label">*</span>
			<el-button type="primary" size="medium"  v-on:click="getTimeSlot" :disabled="selectTeacherList.length>0||selectStudentList.length>0||selectParentList.length>0">选择时段</el-button>
		</el-form-item>
		
		<el-form-item>
			<div class="table-box" :key="item.index" v-for="(item,index) in relateTime">
				<div v-show="index>0">
					<img src="../../assets/arrow-down.png" alt=""> 关联时段
				</div>
				<table v-bind:class="{ red: item.status==2 }" border="1" cellspacing="0" style="border-collapse:collapse;" cellpadding="0">
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
							<td>{{item.index}}</td>
							<td>{{item.name}}</td>
							<td>{{item.period}}</td>
							<td>{{item.week}}</td>
							<td>{{item.timeSections}}</td>
							<td>{{formatStatus(item.status)}}</td>
						</tr>
					</tbody>
				</table>
				
			</div>
		</el-form-item>
		<el-form-item label="人员类型">
			<span class="span-label">*</span>
			<el-button type="primary" size="medium"  v-on:click="managePerson" :disabled="selDeviceList.length<=0||nextTimeSlot==0" >管理策略人员</el-button>
		    <el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="教职工" name="first">
					<el-table :data="selectTeacherList" highlight-current-row @selection-change="selsChange1" style="width: 100%;">
						<el-table-column prop="personName" label="姓名" min-width="120" >
						</el-table-column>
						<el-table-column prop="sex" label="性别" min-width="120" :formatter="formatSex">
						</el-table-column>
						<el-table-column prop="departmentName" label="当前部门" min-width="120" :formatter="formatResidence">
						</el-table-column>
						<el-table-column prop="remark" label="说明" min-width="120">
						</el-table-column>
						
					</el-table>
					<el-col :span="24" class="toolbar">
						<el-pagination layout="total, prev, pager, next" :current-page.sync="page1" @current-change="handleCurrentChange1" :page-size="20" :total="selTeacherList.length" style="float:right;">
						</el-pagination>
					</el-col>
				</el-tab-pane>
		
				<el-tab-pane label="学生" name="second">
					<el-table :data="selectStudentList" highlight-current-row @selection-change="selsChange1" style="width: 100%;">
							<el-table-column prop="personName" label="姓名" min-width="120" >
							</el-table-column>
							<el-table-column prop="sex" label="性别" min-width="120" :formatter="formatSex">
							</el-table-column>
							<el-table-column prop="inResidence" label="读书形式" min-width="120" :formatter="formatResidence">
							</el-table-column>
							<el-table-column prop="gradeType" label="学业阶段" min-width="120" :formatter="formatGradeType">
							</el-table-column>
							<el-table-column prop="gradeName" label="年级" min-width="120">
							</el-table-column>
							<el-table-column prop="className" label="班级" min-width="120">
							</el-table-column>
							<el-table-column prop="remark" label="说明" min-width="120">
							</el-table-column>
						</el-table>
						<el-col :span="24" class="toolbar">
						<el-pagination layout="total, prev, pager, next" :current-page.sync="page2" @current-change="handleCurrentChange2" :page-size="20" :total="selStudentList.length" style="float:right;">
						</el-pagination>
					</el-col>
				</el-tab-pane>

				<el-tab-pane label="家长" name="third">
					<el-table :data="selectParentList" highlight-current-row @selection-change="selsChange1" style="width: 100%;">
							<el-table-column prop="parentName" label="家长姓名" min-width="120" >
							</el-table-column>
							<el-table-column prop="personName" label="学生姓名" min-width="120">
							</el-table-column>
							<el-table-column prop="relationName" label="关系" min-width="120">
							</el-table-column>
							<el-table-column prop="sex" label="性别" min-width="120" :formatter="formatSex">
							</el-table-column>
							<el-table-column prop="inResidence" label="读书形式" min-width="120" :formatter="formatResidence">
							</el-table-column>
							<el-table-column prop="gradeType" label="学业阶段" min-width="120" :formatter="formatGradeType">
							</el-table-column>
							<el-table-column prop="gradeName" label="年级" min-width="120">
							</el-table-column>
							<el-table-column prop="className" label="班级" min-width="120">
							</el-table-column>
							<el-table-column prop="remark" label="说明" min-width="120">
							</el-table-column>
						</el-table>
						<el-col :span="24" class="toolbar">
						<el-pagination layout="total, prev, pager, next" :current-page.sync="page2" @current-change="handleCurrentChange3" :page-size="20" :total="selStudentList.length" style="float:right;">
						</el-pagination>
					</el-col>
				</el-tab-pane>
			</el-tabs>
		</el-form-item>
	
		<el-form-item>
			<el-button size="medium" type="primary" v-on:click="addEntryRule">保存</el-button>
			<el-button size="medium" @click.native.prevent v-on:click="back">取消</el-button>
		</el-form-item>
	
		<el-dialog title="选择时段" width="80%" class="preview-dialog" :visible.sync="previewVisible" :close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters4" ref="timeForm">
					<el-form-item  prop="kw">
						<el-input v-model="filters4.kw" style="width: 280px" placeholder="请输入时段名称"></el-input>
					</el-form-item>
					
					<el-form-item  prop="queryWeek">有效星期：
					<el-select v-model="filters4.queryWeek" placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option
							v-for="item in weeks"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium"  v-on:click="queryTimes">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="entryTime" highlight-current-row @selection-change="selsChange" style="width: 100%;">
				<el-table-column prop="index" label="序号" width="120" :show-overflow-tooltip="true">
				</el-table-column>
				
				<el-table-column prop="name" label="时段名称" min-width="120" >
				</el-table-column>

				<el-table-column prop="week" label="有效星期" min-width="120">
				</el-table-column>

				<el-table-column prop="timeSections" label="有效时区" min-width="120">
				</el-table-column>
			
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="medium" type="text" @click="getRelateTimeSlot(scope.$index, scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>

		
		</el-dialog>

		<el-dialog title="添加终端" width="80%" class="preview-dialog" :visible.sync="devVisible" :close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters" ref="devForm">
					<el-form-item prop="kw">
						<el-input v-model="filters.kw" style="width: 280px" placeholder="请输入终端名称/终端MAC/场所名称"></el-input>
					</el-form-item>
					<el-form-item prop="devType">
						终端类型：
						<el-select v-model="filters.devType" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="闸机" value="1"></el-option>
							<el-option label="单立柱" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="buildId">
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
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium"  v-on:click="queryDev">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="entryList" highlight-current-row row-key="devSn" @selection-change="selsChange1" style="width: 100%;">
				<el-table-column type="selection" width="55" :reserve-selection="true">
				</el-table-column>
				<el-table-column prop="devName" label="终端名称" min-width="120" >
				</el-table-column>
				<el-table-column prop="devType" label="终端类型" min-width="120" :formatter="formaType">
				</el-table-column>
				<el-table-column prop="devSn" label="终端MAC" min-width="120">
				</el-table-column>
				<el-table-column prop="buildName" label="所属建筑" min-width="120">
				</el-table-column>
				<el-table-column prop="roomName" label="场所名称" min-width="120">
				</el-table-column>
			</el-table>
			<div class="dialog-btn">
				<el-button size="medium" v-on:click="closeDialog">取消</el-button>
				<el-button type="primary" size="medium"  v-on:click="comfirmSelDevice">确定</el-button>
			</div>
		
		</el-dialog>

		<el-dialog title="管理策略人员" width="80%" class="preview-dialog" :visible.sync="personVisible1" :close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters1" ref="manageForm1">
					<el-form-item prop="kw">
						<el-input v-model="filters1.kw" style="width: 150px" placeholder="请输入姓名"></el-input>
					</el-form-item>
					<el-form-item prop="sex">
						性别：
						<el-select v-model="filters1.sex" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="男" value="1"></el-option>
							<el-option label="女" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="department">
						部门：
						<el-select v-model="filters1.department" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option
								v-for="item in departmentList"
								:key="item.departmentId"
								:label="item.departmentName"
								:value="item.departmentId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium"  v-on:click="queryPerson1">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="teacherList" highlight-current-row row-key="personId" @selection-change="selsChange2" style="width: 100%;">
				<el-table-column type="selection" :selectable="isDisabled" :reserve-selection="true" disabled="true" width="55">
				</el-table-column>
				<el-table-column prop="personName" label="姓名" min-width="120" >
				</el-table-column>
				<el-table-column prop="sex" label="性别" min-width="120" :formatter="formatSex">
				</el-table-column>
				<el-table-column prop="departmentName" label="当前部门" min-width="120">
				</el-table-column>
				<el-table-column prop="remark" label="说明" min-width="120">
				</el-table-column>
			</el-table>
				<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination @size-change="handleSizeChange1" :page-sizes="[100, 200, 300, 400]" layout="sizes, total, prev, pager, next" :current-page="prePage1" @current-change="currentChange1" :page-size="pageSize1" :total="total1" style="float:right;">
				</el-pagination>
			</el-col>
			<div class="dialog-btn">
				<el-button type="primary" size="medium"  v-on:click="comfirmSelect">确定</el-button>
			</div>
		
		</el-dialog>

		<el-dialog title="管理策略人员" width="80%" class="preview-dialog" :visible.sync="personVisible3" :close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters3" ref="manageForm2">
					<el-form-item prop="kw">
						<el-input v-model="filters3.kw" style="width: 150px" placeholder="请输入姓名"></el-input>
					</el-form-item>
					<el-form-item prop="sex">
						性别：
						<el-select v-model="filters3.sex" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="男" value="1"></el-option>
							<el-option label="女" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="inResidence">
						读书形式：
						<el-select v-model="filters3.inResidence" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="住读" value="1"></el-option>
							<el-option label="走读" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="gradeId">
						年级：
						<el-select v-model="filters3.gradeId" placeholder="请选择" @change="change1">
							<el-option label="全部" value=""></el-option>
							<el-option
								v-for="item in grandList"
								:key="item.gradeId"
								:label="item.gradeName"
								:value="item.gradeId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="classId">
						班级：
						<el-select v-model="filters3.classId" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option
								v-for="item in classList"
								:key="item.classId"
								:label="item.className"
								:value="item.classId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium"  v-on:click="queryPerson2">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="studentList" highlight-current-row row-key="personId" @selection-change="selsChange4" style="width: 100%;">
				<el-table-column type="selection" :selectable="isDisabled" :reserve-selection="true" disabled="true" width="55">
				</el-table-column>
				<el-table-column prop="personName" label="姓名" min-width="120" >
				</el-table-column>
				<el-table-column prop="sex" label="性别" min-width="120" :formatter="formatSex">
				</el-table-column>
				<el-table-column prop="inResidence" label="读书形式" min-width="120" :formatter="formatResidence">
				</el-table-column>
				<el-table-column prop="gradeType" label="学业阶段" min-width="120" :formatter="formatGradeType">
				</el-table-column>
				<el-table-column prop="gradeName" label="年级" min-width="120">
				</el-table-column>
				<el-table-column prop="className" label="班级" min-width="120">
				</el-table-column>
				<el-table-column prop="remark" label="说明" min-width="120">
				</el-table-column>
			</el-table>
				<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination @size-change="handleSizeChange2" :page-sizes="[100, 200, 300, 400]" layout="sizes, total, prev, pager, next" :current-page="prePage2" @current-change="currentChange2" :page-size="pageSize2" :total="total2" style="float:right;">
				</el-pagination>
			</el-col>
			<div class="dialog-btn">
				<el-button type="primary" size="medium"  v-on:click="comfirmSelect">确定</el-button>
			</div>
		
		</el-dialog>
		<el-dialog title="管理策略人员" width="80%" class="preview-dialog" :visible.sync="personVisible4" :close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters5" ref="manageForm3">
					<el-form-item prop="kw">
						<el-input v-model="filters5.kw" style="width: 150px" placeholder="请输入学生姓名/家长姓名"></el-input>
					</el-form-item>
					<el-form-item prop="sex">
						性别：
						<el-select v-model="filters5.sex" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="男" value="1"></el-option>
							<el-option label="女" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="gradeId">
						年级：
						<el-select v-model="filters5.gradeId" placeholder="请选择" @change="change2">
							<el-option label="全部" value=""></el-option>
							<el-option
								v-for="item in grandList"
								:key="item.gradeId"
								:label="item.gradeName"
								:value="item.gradeId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="classId">
						班级：
						<el-select v-model="filters5.classId" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option
								v-for="item in classList"
								:key="item.classId"
								:label="item.className"
								:value="item.classId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="inResidence">
						读书形式：
						<el-select v-model="filters5.inResidence" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="住读" value="1"></el-option>
							<el-option label="走读" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium"  v-on:click="queryPerson3">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="parentList" highlight-current-row row-key="personId" @selection-change="selsChange5" style="width: 100%;">
				<el-table-column type="selection" :selectable="isDisabled" :reserve-selection="true" disabled="true" width="55">
				</el-table-column>
				<el-table-column prop="parentName" label="家长姓名" min-width="120" >
				</el-table-column>
				<el-table-column prop="personName" label="学生姓名" min-width="120">
				</el-table-column>
				<el-table-column prop="relationName" label="关系" min-width="120">
				</el-table-column>
				<el-table-column prop="sex" label="性别" min-width="120" :formatter="formatSex">
				</el-table-column>
				<el-table-column prop="inResidence" label="读书形式" min-width="120" :formatter="formatResidence">
				</el-table-column>
				<el-table-column prop="gradeType" label="学业阶段" min-width="120" :formatter="formatGradeType">
				</el-table-column>
				<el-table-column prop="gradeName" label="年级" min-width="120">
				</el-table-column>
				<el-table-column prop="className" label="班级" min-width="120">
				</el-table-column>
				<el-table-column prop="remark" label="说明" min-width="120">
				</el-table-column>

			</el-table>
				<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination @size-change="handleSizeChange3" :page-sizes="[100, 200, 300, 400]" layout="sizes, total, prev, pager, next" :current-page="prePage3" @current-change="currentChange3" :page-size="pageSize3" :total="total3" style="float:right;">
				</el-pagination>
			</el-col>
			<div class="dialog-btn">
				<el-button type="primary" size="medium"  v-on:click="comfirmSelect">确定</el-button>
			</div>
		
		</el-dialog>
		
</el-form>


</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import { getTimeIndexs , getGrade, getDepartment, getBuilds, getClasses, getAllDevices, addEntryRule, getPersonsList, getTimeSlot, getEntryMacList, addTimeSlot, getRelateTimeSlot} from '../../api/api';
	export default {
		data() {
			return {
				activeName: 'first',
				form: {
					index: '',
					dateTime: '',
					name: '',
					startDate: '',
					endDate: '',
					week: [],
					region: '',
					
				},
				rules: {
					name: [
						{ required: true, message: '请输入策略名称', trigger: 'blur' },
						{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
					],
					
				},
				filters: {
					kw: '',
					buildId: '',
					devType: ''
				},
				filters1: {
					kw: '',
					sex: '',
					department: '',
				},
				filters2: {
					kw: '',
					sex: '',
					department: '',
				},
				filters3: {
					kw: '',
					sex: '',
					gradeId: '',
					classId: '',
					inResidence: ''
				},
				filters5: {
					kw: '',
					sex: '',
					gradeId: '',
					classId: '',
					inResidence: ''
				},
				filters4: {
					kw: '',
					queryWeek: ''
				},
				// week: [],
				time1: '',
				time2: '',
				time3: '',
				departmentList: [],
				weeks: [
					{
						name:'星期一',
						id: 1
					},
					{
						name:'星期二',
						id: 2
					},
					{
						name:'星期三',
						id: 3
					},
					{
						name:'星期四',
						id: 4
					},
					{
						name:'星期五',
						id: 5
					},
					{
						name:'星期六',
						id: 6
					},
					{
						name:'星期日',
						id: 7
					}
				],
				entryTime: [],
				name: '',
				startTime: '',
				endTime: '',
				indexs: [],
				value: '',
				previewVisible: false,
				devVisible: false,
				personVisible: false,
				personVisible1: false,
				personVisible2: false,
				personVisible3: false,
				personVisible4: false,
				preViewData: {},
				timeArr1: [],
				timeArr2: [],
				timeArr3: [],
				queryWeek: '',
				kw: '',
				nextTimeSlot: 0,
				relateTime: [],
				entryList: [],
				selDevice: [],
				selDeviceList: [],
				total: 0,
				total1: 0,
				total2: 0,
				page: 1,
				prePage1: 1,
				prePage2: 1,
				studentList: [],
				selStudentList: [],
				selectStudentList: [],
				teacherList: [],
				selTeacherList: [],
				selectTeacherList: [],
				parentList: [],
				selParentList: [],
				selectParentList: [],

				laberList: [],
				selLaberList: [],
				selectLaberList: [],
				grandList: [],
				classList: [],
				finalPersonList2: [],
				page1: 1,
				page2: 1,
				page3: 1,
				pageSize1: 100,
				pageSize2: 100,
				pageSize3: 100,
			}
		},
		mounted() {
			this.getTimeIndexs();
			this.getDepartment();
			this.getBuilds()
			this.getGrade()
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
			change1: function(val){
				let para = {
					gradeId: val
				}
				this.classList = []
				this.filters3.classId = ''
				if(!val){
					return
				}
				getClasses(para).then((res) => {
					this.classList = res.data;
				});
			},
			change2: function(val){
				let para = {
					gradeId: val
				}
				this.classList = []
				this.filters5.classId = ''
				if(!val){
					return
				}
				getClasses(para).then((res) => {
					this.classList = res.data;
				});
			},
			getGrade() {
				let para = {}
				this.listLoading = true;
				getGrade(para).then((res) => {
					this.grandList = res.data;
					
				});
			},
			back: function(){
				window.history.go(-1)
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
			isDisabled(row, index){
				if(row.status==1){
					return 1
				}else{
					return 0
				}
			},
			isDisabled1(row, index){
				if(row.status==1){
					return 1
				}else{
					return 0
				}
			},
			queryPerson1(){
				let devSns = []
				this.selDeviceList&&this.selDeviceList.map(item=>{
					devSns.push(item.devSn)
				})
				let para = {
					kw: this.filters1.kw,
					departmentId: this.filters1.department,
					sex: this.filters1.sex,
					timeSlot: this.nextTimeSlot,
					devSns: devSns.join(","),
					personType: 2,
					page: 1,
					prePage: this.pageSize1
				}
				getPersonsList(para).then((res) => {
					if(res.code==200){
						this.teacherList = res.data.dataList
						this.total1 = res.data.totalCount
						this.prePage1 = 1
					}else{
						this.$message.error(res.msg);
					}
				});
			},

			queryPerson2(){
				let devSns = []
				this.selDeviceList&&this.selDeviceList.map(item=>{
					devSns.push(item.devSn)
				})
				let para = {
					kw: this.filters3.kw,
					gradeId: this.filters3.gradeId,
					classId: this.filters3.classId,
					inResidence: this.filters3.inResidence,
					sex: this.filters3.sex,
					timeSlot: this.nextTimeSlot,
					devSns: devSns.join(","),
					personType: 1,
					page: 1,
					prePage: this.pageSize2
				}
				getPersonsList(para).then((res) => {
					if(res.code==200){
						this.studentList = res.data.dataList
						this.total2 = res.data.totalCount
						this.prePage2 = 1
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			queryPerson3(){
				let devSns = []
				this.selDeviceList&&this.selDeviceList.map(item=>{
					devSns.push(item.devSn)
				})
				let para = {
					kw: this.filters5.kw,
					gradeId: this.filters5.gradeId,
					classId: this.filters5.classId,
					sex: this.filters5.sex,
					timeSlot: this.nextTimeSlot,
					devSns: devSns.join(","),
					personType: 5,
					inResidence: this.filters5.inResidence,
					page: 1,
					prePage: this.pageSize3
				}
				getPersonsList(para).then((res) => {
					if(res.code==200){
						this.parentList = res.data.dataList
						this.total5 = res.data.totalCount
						this.prePage3 = 1
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			currentChange1(val) {
				if(val==this.prePage1) return
				this.prePage1 = val;
				let devSns = []
				this.selDeviceList&&this.selDeviceList.map(item=>{
					devSns.push(item.devSn)
				})
				let para = {
					kw: this.filters1.kw,
					departmentId: this.filters1.department,
					sex: this.filters1.sex,
					timeSlot: this.nextTimeSlot,
					devSns: devSns.join(","),
					personType: 2,
					page: this.prePage1,
					prePage: this.pageSize1
				}
				getPersonsList(para).then((res) => {
					if(res.code==200){
						this.teacherList = res.data.dataList
						this.total1 = res.data.totalCount
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			currentChange2(val) {
				if(val==this.prePage2) return
				let devSns = []
				this.selDeviceList&&this.selDeviceList.map(item=>{
					devSns.push(item.devSn)
				})
				this.prePage2 = val;
				let para = {
					kw: this.filters3.kw,
					inResidence: this.filters3.inResidence,
					gradeId: this.filters3.gradeId,
					classId: this.filters3.classId,
					sex: this.filters3.sex,
					timeSlot: this.nextTimeSlot,
					devSns: devSns.join(","),
					personType: 1,
					page: this.prePage2,
					prePage: this.pageSize2
				}
				getPersonsList(para).then((res) => {
					if(res.code==200){
						this.studentList = res.data.dataList
						this.total2 = res.data.totalCount
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			handleCurrentChange1(current) {
				let index = current;
      			this.selectTeacherList = this.paging(20, current, index, this.selTeacherList);
			},
			handleCurrentChange2(current) {
				let index = current;
      			this.selectStudentList = this.paging(20, current, index, this.selStudentList);
			},
			handleCurrentChange3(current) {
				let index = current;
      			this.selectParentList = this.paging(20, current, index, this.selParentList);
			},
			paging(size, current, index, dataSource) {
				const tableList = JSON.parse(JSON.stringify(dataSource));
				const tablePush = [];
				tableList.forEach((item, index) => {
					if (size * (current - 1) <= index && index <= size * current - 1) {
						tablePush.push(item);
					}
				});
				return tablePush;
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : '女' ;
			},
			formatResidence: function (row, column) {
				return row.inResidence == 1 ? '住读' : '走读' ;
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
			
			formaType: function (row, column) {
				if(row.devType==1){
					return "闸机"
				}else if(row.devType==2){
					return "单立柱"
				}else{
					return "未知"
				}
			},
			handleClick(tab, event) {
				console.log(tab, event);
			},
			getSTime1(val) {
                this.form.startDate=val;
			},
			getSTime2(val) {
                this.form.endDate=val;
			},
			getSTime3(val) {
				if(val){
					this.timeArr1 = val.split("~")
				}else{
					this.timeArr1 = []
				}
			},
			getSTime4(val) {
				if(val){
					this.timeArr2 = val.split("~")
				}else{
					this.timeArr2 = []
				}
			},
			getSTime5(val) {
				if(val){
					this.timeArr3 = val.split("~")
				}else{
					this.timeArr3 = []
				}
            },
			save() {
				console.log('save!');
				this.$refs["form"].validate((valid) => {
					if (valid) {
						this.addTimeSlot();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			selsChange: function (sels) {
				this.selDevice = sels;
			},
			selsChange1: function (sels) {
				this.selDevice = sels;
			},
			selsChange2: function (sels) {
				let arr = [...sels]
				this.selTeacherList = this.unique(arr)
				this.selectTeacherList = this.paging(20, 1, 1, this.selTeacherList);
				this.page1 = 1
			},
			unique(arr){
				let obj = {};
				let finnalArr = arr.reduce((cur,next) => {
					obj[next.personId] ? "" : obj[next.personId] = true && cur.push(next);
					return cur;
				},[])
				return finnalArr
			},
			selsChange3: function (sels) {
				this.selLaberList = sels;
			},
			selsChange4: function (sels) {
				let arr = [...sels]
				this.selStudentList = this.unique(arr)
				this.selectStudentList = this.paging(20, 1, 1, this.selStudentList);
				this.page2 = 1
			},
			selsChange5: function (sels) {
				let arr = [...sels]
				this.selParentList = this.unique(arr)
				this.selectParentList = this.paging(20, 1, 1, this.selParentList);
				this.page3= 1
			},
			comfirmSelDevice: function () {
				this.selDeviceList = this.selDevice;
				this.devVisible = false;
			},
			comfirmSelect: function () {
				this.personVisible1 = false;
				this.personVisible2 = false;
				this.personVisible3 = false;
				this.personVisible4 = false;
			},
			closeDialog: function(){
				this.devVisible = false;
				this.personVisible1 = false;
				this.personVisible2 = false;
				this.personVisible3 = false;
				this.personVisible4 = false;
			},
			onSubmit() {
				console.log('submit!');
			},
			
			getTimeIndexs() {
				let para = {}
				getTimeIndexs(para).then((res) => {
					if(res.code==200){
						this.indexs = res.data.indexs
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			handleSizeChange1(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize1 = val
				this.queryPerson1()
				this.prePage1 = 1
			},
			handleSizeChange2(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize2 = val
				this.queryPerson2()
				this.prePage2 = 1
			},
			handleSizeChange3(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize3 = val
				this.queryPerson3()
				this.prePage3 = 1
			},
			getDev() {
				this.$refs.devForm&&this.$refs.devForm.resetFields();
				this.entryList = []
				let para = {
					kw: this.filters.kw,
					devType: this.filters.devType,
					buildId: this.filters.buildId
				}
				let _this= this
				getAllDevices(para).then((res) => {
					if(res.code==200){
						this.devVisible = true
						this.entryList = res.data
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			queryDev() {
				let para = {
					kw: this.filters.kw,
					devType: this.filters.devType,
					buildId: this.filters.buildId
				}
				getAllDevices(para).then((res) => {
					if(res.code==200){
						this.entryList = res.data
					}else{
						this.$message.error(res.msg);
					}
				});
			},

			managePerson() {
				let personType = ''
				if(this.activeName=="first"){
					personType = 2
				}else if(this.activeName=="second"){
					personType = 1
				}else{
					personType = 5
				}
				let devSns = []
				this.selDeviceList&&this.selDeviceList.map(item=>{
					devSns.push(item.devSn)
				})
				let para = {
					timeSlot: this.nextTimeSlot,
					devSns: devSns.join(","),
					personType: personType,
					page: 1,
					prePage: 100
				}
				this.prePage1 = 1
				this.prePage2 = 1
				this.pageSize1 = 100
				this.pageSize2 = 100
				this.$refs['manageForm1']&&this.$refs['manageForm1'].resetFields();
				this.$refs['manageForm2']&&this.$refs['manageForm2'].resetFields();
				this.$refs['manageForm3']&&this.$refs['manageForm3'].resetFields();
				getPersonsList(para).then((res) => {
					if(res.code==200){
						if(personType==1){
							this.studentList = res.data.dataList
							this.personVisible3 = true
							this.total2 = res.data.totalCount
						}else if(personType==2){
							this.teacherList = res.data.dataList
							this.personVisible1 = true
							this.total1 = res.data.totalCount
						}else if(personType==5){
							this.parentList = res.data.dataList
							this.personVisible4 = true
							this.total5 = res.data.totalCount
						}
						
						

					}else{
						this.$message.error(res.msg);
					}
				});
			},
			getTimeSlot() {
				let para = {
					page: 1,
					size: 1000
				}
				let _this = this
				getTimeSlot(para).then((res) => {
					if(res.code==200){
						this.previewVisible = true
						this.entryTime = res.data.dataList
						_this.$refs.timeForm.resetFields();
					
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			getDepartment(){
				let para = {}
				getDepartment(para).then((res) => {
					if(res.code==200){
						this.departmentList = res.data
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			queryTimes() {
				let para = {
					kw: this.filters4.kw,
					week: this.filters4.queryWeek
				}
				getTimeSlot(para).then((res) => {
					if(res.code==200){
						this.previewVisible = true
						this.entryTime = res.data.dataList
					}else{
						this.$message.error(res.msg);
					}
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
			getRelateTimeSlot(index, row) {
				this.previewVisible = false
				this.nextTimeSlot = row.index
				console.log(index)
				let para = {
					index: row.index
				}
				getRelateTimeSlot(para).then((res) => {
					if(res.code==200){
						this.relateTime = res.data
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			addTimeSlot() {
				if(this.form.startDate>this.form.endDate){
					this.$message.error("时段有效期限开始时间不能大于结束时间！");
					return
				}
				let timeSectionsArr = [this.timeArr1, this.timeArr2, this.timeArr3]
				let arr = timeSectionsArr.filter(item=>{
					return item.length!=0
				})
				let para = {
					index: this.form.index,
					name: this.form.name,
					startDate: this.form.startDate,
					endDate: this.form.endDate,
					week: this.form.week,
					timeSections: JSON.stringify(arr),
					nextTimeSlot: this.nextTimeSlot
				}
				addTimeSlot(para).then((res) => {
					if(res.code==200){
						this.$message.success("保存成功");
						setTimeout(() => {
							window.history.go(-1)
						}, 1000);
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			addEntryRule(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						if(!this.form.name){
							this.$message.error("请输入策略名称");
							return
						}
						let devSns = []
						this.selDeviceList&&this.selDeviceList.map(item=>{
							devSns.push(item.devSn)
						})
						if(devSns.length<1){
							this.$message.error("请选择终端");
							return
						}
						let personType = ''
						let personIds = []
						if(this.activeName=="first"){
							personType = 2
							this.selTeacherList.map(item=>{
								personIds.push(item.personId)
							})
						}else if(this.activeName=="second"){
							personType = 1
							this.selStudentList.map(item=>{
								personIds.push(item.personId)
							})
						}else if(this.activeName=="third"){
							personType = 5
							this.selParentList.map(item=>{
								personIds.push(item.personId)
							})
						}
						if(personIds.length<1){
							this.$message.error("请选择人员");
							return
						}
						let para = {
							ruleName: this.form.name,
							personType: personType,
							devSns: devSns,
							personIds: personIds,
							timeSlotIndex: this.nextTimeSlot,
						}
						addEntryRule(para).then((res) => {
							if(res.code==200){
								this.$message.success("保存成功");
								window.history.go(-1);
							}else{
								this.$message.error(res.msg);
							}
						});
					}
				})
	
			}
		},
	
	}

</script>
<style>
	.tips-box{
		background: #e7f7ff;
		padding: 0 20px;
		padding-bottom: 10px;
		border: 1px solid #ade0fe;
		border-radius: 5px;
	}
	.tips-box p{
		margin: 0;
		color: #8f9497;
	}
	.tips-box p>span{
		color: #f84346;
	}
	.addEntry-el .el-date-editor{
		margin-bottom: 10px;
	}
	.table-box thead{
		background: #fafafa;
		font-weight: 700;
	}
	.table-box tr td{
		padding: 5px 10px;
	}
	.table-box>div{
		text-align: center;
		margin: 10px 0;
	}
	.table-box>div>img{
		width: 30px;
		height: 30px;
		vertical-align: middle;
		transform: rotate(-45deg);
	}
	.red{
		color: red;
	}
	.dialog-btn{
		padding-top: 20px;
		text-align: right;
	}
	.span-label{
		position: absolute;
		color: #ff4949;
		margin-left: -76px;
	}
</style>
