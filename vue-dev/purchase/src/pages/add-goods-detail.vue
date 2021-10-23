<template>
    <div class="list-wrap">
       <div class="list-item ti0">
          品名
          <input type="text" v-model="propertyName" readonly="readonly">
       </div>
         <div class="list-item ti0">
          请购数量
        <input type="number" v-model="applyNum" readonly="readonly">
       </div>
        <div class="list-item ti0">
          规格
          <input type="text" v-model="specification" readonly="readonly">
       </div>
       <div class="list-item1 mb20 ti0">
          用途
          <p>{{this.usage}}</p>
       </div>

       <div class="list-item ti0">
          单位
          <input type="text"  v-model="propertyUnit" readonly="readonly">
       </div>
         <div class="list-item ti0">
          单价
          <input type="number"  v-model="price" readonly="readonly">
       </div>
        <div class="list-item ti0">
          预算费用
          <input type="text"   v-model="totalMoney" readonly="readonly">
       </div>
       <div class="list-item1 ti0">
          时间要求
          <!-- <input type="text"  v-model="timeRequest" readonly="readonly"> -->
          <p>{{this.timeRequest}}</p>
          </div>
       <div class="list-item1 ti0">
          备注
          <!-- <input type="text" v-model="remark" readonly="readonly"> -->
          <p v-model="remark"> {{this.remark}}</p>
       </div>
    
      <section class="btn-box">
        <a href="javascript:;" v-on:click="comfirm">确定</a>
      </section>
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl} from '../config/env'
export default {
    name: 'add-goods-detail',
    components: {
      loading
    },
    data() {
        return {
            showLoading:false,
            propertyName:this.$route.params.list.propertyName,
            applyNum:this.$route.params.list.applyNum,
            propertyUnit:this.$route.params.list.propertyUnit,
            specification:this.$route.params.list.specification,
            usage:this.$route.params.list.applyUse,
            propertyUnit:this.$route.params.list.propertyUnit,
            price:this.$route.params.list.price.toFixed(2),
            timeRequest:this.$route.params.list.timeRequest,
            remark:this.$route.params.list.remark,
            user: {}
        }
    },
    computed: {
      totalMoney: function(){
            return (parseFloat(this.applyNum)*parseFloat(this.price)).toFixed(2); 
        }
        
      },
    mounted(){
        window.postCurrentCardId=this.postCurrentCardId;
        window.postBaseInfo=this.postBaseInfo;
        if(this.isiOS()){
          window.webkit.messageHandlers.getBaseInfo.postMessage(null);
          window.webkit.messageHandlers.getCurrentCardId.postMessage(null);
        }else{
          this.user.uid = JSON.parse(window.app.publicParameters())["uid"]
          this.user.token = JSON.parse(window.app.publicParameters())["token"]
          this.user.personId = window.app.getCurrentCardId()
        }
        if(this.isiOS()){
            window.webkit.messageHandlers.showRightToolBar.postMessage(false);
        }else{
            window.app.showRightToolBar(false);
        }

    },
    methods:{
      isiOS(){
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //如果输出结果是true就判定是android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //根据输出结果true或者false来判断ios终端
        if(isAndroid){
          return false
        }else if(isiOS){
          return true
        }
      },
      postBaseInfo(result){       
        this.user.uid = JSON.parse(result)["uid"]
        this.user.token = JSON.parse(result)["token"]
      },
      postCurrentCardId(result){
        this.user.personId = result
      },
      comfirm(){
        window.history.go(-1);
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
margin:0;
padding: 0;
}
input, button, select, textarea {
outline: none;
-webkit-appearance: none;
border-radius: 0;
}
   li{
    list-style:none;
   }
.list-item{
  position: relative;
  font-size: 0.32rem;
  padding-left: 0.35rem;
  height: 0.9rem;
  line-height: 0.9rem;
  text-indent: 2em;
  background-color: #fff;
  color: #626263;
  border-bottom: 1px solid #f5f5f9;
}
.list-item>img{
  position: absolute;
  width: 0.34rem;
  height: 0.34rem;
  left: 0.35rem;
  top:50%;
  margin-top: -0.17rem;
}
.list-item>input{
  position: absolute;
  right: 0.4rem;
  top:50%;
  height: 0.4rem;
  margin-top: -0.2rem;
  border:none;
  text-align: left;
  width: 2.6rem;
  color: #7b7b7b;
  font-size: 0.28rem;
}
.mb20{
  margin-bottom: 0.2rem;
}
.ti0{
  text-indent: 0;
}
.bottom-color{
  background: #f5f5f9;
}
.btn-box a{
  width: 6.6rem;
  height: 0.9rem;
  line-height: 0.9rem;
  text-align: center;
  color: #fff;
  text-decoration: none;
  font-size: 0.32rem;
  background-color: #4fc2f3;
  display: block;
  border-radius: 0.08rem;
  margin: 2rem auto;
}
.list-item1{
  font-size: 0.32rem;
  height: auto;
  overflow: hidden;
  padding-left: 0.35rem;
  position: relative;
  padding: 0.25rem;
  color: #626263;
  padding-right: 0.36rem;
  padding-left: 0.35rem;
  background-color: #fff;
  border-bottom: 1px solid #f5f5f9;
}
.list-item1>p {
    width: 2.6rem;
    float: right;
    height: auto;  
    word-wrap:break-word;  
    word-break:break-all;  
    overflow: hidden; 
    font-size: 0.28rem;
    color: #7b7b7b;
}
</style>
