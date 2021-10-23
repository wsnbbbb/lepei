<template>
    <div class="content">
      <div class="item" v-for="item in list">
        <p class="title">{{item.name}}</p>
        <div v-for="(li,index) in item.list">
           <p class="title1">
          {{index+1}}. {{li.title}}
          </p>
          <div class="bar-bottom">
              <div  class="bar-top"></div>
              <span class="btn block" v-bind:pointId="li.pointId"  v-bind:score="li.score"></span>
              <span class="bar-tip"></span>
          </div>
        </div>
      </div>
      <div class="tip" v-show="showTip">
        暂无打分项！
      </div>
      <a href="javascript:;" class="submit" v-on:click.stop="submit" v-show="showSubmit">保存</a>
      <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl} from '../config/env'
export default {
    name: 'index',
    components: {
      loading
    },
    data() {
        return {
            showLoading:false,
            scoreLevel:'',
            list:[],
            showSubmit:false,
            showTip:false,
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

      if(this.isiOS()){
          window.webkit.messageHandlers.showRightToolBar.postMessage(false);
      }else{
          window.app.showRightToolBar(false);
      }

        var timer = setInterval(() => {
          if(this.user.uid&&this.user.token&&this.user.personId){
              this.init()
            window.clearInterval(timer)
          }
        }, 100);

    },

    methods:{
        postBaseInfo(result){       
          this.user.uid = JSON.parse(result)["uid"]
          this.user.token = JSON.parse(result)["token"]
        },
        postCurrentCardId(result){
          this.user.personId = result
        },
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
        init(){
            this.showLoading=true
            axios.post(baseUrl+'/teacher/quality-valuation/quotas-list', JSON.stringify({
                  uid: this.user.uid,
                  token: this.user.token,
                  personId: this.user.personId,
                  studentId: sessionStorage.getItem("personArr").split(",")
              }))
              .then(function (response) {
                  this.showLoading=false
                  if(response.data.success){
                     this.list=response.data.detail.list;
                    if(response.data.detail.length==0){
                         this.showSubmit=false;
                         this.showTip=true;
                    }else{
                         this.showSubmit=true;
                    }
                  }else{
                     this.$toast(response.data.description, {
                        durtaion: 200,
                        location: 'center' // 默认在中间
                     });
                  }
                 
                  axios.post(baseUrl+'/common/common/score-level', JSON.stringify({
                    uid: this.user.uid,
                    token: this.user.token,
                    personId:this.user.personId,
                  }))
                  .then(function (response) {
                      this.showLoading=false
                      sessionStorage.setItem("scoreLevel",JSON.stringify(response.data.detail));
                          this.$nextTick(function () {
                          //dom已更新
                          this.addEvent();
                          })

                  }.bind(this))
                  .catch(function (response) {
                    console.log(response);
                  });
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },

        addEvent(){
          var _this=this;
          // 获取节点
          var block = document.querySelectorAll(".block");
          for(let i=0;i<block.length;i++){

            var bar = document.querySelectorAll(".block")[i];
            var barTop = document.querySelectorAll(".bar-top")[i];
            var barBottom = document.querySelectorAll(".bar-bottom")[i];
            var barTip = document.querySelectorAll(".bar-tip")[i];
            var bar_width=bar.offsetWidth;
            var oW,oH;

            barBottom.addEventListener("click", function(event){
                   var e = event || window.event;
                    var left= (e.pageX || e.clientX + document.documentElement.scrollLeft || document.body.scrollLeft)-this.getBoundingClientRect().left
                    console.log(this.getBoundingClientRect().left)
                       console.log(barBottom.style.marginLeft)
                       if(left>this.offsetWidth){
                        left=this.offsetWidth
                       }else if(left<0){
                        left=0
                       }
                    block[i].style.left = left-(block[i].offsetWidth/2)+ "px";
                     document.querySelectorAll(".bar-top")[i].style.width = left+ "px";
                     var scoreLevel=JSON.parse(sessionStorage.getItem("scoreLevel"));
                      for(var m=0;m<scoreLevel.length;m++){
                          if((barBottom.offsetWidth*scoreLevel[m].start*0.01<=left)&&(left<barBottom.offsetWidth*scoreLevel[m].end*0.01)){
                            document.querySelectorAll(".bar-tip")[i].innerHTML=scoreLevel[m].name
                            document.querySelectorAll(".bar-tip")[i].style.left = barBottom.offsetWidth*scoreLevel[m].start*0.01 -0.5*document.querySelectorAll(".bar-tip")[i].offsetWidth+ "px";
                          }
                      }
                      block[i].setAttribute("score",parseInt((left/barBottom.offsetWidth)*100));
                })
            //回显数据
            var curOffLeft=(parseInt(block[i].getAttribute("score"))*barBottom.offsetWidth)/100;
            if(block[i].getAttribute("score")==-1){
              curOffLeft=0;
            }
            block[i].style.left = curOffLeft-(block[i].offsetWidth/2)+ "px";
            document.querySelectorAll(".bar-top")[i].style.width = curOffLeft+ "px";
            var scoreLevel=JSON.parse(sessionStorage.getItem("scoreLevel"));
            for(var m=0;m<scoreLevel.length;m++){
                if((barBottom.offsetWidth*scoreLevel[m].start*0.01<=curOffLeft)&&(curOffLeft<=barBottom.offsetWidth*scoreLevel[m].end*0.01)){
                  if(block[i].getAttribute("score")!=-1){
                    document.querySelectorAll(".bar-tip")[i].innerHTML=scoreLevel[m].name
                  }
                  document.querySelectorAll(".bar-tip")[i].style.left = barBottom.offsetWidth*scoreLevel[m].start*0.01 -0.5*document.querySelectorAll(".bar-tip")[i].offsetWidth+ "px";
                }
            }
        
            // 绑定touchstart事件
            block[i].addEventListener("touchstart", function(e) {
             console.log(e);
             var touches = e.touches[0];
             oW = touches.clientX - block[i].offsetLeft;
             // console.log(oW+"------")
             // oH = touches.clientY - block.offsetTop;
             //阻止页面的滑动默认事件
             document.addEventListener("touchmove",defaultEvent,false);
            },false)
           
            block[i].addEventListener("touchmove", function(e) {
             var touches = e.touches[0];
             var oLeft = touches.clientX - oW;
             var oTop = touches.clientY - oH;
             if(oLeft < 0) {
               oLeft = 0;
             }else if(oLeft > barBottom.offsetWidth) {
               oLeft = barBottom.offsetWidth;
             }
      
            block[i].style.left = oLeft-(block[i].offsetWidth/2) + "px";
            block[i].setAttribute("score",parseInt((oLeft/barBottom.offsetWidth)*100));
            document.querySelectorAll(".bar-top")[i].style.width = oLeft + "px";

            var scoreLevel=JSON.parse(sessionStorage.getItem("scoreLevel"));
            for(var m=0;m<scoreLevel.length;m++){
                if((barBottom.offsetWidth*scoreLevel[m].start*0.01<=oLeft)&&(oLeft<barBottom.offsetWidth*scoreLevel[m].end*0.01)){
                  console.log(oLeft)
                  document.querySelectorAll(".bar-tip")[i].innerHTML=scoreLevel[m].name
                  document.querySelectorAll(".bar-tip")[i].style.left = barBottom.offsetWidth*scoreLevel[m].start*0.01 -0.5*document.querySelectorAll(".bar-tip")[i].offsetWidth+ "px";
                }
            }


            },false);
             
            block[i].addEventListener("touchend",function() {
             document.removeEventListener("touchmove",defaultEvent,false);
            },false);
            function defaultEvent(e) {
              e.preventDefault();
            };
            }

        },
        submit(){
           var _this=this;
           var block = document.querySelectorAll(".block");
           var scores=[];
           for(let i=0;i<block.length;i++){
            if(parseInt(block[i].getAttribute("score"))==-1){
              this.$toast("请完成所有评分项！", {
                  durtaion: 200,
                  location: 'center' // 默认在中间
                      });
              return ;
            }
            scores.push(
                {
                  pointId:parseInt(block[i].getAttribute("pointId")),
                  score:parseInt(block[i].getAttribute("score")),
                }
              )
           }
          var studentId=sessionStorage.getItem("personArr").split(",");
          this.showLoading=true
          axios.post(baseUrl+'/teacher/quality-valuation/point-score-apply',JSON.stringify({
            uid:this.user.uid,
            token:this.user.token,
            personId:this.user.personId,
            studentId:studentId,
            scores:scores
          }))
          .then(function (response) {
              this.showLoading=false
              if(response.data.success){
                this.$confirm(
                    {
                        title: '',
                        content: '提交成功',
                        yesText: '返回',
                        noText: '确定'
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
                    // this.$router.push({ name: 'index'})
              }else{
                this.$toast(response.data.description, {
                  durtaion: 200,
                  location: 'center' // 默认在中间
                      });
                }

          }.bind(this))
          .catch(function (response) {
                _this.showLoading=false;
                _this.$toast("请求超时，请稍后重试！", {
                  durtaion: 200,
                  location: 'center' // 默认在中间
                });
                console.log(response);
          });
        }
    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content{
  padding: 0.3rem;
  background: #fff;
}
.title{
  color: #3492e9;
  font-size: 0.26rem;

}
.title1{
  color: #626262;
  font-size: 0.24rem;
  padding: 0.14rem 0 0.4rem 0;
  word-break: break-all;
}
.bar-bottom{
  width: 6.7rem;
  height: 0.15rem;
  /*background-color: #e5e5e5;*/
  position: relative;
  /*margin: 0 auto;*/
  margin: 0.14rem auto;
  background-image: url(../assets/bg12.jpg);
  background-size: 100%;
}
.bar-top{
  width: 0px;
  height: 0.15rem;
  background-color: #63c6f5;
  background-image: url(../assets/bg13.jpg);
  background-size: 6.7rem 0.15rem ;
}
.btn{
  display: block;
  width: 0.35rem;
  height: 0.55rem;
  /*background-color:red;*/
  position: absolute;
  left: 0;
  top: -0.2rem;
  z-index: 9999;
}
.bar-tip{
  background-color: #3492e9;
  color: #fff;
  display: block;
  font-size: 0.24rem;
  padding:0.0rem 0.05rem;
  position: absolute;
  left: 0;
  bottom: 0.25rem;
  border-radius: 0.08rem;
  z-index: 998;
  /*width: 0.44rem;*/
  /*height: 0.32rem;*/
  text-align: center;
}
.item{
  padding-bottom: 0.5rem;
}
.submit{
  display: block;
  width: 5.0rem;
  height: 0.8rem;
  background-color: #4fc2f3;
  border-radius: 0.1rem;
  text-align: center;
  line-height: 0.8rem;
  color: #fff;
  font-size: 0.28rem;
  text-decoration: none;
  margin: 2rem auto;
}
.tip{
  font-size: 0.3rem;
  text-align: center;
  padding-top: 2rem;
}
</style>
