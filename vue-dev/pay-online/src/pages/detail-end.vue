<template>
    <div>
        <div class="error-tip">
          <img src="../assets/p7.png" alt="">
          <p class="tip-no">已完成缴费</p>
          <p class="tip-no-match">缴费时间：{{paidTime}} </p>
        </div>
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
        <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {indexUrl,baseUrl} from '../config/env'
export default {
    name: 'index',
    components: {
      loading
    },
    data() {
        return {
            showLoading:false,
            endTime:'',
            fee:'',
            paidTime:'',
            paymentExplain:'',
            personName:'',
            remark:'',
            schoolName:'',
            title:'',
            id:'',
            paidTime:'',
            paidFee:'',
            user: {}
        }
    },
    mounted(){

      window.isBackToList=this.isBackToList;
      document.title = '缴费完成'
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
          window.clearInterval(timer)
        }
      }, 100);

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
            uid:this.user.uid,
            token:this.user.token,
            personId:this.user.personId,
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
                this.paidTime=response.data.detail.paidTime;
                this.paidFee=response.data.detail.paidFee;
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
        }
        


    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
   .bill-bottom>p:first-child>span{
    color: #78cded;
   }
   .bill-bottom>p:last-child{
    padding: 0.4rem 0.3rem;
    word-break: break-all;
    padding-top: 0;
   }
   .bill-bottom>p:first-child>span:nth-child(1){
    color: #78cded;
   }
   .bill-bottom>p:first-child>span:nth-child(2){
    color: #afafaf;
   }
</style>
