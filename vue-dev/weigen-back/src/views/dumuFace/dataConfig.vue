<template>
  <div class="data-setting">
      <!-- 时间设置 -->
      <el-card class="box-card" >
        <!-- 查询表单 -->
        <el-form
          :inline="true"
          ref="searchFrom"
          label-width="166px"
        >
          <el-row>
            <el-col :span="10" :offset="2">
              <div class="grid-content bg-purple">
                <el-form-item label="用户信息变更回调地址：" prop="userCallback">
                  <el-input
                    style="min-width:300px"
                    clearable
                    v-model="userCallback"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7" style="text-align:right">
              <el-form-item>
                <el-button class="search_btn" type="primary" size="medium" @click="setSystemItems(1)">保存</el-button>
                <el-button @click="toResultPage(1)" size="medium" type="primary">修改结果</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <div class="grid-content bg-purple">
                <el-form-item label="设备心跳回调地址：" prop="deviceHeartBeat">
                  <el-input
                    style="min-width:300px"
                    clearable
                    v-model="deviceHeartBeat"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7" style="text-align:right">
              <el-form-item>
                <el-button class="search_btn" type="primary" size="medium" @click="setSystemItems(2)">保存</el-button>
                <el-button @click="toResultPage(2)" size="medium" type="primary">修改结果</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <div class="grid-content bg-purple">
                <el-form-item label="识别后数据回调地址：" prop="recognitionCallback">
                  <el-input
                    style="min-width:300px"
                    clearable
                    v-model="recognitionCallback"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7" style="text-align:right">
              <el-form-item>
                <el-button class="search_btn" type="primary" size="medium" @click="setSystemItems(3)">保存</el-button>
                <el-button @click="toResultPage(3)" size="medium" type="primary">修改结果</el-button>
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
import {setSystemItems,getCallbackDetail } from "../../api/api";

export default {
  data() {
    return {
      userCallback:'',
      deviceHeartBeat:'',
      recognitionCallback:'',
     
    };
  },
  methods: {
  
    // 数据配置详情
    getCallbackDetail () {
      getCallbackDetail().then((res) => {
        if(res.code == 200) {
          this.userCallback = res.data.userCallback;
          this.deviceHeartBeat = res.data.deviceHeartBeat;
          this.recognitionCallback = res.data.recognitionCallback;
        }
      });
    },

    // 保存设置
    setSystemItems (type) {
      let params 
      if(type == 1){
        params = {
          item:'setUserCallback',
          value:this.userCallback
        }
      }else if(type == 2) {
        params = {
          item:'setDeviceHeartBeat',
          value:this.deviceHeartBeat
        }
      }else if(type == 3) {
        params = {
          item:'setRecognitionCallback',
          value:this.recognitionCallback
        }
      }
      setSystemItems(params).then(res => {
        if(res.code == 200) {
           this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getCallbackDetail();
        }
      })
    },

    // 修改结果
    toResultPage (code) {
      let item = code == 1 ? 'setUserCallback' : (code == 2 ? 'setDeviceHeartBeat' : (code == 3 ? 'setRecognitionCallback' : ''))
      this.$router.push({ path: '/item-set-detail/',query: {item: item,type:5}});
    },

   
  },
  mounted() {
    this.getCallbackDetail();
  },
}
</script>

<style lang="scss" scoped>
.data-setting {
  margin-top:1rem;
  .el-divider {
    margin: 0.12rem 0;
  }
  .el-form {
    padding-top:30px;
    .el-row {
      margin-bottom:50px;
    }
    .el-button {
      margin-right: 20px;
    }
   
  }

}
</style>