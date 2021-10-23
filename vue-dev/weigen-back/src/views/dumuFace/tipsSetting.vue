<template>
  <div class="tips-setting">
      <el-card class="box-card" >
        <el-form
          :inline="true"
          label-width="140px"
        >
          <div class="title">提示语设置：</div>
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="识别成功提示语：">
                <el-input
                  maxlength="20"
                  style="min-width:300px"
                  clearable
                  v-model="successWord"
                  placeholder="请输入"
                ></el-input>
                <div class="tips">支持中文、数字、和英文，不支持符号，长度20个字符以内。</div>
              </el-form-item>
            </el-col>
           </el-row>
           <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="识别失败提示语：">
                <el-input
                  maxlength="20"
                  style="min-width:300px"
                  clearable
                  v-model="failWord"
                  placeholder="请输入"
                ></el-input>
                <div class="tips">支持中文、数字、和英文，不支持符号，长度20个字符以内。</div>
              </el-form-item>
            </el-col>
           </el-row>
          <div class="title">提示音设置：</div>
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="识别成功的提示音：">
                <el-upload
                  class="audioUpload"
                  :action="action"
                  :limit="1"
                  :file-list="successFile"
                  :on-exceed="handleExceed"
                  :on-remove="handleRemove"
                  :http-request="uploadFile"
                >
                  <el-button plain size="medium" >请选择文件</el-button>
                </el-upload>
                <div class="tips">支持AAC和WAV格式，文件大小不超过1M</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="识别失败的提示音：">
                <el-upload
                  class="audioUpload"
                  :action="action"
                  :limit="1"
                  :file-list="failFile"
                  :on-exceed="handleExceed"
                  :on-remove="handleRemove1"
                  :http-request="uploadFile1"
                >
                  <el-button plain size="medium" >请选择文件</el-button>
                </el-upload>
                <div class="tips">支持AAC和WAV格式，文件大小不超过1M</div>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="title">头像显示模式设置：</div>
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="是否显示头像：">
                  <el-switch
                    v-model="profilePhoto"
                    active-text="是"
                    inactive-text="否">
                  </el-switch>
                <div class="tips">如不开启则仅显示文字信息，如开启，则文字和头像都显示<br/>
                  显示的头像并非注册照片，而是当前用于识别的图片
                </div>
              </el-form-item>
            </el-col>
           </el-row>
          <el-row>
            <el-col :span="24" class="btns">
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
import {setSystemItems,getPromptingDetail,fileUpload } from "../../api/api";

export default {
  data() {
    return {
      action:'',
      successWord:'',
      failWord:'',
      successFile:[],
      failFile:[],
      profilePhoto:true,
      successAudioHash:'',
      failAudioHash:'',
     
    };
  },
  methods: {
    // 提示设置详情
    getPromptingDetail () {
      getPromptingDetail().then((res) => {
        if(res.code == 200) {
          let arr1 = []
          let arr2 = []
          if(res.data.successAudio.fileName != '' && res.data.successAudio.url != ''){
            arr1.push({
              name:res.data.successAudio.fileName,
              url:res.data.successAudio.url,
            });
          }
          if(res.data.failAudio.fileName != '' && res.data.failAudio.url != ''){
            arr2.push({
              name:res.data.failAudio.fileName,
              url:res.data.failAudio.url,
            });
          }
          
          this.successFile = arr1;
          this.failFile = arr2;
          this.successWord = res.data.successWord;
          this.failWord = res.data.failWord;
          this.successAudioHash = res.data.successAudio.hash;
          this.failAudioHash = res.data.failAudio.hash;
          this.profilePhoto = res.data.profilePhoto;
        }
      });
    },

    // 文件移除
    handleRemove(file, fileList) {
      this.successFile = []; 
      this.successAudioHash = ''
    },
    handleRemove1(file, fileList) {
      this.failFile = []; 
      this.failAudioHash = ''
    },
    // 文件个数限制
    handleExceed(files, fileList) {
      this.$message.error('只允许上传一个文件！');
    },
   
    // 识别成功提示音上传
    uploadFile (params) {
      console.log({params});
      const file = params.file
      const isLt1M = file.size / 1024 / 1024  < 1;
      let isAudio = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (isAudio !== 'wav' && isAudio !== 'aac') {
        this.$message.error("上传文件只能是 wav或者aac 格式!");
        this.successFile = []; 
        return;
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
        this.successFile = []; 
        return;
      }
      const form = new FormData();
      form.append("file",file);
      fileUpload(form).then(res => {
        if (res.code === 200) {
            this.successAudioHash = res.data.hash
        } else {
          this.$message.error(res.msg);
        }
      })
     
    },
    // 识别失败提示音上传
    uploadFile1 (params,type) {
      console.log({params});
      const file = params.file
      const isLt1M = file.size / 1024 / 1024  < 1;
      let isAudio = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (isAudio !== 'wav' && isAudio !== 'aac') {
        this.$message.error("上传文件只能是 wav或者aac 格式!");
        this.failFile = []; 
        return;
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
        this.failFile = []; 
        return;
      }
      const form = new FormData();
      form.append("file",file);
      fileUpload(form).then(res => {
        if (res.code === 200) {
          this.failAudioHash = res.data.hash
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    // 保存设置
    setSystemItems (type) {
      let value = {
        successWord:this.successWord,
        failWord:this.failWord,
        successAudio:this.successAudioHash,
        failAudio:this.failAudioHash,
        profilePhoto:this.profilePhoto,
      }
      let params = {
        item:'setPrompting',
        value:value
      } 
      setSystemItems(params).then(res => {
        if(res.code == 200) {
           this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getPromptingDetail();
        }
      })
    },

    // 修改结果
    toResultPage () {
      this.$router.push({ path: '/item-set-detail/',query: {item: 'setPrompting',type:2}});
    },

   
  },
  mounted() {
    this.getPromptingDetail();
  },
}
</script>

<style lang="scss" scoped>
.tips-setting {
  margin-top:1rem;
  .box-card{
    padding: 10px 20px 0 20px !important;
    max-height: 750px;
    overflow-y: auto;
  }
  .el-divider {
    margin: 0.12rem 0;
  }
  .el-form {
    .tips {
      color:#A2A2A2;
    }

    .el-button {
      margin-right: 20px;
    }
    .title {
      border-left:3px solid #409EFF;
      padding-left:5px;
      margin: 0 0 15px 50px;
    }
  }
  .avatar {
    width: 160px;
    height: 100px;
    display: block;
    object-fit: fill;
  }
  .btns{
    text-align: center;
    margin-top: 20px;
  }

}
</style>