<template>
    <div>
          <div class="header">
              <div class="h-left">
                  <img src="../assets/icon_coures.png" alt="" v-show="!img">
                   <!-- <img src="../assets/icon_coures.png" alt=""> -->
                   <img v-bind:src=img  alt="" v-show="!!img">
              </div>
              <div class='h-right'>
                <p class='h-r-title'>
                  {{title}}
                </p>
                 <p class='h-r-name'>
                  {{teacherName}}
                </p>
              </div>
          </div>
          <div class="main-content">
              <p class="main-common">
                上课时间：{{classBeginTime}}
              </p>
              <p class="main-common">
                上课地点：{{classroom}}
              </p>
              <p class="main-common">
                报名人数（报名/限额）：{{status==0?0:applyPerson}} /{{totalPerson}}
              </p>
               <p class="main-common">
                报名起止时间：{{applyTime}}
              </p>
               <p class="main-common main-common-des">
                课程简介：<span v-html="description"></span>
                <!-- {{description}} -->
              </p>
          </div>
          <div class="blank-box">
            
          </div>
          <div class="btn-box">
              <template v-if="status==0" >
                  <a href="javascript:;" class="btn-a hasSelect" v-if="status==0" v-on:click.stop="">暂未开始</a>
              </template >
              <template v-else-if="status==-1" >
                  <a href="javascript:;" class="btn-a hasSelect" v-on:click.stop=" ">报名结束</a>
              </template >
              <template v-else-if="status==1" >
                  <div v-if="hasSelectedFull">
                       <a href="javascript:;" class="btn-a hasSelect" v-if="hasSelect==true" v-on:click.stop="clickBtn(hasSelect)">取消报名</a>
                       <a href="javascript:;" class="btn-a hasSelect" v-else v-on:click.stop="">名额已满</a>
                  </div>
                  <div v-else>
                       <a href="javascript:;" class="btn-a" v-if="(hasSelect==false)" v-on:click.stop="clickBtn(hasSelect)">立即报名</a>
                       <a href="javascript:;" class="btn-a hasSelect" v-if="(hasSelect==true)" v-on:click.stop="clickBtn(hasSelect)">取消报名</a>
                  </div>
              </template >
          </div>
          <!--  <div class="btn-fresh" v-on:click.stop="refresh">
              刷新
          </div> -->
        <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {indexUrl,baseUrl,websocketUrl} from '../config/env'
export default {
    name: 'index',
    components: {
      loading
    },
    data() {
        return {
            showLoading:false,
            title:"",
            teacherName:'',
            classBeginTime:'',
            classroom:'',
            totalPerson:'',
            applyPerson:'',
            applyTime:'',
            description:'',
            hasSelect:'',
            status:'',
            img:'../assets/icon_coures.png',
            timer:'',
            hasSelectedFull:'',
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
     
        var timer = setInterval(() => {
          if(this.user.uid&&this.user.token&&this.user.personId){
            this.init();
            this.websocket();
            window.clearInterval(timer)
          }
        }, 100);

        window.refresh=this.refresh;

    },
    updated:function() {
        let imgs=document.getElementsByClassName("main-common-des")[0].getElementsByTagName("img");
        for(let i=0;i<imgs.length;i++){
          imgs[i].style.width='100%';
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
        websocket () {
           let ws = new WebSocket(websocketUrl)
           ws.onopen = () => {
                // Web Socket 已连接上，使用 send() 方法发送数据
                ws.send(JSON.stringify({personId: this.user.personId}))
                console.log('数据发送中...')
            }
            ws.onmessage = evt => {
              console.log('数据已接收...')
              if(JSON.parse(evt.data).id==sessionStorage.getItem("courseId")){
                this.applyPerson=JSON.parse(evt.data).list.applyPerson
                this.totalPerson=JSON.parse(evt.data).list.totalPerson
                console.log("11")
              }
              
            }
            ws.onclose = function () {
              // 关闭 websocket
              console.log('连接已关闭...')
            }
           
      },
      init(){
  
         this.showLoading=true;
          axios.post(baseUrl+'/parent/community-course/detail', JSON.stringify({
              uid: this.user.uid,
              personId: this.user.personId,
              token: this.user.token,
              courseId: sessionStorage.getItem("courseId")
              
          }))
          .then(function (response) {
              this.showLoading=false;
              console.log(response);
              if(response.data.success){
                  this.title=response.data.detail.title;
                  this.teacherName=response.data.detail.teacherName;
                  this.classBeginTime=response.data.detail.classBeginTime;
                  this.classroom=response.data.detail.classroom;
                  this.totalPerson=response.data.detail.totalPerson;
                  this.applyPerson=response.data.detail.applyPerson;
                  this.applyTime=response.data.detail.applyTime;
                  this.description=response.data.detail.description;
                  this.hasSelect=response.data.detail.hasSelect;
                  this.status=response.data.detail.status;
                  this.img=response.data.detail.img;
                  this.hasSelectedFull=response.data.detail.hasSelectedFull;

                  var _this=this;
                  window.clearInterval(_this.timer); 
                  if(response.data.detail.surplusTime==0) return false;
                  var surplusTime=response.data.detail.surplusTime*1000
                  _this.timer=setTimeout(function(){
                      _this.status=1
                  },surplusTime);
             
              }else{
                  this.$toast(response.data.description, {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                  });
              }
          }.bind(this))
          .catch(function (response) {
            this.showLoading=false;
            console.log(response);
          });
        },
        
      clickBtn(hasSelect){

        let portStr=!hasSelect?"/parent/community-course/select":"/parent/community-course/cancel-select";
        var _this=this;
        if(hasSelect){
            this.$confirm(
              {
                  title: '',
                  content: '是否取消报名？',
                  yesText: '否',
                  noText: '是'
              }).then(
                function(){
                  console.log("ok")
                }
              ).catch(
                function(){
                  console.log('点了取消')
                  _this.select(portStr);
                }
            );
        }else{
            _this.select(portStr);
        }
       
      },
      select(portStr){
        this.showLoading=true;
        axios.post(baseUrl+portStr, JSON.stringify({
              uid: this.user.uid,
              personId: this.user.personId,
              token: this.user.token,
              courseId: sessionStorage.getItem("courseId")
          }))
          .then(function (response) {
              this.showLoading=false;
              console.log(response);
              if(response.data.success){
                  this.status=response.data.detail.status;
                  this.applyPerson=response.data.detail.applyPerson;
                  this.totalPerson=response.data.detail.totalPerson;
                  this.hasSelect=response.data.detail.hasSelect;
                  this.hasSelectedFull=response.data.detail.hasSelectedFull;

                  let toastStr=response.data.detail.hasSelect==false?"报名已取消":"报名成功"
                   this.$toast(toastStr, {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                  });
              }else{
                  this.$toast(response.data.description, {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                      });
                  }
          }.bind(this))
          .catch(function (response) {
            this.showLoading=false;
            console.log(response);
          });
      },
      refresh(){
        this.init();
      }

    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header{
    background: #fff;
    width: 7.0rem;
    margin: 0 auto;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    padding: 0.15rem;
    box-sizing: border-box;
    border-radius: 0.1rem;
  }
  .header::after{
    display: block;
    content: "";
    line-height: 0;
    height: 0;
    clear: both;
    font-size: 0;
  }
  .h-left{
    width: 1.2rem;
    height: 1.2rem;
    display: block;
    float: left;
  }
  .h-left>img{
    width: 1.2rem;
    height: 1.2rem;
    display: block;
  }
  .h-r-title{
  color: #626262;
  font-size: 0.32rem;
  }
  .h-right{
    float: left;
    padding-left: 0.16rem;
    width: 5.0rem;


  }
  .h-r-title{
    padding-top: 0.12rem;
    color: #626262;
    font-size: 0.32rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .h-r-name{
    padding-top: 0.1rem;
    font-size: 0.28rem;
    color: #7b7b7b;
     white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .main-content{
    padding: 0.3rem;
    width: 7.0rem;
    box-sizing: border-box;
    background: #fff;
    margin: 0 auto;
    border-radius: 0.1rem;
  }
  .main-common{
    font-size: 0.28rem;
    color: #7b7b7b;
    line-height: 0.5rem;
    /*padding-bottom: 2rem;*/
  }
   
  .btn-box{
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0.2rem 0;
    width: 100%;
    background: #fff;
  }
  .btn-box a{
    width: 6.6rem;
    height: 0.9rem;
    background: #4fa4f3;
    color: #fff;
    font-size: 0.3rem;
    display: block;
    margin: 0 auto;
    text-align: center;
    line-height: 0.9rem;
    text-decoration: none;
    border-radius: 0.9rem;
  }
  .btn-box>.hasSelect{
    background: #fff;
    color: #4fa4f3;
    border:1px solid #4fa4f3;
  }
  .btn-fresh{
  position: fixed;
  width: 0.6rem;
  height: 0.6rem;
  z-index: 999;
  font-size: 0.24rem;
  top: 1rem;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border-radius: 100%;
  text-align: center;
  line-height: 0.6rem;
}
.main-common img{
  width: 100%;
}
.main-common-des span p img{
  width: 100%!important;
   width: 100%;
}
img{
  width: 100%;
}
.blank-box{
  height: 2rem;
  display: block;
}
</style>
