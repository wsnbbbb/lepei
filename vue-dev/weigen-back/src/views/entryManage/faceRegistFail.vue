<template>
	<section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" class="regist-fail-form" >
          <el-form-item>
            <el-input v-model="kw" style="width: 230px" placeholder="请输入姓名"></el-input>
          </el-form-item>
           人员类型：
          <el-select v-model="personType" style="width:120px;" placeholder="请选择" class="form-item">
            <el-option label="全部" value=""></el-option>
            <el-option label="学生" value="1"></el-option>
            <el-option label="教师" value="2"></el-option>
            <el-option label="职工" value="3"></el-option>
          </el-select>
           读书形式：
          <el-select v-model="inResidence" style="width:120px;" placeholder="请选择" class="form-item">
            <el-option label="全部" value=""></el-option>
            <el-option label="住读" value="1"></el-option>
            <el-option label="走读" value="2"></el-option>
          </el-select>
          年级：
          <el-select v-model="gradeId" placeholder="请选择" @change="changeGrade" class="form-item">
            <el-option
              v-for="item in gradeList"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId">
            </el-option>
          </el-select>
          班级：
          <el-select v-model="classId" placeholder="请选择" class="form-item">
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId">
            </el-option>
          </el-select>
         
          <el-form-item>
            <el-button type="primary" size="medium"  @click="search">查询</el-button>
            <a :href="exportUrl" @click="dataExport" class="data-export">导出</a>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="registFailList" highlight-current-row style="width: 100%;">
        <el-table-column prop="personName" label="姓名" min-width="120" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="personSex" label="性别" min-width="80" :show-overflow-tooltip="true" :formatter="formaSex">
        </el-table-column>
        <el-table-column prop="personType" label="类型" min-width="100" :show-overflow-tooltip="true" :formatter="formatPersonType">
        </el-table-column>
        <el-table-column prop="gradeName" label="年级" min-width="150" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="className" label="班级" min-width="150" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="inResidence" label="读书形式" min-width="100" :show-overflow-tooltip="true" :formatter="formaResidence">
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" min-width="200" :show-overflow-tooltip="true" :formatter="formatTime">
        </el-table-column>
        <el-table-column prop="registerResult" label="注册状态" min-width="120" :show-overflow-tooltip="true" :formatter="formatStatus">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="retry(scope.$index,scope.row)">重试</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
        </el-pagination>
      </el-col>

	</section>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { searchRejistFail,getGrade,getClasses,retryFaceRegist} from '../../api/api';

	export default {
		data() {
			return {
				kw: '',
				personType:'',
				gradeId: '',
				classId: '',
				inResidence: '',
				total: 0,
				page: 1,
				listLoading: false,
				gradeList: [],
				classList: [],
				registFailList: [],
				exportUrl:'',
			
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

			formaSex: function (row, column) {
				if(row.personSex == 1){
					return "男"
				}else if(row.personSex == 2){
					return "女"
				}else{
					return "未知"
				}
			},
			formaResidence: function (row, column) {
				if(row.inResidence == 1){
					return "住读"
				}else if(row.inResidence == 2){
					return "走读"
				}else{
					return "未知"
				}
			},
		
			formatStatus: function (row) {
				// 注册状态(1：成功，2：失败)
				if(row.registerResult == 1){
					return "成功"
				}else if(row.registerResult == 2){
					return "失败"
				}else{
					return "-"
				}
			},
				// 1：学生 2：教师 3：员工 
			formatPersonType: function (row) {
				if(row.personType==1){
					return "学生"
				}else if(row.personType == 2){
					return "教师"
				}else if(row.personType == 3){
					return "员工"
				}else{
					return "未知"
				}
			},
			formatTime: function (row, column) {
				return util.formatDate.format(new Date(row.registerTime*1000), 'yyyy-MM-dd hh:mm:ss');
			},

			// 年级选择
			changeGrade: function(val){
				let para = {
					gradeId: val
				}
				getClasses(para).then((res) => {
					this.classList = res.data;

				});
			},
			
			// 获取年级列表
			getGrade() {
				let para = {}
				this.listLoading = true;
				getGrade(para).then((res) => {
					this.gradeList = res.data;
				});
			},

			//获取列表
			getList() {
				let para = {
					page: this.page,
					prePage: 20
				};
				this.listLoading = true;
				searchRejistFail(para).then((res) => {
				if(res.code == 200){
						this.registFailList = res.data.dataList
						this.total = res.data.totalCount
						this.page = 1
						this.listLoading = false;
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			// 查询
			search(){
				let params = {
					kw: this.kw,
					gradeId: this.gradeId,
					classId: this.classId,
					personType: this.personType,
					inResidence: this.inResidence,
					page: 1,
					prePage: 20
				}
				searchRejistFail(params).then((res) => {
					if(res.code == 200){
						this.registFailList = res.data.dataList
						this.total = res.data.totalCount
						this.page = 1
						this.listLoading = false;
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			// 分页
			handleCurrentChange(val) {
				if(val == this.page) return
				this.page = val;
				let params = {
					kw: this.kw,
					gradeId: this.gradeId,
					classId: this.classId,
					personType: this.personType,
					inResidence: this.inResidence,
					page: this.page,
					pageSize: 20
				}
				searchRejistFail(params).then((res) => {
					if(res.code == 200){
						this.registFailList = res.data.dataList
						this.total = res.data.totalCount
					}else{
						this.$message.error(res.msg);
					}
				});
			},

			// 导出
			dataExport() {
				let token=sessionStorage.getItem("token");
				let userId=sessionStorage.getItem("userId");
				let kw = this.kw || '';
				let personType = this.personType || '';
				let inResidence = this.inResidence || '';
				let gradeId = this.gradeId || '';
				let classId = this.classId || '';
				let url = util.portUrl("/wg-entry/kelu-face/register-fail-export?userId="+userId+"&accessToken="+token+"&kw="+kw+"&personType="+personType+
				"&inResidence="+inResidence+"&gradeId="+gradeId+"&classId="+classId)
				this.exportUrl = url
			},

			// 重试
			retry (index,row) {
				let params = {
					personId:row.personId
				}
				retryFaceRegist(params).then(res =>{
					if(res.code == 200){
						this.$message.success("注册成功")
						this.search()
					}else{
						this.$message.error(res.msg);
					}
				})
				
			}
		
		},
		mounted() {
			this.getGrade()
			this.getList();
		}
	}

</script>

<style>
.regist-fail-form .form-item{
	margin-right: 15px;
}
.data-export{
	text-decoration: none;
	color:#fff;
	display: inline-block;
	width: 60px;
	height: 36px;
	background-color: #20a0ff;
	border-radius: 5px;
	line-height: 36px;
	text-align: center;
}

</style>