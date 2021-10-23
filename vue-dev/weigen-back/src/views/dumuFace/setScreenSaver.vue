<template>
  <div class="setScreenSaver">
    <!-- 内容部分 -->
    <div class="content">
      <!-- 时间设置 -->
      <el-card class="box-card" style="margin-bottom: 10px">
        <!-- 查询表单 -->
        <el-form
          :inline="true"
          ref="searchFrom"
        >
          <el-row>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <!-- 屏保时间 -->
                <el-form-item label="屏保时间：" prop="limitTime">
                  <el-input
                    clearable
                    v-model="limitTime"
                    placeholder="请输入屏保时间"
                  ></el-input>
                </el-form-item>
              </div>
              <!-- <p style="margin-top: 20px; color: #909399">字段说明:<span>如设置10000,则在检测到人脸后10000ms内,没有新的人脸被检测,则触发屏保</span></p> -->
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">&nbsp;</div>
            </el-col>
            <el-col :span="8" style="text-align:right">
              <el-form-item>
                <el-button class="search_btn" type="primary" size="medium" @click="setScreenTime">确定</el-button>
                <el-button @click="toResultPage" size="medium" type="primary">修改结果</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <!-- 列表 -->
      <el-card class="box-card">
        <div class="titleBox">
          <el-row>
            <el-col :span="15">
              <p class="titleBox-p">说明: <span>最多只能启用五张屏保</span></p>
            </el-col>
            <el-col :span="9" style="text-align:right">
              <div class="grid-content bg-purple">
                <el-button @click="addImg(1)" type="primary" size="medium">新增</el-button>
                <el-button @click="start" :disabled="isStart" type="primary" size="medium">启用</el-button>
                <el-button @click="toResultPage" type="primary" size="medium">修改结果</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-table
          :data="screenSaverList"
          style="width: 100%"
          max-height="525"
          @selection-change="handleSelectionChange"
          ref="screenSaver"
        >
          <el-table-column type="selection" width="55" multiple-limit="1"></el-table-column>
          <el-table-column label="图片" prop="url">
            <template slot-scope="scope">
              <el-image 
                class="table-img"
                :src="scope.row.url" 
                :preview-src-list="[scope.row.url]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="上传时间" :formatter="formatTime"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope"><p :style="{color:scope.row.status == 0 ? '#f00' : (scope.row.status == 1 ? '#67C23A' : '#606266')}">{{ statusTypes[scope.row.status] }}</p></template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="addImg(2,scope.row)" size="medium">编辑</el-button>
              <el-button type="text" @click="del(scope.row)" size="medium">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 查询日志表格分页 -->
        <el-col :span="24" class="toolbar">
          <el-pagination  layout="total, prev, pager, next" :current-page="page"  @current-change="handleCurrentChange" :page-size="20" :total="total">
          </el-pagination>
        </el-col>
      </el-card>
    </div>
    <!-- 上传图片弹窗 -->
    <el-dialog
      title="上传屏保"
      :visible.sync="uploadVisible"
      width="35%"
      :before-close="handleClose"
    >
      <div class="upImg" style="display: flex">
        <div class="lable">图片：</div>
        <div>
          <el-upload
            class="imgUpload"
            ref="upload"
            :action="action"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadSectionFile"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p>文件大小不能超过5M</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="uploadCancel">取 消</el-button> -->
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="uploadOnOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import util from "../../common/js/util";
import { base,imgBase } from '../../config'
import {screenSaver,setSystemItems,fileUpload,addDisplayImg,playingImgDetail,editPlayingImg,enableDisplayImg,delPlayingImg } from "../../api/api";

export default {
  data() {
    return {
      total: 0, //查询日志表格总条数
      page: 1, //查询日志当前页码
      prePage: 20, //查询日志每页条数
      limitTime: "",  // 查询表单数据
      screenSaverList: [], // 表格数据
      selectRows: [],
      statusTypes: {
        0: "弃用",
        1: "启用",
      },
      action:'',
      uploadVisible: false, // 新增屏保弹窗
      fileList:[],
      imgUrl:'', //图片地址
      imgHash:'', //图片hash
      isStart:true, //启用禁止
      types:'', // 1:新增 2:编辑
      imgId:'',
    };
  },
  methods: {
    // 时间转换
    formatTime (row, column) {
      if(row.createTime){
        return util.formatDate.format(new Date(row.createTime*1000), 'yyyy-MM-dd hh:mm:ss');
      }else {
        return '---'
      }
    },

    // 屏保设置列表
    getDataList (params) {
      screenSaver(params).then((res) => {
        if(res.code == 200) {
          this.total = res.data.totalCount;
          this.limitTime = res.data.limitTime;
          this.screenSaverList = res.data.dataList;
        }
      });
    },

     // 分页
    handleCurrentChange (val) {
      if(val == this.page) return
      this.page = val;
      let params = {
        page: this.page,
        prePage: 20
      };
      this.getDataList(params)
    },

    // 设置屏保时间
    setScreenTime () {
      let params = {
        item:'setDisplayImg',
        value:this.limitTime
      }
      setSystemItems(params).then(res => {
        if(res.code == 200) {
           this.$message({
            message: res.msg,
            type: 'success'
          });
        }
      })
    },

    // 修改结果
    toResultPage () {
      this.$router.push({ path: '/item-set-detail/',query: {item: 'setDisplayImg',type:1}});
    },

    // 新增/编辑屏保
    addImg (type,row) {
      this.types = type
      if(type == 2){
        this.imgId = row.id
        let params = {
          id:row.id
        }
        playingImgDetail(params).then(res => {
          if(res.code == 200) {
            this.imgUrl = res.data.url
            this.uploadVisible = true;
          }
        })
      }else{
        this.uploadVisible = true;
      }
    },

    // 文件上传限制
    beforeAvatarUpload (file) {
        const isImage = file.type.indexOf("image") != -1;
        const isLt5M = file.size / 1024 / 1024  < 5;
        if (!isImage) {
          this.$message.error("上传图片只能是 jpg或jpeg或png 格式!");
        }
        if (!isLt5M) {
          this.$message.error("上传图片大小不能超过 5MB!");
        }
        return isImage && isLt5M;
    },
   
    // 文件上传
    uploadSectionFile(params) {
      const file = params.file
      // const isImage = file.type.indexOf("image") != -1;
      // const isLt5M = file.size / 1024 / 1024  < 5;
      // if (!isImage) {
      //   this.$message.error("上传图片只能是 jpg或jpeg或png 格式!");
      //   return;
      // }
      // console.log({isLt5M});
      // if (!isLt5M) {
      //   this.$message.error("上传图片大小不能超过 5MB!");
      //   return;
      // }
      const form = new FormData();
      form.append("file", params.file);
      fileUpload(form).then(res => {
        if (res.code === 200) {
          this.imgUrl = URL.createObjectURL(file);
          this.imgHash = res.data.hash
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    // 确定上传屏保
    uploadOnOk () {
      let params = {hash:this.imgHash}
      if(this.types == 1){
        addDisplayImg(params).then(res => {
          if(res.code == 200) {
            this.uploadVisible = false
            this.$message({
              message: '新增屏保成功',
              type: 'success'
            });
            let param = {
              page: this.page,
              prePage: 20,
            };
            this.imgUrl = ''
            this.getDataList(param)
          }
        })
      }else{
        params.id = this.imgId
        editPlayingImg(params).then(res => {
          if(res.code == 200) {
            this.uploadVisible = false
            this.$message({
              message: '修改屏保成功',
              type: 'success'
            });
            let param = {
              page: this.page,
              prePage: 20,
            };
            this.imgUrl = ''
            this.getDataList(param)
          }
        })

      }
    },

    // 弹窗关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.uploadVisible = false,
          this.imgUrl = ''
        })
        .catch((_) => {});
    },
    
    // 多选
    handleSelectionChange(val) {
      this.selectRows = val.map((el) => {
        return el.id;
      });
      if(val.length > 0){
        this.isStart = false
        if (val.length > 5) {
          this.$alert("屏保选择数量不能大于五张", "温馨提醒", {
            dangerouslyUseHTMLString: true,
          });
          this.$refs.screenSaver.clearSelection();
        }
      }else{
        this.isStart = true
      }
    },

    // 启用屏保
    start() {
      let params = {
        ids:this.selectRows
      }
      enableDisplayImg(params).then((res) => {
        if(res.code == 200){
          this.$message({
            message: '启用成功',
            type: 'success'
          });
          let param = {
            page: this.page,
            prePage: 20,
          };
          this.getDataList(param)
        }
      });
    },

    // 删除
    del(row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        let params = { id: row.id };
        delPlayingImg(params).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          let param = {
            page: this.page,
            prePage: 20,
          };
          this.getDataList(param)
        });
      }).catch(() => {
      });
    },
    
   
  },
  mounted() {
    let params = {
      page: 1,
      prePage: 20,
    };
    this.imgBase = imgBase
    this.getDataList(params);
  },
}
</script>

<style lang="scss" scoped>
.setScreenSaver {
  margin-top:1rem;
  .el-divider {
    margin: 0.12rem 0;
  }
  .el-form {
    .el-form-item {
      margin: 0;
    }
  }

  .el-table {
    th {
      &:nth-child(2) {
        padding: 0;
      }
    }
    th,
    td {
      text-align: center;
      select {
        width: 80%;
        height: 27px;
      }
    }
    .el-button {
      margin: 0 10px;
    }
  }
  .el-checkbox {
    margin-right: 15px;
  }
 
  .el-pagination {
    text-align: right;
  }
  .el-button {
    margin-right: 10px;
  }
  .titleBox {
    line-height: 46px;
    margin-bottom: 20px;
    .titleBox-p{
      margin:0
    }
  }
  .table-img {
    width:100px;
    height: 100px;
    img {
      width:100%;
      height: 100%;
    }
  }

  .upImg {
    .lable{
      width:25%;
      text-align: right;
      margin-right: 30px;
    }
    P{
      margin-top: 25px;
    }
  }
  .imgUpload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>