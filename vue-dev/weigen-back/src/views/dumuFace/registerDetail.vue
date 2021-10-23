<template>
  <section>
    <!-- 面包屑 -->
    <el-col :span="24" class="breadcrumb-box">
      <strong class="title">{{ $route.name }}</strong>
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item>人脸识别管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/face-library' }">人脸库</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <div>
      <el-col style="margin:15px 0" :span="24"><el-button :disabled="disabled" type="primary" size="small" @click="faceRegister()">一键同步</el-button></el-col>
      <!--列表-->
      <el-table
        height="700"
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
        <el-table-column prop="faceStatus" label="人脸库">
          <template slot-scope="scope">
            <span :style="{color:statusColor(scope.row.faceStatus)}">{{syncType(scope.row.faceStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="备注" min-width="120" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-show="scope.row.isAllowRegister == 1" type="text" size="medium" @click="registerOne(scope.$index, scope.row)">同步人脸</el-button>
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
import { registerDetail,faceRegister,personRegister } from "../../api/api";

export default {
  data() {
    return {
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
    ...mapActions("common", [
      //collection是指modules文件夹下的collection.js
      "invokePushItems", //collection.js文件中的actions里的方法，在上面的@click中执行并传入实参
    ]),

    // 同步状态
    syncType (type) {
      if(type == 0){
					return "未同步"
				}else if(type == 1){
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
  
    // 注册详情列表
    registerDetail() {
    let params = {personId : this.$route.params.personId}
      registerDetail(params).then((res) => {
        if(res.code == 200) {
          this.listData = res.data.registerList;
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
      if(row.isAllowRegister == 1 ){
        return 1
      }else{
        return 0
      }
    },

    // 一键同步
    faceRegister () {
      let devSnsList = []
      this.selectRows.map (item => {
        devSnsList.push(item.devSn)
      })
      let params = {
        personId : this.$route.params.personId,
        devSns:devSnsList
      }
     
      faceRegister(params).then((res) => {
        if(res.code == 200){
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.registerDetail()
        }
      });
    },

    // 单个同步
    registerOne (index,row) {
      let params = {
        personId:this.$route.params.personId,
        devSn:row.devSn,
      }
      personRegister(params).then((res) => {
        if(res.code == 200){
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.registerDetail()
        }
      });
    },
   
   
  },

  mounted() {
    this.registerDetail();
  },
};
</script>

<style scoped lang="scss">
.toolbar{
  padding-bottom: 0;
}

</style>