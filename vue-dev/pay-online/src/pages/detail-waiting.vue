<template>
    <div>
   
        <p class="tip">
          <img src="../assets/p8.png" alt="">
          注意：请认真核对缴费对象
        </p>
        <div class="bill-content">
          <div class="content-title">
            <div>
              <img class="img1" src="../assets/p6.png" alt="">
              {{title}}
              <img class="img2" src="../assets/p6.png" alt="">
            </div>
            <span>
              {{fee}}元
            </span>
          </div>
          <p class="content-des" v-show="!!paymentExplain">
            {{paymentExplain}}
          </p>
          <p class="content-time">
            截止时间：{{endTime}}
          </p>
        </div>
        <div class="bill-obj"> 
            <p>
              <span>缴费学生</span>
              <span>{{personName}}</span>
            </p>
             <p>
              <span>证件号&nbsp;&nbsp;&nbsp;</span>
              <span>{{id}}</span>
            </p>
             <p>
              <span>所在学校</span>
              <span>{{schoolName}}</span>
            </p>
        </div>
        <div class="bill-bottom">
          <p>应缴项目<span>{{fee}}</span>元&nbsp;&nbsp;&nbsp;&nbsp;<span>(已缴{{paidFee}})</span></p>
          <p v-show="!!remark">{{remark}}</p>
        </div>
        
        <div class="pay-method">
          <p>
            <img src="../assets/p11.png" alt="">
            支付超限额，使用分批缴费
          </p>
          <div class="btn-wrap">
              <a href="javascript:;" class="btn-one" v-bind:class="{ active: payOnce}" v-on:click.stop="tapToOnce">一次性缴费</a>
              <a href="javascript:;" class="btn-many" v-bind:class="{ active: !payOnce}" v-on:click.stop="tapToMany">分批缴费</a>
          </div>
          <div class="many-method" v-show="!payOnce">
            <div>
              <a href="javascript:;" v-bind:class="{ selectMoney: payMoney==5000}" v-on:click="chooseMoney(5000)">5000</a>
              <a href="javascript:;" v-bind:class="{ selectMoney: payMoney==10000}" v-on:click="chooseMoney(10000)">10000</a>
              <a href="javascript:;" v-bind:class="{ selectMoney: payMoney==20000}" v-on:click="chooseMoney(20000)">20000</a>
            </div>
            <p>
                <input type="tel" maxlength="7" placeholder="自定义-不小于5000的整数"  v-bind:class="{ setMoney: setMoney}" v-on:focus="focus()" v-model="inputMoney" >
            </p>
          </div>
        </div>
        <div class="pay-channel"> 
          <p>支付方式</p>
            <ul>
              <li v-for="(item,index) in payChannel" v-on:click="chooseChannel(index)" v-show="item.channel==1" v-bind:class="{ select: channel==index}" :channel=item.channel>
                  <img v-if="item.channel==1" src="../assets/wechat.png" alt="">
                  <img v-if="item.channel==2" src="../assets/alipay.png" alt="">
                   {{item.name}}
              </li>
              
            </ul>
        </div>
        <div class="btn-box">
            <p class='btn-p1' :class="{'active':active}" v-on:click.stop="toggle">
              <span class="check-box"></span>
                我已查看并阅读<a href="javascript:;" v-on:click.stop="readNotice">《缴费须知》</a>
            </p>
            <a href="javascript:;" class="btn-submit" v-on:click="pay">缴费{{btnMoney}}元</a>
            <p class="btn-box-bottom">缴费前请确认学生信息，如信息有误，请联系学校老师</p>
        </div>
        <div class="notice-box" v-show="showNotice">
          <div class="notice-content">
            <div>{{notice}}</div>
            <img src="../assets/close.png" alt="" v-on:click.stop="readNotice">
          </div>
        </div>
         <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl,redirectUrlAndroid,redirectUrlIos} from '../config/env'
var urlencode = require('urlencode');
export default {
    name: 'index',
    components: {
      loading
    },
    data() {
        return {
            showLoading:false,
            active:false,
            endTime:'',
            fee:'',
            paidTime:'',
            paymentExplain:'',
            personName:'',
            remark:'',
            schoolName:'',
            title:'',
            id:'',
            paidFee:'',
            payOnce:true,
            payMoney:5000,
            inputMoney:'',
            setMoney:false,
            surplusFee:'',
            showNotice:false,
            payChannel:[],
            notice:'',
            channel:0,
            user: {}
        }
    },
    mounted(){
      var domain = document.domain;
      console.log(window.location.protocol+"//"+window.location.host)
      console.log(urlencode('http://h5pay.tf7z.com/pay-online/index.html#/index/list'));
      
      window.isBackToList=this.isBackToList;

      document.title = '在线缴费'
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
      window.isBackToList=this.isBackToList;

      var timer = setInterval(() => {
        if(this.user.uid&&this.user.token&&this.user.personId){
          this.init();
          this.getChannel();
          window.clearInterval(timer)
        }
      }, 100);
    },
    computed: {
      // 计算属性的 getter
      btnMoney: function () {
        // `this` 指向 vm 实例
        let btnText=''
        if(this.payOnce){
          btnText=this.surplusFee
        }else{
          if(this.setMoney){
            btnText=this.inputMoney
          }else{
            btnText=this.payMoney
          }
        }
        return (btnText+'').replace(/,/g, '')
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
      isBackToList(){
        window.app.isBackToList(false);
      },
      init(){
        this.showLoading=true;
        axios.post(baseUrl+'/parent/online-pay/cost-detail', JSON.stringify({
            uid: this.user.uid,
            token: this.user.token,
            personId: this.user.personId,
            costId: localStorage.getItem("recordId"),
        }))
        .then(function (response) {
            this.showLoading=false;
            console.log(response);
            if(response.data.success){
              this.endTime=response.data.detail.endTime;
              this.fee=response.data.detail.fee;
              this.paidTime=response.data.detail.paidTime;
              this.paymentExplain=response.data.detail.paymentExplain;
              this.personName=response.data.detail.personName;
              this.remark=response.data.detail.remark;
              this.schoolName=response.data.detail.schoolName;
              this.title=response.data.detail.title;
              this.id=response.data.detail.idCardNo;
              this.paidFee=response.data.detail.paidFee;
              this.surplusFee=response.data.detail.surplusFee;
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
      getChannel(){
        axios.post(baseUrl+'/parent/online-pay/channel', JSON.stringify({
            uid:this.user.uid,
            token:this.user.token,
            personId:this.user.personId,
            appIdentify: 10001,
        }))
        .then(function (response) {
            // this.showLoading=false;
            console.log(response);
            if(response.data.success){
              this.payChannel=response.data.detail.channel;
              this.notice=response.data.detail.notice;
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
      chooseChannel(type){
        console.log(type)
        this.channel=type
      },
      toggle(){
        this.active=!this.active;
      },
      tapToOnce(){
        this.payOnce=true;
        this.setMoney=false;
        this.inputMoney=this.surplusFee;
      },
      tapToMany(){
        if(this.surplusFee.replace(/,/g, '')<5000){
          this.$toast("剩余应缴金额大于5000才能使用分批缴费哦！", {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          return
        }
        this.inputMoney=''
        this.payMoney=5000;
        this.payOnce=false;
      },
      chooseMoney(money){
        this.inputMoney=''
        this.payMoney=money;
        this.setMoney=false;
      },
      focus(){
        this.payMoney=''
        this.setMoney=true;
      },
      blur(){

      },
      pay(){
        if(this.setMoney){
          if((!this.isPositiveInteger(this.inputMoney))||(this.inputMoney<=5000)){
            this.$toast("请输入大于5000的整数", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if(this.inputMoney>1000000){
            this.$toast("输入金额过大", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          this.payMoney=this.inputMoney;
        }
        
        if(!this.active){
          this.$toast("请阅读《缴费须知》", {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          return
        }

        // if(!window.app.isWXInstallAndSupport()){
        //   this.$toast("请先安装微信客户端", {
        //       durtaion: 200,
        //       location: 'center' // 默认在中间
        //   });
        //   return
        // }

         this.showLoading=true;
         axios.post(baseUrl+'/parent/online-pay/place-order', JSON.stringify({
            uid: this.user.uid,
            token: this.user.token,
            personId: this.user.personId,
            costId: localStorage.getItem("recordId"),
            money: this.btnMoney,
            channel: document.getElementsByClassName("select")[0].getAttribute("channel")
        }))
        .then(function (response) {
            this.showLoading=false;
            console.log(response);
            if(response.data.success){
               var u = navigator.userAgent;
                // 安卓
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
                if(isAndroid){
                   window.location.href=response.data.detail+"&redirect_url="+urlencode(redirectUrlAndroid)
                }else{
                    window.location.href=response.data.detail+"&redirect_url="+urlencode(redirectUrlIos)
                    
                }
             
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
      isPositiveInteger(s){//是否为正整数
         var re = /^[0-9]+$/ ;
         return re.test(s)
      },
      readNotice(){
        if(this.isiOS()){
          window.webkit.messageHandlers.goWebPageToAgreement.postMessage({"url": baseUrl + this.notice, title: "缴费须知"});
        }else{
          window.app.goWebPage(baseUrl+this.notice,"缴费须知")
        }
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
  li,ul{
    list-style: none;
  }
   .error-tip{
    padding-top: 0.35rem;
    background-color: #fff;
  }
  .error-tip>img{
    margin: 0 auto;
    display: block;
    width: 0.88rem;
    height: 0.88rem;
  }
  .error-tip>p{
  text-align: center;

  }
  .error-tip>p.tip-no{
    color: #626262;
    font-size: 0.32rem;
    padding-top: 0.25rem;

  }
  .error-tip>p.tip-no-match{
    color: #bababa;
    font-size: 0.22rem;
    padding-top: 0.2rem;
    padding-bottom: 0.25rem;
  }
  .content-title{

    display: block;
    font-size: 0.32rem;
    /*float: left;*/
    border-bottom: 1px dotted #dddddd;
   }
   .content-title>div{
      display: inline-block;
      position: relative;
      padding: 0 0.3rem;
      max-width: 5rem;
      word-break: break-all;
      font-size: 0.32rem;
      color: #626262;
      /*min-height: 0.96rem;*/
      padding: 0.35rem 0.35rem;
      box-sizing: border-box;
   }
  .content-title>div>.img1{
    position: absolute;
    width: 0.3rem;
    height: 0.22rem;
    display: block;
    left: 0;
    top: 0.47rem;
  }
   .content-title>div>.img2{
    position: absolute;
    width: 0.3rem;
    height: 0.22rem;
    display: block;
    right:  0;
    top: 0.47rem;
  }
  .bill-content{
    margin-top: 0.27rem;
    background: #fff;
    padding: 0 0.3rem;
  }
  .content-title>span{
    float: right;
    padding-top: 0.3rem;
    font-size: 0.36rem;
    color: #78cded;
  }
  .content-des{
    padding: 0.26rem 0;
    font-size: 0.26rem;
    color: #7b7b7b;
    line-height: 0.42rem;
    word-break: break-all;
    border-bottom: 1px dotted #dddddd;
  }
  .content-time{
    font-size: 0.26rem;
    color: #7b7b7b;
    height: 1.08rem;
    line-height: 1.08rem;
  }
  .bill-obj{
    margin-top: 0.26rem;
    background-color: #fff;
    padding:0.3rem 0;
  }
  .bill-obj>p{
    font-size: 0.28rem;
    padding: 0.1rem 0.3rem;
    color: #7b7b7b;
    overflow: hidden;
  }
  .bill-obj>p>span:nth-child(2){
    padding-left: 0.5rem;
  }
  .bill-obj>p:nth-child(3)>span{
    float: left;
  }
   .bill-obj>p:nth-child(3)>span:nth-child(2){
    max-width: 5rem;
    word-break: break-all;
  }
  .bill-bottom{
    margin-top: 0.26rem;
    background-color: #fff;
  }
  .bill-bottom>p{
    font-size: 0.28rem;
    color:#7b7b7b;
    padding: 0 0.3rem;
  }
   .bill-bottom>p:first-child{
    padding: 0.36rem;

   }
   .bill-bottom>p:first-child>span:nth-child(1){
    color: #78cded;
   }
    .bill-bottom>p:first-child>span:nth-child(2){
    color: #afafaf;
   }
   .bill-bottom>p:last-child{
    padding: 0.4rem 0.3rem;
    word-break: break-all;
    padding-top: 0;
   }
  .tip{
    font-size: 0.28rem;
    color: #ffa25e;
    height: 0.8rem;
    line-height: 0.8rem;
    position: relative;
    background-color: #fff;
    padding-left: 0.8rem;
  }
  .tip>img{
    width: 0.36rem;
    height: 0.36rem;
    display: block;
    position: absolute;
    left: 0.22rem;
    top: 50%;
    margin-top: -0.18rem;
  }
  .btn-box{
    padding: 0.96rem 0.3rem ;
    padding-top: 0;
  }
  .btn-box>p{
    font-size: 0.22rem;
    color: #7b7b7b;

  }
  .btn-p1{
    height: 0.32rem;
    line-height: 0.32rem;
    position: relative;
    padding-left: 0.3rem;
    box-sizing: border-box;
    margin-left: 0.15rem;
    width: 6rem;
  }
  .btn-box>p>a{
    font-size: 0.22rem;
    color: #7b7b7b;
    text-decoration: none;
    color: #46a8d2;
  }
  .btn-submit{
    display: block;
    width: 6.6rem;
    height: 0.88rem;
    color: #fff;
    text-align:center;
    line-height: 0.88rem;
    font-size: 0.3rem;
    background: #4fc2f3;
    text-decoration: none;
    border-radius: 0.1rem;
    margin: 0.2rem auto;
  }
   .btn-box .btn-box-bottom{
    color: #afafaf;
    text-align: center;
  }
  .check-box{
    width: 0.24rem;
    height: 0.24rem;
    display: block;
    background-image: url(../assets/p9.png);
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -0.12rem;

  }
  .btn-box> .active .check-box{
    background-image: url(../assets/p10.png);
  }
  .pay-method{
    padding: 0.5rem 0.0rem;
  }
  .pay-method>p{
    font-size:0.24rem;
    color: #afafaf;
    position: relative;
    box-sizing: border-box;
    padding-left: 0.9rem;
    height: 0.36rem;
    line-height: 0.36rem;
  }
  .pay-method>p>img{
    width: 0.36rem;
    height: 0.36rem;
    display: block;
    position: absolute;
    left: 0.4rem;
  }
  .btn-wrap>a{
    width: 3.0rem;
    height: 0.9rem;
    display: inline-block;
    font-size: 0.32rem;
    color: #626262;
    text-align: center;
    line-height: 0.9rem;
    text-decoration: none;
    background: #fff;
    border-radius: 0.04rem;
    box-sizing: border-box;
    border: 1px solid #fff;
  }
  .btn-wrap>a.active{
    border: 1px solid #53b6e0;
    background-image: url(../assets/p12.png);
    background-repeat: no-repeat;
    background-position: 100% 100%;
    background-size: 0.44rem 0.44rem;
    color: #53b6e0;
  }
  .btn-wrap{
    overflow: hidden;
    margin-top: 0.16rem;
    padding: 0 0.38rem;
  }
  .btn-one{
    float: left;
  }
  .btn-many{
    float: right;
  }
  .many-method{
    margin-top: 0.35rem;
    background: #fff;
    /*padding: 0 0.4rem;*/
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;

  }
 .many-method>div{
    /*font-size:0;*/
    /*letter-spaceing:-4px;*/
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 6.6rem;
    margin: 0 auto;
 }
  .many-method>div>a{
    width: 2.0rem;
    height: 0.9rem;
    line-height: 0.9rem;
    text-align: center;
    font-size: 0.32rem;
    color: #626262;
    display: inline-block;
    text-decoration: none;
    border: 1px solid #e7e7e7;
    border-radius: 0.04rem;
  }
 .many-method>p{
  margin-top: 0.3rem;
 }
  .many-method>p>input{
    margin:0;
    padding: 0;
    width: 6.6rem;
    height: 0.9rem;
    line-height: 0.9rem;
    outline: none;
    background:none;    
    border:1px solid #e7e7e7;
    font-size: 0.32rem;
    color: #626262;
    text-align: center;
    margin: 0 auto;
    display: block;
    -webkit-appearance: none;

  }
  .many-method>p>input::-webkit-input-placeholder {
    font-size: 0.32rem;
    color: #afafaf;
    text-align: center;
  }
  .selectMoney{
    border: 1px solid #53b6e0!important;
  }
  .setMoney{
     border: 1px solid #53b6e0!important;
  }
  .notice-box{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.4);
  
  }
  .notice-content{
    width: 6.8rem;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -4rem;
    margin-left: -3.4rem;
  }
  .notice-content>div{
    height: 60vh;
    width: 100%;
    border-radius: 0.1rem;
    background: #fff;
    font-size: 0.24rem;
    flood-color: #626262;
    padding: 0.2rem;
    box-sizing: border-box;
    word-break: break-all;
    overflow-y:scroll;
    /*padding-bottom: 0;*/
  }

  .notice-content>img{
      width: 0.8rem;
      height: 0.8rem;
      margin: 0 auto;
      display: block;
      margin-top: 0.5rem;
  }
  .pay-channel>p{
      font-size: 0.26rem;
      color: #afafaf;
      padding-left: 0.38rem;
  }
  .pay-channel ul {
    margin: 0.3rem 0;

  }
  .pay-channel ul li{
    /*display: flex;*/
     display: flex;
     align-items: center;
     font-size:0.26rem;
     padding:0.15rem 0.35rem;
     background: #fff;

  }
    .pay-channel ul li>img{
      height: 0.54rem;
      width: 0.54rem;
      display: block;
      margin-right: 0.2rem;
    }
    .pay-channel ul li{
      background-image: url(../assets/bg10.png);
      background-repeat: no-repeat;
      background-position: 95% 50%;
      background-size: 0.26rem 0.26rem;
    }
    .pay-channel ul .select{
      background-image: url(../assets/bg11.png);
      background-repeat: no-repeat;
      background-position: 95% 50%;
      background-size: 0.26rem 0.26rem;
    }
</style>
