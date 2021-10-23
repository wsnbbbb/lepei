<template>
  <div>
    <div class="banner"><img src="http://qiniu.lepayedu.com/FgUQNfel62UreUXO4hDI-lhhknrC" alt=""></div>
    <div class="login-box">
      <van-form validate-first @failed="onFailed" @submit="onSubmit">
        <van-field
          v-model="account"
          clearable
          name="account"
          label="账号"
          placeholder="请填写"
          input-align="right"
        />
        <van-field
          v-model="password"
          name="password"
          label="密码"
          placeholder="请填写"
          input-align="right"
          maxlength="12"
          type="password"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            登录
          </van-button>
        </div>
      </van-form>
    </div>

  </div>
</template>

<script>


import { login} from '../api/request'
import {getQueryString, stringCheck} from '../util/util'
import { Toast } from 'vant';
    export default {
        data(){
            return {
              account:'',
              password:'',
            }
        },
        async created() {
            let datas =  JSON.parse(localStorage.getItem("userInfo"))
            // this.uid = datas.uid;
            // this.token = datas.token;
            // this.school = datas.schoolName;
            // let res = await alienInfoDetail({"uid":datas.uid,"token":datas.token})
            // if(res.success){
            //   this.name = res.detail.name;
            //   this.mobile = res.detail.mobile;
            // }else{
            //    if(res.code == 100004){
            //       this.$toast(res.description)
            //     }else{
            //       Toast.fail(res.description);
            //     }
            // }
        },
        methods:{
           onFailed(errorInfo) {
          },
          onSubmit(value) {

            // let reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
            // if(!reg.test(this.mobile)){
            //   return  this.$toast("请输入正确格式的手机号码");
            // }
            if(stringCheck(this.account)){
                Toast('请输入账号');
                return
            }
            if(stringCheck(this.password)){
                Toast('请输入密码');
                return
            }
            let params = {
              "username":this.account,
              "password":this.password,
            }
            login(params).then(res =>{
              if(res.success){
                this.$toast("登录成功")
                localStorage.setItem("detailList",JSON.stringify(res.detail))
                setTimeout(() => {
                  this.$router.push({path:"/home"})
                  //  if(this.$route.query.redirect){
                  //     let redirect_path = this.$route.query.redirect
                  //     this.$router.push({
                  //       path: redirect_path
                  //     })
                  //   }else{
                    // }
                }, 1000);
              }else{
                this.$toast.fail(res.description)
              }
            })
            
          }
        },
        mounted() { 

        } 

    }
</script>

<style lang="less">
    .banner{
        width:100%;
        img{
            width:100%;
            height:100%;
        }
    }
    .login-box{
      padding: 0 35px;
    }
</style>