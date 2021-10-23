<template>
    <div>
        <div class="tab-bar" v-show="isShowTab" v-bind:class="{ show3tab: isShow3tab }">
            <a href="javascript:;" v-show="isShowExamineTab" v-bind:class="{ active: isActive==1 }" v-on:click.stop="fetchData2(1)">我的审批</a>
            <a href="javascript:;" v-bind:class="{ active: isActive==2 }"  v-on:click.stop="fetchData1(2)">我的申请</a>
            <a href="javascript:;" v-show="isShowAdminTab" v-bind:class="{ active: isActive==3 }" v-on:click.stop="fetchData3(3)">抄送给我</a>
        </div>
        
        <div class="list-wrap">
            <!-- <scroller :on-infinite="infinite" ref="myscroller"> -->
            <div class="top-box" v-show="isShowBlankBox"> 
              
            </div>
                <!-- 我的审批 -->
               <div class="list" v-for="item in examinelist" v-on:click.stop="openUrlExamine(item.id,item.applyPerson,item.portrait,true,true,item.portrait,item.applyPerson,item.applyTime,item.applyPersonId)" v-bind:id="item.id">
                   <div class="list-top">
                       <div class="list-t-l">
                           <img v-bind:src="item.portrait" alt="" :onerror="errorImg01">
                       </div>
                        <div class="list-t-r">
                           <p class="list-t-r-name">{{item.applyPerson}}</p>
                           <p class="list-t-r-time">{{item.applyTime}}</p>
                       </div>
                   </div>
                   <div class="list-bottom">
                       <p>{{item.propertyMaterial}}</p>
                   </div>
                   <div class="list-mark">
                       <img v-if='item.status==1' src='../assets/icon-3.png' alt="">
                       <img v-if='item.status==2' src='../assets/icon-3.png' alt="">
                       <img v-if='item.status==3' src='../assets/icon-2.png' alt="">
                       <img v-if='item.status==4' src='../assets/icon-1.png' alt="">
                       <img v-if='item.status==5' src='../assets/icon1.png' alt="">
                       <img v-if='item.status==6' src='../assets/icon-6.png' alt="">
                   </div>
               </div>
                <!-- 我的申请 -->
                <div class="list" v-for="item in applylist" v-on:click.stop="openUrlMyApply(item.id,item.applyPerson,false,false,item.portrait,item.applyTime)" v-bind:id="item.id">
                   <div class="list-top">
                       <div class="list-t-l">
                           <img v-bind:src="item.portrait" alt="" :onerror="errorImg01">
                       </div>
                        <div class="list-t-r">
                           <p class="list-t-r-name">{{item.applyPerson}}</p>
                           <p class="list-t-r-time">{{item.applyTime}}</p>
                       </div>
                   </div>
                   <div class="list-bottom">
                       <p>{{item.propertyMaterial}}</p>
                   </div>
                   <div class="list-mark" v-bind:status="item.status">
                       <img v-if='item.status==1' src='../assets/icon-3.png' alt="">
                       <img v-if='item.status==2' src='../assets/icon-4.png' alt="">
                       <img v-if='item.status==3' src='../assets/icon-2.png' alt="">
                       <img v-if='item.status==4' src='../assets/icon-1.png' alt="">
                       <img v-if='item.status==5' src='../assets/icon1.png' alt="">
                       <img v-if='item.status==6' src='../assets/icon-6.png' alt="">
                   </div>
               </div>

                <!-- 抄送给我 -->
                <div class="list" v-for="item in adminlist" v-on:click.stop="openUrl(item.id,item.applyPerson,true,true,item.portrait,item.applyTime,item.applyPersonId)" v-bind:id="item.id">
                   <div class="list-top">
                       <div class="list-t-l">
                           <img v-bind:src="item.portrait" alt="" :onerror="errorImg01">
                       </div>
                        <div class="list-t-r">
                           <p class="list-t-r-name">{{item.applyPerson}}</p>
                           <p class="list-t-r-time">{{item.applyTime}}</p>
                       </div>
                   </div>
                   <div class="list-bottom">
                       <p>{{item.propertyMaterial}}</p>
                   </div>
                   <div class="list-mark">
                    
                       <img v-if='item.status==3' src='../assets/icon2.png' alt="">
                        <img v-if='item.status==5' src='../assets/icon1.png' alt="">
                        <img v-if='item.status==6' src='../assets/icon3.png' alt="">
                   </div>
               </div>
               <div class="no-data-tip" v-show="isShowNoData">
                  暂无数据！
               </div>

            <!-- </scroller> -->
                <div class="add-btn" v-on:click.stop="add()">
                    <img src="../assets/icon-add.png" alt="">
                </div>
          
               <loading v-show="showLoading"> </loading>
            </div>
   
        <!-- 筛选浮层 -->
        <div class="filter"  @touchmove.prevent v-bind:class="{ showFilter: isShowFilter }">
           <div class="filter-mask" v-show="isShowMask" v-on:click.stop="toggle()" >
                
           </div>
           <div class="filter-box">
               <p>姓名筛选</p>
               <div class="input-box"> 
                   <img src="../assets/icon-search.png" alt="">
                   <input type="text" placeholder="请输入申请人姓名或物品名称" v-model="searchText"  ref="searchinput">
               </div>
               <p>状态筛选</p>
               <div class="status-box" id="status-box" v-show="isActive==1">
                   <p>
                       <span class="status-item" v-bind:class="{ active_item: status==0 }" v-on:click.stop="filterStatus(0)">全部</span>
                   </p>
                   <p>
                        <span class="status-item" v-bind:class="{ active_item: status==1}" v-on:click.stop="filterStatus(1)">待审批</span>
                        <!-- <span class="status-item" v-bind:class="{ active_item: status==2 }" v-on:click.stop="filterStatus(2)">审核中</span>  -->
                        <span class="status-item" v-bind:class="{ active_item: status==3 }" v-on:click.stop="filterStatus(3)">已通过</span> 
                        <span class="status-item" v-bind:class="{ active_item: status==4 }" v-on:click.stop="filterStatus(4)">未通过</span>
                   </p>
               </div>
               <div class="status-box" v-show="isActive==2">
                   <p>
                       <span class="status-item" v-bind:class="{ active_item: status==0 }" v-on:click.stop="filterStatus(0)">全部</span>
                   </p>
                   <p>
                        <span class="status-item" v-bind:class="{ active_item: status==1 }" v-on:click.stop="filterStatus(1)">待审批</span> 
                        <span class="status-item" v-bind:class="{ active_item: status==2 }" v-on:click.stop="filterStatus(2)">审批中</span> 
                        <span class="status-item" v-bind:class="{ active_item: status==3 }" v-on:click.stop="filterStatus(3)">已通过</span>
                        <!-- <span class="status-item" v-bind:class="{ active_item: status==3 }" v-on:click.stop="filterStatus(3)">已领取</span> -->
                    <p>
                        <span class="status-item" v-bind:class="{ active_item: status==4 }" v-on:click.stop="filterStatus(4)">未通过</span>
                    </p>
                   </p>
               </div>
               <div class="status-box" v-show="isActive==3">
                   <p>
                       <span class="status-item" v-bind:class="{ active_item: status==0 }" v-on:click.stop="filterStatus(0)">全部</span>
                   </p>
                   <p>
                        <!-- <span class="status-item" v-bind:class="{ active_item: status==3 }" v-on:click.stop="filterStatus(3)">未通知</span>  -->
                        <span class="status-item" v-bind:class="{ active_item: status==5 }" v-on:click.stop="filterStatus(5)">待发放</span> 
                        <span class="status-item" v-bind:class="{ active_item: status==6 }" v-on:click.stop="filterStatus(6)">已发放</span>
                   </p>
               </div>
               <div class="btn-box" id="btn-box">
                   <a href="javascript:;" class="btn-cancel" v-on:click.stop="toggle()">取消</a>
                   <a href="javascript:;" class="btn-comfirm" v-on:click.stop="fetchFilterData()">确定</a>
               </div>
           </div>
        </div>

        <!-- 切换按钮 -->
  <!--       <div class="toggle">
            <a href="javascript:;" v-on:click.stop="toggle()" >点击切换</a>
        </div> -->
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
            isShowTab:false,
            isShow3tab:false,
            isActive:1,
            showLoading:true,
            list:[],
            examinelist:[],
            applylist:[],
            adminlist:[],
            isShowFilter:false,
            isShowMask:false,
            status:0,
            searchText:"",
            isShowNoData:false,
            errorImg01: 'this.src="' + require('../assets/portrait-default.png')+ '"',
            isShowBlankBox:false,
            isShowExamineTab:false,
            isShowAdminTab:false,
            isShowBL:false,
            user: {}
            // isShowComfirmBtn:true
        }
    },
    mounted(){
        document.title = '物品申领'
        var w = document.documentElement.clientWidth || document.body.clientWidth;
        var h = document.documentElement.clientHeight || document.body.clientHeight;
        var h1=document.getElementById("status-box").offsetTop;
        var h2=document.getElementById("status-box").offsetHeight;
        console.log(w);
        console.log(h);
        console.log(document.getElementById("status-box").offsetTop);
        console.log(document.getElementById("status-box").offsetHeight);
        console.log(document.getElementById("btn-box").offsetHeight);

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
            this.auth();
            window.clearInterval(timer)
          }
        }, 100);

        if(this.isiOS()){
        window.webkit.messageHandlers.showRightToolBar.postMessage(true);
        }else{
        window.app.showRightToolBar(true);
        }
        window.toggle=this.toggle;

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
        auth(){
            axios.post(baseUrl+'/teacher/material-claim/auth', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token: this.user.token,
              }))
              .then(function (response) {
                  console.log(response);
                  if(response.data.success){
                    sessionStorage.setItem("administration",response.data.detail.administration)
                    if(response.data.detail.administration&&response.data.detail.examine){
                          this.isShowTab=true;
                          this.isShow3tab=true;
                          this.isShowBlankBox=true;
                          this.isShowExamineTab=true;
                          this.isShowAdminTab=true;
                          // this.fetchData2();

                    }else if(response.data.detail.administration||response.data.detail.examine){
                          console.log("2");
                       
                          this.isShowTab=true;
                          this.isShow3tab=false;
                          this.isShowBlankBox=true;

                          if(response.data.detail.administration){
                            this.isShowAdminTab=true;
                            this.isActive=2;
                            // this.fetchData1();
                          }else{
                            this.isShowExamineTab=true;
                            this.isActive=1;
                            // this.fetchData2();
                          }
                         
                    }else{
                          console.log("3");
                         this.isShowTab=false;
                         this.isShow3tab=false;
                         // this.fetchData1();
                         this.isActive=2;
                    }

                    if(sessionStorage.getItem("isActive")!=null){
                      this.isActive=sessionStorage.getItem("isActive")
                    }
                    
                    if(this.isActive==1){
                      this.fetchData2();
                    }else if(this.isActive==2){
                      this.fetchData1();
                    }else{
                       this.fetchData3();
                    }
                    // debugger;
                }else{
                   try {
                        window.app.onResultError(response.data.code, response.data.description)
                    } catch (e) {
                        // mui.toast(data.description)
                        this.$toast(response.data.description, {
                        durtaion: 200,
                        location: 'center' // 默认在中间
                            });
                        }
                    }
                       
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        fetchData1(type){
            this.showLoading=true;
            this.examinelist=[];
            this.applylist=[];
            this.adminlist=[];
            this.isActive=2;
            sessionStorage.setItem("isActive",2);
            axios.post(baseUrl+'/teacher/material-claim/apply-list', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token: this.user.token,
                name:"",
                status:0,
                page:1,
                pageSize:100
              }))
              .then(function (response) {
                console.log(response);
                 this.showLoading=false;
                if(response.data.success){
                    // this.isActive=2;
                    this.applylist=response.data.detail;
                    if(response.data.detail.length==0){
                      this.isShowNoData=true;
                    }else{
                      this.isShowNoData=false;
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
        fetchData2(type){
            this.showLoading=true;
            this.examinelist=[];
            this.applylist=[];
            this.adminlist=[];
            this.isActive=1;
            sessionStorage.setItem("isActive",1);
             axios.post(baseUrl+'/teacher/material-claim/examine-list', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token: this.user.token,
                name:"",
                status:0,
                page:1,
                pageSize:100
              }))
              .then(function (response) {
                // console.log(response);
                // this.isActive=1;
                this.showLoading=false;
                if(response.data.success){
                  this.examinelist=response.data.detail;
                  if(response.data.detail.length==0){
                    this.isShowNoData=true;
                  }else{
                    this.isShowNoData=false;
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
        fetchData3(type){
                this.showLoading=true;
                this.examinelist=[];
                this.applylist=[];
                this.adminlist=[];
                this.isActive=3;
                sessionStorage.setItem("isActive",3);
             axios.post(baseUrl+'/teacher/material-claim/admin-list', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token: this.user.token,
                name:"",
                status:0,
                page:1,
                pageSize:100
              }))
              .then(function (response) {
                // console.log(response);
                // this.isActive=3;
                this.showLoading=false;
                if(response.data.success){
                    this.adminlist=response.data.detail;
                    if(response.data.detail.length==0){
                      this.isShowNoData=true;
                    }else{
                      this.isShowNoData=false;
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
        ////跳转到详情页面，传递参数id
        openUrlExamine(id,person,portrait,isShowBtn,isShowApplyPerson,portraitUrl,name,time,applyPersonId){
            this.$router.push({name:'detailExamine',params: {id:id,person:person,isShowBtn:isShowBtn,isShowApplyPerson:isShowApplyPerson,portraitUrl:portraitUrl,name:name,time:time,applyPersonId:applyPersonId}})
        },
        //跳转到详情页面，传递参数id
        openUrl(id,person,isShowBtn,isShowApplyPerson,portraitUrl,applyTime,applyPersonId){
            this.$router.push({name:'detail',params: {id:id,person:person,isShowBtn:isShowBtn,isShowApplyPerson:isShowApplyPerson,portraitUrl:portraitUrl,applyTime:applyTime,applyPersonId:applyPersonId}})
        },
          //跳转到我的申请详情页面，传递参数id
        openUrlMyApply(id,person,isShowBtn,isShowApplyPerson,portraitUrl,applyTime){
            this.$router.push({name:'detailMyapply',params: {id:id,person:person,isShowBtn:isShowBtn,isShowApplyPerson:isShowApplyPerson,portraitUrl:portraitUrl,applyTime:applyTime}})
        },
        add(){
            this.$router.push({name:'add'})
        },
        //切换筛选
        toggle(){
            this.isShowFilter=!this.isShowFilter;
            this.isShowMask=!this.isShowMask;
            this.status=0;
            this.searchText="";
            this.$refs.searchinput.blur();
        },
        //选择状态，全部、待审批、已通过、未通过
        filterStatus(status){
            console.log(status);
            this.status=status
        },
        //点确定，获取筛选数据
        fetchFilterData(){
            this.showLoading=true;
            this.isShowFilter=!this.isShowFilter;
            this.isShowMask=!this.isShowMask;
            let port='';
            console.log(this.isActive);
            switch(this.isActive){
                case 1: 
                    port='/teacher/material-claim/examine-list';
                    break;
                case 2: 
                    port='/teacher/material-claim/apply-list';
                    break;
                case 3: 
                    port='/teacher/material-claim/admin-list';
                    break;
                // default : port='/teacher/material-claim/examine-list';
            }
            axios.post(baseUrl+port, JSON.stringify({
                personId:this.user.personId,
                uid:this.user.uid,
                token:this.user.token,
                name:this.searchText,
                status:this.status,
                page:1,
                pageSize:100
              }))
              .then(function (response) {
                // console.log(response);
                this.showLoading=false;
                this.examinelist=[];
                this.applylist=[];
                this.adminlist=[];
                switch(this.isActive){
                    case 1: 
                        this.examinelist=response.data.detail;
                        break;
                    case 2: 
                        this.applylist=response.data.detail;
                        break;
                    case 3: 
                        this.adminlist=response.data.detail;
                        break;
                }
                if(response.data.detail.length==0){
                  this.isShowNoData=true;
                }else{
                  this.isShowNoData=false;
                }
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        setStatus(status){
          this.isShowComfirmBtn=status;
        },
        infinite(done) {
                // console.log(this.noData)
                // if(this.noData) {
                // setTimeout(()=>{
                    this.$refs.myscroller.finishInfinite(2);
                // })
                // return;
                // }
                // let self = this;
                // let start = this.moveList.length;

                setTimeout(() => {
                    // for(let i = start + 1; i < start + 10; i++) {
                    //     self.moveList.push(i)
                    // }
                    // if(start > 30) {
                    //     self.noData = "没有更多数据"
                    // }
                    self.$refs.myscroller.resize();
                    done()
                }, 1500)

        },
        refresh() {
            console.log('refresh')
        }
    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .btn-cancel{
        background-color: #f4f4f4;
        border: 1px solid #e4e4e4;
        color: #777777;
        float: left;
    }
    .btn-comfirm{
        background-color: #4fc2f3;
        border: 1px solid #4fc2f3;
        color: #fff;
        float: right;
    }
     .btn-box {
        padding: 0 0.5rem;
        overflow: hidden;
        margin-top: 4rem;
        /*position: absolute;*/
    /*    bottom: 0.7rem;
        left: 0;
        right: 0;*/
     }
     .bl{
      border-right: 1px solid red;
     }
    /* .list-wrap{
        padding-top: 0.76rem;
     }*/
     ._v-container{
/*        position: absolute;
        top: 0.76rem;
        bottom: 0;
        left: 0;
        right: 0;
        padding-bottom: 2rem;*/
        /*box-sizing: border-box;*/
     }
._v-container>._v-content{
        padding-bottom: 2rem;
        padding-top: 2rem;
        box-sizing: border-box;
     }
    .btn-box a{
        width: 2.1rem;
        height: 0.85rem;
        display: inline-block;
        font-size: 0.32rem;
        text-align: center;
        line-height: 0.85rem;
        text-decoration:none;
        border-radius: 0.1rem;
    }
    .status-box{
        padding-top:0.2rem; 
    }
 
     .status-box p{
        overflow: hidden;
    }

    .status-item{
        height: 0.6rem;
        width:1.55rem;
        background-color: #eeeeee;
        display: inline-block;
        line-height: 0.6rem;
        text-align:center;
        font-weight: 400;
        color: #626262;
        font-size: 0.26rem;
        border-radius: 0.05rem;
        float: left;
        margin:0 0.08rem;
        border: 1px solid #fff;
    }
    .status-box p>.status-item{
        margin-top: 0.15rem;
        margin-bottom: 0.15rem;
    }
    .active_item{
        border: 1px solid #53b6e0;
        background: #fff;
        background:url(../assets/select-bg.png);
        background-repeat: no-repeat;
        background-position: right bottom;
        background-size: 20%;
        color: #53b6e0;
    }
    .input-box{
        background-color: #eeeeee;
        overflow: hidden;
        height: 0.6rem;
        border-radius: 0.05rem;
        padding-left: 0.3rem;
        position: relative;
        margin: 0.35rem 0rem;
    }
    .input-box img{
        width:0.29rem;
        height: 0.31rem;
        display: block;
        /*float: left;*/
        position: absolute;
        top:50%;
        margin-top: -0.155rem;
   
    }
     .input-box input{
        width: 100%;
        float: left;
        border:none;
        height: 0.6rem;
        background-color: transparent;
        margin-left: 0.6rem;
        outline: none;
        -webkit-appearance: none;
        border-radius: 0;
        color: #a1a1a1;
        font-size: 0.26rem;
    }
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {   
     /* WebKit browsers */   
        color: #a1a1a1;   
    }   
    input:-moz-placeholder, textarea:-moz-placeholder {   
    /* Mozilla Firefox 4 to 18 */   
        color: #a1a1a1;   
    }   
    input::-moz-placeholder, textarea::-moz-placeholder {   
         /* Mozilla Firefox 19+ */   
        color: #a1a1a1;   
    }   
    input:-ms-input-placeholder, textarea:-ms-input-placeholder {   
     /* Internet Explorer 10+ */   
        color: #a1a1a1;   
    } 
    .toggle{
        position: fixed;
        z-index: 99999999;
        font-size: 0.12rem;
        left: 10px;
        bottom: 50px;

    }
    .filter{
     
        background-color:#ccc;
        top:0;
        /*position: relative;*/

    }
    .filter-mask{
        position: fixed;
        left: 0;
        top:0;
        height: 100%;
        width:100%;
        bottom: 0;
        right: 0;
        background-color: rgba(0,0,0,0.4);
        z-index: 9992;
    }
    .filter-box{
        position: fixed;
        top: 0;
        bottom: 0;
        height: 100%;
        width:5.8rem;
        background: #fff;
        z-index: 9993;
        right: -5.8rem;
        transition: right 0.125s linear;
        padding: 0.3rem 0.2rem;
        box-sizing: border-box;
    
    }
    .filter-box p{
        font-size: 0.26rem;
        font-weight: 700;
        color: #616161;
        /*padding-bottom: 0.35rem;*/
    }
    .showFilter  .filter-box{
        right: 0rem;
    }
    .tab-bar{
        clear: both;
        overflow: hidden;
        background: #fff;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
        width: 100%;
    }
    .tab-bar>a{
        /*display: inline-block;*/
        width: 50%;
        height: 0.76rem;
        font-size: 0.28rem;
        float: left;
        text-align:center;
        line-height: 0.76rem;
        text-decoration: none;
        color: #5e5e5e;
        border-bottom: 1px solid #c3c3c3;
      
        box-sizing:border-box;
    }
    .show3tab>a{
        width: 33.33%;
    }
    .show3tab a:nth-child(2){
          border-right: 1px solid #c3c3c3;
    }
    .tab-bar .active{
        color:#418acf;
        border-bottom: 2px solid #418acf;
    }
    .tab-bar a:first-child{
          border-right: 1px solid #c3c3c3;
    }
    .tab-bar a:nth-child(2){
          border-right: 1px solid #c3c3c3;
    }
    .list-wrap{
        /*padding-top: 0.14rem;*/
        height: 100%;
    }
    .list{
        background-color: #fff;
        position: relative;
        margin-top: 0.15rem;
    }
    .list-mark{
        position: absolute;
        right: 0;
        top: -0.08rem;
        z-index: 99;
    }
    .list-mark img{
        width: 1.0rem;
        height: 0.9rem;
        display: block;
    }
    p{
        text-align:left;
    }
    .list-t-l{
      float: left;
      margin-right: 0.1rem;
    }
    .list-t-r{
      float: left;
    }
    .list-t-r-name{
        font-size: 0.26rem;
        color: #7b7b7b;
        padding: 0.06rem 0;
    }
    .list-t-r-time{
        font-size: 0.20rem;
        color: #7b7b7b;
    }
    .list-top{
        overflow: hidden;
        padding-bottom: 0.16rem;
       }
    .list-top .list-t-l img{
        width: 0.7rem;
        height: 0.7rem;
        display: block;
        border-radius: 0.35rem;
        overflow: hidden;
    }
    .list{
        padding: 0.2rem 0.25rem;
    }
    .list .list-bottom p{
        word-wrap:break-word;  
        word-break:break-all;
        color: #838383;
        font-size: 0.24rem;
        text-align: left;
    }
    .add-btn{
        position: fixed;
        right: 0.55rem;
        bottom: 0.8rem;
        z-index: 999;
    }
    .add-btn img{
        width: 1.2rem;
        height: 1.2rem;
        display: block;
    }
.top-box{
  height: 0.76rem;
}
.no-data-tip{
  color: #838383;
  font-size: 0.32rem;
  text-align: center;
  padding: 3rem 0;
}

/* html,body{
    position:relative;
    height:100%;
    min-height:100%;
}*/
</style>
