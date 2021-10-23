<template>
    <div>
        <div class="pay-money">
          <span>&yen;{{money}}</span>
        </div>
        <div class="pay-channel"> 
          <p>支付方式</p>
            <ul>
                <li v-for="(item,index) in payChannel" v-on:click="chooseChannel(index,item.channel)" v-bind:class="{ select: channel==index}" :channel=item.channel>
                    <img v-if="item.channel==1" src="../assets/wechat.png" alt="">
                    <img v-if="item.channel==2" src="../assets/alipay.png" alt="">
                     {{item.name}}
                </li>
            </ul>
        </div>
        <div class="btn-box">
            <a href="javascript:;" class="btn-submit" v-on:click="pay">确认支付&nbsp;&nbsp;&yen;{{toDecimal2(parseFloat(money)+parseFloat(payFee))}}</a>
        </div>
        <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl,redirectUrlIos,redirectUrlAndroid, alipayStr, redirectUrlIosForAlipay} from '../config/env'
var urlencode = require('urlencode');
export default {
    name: 'index',
    components: {
      loading
    },
    data() {
        return {
            showLoading:false,
            payChannel:[],
            channel:0,
            money:0,
            selectChannel:0,
            orderNo:0,
            notice:'',
            title:'',
            chargeAgreementUrl:'',
            errorMsg:'',
            makeOrder:true,
            user: {}
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
      
      document.title= '支付'
      var domain = document.domain;
      console.log(window.location.protocol+"//"+window.location.host)
      this.money=this.toDecimal2(this.$route.params.money)
      window.isCloseWebview=this.isCloseWebview;

      var timer = setInterval(() => {
        if(this.user.uid&&this.user.token&&this.user.personId){
          this.getChannel();
          window.clearInterval(timer)
        }
      }, 100);
    },
    computed: {
      payFee(){
            var payfee=0;
            for(var i=0;i<this.payChannel.length;i++){
              if(this.payChannel[i].channel==this.selectChannel){
                payfee=this.payChannel[i].feePercentage*this.money*0.01
                if(payfee>=this.payChannel[i].feeMax) {
                    payfee=this.payChannel[i].feeMax
                }else if(payfee<this.payChannel[i].feeMin){
                    payfee=this.payChannel[i].feeMin
                }
              }
            }
            return this.toDecimal2(payfee)
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
      isCloseWebview(){
        return "yes"
      },
      postBaseInfo(result){       
        this.user.uid = JSON.parse(result)["uid"]
        this.user.token = JSON.parse(result)["token"]
      },
      postCurrentCardId(result){
        this.user.personId = result
      },
      getChannel(){
        this.showLoading=true;
        axios.post(baseUrl+'/common/common/pay-channel', JSON.stringify({
            uid: this.user.uid,
            token: this.user.token,
            personId: this.user.personId,
            type: 4,
        }))
        .then(function (response) {
            this.showLoading=false;
            console.log(response);
            if(response.data.success){
              this.payChannel=response.data.detail.channel;
              this.notice=response.data.detail.notice;
              this.title=response.data.detail.protocol.title;
              this.chargeAgreementUrl=response.data.detail.protocol.url;
              this.selectChannel=response.data.detail.channel[0].channel;
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
      chooseChannel(type,channel){
        console.log(type)
        this.channel=type
        this.selectChannel=channel
      },
      pay(){
        if(!this.makeOrder){
           this.$toast(this.errorMsg, {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          return
        }

        // if(this.orderNo==0){
        //    this.$toast("网络不给力，请稍后重试！", {
        //       durtaion: 200,
        //       location: 'center' // 默认在中间
        //   });
        //   return
        // }
        // if(this.selectChannel==1){
        //     if(!window.app.isWXInstallAndSupport()){
        //     this.$toast("请先安装微信客户端", {
        //         durtaion: 200,
        //         location: 'center' // 默认在中间
        //     });
        //     return
        //   }
        // }
        
        this.showLoading=true;

        var return_url=""
        var u = navigator.userAgent;
        // 安卓
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        if(isAndroid){
            return_url = redirectUrlAndroid + "/charge"
        }else{
            return_url = redirectUrlIosForAlipay
        }

        axios.post(baseUrl+'/parent/trust/pay', JSON.stringify({
            uid: this.user.uid,
            token: this.user.token,
            orderNo: this.$route.params.orderNo,
            channel: this.selectChannel,
            returnUrl: return_url
        }))
          .then(function (response) {
              this.showLoading=false;
              console.log(response);
              if(response.data.success){
                  var u = navigator.userAgent;
                  // 安卓
                  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
                  if(isAndroid){
                     if(this.selectChannel==1){
                        window.location.href=response.data.detail.orderInfo+"&redirect_url="+urlencode(redirectUrlAndroid)+"/charge"
                    }else{
                        window.location.href=alipayStr + response.data.detail.orderInfo
                    }
                  }else{
                      window.webkit.messageHandlers.delayCloseWeb.postMessage(null);
                      setTimeout(() => {
                          if(this.selectChannel==1){
                            window.location.href=response.data.detail.orderInfo+"&redirect_url="+urlencode(redirectUrlIos)
                          }else{
                            window.location.href=alipayStr + response.data.detail.orderInfo
                          }
                      }, 500);
                      
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
       //制保留2位小数，如：2，会在2后面补上00.即2.00 
      toDecimal2(x) { 
       var f = parseFloat(x); 
       if (isNaN(f)) { 
        return false; 
       } 
       var f = Math.round(x*100)/100; 
       var s = f.toString(); 
       var rs = s.indexOf('.'); 
       if (rs < 0) { 
        rs = s.length; 
        s += '.'; 
       } 
       while (s.length <= rs + 2) { 
        s += '0'; 
       } 
       return s; 
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
  .btn-box{
    padding: 0.96rem 0.3rem ;
    padding-top: 0;
    margin-top: 2rem;
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
    background: #3492e9;
    text-decoration: none;
    border-radius: 0.1rem;
    margin: 0.2rem auto;
  }


  .pay-channel>p{
      font-size: 0.26rem;
      color: #060606;
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
      /*background-image: url(../assets/bg12.png);*/
      background-repeat: no-repeat;
      background-position: 95% 50%;
      background-size: 0.26rem 0.26rem;
      margin-bottom: 1px;
    }
    .pay-channel ul .select{
      background-image: url(../assets/bg12.png);
      background-repeat: no-repeat;
      background-position: 95% 50%;
      background-size: 0.26rem 0.26rem;
    }
    .title{
      font-size: 0.26rem;
      height: 0.7rem;
      line-height: 0.7rem;
      padding:0 0.38rem;
    }
    .order-money{
      font-size: 0.24rem;
      height: 0.76rem;
      line-height: 0.76rem;
      padding: 0 0.38rem;
      background: #fff;
      color: #313131;
    }
   .order-money:first-child{
    margin-bottom: 1px;
   }
  .order-money>span{
    float: right;
    color: #8e8e93;
  }
  .charge-tip{
    font-size: 0.22rem;
    color: #818181;
    padding: 0.38rem;
  }
  .btn-box-bottom>a{
    color: #4c9eea!important;
  }
  .warm-tip{
    padding: 0.2rem 0.77rem;
    text-align: center;
    color: #979799;
  }
  .warm-tip .call{
    color: #4098e9!important;
  }
  .pay-money{
    padding: 1.3rem 0;
    text-align: center;
    font-size: .8rem;
    color: #626264;
  }
</style>
