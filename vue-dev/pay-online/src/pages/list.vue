<template>
    <div>
      <div class="tab-bar">
          <ul class="tab-ul">
            <li class="tab-li" :class="{'active': this.active==0}" v-on:click="tab(0)">
              进行中
            </li>
             <li class="tab-li" :class="{'active': this.active==1}" v-on:click="tab(1)">
              已完成
            </li>
             <li class="tab-li" :class="{'active': this.active==-1}" v-on:click="tab(-1)">
              已过期
            </li>
            
          </ul>
      </div>
       <div class="item " :class="{ 'orange': item.status==-1, 'green': item.status==1,'blue': item.status==0}" v-on:click.stop="openUrl(item.status,item.id)" v-for="item in list" :id="item.id" v-show="active==item.status">
            <div class="item-content">
              <div class="content-title">
                  <span class="content-title-des">{{item.title}}</span>
                  <span class="content-title-status" v-if="item.status==-1">已过期</span>
                  <span class="content-title-status" v-if="item.status==0">待缴费</span>
                  <span class="content-title-status" v-if="item.status==1">已缴费</span>
              </div>
              <div class="content-main">
                  <p>缴费学生：<span>{{item.personName}}</span></p>
                  <p>所在学校：<span>{{item.schoolName}}</span></p>
                  <p>截止时间：<span>{{item.endTime}}</span></p>
              </div>
              <div class="fee-detail">
                <span class="content-money">&yen;{{item.fee}}</span>
                <span class="content-money-paid">（已缴&yen;{{item.paidFee}}）</span>
              </div>
              
            </div>
       </div>
      <div class="no-data" v-show="showNoData">
          <img src="../assets/icon-no-data.png"  alt="">
      </div>
     <!--   <div class="error-tip" v-show="show">
          <img src="../assets/p4.png" alt="">
          <p class="tip-no">无相关信息</p>
          <p class="tip-no-match">学生信息不匹配，请联系老师</p>
       </div> -->
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
           name:'',
           id:'',
           list:[],
           show:false,
           active:0,
           user: {}
        }
    },
    mounted(){
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
          window.clearInterval(timer)
        }
      }, 100);

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
        // window.app.isWebViewFinish(false);
               window.app.isBackToList(false);
      },
      tab(index){
        this.active=index;
      },
      openUrl(state,recordId){
        localStorage.setItem("recordId",recordId)
        if(state==-1){
          this.$router.push({ path: '/detail-expired'})
        }else if(state==0){
          this.$router.push({ path: '/detail-waiting'})
        }else if(state==1){
          this.$router.push({ path: '/detail-end'})
        }
        
      },
      init(){
      
        this.showLoading=true;
        axios.post(baseUrl+'/parent/online-pay/cost-list', JSON.stringify({
           uid: this.user.uid,
           token: this.user.token,
           personId: this.user.personId
        }))
        .then(function (response) {
            this.showLoading=false;
            console.log(response);
            if(response.data.success){
              this.list=response.data.detail;
              if(response.data.detail.length==0){
                this.show=true;
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
  .tab-bar{
    padding: 0.4rem 0;
  }
  .tab-ul{
    margin: 0 auto;
    display: block;
    width: 6rem;

    background: #fff;
    border: 1px solid #0076FF;
    border-radius: 0.06rem;
  }
  .tab-ul:after{
    display: table;
    content: "";
    clear: both;
    font-size: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
  .tab-li{
    height: 0.6rem;
    width: 2rem;
    line-height: 0.6rem;
    float: left;
    font-size: 0.26rem;
    text-align: center;
    border-right: 1px solid #0076FF;
    box-sizing: border-box;
    color: #0076ff;
  }
   .active{
    background: #0076FF;
    color: #fff;
   }
  .tab-li:last-child{
    border-right: none;
  }
 .item{
  height: 3.1rem;
  width: 6.9rem;
  margin: 0 auto;
  margin-bottom: 0.28rem;
 
  border-radius: 0.1rem;
  position: relative;
  /*overflow: hidden;*/
  border-bottom-left-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
  /*padding-bottom: 0.2rem;*/
 }
 .orange{
   background: #ffb95e;
 }
 .orange .content-title-status{
   color: #ffb95e;
 }
 .blue{
   background: #84d8f3;
 }
.blue .content-title-status{
   color: #7cb3e7;
 }
 .green{
   background: #8df499;
 }
.green .content-title-status{
   color: #55e766;
 }

 
 .item-content{
  height: 3rem;
  background: #fff;
  position: absolute;
  bottom: 0;
  z-index: 99;
  width: 100%;
  border-radius: 0.1rem;
  padding: 0 0.3rem;
  box-sizing: border-box;

 }
 .content-title{
  font-size: 0.28rem;
  height: 0.74rem;
  line-height: 0.74rem;
  border-bottom: 1px dotted #dddddd;
 }
  .content-title>.content-title-des{
    float: left;
    width: 5.0rem;
    color: #626262;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .content-title>.content-title-status{
    float: right;
  }
  .content-main>p{
    font-size: 0.26rem;
    color: #626262;
    padding: 0.1rem 0;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .content-main>p>span{
    font-size: 0.26rem;
    color: #838383;
  }
  .content-money{
    font-size: 0.26rem;
    color: #7b7b7b;
    /*text-align: right;*/
    float: left;
  }
  .content-money-paid{
    font-size: 0.26rem;
    color: #afafaf;
    float: right;
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
  .fee-detail{
    overflow: hidden;
    padding: 0.1rem 0;
  }
  .no-data{
    margin-top: 1rem;
  }
  .no-data>img{
    width: 3.7rem;
    height: 3.43rem;
    display: block;
    margin: 0 auto;

  }
</style>
