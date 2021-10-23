<template>
  <section>
    <!-- 面包屑 -->
    <el-col :span="24" class="breadcrumb-box">
      <strong class="title">{{ $route.name }}</strong>
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item>人脸识别管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/du-face-device' }">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <div>
      <!-- 搜索条件 -->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" ref="filters">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item prop="kw">
                <el-input
                  clearable
                  v-model="filters.kw"
                  placeholder="姓名/卡号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item  prop="personType">
                <el-select clearable v-model="filters.personType" placeholder="人员类型">
                  <el-option label="学生" value="1"></el-option>
                  <el-option label="教师" value="2"></el-option>
                  <el-option label="员工" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item  prop="faceStatus">
                <el-select clearable v-model="filters.faceStatus" placeholder="状态">
                  <el-option label="未注册" value="0"></el-option>
                  <el-option label="注册中" value="1"></el-option>
                  <el-option label="注册失败" value="2"></el-option>
                  <el-option label="注册成功" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item  prop="sex">
                <el-select clearable v-model="filters.sex" placeholder="性别">
                  <el-option label="保密" value="0"></el-option>
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align: right">
              <el-button type="primary" size="medium" @click="search">查询</el-button>&emsp;
              <el-button type="primary" size="medium" @click="resetForm('filters')" plain>重置</el-button>&emsp;
              <span class="cursor ftColor" @click="toggle">{{ flag ? "收起" : "展开"}}<i :class="flag ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="4" :style="{ display: isShow ? 'block' : 'none' }">
              <el-form-item  prop="gradeType">
                <el-select clearable v-model="filters.gradeType" placeholder="学业阶段" @change="changeGradeType">
                  <el-option label="幼儿园" value="1"></el-option>
                  <el-option label="小学" value="2"></el-option>
                  <el-option label="初中" value="3"></el-option>
                  <el-option label="高中" value="4"></el-option>
                  <el-option label="大学" value="5"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" :style="{ display: isShow ? 'block' : 'none' }">
              <el-form-item  prop="gradeId">
                <el-select clearable v-model="filters.gradeId" placeholder="年级" @change="gradeChange" :disabled="gradeDisabled">
                  <el-option
                    v-for="item in gradeList"
                    :key="item.gradeId"
                    :label="item.gradeName"
                    :value="item.gradeId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" :style="{ display: isShow ? 'block' : 'none' }">
              <el-form-item  prop="classId">
                <el-select clearable v-model="filters.classId" placeholder="班级" :disabled="classDisabled">
                  <el-option
                    v-for="item in classList"
                    :key="item.classId"
                    :label="item.className"
                    :value="item.classId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="24" class="chooseBtn">
        <el-tag class="tag"><i class="el-icon-warning"></i>共查询<span>{{ total }}</span>条数据<span v-if="selcetNum != 0"> ，您选择了<span>{{isAll == 1 ? total : selcetNum}}</span>条</span></el-tag>
        <el-button v-show="isAll == 0" type="text" size="medium" @click="selectAll(faceLibraryList)">选择全部</el-button>
        <el-button v-if="selcetNum != 0" type="text" size="medium" @click="cancelSelect">取消选择</el-button>
        <el-button  type="primary" size="small" :disabled="registerDisabled" @click="batchRegister()">批量注册</el-button>
        <el-button  type="primary" size="small" :disabled="registerDisabled" @click="batchDelFace()">批量删除</el-button>
      </el-col>
      <!--列表-->
      <el-table
        :height="isShow ? '590' : '640'"
        :data="faceLibraryList"
        highlight-current-rowa
        row-key="personId"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        ref="faceLibrary"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="devName" width="120" label="图片">
           <template slot-scope="scope">
             <div class="demo-image__preview" v-if="scope.row.pic">
              <el-image 
                class="table-img"
                :src="imgBase + scope.row.pic" 
                :preview-src-list="[imgBase + scope.row.pic]">
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="personName" label="姓名"> </el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="formatSex"> </el-table-column>
        <el-table-column prop="personType" label="人员类型" :formatter="formatPerson"> </el-table-column>
        <el-table-column prop="gradeType" label="学业阶段" :formatter="formatGradeType"> </el-table-column>
        <el-table-column prop="gradeName" label="年级"></el-table-column>
				<el-table-column prop="className" label="班级"></el-table-column>
        <el-table-column prop="icChipNo" label="卡号"> </el-table-column>
        <el-table-column prop="faceStatus" label="状态">
          <template slot-scope="scope">
            <span :style="{color:statusColor(scope.row.faceStatus)}">{{formatFaceStatus(scope.row.faceStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" :formatter="formatTime"> </el-table-column>
        <el-table-column prop="msg" label="备注" min-width="120" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button v-show="scope.row.faceStatus == 1" type="primary" size="small" @click="personRegister(scope.$index, scope.row)">注册</el-button>
            <el-button v-show="scope.row.faceStatus == 3" type="text" size="small" @click="delPerson(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, prev, pager, next" :current-page="page"  @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </div>
  </section>
  
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import util from "../../common/js/util";
import { imgBase } from '../../config'
import {getFaceLibrary, getGradesByType,getClasses,batchRegister,personRegister,batchDelFace,delPerson} from "../../api/api";

export default {
  data() {
    return {
      page: 1,
      prePage: 20,
      total:0,
      flag: false,
      isShow: false,
      listLoading: false,
      filters: {
        kw: "",
        personType: "",
        gradeType: "",
        gradeId: "",
        classId: "",
        faceStatus: "",
        sex:""
      },
      faceLibraryList: [],
      gradeList:[],
      classList:[],
      gradeDisabled:true,
      classDisabled:true,
      loading: false,
      selectRows:[],
      selcetNum:0,
      isAll:0, 
      personIds:[],
      registerDisabled:true,
      
    

    };
  },
  computed: {
    // ...mapGetters("common", {
    //   //用mapGetters来获取collection.js里面的getters
    //   buildingList: "renderBuilding",
    // }),
  },
  methods: {
    ...mapActions("common", [
      //collection是指modules文件夹下的collection.js
      "invokePushItems", //collection.js文件中的actions里的方法，在上面的@click中执行并传入实参
    ]),
    //性别显示转换
    formatSex (row, column) {
      return row.sex == 1 ? '男' : row.sex == 2 ? '女' : '保密';
    },
    //人员类型
    formatPerson (row, column) {
      if(row.personType == 1){
					return "学生"
				}else if(row.personType == 2){
					return "教师"
				}else if(row.personType == 3){
					return "员工"
				}else{
					return "未知"
			}
    },
    // 1：幼儿园 2：小学 3：初中 4：高中 5：大学
    formatGradeType (row) {
      if(row.gradeType == 1){
        return "幼儿园"
      }else if(row.gradeType == 2){
        return "小学"
      }else if(row.gradeType == 3){
        return "初中"
      }else if(row.gradeType == 4){
        return "高中"
      }else if(row.gradeType == 5){
        return "大学"
      }
    },
    // 时间转换
    formatTime (row, column) {
      if(row.createTime){
        return util.formatDate.format(new Date(row.createTime*1000), 'yyyy-MM-dd hh:mm:ss');
      }else {
        return '---'
      }
    },

    // 注册状态
    formatFaceStatus (type) {
      if(type == 0){
        return "未注册"
      }else if(type == 1){
        return "注册中"
      }else if(type == 2){
        return "注册失败"
      }else if(type == 3){
        return "注册成功"
      }else{
        return "未知"
      }
    },
    // 状态颜色
    statusColor (type) {
      if(type == 0){
        return "#E6A23C"
      }else if(type == 1){
        return "#909399"
      }else if(type == 2){
        return "#F56C6C"
      }else if(type == 3){
        return "#67C23A"
      }else{
        return ""
      }
    },

    // 根据学业阶段获取年级
    changeGradeType (val) {
      let params = {
        type: val
      }
      if(val) {
        getGradesByType(params).then((res) => {
          this.gradeList = res.data;
          this.gradeDisabled = false
        });
      }else {
        this.gradeDisabled = true
        this.classDisabled = true
      }
      this.gradeList = []
      this.classList = []
      this.filters.gradeId = ''
      this.filters.classId = ''
    },

    // 根据年级获取班级
    gradeChange (value) {
      console.log(value)
      let params = {
        gradeId: value
      }
      if(value) {
        getClasses(params).then((res) => {
          this.classList = res.data;
          this.classDisabled = false
        });
      }else {
        this.classDisabled = true
      }
      this.classList = []
      this.filters.classId = ''
    },

    // 列表header
    selsChange (sels) {
      this.sels = sels;
    },

    // 展开/收起
    toggle () {
      this.flag = !this.flag;
      if (this.flag) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    
    // 本机人脸库列表
    getFaceLibrary (params) {
      getFaceLibrary(params).then((res) => {
        if(res.code == 200) {
          this.total = res.data.totalCount;
          this.faceLibraryList = res.data.dataList;
        }
      });
    },

    // 查询
    search () {
      let params = {
        kw: this.filters.kw || '',
        personType: this.filters.personType || '',
        sex: this.filters.sex || '',
        gradeType: this.filters.gradeType || '',
        gradeId: this.filters.gradeId || '',
        classId: this.filters.classId || '',
        faceStatus: this.filters.faceStatus || '',
        devSn: this.$route.params.devSn,
        page: 1,
        prePage: 20
      };
      this.getFaceLibrary(params)
      this.page = 1
    },

    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    
    // 分页
    handleCurrentChange (val) {
      if(val == this.page) return
      this.page = val;
      let params = {
        kw: this.filters.kw,
        personType: this.filters.personType || '',
        sex: this.filters.sex || '',
        gradeId: this.filters.gradeId || '',
        classId: this.filters.classId || '',
        faceStatus: this.filters.faceStatus || '',
        devSn: this.$route.params.devSn,
        page: this.page,
        prePage: 20
      };
      this.getFaceLibrary(params)
    },

    // 选择人员
    handleSelectionChange(sels) {
      if(sels.length == 0 ){
        this.registerDisabled = true
        this.isAll = 0
        this.selcetNum = 0
      }else {
        if(sels.length == 20 && this.isAll == 1){
          this.selcetNum = this.total;
        }else{
          this.selcetNum = sels.length;
          this.isAll = 0
        }
        this.registerDisabled = false
      }
      this.selectRows = sels
      console.log({sels});
      console.log(this.isAll);
    },

    // 选择全部
    selectAll (data) {
      this.isAll = 1
      if(this.selectRows.length > 0){
        if(this.selectRows.length == 20){
          this.selcetNum = this.total
          return
        }else{
          data.map(item =>{
            this.selectRows.map(v =>{s
              if(item != v){
                this.$refs.faceLibrary.toggleAllSelection(item)
              }
            })
          })
        }
      }else {
        this.$refs.faceLibrary.toggleAllSelection(data)
      }
      this.selectRows = data
      console.log("11",this.isAll);
    },
    // 取消选择
    cancelSelect () {
      this.isAll = 0
      this.selectRows = [],
      this.registerDisabled = true
      this.selcetNum = 0
      this.$refs.faceLibrary.clearSelection();

    },
    // 批量注册
    batchRegister (type,index,row) {
      let personIds = []
      this.selectRows.map (item => {
        personIds.push(item.personId)
      })
      let params = JSON.parse(JSON.stringify(this.filters)) 
      params.devSn = this.$route.params.devSn
      params.isAll = this.isAll
      params.personIds = personIds
      batchRegister(params).then((res) => {
        if(res.code == 200){
          this.$message({
            message: res.msg,
            type: 'success'
          });
          let param = JSON.parse(JSON.stringify(this.filters)) 
          param.devSn = this.$route.params.devSn
          param.page = this.page
          param.prePage = this.prePage
          this.getFaceLibrary(param)
        }
      });
    },

    // 单个注册
    personRegister (index,row) {
      let params = {
        personId:row.personId,
        devSn:this.$route.params.devSn,
      }
      personRegister(params).then((res) => {
        if(res.code == 200){
          this.$message({
            message: res.msg,
            type: 'success'
          });
          let param = JSON.parse(JSON.stringify(this.filters)) 
          param.devSn = this.$route.params.devSn
          param.page = this.page
          param.prePage = this.prePage
          this.getFaceLibrary(param)
        }
      });
    },

    // 批量删除
    batchDelFace () {
      let personIds = []
      this.selectRows.map (item => {
        personIds.push(item.personId)
      })
      let params = JSON.parse(JSON.stringify(this.filters)) 
      params.devSn = this.$route.params.devSn
      params.isAll = this.isAll
      params.personIds = personIds
      batchDelFace(params).then((res) => {
        if(res.code == 200){
          this.$message({
            message: res.msg,
            type: 'success'
          });
          let param = JSON.parse(JSON.stringify(this.filters)) 
          param.devSn = this.$route.params.devSn
          param.page = this.page
          param.prePage = this.prePage
          this.getFaceLibrary(param)
        }
      });
    },

    // 单个删除
    delPerson (index,row) {
      let params = {
        personId:row.personId,
        devSn:this.$route.params.devSn,
      }
      delPerson(params).then((res) => {
        if(res.code == 200){
          this.$message({
            message: res.msg,
            type: 'success'
          });
          let param = JSON.parse(JSON.stringify(this.filters)) 
          param.devSn = this.$route.params.devSn
          param.page = this.page
          param.prePage = this.prePage
          this.getFaceLibrary(param)
        }
      });
    },
   
  },

  mounted() {
    this.imgBase = imgBase
    let params = {
      page: 1,
      prePage: 20,
      devSn: this.$route.params.devSn
    };
    this.getFaceLibrary(params);
    this.changeGradeType();
  },
};
</script>

<style scoped lang="scss">
.ftColor {
  color: #1890ff;
}
.cursor {
  cursor: pointer;
}
.toolbar{
  padding-bottom: 0;
}
.table-img {
  width:100px;
  height: 100px;
  img {
    width:100%;
    height: 100%;
  }
}
.preview-dialog .el-dialog{
  width: 80%!important;
  .preview-img{
    width: 100%;
    img{
      width:80%;
      height: 80%;
    }
  }
}
.chooseBtn {
  margin: 10px 0 15px 0;
  font-size: 14px;
  .tag{
    font-size: 14px;
    margin-right: 15px;
    span{
      padding:0 5px;
    }
    i{
      margin-right: 5px;
    }
  }
}


</style>