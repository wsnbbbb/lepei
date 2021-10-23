<template>
  <div class="logo-setting">
      <el-card class="box-card" >
        <el-form
          :inline="true"
          label-width="166px"
        >
         <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="开机logo图片：" prop="imageStartUrl">
                <el-upload
                  class="imgUpload"
                  :action="action"
                  :show-file-list="false"
                  :http-request="uploadFile"
                >
                  <img v-if="imageStartUrl" :src="imageStartUrl" class="avatar">
                  <el-button v-else plain size="medium" >选择文件</el-button>
                </el-upload>
                <div class="tips">尺寸：宽800*高1280</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="顶层logo：" prop="imageTopUrl">
                <el-upload
                  class="imgUpload"
                  :action="action"
                  :show-file-list="false"
                  :http-request="uploadFile2"
                >
                  <img v-if="imageTopUrl" :src="imageTopUrl" class="avatar">
                  <el-button v-else plain size="medium" >选择文件</el-button>
                </el-upload>
                <div class="tips">尺寸：宽160*高64</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="顶层文字：" prop="topText">
                <el-input
                  maxlength="10"
                  style="min-width:300px"
                  clearable
                  v-model="topText"
                  placeholder="请输入"
                ></el-input>
                <div class="tips">文字长度不超过10个字</div>
              </el-form-item>
            </el-col>
           </el-row>
          <el-row>
            <el-col :span="24" style="text-align:center">
              <el-form-item>
                <el-button class="search_btn" type="primary" size="medium" @click="setSystemItems(3)">保存</el-button>
                <el-button @click="toResultPage()" size="medium" type="primary">修改结果</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
   
</template>

<script>
import util from "../../common/js/util";
import { base,imgBase } from '../../config'
import {setSystemItems,getLogoDetail,fileUpload } from "../../api/api";

export default {
  data() {
    return {
      action:'',
      imageStartUrl:'',
      imageTopUrl:'',
      topText:'',
      imageStartHash:'',
      imageTopHash:'',
     
    };
  },
  methods: {
    // logo设置详情
    getLogoDetail () {
      getLogoDetail().then((res) => {
        if(res.code == 200) {
          this.imageStartUrl = res.data.imageStart.url;
          this.imageStartHash = res.data.imageStart.hash;
          this.imageTopUrl = res.data.imageTop.url;
          this.imageTopHash = res.data.imageTop.hash;
          this.topText = res.data.topText;
        }
      });
    },

    // 开机logo上传
    uploadFile(params) {
      const file = params.file
      const isImage = file.type.indexOf("image") != -1;
      if (!isImage) {
        this.$message.error("上传图片只能是 jpg或jpeg或png 格式!");
        return;
      }
      const form = new FormData();
      form.append("file", params.file);
      fileUpload(form).then(res => {
        if (res.code === 200) {
          this.imageStartUrl = URL.createObjectURL(file);
          this.imageStartHash = res.data.hash
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    // 置顶图片上传
    uploadFile2 (params) {
      const file = params.file
      const isImage = file.type.indexOf("image") != -1;
      if (!isImage) {
        this.$message.error("上传图片只能是 jpg或jpeg或png 格式!");
        return;
      }
      const form = new FormData();
      form.append("file", params.file);
      fileUpload(form).then(res => {
        if (res.code === 200) {
          this.imageTopUrl = URL.createObjectURL(file);
          this.imageTopHash = res.data.hash
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    // 保存设置
    setSystemItems (type) {
      let value = {
        imageStart:this.imageStartHash,
        imageTop:this.imageTopHash,
        topText:this.topText,
      }
      let params = {
        item:'setLogo',
        value:value
      } 
      setSystemItems(params).then(res => {
        if(res.code == 200) {
           this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getLogoDetail();
        }
      })
    },

    // 修改结果
    toResultPage () {
      this.$router.push({ path: '/item-set-detail/',query: {item: 'setLogo',type:3}});
    },

   
  },
  mounted() {
    this.getLogoDetail();
  },
}
</script>

<style lang="scss" scoped>
.logo-setting {
  margin-top:1rem;
  .el-divider {
    margin: 0.12rem 0;
  }
  .el-form {
    padding-top:30px;
    .tips {
      color:#A2A2A2;
    }
    .el-row{
      margin-bottom: 20px;
    }
    .el-button {
      margin-right: 20px;
    }
   
  }
  .avatar {
    width: 160px;
    height: 100px;
    display: block;
    object-fit: fill;
  }

}
</style>