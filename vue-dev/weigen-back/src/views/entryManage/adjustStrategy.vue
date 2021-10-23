<template>
	<section>
		<el-tabs v-model="activeName"  @tab-click="clickTab">
			<el-tab-pane label="学生" name="first">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters1"  ref="timeForm1">
						<el-form-item>
							<el-input v-model="filters1.kw" style="width: 280px;marginRight:20px" placeholder="请输入姓名"></el-input>
						</el-form-item>
						年级：
						<el-select style="marginRight:20px" v-model="filters1.gradeId" placeholder="请选择" @change="changeGrade">
							<el-option label="全部" value=""></el-option>
							<el-option
								v-for="item in grandList"
								:key="item.gradeId"
								:label="item.gradeName"
								:value="item.gradeId">
							</el-option>
						</el-select>
						班级：
						<el-select style="marginRight:20px" v-model="filters1.classId" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option
								v-for="item in classList"
								:key="item.classId"
								:label="item.className"
								:value="item.classId">
							</el-option>
						</el-select>
						读书形式：
						<el-select v-model="filters1.inResidence" style="width:150px;" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="住读" value="1"></el-option>
							<el-option label="走读" value="2"></el-option>
						</el-select>
						<el-form-item>
							<el-button size="medium" style="marginLeft:20px" type="primary" @click="queryStudent">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!--列表-->
				<el-table :data="studentRecord" highlight-current-row style="width: 100%;">
					<el-table-column prop="personName" label="姓名" width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="sex" label="性别" width="80" :show-overflow-tooltip="true" :formatter="formaSex">
					</el-table-column>
					<el-table-column prop="gradeName" label="年级" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="className" label="班级" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="inResidence" label="读书形式" width="100" :show-overflow-tooltip="true" :formatter="formaResidence">
					</el-table-column>
					<el-table-column prop="ruleId" label="策略编号" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="ruleName" label="策略名称" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="操作" width="150">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="amendStrategy(scope.$index, scope.row)">修改策略</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" :current-page="page1" @current-change="handleCurrentChange1" :page-size="20" :total="total1" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>
			<el-tab-pane label="教职工" name="second">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters2">
						<el-form-item>
							<el-input v-model="filters2.kw" style="width: 280px" placeholder="请输入姓名"></el-input>
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
						<el-form-item>
							<el-button type="primary" size="medium"  @click="queryTeacher">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!--列表-->
				<el-table :data="teacherRecord" highlight-current-row style="width: 100%;">
					<el-table-column prop="personName" label="姓名" min-width="120" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="sex" label="性别" min-width="80" :show-overflow-tooltip="true" :formatter="formaSex">
					</el-table-column>
					<el-table-column prop="departmentName" label="部门" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="ruleId" label="策略编号" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="ruleName" label="策略名称" min-width="200" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="操作" width="150">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="amendStrategy(scope.$index, scope.row)">修改策略</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" :current-page="page2" @current-change="handleCurrentChange2" :page-size="20" :total="total2" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>
		</el-tabs>
		<el-dialog title="修改人员策略" ref="timeForm" width="80%" class="preview-dialog" :visible.sync="previewVisible" :close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" >
					<el-form-item  prop="kw">
						<el-input v-model="ruleName" style="width: 280px" placeholder="请输入策略名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium"  @click="queryStrategy">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="strategyList" highlight-current-row style="width: 100%;">
				<el-table-column prop="ruleId" label="编号" width="120">
				</el-table-column>
				
				<el-table-column prop="ruleName" label="策略名称" min-width="120" >
				</el-table-column>

				<el-table-column prop="personType" label="群体" width="200" :formatter="formaPersonType">
				</el-table-column>

				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<el-button type="primary" size="small" @click="chooseRule(scope.$index, scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>

		
		</el-dialog>
	</section>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex';
	import util from '../../common/js/util'
	import { base } from '../../config'
	import { getStrategyPersons, getDepartment, getGrade, getClasses, getChoosablePerson, chooseRule } from '../../api/api';

	export default {
		data() {
			return {
				grandList: [], // 年级选择下拉框数据
				classList: [], // 班级选择下拉框数据
				studentRecord: [], // 学生人员列表
				teacherRecord: [], // 教师人员列表
				filters1:{ // 学生列表搜索条件
					kw: '',
					gradeId: '',
					classId: '',
					inResidence: '',
				},
				filters2:{ // 教师列表搜素条件
					kw: '',
					departmentId: '',
				},
				activeName: 'first', // tab选项
				total1: 0,
				page1: 1,
				total2: 0,
				page2: 1,
				departmentList: [], // 部门列表
				listLoading: false,
				previewVisible: false,//修改人员策略界面是否显示
				ruleName:'',
				strategyList:[], // 修改人员策略列表
				personId:'',
				ruleId:'',
			}
		},
		computed:{

		},
		methods: {
			// tab选项切换
			clickTab: function (tab,event) {
				this.activeName = tab.name;
				console.log(tab.name);
				if(tab.name == 'second' && this.teacherRecord.length == 0){
					this.queryTeacher()
					this.getDepartment()
				}
			},
			formaSex: function (row, column) {
				if(row.sex == 1){
					return "男"
				}else if(row.sex == 2){
					return "女"
				}else{
					return ""
				}
			},
			formaResidence: function (row, column) {
				if(row.inResidence == 1){
					return "住读"
				}else if(row.inResidence == 2){
					return "走读"
				}else{
					return ""
				}
			},
			formaPersonType: function (row, column) {
				if(row.personType == 1){
					return "学生"
				}else if(row.personType == 2){
					return "教职工"
				}else{
					return ""
				}
			},
			// 获取所有年级
			getGrade() {
				let para = {}
				this.listLoading = true;
				getGrade(para).then((res) => {
					this.grandList = res.data;
				});
			},
		
			// 年级选择
			changeGrade: function(val){
				let para = {
					gradeId: val
				}
				this.filters1.classId = ''
				if(val){
					getClasses(para).then((res) => {
						if(res.code == 200){
							this.classList = res.data;
						}else{
							this.$message.error(res.msg);
						}
					});
				}
			},
		
			// 学生列表-查询
			queryStudent() {
				let para = {
					personType:1,
					kw: this.filters1.kw,
					gradeId: this.filters1.gradeId,
					classId: this.filters1.classId,
					inResidence: this.filters1.inResidence,
					page: 1,
					pageSize: 20
				}
				getStrategyPersons(para).then((res) => {
					if(res.code == 200) {
						this.studentRecord = res.data.dataList
						this.total1 = res.data.totalCount
						this.page1 = 1
					}else{
						this.$message.error(res.msg);
					}
				});
			},

			// 学生列表分页
			handleCurrentChange1(val) {
				if(val == this.page1) return
				this.page1 = val;
				let para = {
					personType:1,
					kw: this.filters1.kw,
					gradeId: this.filters1.gradeId,
					classId: this.filters1.classId,
					inResidence: this.filters1.inResidence,
					page: this.page1,
					pageSize: 20
				}
				getStrategyPersons(para).then((res) => {
					if(res.code == 200){
						this.studentRecord = res.data.dataList
						this.total1 = res.data.totalCount
					}else{
						this.$message.error(res.msg);
					}
				});
			},

			// 获取部门
			getDepartment(){
				let para = {}
				getDepartment(para).then((res) => {
					if(res.code == 200){
						this.departmentList = res.data
					}else{
						this.$message.error(res.msg);
					}
				});
			},

			// 教师列表查询
			queryTeacher(){
				let para = {
					personType:2,
					kw: this.filters2.kw,
					departmentId: this.filters2.departmentId,
					page: 1,
					pageSize: 20
				}
				getStrategyPersons(para).then((res) => {
					if(res.code == 200){
						this.teacherRecord = res.data.dataList
						this.total2 = res.data.totalCount
						this.page2 = 1
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			
			// 教师列表分页
			handleCurrentChange2(val) {
				if(val == this.page2) return
				this.page2 = val;
				let para = {
					personType:2,
					kw: this.filters2.kw,
					departmentId: this.filters2.departmentId,
					page: this.page2,
					pageSize: 20
				}
				getStrategyPersons(para).then((res) => {
					if(res.code == 200){
						this.teacherRecord = res.data.dataList
						this.total2 = res.data.totalCount
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			
			// 获取可选人员策略列表
			getChoosablePerson: function(params) {
				getChoosablePerson(params).then((res) => {
					if(res.code == 200) {
						this.previewVisible = true;
						this.strategyList = res.data.dataList;
						this.listLoading = false;
					}else{
						this.$message.error(res.msg);
					}
				})
			},

			// 修改人员策略
			amendStrategy: function(index,row) {
				this.personId = row.personId;
				this.ruleId = row.ruleId;
				let params = {
					personId: row.personId,
					ruleId: row.ruleId,
				}
				this.listLoading = true;
				console.log({params});
				this.getChoosablePerson(params)
				this.ruleName = ''
			},

			// 查询可选策略
			queryStrategy: function() {
				let params = {
					kw: this.ruleName,
					personId: this.personId,
					ruleId: this.ruleId,
				}
				this.listLoading = true;
				this.getChoosablePerson(params)
			},
			// 选择策略
			chooseRule: function(index,row) {
				let params = {
					personId: this.personId,
					oldRuleId: this.ruleId,
					newRuleId: row.ruleId
				}
				this.listLoading = true;
				chooseRule(params).then((res) => {
					if(res.code == 200) {
						this.$message({
							message: res.msg,
							type: 'success'
						});
						this.previewVisible = false;
						this.listLoading = false;
						if(this.activeName == 'first'){
							this.queryStudent()
						}else{
							this.queryTeacher()
						}
					}else{
						this.$message.error(res.msg);
					}
				})

			},
		
		},
		mounted() {
			this.getGrade()
			this.queryStudent();
		}
	}

</script>

<style >
	.preview-dialog .el-dialog{
		width: 70%!important;
	}
	.preview-table thead{
		background-color: #fafafa;
	}
	.preview-table tr td{
		padding: 5px 10px;
	}
	

</style>