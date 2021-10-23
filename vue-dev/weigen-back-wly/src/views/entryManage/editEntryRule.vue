<template>
	<el-form :model="form" :rules="rules" ref="form"  label-width="120px" style="margin:20px;width:90%;min-width:600px;">
		<el-form-item label="策略名称" prop="name">
			<el-input v-model="form.name" style="width:300px" placeholder="请输入"></el-input>
		</el-form-item>
		<el-form-item label="策略终端">
			<el-button type="primary" v-on:click="getDev" :disabled="selectTeacherList.length>0">添加终端</el-button>
		</el-form-item>
		<el-form-item>
			<el-table :data="selDeviceList" highlight-current-row style="width: 100%;">
				<el-table-column prop="devName" label="终端名称" min-width="120" >
				</el-table-column>
				<el-table-column prop="devType" label="终端类型" min-width="120" :formatter="formaType">
				</el-table-column>
				<el-table-column prop="devSn" label="终端MAC" min-width="120">
				</el-table-column>
			</el-table>
		</el-form-item>
		<el-form-item label="选择时段">
			<el-button type="primary" v-on:click="getTimeSlot" :disabled="selectTeacherList.length>0">选择时段</el-button>
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
			<el-button type="primary" v-on:click="managePerson" :disabled="selDeviceList.length<=0||nextTimeSlot==0">管理策略人员</el-button>
			<el-table :data="selectTeacherList" highlight-current-row @selection-change="selsChange1" style="width: 100%;">
				<el-table-column prop="personName" label="姓名" min-width="120" >
				</el-table-column>
				<el-table-column prop="depart" label="所属组织" min-width="120">
				</el-table-column>
				<el-table-column prop="telephone" label="电话" min-width="120">
				</el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total, prev, pager, next" :current-page.sync="currentPage" @current-change="handleCurrentChange1" :page-size="20" :total="selTeacherList.length" style="float:right;">
				</el-pagination>
			</el-col>
		</el-form-item>
		
		<el-form-item>
			<el-button type="primary" v-on:click="addEntryRule">保存</el-button>
			<el-button @click.native.prevent v-on:click="back">取消</el-button>
		</el-form-item>
	
		<el-dialog title="选择时段" width="80%" class="preview-dialog" v-model="previewVisible" :close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="kw" style="width: 280px" placeholder="请输入策略名称"></el-input>
					</el-form-item>
					有效星期：
					<el-select v-model="queryWeek" placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option
							v-for="item in weeks"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
					<el-form-item>
						<el-button type="primary" v-on:click="queryTimes">查询</el-button>
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
					<template scope="scope">
						<el-button type="text" @click="getRelateTimeSlot(scope.$index, scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
		
		</el-dialog>

		<el-dialog title="添加终端" width="80%" class="preview-dialog" v-model="devVisible" :close-on-click-modal="false">
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
					<el-form-item>
						<el-button type="primary" v-on:click="queryDev">查询</el-button>
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
			</el-table>
			<div class="dialog-btn">
				<el-button v-on:click="closeDialog">取消</el-button>
				<el-button type="primary" v-on:click="comfirmSelDevice">确定</el-button>
			</div>
		
		</el-dialog>

		<el-dialog title="管理策略人员" width="80%" class="preview-dialog" v-model="personVisible" :close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters1" ref="manageForm1">
					<el-form-item prop="kw">
						<el-input v-model="filters1.kw" style="width: 200px" placeholder="请输入姓名/所属组织"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="queryPerson1">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="teacherList" ref="multipleTable1" highlight-current-row row-key="personId" @selection-change="selsChange2" style="width: 100%;">
				<el-table-column type="selection" :selectable="isDisabled" :reserve-selection="true" disabled="true" width="55">
				</el-table-column>
				<el-table-column prop="personName" label="姓名" min-width="120" >
				</el-table-column>
				<el-table-column prop="depart" label="所属组织" min-width="120">
				</el-table-column>
				<el-table-column prop="telephone" label="电话" min-width="120">
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination  :page-sizes="[100, 200, 300, 400]" @size-change="handleSizeChange1" layout="sizes, total, prev, pager, next" :current-page="page1" @current-change="currentChange1" :page-size="pageSize" :total="total1" style="float:right;">
				</el-pagination>
			</el-col>
			<div class="dialog-btn">
				<!-- <el-button v-on:click="closeDialog">取消</el-button> -->
				<el-button type="primary" v-on:click="comfirmSelect">确定</el-button>
			</div>
		</el-dialog>
</el-form>

</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex';
	import { getTimeIndexs , getDepartment, updateRule, getClasses, getAllDevices, entryRuleDetail, entryTimeSlot, addEntryRule, getPersonsList, getTimeSlot, getEntryMacList, addTimeSlot, getRelateTimeSlot} from '../../api/api';
	export default {
		data() {
			return {
				form: {
					index: '',
					dateTime: '',
					name: '',
					startDate: '',
					endDate: '',
					week: [],
				},
				rules: {
					name: [
						{ required: true, message: '请输入策略名称', trigger: 'blur' },
						{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
					],
				},
				filters: {
					kw: '',
					devType: ''
				},
				filters1: {
					kw: '',
					sex: '',
					department: '',
				},
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
				page: 1,
				page1: 1,
				teacherList: [],
				selTeacherList: [],
				selectTeacherList: [],
				finalPersonList: [],
				currentPage: 1,
				pageSize: 100,
			}
		},
		mounted() {
			this.getTimeIndexs();


			this.entryRuleDetail();

			let _this = this
			
		},
		computed:{
	
		},
		methods: {        
			operation(list1, list2, operationIsUnion) {
				var result = [];
				for (var i = 0; i < list1.length; i++) {
					var item1 = list1[i],
						found = false;
					for (var j = 0; j < list2.length; j++) {
						if (item1.personId === list2[j].personId) {
							found = true;
							break;
						}
					}
					if (found === operationIsUnion) {
						result.push(item1);
					}
				}
				return result;
			},
			inFirstOnly(list1, list2) {
				return this.operation(list1, list2, false);
			},
			handleSizeChange1(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val
				this.queryPerson1()
				this.page1 = 1
			},
	
			toggleSelection1 (rows) {
				this.$nextTick(function () {
					if (rows) {
						rows.forEach(row => {
							this.$refs.multipleTable1.toggleRowSelection(row, true)
						})
					} else {
							this.$refs.multipleTable1.clearSelection()
					}
				})
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
	
			queryPerson1(){
				let _this = this
				let devSns = []
				this.selDeviceList&&this.selDeviceList.map(item=>{
					devSns.push(item.devSn)
				})
				let para = {
					ruleId: this.$route.params.id,
					kw: this.filters1.kw,

					timeSlot: this.nextTimeSlot,
					devSns: devSns.join(","),
					page: 1,
					pageSize: this.pageSize
				}
				getPersonsList(para).then((res) => {
					if(res.code==200){
						this.teacherList = res.data.dataList
						this.total1 = res.data.totalCount
						this.page1 = 1
						this.finalPersonList = _this.inFirstOnly(_this.selTeacherList, res.data.dataList)
						let arr = []
						this.teacherList.forEach(item=>{
							_this.selTeacherList.forEach(val=>{
								if(item.personId==val.personId){
									arr.push(item)
								}
							})
						})
						console.log(arr.length)
						this.toggleSelection1(arr)
					}else{
						this.$message.error(res.msg);
					}
				});
			},

			currentChange1(val) {
				if(val==this.page1) return
				let _this = this
				this.page1 = val;
				let devSns = []
				this.selDeviceList&&this.selDeviceList.map(item=>{
					devSns.push(item.devSn)
				})
				let para = {
					ruleId: this.$route.params.id,
					kw: this.filters1.kw,
					timeSlot: this.nextTimeSlot,
					devSns: devSns.join(","),
					page: this.page1,
					pageSize: this.pageSize
				}
				getPersonsList(para).then((res) => {
					if(res.code==200){
						this.teacherList = res.data.dataList
						this.finalPersonList = _this.inFirstOnly(_this.selTeacherList, res.data.dataList)
						this.total1 = res.data.totalCount
						console.log("111")
						let arr = []
						this.teacherList.forEach(item=>{
							_this.selTeacherList.forEach(val=>{
								if(item.personId==val.personId){
									arr.push(item)
								}
							})
						})
						console.log(arr.length)

						this.toggleSelection1(arr)
					}else{
						this.$message.error(res.msg);
					}
				});
			},

		
			handleCurrentChange1(current) {
				let index = current;
      			this.selectTeacherList = this.paging(20, current, index, this.selTeacherList);
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

			
			formaType: function (row, column) {
				if(row.devType==1){
					return "闸机"
				}else if(row.devType==2){
					return "单立柱"
				}else{
					return "未知"
				}
			},
	

			selsChange: function (sels) {
				this.selDevice = sels;
			},
			selsChange1: function (sels) {
				this.selDevice = sels;
			},
			selsChange2: function (sels) {
				let arr = [...sels, ...this.finalPersonList]
				this.selTeacherList = this.unique(arr)
				this.selectTeacherList = this.paging(20, 1, 1, this.selTeacherList);
			},
			unique(arr){
				// var x = new Set(arr);
				// return [...x];
				let obj = {};
				let finnalArr = arr.reduce((cur,next) => {
					obj[next.personId] ? "" : obj[next.personId] = true && cur.push(next);
					return cur;
				},[])
				return finnalArr
			},

			comfirmSelDevice: function () {
				this.selDeviceList = this.selDevice;
				this.devVisible = false;
			},
			comfirmSelect: function () {
				this.personVisible = false;
			},
			closeDialog: function(){
				this.devVisible = false;
				this.personVisible = false;
			},

			getTimeIndexs() {
				let para = {}
				// this.listLoading = true;
				getTimeIndexs(para).then((res) => {
					// this.listLoading = false;
					if(res.code==200){
						this.indexs = res.data.indexs
					}else{
						this.$message.error(res.msg);
					}
				});
			},

			getDev() {
				let para = {
					kw: this.filters.kw,
					devType: this.filters.devType,

				}
				getAllDevices(para).then((res) => {
					if(res.code==200){
						this.devVisible = true
						this.entryList = res.data
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			entryRuleDetail() {
				let para = {
					id: this.$route.params.id,
				}
				entryRuleDetail(para).then((res) => {
					if(res.code==200){
						this.form.name = res.data.ruleName
						this.relateTime = res.data.timeSlots
						this.getRelateTimeSlotByIndex(res.data.timeSlotIndex)
						this.nextTimeSlot = res.data.timeSlotIndex
						this.selDeviceList = res.data.devices
						this.selTeacherList = res.data.persons
						this.selectTeacherList = this.paging(20, 1, 1, this.selTeacherList);
			

					}else{
						this.$message.error(res.msg);
					}
				});
			},
			queryDev() {
				let para = {
					kw: this.filters.kw,
					devType: this.filters.devType,
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
				let devSns = []
				this.selDeviceList&&this.selDeviceList.map(item=>{
					devSns.push(item.devSn)
				})
				this.page1 = 1
				this.pageSize = 100
				let para = {
					ruleId: this.$route.params.id,
					timeSlot: this.nextTimeSlot,
					devSns: devSns.join(","),
					page: 1,
					pageSize: 100
				}
				this.$refs['manageForm1']&&this.$refs['manageForm1'].resetFields();
				this.$refs['manageForm2']&&this.$refs['manageForm2'].resetFields();
				getPersonsList(para).then((res) => {
					let _this = this
					if(res.code==200){
						let arr = []
					
							this.teacherList = res.data.dataList
							this.currentPage = 1
							_this.finalPersonList = _this.inFirstOnly(_this.selTeacherList, res.data.dataList)
							this.teacherList.forEach(item=>{
								this.selTeacherList.forEach(val=>{
									if(item.personId==val.personId){
										arr.push(item)
									}
								})
							})
							this.toggleSelection1(arr)
							this.personVisible = true
							this.total1 = res.data.totalCount
						}

						
						// this.total1 = res.data.totalCount
					
				});
			},
			getTimeSlot() {
				let para = {}
				getTimeSlot(para).then((res) => {
					if(res.code==200){
						this.previewVisible = true
						this.entryTime = res.data.dataList
					}else{
						this.$message.error(res.msg);
					}
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
			queryTimes() {
				let para = {
					kw: this.kw,
					week: this.queryWeek
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
						// this.previewVisible = true
						// this.entryTime = res.data.dataList
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			getRelateTimeSlotByIndex(index) {
				let para = {
					index: index
				}
				getRelateTimeSlot(para).then((res) => {
					if(res.code==200){
						this.relateTime = res.data
						// this.previewVisible = true
						// this.entryTime = res.data.dataList
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
			
				// this.listLoading = true;
				addTimeSlot(para).then((res) => {
					// this.listLoading = false;
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
				if(!this.form.name){
					this.$message.error("请输入名称");
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

				let personIds = []
				this.selTeacherList.map(item=>{
					personIds.push(item.personId)
				})
				
				if(personIds.length<1){
					this.$message.error("请选择人员");
					return
				}
				let para = {
					id: this.$route.params.id,
					ruleName: this.form.name,
					devSns: devSns,
					personIds: personIds,
					timeSlotIndex: this.nextTimeSlot,
				}
				updateRule(para).then((res) => {
					if(res.code==200){
						this.$message.success("保存成功");
						window.history.go(-1)
					}else{
						this.$message.error(res.msg);
					}
				});
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
</style>
