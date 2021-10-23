<template>
    <div>
        <div class="part-title">
            <img src="../assets/bg23.png" alt="">
            <div class="part-r">
              <p class="part-r-top">综合成绩</p>
               <p class="part-r-bottom">{{epilogue}}</p>
            </div>
        </div>
   
        <div class="g2-content">
           <div id="g2">
             <canvas id="canvas" width="300" height="300"></canvas>
           </div>

         <div class="g1-tip">
            <img src="../assets/bg17.png" class="g1-img1" alt="">
            <img src="../assets/bg18.png" class="g1-img2" alt="">
            <span class="g1-s1">
              学生成绩
            </span>
            <span class="g1-s2">
              班级平均成绩
            </span>
        </div>
       
        </div>
        <div class="g3-content">
          <p>我的成绩</p>
          <div class="g3-c-box">
              <ul >
                <li v-for="list in studentLevel">
                  <div class="top">{{list.subjectName}}</div>
                  <div>{{list.score}}</div>
                </li>
              </ul>
              <p v-show="studentLevel.length==0">暂无数据</p>
          </div>
          <hr v-show="studentLevel.length!=0">
        </div>
        <div class="g3-content g3-content-new">
          <p>学业成绩</p>
          <div class="g4-c-box">
              <x-chart :id="id" :option="option"></x-chart>
             <!-- <canvas id="canvas2" width="300" height="300"></canvas> -->
          </div>
          <div class="g1-tip">
            <img src="../assets/bg17.png" class="g1-img1" alt="">
            <img src="../assets/bg18.png" class="g1-img2" alt="">
            <span class="g1-s1">
              学生成绩
            </span>
            <span class="g1-s2">
              班级平均成绩
            </span>

          </div>
        </div>
        <div>
        <div class="part-item" v-for="(item,index) in itemArr">
            <div class="part-title">
                <img v-bind:src=item.icon alt="">
                <div class="part-r">
                  <p class="part-r-top">{{item.label}}</p>
                   <p class="part-r-bottom">{{item.epilogue}}</p>
                </div>
            </div>
            <div class="g3-content">
              <!-- <p>学术成绩</p> -->
              <div class="g4-c-box">
                  <!-- <hr class="g4-hr"> -->
                  <!-- <x-chart :id="id" :option="option" v-if="item.chartType==1"></x-chart> -->
                  <div class="canvasItem" v-if="item.chartType==1"  :id="gernerateId(index)"></div>
                 <canvas class="canvasItem" width="300" height="300" v-if="item.chartType==5"></canvas>
              </div>
            </div>
            <div class="reportFile" v-for="file in item.reportFile">
              <img src="../assets/bg26.png" alt="">
              <span>{{file.name}}</span>
              <a href="javascript:;" class="btn-preview" v-on:click="previewAttach(file.viewUrl)">预览</a>
               <!-- <a :href=file.downloadUrl class="btn-download" :download=file.name>下载</a> -->
            </div>
        </div>
        </div>


         <div class="mask-container"  @touchmove.prevent> 
            <div class="class-box">
              <div class="class-box-item">
                  <ul  >
                     <li class="class-box-li class-box-li-b "  v-for="list in semesterList" :semesterid="list.semesterId" v-on:click.stop="filterData($event)">{{list.name}}
                      <span ></span>
                      </li>
                  </ul>
                </div>
                
            </div>

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
import options1 from '../chart-options/options1'
import options from '../chart-options/options'
export default {
    name: 'index',
    components: {
      loading,
      VuePickers,
      XChart
    },
    data() {
       let option1 = options1.bar
       let option = options.bar
        return {
          showLoading:false,
          id: 'test',
          id1:'test1',
          option1: option1,
          option: option,
          option2:"",
          className:'',
          classNameArray:'',
          classScore:'',
          currentIndex:0,
          show1:true,
          isShowMask:false,
          semesterList:[],
          epilogue:'',
          subject:[],
          itemArr:[],
          studentLevel:[],
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
              this.initScore();
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
        previewAttach(url){
          console.log(url);
          window.app.openClientUrl(url);
         },
        gernerateId: function (index){
            return "box" +(index+1)
        },
        getSemesterList(){
          axios.post(baseUrl+'/teacher/quality-valuation/semester-list', JSON.stringify({
                    uid: this.user.uid,
                    token: this.user.token,
                    teacherId: this.user.personId,
                    studentId: sessionStorage.getItem("personArr")
              }))
              .then(function (response) {
                  this.showLoading=false
                  this.semesterList=response.data.detail;
                }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
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
   
        tap(){
          alert("123")
        },
        goBack(){
            window.history.go(-1);
        },

        init(){
            axios.post(baseUrl+'/teacher/quality-valuation/semester-list', JSON.stringify({
              uid: this.user.uid,
              token: this.user.token,
              teacherId: this.user.personId,
              studentId: sessionStorage.getItem("personArr")
            }))
            .then(function (response) {
                this.showLoading=false;
                console.log(response);
                if(response.data.success){
                        this.semesterList=response.data.detail;
                        if(response.data.detail.length==0){
                          return;
                        }
                        var semesterId=response.data.detail[0].semesterId;
                        this.initSynthetic(semesterId);
                        this.initQuota(semesterId);
                        this.initSubject(semesterId);
            
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

        initSynthetic(semesterId){
            axios.post(baseUrl+'/teacher/quality-valuation/synthetic', JSON.stringify({
                      uid: this.user.uid,
                      token: this.user.token,
                      teacherId: this.user.personId,
                      semesterId: semesterId,
                      studentId: sessionStorage.getItem("personArr")
                  }))
                  .then(function (response) {
                      this.showLoading=false;
                      var nodeList=document.querySelectorAll(".class-box-li-b");
                      var hasActive=false;
                      for (var i = nodeList.length - 1; i >= 0; i--) {
                        if(this.hasClass(nodeList[i],"class-box-li-b-active")){
                          hasActive=true;
                        }
                      }
                      if(!hasActive){
                        var targetObj=document.querySelectorAll(".class-box-li")[0];
                        this.addClass(targetObj,"class-box-li-b-active")
                      }
                     
                      console.log(response);
                      if(response.data.success){
                          this.epilogue=response.data.detail.epilogue;
                          var scoreLevel=JSON.parse(sessionStorage.getItem("scoreLevel"));
                          var plotLine=[];
                          var gradeQuotaScoreLabel=new Array();
                          var gradeQuotaScore=new Array();
                          for(var n=0;n<response.data.detail.class.length;n++){
                            gradeQuotaScoreLabel.push(response.data.detail.class[n].label)
                            gradeQuotaScore.push(response.data.detail.class[n].score)
                          }
                          this.option2.data.labels=gradeQuotaScoreLabel;
                          this.option2.data.datasets[1].data=gradeQuotaScore;
                          var classScoreArray=new Array();
                          for(var n=0;n<response.data.detail.student.length;n++){
                            classScoreArray.push(response.data.detail.student[n].score);
                          }
                          this.classScore=classScoreArray;
                          this.option2.data.datasets[0].data=this.classScore;
                          var ctx = document.getElementById('canvas').getContext('2d');
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
        initQuota(semesterId){
            //获取指标 图表类型(1:柱状图,2:气泡图,3:曲线图,4:饼状图,5:雷达图)
            axios.post(baseUrl+'/teacher/quality-valuation/top-quota', JSON.stringify({
                    uid: this.user.uid,
                    token: this.user.token,
                    teacherId: this.user.personId,
                    semesterId: semesterId,
                    studentId: sessionStorage.getItem("personArr")
            }))
            .then(function (response) {
                this.itemArr=response.data.detail;
                this.$nextTick(function(){ 

                for(var i=0;i<response.data.detail.length;i++){
                  var datalabels=[];
                  var datasetsData=[];
                  for(var j=0;j<response.data.detail[i].quality.length;j++){
                    datalabels.push(response.data.detail[i].quality[j].label);
                    datasetsData.push(response.data.detail[i].quality[j].score);
                  }
                  // console.log(i)
                  var data3={
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
                            "label": "",
                            "data": [28, 48, 40, 19, 96, 27],
                            "fill": true,
                            "backgroundColor": "rgba(112, 182, 241, 0.5)",
                            "borderColor": "#70b6f1",
                            "pointBackgroundColor": "rgb(54, 162, 235)",
                            "pointBorderColor": "#fff",
                            "pointHoverBackgroundColor": "#fff",
                            "pointHoverBorderColor": "rgb(54, 162, 235)",
                            "fill": true
                        }
                        ]
                    },

                    options: {
                      tooltips: {
                        enabled:false
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
                  if(response.data.detail[i].chartType==1){
                      this.option.xAxis.categories=datalabels;
                      this.option.series[0].data=datasetsData;
                      var box="box"+(i+1)
                      var chart1 =HighCharts.chart(box,this.option);
                      var scoreLevel=JSON.parse(sessionStorage.getItem("scoreLevel"));
                      var plotLine=[];
                      // var chart1=HighCharts.chart(this.id,this.option)
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
                                                color:"red" 
                                            }                 
                                         }
                            )
                      }
                  }else if(response.data.detail[i].chartType==5){
                    var canvasCtx=document.getElementsByClassName("canvasItem")[i].getContext('2d');
                    data3.data.labels=datalabels;
                    data3.data.datasets[0].data=datasetsData;
                    new Chart(canvasCtx,data3);
                  }
                }


              })   


            }.bind(this))
            .catch(function (response) {
              console.log(response);
            });
        },
        initSubject(semesterId){
          //我的成绩
            axios.post(baseUrl+'/teacher/quality-valuation/subject', JSON.stringify({
                uid: this.user.uid,
                token: this.user.token,
                teacherId: this.user.personId,
                semesterId: semesterId,
                studentId: sessionStorage.getItem("personArr")
            }))
            .then(function (response) {
                this.showLoading=false;
                if(response.data.success){
                      this.subject=response.data.detail.studentScore;
                      this.studentLevel=response.data.detail.studentLevel;
                      var data2datasets1=[];
                      var data2Labels=[];
                      for(var i=0;i<response.data.detail.class.length;i++){
                            data2datasets1.push(response.data.detail.class[i].score);
                            data2Labels.push(response.data.detail.class[i].subjectName);
                        }
                      var data2datasets2=[];
                      for(var j=0;j<response.data.detail.class.length;j++){
                          var hasThis=false
                          for(var p=0;p<response.data.detail.studentScore.length;p++){
                            if(response.data.detail.class[j].subjectName==response.data.detail.studentScore[p].subjectName){
                               data2datasets2.push(response.data.detail.studentScore[p].score);
                               hasThis=true
                            }
                          }
                          if(!hasThis){
                             data2datasets2.push(0)
                          }
                      }

                      this.option1.xAxis.categories=data2Labels;
                      this.option1.series[0].data=data2datasets2;
                      this.option1.series[1].data=data2datasets1;
                      var chart1=HighCharts.chart(this.id,this.option1);
                      var scoreLevel=JSON.parse(sessionStorage.getItem("scoreLevel"));
                      var plotLine=[];
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
                                                color:"red" 
                                            }                 
                                         }
                            )
                      }

                     // var scoreLevel=JSON.parse(sessionStorage.getItem("scoreLevel"));
                     // let maxScore=0;
                     // let maxScoreName=0;
                     //  for(let m=0;m<scoreLevel.length;m++){
                     //     if(maxScore<scoreLevel[m].end){
                     //      maxScore=scoreLevel[m].end
                     //      maxScoreName=scoreLevel[m].name
                     //    }
                     //  }
                     //  for(let i=0;i<response.data.detail.studentScore.length;i++){
                     //      for(let m=0;m<scoreLevel.length;m++){
                     //          if((response.data.detail.studentScore[i].score>=scoreLevel[m].start)&&(response.data.detail.studentScore[i].score<scoreLevel[m].end)){
                     //            response.data.detail.studentScore[i].score=scoreLevel[m].name;
                     //          }
                     //          if(response.data.detail.studentScore[i].score>=maxScore){
                     //            response.data.detail.studentScore[i].score=maxScoreName;
                     //          }
                     //      }
                     //  }

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
        initScore(){
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
        filterData(){
            var nodeList=document.querySelectorAll(".class-box-li-b")
            for (var i = nodeList.length - 1; i >= 0; i--) {
              this.removeClass(nodeList[i],"class-box-li-b-active")
              console.log(i)
              // debugger;
            }
            this.addClass(event.currentTarget,"class-box-li-b-active")
            this.toggle();
            var semesterId=event.currentTarget.getAttribute("semesterid");
            this.initSynthetic(semesterId);
            this.initQuota(semesterId);
            this.initSubject(semesterId);
   
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
  margin-top: 0.27rem;
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
  display: block;
  /*min-height: 375px;*/
  /*margin: 0 auto;*/
}
.g2-content{
  width: 7.0rem;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 0.1rem;
  overflow: hidden;
}
.mask-container{
  width: 100%;
  background-color: #f5f5f9;
  position: fixed;
  z-index: 999;
  /*right: -5.8rem;*/
  top: 0;
  display: none;
}
.mask-container-show{
  right: 0;
  /*transition: right 0.25s;*/
  display: block;
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
  background: #fff;
  margin-bottom: 1px;
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
.part-title{
  background: #fff;
  position: relative;
  min-height: 2.2rem;
  width:  7.0rem;
  margin: 0.35rem auto;
  border-radius: 0.1rem;
}
.part-title>img{
  width: 1.18rem;
  height: 1.18rem;
  display: block;
  position: absolute;
  left: 0.15rem;
  top: 50%;
  margin-top: -0.59rem;
  border-radius: 50%;
}
.part-r{
  width: 5.4rem;
  height: auto;
  /*position: absolute;*/
  margin-left:1.35rem;
  top: 0;
  padding-left: 0.15rem;
}
.part-r-top{
  font-size: 0.32rem;
  color: #434343;
  padding-top: 0.3rem;
  padding-bottom: 0.15rem;
}
.part-r-bottom{
  font-size: 0.26rem;
  color: #626262;
  word-break: break-all;
  padding-bottom: 0.1rem;
  padding-right: 0.2rem;
}
canvas{
 width: 100%;
}
.g3-content{
  /*height: 2.2rem;*/
  width: 7.0rem;
  margin: 0 auto;
  background: #fff;
  margin-top: 0.25rem;
  border-radius: 0.1rem;
  padding-top: 0.3rem;
  position: relative;
  overflow: hidden;
}
.g3-content>hr{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.74rem;
  background: #efefef;
  height:1px;
  padding: 0;
  margin: 0;
  border: none;
}
.g3-content>p{
  font-size: 0.3rem;
  color: #777777;
  margin-left: 0.35rem;
  border-left: 2px solid #73aeea;
  padding-left: 0.05rem;
}
.g3-c-box{
  width: 100%;
  overflow-x: auto; 
  margin-top: 0.3rem;
  min-height: 1.48rem;
}
.g3-c-box>ul{
  width: 1000.0rem;
  /*height: 1.48rem;*/
}
.g3-c-box>ul>li{
  float: left;
}
.g3-c-box>ul>li>div{
  font-size: 0.26rem;
  color: #777777;
  height: 0.74rem;
  line-height: 0.74rem;
  padding: 0 0.3rem;
}
.g3-c-box>ul>li>div.top{
  /*border-bottom: 1px solid #efefef;*/
  /*margin-bottom: 1px;*/
}
.g4-c-box{
    background: #fff;
    margin-top: 0.2rem;
    position: relative;
}
.part-item:last-child{
  margin-bottom: 1rem;
}
.part-item .g3-content{
  padding: 0.3rem 0;
}
.part-item .g3-content .g4-c-box{
  margin-top: 0;
}
.g4-hr{
  position: absolute;
  bottom: 0.8rem;
  z-index: 999;
  height: 1px;
  width: 100%;

}
.reportFile{
  width: 7.0rem;
  margin: 0.25rem auto;
  background: #fff;
  border-radius: 0.1rem;
    height: 1.25rem;
  line-height: 1.25rem;
  display: flex;
   align-items: center;
}
.reportFile>img{
  width: 0.3rem;
  height: 0.36rem;
  display: block;
  margin-left: 0.35rem;
  /*justify-content: center;*/

}
.reportFile>span{
  font-size: 0.26rem;
  color: #7b7b7b;
  width: 4.5rem;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 0.1rem;
  box-sizing: border-box;
  /*word-break: break-all;*/
}
.reportFile>a{
  font-size: 0.28rem;
  width: 1.3rem;
  height: 0.57rem;
  text-align: center;
  line-height: 0.57rem;
  text-decoration: none;
}
.btn-preview{
  color: #7b7b7b;
  border: 1px solid #d9d9d9;
  border-radius: 0.275rem;
  margin-right: 0.2rem;
}
.btn-download{
  color: #fff;
  border-radius: 0.275rem;
  background: #4fc2f3;
}
text{
  font-size: 0.1rem;
  fill:red;
}
.g3-c-box>p{
  text-align: center;
  color: #666;
  font-size: 0.34rem;
  padding-top: 0.2rem;

}
.g3-content-new{
  /*margin-bottom: 2.5rem;*/
}
</style>
