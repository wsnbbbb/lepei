<template>
    <div>
        <p class="title">订单信息</p>
        <div class="order-info">
          <div class="order-money">
            充值金额 <span>&yen;{{money}}</span>
          </div>
          <div class="order-money">
            手续费 <span>&yen;{{payFee}}</span>
          </div>
        </div>
        <p class="charge-tip">
          {{notice}}
        </p>
        <div class="pay-channel"> 
          <p>支付方式</p>
            <ul>
                <li>
                    <img src="../assets/wechat.png" alt="">
                    <!-- <img v-if="item.channel==2" src="../assets/alipay.png" alt=""> -->
                     微信
                </li>
            </ul>
        </div>
        <div class="btn-box">
            <p class="warm-tip">
              您的充值金额预计1小时内到帐，如遇特殊情况未到帐，请拨打<a href="javascript:;" class="call" > 028-62607709</a>
            </p>
            <a href="javascript:;" class="btn-submit" v-on:click="pay">确认支付&nbsp;&nbsp;&yen;{{toDecimal2(parseFloat(money)+parseFloat(payFee))}}</a>
            <p class="btn-box-bottom">点击支付即表示已阅读并同意<a href="javascript:;" v-on:click.stop="toAgreement">《{{title}}》</a></p>
        </div>
        <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import wx from "weixin-js-sdk";
const md5 = require('js-md5');
import {baseUrl,user,redirectUrlIos,redirectUrlAndroid, alipayStr, redirectUrlIosForAlipay} from '../config/env'
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
            makeOrder:true
        }
    },
    mounted(){
      var domain = document.domain;
      console.log(window.location.protocol+"//"+window.location.host)
      this.getChannel();
      this.money=this.toDecimal2(this.$route.params.money)

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

      wexinPay(data, cb, errorCb) {
        let _this = this
        //获取后台传入的数据
        let appId = data.appId;
        let timestamp = data.timestamp;
        let nonceStr = data.nonceStr;
        let signature = data.signature;
        let packages = data.package;
        let paySign = data.paySign;
        let signType = data.signType;
        console.log('发起微信支付')
        //下面要发起微信支付了
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature, // 必填，签名，见附录1
            jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
            wx.chooseWXPay({
                timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
                package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: paySign, // 支付签名
                success: function (res) {
                    // 支付成功后的回调函数
                    cb(res);
                },
                fail: function (res) {
                    //失败回调函数
                    errorCb(res);
                }
            });
        });
        wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            /*alert("config信息验证失败");*/
        });
      },
    
      getChannel(){
        let uid = sessionStorage.getItem("openId")
        let schoolId = this.$route.query.schoolId
        let personId = this.$route.query.personId
        this.showLoading=true;
        axios.post(baseUrl+'/wechat/card/pay-channel', JSON.stringify({
            uid: uid,
            schoolId: schoolId,
            personId: personId,
            sign: md5(`personId=${personId}&schoolId=${schoolId}&uid=${uid}`).toUpperCase()
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
      toAgreement(){
        window.location.href = this.chargeAgreementUrl;
      },
      pay(){
        let _this = this
        this.showLoading = true;
        let uid = sessionStorage.getItem("openId")
        let schoolId = this.$route.query.schoolId
        let personId = this.$route.query.personId
        let orderNo = this.$route.params.orderNo
        axios.post(baseUrl+'/wechat/card/channel', JSON.stringify({
            uid: uid,
            schoolId: schoolId,
            personId: personId,
            orderNo: orderNo,
            sign: md5(`orderNo=${orderNo}&personId=${personId}&schoolId=${schoolId}&uid=${uid}`).toUpperCase()
        }))
          .then(function (response) {
              _this.showLoading=false;
              console.log(response);
              if(response.data.success){
                let data = response.data.detail;
                console.log("即将跳转微信支付");
                //函数为分装过得  (就是调用微信支付)
                _this.wexinPay(
                  {
                    appId: data.appId,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    paySign: data.sign,
                    signType: 'MD5',
                    timestamp: data.timeStamp
                  },
                  //成功回调函数
                  res => {
                    console.log(res)
                    _this.$alert({
                      title: '提示',
                      content: "充值成功！"
                    }).then(
                    function(){
                        window.history.go(-2)
                    }).catch(
                        function(){
                            console.log("no");
                        }
                    )
                  },
                  res => {
                    console.log(res)
                    _this.$alert({
                      title: '提示',
                      content: res.data.description
                    })
                  }
                );
              }else{
                  _this.$toast(response.data.description, {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                  });
              }
          }.bind(this))
          .catch(function (response) {
            _this.showLoading=false;
            _this.$toast(response.data.description, {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            console.log(response);
          });
      },
       //强制保留2位小数，如：2，会在2后面补上00.即2.00 
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
    padding: 0.2rem 0.18rem;
    text-align: left;
    color: #979799;
  }
  .warm-tip .call{
    color: #4098e9!important;
  }
  .btn-box-bottom{
    padding: 0 .18rem;
  }
</style>
