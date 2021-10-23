<template>
    <div class="list-wrap">
       

       <section class="list">
          <p>物品明细</p>
          <div class="list-box">
              <div class="list-box-tag">
                  <img src="../assets/icon-2.png" alt="">
              </div>
              <div class="list-item" v-for="item in thingList">
                <span class="list-name">{{item.propertyName}}</span>
                <span class="list-f">.....................................................</span>
                <span class="list-num">{{item.applyNum}}{{item.unit}}</span>
              </div>
              
          </div>
       </section>
  <!--      <section class="examine-list">
         <div class="examine-list-item"> 
            <p>第一审批人</p>
              <div class="examine-list-item-person">
                  <ul>
                    <li>
                      <img src="../assets/11.png" alt="">
                      <p class="person-name">jojojoijojojoijojojoijojojoijojojoijojojoi</p>
                    </li>
                     <li>
                      <img src="../assets/11.png" alt="">
                      <p class="person-name">jojojoi</p>
                    </li>
                     <li>
                      <img src="../assets/11.png" alt="">
                      <p class="person-name">jojojoijojojoi</p>
                    </li>

                  </ul>
              </div>
         </div>

         <div class="examine-list-item"> 
            <p>第一审批人</p>
              <div class="examine-list-item-person">
                  <ul>
                    <li>
                      <img src="../assets/11.png" alt="">
                      <p class="person-name">jojojoijojojoijojojoijojojoijojojoijojojoi</p>
                    </li>
                  

                  </ul>
              </div>
         </div>
         <div class="examine-list-item"> 
            <p>第一审批人</p>
              <div class="examine-list-item-person">
                  <ul>
                    <li>
                      <img src="../assets/11.png" alt="">
                      <p class="person-name">jojojoijojojoijojojoijojojoijojojoijojojoi</p>
                    </li>
                  
                  </ul>
              </div>
         </div>
       </section> -->
       <section class="examine-line">
         <ul>
         
         
           <li class="examine-line-item clearfix">
              <span class="examine-left-icon"></span>
              <p class="line-item-row clearfix">
                <span class="examine-line-name">
                  {{this.person}}
                </span>
                 <span class="examine-line-action">
                  发起请求
                </span>
                <!--  <span class="examine-line-chat">
                  <img src="../assets/icon-chat.png" alt="">
                </span>
                 <span class="examine-line-contact">
                  <a :href="'tel:' + 185588">
                    <img src="../assets/icon-phone.png" alt="">
                   </a>
                </span> -->
              </p>
             <!--  <p class="line-item-row2">
                2014-5-55 
              </p> -->
           </li>
              <li class="examine-line-item clearfix" v-for="list in examineList">
              <span class="examine-left-icon"></span>
              <p class="line-item-row clearfix">
                <span class="examine-line-name">
                  {{list.examinePerson}}
                </span>
                 <span class="examine-line-action">
                   {{list.status==1?"同意":"不同意"}}
                </span>
                 <span class="examine-line-chat">
                  <img src="../assets/icon-chat.png" alt="">
                </span>
                 <span class="examine-line-contact">
                  <!-- 姓名 -->
                  <a :href="'tel:' + 185588">
                    <img src="../assets/icon-phone.png" alt="">
                   </a>
                </span>
              </p>
               <p class="line-item-row2">
                 {{list.reason}}
              </p>
              <p class="line-item-row2">
                {{list.examineTime}}
              </p>
              
           </li>
             <!--  <li class="examine-line-item clearfix">
              <span class="examine-left-icon"></span>
              <p class="line-item-row clearfix">
                <span class="examine-line-name">
                  姓名
                </span>
                 <span class="examine-line-action">
                  发起请求
                </span>
                 <span class="examine-line-chat">
                  <img src="../assets/icon-chat.png" alt="">
                </span>
                 <span class="examine-line-contact">
                  <a :href="'tel:' + 185588">
                    <img src="../assets/icon-phone.png" alt="">
                   </a>
                </span>
              </p>
              <p class="line-item-row2">
                2014-5-55 
              </p>
           </li> -->
            
         </ul>
       </section>


       <section class="examine-apply">
          <p>申请人</p>
          <div  class="examine-apply-info">
              <img src="../assets/11.png" alt="">
              <div class="apply-info-box">
                 <p class="apply-info-name">大人</p>
                 <p class="apply-info-time">3小时前</p>
              </div>
              <a href="" class="char-to-him">
                <img src="../assets/icon-chat.png" alt="">
              </a>
               <a href="tel:18000000" class="phone-to-him">
                <img src="../assets/icon-phone.png" alt="">
              </a>
          </div>

          <div class="btn-wrap"> 
              <a href="javascript:;" class="btn-reject" v-on:click.stop="reject()">
              <img src="../assets/icon-r.png" alt="">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;拒绝
              </a>
               <a href="javascript:;" class="btn-agree" v-on:click.stop="agree()">
                <img src="../assets/icon-a.png" alt="">
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同意</a>
          </div>
       </section>

        


       <loading v-show="showLoading"> </loading>

       <comfirmAgree v-show="isShowAgree"  :childMsg="agreeMsg" @toparentevent="cancel()" @toparentevent1="cancel1()"> </comfirmAgree>

       <comfirmReject v-show="isShowReject"  @toparentevent="cancel()"></comfirmReject>
    </div>
</template>
<script>
import loading from '../components/loading'
import comfirmAgree from '../components/comfirmAgree'
import comfirmReject from '../components/comfirmReject'
import axios from 'axios'
import {baseUrl,user} from '../config/env'
export default {
    name: 'detail',
    components: {
      loading,
      comfirmAgree,
      comfirmReject
    },
    data() {
        return {
            showLoading:false,
            isShowAgree:false,
            isShowReject:false,
            list:[],
            thingList:[],
            examineList:[],
            id: this.$route.params.id,//接收参数,
            person: this.$route.params.person,//接收参数,
            thistel:"tel:10000",
            agreeMsg:"某人"
        }
    },
    mounted(){
        console.log(this.id);
        // this.initData();
        this.initData();
   
    },
    methods:{

        initData(){
            axios.post(baseUrl+'/teacher/material-claim/detail', JSON.stringify({
                personId: user.personId,
                uid: user.uid,
                token:user.token,
                id:this.id
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
                this.list=response.data.detail;
                this.thingList=response.data.detail.list;
                this.examineList=response.data.detail.examine;
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
        agree(){
          this.isShowAgree=true;
        },
        cancel(){
         this.isShowReject=false;
         this.isShowAgree=false
        },
         cancel1(){
         this.isShowReject=false;
         this.isShowAgree=false
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
   }
   .list-name{
      width:20%;
      color:#626262;
   }
   .list-f{
      width:65%;
      color:#bcbcbc;
   }
   .list-num{
      width:15%;
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
        top:0.1rem;
   }
    .examine-line-contact img{
        width:0.4rem;
        height: 0.4rem;
        display: inline-block;
        position: absolute;
        right: 0.3rem;
        top:0.1rem;
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
</style>
