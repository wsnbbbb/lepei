<template>
	<section>
		<!-- 面包屑 -->
		<el-col :span="24" class="breadcrumb-box">
		<strong class="title">{{ $route.name }}</strong>
		<el-breadcrumb separator="/" class="breadcrumb-inner">
			<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
			{{ item.name }}
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
									placeholder="姓名/手环MAC"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="3">
								<el-form-item prop="gradeType">
									<el-select clearable v-model="filters1.gradeType" placeholder="学业阶段"  @change="changeGradeType">
										<el-option label="幼儿园" value="1"></el-option>
										<el-option label="小学" value="2"></el-option>
										<el-option label="初中" value="3"></el-option>
										<el-option label="高中" value="4"></el-option>
										<el-option label="大学" value="5"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item  prop="gradeId">
									<el-select v-model="filters1.gradeId" placeholder="年级" @change="changeGrade">
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
								<el-form-item  prop="classId">
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
								<el-button type="primary" size="medium" @click="resetForm('filters')" plain>重置</el-button>&emsp;
								<span class="cursor ftColor" @click="toggle1">{{ flag1 ? "" : "展开"}}<i :class="flag1 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></span>
							</el-col>
						</el-row>

						<el-row :gutter="24" :style="{ display: isShow1 ? 'block' : 'none' }">
							<el-col :span="4">
								<el-form-item  prop="sendStatus">
									<el-select clearable v-model="filters1.sendStatus" placeholder="下发状态" >
										<el-option label="下发中" value="1"></el-option>
										<el-option label="成功" value="2"></el-option>
										<el-option label="失败" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item>
									<el-button type="primary" size="medium" @click="importVisible1 = true">导入</el-button>&emsp;
									<a :href="exportUrl1" @click="listExport1"><el-button type="primary" size="medium">导出</el-button></a>&emsp;
									<el-button type="primary" size="medium" @click="batchSend1">全量再次下发</el-button>
								</el-form-item>
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
					<el-table-column prop="gradeType" label="学业阶段" min-width="100" :show-overflow-tooltip="true" :formatter="formatGradeType">
					</el-table-column>
					<el-table-column prop="gradeName" label="年级" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="className" label="班级" min-width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="wristbandNo" label="手环mac" min-width="120" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="bindTime" label="绑定时间" min-width="160" :show-overflow-tooltip="true" :formatter="formatTime">
					</el-table-column>
					<el-table-column prop="wristbandType" label="手环类型" min-width="100" :show-overflow-tooltip="true" :formatter="formatBandType">
					</el-table-column>
					<el-table-column prop="sendStatus" label="下发状态" min-width="100" :show-overflow-tooltip="true" :formatter="formatSendStatus">
					</el-table-column>
					<el-table-column label="操作" width="220">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="editDracelet(scope.row)">编辑</el-button>&emsp;
							<el-button type="text" size="small" @click="sendUserInfo(scope.row)">再次下发</el-button>&emsp;
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
									placeholder="姓名/手环MAC"
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
								<el-button type="primary" size="medium" @click="resetForm('filters2')" plain>重置</el-button>&emsp;
								<span class="cursor ftColor" @click="toggle2">{{ flag2 ? "收起" : "展开"}}<i :class="flag2 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></span>
							</el-col>
						</el-row>

						<el-row :gutter="24" :style="{ display: isShow2 ? 'block' : 'none' }">
							<el-col :span="8">
								<el-form-item>
									<el-button type="primary" size="medium" @click="importVisible2 = true">导入</el-button>&emsp;
									<a :href="exportUrl2" @click="listExport2"><el-button type="primary" size="medium">导出</el-button></a>&emsp;
									<el-button type="primary" size="medium" @click="batchSend2">全量再次下发</el-button>
								</el-form-item>
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
					<el-table-column prop="wristbandNo" label="手环mac" min-width="120" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="bindTime" label="绑定时间" min-width="160" :show-overflow-tooltip="true" :formatter="formatTime">
					</el-table-column>
					<el-table-column prop="wristbandType" label="手环类型" min-width="100" :show-overflow-tooltip="true" :formatter="formatBandType">
					</el-table-column>
					<el-table-column prop="sendStatus" label="下发状态" min-width="100" :show-overflow-tooltip="true" :formatter="formatSendStatus">
					</el-table-column>
					<el-table-column label="操作" width="220">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="editDracelet(scope.row)">编辑</el-button>&emsp;
							<el-button type="text" size="small" @click="sendUserInfo(scope.row)">再次下发</el-button>&emsp;
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
									placeholder="姓名/手环MAC"
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
								<el-button type="primary" size="medium" @click="resetForm('filters3')" plain>重置</el-button>&emsp;
								<span class="cursor ftColor" @click="toggle3">{{ flag3 ? "收起" : "展开"}}<i :class="flag3 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></span>
							</el-col>
						</el-row>

						<el-row :gutter="24" :style="{ display: isShow3 ? 'block' : 'none' }">
							<el-col :span="8">
								<el-form-item>
									<el-button type="primary" size="medium" @click="importVisible3 = true">导入</el-button>&emsp;
									<a :href="exportUrl3" @click="listExport3"><el-button type="primary" size="medium">导出</el-button></a>&emsp;
									<el-button type="primary" size="medium" @click="batchSend3">全量再次下发</el-button>
								</el-form-item>
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
					<el-table-column prop="wristbandNo" label="手环mac" min-width="120" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="bindTime" label="绑定时间" min-width="160" :show-overflow-tooltip="true" :formatter="formatTime">
					</el-table-column>
					<el-table-column prop="wristbandType" label="手环类型" min-width="100" :show-overflow-tooltip="true" :formatter="formatBandType">
					</el-table-column>
					<el-table-column prop="sendStatus" label="下发状态" min-width="100" :show-overflow-tooltip="true" :formatter="formatSendStatus">
					</el-table-column>
					<el-table-column label="操作" width="220">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="editDracelet(scope.row)">编辑</el-button>&emsp;
							<el-button type="text" size="small" @click="sendUserInfo(scope.row)">再次下发</el-button>&emsp;
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
	<el-dialog
      class="importForm1"
      title="导入"
      :visible.sync="importVisible1"
      width="60%"
      :before-close="cancel1">
      <el-form ref="importForm1" :model="importForm1" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="2">
            <el-form-item label="请选择文件：">
              <el-upload
                ref="upload"
                :action="action"
                :limit="1"
                :on-exceed="handleExceed1"
                :on-remove="handleRemove1"
                :on-change="changeFile1"
                :file-list="fileList1"
                :auto-upload="false">
                <el-button slot="trigger" size="small" plain type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="15" :offset="5">
          <p>
            <span >支持扩展名为.xls及.xlsx的文件</span>
            <a class="downLoad" download='学生绑定导入模板.xls'  :href="href1" style="marginLeft:30px" >下载导入模板</a>
          </p>
        </el-col>
      </el-row>
      <table v-if="importData1.error == false && importData1.headerArr.length > 0 && importData1.sheetDataArr.length > 0" border="1" class="import-erro-table">
        <thead>
          <tr>
            <th v-for="(item,index) in importData1.headerArr" :key="index">{{item}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in importData1.sheetDataArr" :key="index">
            <td v-for="(v,idx) in item" :key="idx">{{v}}</td>
          </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport1">取 消</el-button>
        <el-button type="primary" @click="submitUpload1">确 定</el-button>
      </span>
    </el-dialog>

	<el-dialog
      class="importForm2"
      title="导入"
      :visible.sync="importVisible2"
      width="60%"
      :before-close="cancel2">
      <el-form ref="importForm2" :model="importForm2" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="2">
            <el-form-item label="请选择文件：">
              <el-upload
                ref="upload"
                :action="action"
                :limit="1"
                :on-exceed="handleExceed2"
                :on-remove="handleRemove2"
                :on-change="changeFile2"
                :file-list="fileList2"
                :auto-upload="false">
                <el-button slot="trigger" size="small" plain type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="15" :offset="5">
          <p>
            <span >支持扩展名为.xls及.xlsx的文件</span>
            <a class="downLoad" download='教职工绑定导入模板.xls'  :href="href2" style="marginLeft:30px" >下载导入模板</a>
          </p>
        </el-col>
      </el-row>
      <table v-if="importData2.error == false && importData2.headerArr.length > 0 && importData2.sheetDataArr.length > 0" border="1" class="import-erro-table">
        <thead>
          <tr>
            <th v-for="(item,index) in importData2.headerArr" :key="index">{{item}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in importData2.sheetDataArr" :key="index">
            <td v-for="(v,idx) in item" :key="idx">{{v}}</td>
          </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport2">取 消</el-button>
        <el-button type="primary" @click="submitUpload2">确 定</el-button>
      </span>
    </el-dialog>

	<el-dialog
      class="importForm3"
      title="导入"
      :visible.sync="importVisible3"
      width="60%"
      :before-close="cancel3">
      <el-form ref="importForm2" :model="importForm3" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="2">
            <el-form-item label="请选择文件：">
              <el-upload
                ref="upload"
                :action="action"
                :limit="1"
                :on-exceed="handleExceed3"
                :on-remove="handleRemove3"
                :on-change="changeFile3"
                :file-list="fileList3"
                :auto-upload="false">
                <el-button slot="trigger" size="small" plain type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="15" :offset="5">
          <p>
            <span >支持扩展名为.xls及.xlsx的文件</span>
            <a class="downLoad" download='SH01_User_Manaul.pdf' :href="href3" style="marginLeft:30px" >下载导入模板</a>
          </p>
        </el-col>
      </el-row>
      <table v-if="importData3.error == false && importData3.headerArr.length > 0 && importData3.sheetDataArr.length > 0" border="1" class="import-erro-table">
        <thead>
          <tr>
            <th v-for="(item,index) in importData3.headerArr" :key="index">{{item}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in importData3.sheetDataArr" :key="index">
            <td v-for="(v,idx) in item" :key="idx">{{v}}</td>
          </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport3">取 消</el-button>
        <el-button type="primary" @click="submitUpload3">确 定</el-button>
      </span>
    </el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	import {base} from '../../config'
	import { getGrade,
	getClasses, getBuilds, getGradesByType, getPersonBracelet, getBraceletDetail, updateMac, sendUserInfo, batchSendUserInfo, braceletImport} from '../../api/api';

	export default {
		name:"braceletManage",
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
					sendStatus: ''
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
				file1: '',
				file2: '',
				file3: ''
			}
		},

		methods: {
			// 重置
			resetForm (formName) {
				this.$refs[formName].resetFields();
				if(formName == 'filters') {
					this.grandList = []
					this.classList = []
				}
			},

			sendUserInfo (row) {
				let params = {"personId": row.personId}
				sendUserInfo(params).then((res) =>{
					if(res.code == 200) {
						this.$message({
							message: '下发成功',
							type: 'success'
						});

						// let para = {
						// 	personType: 1,
						// 	kw: this.filters1.kw,
						// 	gradeType: this.filters1.gradeType,
						// 	gradeId: this.filters1.gradeId,
						// 	classId: this.filters1.classId,
						// 	bindStatus: this.filters1.bindStatus,
						// 	sendStatus: this.filters1.sendStatus,
						// 	page: this.page1,
						// 	pageSize: this.prePage
						// }

						// getPersonBracelet(para).then((res) => {
						// 	this.studentRecord = res.data.dataList
						// 	this.total1 = res.data.totalCount

						// });
                        let para = {}
                        if(this.activeName == "first"){
							para = {
								personType: 1,
								kw: this.filters1.kw,
								gradeType: this.filters1.gradeType,
								gradeId: this.filters1.gradeId,
								classId: this.filters1.classId,
								bindStatus: this.filters1.bindStatus,
								sendStatus: this.filters1.sendStatus,
								page: this.page1,
								pageSize: this.prePage1
							}
							getPersonBracelet(para).then((res) => {
								this.studentRecord = res.data.dataList
								this.total1 = res.data.totalCount
								// this.page1 = 1
							});
						}else if(this.activeName == "second"){
							para = {
								personType: 2,
								kw: this.filters2.kw,
								bindStatus: this.filters2.bindStatus,
								sendStatus: this.filters2.sendStatus,
								page: this.page2,
								pageSize: this.prePage
							}
							getPersonBracelet(para).then((res) => {
								this.teacherRecord = res.data.dataList
								this.total2 = res.data.totalCount
								// this.page2 = 1
							});
						}else if(this.activeName == "third"){
							para = {
								personType: 3,
								kw: this.filters1.kw,
								bindStatus: this.filters3.bindStatus,
								sendStatus: this.filters3.sendStatus,
								page: this.page3,
								pageSize: this.prePage
							}
							getPersonBracelet(para).then((res) => {
								this.parentRecord = res.data.dataList
								this.total3 = res.data.totalCount
								// this.page3 = 1
							});
						}
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
			changeFile1 (file1, fileList1) {
				// 这边是开启是否是只能一张一张传
				if (fileList1.length > 0) {
					this.fileList1 = [fileList1[fileList1.length - 1]];
					this.imageUrl1 = URL.createObjectURL(file1.raw);
				}
				this.file1 = file1.raw;
				console.log(this.file1);
				const isExcel = file1.raw.name.substring(file1.raw.name.lastIndexOf('.') + 1)
				if (isExcel !== 'xls' && isExcel !== 'xlsx') {
					this.$message.error("上传文件只能是 .xls或.xlsx 格式!");
					this.clearFiles();
					this.file1 = ''
					this.fileList1 = []
					return;
				}
			},
			// 改变事件
			changeFile2 (file2, fileList2) {
				// 这边是开启是否是只能一张一张传
				if (fileList2.length > 0) {
					this.fileList2 = [fileList2[fileList2.length - 1]];
					this.imageUrl2 = URL.createObjectURL(file2.raw);
				}
				this.file2 = file2.raw;
				console.log(this.file2);
				const isExcel = file2.raw.name.substring(file2.raw.name.lastIndexOf('.') + 1)
				if (isExcel !== 'xls' && isExcel !== 'xlsx') {
					this.$message.error("上传文件只能是 .xls或.xlsx 格式!");
					this.clearFiles();
					this.file2 = ''
					this.fileList2 = []
					return;
				}
				
			},
			// 改变事件
			changeFile3 (file3, fileList3) {
				// 这边是开启是否是只能一张一张传
				if (fileList3.length > 0) {
					this.fileList3 = [fileList3[fileList3.length - 1]];
					this.imageUrl3 = URL.createObjectURL(file3.raw);
				}
				this.file3 = file3.raw;
				console.log(this.file3);
				const isExcel = file3.raw.name.substring(file3.raw.name.lastIndexOf('.') + 1)
				if (isExcel !== 'xls' && isExcel !== 'xlsx') {
					this.$message.error("上传文件只能是 .xls或.xlsx 格式!");
					this.clearFiles();
					this.file3 = ''
					this.fileList3 = []
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
				form.append("personType", 1);
				braceletImport(form).then(res => {
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

							let para = {
								personType: 1,
								kw: this.filters1.kw,
								gradeType: this.filters1.gradeType,
								gradeId: this.filters1.gradeId,
								classId: this.filters1.classId,
								bindStatus: this.filters1.bindStatus,
								sendStatus: this.filters1.sendStatus,
								page: this.page1,
								pageSize: this.prePage1
							}
							getPersonBracelet(para).then((res) => {
								this.studentRecord = res.data.dataList
								this.total1 = res.data.totalCount
								this.page1 = 1
							});

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
						this.$message({message: '导入成功',type: 'success'});
						this.$message.error(res.msg);
					}
				})
			},

			// 导入保存
			submitUpload2() {
				if (!this.file2) {
					this.$message.error('请先选择文件，再导入！');
					return;
				}
				const form = new FormData();
				form.append("excel",this.file2);
				form.append("personType", 2);
				braceletImport(form).then(res => {
					if (res.code === 200) {
					if (res.data.error) {
						this.$message({message: '导入成功',type: 'success'});
						this.importVisible2 = false;
						this.file2 = '';
						this.fileList2 = [];
						let params = JSON.parse(JSON.stringify(this.filters2)) 
						params.page = this.page2
						params.prePage = this.prePage2
						// this.getStations(params)

						let para = {
							personType: 2,
							kw: this.filters2.kw,
							bindStatus: this.filters2.bindStatus,
							sendStatus: this.filters2.sendStatus,
							page: this.page2,
							pageSize: this.prePage2
						}
						getPersonBracelet(para).then((res) => {
							this.teacherRecord = res.data.dataList
							this.total2 = res.data.totalCount
							this.page2 = 1
						});

					} else {
						this.$message.error(res.msg);
						this.file2 = ""
						this.fileList2 = []
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
						this.importData2 = res.data
						}
					}
					} else {
					this.$message.error(res.msg);
					}
				})
			},

			// 导入保存
			submitUpload3() {
				if (!this.file3) {
					this.$message.error('请先选择文件，再导入！');
					return;
				}
				const form = new FormData();
				form.append("excel",this.file3);
				form.append("personType", 3);
				braceletImport(form).then(res => {
					if (res.code === 200) {
					if (res.data.error) {
						this.$message({message: '导入成功',type: 'success'});
						this.importVisible3 = false;
						this.file3 = '';
						this.fileList3 = [];
						let params = JSON.parse(JSON.stringify(this.filters3)) 
						params.page = this.page3
						params.prePage = this.prePage3
						// this.getStations(params)
						let para = {
							personType: 3,
							kw: this.filters1.kw,
							bindStatus: this.filters3.bindStatus,
							sendStatus: this.filters3.sendStatus,
							page: this.page3,
							pageSize: this.prePage3
						}
						getPersonBracelet(para).then((res) => {
							this.parentRecord = res.data.dataList
							this.total3 = res.data.totalCount
							this.page3 = 1
						});
					} else {
						this.$message.error(res.msg);
						this.file3 = ""
						this.fileList3 = []
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
						this.importData3 = res.data
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
			 // 导入取消
			cancelImport2 () {
				this.file2 = ''
				this.fileList2 = []
				this.importData2 = {}
				this.importVisible2 = false
			},
			 // 导入取消
			cancelImport3 () {
				this.file3 = ''
				this.fileList3 = []
				this.importData3 = {}
				this.importVisible3 = false
			},
			// 文件移除
			handleRemove1(file, fileList) {
				this.file1 = ''
				this.fileList1 = []
			},

			// 文件移除
			handleRemove2(file, fileList) {
				this.file2 = ''
				this.fileList2 = []
			},

			// 文件移除
			handleRemove3(file, fileList) {
				this.file3 = ''
				this.fileList3 = []
			},

			// 文件个数限制
			handleExceed1(files, fileList) {
				this.$message.error('只允许上传一个文件！');
			},
			// 文件个数限制
			handleExceed2(files, fileList) {
				this.$message.error('只允许上传一个文件！');
			},
			// 文件个数限制
			handleExceed3(files, fileList) {
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
			batchSend2(){
				let para = {
					personType: 2,
					kw: this.filters2.kw,
					gradeType: this.filters2.gradeType,
					gradeId: this.filters2.gradeId,
					classId: this.filters2.classId,
					bindStatus: this.filters2.bindStatus,
					sendStatus: this.filters2.sendStatus
				}
				batchSendUserInfo(para).then((res) => {
					if(res.code === 200){
						this.$message({message: '下发成功',type: 'success'});
					}
				});
			},
			batchSend3(){
				let para = {
					personType: 3,
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
			// 导出
			listExport1() {
				let token = sessionStorage.getItem("token");
				let userId = sessionStorage.getItem("userId");
				let personType = 1;
				let kw = this.filters1.kw || '';
				let gradeType = this.filters1.gradeType || '';
				let gradeId = this.filters1.gradeId || '';
				let classId = this.filters1.classId || '';
				let bindStatus = this.filters1.bindStatus || '';
				let sendStatus = this.filters1.sendStatus || '';

				let url = util.portUrl("/ssw-bluetooth/person-bracelet/export?userId=" + userId + "&accessToken=" + token + "&personType=" + personType + "&kw=" + kw + 
				"&gradeType=" + gradeType + "&gradeId=" + gradeId + "&classId=" + classId + "&bindStatus=" + bindStatus + "&sendStatus=" + sendStatus )
				this.exportUrl1 = url
			},
			// 导出
			listExport2() {
				let token = sessionStorage.getItem("token");
				let userId = sessionStorage.getItem("userId");
				let personType = 2;
				let kw = this.filters2.kw || '';
				let bindStatus = this.filters2.bindStatus || '';
				let sendStatus = this.filters2.sendStatus || '';

				let url = util.portUrl("/ssw-bluetooth/person-bracelet/export?userId=" + userId + "&accessToken=" + token + "&personType=" + personType + "&kw=" + kw + 
				"&bindStatus=" + bindStatus + "&sendStatus=" + sendStatus )
				this.exportUrl2 = url
			},
			// 导出
			listExport3() {
				let token = sessionStorage.getItem("token");
				let userId = sessionStorage.getItem("userId");
				let personType = 3;
				let kw = this.filters3.kw || '';
				let bindStatus = this.filters3.bindStatus || '';
				let sendStatus = this.filters3.sendStatus || '';

				let url = util.portUrl("/ssw-bluetooth/person-bracelet/export?userId=" + userId + "&accessToken=" + token + "&personType=" + personType + "&kw=" + kw + 
				"&bindStatus=" + bindStatus + "&sendStatus=" + sendStatus )
				this.exportUrl3 = url
			},
			changeGradeType: function(type){
				this.filters1.gradeId = ''
				this.filters1.classId = ''
				this.grandList = []
				this.classList = []
				if(!type) return
				let para = {
					type: type
				}
				getGradesByType(para).then((res) => {
					this.grandList = res.data;
				});
			

			},
			closeDialog: function(){
				this.picVisible = false
			},
			changeGrade: function(val){
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
				if(!row.bindTime) return '-'
				return util.formatDate.format(new Date(row.bindTime*1000), 'yyyy-MM-dd hh:mm:ss');
			},
	
			dateToTimestemp: function(timeDate){
			// var timeDate = "2019-05-09 14:50:48";
				return new Date(timeDate).getTime()/1000||""
			},
			// 新增/编辑-提交
			submitForm (formName) {
				// debugger
				console.log(this.page1,this.page2,this.page3)
				this.$refs[formName].validate((valid) => {
					let params = this.editDraceletData
					if (valid) {
						params.personId = this.oldPersonId
						updateMac(params).then((res) =>{
							if(res.code == 200) {
								this.$message({message: '编辑成功',type: 'success'});
								let para = {}
								if(this.activeName == "first"){
									para = {
										personType: 1,
										kw: this.filters1.kw,
										gradeType: this.filters1.gradeType,
										gradeId: this.filters1.gradeId,
										classId: this.filters1.classId,
										bindStatus: this.filters1.bindStatus,
										sendStatus: this.filters1.sendStatus,
										page: this.page1,
										pageSize: this.prePage1
									}
									getPersonBracelet(para).then((res) => {
										this.studentRecord = res.data.dataList
										this.total1 = res.data.totalCount
										// this.page1 = 1
									});
								}else if(this.activeName == "second"){
									para = {
										personType: 2,
										kw: this.filters2.kw,
										bindStatus: this.filters2.bindStatus,
										sendStatus: this.filters2.sendStatus,
										page: this.page2,
										pageSize: this.prePage
									}
									getPersonBracelet(para).then((res) => {
										this.teacherRecord = res.data.dataList
										this.total2 = res.data.totalCount
										// this.page2 = 1
									});
								}else if(this.activeName == "third"){
									para = {
										personType: 3,
										kw: this.filters1.kw,
										bindStatus: this.filters3.bindStatus,
										sendStatus: this.filters3.sendStatus,
										page: this.page3,
										pageSize: this.prePage
									}
									getPersonBracelet(para).then((res) => {
										this.parentRecord = res.data.dataList
										this.total3 = res.data.totalCount
										// this.page3 = 1
									});
								}
								

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
					sendStatus: this.filters1.sendStatus,
					page: this.page1,
					pageSize: 20
				}
				getPersonBracelet(para).then((res) => {
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
				getPersonBracelet(para).then((res) => {
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
				getPersonBracelet(para).then((res) => {
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
					sendStatus: this.filters1.sendStatus,
					page: 1,
					pageSize: 20
				}
				getPersonBracelet(para).then((res) => {
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
				getPersonBracelet(para).then((res) => {
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
				getPersonBracelet(para).then((res) => {
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

		
		
		
		},
		mounted() {
	
			this.queryStudent();
			this.queryTeacher();
			this.queryParent();
			this.href1 = util.getUpload('学生绑定导入模板.xls')
			this.href2 = util.getUpload('教职工绑定导入模板.xls')
			// this.href3 = util.getUpload('教职工绑定导入模板.xls')
			this.href3 = 'https://cdn.shopify.com/s/files/1/1545/3617/files/SH01_User_Manaul.pdf'
		},

		activated(){

		}
	}

</script>

<style lang="scss" scoped>
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

	.import-erro-table {
		width: 700px;
		overflow: auto;
		margin-top: 20px;
		max-height: 200px;
		td{
			color: red;
		}
	}

	table{border-collapse:collapse;border-spacing:0;border-left:1px solid #888;border-top:1px solid #888;}  

	th,td{border-right:1px solid #888;border-bottom:1px solid #888;padding:5px 15px;}  

	th{font-weight:bold;}  


</style>