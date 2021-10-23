<template>
	<el-form :model="form" :rules="rules" ref="form"  label-width="120px" style="margin:20px;width:60%;min-width:600px;">

  		<el-form-item label="序号" prop="index">
			<el-select v-model="form.index" :disabled="true" placeholder="请选择" filterable>
				<el-option
					v-for="item in indexs"
					:key="item"
					:label="item"
					:value="item">
				</el-option>
			</el-select>
			（可用序号当前剩余：{{indexs.length}} 个）
		</el-form-item>
		<el-form-item label="时段名称" prop="name">
			<el-input v-model="form.name" placeholder="请输入"></el-input>
		</el-form-item>
		<el-form-item label="时段有效期限" required>
				<el-col :span="11">
				<el-form-item prop="startDate">
					<el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="开始日期" @change="getSTime1" v-model="form.startDate" style="width: 100%;"></el-date-picker>
				</el-form-item>
				</el-col>
				<el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;~</el-col>
				<el-col :span="11">
				<el-form-item prop="endDate">
					<el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="结束日期" @change="getSTime2" v-model="form.endDate" style="width: 100%;"></el-date-picker>
				</el-form-item>
				</el-col>
		</el-form-item>
		 <el-form-item label="时段有效星期" prop="week">
			<el-checkbox-group v-model="form.week">
				<el-checkbox v-for="item in weeks" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="策略有效时区" class="addEntry-el" >
			 <span class="span-label-1">*</span>
			  <el-time-picker
				is-range
				v-model="time1"
				value-format="HH:mm"
				format="HH:mm"
				range-separator="~"
				start-placeholder="开始时间"
				end-placeholder="结束时间"
				placeholder="选择时间范围">
			</el-time-picker>
			<br/>
			<el-time-picker
				is-range
				v-model="time2"
				value-format="HH:mm"
				format="HH:mm"
				range-separator="~"
				start-placeholder="开始时间"
				end-placeholder="结束时间"
				placeholder="选择时间范围">
			</el-time-picker>
			<br/>
			<el-time-picker
				is-range
				v-model="time3"
				value-format="HH:mm"
				format="HH:mm"
				range-separator="~"
				start-placeholder="开始时间"
				end-placeholder="结束时间"
				placeholder="选择时间范围">
			</el-time-picker>
		</el-form-item>
		<el-form-item label="关联时段">
			<el-button type="primary" size="medium"  :disabled="!this.form.index" v-on:click="getTimeSlot">选择</el-button>
			<el-button size="medium" v-on:click="clearTimeSlot">清空</el-button>
		</el-form-item>
		<el-form-item>
			<div class="tips-box">提示
				<p>1、一个时段仅能关联一个时段，多个时段可通过顺序关联的形式，生成时段组。</p>
				<p>2、时段组执行规则为顺序遍历执行，有结果后，<span>不再执行</span>后续时段。</p>
				<p>3、时段组中遇到过期和未开始的时段，则<span>继续执行</span>后续仍然有效的时段。</p>
			</div>
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
		
	
		<el-form-item>
			<el-button type="primary" size="medium"  v-on:click="save">保存</el-button>
			<el-button size="medium" @click.native.prevent v-on:click="back">取消</el-button>
		</el-form-item>
	
		<el-dialog title="选择时段" width="80%" class="preview-dialog" :visible.sync="previewVisible" :close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="kw" style="width: 280px" placeholder="请输入时段名称"></el-input>
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

				<el-table-column prop="period" label="有效时期" min-width="120">
				</el-table-column>
			
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="medium" type="text" @click="getRelateTimeSlot(scope.$index, scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>

		
		</el-dialog>
</el-form>


</template>

<script>
	import { getTimeIndexs , getTimeSlot, getTimeSlots, updateEntryTime, preViewEntryTime, addTimeSlot, getRelateTimeSlot} from '../../api/api';
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
					region: '',
				},
				rules: {
					index: [
						{ required: true, message: '请选择序号' }
					],
					name: [
						{ required: true, message: '请输入时段名称', trigger: 'blur' },
						{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
					],
					startDate: [
						{ 
						// type: 'date', 
						required: true, 
						message: '请选择日期',
						// trigger: 'change' 
						}
					],
					endDate: [
						{ 
						// type: 'date', 
						required: true, 
						message: '请选择日期', 
						// trigger: 'change'
						}
					],
					week: [
						{ type: 'array', required: true, message: '请至少选择一个星期', trigger: 'change' }
					],
					
		
				
				},
				filters: {
					name: ''
				},
				// week: [],
				time1: '',
				time2: '',
				time3: '',
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
				preViewData: {},
				queryWeek: '',
				kw: '',
				nextTimeSlot: 0,
				relateTime: []
			}
		},
		mounted() {
			this.getTimeIndexs();
			this.preViewEntryTime();
		},
		methods: {
			clearTimeSlot(){
				this.relateTime = []
				this.nextTimeSlot = 0
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
			getSTime1(val) {
                this.form.startDate=val;
			},
			getSTime2(val) {
                this.form.endDate=val;
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
				this.sels = sels;
			},
			onSubmit() {
				console.log('submit!');
			},
			back(){
				window.history.go(-1)
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
			preViewEntryTime() {
				let para = {
					id: this.$route.params.index
				}
				preViewEntryTime(para).then((res) => {
					if(res.code==200){
						// this.previewVisible = true
						this.form.name = res.data.name
						this.form.index = res.data.index
						this.form.startDate = res.data.startDate
						this.form.endDate = res.data.endDate
						this.form.week = res.data.week
						this.relateTime = res.data.timeSlots
						this.time1 = res.data.timeSections[0]&&[res.data.timeSections[0][0], res.data.timeSections[0][1]]
						this.time2 = res.data.timeSections[1]&&[res.data.timeSections[1][0], res.data.timeSections[1][1]]
						this.time3 = res.data.timeSections[2]&&[res.data.timeSections[2][0], res.data.timeSections[2][1]]
						this.nextTimeSlot = res.data.nextTimeSlot
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			getTimeSlot() {
				let para = {
					isFilter: 1,
					currentIndex: this.$route.params.index
				}
				getTimeSlots(para).then((res) => {
					if(res.code==200){
						this.previewVisible = true
						this.entryTime = res.data
					}else{
						this.$message.error(res.msg);
					}
				});
			},

			queryTimes() {
				let para = {
					kw: this.kw,
					week: this.queryWeek,
					isFilter: 1,
					currentIndex: this.$route.params.index
				}
				getTimeSlots(para).then((res) => {
					if(res.code==200){
						this.previewVisible = true
						this.entryTime = res.data
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
						this.entryTime = res.data.dataList
					}else{
						this.$message.error(res.msg);
					}
				});
			},
			getRelateTimeSlot1() {
				this.previewVisible = false
				// this.nextTimeSlot = row.index
			
				let para = {
					index: this.form.index
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
				let timeSectionsArr = [this.time1, this.time2, this.time3]
				let arr = timeSectionsArr.filter(item=>{
					return item&&item.length!=0
				})
				let para = {
					index: this.form.index,
					name: this.form.name,
					startDate: this.form.startDate,
					endDate: this.form.endDate,
					week: this.form.week,
					timeSections: arr,
					nextTimeSlot: this.nextTimeSlot
				}
				updateEntryTime(para).then((res) => {
					if(res.code==200){
						this.$message.success("保存成功");
						window.history.go(-1)
					}else{
						this.$message.error(res.msg);
					}
				});
			},
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
	.span-label-1{
		position: absolute;
		color: #ff4949;
		margin-left: -104px;
	}
</style>
