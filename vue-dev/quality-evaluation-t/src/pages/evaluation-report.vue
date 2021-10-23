<template>
    <div>
        <div class="btn-tap-box">
          <a href="javascript:;" class="btn-tap"  v-on:click.stop="openUrl('quality-report-filter')"></a>
        </div>
        <div class="g1-box">
          <div class="title1">
            <p>总体分析</p>
          </div>
           <x-chart :id="id" :option="option"></x-chart>
          <div class="g1-tip">
              <img src="../assets/bg17.png" class="g1-img1" alt="">
              <img src="../assets/bg18.png" class="g1-img2" alt="">
              <span class="g1-s1">
                班级平均成绩
              </span>
              <span class="g1-s2">
                年级平均成绩
              </span>
          </div>
        </div>
        <div class="g2-box">
            <div class="g2-top">
                 <img src="../assets/bg19.png" class="g2-left" alt="" v-show="showLeftArrey" v-on:click.stop="last">
                 <img src="../assets/bg20.png" class="g2-right" alt="" v-show="showRightArrey" v-on:click.stop="next">
                {{className}}
              </div>
               <!-- <x-chart :id="id1" :option="option"></x-chart> -->
               <div class="g2-content">
                 <div id="g2">
                   <canvas id="canvas" width="400" height="400"></canvas>
                </div>

               <div class="g1-tip">
                  <img src="../assets/bg17.png" class="g1-img1" alt="">
                  <img src="../assets/bg18.png" class="g1-img2" alt="">
                  <span class="g1-s1">
                    班级平均成绩
                  </span>
                  <span class="g1-s2">
                    年级平均成绩
                  </span>
              </div>
        </div>
        

         </div>
         <div class="mask-container" > 
            <div class="class-box">
              <div class="class-box-item" v-for="list in semesterList">
                  <div class="class-box-li class-box-li-a" v-on:click.stop="showClass($event)">{{list.name}}
                    <span  class="class-box-li-span"></span>
                  </div>
                  <ul style="display:none;" >
                     <li class="class-box-li class-box-li-b " v-for="classItem in list.semesters" :gradeId="list.id" :semesterId="classItem.id" v-on:click.stop="choose($event)">{{classItem.name}}
                      <span ></span>
                    </li>
                   
                  </ul>
                </div>
                
            </div>
            <a href="javascript:;" class="btn-cancel" v-on:click.stop="toggle">取消</a>
            <a href="javascript:;" class="btn-comfirm"  v-on:click.stop="filterData">确定</a>
         </div>
         <div class="mask-container-mask"  @touchmove.prevent  v-on:click.stop="toggle" v-show="isShowMask"> 
         </div>
       <loading v-show="showLoading"> </loading>
       <!-- <span class="qiehuan"  v-on:click.stop="toggle">切换</span> -->
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl} from '../config/env'
import VuePickers from 'vue-pickers'
import HighCharts from 'highcharts'
import Chart from 'chart.js';
// 导入chart组件
import XChart from '../components/chart.vue'
// 导入chart组件模拟
import options from '../chart-options/options'
export default {
    name: 'index',
    components: {
      loading,
      VuePickers,
      XChart
    },
    data() {
       let option = options.bar
       // let option2 = options.g2
        return {
          showLoading:false,
          id: 'test',
          id1:'test1',
          option: option,
          option2:"",
          // showLeftArrey:false,
          // showRightArrey:false,
          className:'',
          classNameArray:'',
          classScore:'',
          currentIndex:0,
          show1:true,
          isShowMask:false,
          semesterList:[],
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
            this.drawLine();
            this.getLevel()
          window.clearInterval(timer)
        }
      }, 100);

       
    
        this.option2={
            "type": "radar",
            "data": {
                "labels": [
                    "综合", 
                    "KDA", 
                    "生存", 
                    "团战",
                    "发育",
                    "输出"
                ],
                "datasets": [ {
                    "label": "班级平均成绩",
                    "data": [28, 48, 40, 19, 96, 27],
                    "fill": true,
                    "backgroundColor": "rgba(112, 182, 241, 0.5)",
                    "borderColor": "#70b6f1",
                    "pointBackgroundColor": "rgb(54, 162, 235)",
                    "pointBorderColor": "#fff",
                    "pointHoverBackgroundColor": "#fff",
                    "pointHoverBorderColor": "rgb(54, 162, 235)",
                    "fill": true
                },
                {
                    "label": "年级平均成绩",
                    "data": [65, 59, 90, 81, 56, 55],
                    "fill": true,
                    "backgroundColor": "rgba(137,234,132,0.5)",
                    "borderColor": "#89ea84",
                    "pointBackgroundColor": "#89ea84",
                    "pointBorderColor": "#fff",
                    "pointHoverBackgroundColor": "#fff",
                    "pointHoverBorderColor": "#89ea84",
                    "fill": true
                }
                ]
            },

            options: {
                tooltips: {
                    // Disable the on-canvas tooltip
                    enabled: false
                },
                scale: {
                    ticks: {
                    //最小刻度 最大刻度 刻度的步长(长度)
                        suggestedMin: 0,
                        suggestedMax: 100,
                        stepSize: 25,
                        display:false
                    }
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 0,
                        bottom: 0
                    }
                },
                legend: {
                    display: false
                }
            }
          };
        if(this.isiOS()){
            window.webkit.messageHandlers.showRightToolBar.postMessage(true);
        }else{
            window.app.showRightToolBar(true);
        }
        window.toggle=this.toggle;

    },
    computed:{
      showLeftArrey:function(){
        if(this.currentIndex>0){
          return true;
        }else{
          return false;
        }
      },
      showRightArrey:{
          get:function(){
            if(this.currentIndex<this.classNameArray.length-1){
              return true;
            }else{
              return false;
            }
          },
          set:function(){

          }
      }
    },
    beforeCreate(){
      
    },
    methods:{
        getLevel(){
              axios.post(baseUrl+'/common/common/score-level', JSON.stringify({
                    uid: this.user.uid,
                    token: this.user.token,
                    personId: this.user.personId
              }))
              .then(function (response) {
                  this.showLoading=false
                  sessionStorage.setItem("scoreLevel",JSON.stringify(response.data.detail));
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
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
        postBaseInfo(result){       
          this.user.uid = JSON.parse(result)["uid"]
          this.user.token = JSON.parse(result)["token"]
        },
        postCurrentCardId(result){
          this.user.personId = result
        },
        openUrl(url){
          this.$router.push({ path: url})
        },
        toggle(){
          var targetObj=document.querySelectorAll(".mask-container")[0];
          if(this.hasClass(targetObj,"mask-container-show")){
            this.removeClass(targetObj,"mask-container-show")
          }else{
            this.addClass(targetObj,"mask-container-show")
          }
          this.isShowMask=!this.isShowMask;
        },
        showClass(event){
          var ns=event.currentTarget.nextElementSibling;
          ns.style.display=ns.style.display=="none"?"block":"none";
          if(this.hasClass(event.currentTarget,"class-box-li-a-active")){
            this.removeClass(event.currentTarget,"class-box-li-a-active")
          }else{
            this.addClass(event.currentTarget,"class-box-li-a-active")
          }
        },
        hasClass( elements,cName ){ 
          return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); 
        },
        addClass( elements,cName ){ 
          if( !this.hasClass( elements,cName ) ){ 
            elements.className += " " + cName; 
          }; 
        },
        removeClass( elements,cName ){ 
          if( this.hasClass( elements,cName ) ){ 
            elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" ), " " );
          }; 
        },
        choose(event){
              var nodeList=document.querySelectorAll(".class-box-li-b")
              for (var i = nodeList.length - 1; i >= 0; i--) {
                this.removeClass(nodeList[i],"class-box-li-b-active")
              }
              this.addClass(event.currentTarget,"class-box-li-b-active")
            
        },
        close(){

        },
        confirmFn(){

        },
        tap(){
          alert("123")
        },
        goBack(){
            window.history.go(-1);
        },
        last(){
          this.currentIndex--;
          if(this.currentIndex<0){
            this.currentIndex=0;
          }
           this.option2.data.datasets[0].data=this.classScore[this.currentIndex];
          this.className=this.classNameArray[this.currentIndex];
          // myRadarChart.update();
          var ctx = document.getElementById('canvas').getContext('2d');
          var canvas = document.getElementById("canvas");
          var myRadarChart = new Chart(ctx,this.option2);
        },
        next(){
          this.currentIndex++;
          if(this.currentIndex>this.classScore.length-1){
            this.currentIndex=this.classScore.length-1;
          }
          console.log(this.currentIndex)
          this.option2.data.datasets[0].data=this.classScore[this.currentIndex];
          this.className=this.classNameArray[this.currentIndex];
          // myRadarChart.update();
          var ctx = document.getElementById('canvas').getContext('2d');
          var canvas = document.getElementById("canvas");
          var myRadarChart = new Chart(ctx,this.option2);
        },
        init(){
            axios.post(baseUrl+'/teacher/quality-valuation/grade-semester-list', JSON.stringify({
              uid: this.user.uid,
              token: this.user.token,
              personId:this.user.personId
            }))
            .then(function (response) {
                this.showLoading=false;
                console.log(response);
                if(response.data.success){
                        this.semesterList=response.data.detail;
                        if(response.data.detail.length==0){
                          return;
                        }
                        var gradeId=response.data.detail[0].id;
                        var semesterId=response.data.detail[0].semesters[0].id;
                        axios.post(baseUrl+'/teacher/quality-valuation/grade', JSON.stringify({
                            uid: this.user.uid,
                            token: this.user.token,
                            teacherId:this.user.personId,
                            gradeId:gradeId,
                            semesterId:semesterId
                        }))
                        .then(function (response) {
                            this.showLoading=false;
                            console.log(response);
                            if(response.data.success){
                                var className=[];
                                var score=[];
                                for(var i=0;i<response.data.detail.classScore.length;i++){
                                  className.push(response.data.detail.classScore[i].className)
                                  score.push(response.data.detail.classScore[i].score)
                                }
                             
                                this.option.xAxis.categories=className;
                                this.option.series[0].data=score;
                                var scoreLevel=JSON.parse(sessionStorage.getItem("scoreLevel"));
                                var plotLine=[];
                                var chart1=HighCharts.chart(this.id,this.option)
                                for(var m=0;m<scoreLevel.length;m++){
                                      chart1.yAxis[0].addPlotLine(
                                                    { 
                                                      value:scoreLevel[m].start,         //在值为2的地方
                                                      width:1,                           //标示线的宽度为2px
                                                      color: '#efefef',                  //标示线的颜色
                                                      label:{
                                                          text:scoreLevel[m].name,     //标签的内容
                                                          align:'left',                //标签的水平位置，水平居左,默认是水平居中center
                                                          x:-42  ,
                                                          y:5,
                                                      }                 
                                                   }
                                      )
                                }
                                chart1.yAxis[0].addPlotLine(
                                    { 
                                      value:response.data.detail.gradeScore,         //在值为2的地方
                                      width:2,                           //标示线的宽度为2px
                                      color: '#9def99',                  //标示线的颜色
                                   }
                                )
                                var gradeQuotaScoreLabel=new Array();
                                var gradeQuotaScore=new Array();
                                for(var n=0;n<response.data.detail.gradeQuotaScore.length;n++){
                                  gradeQuotaScoreLabel.push(response.data.detail.gradeQuotaScore[n].label)
                                  gradeQuotaScore.push(response.data.detail.gradeQuotaScore[n].score)
                                }
                                this.option2.data.labels=gradeQuotaScoreLabel;
                                this.option2.data.datasets[1].data=gradeQuotaScore;
                                var classScoreArray=new Array();
                                var classNameArray=new Array();
                                for(var n=0;n<response.data.detail.classScore.length;n++){
                                  var classScoreArrayItem=new Array();
                                  for(var p=0;p<response.data.detail.classScore[n].quotaScore.length;p++){
                                      classScoreArrayItem.push(response.data.detail.classScore[n].quotaScore[p].score)
                                  }
                                  classScoreArray.push(classScoreArrayItem);
                                  classNameArray.push(response.data.detail.classScore[n].className);
                                }
                                this.classScore=classScoreArray;
                                this.option2.data.datasets[0].data=this.classScore[0];
                                this.classNameArray=classNameArray;
                                this.className=this.classNameArray[0];
                                if(response.data.detail.classScore.length>1){
                                  this.showRightArrey=true;
                                }
                                var ctx = document.getElementById('canvas').getContext('2d');
                                var canvas = document.getElementById("canvas");
                                var myRadarChart = new Chart(ctx,this.option2);

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
        filterData(){
            this.toggle();
            var gradeId=document.getElementsByClassName('class-box-li-b-active')[0].getAttribute("gradeid");
            var semesterId=document.getElementsByClassName('class-box-li-b-active')[0].getAttribute("semesterid");
         
            axios.post(baseUrl+'/teacher/quality-valuation/grade', JSON.stringify({
                            uid: this.user.uid,
                            token: this.user.token,
                            teacherId:this.user.personId,
                            gradeId:gradeId,
                            semesterId:semesterId
                        }))
                        .then(function (response) {
                            this.showLoading=false;
                            console.log(response);
                            if(response.data.success){
                                var className=[];
                                var score=[];
                                for(var i=0;i<response.data.detail.classScore.length;i++){
                                  className.push(response.data.detail.classScore[i].className)
                                  score.push(response.data.detail.classScore[i].score)
                                }
                             
                                this.option.xAxis.categories=className;
                                this.option.series[0].data=score;
                                var scoreLevel=JSON.parse(sessionStorage.getItem("scoreLevel"));
                                var plotLine=[];
                                var chart1=HighCharts.chart(this.id,this.option)
                                for(var m=0;m<scoreLevel.length;m++){
                                      chart1.yAxis[0].addPlotLine(
                                                    { 
                                                      value:scoreLevel[m].start,         //在值为2的地方
                                                      width:1,                           //标示线的宽度为2px
                                                      color: '#efefef',                  //标示线的颜色
                                                      label:{
                                                          text:scoreLevel[m].name,     //标签的内容
                                                          align:'left',                //标签的水平位置，水平居左,默认是水平居中center
                                                          x:-42  ,
                                                          y:2,
                                                          color:"red" 
                                                      }                 
                                                   }
                                      )
                                }
                                chart1.yAxis[0].addPlotLine(
                                    { 
                                      value:response.data.detail.gradeScore,         //在值为2的地方
                                      width:2,                           //标示线的宽度为2px
                                      color: '#9def99',                  //标示线的颜色
                                   }
                                )
                                var gradeQuotaScoreLabel=new Array();
                                var gradeQuotaScore=new Array();
                                for(var n=0;n<response.data.detail.gradeQuotaScore.length;n++){
                                  gradeQuotaScoreLabel.push(response.data.detail.gradeQuotaScore[n].label)
                                  gradeQuotaScore.push(response.data.detail.gradeQuotaScore[n].score)
                                }
                                this.option2.data.labels=gradeQuotaScoreLabel;
                                this.option2.data.datasets[1].data=gradeQuotaScore;
                                var classScoreArray=new Array();
                                var classNameArray=new Array();
                                for(var n=0;n<response.data.detail.classScore.length;n++){
                                  var classScoreArrayItem=new Array();
                                  for(var p=0;p<response.data.detail.classScore[n].quotaScore.length;p++){
                                      classScoreArrayItem.push(response.data.detail.classScore[n].quotaScore[p].score)
                                  }
                                  classScoreArray.push(classScoreArrayItem);
                                  classNameArray.push(response.data.detail.classScore[n].className);
                                }
                                this.classScore=classScoreArray;
                                this.option2.data.datasets[0].data=this.classScore[0];
                                  // debugger;
                                this.classNameArray=classNameArray;
                                this.className=this.classNameArray[0];
                                if(response.data.detail.classScore.length>1){
                                  this.showRightArrey=true;
                                }
                                var ctx = document.getElementById('canvas').getContext('2d');
                                var canvas = document.getElementById("canvas");
                                var myRadarChart = new Chart(ctx,this.option2);

                             
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
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            // 绘制图表
            // g2.setOption()
        }
       
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  padding: 0;
  margin:0;
}
ul,li{

  list-style-type: none;
}
.btn-tap-box{
  width: 2.5rem;
  height: 0.58rem;
  background-image: url(../assets/bg16.png);
  background-size: 100%;
  background-repeat: no-repeat;
  margin: 0.3rem auto;
  display: block;
  position: relative;
}
.btn-tap{
  display: block;
  position: absolute;
  width: 50%;
  height: 100%;
  right: 0;
  top: 0;
  z-index: 99;
}
.g1{
  width: 7.0rem;
  height: 7.3rem;
  background-color: #fff;
  border-radius: 0.1rem;
  margin: 0 auto;
}
.x-chart{
  width: 300px;
}
.title1{
  background-color: #fff;
  padding: 0.35rem 0.4rem;
}
.title1>p{
  color: #626262;
  font-size: 0.32rem;
  border-left: 2px solid #73aeea;
  padding-left: 0.1rem;
}
.g1-tip{
  background-color: #fff;
  height: 0.8rem;
  border-top: 1px solid #f5f5f9;
  position: relative;
}
.g1-tip>img{
  width: 0.23rem;
  height: 0.23rem;
  display: block;
  position: absolute;
  top: 50%;
  margin-top: -0.11rem;
}
.g1-tip>.g1-img1{
  left: 1.76rem;

}
.g1-tip>.g1-img2{
  left: 3.9rem;
  
}
.g1-tip>span{
  font-size: 0.24rem;
  color: #7b7b7b;
  position: absolute;
  display: block;
  height: 0.32rem;
  top: 50%;
  margin-top: -0.16rem;
}
.g1-s1{
  left: 2.17rem;
}
.g1-s2{
  left: 4.3rem;
}
.g2-top{
  height: 1.2rem;
  line-height: 1.2rem;
  background-color: #fff;
  /*margin-top: 0.27rem;*/
  text-align:center;
  position: relative;
  font-size: 0.3rem;
  color: #626262;
}
.g2-left{
  width: 0.68rem;
  height: 0.68rem;
  display: block;
  position: absolute;
  left: 0.57rem;
  top: 50%;
  margin-top: -0.34rem;

}
.g2-right{
  width: 0.68rem;
  height: 0.68rem;
  display: block;
  position: absolute;
  right: 0.57rem;
  top: 50%;
  margin-top: -0.34rem;

}
#g2{
  width:100%;
  /*min-height: 375px;*/
  /*margin: 0 auto;*/
}
.g2-content{
  width: 100%;
  background-color: #fff;
}
.mask-container{
  width: 5.8rem;
  height: 100%;
  background-color: #f5f5f9;
  position: fixed;
  z-index: 999;
  right: -5.8rem;
  top: 0;

}
.mask-container-show{
  right: 0;
  transition: right 0.25s;
}
.class-box-li{
  height: 1.0rem;
  width: 100%;
  line-height: 1.0rem;
  background: #fff;
  font-size: 0.28rem;
  padding-left: 0.3rem;
  color: #565656;
  position: relative;
}
.class-box-li-span{
  display: block;
  width: 0.4rem;
  height: 0.4rem;
  background-image: url(../assets/bg21.png);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  position: absolute;
  right: 0.5rem;
  top: 50%;
  margin-top: -0.2rem;
  z-index: 9999;
}
.class-box-li-b{
  background: #f5f5f9;
}
.class-box>ul{
  /*min-height: 0.4rem;*/
  /*overflow: hidden;*/
  height: 0;
  overflow: hidden;
  display: none;
}
.class-box-li-b-active>span{
  display: block;
  width: 0.42rem;
  height: 0.28rem;
  background-image: url(../assets/bg22.png);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  position: absolute;
  right: 0.5rem;
  top: 50%;
  margin-top: -0.21rem;
  z-index: 9999;
}
.class-box-item{
  margin-bottom: 1px;
}
.class-box-item>ul{
  /*display: none;*/
}
.class-box-li-a-active>span{
   transform:rotate(90deg);
   transition:ease-out 0.25s;
}
.btn-cancel{
  width: 2.1rem;
  height: 0.84rem;
  display: block;
  position: absolute;
  bottom: 0.7rem;
  text-align: center;
  line-height: 0.84rem;
  background: #f4f4f4;
  font-size: 0.3rem;
  color: #777777;
  border: 1px solid #e4e4e4;
  text-decoration: none;
  border-radius: 0.08rem;
  left: 0.6rem;
}
.btn-comfirm{
  width: 2.1rem;
  height: 0.84rem;
  display: block;
  position: absolute;
  bottom: 0.7rem;
  text-align: center;
  line-height: 0.84rem;
  background: #4fc2f3;
  font-size: 0.3rem;
  color: #fff;
  border: 1px solid #e4e4e4;
  text-decoration: none;
  border-radius: 0.08rem;
  right: 0.6rem;
}
.mask-container-mask{
  background: rgba(0,0,0,0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.qiehuan{
  position: fixed;
  z-index: 9999999;
  left: 0;
  bottom: 0.1rem;
  font-size: 0.32rem;
  color: red;
  display: block;
  background: #ccc;
}
.g1-box{
  width: 7.0rem;
  margin:  0 auto;
  border-radius: 0.1rem;
  overflow: hidden;
}
.x-bar{
  width: 100%;
  /*height: 7rem;*/
}
.g2-box{
  width: 7.0rem;
  margin: 0 auto;
  border-radius: 0.1rem;
  overflow: hidden;
  margin-top: 0.27rem;
  margin-bottom: 0.9rem;
}
.class-box{
  height: 9.0rem;
  overflow-x:hidden;
  overflow-y: scroll;
}
.highcharts-plot-line-label{
  fill: #039;
}
.highcharts-root{
  font-size: 10px!important;
}
</style>
