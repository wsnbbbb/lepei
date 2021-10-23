<template>
    <div class="list-wrap">
       

       <section class="list">
          <p>物品明细</p>
          <div class="list-box">
              <div class="list-box-tag">
                  <img  v-if='status==1' src="../assets/icon-3.png" alt="">
                  <img  v-if='status==2' src="../assets/icon-2.png" alt="">
                  <img  v-if='status==3' src="../assets/icon2.png" alt="">
                  <img  v-if='status==4' src="../assets/icon-1.png" alt="">
                  <img  v-if='status==5' src="../assets/icon1.png" alt="">
                  <img  v-if='status==6' src="../assets/icon3.png" alt="">
<!--                   <img  v-if='status==1' src="../assets/icon-2.png" alt="">
                  <img  v-if='status==1' src="../assets/icon-2.png" alt=""> -->
              </div>

               <div class="list-item" v-for="item in thingList" v-if="status==3" v-bind:class="{ grey: item.showStatus==0 }" >
                <span class="list-name">{{item.propertyName}}</span>
     <!--   
                <span class="list-btn" v-show='item.returnStatus==0' v-on:click.stop="returnIt(item.propertyId)">未还</span>
                <span class="list-btn list-btn-has" v-show='item.returnStatus==1'>已还</span> -->
                <!-- <span class="list-btn list-btn-ok" v-show='item.returnStatus==-1'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> -->
         
                <span class="list-f">..........................................................................................................</span>
                <span class="list-num">{{item.applyNum}}{{item.unit}}</span>
              </div>

                <div class="list-item"  v-bind:class="{ grey: item.showStatus==0}" v-if="status==5" v-for="item in thingList" >
                <span class="list-name">{{item.propertyName}}</span>
                <span class="btn-confirm1 normal" v-if="item.showStatus==1" :propertyId="item.propertyId">
                  <span class="comfirm-btn" v-on:click.stop="comfirmOk($event)">未领</span>
                </span>
              <!--   <span class="btn-confirm" v-if="item.showStatus==1" :propertyId="item.propertyId">
                  <span class="btn-left" v-on:click.stop="chooseLeft($event)"></span>
                  <span class="btn-right" v-on:click.stop="chooseRight($event)"></span>
                </span> -->
                <span class="btn-confirm1" v-if="item.showStatus==0" >
                  .................
                </span>
                <span class="list-f">.........................................................................................</span>
                <span class="list-num">{{item.applyNum}}{{item.unit}}</span>
              </div>

              <div class="list-item status6" v-bind:class="{ grey: item.showStatus==0 }" v-for="item in thingList" v-if="status==6">
                <span class="list-name">{{item.propertyName}}</span>
       
                <span class="list-btn" v-show='item.returnStatus==0&&item.showStatus!=0' v-on:click.stop="returnIt(item.propertyId)">未还</span>
                <span class="list-btn list-btn-has" v-show='item.returnStatus==1'>已还</span>
                <span class="list-btn list-btn-ok" v-show='item.returnStatus==-1||item.returnStatus==0&&item.showStatus==0'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
         
                <span class="list-f">..........................................................................................................</span>
                <span class="list-num">{{item.applyNum}}{{item.unit}}</span>
              </div>
              
          </div>
       </section>
      <section class="list">
          <p>物品用途</p>
          <div class="list-box list-box-use">
             {{applyUse}}
          </div>
       </section>
       <section class="examine-line">
         <ul>
         
         
           <li class="examine-line-item clearfix">
              <span class="examine-left-icon"></span>
              <p class="line-item-row clearfix">
                <span class="examine-line-name">
                  {{this.person}}
                </span>
                 <span class="examine-line-action">
                  发起申请
                </span>
                 <span class="examine-line-chat" v-show="currentUserId!=applyPersonId" v-on:click.stop="chartByRongYunWithHim()">
                  <img src="../assets/icon-chat.png" alt="">
                </span>
                 <span class="examine-line-contact"  v-show="currentUserId!=applyPersonId" >
                  <span v-on:click.stop=callHim()>
                    <img src="../assets/icon-phone.png" alt="">
                   </span>
                </span>
              </p>
               <p class="line-item-row2">
               
              </p>
               <p class="line-item-row2">
                {{this.applyTime}}
              </p>
       
           </li>
              <li class="examine-line-item clearfix" v-for="list in examineList">
              <span class="examine-left-icon"></span>
              <p class="line-item-row clearfix">
                <span class="examine-line-name">
                  {{list.examinePerson}}
                </span>
                 <span class="examine-line-action">
                   {{list.status==1?"已通过":"未通过"}}
                </span>
                 <span class="examine-line-chat" v-show="currentUserId!=list.dealerPersonId" v-on:click.stop="chartByRongYun(list.rUserId,list.examinePerson,list.portrait)">
                  <img src="../assets/icon-chat.png" alt="">
                </span>
                 <span class="examine-line-contact" v-show="currentUserId!=list.dealerPersonId">
                  <span v-on:click.stop="call(list.mobile)">
                    <img src="../assets/icon-phone.png" alt="">
                   </span>
                </span>
              </p>
               <p class="line-item-row2">
                 {{list.reason}}
              </p>
              <p class="line-item-row2">
                {{list.examineTime}}
              </p>
              
           </li>
             
            
         </ul>
       </section>

       <section class="notice-btn" v-show="showBtn">
          <a href="javascript:;" v-on:click.stop="noticeReceive">通知领取</a>
       </section>


       <section class="notice-btn" v-show="showBtnComfirm">
          <a href="javascript:;" v-on:click.stop="comfirmReceive">确认</a>
       </section>

       <loading v-show="showLoading"> </loading>

       <comfirmAgree v-show="isShowAgree"  :childMsg="agreeMsg" @toparentevent="cancel()" @toparenteventcomfirm="comfirmAgree1"> </comfirmAgree>

       <comfirmReject v-show="isShowReject"  @toparentevent="cancel()" @toparenteventcomfirm="comfirmReject1"></comfirmReject>
    </div>
</template>
<script>
import loading from '../components/loading'
import comfirmAgree from '../components/comfirmAgree'
import comfirmReject from '../components/comfirmReject'
import axios from 'axios'
import {baseUrl} from '../config/env'
export default {
    name: 'detail',
    components: {
      loading,
      comfirmAgree,
      comfirmReject
    },
    data() {
        return {
            showLoading:true,
            isShowAgree:false,
            isShowReject:false,
            status:"",
            list:[],
            thingList:[],
            examineList:[],
            id: this.$route.params.id,//接收参数,
            person: this.$route.params.person,//接收参数,
            thistel:"tel:10000",
            agreeMsg:this.$route.params.person,
            isShowBtn:false,
            isShowApplyPerson:this.$route.params.isShowApplyPerson,
            showBtn:false,
            phone:null,
            portraitUrl:this.$route.params.portraitUrl,
            ryId:null,
            showBtnComfirm:false,
            applyTime:this.$route.params.applyTime,
            applyPersonId:this.$route.params.applyPersonId,
            applyUse:"",
            canReturn:false,
            propertyIds:[],
            user: {},
            currentUserId: ''

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
            this.currentUserId = window.app.getCurrentCardId()
        }

        var timer = setInterval(() => {
            if(this.user.uid&&this.user.token&&this.user.personId){
                this.initData();
                window.clearInterval(timer)
            }
        }, 100);
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
          this.currentUserId = result
        },
        comfirmOk(e){
            
            if(e.currentTarget.parentElement.className=="btn-confirm1 normal"){
              e.currentTarget.parentElement.className="btn-confirm1 normal comfirmOk"
              console.log("1")
            }else{
              e.currentTarget.parentElement.className="btn-confirm1 normal"
               console.log("2")
            }
        },

        initData(){
            axios.post(baseUrl+'/teacher/material-claim/detail', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token: this.user.token,
                id: this.id
              }))
              .then(function (response) {
                  this.showLoading=false;
                if(response.data.success){
                  for(let i=0;i<response.data.detail.list.length;i++){
                      if(response.data.detail.list[i].showStatus==1){
                        this.propertyIds.push(response.data.detail.list[i].propertyId)
                      }
                  }
                  this.list=response.data.detail;
                  this.thingList=response.data.detail.list;
                  this.examineList=response.data.detail.examine;
                  this.isShowBtn=response.data.detail.canExamine;
                  this.status=response.data.detail.status;
                  this.phone=response.data.detail.mobile;
                  this.ryId=response.data.detail.rUserId;
                  this.applyUse=response.data.detail.applyUse;
                  this.canReturn=response.data.detail.adminAuth;
                  if((response.data.detail.adminAuth==true)&&(response.data.detail.status==3)){
                    this.showBtn=true;
                  }
                  if((response.data.detail.adminAuth==true)&&(response.data.detail.status==5)){
                    this.showBtnComfirm=true;
                  }
                }else{
                 this.$toast(response.data.description, {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                  });
                 }
                console.log(this.list);
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },

        doThis(id){
            alert(id)
        },
        reject(){
           this.isShowReject=true;
        },
        comfirmReject(message,status){
       
          this.isShowReject=true;
          // console.log(message)
           axios.post(baseUrl+'/teacher/material-claim/examine1', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token:this.user.token,
                id:this.id,
                status:status,   // 1已通过 0未通过
                // reason:message
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
             
                console.log(this.list);
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        comfirmReject1(message){
          let _this=this;
          this.isShowReject=false;
          this.showLoading=true;
          axios.post(baseUrl+'/teacher/material-claim/examine', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token:this.user.token,
                id:this.id,
                status:0,   // 1已通过 0未通过
                reason:message
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
                if(response.data.success){
                    _this.$alert(
                        {
                            title: '',
                            content: "操作成功",
                        }).then(
                          function(){
                           _this.initData();
                          }
                        ).catch(
                          function(){
                            console.log('点了取消')
                          }
                       );
                }else{
                        _this.$alert(
                        {
                            title: '',
                            content: response.data.description,
                        }).then(
                          function(){
                            _this.initData();
                          }
                        ).catch(
                          function(){
                            console.log('点了取消')
                          }
                       );
                }
                   
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        comfirmAgree1(){
           let _this=this;
          this.isShowAgree=false;
          axios.post(baseUrl+'/teacher/material-claim/examine', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token:this.user.token,
                id:this.id,
                status:1,   // 1已通过 0未通过
                reason:""
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
                  if(response.data.success){
                    _this.$alert(
                        {
                            title: '',
                            content: "操作成功",
                        }).then(
                          function(){
                           _this.initData();
                          }
                        ).catch(
                          function(){
                            console.log('点了取消')
                          }
                       );
                }else{
                        _this.$alert(
                        {
                            title: '',
                            content: response.data.description,
                        }).then(
                          function(){
                            _this.initData();
                          }
                        ).catch(
                          function(){
                            console.log('点了取消')
                          }
                       );
                }
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        agree(){
          this.isShowAgree=true;
          console.log("12313")
        },
        cancel(){
         this.isShowReject=false;
         this.isShowAgree=false
        },
         cancel1(){
         this.isShowReject=false;
         this.isShowAgree=false
        },
        chartByRongYun(id,name,portrait){
           console.log(id)      
            if(this.isiOS()){
              window.webkit.messageHandlers.sendLocalMessage.postMessage({id: id, name: name, portrait: portrait});
            }else{
               window.app.sendLocalMessage(id,name,portrait); 
            }  
        },
        chartByRongYunWithHim(){
          if(this.isiOS()){
              window.webkit.messageHandlers.sendLocalMessage.postMessage({id: this.ryId, name: this.person, portrait: this.portraitUrl});
          }else{
              window.app.sendLocalMessage(this.ryId,this.person,this.portraitUrl);
          }
        },
        call(mobile){
          if(this.isiOS()){
            window.webkit.messageHandlers.callLocalPhone.postMessage(mobile);
          }else{
              window.app.callLocalPhone(mobile);
          }
        },
         callHim(){
          if(this.isiOS()){
              window.webkit.messageHandlers.callLocalPhone.postMessage(this.phone);
          }else{
              window.app.callLocalPhone(this.phone);
          }
        },
        returnIt(id){
            if(this.canReturn){
               axios.post(baseUrl+'/teacher/material-claim/return', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token:this.user.token,
                id:this.id,
                propertyId:id
              }))
              .then(function (response) {
                if(response.data.success){
                    this.initData();
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
        },
        noticeReceive(){
          this.showLoading=true;
          let _this=this;
          axios.post(baseUrl+'/teacher/material-claim/notice-receive', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token:this.user.token,
                id:this.id
              
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
                if(response.data.success){
                  _this.$alert(
                            {
                                title: '',
                                content: "通知领取成功！",
                            }).then(
                              function(){
                                console.log("ok")
                                window.history.go(-1);
                              }
                            ).catch(
                              function(){
                                console.log('点了取消')
                              }
                           );
                  }else{
                     _this.$alert(
                            {
                                title: '',
                                content: response.data.description,
                            }).then(
                              function(){
                                console.log("ok")
                                window.history.go(-1);
                              }
                            ).catch(
                              function(){
                                console.log('点了取消')
                              }
                           );
                  }
                   
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        comfirmReceive(){
          this.showLoading=true;
          let _this=this;
          let propertyIds=[];
          let dom1=document.getElementsByClassName("normal")
    
          for(let i=0;i<dom1.length;i++){
            if(dom1[i].className=="btn-confirm1 normal"){
              propertyIds.push(dom1[i].getAttribute("propertyId"))
            }
            
          }
          // if(propertyIds.length==0){
          //   propertyIds=this.propertyIds;
          // }
          axios.post(baseUrl+'/teacher/material-claim/confirm-receive', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token:this.user.token,
                id:this.id,
                propertyIds:propertyIds
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
                if(response.data.success){
                      _this.$alert(
                        {
                            title: '',
                            content: "操作成功！",
                        }).then(
                          function(){
                            console.log("ok")
                            window.history.go(-1);
                          }
                        ).catch(
                          function(){
                            console.log('点了取消')
                          }
                       );
                  }else{
                      _this.$alert(
                        {
                            title: '',
                            content: response.data.description,
                        }).then(
                          function(){
                            console.log("ok")
                            // window.history.go(-1);
                          }
                        ).catch(
                          function(){
                            console.log('点了取消')
                          }
                       );

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
    ul,li{
      margin:0;
      padding: 0;

    }
    li{
      list-style: none;
    }
   .list p{
      font-size:0.24rem;
      background: #f5f5f9;
      color:#8c8c8c;
      height: 0.5rem;
      line-height: 0.5rem;
      padding-left: 0.3rem;
   }
   .list-item{
      font-size: 0.3rem;
      overflow: hidden;
      padding: 0.25rem 0.3rem;
      padding-right: 0.4rem;
   }
   .list-item span{
      display: inline-block;
      float: left;
      overflow: hidden;
      word-break: break-all;
   }
   .list-name{
      width:20%;
      color:#626262;
   }

  .list-f{
      width:35%;
      color:#cacaca;
      /*font-size: 0.12rem;*/
   }
   .list-num{
      width:12%;
      text-align: right;
      color: #8c8c8c;
   }
   .list-box{
      padding: 0.15rem 0;
      background: #fff;

   }
   .list-box{
    position: relative;
   }
   .list-box-tag{
      position: absolute;
      right: 0;
      top:-0.08rem;
      width: 1.0rem;
      height: 0.9rem;
      z-index: 999;
   }
  .list-box-tag img{
      display: block;
      width: 1.0rem;
      height: 0.9rem;
   }
   .examine-list-item>p{
      font-size:0.24rem;
      color: #8c8c8c;
      height: 0.4rem;
      line-height: 0.4rem;
      padding:0 0.3rem; 
   }
  .examine-list-item-person{
      padding: 0.2rem 0.3rem;
      background-color: #fff;
      overflow: hidden;
    }
     .examine-list-item-person ul li{
      width:1.4rem;
      float: left;
     }
   .examine-list-item-person ul li img{
      width: 1.0rem;
      height: 1.0rem;
      display: block;
      border-radius: 100%;
      margin:0 auto;
   }
   .examine-list-item-person ul li p{
      text-align: center;
      font-size: 0.22rem;
      color: #8c8c8c;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      padding-top: 0.1rem;
   }
   .examine-line{
     margin-top: 0.24rem;
     padding: 0.4rem 0;
     background: #fff;
     padding-top: 0.5rem;
   }
   .examine-line>ul{
     padding-left:0.6rem;
   }
   .examine-line-item{
      background-color: #fff;
      /*overflow: hidden;*/
      border-left: 1px solid #cbcbcb;
      padding-left: 0.4rem;
      position: relative;
      clear: both;
      /*padding-top: 0.2rem;*/
      padding-bottom: 0.25rem;

   }
   .examine-line-item:last-child{
      border-left: 1px solid #fff;
      padding-bottom: 0;
   }
   .examine-line-name{
      font-size: 0.26rem;
      color: #7b7b7b;
      float: left;
      display: inline-block;
      width:1.2rem;
   }
   .examine-line-action{
      font-size: 0.26rem;
      color: #7b7b7b;
      float: left;
      display: inline-block;
   }
   .examine-left-icon{
      position: absolute;
      background: url(../assets/icon-circle.png);
      display: block;
      width:0.2rem;
      height: 0.2rem;
      background-repeat: no-repeat;
      background-size: 100%;
      left: -0.105rem;
      z-index: 99;
   }
   .examine-line-chat img{
        width:0.4rem;
        height: 0.4rem;
        display:inline-block;
        position: absolute;
        right: 1.0rem;
        top:0.0rem;
   }
    .examine-line-contact img{
        width:0.4rem;
        height: 0.4rem;
        display: inline-block;
        position: absolute;
        right: 0.3rem;
        top:0.0rem;
   }
   .examine-line-item:first-child .line-item-row span{
      color: #f0b15f;
   }
   .examine-line-contact a{

   }
   　.clearfix:before,.clearfix:after {
                  content: "";
                  display: block;
                  clear: both;
            }
      .clearfix {
            zoom: 1;
      }

      .line-item-row{
        position: relative;
        top:-0.09rem;
      }
      .line-item-row2{
        font-size: 0.2rem;
        color:#b0b0b0;
        padding-bottom: 0.1rem;
         word-break: break-word;
      }
      .examine-apply>p{
        font-size: 0.24rem;
        height: 0.4rem;
        line-height: 0.4rem;
        color: #8c8c8c;
        padding-left: 0.3rem;
      }
       .examine-apply-info {
        padding: 0.2rem 0.3rem;
        background: #fff;
        position: relative;
       }
      .examine-apply-info img{
        width: 1rem;
        height: 1rem;
        border-radius: 100%;
        display: block;
      }
      .apply-info-box{
        position: absolute;
        left: 1.5rem;
        top:0.3rem;
      }
       .apply-info-box .apply-info-name{
          font-size: 0.3rem;
          color: #7b7b7b;
       }
       .apply-info-box .apply-info-time{
          font-size: 0.22rem;
          color: #b0b0b0;
       }
       .char-to-him{
          position: absolute;
          width:0.4rem;
          height: 0.4rem;
           right: 1rem;
          top:0.45rem;
       }
        .char-to-him img{
           width:0.4rem;
           height: 0.4rem;
           display: block;
        }
        .phone-to-him{
          position: absolute;
          width:0.4rem;
          height: 0.4rem;
          right: 0.3rem;
          top:0.45rem;
        }
        .phone-to-him img{
          width:0.4rem;
          height: 0.4rem;
          display: block;
        }
        .btn-reject{
          display: inline-block;
          width:2.0rem;
          height: 0.9rem;
          background-color: #ffa14d;
          font-size:0.32rem;
          text-align: center;
          line-height: 0.9rem;
          color: #fff;
          border-radius: 0.08rem;
          text-decoration: none;
          position: absolute;
          left: 1.4rem;
          top:1.05rem;
        }
        .btn-reject img{
            width:0.41rem;
            height:0.41rem;
            display: block;
            position: absolute;
            top:50%;
            margin-top: -0.205rem;
            margin-left: 0.45rem;
          }
        .btn-agree img{
            width:0.41rem;
            height:0.41rem;
            display: block;
            position: absolute;
            top:50%;
            margin-top: -0.205rem;
            margin-left: 0.45rem;
        }
        .btn-agree{
          display: inline-block;
          width:2.0rem;
          height: 0.9rem;
          background-color: #35e6aa;
          font-size:0.32rem;
          text-align: center;
          line-height: 0.9rem;
          color: #fff;
          border-radius: 0.08rem;
          text-decoration: none;
          position: absolute;
          right:  1.4rem;
          top:1.05rem;
        }
        .btn-wrap{
          height: 3.0rem;
          position: relative;
        }
.notice-btn{
padding: 80px 0;
}
.notice-btn>a{
    background: #4fc2f3;
    color: #fff;
    width: 6.6rem;
    height: 1.0rem;
    display: block;
    margin: 0.1rem auto;
    font-size: 0.32rem;
    text-align: center;
    text-decoration: none;
    line-height: 1.0rem;
    border-radius: 0.1rem;

}
.list-box-use{
  font-size:0.28rem;
  padding: 0.3rem;
  color: #7b7b7b;
   word-break: break-word;
}
.list-btn{
  background: #4ec2f3;
  color: #fff;
  padding: 0.04rem 0.13rem;
  display: inline-block;
  border-radius: 0.5rem;
  font-size: 0.14rem;
  margin-right: 0.1rem;
}
.list-btn-has{
  background: #a4a4a4;
}
.list-btn-ok{
  background: #fff;
}
.grey .list-name{
  color: #cacaca;
}
.grey .list-num{
  color: #cacaca;
}
.btn-confirm{
  width:1.5rem;
  height: 0.42rem;
  background: url(../assets/icon-l0.png);
  background-size: 100%;
  margin-top: 2px;
  display: inline-block;
}
.btn-confirm1{
  width:1.5rem;
  /*height: 0.42rem;*/

  /*margin-top: 2px;*/
  display: inline-block;
  color: #cacaca;
}
.btn-left{
  width: 50%;
  float: left;
  display: inline-block;
 height: 0.42rem;
}
.btn-right{
  width: 50%;
  float: right;
  display: inline-block;
   height: 0.42rem;
}
.ChosseLeft{
   background: url(../assets/icon-l1.png);
  background-size: 100%;
}
.ChosseRight{
   background: url(../assets/icon-l2.png);
  background-size: 100%;
}
.comfirm-btn{
  border:1px solid #cacaca;
  color: #cacaca;
  padding: 0 0.05rem;
  border-radius: 0.1rem;
  box-sizing: border-box;
  /*font-size: 0.14rem;*/
}
.comfirmOk>span{
  border:1px solid #4fc2f3;
  color: #4fc2f3;
}
.status6 .list-f{
  width: 54%;
}
</style>
