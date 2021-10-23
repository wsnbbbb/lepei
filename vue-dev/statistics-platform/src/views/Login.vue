<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" >登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import administrationStaistics from './charts/administrationStaistics'
  import { requestLogin } from '../api/api';
  import axios from 'axios';
  const decode = require('decode-html');
  const md5 = require('md5');
  export default {
    data() {
      return {
        logining: false,
        ruleForm: {
          account: 'tfxq001',
          checkPass: 'Lepeitfxq001'
        },
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      handleSubmit(ev) {
        var _this = this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var loginParams = { username: this.ruleForm.account, password: md5(this.ruleForm.checkPass) };
            requestLogin(loginParams).then(data => {
              if (data.code == 200) {
                sessionStorage.setItem('token', data.data.token);
                sessionStorage.setItem('userId', data.data.userId);
                sessionStorage.setItem('menu', JSON.stringify(data.data.menu));
                axios.defaults.headers.common['Authorization'] = "Bearer "+sessionStorage.getItem("token");
                axios.defaults.headers.common['User-Id'] = sessionStorage.getItem("userId");
                this.$router.push({ path: '/' });
              } else {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              }
            }).finally(()=>{

              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    mounted() {
 
   
    }
  }

</script>

<style lang="scss" scoped>

  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>