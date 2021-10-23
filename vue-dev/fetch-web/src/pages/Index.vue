<template>
    <div>
        <div class="tab-bar" v-show="isShowTab" v-bind:class="{ show3tab: isShow3tab }">
            <a href="javascript:;" v-bind:class="{ active: isActive==1 }" v-on:click.stop="fetchData2(1)">我的审批</a>
            <a href="javascript:;" v-bind:class="{ active: isActive==2 }" v-on:click.stop="fetchData1(2)">我的申请</a>
            <a href="javascript:;" v-show="isShow3tab" v-bind:class="{ active: isActive==3 }" v-on:click.stop="fetchData3(3)">抄送给我</a>
        </div>
        <div class="list-wrap">
           <div class="list" v-for="item in list" v-on:click.stop="openUrl(item.id,item.applyPerson)" v-bind:id="item.id">
               <div class="list-top">
                   <div class="list-t-l">
                       <img v-bind:src="item.portrait" alt="">
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
                   <img v-if='item.status==2' src='../assets/icon-2.png' alt="">
                   <img v-if='item.status==3' src='../assets/icon-1.png' alt="">
               </div>
           </div>
            <div class="add-btn" v-on:click.stop="add()">
                <img src="../assets/icon-add.png" alt="">
            </div>
      
           <!-- <loading v-show="showLoading"> </loading> -->
        </div>
        <!-- 筛选浮层 -->
        <div class="filter" v-bind:class="{ showFilter: isShowFilter }">
           <div class="filter-mask" v-show="isShowMask" v-on:click.stop="toggle()" >
                
           </div>
           <div class="filter-box">
               <p>姓名筛选</p>
               <div class="input-box"> 
                   <img src="../assets/icon-search.png" alt="">
                   <input type="text" placeholder="请输入申请人姓名或物品名称" v-model="searchText">
               </div>
               <p>状态筛选</p>
               <div class="status-box">
                   <p>
                       <span class="status-item" v-bind:class="{ active_item: status==1 }" v-on:click.stop="filterStatus(1)">全部</span>
                   </p>
                   <p>
                        <span class="status-item" v-bind:class="{ active_item: status==2 }" v-on:click.stop="filterStatus(2)">待审批</span> 
                        <span class="status-item" v-bind:class="{ active_item: status==3 }" v-on:click.stop="filterStatus(3)">已通过</span> 
                        <span class="status-item" v-bind:class="{ active_item: status==4 }" v-on:click.stop="filterStatus(4)">未通过</span>
                   </p>
               </div>
               <div class="btn-box">
                   <a href="javascript:;" class="btn-cancel" v-on:click.stop="toggle()">取消</a>
                   <a href="javascript:;" class="btn-comfirm" v-on:click.stop="fetchFilterData(4)">确定</a>
               </div>
           </div>
        </div>

        <!-- 切换按钮 -->
        <div class="toggle">
            <a href="javascript:;" v-on:click.stop="toggle()" >点击切换</a>
        </div>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl,user} from '../config/env'
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
            isShowFilter:false,
            isShowMask:false,
            status:1,
            searchText:""
        }
    },
    mounted(){
        this.auth();
        // this.initData();
    },
    methods:{

        auth(){
            axios.post(baseUrl+'/teacher/material-claim/auth', JSON.stringify({
                personId: user.personId,
                uid: user.uid,
                token:user.token,
              }))
              .then(function (response) {
                  console.log(response);
                  if(response.data.detail.administration&&response.data.detail.examine){
                        this.isShowTab=true;
                        this.isShow3tab=true;
                        this.fetchData2();
                  }else if(response.data.detail.administration||response.data.detail.examine){
                        console.log("2");
                        this.isShowTab=true;
                        this.isShow3tab=false;
                        this.fetchData2();
                  }else{
                        console.log("3");
                       this.isShowTab=false;
                       this.isShow3tab=true;
                       this.fetchData1();
                  }
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        fetchData1(type){
            this.showLoading=true;
            axios.post(baseUrl+'/teacher/material-claim/apply-list', JSON.stringify({
                personId: user.personId,
                uid: user.uid,
                token:user.token,
                name:"",
                status:0,
                page:1,
                pageSize:100
              }))
              .then(function (response) {
                console.log(response);
                this.isActive=2;
                this.showLoading=false;
                this.list=response.data.detail;
                console.log(this.list);
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        fetchData2(type){
            this.showLoading=true;
             axios.post(baseUrl+'/teacher/material-claim/examine-list', JSON.stringify({
                personId: user.personId,
                uid: user.uid,
                token:user.token,
                name:"",
                status:0,
                page:1,
                pageSize:100
              }))
              .then(function (response) {
                // console.log(response);
                this.isActive=1;
                this.showLoading=false;
                this.list=response.data.detail;
                console.log(this.list);
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        fetchData3(type){
               this.showLoading=true;
             axios.post(baseUrl+'/teacher/material-claim/admin-list', JSON.stringify({
                personId: user.personId,
                uid: user.uid,
                token:user.token,
                name:"",
                status:0,
                page:1,
                pageSize:100
              }))
              .then(function (response) {
                // console.log(response);
                this.isActive=3;
                this.showLoading=false;
                this.list=response.data.detail;
                console.log(this.list);
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        //跳转到详情页面，传递参数id
        openUrl(id,person){
            this.$router.push({name:'detail',params: {id:id,person:person}})
        },
        //跳转到详情页面，传递参数id
        add(){
            this.$router.push({name:'add'})
        },
        //切换筛选
        toggle(){
            this.isShowFilter=!this.isShowFilter;
            this.isShowMask=!this.isShowMask;
            this.status=1;
            this.searchText="";
        },
        //选择状态，全部、待审批、已通过、未通过
        filterStatus(status){
            console.log(status);
            this.status=status
        },
        //点确定，获取筛选数据
        fetchFilterData(){
            let port='';
            switch(this.isActive){
                case 1: port='/teacher/material-claim/examine-list';
                case 2: port='/teacher/material-claim/apply-list';
                case 3: port='/teacher/material-claim/admin-list';
                default : port='/teacher/material-claim/examine-list';
            }
            axios.post(baseUrl+port, JSON.stringify({
                personId: user.personId,
                uid: user.uid,
                token:user.token,
                name:this.searchText,
                status:this.status,
                page:1,
                pageSize:100
              }))
              .then(function (response) {
                // console.log(response);
                this.showLoading=false;
                this.list=response.data.detail;
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
        position: absolute;
        bottom: 0.7rem;
        left: 0;
        right: 0;
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
        padding: 0.15rem 0;
        overflow: hidden;

    }
    .status-item{
        height: 0.6rem;
        width:1.6rem;
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

    }
    .filter{
     
        background-color:#ccc;
        top:0;
        position: relative;

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
    }
    .tab-bar a{
        display: inline-block;
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
    .show3tab a{
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
        width: 1.0rem;
        height: 1.0rem;
        display: block;
    }
</style>
