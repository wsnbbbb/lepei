<template>
    <div>
        <div class="card-list" :key="index" v-for="(item, index) in cardList">
          <div class="card-box">
              <div class="card-main" v-bind:class="{ lose: item.icCardStatus!=1}">
                <img src="../assets/logo.png"  alt="">
                <div class="card-info">
                  <p class="info-name">{{item.name}}</p>
                  <p class="info-school-name">{{item.schoolName}}</p>
                  <a href="javascript:;" class="jiebang-btn" v-on:click="unbind(item.id)">解绑</a>
                </div>
                <p class="card-number">NO.{{item.icCardNo}}</p>
              </div>
          </div>
          <ul class="item-ul" v-show="item.cardSystemType!=1" >
            <li class="item-li" v-on:click="toCharge(item.icPayOnSchool, item.id, item.icCardNo, item.name)">
              <img class="li-icon" src="../assets/charge@2x.png" alt="">
              <span class="li-left">充值</span>
              <span class="li-right">立即进入</span>
            </li>
            <li class="item-li" v-on:click="toList(item.icPayOnSchool, item.id, item.icCardNo, item.name)">
              <img class="li-icon" src="../assets/cusume@2x.png" alt="">
              <span class="li-left">消费记录</span>
              <span class="li-right">立即进入</span>
            </li>
          </ul>
        </div>
        <div class="btn-box" v-bind:class="{ middle: cardList.length==0}">
          <a href="javascript:;" class="bind-btn" v-show="showBind"  v-on:click="addCard">添加一卡通</a>
        </div>
        <!-- <span>
          {{url}}
        </span> -->
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
const md5 = require('js-md5');
import axios from 'axios'
import {indexUrl,baseUrl,user} from '../config/env'

import {getQueryString } from '../config/mUtils'

import { constants } from 'fs';
import { delimiter } from 'path';
import { debug, debuglog } from 'util';
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
           list: [],
           show: false,
           active: 0,
           cardList: [],
           uid: '1',
           url: '',
           showBind: false
        }
    },
    mounted(){
      console.log(this.$route.params.schoolId)
      console.log(this.$route.query.code)
      if(sessionStorage.getItem("code")==this.GetQueryString("code")){
          this.getCardList(sessionStorage.getItem("openId"))
      }else{
          this.getBaseInfo(this.GetQueryString("code"), this.$route.params.schoolId);
      }
    },
    computed:{
      
    },
    methods:{
      GetQueryString (name) {
        let url = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
        let newUrl = window.location.search.substr(1).match(url)
        if (newUrl != null) {
          return unescape(newUrl[2])
        } else {
          return false
        }
      },
      //解绑
      unbind(id){
        let _this = this
        this.$confirm("确定解除已绑定的一卡通？").then(
            function(){
                _this.unbindAction(id)
            }).catch(
                function(){
                console.log("no");
            }
        )
      },
      unbindAction(id){
        let _this = this
        this.showLoading=true;
        let schoolId = this.$route.params.schoolId
        let uid = sessionStorage.getItem("openId")
        axios.post(baseUrl+'/wechat/account/unbind', JSON.stringify({
           uid: uid,
           schoolId: schoolId,
           personId: id,
           sign: md5(`personId=${id}&schoolId=${schoolId}&uid=${uid}`).toUpperCase(),
        }))
        .then(function (response) {
            _this.showLoading=false;
            console.log(response);
            if(response.data.success){
              _this.$toast("操作成功", {
                durtaion: 200,
                location: 'center' // 默认在中间
              });
              let id = sessionStorage.getItem("openId")
              _this.getCardList(id)
            }else{
              _this.$toast(response.data.description, {
                durtaion: 200,
                location: 'center' // 默认在中间
              });
            }
        }.bind(this))
        .catch(function (response) {
          _this.$toast("response.data.description", {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          console.log(response);
        });
      },
      addCard(){
        let schoolId = this.$route.params.schoolId
        let uid = this.uid
        this.$router.push({ path: '/add-card/' + schoolId + '/?uid=' + this.uid})
      },
      toCharge(status, id, icCardNo, name){
        if(status==1){
          sessionStorage.setItem("name", name)
          let schoolId = this.$route.params.schoolId
          this.$router.push({ path: `/charge?schoolId=${schoolId}&personId=${id}&No=${icCardNo}`})
        }else{
          this.$alert({
            title: '提示',
            content: '充值功能暂时关闭，详询 028-62607709'
          })
        }
      },

      toList(status, id, icCardNo, name){
        sessionStorage.setItem("name", name)
        let schoolId = this.$route.params.schoolId
        this.$router.push({ path: `/list?schoolId=${schoolId}&personId=${id}&No=${icCardNo}&status=${status}`})
      },

      getBaseInfo(code, schoolId){
        let _this = this
        this.showLoading=true;
        // let code = this.GetQueryString("code")
        axios.post(baseUrl+'/base-info/get', JSON.stringify({
           code: code,
           schoolId: this.$route.params.schoolId,
           sign: md5(`code=${code}&schoolId=${schoolId}`).toUpperCase()
        }))
        .then(function (response) {
            _this.showLoading=false;
            console.log(response);
            if(response.data.success){
                // _this.$toast(response.data.detail.openId, {
                //     durtaion: 200,
                //     location: 'center' // 默认在中间
                // });
                sessionStorage.setItem("code", this.GetQueryString("code"))
                sessionStorage.setItem("openId", response.data.detail.openId)
                _this.getCardList(sessionStorage.getItem("openId"))
            }else{
                _this.$toast(response.data.description, {
                    durtaion: 200,
                    location: 'center' // 默认在中间
                });
          }
        }.bind(this))
        .catch(function (response) {
          _this.showLoading=false;
          _this.$toast("response.data.description", {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          console.log(response);
        });
      },
      
      getCardList(uid){
        let _this = this
        this.showLoading=true;
        let schoolId = this.$route.params.schoolId
        axios.post(baseUrl+'/wechat/account/persons', JSON.stringify({
           uid: uid,
           schoolId: schoolId,
           sign: md5(`schoolId=${schoolId}&uid=${uid}`).toUpperCase()
        }))
        .then(function (response) {
            _this.showBind = true
            this.showLoading=false;
            console.log(response);
            if(response.data.success){
              this.cardList = response.data.detail
            }else{
                this.$toast(response.data.description, {
                  durtaion: 200,
                  location: 'center' // 默认在中间
                });
            }
        }.bind(this))
        .catch(function (response) {
          console.log(response);
        });
      },
   

    },

 

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
    margin-top: .3rem;
  }
  .card-box>.lose{
    background: url(../assets/bg_2.png);
    background-repeat: no-repeat;
    background-size: 100%;
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
  }
  .item-li:first-child{
    border-top: 1px solid #eee;
  }
  .item-li{
    height: 1.05rem;
    line-height: 1.05rem;
    position: relative;
    border-bottom: 1px solid #eee;
    font-size: .32rem;
    color: #626262;
    padding-left: .9rem;
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
    padding: .5rem 0;
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
  .middle{
    margin-top: 5rem;
  }
</style>
