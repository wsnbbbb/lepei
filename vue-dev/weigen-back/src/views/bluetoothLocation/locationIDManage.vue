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
    <!-- <div style="height:800px;overflow-y:auto;box-sizing: border-box;"> -->
    <div>
      <!-- <div style="width:100px;height:500px;"></div> -->
      <!-- 搜索条件 -->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" ref="filters">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item prop="kw">
                <el-input
                  clearable
                  v-model="filters.kw"
                  placeholder="ID"
                ></el-input>
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
            <el-col :span="8">
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
              <el-button type="primary" size="medium" @click="resetForm('filters')" plain>重置</el-button>&emsp;
              <span class="cursor ftColor" @click="toggle">{{ flag ? "收起" : "展开"}}<i :class="flag ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></span>
            </el-col>
            <el-col :span="9" :style="{ display: isShow ? 'block' : 'none' }">
              <el-form-item>
                <el-button type="primary" size="medium" class="orage" @click="addDevice(1)">添加</el-button>&emsp;
                <el-button type="primary" size="medium" class="orage" @click="importVisible = true">导入</el-button>&emsp;
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table
        :max-height="isShow ? '650' : '700'"
        :data="deviceList"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="positionId" label="位置ID" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="buildName" label="建筑"></el-table-column>
        <el-table-column prop="placeName" label="场所"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addDevice(2,scope.$index, scope.row)">编辑</el-button>&emsp;
            <el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>&emsp;
            <!-- <el-dropdown>
              <span class="el-dropdown-link" style="font-size:12px">更多<i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="addDevice(2,scope.$index, scope.row)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="handleDel(scope.$index, scope.row)">删除</el-dropdown-item>
                <el-dropdown-item @click.native="toSecondPage(2,scope.$index, scope.row)">在线记录</el-dropdown-item>
                <el-dropdown-item @click.native="copyDev(scope.$index, scope.row)">复制本机信息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, prev, pager, next" :current-page="page"  @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </div>
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
        <el-form :model="addDeviceData" ref="addDeviceData" :rules="rules" label-width="120px">
          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item label="位置ID：" prop="positionId">
                <el-input clearable v-model="addDeviceData.positionId" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="20" :offset="1">
              <el-form-item label="所属建筑：" prop="buildId">
                <el-select clearable v-model="addDeviceData.buildId" placeholder="请选择" @change="editBuild">
                 <el-option
                    v-for="item in buildingList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="20" :offset="1">
              <el-form-item label="所属场所：" prop="placeId">
                <el-select clearable v-model="addDeviceData.placeId" placeholder="请选择" :disabled="placeDisabled1">
                  <el-option
                    v-for="item in placeList1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="20" :offset="1">
              <el-form-item label="备注：" prop="remark">
                <el-input clearable v-model="addDeviceData.remark" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
<!-- 
            <el-col :span="20" :offset="1">
              <el-form-item label="ip：" prop="ip">
                <el-input clearable v-model="addDeviceData.ip" auto-complete="off"></el-input>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="20" :offset="1">
              <el-form-item label="网关：" prop="gateway">
                <el-input clearable v-model="addDeviceData.gateway" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="20" :offset="1">
              <el-form-item label="子网掩码：" prop="subnetMask">
                <el-input clearable v-model="addDeviceData.subnetMask" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="20" :offset="1">
              <el-form-item label="DNS服务器：" prop="dns">
                <el-input clearable v-model="addDeviceData.dns" auto-complete="off"></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
        <div class="btns">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submitForm('addDeviceData')" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 导入 -->
    <el-dialog
      class="importForm"
      title="设备导入"
      :visible.sync="importVisible"
      width="40%"
      :before-close="cancel1">
      <el-form ref="importForm" :model="importForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="2">
            <el-form-item label="请选择文件：">
              <el-upload
                ref="upload"
                :action="action"
                :limit="1"
                :on-exceed="handleExceed"
                :on-remove="handleRemove"
                :on-change="changeFile"
                :file-list="fileList"
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
            <a class="downLoad" :href="href" style="marginLeft:30px" >下载导入模板</a>
          </p>
        </el-col>
      </el-row>
      <table v-if="importData.error == false && importData.headerArr.length > 0 && importData.sheetDataArr.length > 0" border="1" class="import-erro-table">
        <thead>
          <tr>
            <th v-for="(item,index) in importData.headerArr" :key="index">{{item}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in importData.sheetDataArr" :key="index">
            <td v-for="(v,idx) in item" :key="idx">{{v}}</td>
          </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 复制本机信息 -->
    <el-dialog
      class="copyDevice"
      title="复制本机信息"
      :visible.sync="copyDevVsible"
      width="35%"
      :before-close="cancel">
      <el-form ref="copyDevice" label-width="150px">
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="当前设备：">
                <el-input v-model="currentDev" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="选择设备：">
              <el-select v-model="destDevSns" multiple placeholder="请选择">
                <el-option
                  v-for="item in deviceOption"
                  :key="item.devSn"
                  :label="item.devName"
                  :value="item.devSn">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyDevVsible = false">取 消</el-button>
        <el-button type="primary" @click="copyOnOK">确 定</el-button>
      </span>

    </el-dialog>
  </section>
  
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import util from "../../common/js/util";
import { templateUrl } from '../../config'
import {getPositions, getBuilds,getPlaces, getPositionDetail,createPosition,updatePosition, deletePosition,devInit,dumuAllDevice,copyDev,positionImport} from "../../api/api";

export default {
  data() {
    return {
      page: 1,
      prePage: 20,
      total:0,
      action:'',
      flag: false,
      isShow: false,
      listLoading: false,
      filters: {
        kw: "",
        buildId: "",
        placeId: "",
        status: "",
      },
      deviceList: [],
      buildingList:[],
      placeList:[],
      placeList1:[],
      placeDisabled:true,
      placeDisabled1:true,
      exportUrl:'',
      addDialog: false,
      loading: false,
      addDeviceData:{
        positionId: "",
        buildId: "",
        placeId: "",
        remark: ""
      },
      rules: {
        positionId: [
          { required: true, message: '请输入位置ID', trigger: 'blur' }
        ],
        buildId: [
          { required: true, message: '请选择所属建筑', trigger: 'change' }
        ],
        placeId: [
          { required: true, message: '请选择所属场所', trigger: 'change' }
        ],

        gateway: [
          { required: true, message: '请输入网关', trigger: 'blur' }
        ],
        subnetMask: [
          { required: true, message: '请输入子网掩码', trigger: 'blur' }
        ],
        dns: [
          { required: true, message: '请输入DNS', trigger: 'blur' }
        ]
      },
      drawerTitle:'',
      editType:'',
      importVisible:false,
      importForm:{
        deviceFile:'',
      },
      errShow:false,
      currentDev:'',
      destDevSns:[],
      deviceOption:[],
      copyDevVsible:false,
      fileList:[],
      importData:{},
      file: '',
      href:'',
      oldPositionId: ''

  
      

    };
  },
  computed: {
    // ...mapGetters("common", {
    //   //用mapGetters来获取collection.js里面的getters
    //   buildingList: "renderBuilding",
    // }),
  },
  methods: {

    // 获取所有设备
    getAllDevice () {
      let params = {}
      dumuAllDevice(params).then((res) => {
        if(res.code == 200) {
          this.deviceOption = res.data
        }
      });
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
      // this.editForm.roomId = ''
    },

    // 设备状态
    deviceType (row, column) {
      if (row.status == 0) {
        return "离线";
      } else if (row.status == 1) {
        return "在线";
      } else {
        return "未知";
      }
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
    
    // 设备管理列表
    getPositions (params) {
      getPositions(params).then((res) => {
        this.total = res.data.totalCount;
        this.deviceList = res.data.dataList;
      });
    },

    // 查询
    search () {
      let params = {
        kw: this.filters.kw || '',
        buildId: this.filters.buildId || '',
        placeId: this.filters.placeId || '',
        status: this.filters.status || '',
        page: 1,
        prePage: 20
      };
      this.getPositions(params)
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
        buildId: this.filters.buildId,
        placeId: this.filters.placeId,
        status: this.filters.status,
        page: this.page,
        prePage: 20
      };
      this.getPositions(params)
    },

    // 改变事件
    changeFile (file, fileList) {
      // 这边是开启是否是只能一张一张传
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]];
        this.imageUrl = URL.createObjectURL(file.raw);
      }
      this.file = file.raw;
      console.log(this.file);
      const isExcel = file.raw.name.substring(file.raw.name.lastIndexOf('.') + 1)
      if (isExcel !== 'xls' && isExcel !== 'xlsx') {
        this.$message.error("上传文件只能是 .xls或.xlsx 格式!");
        this.clearFiles();
        this.file = ''
        this.fileList = []
        return;
      }
    },

    // 导入保存
    submitUpload() {
      if (!this.file) {
        this.$message.error('请先选择文件，再导入！');
        return;
      }
      const form = new FormData();
      form.append("excel",this.file);
      positionImport(form).then(res => {
        if (res.code === 200) {
          if (res.data.error) {
            this.$message({message: '导入成功',type: 'success'});
            this.importVisible = false;
            this.file = '';
            this.fileList = [];
            let params = JSON.parse(JSON.stringify(this.filters)) 
            params.page = this.page
            params.prePage = this.prePage
            this.getPositions(params)
          } else {
            this.$message.error(res.msg);
            this.file = ""
            this.fileList = []
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
              this.importData = res.data
            }
          }
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    // 导入取消
    cancelImport () {
      this.file = ''
      this.fileList = []
      this.importData = {}
      this.importVisible = false
    },

    // 文件移除
    handleRemove(file, fileList) {
     this.file = ''
     this.fileList = []
    },

    // 文件个数限制
    handleExceed(files, fileList) {
      this.$message.error('只允许上传一个文件！');
    },

    // 导入取消
    cancel1(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.file = ''
          this.fileList = []
          this.importData = {}
          this.importVisible = false
        })
        .catch(_ => {});
    },

    // 复制本机信息取消
    cancel(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    // 点击新增/编辑按钮
    addDevice (type,index,row) {
      if(type == 1){
        this.drawerTitle = '添加'
      }else if(type == 2){
        this.drawerTitle = '编辑'
        let params = {"positionId": row.positionId}
        getPositionDetail(params).then((res) =>{
          if(res.code == 200) {
            if(res.data.buildId){
              this.editBuild(res.data.buildId)
            }
            this.addDeviceData = Object.assign({}, res.data);
            this.oldPositionId = res.data.positionId
          }
        })
      }
      this.editType = type
      this.addDialog = true
    },
  
    // 新增/编辑 - 取消
    handleClose() {
      let _this = this
        this.$confirm('确认关闭？')
        .then(_ => {
          _this.resetForm('addDeviceData')
          this.addDialog = false
          // done()
        })
        .catch(_ => {});
    },

    // 新增/编辑 - 根据建筑获取场所
    editBuild (val) {
      let params = {
        buildId: val
      }
      if(val) {
        getPlaces(params).then((res) => {
          this.placeList1 = res.data;
          this.placeDisabled1 = false
        });
      }else {
        this.placeDisabled1 = true
      }
      this.addDeviceData.placeId = ''
    },

    // 新增/编辑-提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        let params = this.addDeviceData
        if (valid) {
         if(this.editType == 1) {
            createPosition(params).then((res) =>{
              if(res.code == 200) {
                this.$message({message: '新建成功',type: 'success'});
                let params = JSON.parse(JSON.stringify(this.filters)) 
                params.page = 1
                params.prePage = this.prePage
                this.getPositions(params)
                this.resetForm('addDeviceData')
                this.addDialog = false
              }
            })
          }else if(this.editType == 2) {
            params.oldPositionId = this.oldPositionId
            updatePosition(params).then((res) =>{
              if(res.code == 200) {
                this.$message({message: '设备编辑成功',type: 'success'});
                let params = JSON.parse(JSON.stringify(this.filters)) 
                params.page = this.page
                params.prePage = this.prePage
                this.getPositions(params)
                this.resetForm('addDeviceData')
                this.addDialog = false
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
   
    // 删除
    handleDel (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        let para = { positionId: row.positionId };
        deletePosition(para).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          let params = JSON.parse(JSON.stringify(this.filters)) 
          params.page = this.page
          params.prePage = this.prePage
          this.getPositions(params)
        });
      }).catch(() => {

      });
    },
    
    // 导出
    listExport() {
      let token = sessionStorage.getItem("token");
      let userId = sessionStorage.getItem("userId");
      let kw = this.filters.kw || '';
      let buildId = this.filters.buildId || '';
      let placeId = this.filters.placeId || '';
      let status = this.filters.status || '';
      let url = util.portUrl("/du-face/device/export?userId=" + userId + "&accessToken=" + token + "&kw=" + kw + 
      "&buildId=" + buildId + "&placeId=" + placeId + "&status=" + status)
      this.exportUrl = url
    },

    // 1.本机人脸库 2.在线记录 
    toSecondPage (type,index, row) {
      if(type == 1){
        this.$router.push({ path: '/native-face-library/' + row.devSn });
      }else if(type == 2){
        this.$router.push({ path: '/online-record/' + row.devSn });
      }
    },

    // 初始化
    devInit (index, row) {
      console.log(row.initStatus);
      if(row.initStatus == 0){
        devInit({devSn:row.devSn}).then((res) => {
          if(res.code == 200) {
            this.$message({
              message: '正在初始化，请稍后查看',
              type: 'success'
            });
            let params = JSON.parse(JSON.stringify(this.filters)) 
            params.page = this.page
            params.prePage = this.prePage
            this.getPositions(params)
          }else {
            this.$message.error(res.msg);
          }
        });
      }else {
        this.$router.push({ path: '/device-init/',query: {devSn: row.devSn}});
      }
    },

    // 复制本机信息
    copyDev (index, row) {
      this.copyDevVsible = true
      this.currentDev = `${row.devName}（${row.devSn}）`
      this.currentDevSn = row.devSn
    },

    // 复制本机信息-确定
    copyOnOK () {
      let params = {
        srcDevSn:this.currentDevSn,
        destDevSns:this.destDevSns
      }
      copyDev(params).then((res) => {
        if(res.code == 200) {
          this.$message({
              message: res.msg,
              type: 'success'
            });
          this.copyDevVsible = false
          let params = JSON.parse(JSON.stringify(this.filters)) 
          params.page = this.page
          params.prePage = this.prePage
          this.getPositions(params)
        }
      });
    },

  },

  mounted() {
    let params = {
      page: 1,
      prePage: 20,
    };
    this.getPositions(params);
    this.getBuilds();
    this.getAllDevice()
    this.href = util.getUpload('位置ID导入模板.xls')
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
.orage{
  background-color: #ff9800;
  border-color: #ff9800;
}


</style>