<template>
    <div class="list-wrap">
       

       <section class="list">
          <!-- <p>物品明细</p> -->
          <div class="list-box">
         <!--      <div class="list-box-tag">
                  <img src="../assets/icon-2.png" alt="">
              </div> -->
              <div class="list-item" v-for="item in list">
                <span class="list-name">{{item.propertyName}}</span>
                <span class="list-f">.....................................................</span>
                <span class="list-num">{{item.applyNum}}件</span>
              </div>
               
          </div>
       </section>

       <div  class="btn-box"> 
          <a href="javascript:;" v-on:click="submit()">提 交</a>
       </div>




       <loading v-show="showLoading"> </loading>


    </div>
</template>
<script>
import loading from '../components/loading'
import comfirmAgree from '../components/comfirmAgree'
import comfirmReject from '../components/comfirmReject'
import axios from 'axios'
import {baseUrl} from '../config/env'



export default {
    name: 'submitlist',
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
            id: this.$route.params.id,//接收参数,
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


        this.list=this.$route.params.list
        if(this.isiOS()){
            window.webkit.messageHandlers.showRightToolBar.postMessage(false);
        }else{
            window.app.showRightToolBar(false);
        }

    },
     computed: {
        // a computed getter
        itemsArr: function () {
          // `this` points to the vm instance
             var itemsArr=[];
            for(let i=0;i<this.list.length;i++){
                    itemsArr.push({"propertyId":this.list[i].propertyId,"applyNum":this.list[i].applyNum})
            }
            return itemsArr;
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
        doThis(id){
            alert(id)
        },
        submit(){
            var _this=this;
            this.showLoading=true;
             axios.post(baseUrl+'/teacher/material-claim/apply', JSON.stringify({
                    personId: this.user.personId,
                    uid: this.user.uid,
                    token:this.user.token,
                    propertyMaterial:this.itemsArr
                  }))
                  .then(function (response) {
                    console.log(response);
                    this.showLoading=false;
                      // this.$confirm("1231313").then(
                      //     function(){
                      //       console.log("yes")
                      //     }
                      //   ).catch(
                      //     function(){
                      //                 console.log("no")
                      //               }
                      //   )
                      //   
                      if(response.data.success){
                        
                          _this.$alert(
                            {
                                title: '',
                                content: '提交成功',
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
                        // _this.$toast(response.data.description, {
                        //   durtaion: 200,
                        //   location: 'center' // 默认在中间
                        // });
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
                    _this.showLoading=false;
                     _this.$toast("网络不给力", {
                            durtaion: 200,
                            location: 'center' // 默认在中间
                          });
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
        .btn-box{
          padding: 1rem 0;
        }
        .btn-box a{
          width:6.0rem;
          height: 0.9rem;
          display: block;
          background-color: #50aedf;
          text-align: center;
          line-height: 0.9rem;
          margin: 0 auto;
          text-decoration: none;
          font-size: 0.32rem;
          color: #fff;
          border-radius: 0.05rem;
        }
</style>
