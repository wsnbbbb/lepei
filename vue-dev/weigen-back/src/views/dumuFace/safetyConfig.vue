<template>
  <div class="safety-cofig">
      <el-card class="box-card" >
        <div class="title">设置安全密码</div>
        <el-form
          :inline="true"
          ref="password"
          label-width="80px"
        >
          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="密码：">
                  <el-input
                    style="min-width:300px"
                    clearable
                    v-model="password"
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
        </el-form>
      </el-card>
      <el-card class="box-card" >
        <div class="title">陌生人开关</div>
        <el-form
          :inline="true"
          ref="switch"
          label-width="120px"
        >
          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="陌生人开关：">
                  <el-radio-group v-model="strangerType">
                    <el-radio label="1">开</el-radio>
                    <el-radio label="0">关</el-radio>
                  </el-radio-group>
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
        </el-form>
      </el-card>
    </div>
</template>

<script>
import util from "../../common/js/util";
import { base,imgBase } from '../../config'
import {setSystemItems,getSecurityDetail } from "../../api/api";

export default {
  data() {
    return {
      password:'',
      strangerType:'',
    };
  },
  methods: {
  
    // 安全配置详情
    getSecurityDetail () {
      getSecurityDetail().then((res) => {
        if(res.code == 200) {
          this.password = res.data.password;
          this.strangerType = res.data.strangerType;
        }
      });
    },

    // 保存设置
    setSystemItems (type) {
      let params 
      if(type == 1){
        params = {
          item:'setPassword',
          value:this.password
        }
      }else if(type == 2) {
        params = {
          item:'setStranger',
          value:this.strangerType
        }
      }
      setSystemItems(params).then(res => {
        if(res.code == 200) {
           this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getSecurityDetail();
        }
      })
    },

    // 修改结果
    toResultPage (code) {
      let item = code == 1 ? 'setPassword' : (code == 2 ? 'setStranger' : '')
      this.$router.push({ path: '/item-set-detail/',query: {item: item,type:4}});
    },

   
  },
  mounted() {
    this.getSecurityDetail();
  },
}
</script>

<style lang="scss" scoped>
.safety-cofig {
  margin-top:1rem;
  .el-divider {
    margin: 0.12rem 0;
  }
  .box-card{
    padding:15px;
    margin-bottom: 20px;
    .title {
      border-left:3px solid #409EFF;
      padding-left:5px;
      margin-bottom: 30px;
    }
  }
  .el-form {
    .el-button {
      margin-right: 20px;
    }
   
  }

}
</style>