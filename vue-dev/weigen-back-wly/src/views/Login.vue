<template>
  <div class="container">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">宜宾五粮液门禁管理系统登录</h3>
      <el-form-item prop="account">
        <el-input prefix-icon="el-icon-search" type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      
      <el-form-item prop="checkPass">
        <el-input prefix-icon="el-icon-search" type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button type="danger" style="width:100%;" @click.native.prevent="handleSubmit2" >登录</el-button>
        <!-- <el-button @click.native.prevent="handleReset2">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { requestLogin, authorize } from '../api/api';
  import axios from 'axios';
  const decode = require('decode-html');
  const md5 = require('md5');
  import {mapState,mapGetters,mapActions} from 'vuex';
  
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
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
        checked: true
      };
    },
    methods: {
      ...mapActions([ 
				'TOG2COMMON',
				'TOG2SUPER'
			]),
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
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
                sessionStorage.setItem('socketUrl', `${data.data.realTimeSocket.ip}:${data.data.realTimeSocket.port}`);
                axios.defaults.headers.common['Authorization'] = "Bearer "+sessionStorage.getItem("token");
                axios.defaults.headers.common['User-Id'] = sessionStorage.getItem("userId");
                this.$router.push({ path: '/devConfig' });
              } else {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              }
            }).finally(()=>{
              
            })
      },
      handleSubmit2(ev) {
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
                sessionStorage.setItem('userType', data.data.userType);
                // sessionStorage.setItem('socketUrl', `${data.data.realTimeSocket.ip}:${data.data.realTimeSocket.port}`);
                axios.defaults.headers.common['Authorization'] = "Bearer "+sessionStorage.getItem("token");
                axios.defaults.headers.common['User-Id'] = sessionStorage.getItem("userId");
                this.$router.push({ path: '/personList' });
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
      this.authorize(code)
    }
  }

</script>

<style lang="scss" scoped>
.container{
  height: 100%;
  background: url('../assets/login-bg.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
}
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    // margin: 0 auto;
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    // box-shadow: 0 0 25px #cac6c6;
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