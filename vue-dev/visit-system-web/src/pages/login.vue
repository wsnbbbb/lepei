<template>
      <div>
        <div class="top">
            <img :src="logo ? logo : require('../assets/1.png') " />
           <p>欢迎使用{{schoolName}}访客系统</p>
        </div>
       <div class="input">
         手机号：<input type="text" v-model="phone" placeholder="请输入手机号" maxlength="11" />
       </div>
       <p class="tips">
         *手机号是访客唯一识别号，请输入有效的手机号*
       </p>
       <div class="btn-wrap">
         <a href="javascript:;" class="login-btn" v-on:click="login">进入访客系统</a>
       </div>
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {indexUrl,baseUrl,websocketUrl} from '../config/env'
export default {
    name: 'login',
    components: {
      loading
    },
    data() {
        return {
           showLoading:false,
           schoolName: '',
           logo: '',
           phone: ''
        }
    },

    computed: {
       
    },
    mounted(){
        this.getInfo()
    },
    methods:{
      openUrl(id){
        console.log(id)
        localStorage.setItem("courseId",id)
          this.$router.push({ path: '/detail'})
      },
      getInfo(){
        let _this = this
        this.showLoading=true;
        sessionStorage.removeItem("inited")
        axios.post(baseUrl+'/web/visit-records/logo', JSON.stringify({
            schoolId: this.$route.params.schoolId,
        }))
        .then(function (response) {
            this.showLoading=false;
            sessionStorage.setItem("inited","true")
            console.log(response);
            if(response.data.success){
              this.schoolName = response.data.detail.schoolName
              this.logo = response.data.detail.logo
          }else{
                this.$toast(response.data.description, {
                  durtaion: 200,
                  location: 'center' // 默认在中间
                });
          }
        }.bind(this))
        .catch(function (response) {
           _this.showLoading=false;
          console.log(response);
        })
      },
      
      login(){
          if(!(/^1[34578]\d{9}$/.test(this.phone))){ 
            this.$toast("手机号码有误，请重填！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return false; 
          }
          sessionStorage.setItem("phone", this.phone)
          this.$router.push({ path: '/list/' +  this.$route.params.schoolId})
      },
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  margin: 0;
  padding: 0;
}
ul,li{
  list-style:none;
}
.top{
  padding-top: 0.5rem;
  padding-bottom: 0.7rem;
}
.top img{
  width:  1rem;
  height: 1rem;
  display: block;
  margin: 0 auto;
  border-radius: 50%;
}
.top p{
  font-size: 16px;
  text-align: center;
  padding-top: .5rem;
  color: #444;
}
.input{
  height: 1rem;
  line-height: 1rem;
  font-size: 0.32rem;
  padding: 0 0.35rem;
  background: #fff;
}
.input input{
  height: 0.5rem;
  line-height: 0.5rem;
  width: 5.3rem;
  font-size: 16px;
  outline: none;
  -webkit-appearance: none;
  border-radius: 0;
  border: none;
}
.tips{
  color: #f65d5d;
  font-size: 0.24rem;
  padding: 0.1rem;
  
}
.btn-wrap{
  padding: .5rem 0;

}
.btn-wrap .login-btn{
  height: .84rem;
  width: 5rem;
  margin: 0 auto;
  display: block;
  line-height: .84rem;
  background-color: #3492e9;
  font-size: .32rem;
  color: #fff;
  text-decoration: none;
  text-align: center;
  border-radius: .84rem;

}
</style>
