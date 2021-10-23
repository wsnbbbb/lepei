<template>
      <div>
        <div class="content-list">
              <div class="item">
                
                <div>
                  <p class="visit-common">
                   拜访对象
                    <span v-on:click="search" class="i-right">
                      {{teacherName}}&nbsp;&nbsp;{{telephone&&telephone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}
                       {{(!teacherName&&!telephone) ? "请选择" : ""}} >
                    </span>
                  </p>
                  <p class="visit-common">
                   拜访时间
                    <span @click="showDatePicker(4, 5)" class="i-right">
                      {{visitDate?visitDate:'请选择'}} >
                    </span>
                  </p>
                  <textarea class="textarea m20 no-border" v-model="visitReason" maxlength="200" placeholder="请输入拜访事由"></textarea>
                  <p class="input-num">
                    <span>{{visitReason.length}}/200</span>
                  </p>
                   <p class="visit-common m20">
                     访客姓名
                    <input v-model="visitorName" class="no-border" maxlength="10" placeholder="请输入" />
                  </p>
                  <p class="visit-common">
                     联系方式
                    <input v-model="visitorTel" class="no-border" placeholder="请输入" maxlength="11" />
                  </p>
                   <div class="visit-common">
                     入校方式
                    <div class="bg-box" :class="{'bg-box-r':2===visitType}">
                      <span class="bg-l left" v-on:click="chooseType(1)">步行</span>
                      <span class="bg-r right" v-on:click="chooseType(2)">开车</span>
                    </div>
                  </div>
                   <p class="visit-common" v-show="visitType===2">
                     车牌号码
                    <input v-model="plateNo" class="no-border" maxlength="10" placeholder="请输入完整车牌号码" />
                  </p>
                   <p class="visit-common">
                     访客人数
                    <input v-model="visitorNum" class="no-border" placeholder="请输入" type="number" />
                  </p>
                  <div class="visit-common visit-pic">
                    照片
                    <label class="ui-upload" v-show="isShowUpload" @click="choosePic">
                      <!-- <form id="pic-form">
                        <input type="file" id="file" class="no-border" @change="changepic" accept="image/*" style="display: none;" />
                      </form> -->
                    </label>
                    <div class="img-box" v-show="!isShowUpload">
                      <span class="img-close" v-on:click="clearPic">
                        <img src="../assets/close-red.png" alt="">
                      </span>
                      <img src="" id="show" width="200">
                    </div>
                  </div>
                </div>
              </div>
            <div class="btn-box">
              <a href="javascript:;" v-on:click="uploadToQiNiu" class="btn-a">提交</a>
            </div>
        </div>
        <div class="search-box" :class="{'show': showSearch===true}">
          <div class="s-top">
            <img class="return" src="../assets/return.png" alt="" v-on:click="close">
            <input type="text" class="no-border" v-model="inputName" placeholder="请输入拜访对象手机号或姓名查询"/>
            <a href="javascript:;" class="search-btn" v-on:click="searchName">搜索</a>
          </div>
          <ul class="ul-item">
            <li class="li-item" :key="index" v-for="(item, index) in teacherList" 
            v-on:click="choose(item.teacherName, item.teacherId, item.teacherMobile)">
              <span class="item-name">{{item.teacherName}}</span>
              <span class="item-phone">{{item.teacherMobile}}</span>
              <span class="item-job">{{item.teacherType}}</span>
              <img src="../assets/arr-r.jpeg" alt="">
            </li>
            <div class="no-data" v-show="teacherList.length==0">
              <img src="../assets/tips.png" alt="">
              <p>暂时还没有数据...</p>
            </div>
          </ul>
         
        </div>
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {indexUrl,baseUrl,websocketUrl} from '../config/env'
import {isPhoneNumber} from '../config/mUtils'
import { constants, truncate } from 'fs';
import { debug } from 'util';
import { setTimeout } from 'timers';
export default {
    name: 'apply',
    components: {
      loading
    },
    data() {
        return {
            showLoading:false,
            showSearch: false,
            list:[],
            teacherList: [],
            teacherName:"",
            visitorName: "",
            inputName:"",
            visitReason: '',
            visitType: 1,
            telephone: null,
            isShowUpload: true,
            visitDate: '',
            time: [2018, 1, 1, 0, 0],
            showChinese: false,
            resetTime: [],
            type: null,
            visitorTel: null,
            visitDateStr: null,
            teacherId: null,
            visitorNum: null,
            plateNo: null,
            imgBase64Str: null,
            qiNiuId: null,
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
          this.getTeacherList();
          this.getQiNiuToken();
          window.clearInterval(timer)
        }
      }, 100);
        // this.visitorTel =  "user.phone";
        window.showImageWithBase64 = this.showImageWithBase64;

      // this.getTeacherList();
      // this.getQiNiuToken();
      // this.visitorTel =  user.phone;
      // window.showImageWithBase64 = this.showImageWithBase64;
    },
    beforeDestroy () {
      var child=document.getElementsByClassName("am-picker")[0];
      document.getElementsByTagName("body")[0].removeChild(child);
      sessionStorage.removeItem("teacherList")
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
      search(){
        this.showSearch = true
        this.teacherList = JSON.parse(sessionStorage.getItem("teacherList"))
      },
      chooseType(type){
        this.visitType = type
      },
      clearPic(){
        this.isShowUpload = true
        // document.getElementById('pic-form')&&document.getElementById('pic-form').reset();
        document.getElementById('show').src='';
        this.qiNiuId = null
        this.imgBase64Str = null
      },
      choose(name, id, mobile){
        this.teacherName = name
        this.teacherId = id
        this.telephone = mobile
        this.showSearch = false
        this.inputName = ''
        // this.teacherList = []
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
      choosePic(){
          try {
              if(this.isiOS()){
                window.webkit.messageHandlers.choosePicture.postMessage(null);
              }else{
                window.app.choosePicture();
              }
          } catch (e) {
              // console.log("未能调用原生 choosePicture 方法")
              this.$toast("未能调用原生 choosePicture 方法", {
                  durtaion: 200,
                  location: 'center' // 默认在中间
              });
          }
      },
      showImageWithBase64(base64) {
          // this.$toast(base64, {
          //     durtaion: 200,
          //     location: 'center' // 默认在中间
          // });
          document.getElementById('show').src = "data:image/gif;base64," + base64
          
          this.imgBase64Str = "data:image/gif;base64," + base64
          this.isShowUpload = false
      },
      getTeacherList(){
      
        this.showLoading=true;
        axios.post(baseUrl+'/parent/visit-records/teachers', JSON.stringify({
            uid: this.user.uid,
            token: this.user.token,
            personId: this.user.personId,
        }))
        .then(function (response) {
            this.showLoading=false;
            if(response.data.success){
                // this.teacherList= response.data.detail
                sessionStorage.setItem("teacherList", JSON.stringify(response.data.detail))
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
      searchName(){
        console.log(this.inputName)
        this.showLoading=true;
        axios.post(baseUrl+'/parent/visit-records/search', JSON.stringify({
            uid: this.user.uid,
            token: this.user.token,
            personId: this.user.personId,
            search: this.inputName
        }))
        .then(function (response) {
            this.showLoading=false;
            if(response.data.success){
                this.teacherList= response.data.detail
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

      apply(){
        var _this = this
        this.showLoading=true;
        axios.post(baseUrl+'/parent/visit-records/apply', JSON.stringify({
            uid: this.user.uid,
            token: this.user.token,
            personId: this.user.personId,
            teacherId: this.teacherId,
            visitTime: _this.transdate(this.visitDateStr)+"",
            visitReason: this.visitReason,
            visitorName: this.visitorName,
            visitorTel: this.visitorTel,
            visitorNum: this.visitorNum,
            visitType: this.visitType,
            visitorPic: this.qiNiuId,
            plateNo: this.visitType===2?this.plateNo:""   //车牌号
        }))
        .then(function (response) {
            this.showLoading=false;
            if(response.data.success){
                this.$toast("申请成功！", {
                    durtaion: 200,
                    location: 'center' // 默认在中间
                });
                setTimeout(() => {
                  window.history.go(-1)
                }, 2000);
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
      getQiNiuToken(){
          axios.post(baseUrl+'/qi-niu/upload-picture', JSON.stringify({}))
          .then(function (response) {
              var res = response.data
              if (res.success) {
                sessionStorage.setItem("qiniuToken", res.detail.token)
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
      uploadToQiNiu(){
            if(!this.teacherId){
            this.$toast("请选择拜访对象！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if(!this.visitDate){
            this.$toast("请选择拜访时间！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if(!this.visitReason){
            this.$toast("请输入拜访事由！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if((/^\s*$/).test(this.visitReason)){
            this.$toast("拜访事由不能为空", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if(!this.visitorName){
            this.$toast("请输入访客姓名！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if((/^\s*$/).test(this.visitorName)){
            this.$toast("访客姓名不能为空", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if(!this.visitorTel){
            this.$toast("请输入联系方式！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if(!isPhoneNumber(this.visitorTel)){
            this.$toast("请输入正确的手机号！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if(this.visitType===2){
            if(!this.plateNo){
              this.$toast("请输入车牌号码！", {
                  durtaion: 200,
                  location: 'center' // 默认在中间
              });
              return
            }
          }
          if(!this.visitorNum){
            this.$toast("请输入访客人数！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if(!this.isNotANumber(this.visitorNum)){
            this.$toast("访客人数为数字！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if(parseInt(this.visitorNum)>10||parseInt(this.visitorNum)<1){
            this.$toast("访客人数为范围为1-10！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          if(!this.imgBase64Str){
             this.$toast("请选择照片！", {
                durtaion: 200,
                location: 'center' // 默认在中间
            });
            return
          }
          var _this = this
          var fd = new FormData();
          fd.append("token", sessionStorage.getItem("qiniuToken"))
          try {
              var binery=_this.dataURItoBlob(this.imgBase64Str)
          } catch (error) {
              this.$toast(error, {
                  durtaion: 200,
                  location: 'center' // 默认在中间
              });
          }
          fd.append("file", binery)
          this.showLoading = true
          axios.post('http://upload.qiniu.com/', fd,{"headers":{'Content-Type':'multipart/form-data'}})
          .then(function (response) {
              this.showLoading = false
              var res = response.data
              if (res.success) {
                _this.qiNiuId = res.id
                _this.apply()
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
      openUrl(id){
        console.log(id)
        localStorage.setItem("courseId",id)
          this.$router.push({ path: '/detail'})
      },
      close(){
        this.showSearch = false
        this.inputName = ''
        // this.teacherList = []
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
  
      curentTime(day){ 
          var now = new Date();
          var year = now.getFullYear();       //年
          var month = now.getMonth() + 1;     //月
          var day = now.getDate();            //日
          var hh = now.getHours();            //时
          var mm = now.getMinutes();          //分
        
          var clock = year + "-";
          if(month < 10)
              clock += "0";
          clock += month + "-";
          if(day < 10)
              clock += "0";
          clock += day + " ";
          if(hh < 10)
              clock += "0";
          clock += hh + ":";
          if (mm < 10) clock += '0'; 
          clock += mm;
          var arr=[]
          arr.push(year)
          arr.push(month)
          arr.push(day)
          arr.push(hh)
          arr.push(mm)
          console.log(arr)
          return(arr); 
      },
      //日期转时间戳
      transdate(endTime){//console.log(transdate("2018-05-28 23:24:12"));
          var date = new Date();
          date.setFullYear(endTime.substring(0, 4));
          date.setMonth(endTime.substring(5, 7) - 1);
          date.setDate(endTime.substring(8, 10));
          date.setHours(endTime.substring(11, 13));
          date.setMinutes(endTime.substring(14, 16));
          date.setSeconds(endTime.substring(17, 19));
          return Date.parse(date) / 1000;
      },
      showDatePicker (demo, type) {
        var _this = this
        var date = new Date()
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        var d = date.getDate()
        var h = date.getHours()
        var min = date.getMinutes()
        this.time = this.showChinese ? [y + '年', m + '月', d + '日', h + '时', min + '分'] : [y * 1, m * 1, d * 1, h * 1, min * 1]
        console.log(this.time)
        var dataObj = {}
        dataObj = {
          type: type,
          showChinese: this.showChinese
        }

        var next30Date = new Date(date.getTime() + 30*24*60*60*1000)
        var y1 = next30Date.getFullYear()
        var m1 = next30Date.getMonth() + 1
        var d1 = next30Date.getDate()

        let init = JSON.parse(JSON.stringify(this.time))
        dataObj.value = init
        dataObj.min = this.curentTime()
        dataObj.max = [y1, m1, d1]
        this.$datepicker(dataObj).then((e) => {
          console.log(e)
           _this.visitDate = e[0]+"年"+e[1]+"月"+e[2]+"日"+" "+e[3]+":"+(e[4]<10?("0"+e[4]):e[4])
           _this.visitDateStr = e[0]+"-"+(e[1]<10?("0"+e[1]):e[1])+"-"+(e[2]<10?("0"+e[2]):e[2])+" "+(e[3]<10?("0"+e[3]):e[3])+":"+(e[4]<10?("0"+e[4]):e[4])+":00"
           console.log(_this.visitDateStr)
          }).catch((e) => {
            // console.log(e)
        })
       
      },
      dataURItoBlob(base64Data) {
        var byteString;
        if(base64Data.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(base64Data.split(',')[1]);
        else
          byteString = unescape(base64Data.split(',')[1]);
        var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for(var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {
          type: mimeString
        });
      },
      isNotANumber(inputData) {
      　　//isNaN(inputData)不能判断空串或一个空格
      　　//如果是一个空串或是一个空格，而isNaN是做为数字0进行处理的，而parseInt与parseFloat是返回一个错误消息，这个isNaN检查不严密而导致的。
      　　if (parseFloat(inputData).toString() == "NaN") {
      　　　　//alert("请输入数字……");注掉，放到调用时，由调用者弹出提示。
      　　　　return false;
      　　} else {
      　　　　return true;
      　　}
      }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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
  margin-bottom: 2rem;
}
.left{
  float: left;
}
.right{
  float: right;
}
.no-border{
  -webkit-appearance: none;
  border-radius: 0;
  border: none;
}
.ul-item{
  margin-top: 0.5rem;
  height: 50vh;
  overflow: auto;
  .no-data{
    img{
      width: 5.6rem;
      height: 4.6rem;
      display: block;
      margin: 0 auto;

    }
    p{
      font-size: .28rem;
      color: #444;
      text-align: center;
    }
  }
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
  resize: none;
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
.content-list>ul>li>div{

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
  overflow: hidden;
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
}
.btn-box>a{
  display: block;
  width:3.7rem;
  height: .64rem;
  background-color: #369bfb;
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

</style>
