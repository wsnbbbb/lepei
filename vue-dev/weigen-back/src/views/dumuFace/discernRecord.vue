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
              <el-form-item  prop="buildId">
                <el-select clearable v-model="filters.buildId" placeholder="建筑" @change="buildChange">
                  <el-option
                    v-for="item in buildingList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item  prop="placeId">
                <el-select clearable v-model="filters.placeId" placeholder="场所" :disabled="placeDisabled">
                  <el-option
                    v-for="item in placeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align: right">
              <el-button type="primary" size="medium" @click="search">查询</el-button>&emsp;
              <a :href="exportUrl" @click="listExport"><el-button type="primary" size="medium">导出</el-button></a>&emsp;
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
            <el-col :span="6" :style="{ display: isShow ? 'block' : 'none' }">
              <!-- <el-form-item  prop="times"> -->
                <el-date-picker
                  @change="getTime"
                  v-model="times"
                  type="daterange"
                  value-format="timestamp"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              <!-- </el-form-item> -->
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table
        :max-height="isShow ? '650' : '700'"
        :data="recordList"
        highlight-current-row
        style="width: 100%"
        ref="recordTable"
      >
        <el-table-column prop="pic" width="120" label="头像">
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
        <el-table-column prop="photoUrl" width="120" label="识别结果">
           <template slot-scope="scope">
             <div class="demo-image__preview" v-if="scope.row.photoUrl">
              <el-image 
                class="table-img"
                :src="scope.row.photoUrl" 
                :preview-src-list="[scope.row.photoUrl]">
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="相似度"> </el-table-column>
        <el-table-column prop="personName" label="姓名"> </el-table-column>
        <el-table-column prop="sex" width="100" label="性别" :formatter="formatSex"> </el-table-column>
        <el-table-column prop="personType" label="人员类型" :formatter="formatPerson"> </el-table-column>
        <el-table-column prop="gradeType" label="学业阶段" :formatter="formatGradeType"> </el-table-column>
        <el-table-column prop="gradeName" label="年级"></el-table-column>
				<el-table-column prop="className" label="班级"></el-table-column>
        <el-table-column prop="icChipNo" label="卡号"> </el-table-column>
        <el-table-column prop="devName" label="设备名称"></el-table-column>
        <el-table-column prop="devSn" label="设备号"></el-table-column>
        <el-table-column prop="buildName" label="建筑"> </el-table-column>
        <el-table-column prop="placeName" label="场所"> </el-table-column>
        <el-table-column prop="recTime" label="识别时间" :formatter="formatTime"> </el-table-column>
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
import { getRecordList, getGradesByType, getClasses, getBuilds, getPlaces, } from "../../api/api";

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
        buildId: "",
        placeId: "",
      },
      recordList: [],
      gradeList:[],
      classList:[],
      buildingList:[],
      placeList:[],
      gradeDisabled:true,
      classDisabled:true,
      placeDisabled:true,
      loading: false,
      exportUrl:'',
      times:'',
      startTime:'',
      endTime:'',
      
    

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
      if(row.recTime){
        return util.formatDate.format(new Date(row.recTime*1000), 'yyyy-MM-dd');
      }else {
        return '---'
      }
    },

    //获取建筑
    getBuilds() {
      let params = {}
      this.listLoading = true;
      getBuilds(params).then((res) => {
        console.log(res.data);
        this.listLoading = false;
        this.buildingList = res.data
      });
    },

    // 根据所选建筑获取场所
    buildChange (value) {
      console.log(value)
      let params = {
        buildId: value
      }
      if(value) {
        getPlaces(params).then((res) => {
          this.placeList = res.data;
          this.placeDisabled = false
        });
      }else {
        this.placeDisabled = true
      }
      this.filters.placeId = ''
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

    // 展开/收起
    toggle () {
      this.flag = !this.flag;
      if (this.flag) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    
    // 识别记录列表
    getRecordList(params) {
      getRecordList(params).then((res) => {
        if(res.code == 200) {
          this.total = res.data.totalCount;
          this.recordList = res.data.dataList;
        }
      });
    },

    // 时间选择
    getTime (val) {
      console.log({val});
      if(val) {
        this.startTime = val[0] / 1000
        this.endTime = val[1] / 1000
      }else {
        this.startTime = ''
        this.endTime = ''
      }
    },

    // 查询
    search () {
      let params = {
        kw: this.filters.kw || '',
        personType: this.filters.personType || '',
        gradeType: this.filters.gradeType || '',
        gradeId: this.filters.gradeId || '',
        classId: this.filters.classId || '',
        buildId: this.filters.buildId || '',
        placeId: this.filters.placeId,
        startTime:this.startTime,
        endTime:this.endTime,
        page: 1,
        prePage: 20
      };
      this.getRecordList(params)
      this.page = 1
    },

    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.times = []
      this.startTime = ''
      this.endTime = ''
    },
    
    // 分页
    handleCurrentChange (val) {
      if(val == this.page) return
      this.page = val;
      let params = {
        kw: this.filters.kw || '',
        personType: this.filters.personType || '',
        gradeType: this.filters.gradeType || '',
        gradeId: this.filters.gradeId || '',
        classId: this.filters.classId || '',
        buildId: this.filters.buildId || '',
        placeId: this.filters.placeId,
        startTime:this.startTime,
        endTime:this.endTime,
        page: this.page,
        prePage: 20
      };
      this.getRecordList(params)
    },

    // 导出
    listExport() {
      let token = sessionStorage.getItem("token");
      let userId = sessionStorage.getItem("userId");
      let kw = this.filters.kw || '';
      let personType = this.filters.personType || '';
      let gradeType = this.filters.gradeType || '';
      let gradeId = this.filters.gradeId || '';
      let classId = this.filters.classId || '';
      let buildId = this.filters.buildId || '';
      let placeId = this.filters.placeId || '';
      let startTime = this.startTime || '';
      let endTime = this.endTime || '';
      let url = util.portUrl("/du-face/face-recognize/export?userId=" + userId + "&accessToken=" + token + "&kw=" + kw + "&personType=" + personType + 
      "&gradeType=" + gradeType + "&gradeId=" + gradeId + "&classId=" + classId + "&buildId=" + buildId + "&placeId=" + placeId + "&startTime=" + startTime+ "&endTime=" + endTime)
      this.exportUrl = url
    },


   
  },

  mounted() {
    this.imgBase = imgBase
    let params = {
      page: 1,
      prePage: 20,
    };
    this.getRecordList(params);
    this.changeGradeType();
    this.getBuilds();
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



</style>