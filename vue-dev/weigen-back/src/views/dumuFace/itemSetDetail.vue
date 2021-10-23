<template>
  <section>
    <!-- 面包屑 -->
    <el-col :span="24" class="breadcrumb-box">
      <strong class="title">{{ $route.name }}</strong>
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item >系统设置</el-breadcrumb-item>
        <el-breadcrumb-item ><a @click="goBack" href="javascript:;">{{parentMenu}}</a></el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <div>
      <el-col style="margin:15px 0" :span="24"><el-button :disabled="disabled" type="primary" size="small" @click="reSyncByItem(1)">一键重试</el-button></el-col>
      <!--列表-->
      <el-table
        max-height="700"
        :data="listData"
        highlight-current-row
        @selection-change="handleSelectionChange"
        style="width: 100%"
        ref="recordTable"
      >
        <el-table-column type="selection" :selectable="isDisabled" disabled="true" width="55"></el-table-column>
        <el-table-column prop="devName" label="设备名称"></el-table-column>
        <el-table-column prop="ip" label="ip地址"></el-table-column>
        <el-table-column prop="buildName" label="安装位置"> 
          <template slot-scope="scope"><span>{{scope.row.buildName + scope.row.placeName}}</span></template>
        </el-table-column>
        <el-table-column prop="devSn" label="设备号"></el-table-column>
        <el-table-column prop="devStatus" label="设备状态">
          <template slot-scope="scope">
            <span :style="{color:scope.row.devStatus == 1 ? '#67C23A' : (scope.row.devStatus == 0 ? '#f00' : '')}">
              {{scope.row.devStatus == 1 ? '在线' : (scope.row.devStatus == 0 ? '离线' : '未知')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="syncStatus" label="修改结果">
          <template slot-scope="scope">
            <span :style="{color:statusColor(scope.row.syncStatus)}">{{syncType(scope.row.syncStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="备注" min-width="100" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="syncTime" label="修改时间" :formatter="formatTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-show="scope.row.syncStatus == 2" type="text" size="medium" @click="reSyncByItem(2,scope.$index, scope.row)">重试</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
  
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import util from "../../common/js/util";
import { imgBase } from '../../config'
import { itemDetailList, reSyncByItem } from "../../api/api";

export default {
  data() {
    return {
      type:'',
      historyPath:'',
      parentMenu:'',
      listLoading: false,
      listData: [],
      loading: false,
      selectRows:[],
      disabled:true,

    };
  },
  computed: {
  },
  methods: {
    // 上级菜单
    parentTitle (type) {
      if(type == 1){
        this.parentMenu =  "屏保设置"
      }else if(type == 2){
        this.parentMenu = "提示设置"
      }else if(type == 3){
        this.parentMenu = "LOGO设置"
      }else if(type == 4){
        this.parentMenu = "安全配置"
      }else if(type == 5){
        this.parentMenu = "数据配置"
      }else{
        return ""
      }
    },

    // 时间转换
    formatTime (row, column) {
      if(row.syncTime){
        return util.formatDate.format(new Date(row.syncTime*1000), 'yyyy-MM-dd hh:mm:ss');
      }else {
        return '---'
      }
    },

    // 同步状态
    syncType (type) {
      if(type == 1){
        return "同步中"
      }else if(type == 2){
        return "同步失败"
      }else if(type == 3){
        return "同步成功"
      }else{
        return ""
      }
    },
    
    // 状态颜色
    statusColor (type) {
      if(type == 1){
        return "#E6A23C"
      }else if(type == 2){
        return "#F56C6C"
      }else if(type == 3){
        return "#67C23A"
      }else{
        return ""
      }
    },
  
    // 修改结果列表
    itemDetailList() {
    let params = {item : this.$route.query.item}
      itemDetailList(params).then((res) => {
        if(res.code == 200) {
          this.listData = res.data;
        }
      });
    },

    // 选择人员
    handleSelectionChange(sels) {
      console.log({sels});
      if(sels.length > 0){
        this.disabled = false
      }else{
        this.disabled = true
      }
      this.selectRows = sels;
    },

    // 是否可选
    isDisabled(row, index){
      if(row.syncStatus == 2){
        return 1
      }else{
        return 0
      }
    },

    // 一键重试/单个同步
    reSyncByItem (type,index,row) {
      let params = {
        item:this.$route.query.item,
      }
      if(type == 1){
        let devSnsList = []
        this.selectRows.map (item => {
          devSnsList.push(item.devSn)
        })
        params.devSns = devSnsList
      }else{
        params.devSns = [row.devSn]
      }
      reSyncByItem(params).then((res) => {
        if(res.code == 200){
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.itemDetailList()
        }
      });
    },

    // 返回
    goBack() {
      console.log('111');
      sessionStorage.setItem("itemType",this.type)
      this.$router.push({ path: '/system-setting'});
    },
  },
   

  mounted() {
    this.type = this.$route.query.type
    this.parentTitle(this.$route.query.type)
    this.itemDetailList();
  },
}
</script>

<style scoped lang="scss">
.toolbar{
  padding-bottom: 0;
}
.go-back-style{
  font-weight: bold;
  cursor: pointer;
}
.go-back-style:hover{
  color:#409EFF;
}

</style>