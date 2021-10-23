<template>
      <div>
        <div class="content-list">
              <div class="item">
                <div>
                  <div class="visit-status m20">
                    当前状态：<span class="i-right" :class="{'pass':1===status, 'refuse':2===status, 
                    'timeOut':4===status}" >{{generateStatus(status)}}</span>
                    <p v-show="0===status">请耐心等待拜访对象审核您的拜访申请，如需加快审核时间，请电话联系拜访对象</p>
                    <p v-show="1===status">拜访请求已通过审核，请按约定时间前往，到达后，请联系门卫查看拜访请求</p>
                    <p v-show="2===status">拜访对象已拒绝了您的拜访申请，拒绝原因：{{refuseReason}}</p>
                    <p v-show="3===status">已于{{useTime}}使用，操作人：{{adminActor}}</p>
                    <p v-show="4===status">拜访请求已过期或拜访对象超时未审核，请重新发起拜访申请</p>
                  </div>
                  <p class="visit-common m20">
                   拜访对象
                    <span class="i-right">
                      {{teacherName}}&nbsp;&nbsp;{{telephone&&telephone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}} {{(!teacherName&&!telephone) ? "请选择" : ""}}
                    </span>
                  </p>
                  <p class="visit-common">
                   拜访时间
                    <span class="i-right">
                      {{visitTime}}
                    </span>
                  </p>
                  <textarea class="textarea m20 no-border" readonly v-model="visitReason" maxlength="200" placeholder="请输入拜访事由"></textarea>
                  <p class="input-num">
                    <span>{{visitReason.length}}/200</span>
                  </p>
                   <p class="visit-common m20">
                     访客姓名
                    <input class="no-border" readonly v-model="visitorName" placeholder="请输入" />
                  </p>
                  <p class="visit-common">
                     联系方式
                    <input class="no-border" readonly v-model="visitorTel" placeholder="请输入" maxlength="11" />
                  </p>
                   <div class="visit-common">
                     入校方式
                    <div class="bg-box" :class="{'bg-box-r':2===visitType}">
                      <span class="bg-l left">步行</span>
                      <span class="bg-r right">开车</span>
                    </div>
                  </div>
                   <p class="visit-common" v-show="visitType===2">
                     车牌号码
                    <input class="no-border" v-model="plateNo" placeholder="" />
                  </p>
                   <p class="visit-common">
                     访客人数
                    <input class="no-border" readonly v-model="visitorNum" placeholder="请输入" type="number" />
                  </p>
                  <div class="visit-common visit-pic">
                    照片
                    <div class="img-box">
                      <img :src="url" v-for="(url,key) in imgList" :key="key" alt="" class="user wc-preview-img" @click="$preview($event, imgList, key)">
                    </div>
                  </div>
                </div>
              </div>
            <div class="btn-box" v-show="canDelete===true">
              <a href="javascript:;" v-on:click="deleteItem" class="btn-a">删除</a>
            </div>
        </div>
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {indexUrl,baseUrl,user,websocketUrl} from '../config/env'
import { constants, truncate } from 'fs';
import { debug } from 'util';
import { setTimeout } from 'timers';
export default {
    name: 'detail',
    components: {
      loading
    },
    data() {
        return {
            showLoading:false,
            showSearch: false,
            list:[],
            tearcherList: [],
            teacherName:"",
            visitorName: "",
            inputName:"",
            visitReason: '',
            visitType: 1,
            telephone: null,
            isShowUpload: true,
            demo1: '',
            demo2: '',
            demo3: '',
            demo4: '',
            demo5: '',
            demo6: '',
            demo7: '',
            time: [2018, 1, 1, 0, 0],
            minTime: [2018, 1, 1, 0, 0],
            maxTime: [],
            showChinese: false,
            resetTime: [],
            type: null,
            visitorTel: null,
            demo4str: null,
            teacherId: null,
            visitorNum: null,
            plateNo: null,
            imgBase64Str: null,
            qiNiuId: null,
            status: null,
            visitTime: null,
            visitorPic: null,
            imgList: [],
            refuseReason: null,
            useTime: null,
            adminActor: null,
            canDelete: false,
            user: {}

        }
    },
    computed:{
      
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
          this.list =   JSON.parse(sessionStorage.getItem('list'))
          this.detail();
          window.clearInterval(timer)
        }
      }, 100);


    },
    beforeDestroy () {
      window.clearInterval(this.timer); 
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
    
     
      clearPic(){
        this.isShowUpload = true
        document.getElementById('pic-form')&&document.getElementById('pic-form').reset();
        document.getElementById('show').src='';
        this.qiNiuId = null
        this.imgBase64Str = null
      },
      choose(name, id, mobile){
        this.teacherName = name
        this.teacherId = id
        // mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        this.telephone = mobile
        this.showSearch = false
        this.inputName = ''
        this.tearcherList = []
      },
      changepic() {
        var _this = this
        var reads= new FileReader();
        var f=document.getElementById('file').files[0];
        reads.readAsDataURL(f);
        reads.onload=function (e) {
            document.getElementById('show').src=this.result;
            _this.imgBase64Str = this.result
            _this.isShowUpload = false
        };
      },
      detail(){
        this.showLoading=true;
        axios.post(baseUrl+'/parent/visit-records/detail', JSON.stringify({
            uid: this.user.uid,
            token: this.user.token,
            personId: this.user.personId,
            recordId: this.$route.params.id
        }))
        .then(function (response) {
            this.showLoading=false;
            if(response.data.success){
                this.visitorName = response.data.detail.visitorName
                this.visitorTel = response.data.detail.visitTel
                this.visitorNum = response.data.detail.visitorNum
                this.visitReason = response.data.detail.visitReason
                this.visitType = response.data.detail.visitType
                this.visitTime = response.data.detail.visitTime
                this.teacherName = response.data.detail.teacherName
                this.telephone = response.data.detail.teacherMobile
                this.plateNo = response.data.detail.plateNo
                this.status = response.data.detail.status
                this.visitorPic = response.data.detail.visitorPic
                this.imgList.push(response.data.detail.visitorPic)
                this.refuseReason = response.data.detail.refuseReason
                this.useTime = response.data.detail.useTime
                this.adminActor = response.data.detail.adminActor
                this.canDelete = response.data.detail.canDelete
            }else{
                  this.$toast(response.data.description, {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                  });
            }
        }.bind(this))
        .catch(function (response) {
          console.log(response);
        })
      },
      deleteItem(){
        var _this = this
        this.$confirm({
          title: '提示',
          content: '是否确定删除？',
          yesText: '确定'
        }).then(function (response) {
            _this.showLoading=true;
            axios.post(baseUrl+'/parent/visit-records/delete', JSON.stringify({
                uid: _this.user.uid,
                token: _this.user.token,
                personId: _this.user.personId,
                recordId: this.$route.params.id
            }))
            .then(function (response) {
                _this.showLoading=false;
                if(response.data.success){
                    _this.$toast("删除成功！", {
                        durtaion: 200,
                        location: 'center' // 默认在中间
                    });
                    setTimeout(() => {
                      window.history.go(-1)
                    }, 2000);
              }else{
                    _this.$toast(response.data.description, {
                        durtaion: 200,
                        location: 'center' // 默认在中间
                    });
              }
            }.bind(this))
            .catch(function (response) {
              console.log(response);
            })
        }.bind(this))
        .catch(function (response) {
          console.log("22112")
        })
      
      },


      generateStatus(status){
        // 状态(0: 待审核, 1: 已通过, 2: 已拒绝, 3: 已使用, 4: 已过期)
        let str = ''
        if(status === 0){
          str = "待审核"
        }else if(status === 1){
          str = "已通过"
        }else if(status === 2){
          str = "已拒绝"
        }else if(status === 3){
          str = "已使用"
        }else if(status === 4){
          str = "已过期"
        }
        return str
      },


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
a{
  text-decoration: none;
}
.content-list{
  margin-bottom: 1rem;
}
.visit-status{
  padding: .2rem .3rem;
  background-color: #fff;
  font-size: .32rem;
  color: #444;
}
.visit-status>p{
  color: #999999;
  font-size: .24rem;
}
.refuse{
  color: #f51818;
}
.pass{
  color: #1bac55;
}
.timeOut{
  color: #b12525;
}
.left{
  float: left;
}
.right{
  float: right;
}
.ul-item{
  margin-top: 0.5rem;
  height: 50vh;
  overflow: auto;
}
.li-item{
  height: .88rem;
  line-height: .88rem;
  font-size: .28rem;
  background-color: #fff;
  padding: 0 .3rem;
  margin-bottom: .02rem;
  position: relative;
}
.no-border{
  -webkit-appearance: none;
  border-radius: 0;
  border: none;
}
.li-item>img{
  position: absolute;
  width: .4rem;
  height: .4rem;
  display: block;
  top: 50%;
  margin-top: -0.2rem;
  right: .2rem;
}
.textarea{
  padding: .25rem .30rem;
  height: 3.5rem;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  font-size: .32rem;
  color: #999;
  display:  block;
  resize:none;
}
.search-box{
  position: fixed;
  z-index: 99;
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
}
.s-top{
  padding: .2rem;
  text-align: center;
}
.s-top .return{
  display: inline-block;
  width: .64rem;
  height: .64rem;
  vertical-align: middle;
}
.search-box .s-top{
  height: 1rem;
  line-height: 1rem;

}
.item-name{
  width: 1.8rem;
  display: inline-block;
}
.item-phone{
  color: #666;
  width: 2.4rem;
  display: inline-block;

}
.search-box .s-top>input{
  width: 4.65rem;
  height: .7rem;
  font-size: .28rem;
  outline: none;
  /* border-radius: .3rem; */
  text-indent: 1em;
  border-radius: .35rem;
  border: 1px solid #fff;
  vertical-align: middle;
}
.search-box .s-top>.search-btn{
  height: .64rem;
  line-height: .64rem;
  text-align: center;
  border-radius: .05rem;
  width: 1.2rem;
  background:#369bfb;
  font-size: .32rem;
  color: #fff;
  display: inline-block;
  vertical-align: middle;
}
.item-time{
  height: .7rem;
  line-height: .7rem;
  text-align: center;
  color: #8c8c8c;
  font-size: .22rem;
}
.item>div>.visit-common{
  font-size: .32rem;
  padding: 0 .3rem;
  height: .84rem;
  line-height: .84rem;
  color: #444;
  background-color: #fff;
  margin-bottom: .02rem;
}
.item>div>p>span{
  height: .6rem;
  line-height: .6rem;
  outline: none;
  width: 5.4rem;
  font-size: .32rem;
  text-align: right;
  display: inline-block;
}

.btn-wrap>a{
  display: block;
  width: 3rem;
  height: .64rem;
  margin: 0 auto;
  color: #fff;
  text-align: center;
  font-size: .32rem;
  background: #3492e9;
  line-height: .64rem;
  border-radius: .64rem;
}
.show{
  display: block;
}
.close-box{
  padding: .2rem 0;

}
.close-box>img{
  display: block;
  width: .8rem;
  height: .8rem;
  margin: 0 auto;

}
.input-num{
  font-size: .28rem;
  text-align: right;
  display: block;
  height: .5rem!important;
  line-height: .5rem!important;
}
.m20{
  margin-top: .2rem;
}
.visit-common>input{
  text-align: right;
  width: 5.4rem;
  height: .6rem;
  outline: none;
  font-size: .28rem;
  
}
.bg-box{
  width: 2.8rem;
  height: .48rem;
  border: 1px solid #3492e9;
  float: right;
  margin-top: .16rem;
  border-radius: .16rem;
  background-image: url(../assets/bg-btn.png);
  background-repeat: no-repeat;
  background-position: 0;
  background-size: 1.4rem .50rem;
  background-position-x: 0%;
  transition: 300ms;
}
.bg-box-r{
  background-position-x: 100%;
}
.bg-box>span{
  display: block;
  width: 50%;
  height: 100%;
  text-align: center;
  font-size: .32rem;
  color: #fff;
  line-height: .48rem;
}
.bg-box .bg-r{
  color: #369bfb;
}
.bg-box-r .bg-l{
  color: #369bfb;
}
.bg-box-r .bg-r{
  color: #fff;
}
.ui-upload{
  width: 1.4rem;
  height: 1.4rem;
  display: block;
  background-image: url(../assets/camera.png);
  position: absolute;
  right: .3rem;
  top: .2rem;
  background-size: 100%;
  z-index: 99;
}
.visit-pic{
  height: 1.8rem!important;
  position: relative;
}
.btn-box{
  text-align: center;
  padding: .2rem 0;
  margin-top: 1rem;
}
.btn-box>a{
  display: block;
  width:3.7rem;
  height: .64rem;
  background-color: #f61616;
  color: #fff;
  text-align: center;
  line-height: .64rem;
  font-size: .32rem;
  margin: 0 auto;
  border-radius: .15rem;
}
.img-box{
  width: 1.4rem;
  height: 1.4rem;
  position: absolute;
  right: .3rem;
  top: .2rem;
  z-index: 98;
  border-radius: .25rem;
  /* overflow: hidden; */
}
.img-box>img{
  width: 1.4rem;
  height: 1.4rem;
  display: block;
  border-radius: 0.25rem;
  
}
.img-close{
  width: .28rem;
  height: .28rem;
  display: block;
  position: absolute;
  top: -.1rem;
  right: -.1rem;
}
.img-close>img{
  display: block;
  height: .28rem;
  width: .28rem;
}
.input-num{
  background-color: #fff;
  padding-right: .3rem;
}
.user {
  height: 150px;
  width: 150px;	
}
.container {
	padding-top: 100px;
	padding-left: 20px;
}
.box {
	margin-bottom: 50px;
}
.xie {
	height: 150px;
	width: 150px;
	background-position: center center;
	background-size:cover;
	display: inline-block;
	/*float: left;*/
}
</style>
