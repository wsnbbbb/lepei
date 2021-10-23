<template>
    <div>
      <div class="card-input">
       <ul class="item-ul">
         <li class="item-li">
           <img class="li-icon" src="../assets/phone.png" alt="">
           <input type="text" v-model="cardNo" placeholder="请输入卡号">
         </li>
         <li class="item-li">
           <img class="li-icon" src="../assets/password.png" alt="">
            <input type="text" v-model="activeCode" placeholder="请输入校验码">
         </li>
       </ul>
      </div>
      <p class="tips">如有问题请致电乐陪客服 028-62607709</p>
      <div class="btn-box">
        <a href="javascript:;" class="bind-btn" v-on:click="getCardInfo">下一步</a>
      </div>
      <div v-show="showMask" class="float-mask" v-on:click="close">
          <div class="float-mask-box" v-on:click.stop="stop">
            <div class="float-logo-box">
              <img src="../assets/logo1.png" alt="">
            </div>
            <ul class="item-ul">
              <li class="item-li">
                <img class="li-icon" src="../assets/icon-1.png" alt="">学校
                <span class="li-right">{{schoolName}}</span>
              </li>
              <li class="item-li">
                <img class="li-icon" src="../assets/icon-2.png" alt="">姓名
                <span class="li-right">{{name}}</span>
              </li>
              <li class="item-li">
                <img class="li-icon" src="../assets/icon-3.png" alt="">班级
                <span class="li-right">{{classesName}}</span>
              </li>
            </ul>
            <div class="btn-box">
              <a href="javascript:;" class="btn-a" v-on:click="bindCard">确定</a>
            </div>
          </div>
      </div>
       <loading v-show="showLoading"></loading>
    </div>
</template>
<script>

const md5 = require('js-md5');
import loading from '../components/loading'
import axios from 'axios'
import {indexUrl,baseUrl,user} from '../config/env'
export default {
    name: 'index',
    components: {
      loading
    },
    data() {
        return {
           showLoading:false,
           name:'',
           id:'',
           list:[],
           show:false,
           active:0,
           showMask: false,
           cardNo: "",
           activeCode: "",
           gradeName: "",
           classesName: "",
           schoolName: ""
        }
    },
    mounted(){
      // this.init();
      console.log(this.$route.params.schoolId)
      console.log(this.$route.query.uid)
    },
    computed:{
      showNoData: function () {
        // `this` 指向 vm 实例
        var flag=true;
        if(this.active==0){
            for(var i=0;i<this.list.length;i++){
              if(this.list[i].status==0){
                flag=false
              }
            }
        }else if(this.active==1){
            for(var i=0;i<this.list.length;i++){
              if(this.list[i].status==1){
                flag=false
              }
            }
        }else{
            for(var i=0;i<this.list.length;i++){
              if(this.list[i].status==-1){
                flag=false
              }
            }
        }
        return flag
      }
    },
    methods:{
      stop(){
        // this.showMask = false;
      },
      close(){
        this.showMask = false;
      },
 
      getCardInfo(){
        let _this = this
        let schoolId = this.$route.params.schoolId
        let uid = sessionStorage.getItem("openId")
        if(!this.cardNo||!this.activeCode){
          this.$toast("请输入完整", {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          return
        }
        if(this.cardNo.indexOf(" ")>=0||this.activeCode.indexOf(" ")>=0){
          this.$toast("输入内容中包含空格，请重新输入", {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          return
        }
        this.showLoading=true;
        axios.post(baseUrl+'/wechat/account/card-info', JSON.stringify({
           uid: uid,
           schoolId: schoolId,
           cardNo: this.cardNo,
           activeCode: this.activeCode,
           sign: md5(`activeCode=${this.activeCode}&cardNo=${this.cardNo}&schoolId=${schoolId}&uid=${uid}`).toUpperCase()
        }))
        .then(function (response) {
            this.showLoading=false;
            console.log(response);
            if(response.data.success){
              this.showMask = true;
              this.name = response.data.detail.name
              this.gradeName = response.data.detail.gradeName
              this.classesName = response.data.detail.classesName
              this.schoolName = response.data.detail.schoolName
            }else{
              this.$toast(response.data.description, {
                durtaion: 200,
                location: 'center' // 默认在中间
              });
            }
        }.bind(this))
        .catch(function (response) {
          _this.showLoading=false;
          _this.$toast("网络错误！", {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          console.log(response);
        });
      },

      bindCard(){
        let _this = this
        let schoolId = this.$route.params.schoolId
        let uid = sessionStorage.getItem("openId")
        this.showLoading = true;
        axios.post(baseUrl+'/wechat/account/bind', JSON.stringify({
           uid: uid,
           schoolId: schoolId,
           cardNo: this.cardNo,
           activeCode: this.activeCode,
           sign: md5(`activeCode=${this.activeCode}&cardNo=${this.cardNo}&schoolId=${schoolId}&uid=${uid}`).toUpperCase()
        }))
        .then(function (response) {
            this.showLoading=false;
            console.log(response);
            if(response.data.success){
                this.showMask = false;
                this.$alert({
                  title: '提示',
                  content: '绑定成功！'
                }).then(
                    function(){
                        window.history.go(-1)
                    }).catch(
                        function(){
                            console.log("no");
                        }
                )
            }else{
                this.$toast(response.data.description, {
                  durtaion: 200,
                  location: 'center' // 默认在中间
                });
            }
        }.bind(this))
        .catch(function (response) {
          _this.showLoading=false;
          _this.$toast("网络错误！", {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          console.log(response);
        });
      }

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
  .card-box{
    padding-top: 0.4rem;
    padding-bottom: .5rem;
    background: #fff;
  }
  .card-box>.card-main{
    width: 6.14rem;
    height: 3.26rem;
    margin: 0 auto;
    display: block;
    background: url(../assets/bg_1.png);
    background-repeat: no-repeat;
    background-size: 100%;
    position: relative;
  }
   .card-box>.card-main>img{
    width: 1.5rem;
    height: 1.28rem;
    display: block;
    position: absolute;
    left: .2rem;
    top: .2rem;
  }
  .card-info{
    position: absolute;
    right: .28rem;
    top: .5rem;
    height: 2rem;
  }
  .card-info>.info-name{
    font-size: .32rem;
    color: #fff;
    text-align: right;
  }
  .info-school-name{
    font-size: .28rem;
    color: #fff;
    padding-top: .16rem;
  }
  .jiebang-btn{
    display: block;
    width: 1rem;
    height: .4rem;
    border-radius: 1rem;
    font-size: .22rem;
    text-decoration: none;
    color: #3492e9;
    background-color: #fff;
    text-align: center;
    line-height: .4rem;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .card-number{
    position: absolute;
    color: #fff;
    font-size: .22rem;
    left: .3rem;
    bottom: .25rem;
  }
  .item-ul{
    padding: 0 .2rem;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: .1rem;
  }
  .item-li{
    height: .85rem;
    line-height: .85rem;
    position: relative;
    font-size: .32rem;
    color: #626262;
    padding-left: .9rem;
  }
   .item-li>input{
    border-top: none;
    height: .52rem;
    outline: none;
    appearance: none;
    border: 0;
    width: 5rem;
    font-size: .28rem;
  }
  .li-icon{
    width: .4rem;
    height: .4rem;
    display: block;
    position: absolute;
    left: .15rem;
    top: 50%;
    margin-top: -.2rem;
  }
  .li-right{
    float: right;
    padding-right: .18rem;
    font-size: .24rem;
    color: #a8a8a8;
  }
  .btn-box{
    padding: .8rem 0;
  }
  .bind-btn{
    width: 6rem;
    height: .8rem;
    display: block;
    margin: 0 auto;
    font-size: .32rem;
    color: #fff;
    background-color: #009bff;
    line-height: .8rem;
    text-align: center;
    text-decoration: none;
    border-radius: .1rem;
  }
  .card-input{
    padding: .2rem .3rem;
  }
  .tips{
    font-size: .28rem;
    color: #bababa;
    padding-left: .3rem;
    text-indent: 1em;
    
  }
  .float-mask{
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.4);

  }
  .float-mask>.item-ul{
    /* margin-top: 1rem; */
  }
  .float-logo-box{
    padding: .4rem 0rem;
    border-bottom: 1px solid #f5f5f5;
  }
  .float-logo-box>img{
    width: 1.18rem;
    height: 1.18rem;
    display: block;
    margin: 0 auto;

  }
  .float-mask-box{
    width: 6.5rem;
    margin: 0 auto;
    margin-top: 1rem;
    background: #fff;
    border-radius: .1rem;
    padding: 0 0.2rem;
    box-sizing: border-box;
  }
  .float-mask-box>.item-ul{
    padding: 0;
  }
  .float-mask-box .item-li{
    padding-left: 0.75rem;
  }
  .float-mask .btn-a{
    width: 6rem;
    height: .8rem;
    display: block;
    margin: 0 auto;
    font-size: .32rem;
    color: #fff;
    background-color: #009bff;
    line-height: .8rem;
    text-align: center;
    text-decoration: none;
    border-radius: .1rem;
  }
</style>
