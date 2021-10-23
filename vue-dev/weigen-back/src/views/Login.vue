<template>
  <div class="container">
    <div class="login-box">
      <div class="login-top">
        <img class="school-logo" :src="schoolLogo ? imgBase + schoolLogo : defaultImg" alt="">
        <h1>{{schoolName}}</h1>
        <h4>乐陪校园本地服务管理平台</h4>
      </div>
    
      <el-form @keyup.enter.native="handleSubmit" :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <el-form-item prop="account">
          <el-input prefix-icon="el-icon-user" type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input prefix-icon="el-icon-lock" type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button type="primary" size="medium"  style="width:100%;" @click.native.prevent="handleSubmit" >登&nbsp;&nbsp;录</el-button>
          <!-- <el-button @click.native.prevent="handleReset2">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
   </div>
</template>

<script>
  import { requestLogin, authorize , getSchoolDetail} from '../api/api';
  import { routes, weigenRoutes, duFaceRoutes, bluetoothLocationRoutes } from '../routes/routes.js'
  import axios from 'axios';
  import {imgBase } from '../config'
  const decode = require('decode-html');
  const md5 = require('md5');
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        imgBase: imgBase,
        schoolLogo: '',
        defaultImg: require('../assets/logo.png'),
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true,
        schoolName: '',

      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      getSchoolDetail(code){
        let param ={}
        let _this = this
        getSchoolDetail(param).then(data => {
              if (data.code == 200) {
                this.schoolName = data.data.schoolName
                this.schoolLogo = data.data.logo
                sessionStorage.setItem('logo', data.data.logo)
                if(code){
                  _this.authorize(code)
                }
              } else {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              }
            }).finally(()=>{
              
            })
      },
      GetQueryString(name){
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      },
      authorize(code){
        if(!code) return
        let param ={
          code: decode(code)
        }
        authorize(param).then(data => {
              if (data.code == 200) {
                sessionStorage.setItem('token', data.data.token);
                sessionStorage.setItem('userId', data.data.userId);
                // sessionStorage.setItem('socketUrl', `${data.data.realTimeSocket}`);
                axios.defaults.headers.common['Authorization'] = "Bearer "+sessionStorage.getItem("token");
                axios.defaults.headers.common['User-Id'] = sessionStorage.getItem("userId");
                let type = this.GetQueryString("type")
                if(type == 1){
                  sessionStorage.setItem('activeItem', 1)
                  this.$router.options.routes = routes.concat(weigenRoutes);
                  this.$router.addRoutes(weigenRoutes)
                  this.$router.push({ path: '/devConfig' });
                }else if(type == 2){
                  sessionStorage.setItem('activeItem', 2)
                  this.$router.options.routes = routes.concat(bluetoothLocationRoutes);
                  this.$router.addRoutes(bluetoothLocationRoutes)
                  this.$router.push({ path: '/base-station-manage' }); 
                }
                
              } else {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              }
            }).finally(()=>{
              
            })
      },
      handleSubmit(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            var loginParams = { username: this.ruleForm2.account, password: md5(this.ruleForm2.checkPass) };
            requestLogin(loginParams).then(data => {
              //NProgress.done();
              // let { msg, code, data } = data;
              if (data.code == 200) {
                sessionStorage.setItem('token', data.data.token);
                sessionStorage.setItem('userId', data.data.userId);
                // sessionStorage.setItem('socketUrl', `${data.data.realTimeSocket}`);
                axios.defaults.headers.common['Authorization'] = "Bearer "+sessionStorage.getItem("token");
                axios.defaults.headers.common['User-Id'] = sessionStorage.getItem("userId");
                this.$router.push({ path: '/select' });
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
      }
    },
    mounted() {
      let code = this.GetQueryString("code")
      // this.authorize(code)
      this.getSchoolDetail(code)
    }
  }

</script>

<style lang="scss" scoped>
  .login-box{
      width: 422px;
      margin: 0 auto;
      padding-top: 100px;
  }
  .login-top{
    text-align: center;
    h1{
      color: #fff;
      font-size: 28px;
      margin-bottom: 0;
    }
    h4{
      color: #fff;
      font-size: 20px;
      margin: 10px 0;
    }
  }
  .school-logo{
    display: block;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto;
    background-color: #fff;
  }
  .container{
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    background-image: url('../assets/bg-login.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    // margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #fff;
    box-shadow: 0 0 25px #018fff;
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