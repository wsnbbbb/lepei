<template>
    <div>
        <p class="title">账户信息</p>
        <div class="order-info">
          <div class="order-money">
            姓名 <span>{{name}}</span>
          </div>
          <div class="order-money">
            乐陪卡号 <span>{{cardNo}}</span>
          </div>
            <div class="order-money">
            卡余额 <span>&yen;{{OffMoney}}</span>
          </div>
            <div class="order-money">
            已充值待激活金额 <span>&yen;{{OnMoney}}</span>
          </div>
        </div>
        <p class="title">充值金额</p>
        <div class="order-info money-box">
          <div class="selectMoney">
            <div v-bind:class="{ select: this.amountType==1}" v-on:click="select(1)">100元</div>
            <div v-bind:class="{ select: this.amountType==2}" v-on:click="select(2)">200元</div>
            <div v-bind:class="{ select: this.amountType==3}" v-on:click="select(3)">300元</div>
          </div>
          <div>
            <input type="text" @focus="otherType" v-model="otherMoney" placeholder="其他金额" class="input-money" autocomplete=‘off’ name="" id="">
          </div>
        </div>
        <p class="charge-tip">
          {{notice}}
        </p>
        <div class="btn-box">
            <a href="javascript:;" class="btn-submit" v-on:click="getOrder">下一步</a>
            <p class="btn-box-bottom">每次充值金额10元起，最大1000元，每天充值次数不大于5次，乐陪卡可用余额不能超过1000元。</p>
        </div>
        <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl,user,redirectUrlIos,redirectUrlAndroid, alipayStr, redirectUrlIosForAlipay} from '../config/env'
var urlencode = require('urlencode');
const md5 = require('js-md5');
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
            name: '',
            cardNo: '',
            OffMoney: '',
            OnMoney: '',
            amountType: 0,
            otherMoney: ""
        }
    },
    mounted(){
      console.log(this.$route.params.schoolId)
      console.log(this.$route.query.id)
      console.log(this.$route.query.No)
      this.name = sessionStorage.getItem("name")
      this.cardNo = this.$route.query.No

      var domain = document.domain;
      console.log(window.location.protocol+"//"+window.location.host)
      this.getBalance();
      this.money=this.toDecimal2(this.$route.params.money)
      // this.money=0.01
      // this.getOrder();
      window.isCloseWebview=this.isCloseWebview;
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
      select(num){
        this.amountType = num
        this.otherMoney = ''
      },
      otherType(){
        this.amountType = 4
      },
      isCloseWebview(){
        return "yes"
      },
      getBalance(){
        this.showLoading=true;
        let schoolId = this.$route.query.schoolId
        let personId = this.$route.query.personId
        let cardNo = this.$route.query.No
        let uid = sessionStorage.getItem("openId")
        axios.post(baseUrl+'/wechat/new-ic/balance', JSON.stringify({
            uid: uid,
            schoolId: schoolId,
            personId: personId,
            cardNo: cardNo,
            sign: md5(`cardNo=${cardNo}&personId=${personId}&schoolId=${schoolId}&uid=${uid}`).toUpperCase()
        }))
        .then(function (response) {
            this.showLoading = false;
            console.log(response);
            if(response.data.success){
                this.OffMoney = response.data.detail.OffMoney;
                this.OnMoney = response.data.detail.OnMoney;
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
      getOrder(){
        let amount = ""
        if(this.amountType==0){
          this.$toast("请选择充值金额！", {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          return
        }else if(this.amountType==1){
          amount = 100
        }else if(this.amountType==2){
          amount = 200
        }else if(this.amountType==3){
          amount = 300
        }else if(this.amountType==4){
          if(!this.checkAmount(this.otherMoney)){
            this.$toast("金额格式不正确，请重新输入", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }else if(parseFloat(this.otherMoney)<0){
            this.$toast("充值金额不能小于10元", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }else{
            amount = this.otherMoney
          }
        }
        this.showLoading=true;
        let uid = sessionStorage.getItem("openId")
        let schoolId = this.$route.query.schoolId
        let personId = this.$route.query.personId
        axios.post(baseUrl+'/wechat/card/make-recharge-order', JSON.stringify({
            uid: uid,
            schoolId: schoolId,
            personId: personId,
            amount: amount,
            sign: md5(`amount=${amount}&personId=${personId}&schoolId=${schoolId}&uid=${uid}`).toUpperCase()
        }))
        .then(function (response) {
            this.showLoading=false;
            console.log(response);
            if(response.data.success){
                this.orderNo=response.data.detail.orderNo
                let money = response.data.detail.money
                let orderNo = response.data.detail.orderNo
                this.$router.push({ path: `/comfirm-charge/${money}/${orderNo}?schoolId=${schoolId}&personId=${personId}`})
          }else{
              this.makeOrder=false;
              this.errorMsg=response.data.description;
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
        window.app.goWebPage(baseUrl+this.chargeAgreementUrl,this.title);
      },
      pay(){
         this.$router.push({ path: '/comfirm-charge'})
        // if(!this.makeOrder){
        //    this.$toast(this.errorMsg, {
        //       durtaion: 200,
        //       location: 'center' // 默认在中间
        //   });
        //   return
        // }

        if(this.orderNo==0){
           this.$toast("网络不给力，请稍后重试！", {
              durtaion: 200,
              location: 'center' // 默认在中间
          });
          return
        }
        if(this.selectChannel==1){
          if(!window.app.isWXInstallAndSupport()){
            this.$toast("请先安装微信客户端", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
        }
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

        axios.post(baseUrl+'/teacher/card/new-channel', JSON.stringify({
            uid:user.uid,
            token:user.token,
            orderNo:this.orderNo,
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
                      window.app.notice();
                      if(this.selectChannel==1){
                        window.location.href=response.data.detail.orderInfo+"&redirect_url="+urlencode(redirectUrlIos)
                      }else{
                        window.location.href=alipayStr + response.data.detail.orderInfo
                      }
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
      checkAmount(amount) {   
        if(amount!= null && amount != ""&&amount!="0"){
          var exp = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/;
          if(!exp.test(amount)){
            return false
          }
        }else{
          return false
        }
        return true
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
  .btn-box-bottom{
    padding-left: .13rem;
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
  .selectMoney{
    display: flex;
    justify-content: space-around;
  }
  .selectMoney div{
    width: 1.88rem;
    height: .82rem;
    line-height: .82rem;
    text-align: center;
    font-size: .32rem;
    display: inline-block;
    border: 1px solid #acacac;
    border-radius: .1rem;
  }
  .money-box{
    padding: 0.25rem .2rem;
    background: #fff;
  }
  .input-money{
    height: .86rem;
    width: 6.6rem;
    border: 1px solid #afafaf;
    display: block;
    margin: 0 auto;
    margin-top: .25rem;
    border-radius: .1rem;
    text-indent: 1em;
    outline: none;
    font-size: .32rem;
    -webkit-appearance: none;
  }
  .select{
    border: 1px solid #4c9eea!important;
    color: #4c9eea;
  }
</style>
