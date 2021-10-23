<template>
      <div>
        <div class="tab-box">
            <div class="tab-con">
                <div class="tab-item" v-bind:class="{ active: active==0}" v-on:click.stop="changeBar('all')">
                    &nbsp;&nbsp;&nbsp;&nbsp;选课列表
                </div>
                <div class="tab-item" v-bind:class="{ active: active==1}" v-on:click.stop="changeBar('fav')">
                    我的收藏
                </div>
                <div class="tab-item" v-bind:class="{ active: active==2}" v-on:click.stop="changeBar('selected')">
                    已选课程 &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>
            <i class="tab-bar" v-bind:style="{'left':left}" ></i>   
        </div>
        <div class="content-list">
            <ul>
              <li class="list-item" v-for="item in list" :id=item.id v-on:click.stop="openUrl(item.id)" v-show="active==0||(active==1)&&item.isFavorite||(active==2)&&item.hasSelect">
                  <p class="item-title">
                      {{item.title}}
                  </p>
                  <p class="item-name">
                       {{item.teacherName}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.surplusTime>0?"0":item.applyPerson}}/{{item.totalPerson}}
                  </p>
                   <p class="item-time">
                      上课时间： {{item.classBeginTime}}
                  </p>
                  <p class="item-sel-time">
                      选课时间： {{item.applyTime}}
                  </p>
                 
                  <span class="item-surplustime" v-show="item.surplusTime<120&&item.surplusTime!=0">
                    剩余
                    {{item.surplusTime}}秒
                  </span>
                  <a href="javascript:;" class="fav-btn" v-bind:class="{ fav: item.isFavorite}" v-on:click.stop="collection(item.id,item.isFavorite)"></a>
              
                  <!-- 0暂未开始 -1已结束 1进行中 -->
                  <template   v-if="item.status==0" >
                      <a href="javascript:;" class="option-btn not-begin" v-on:click.stop=" ">暂未开始</a>
                  </template >
                 <template   v-else-if="item.status==-1" >
                      <a href="javascript:;" class="option-btn not-begin" v-on:click.stop=" ">报名结束</a>
                 </template >
                 <template   v-else-if="item.status==1" >
                      <div v-if="item.hasSelectedFull">
                           <a href="javascript:;" class="option-btn cancel-select" v-if="item.hasSelect==true" v-on:click.stop="option(item.id,item.hasSelect)">取消报名</a>
                           <a href="javascript:;" class="option-btn not-begin" v-else v-on:click.stop="return false">名额已满</a>
                      </div>
                      <div v-else>
                           <a href="javascript:;" class="option-btn" v-if="(item.hasSelect==false)" v-on:click.stop="option(item.id,item.hasSelect)">立即报名</a>
                           <a href="javascript:;" class="option-btn cancel-select" v-if="(item.hasSelect==true)" v-on:click.stop="option(item.id,item.hasSelect)">取消报名</a>
                      </div>
                 </template >
              </li> 
              <div v-show="isShowTip" class="no-data-wrap">
                <img src="../assets/no-data.png"  alt="">
              </div>
            </ul>
        </div>
     <!--      <div class="btn-fresh" v-on:click.stop="refresh">
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
           left:"9.5%",
           active:0,
           list:[],
           isShowTip:false,
           timer:'',
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
        window.isBackToList=this.isBackToList;

        var timer = setInterval(() => {
          if(this.user.uid&&this.user.token&&this.user.personId){
            this.getList();
            this.websocket();
            this.initBar();
            window.clearInterval(timer)
          }
        }, 100);

        
        window.refresh=this.refresh;
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
        websocket () {
           let ws = new WebSocket(websocketUrl)
           ws.onopen = () => {
              // Web Socket 已连接上，使用 send() 方法发送数据
                ws.send(JSON.stringify({personId: this.user.personId}))
                console.log('数据发送中...')
            }
            ws.onmessage = evt => {
              console.log('数据已接收...')
              if(sessionStorage.getItem("inited")!="true") return false;
              for(let i=0;i<this.list.length;i++){
                if(JSON.parse(evt.data).id==this.list[i].id){
                    if(this.list[i].isAdmin==true){
                        this.list[i]=JSON.parse(evt.data).list
                    }else{
                        console.log("55")
                        this.list[i].applyPerson=JSON.parse(evt.data).list.applyPerson
                        this.list[i].totalPerson=JSON.parse(evt.data).list.totalPerson
                    }
                    this.showLoading=true;
                    this.showLoading=false;
                  return;
                }
              }

              this.list.push(JSON.parse(evt.data).list)
            }
            ws.onclose = function () {
              // 关闭 websocket
              console.log('连接已关闭...')
            }
      },
      openUrl(id){
        console.log(id)
        sessionStorage.setItem("courseId",id)
          this.$router.push({ path: '/detail'})
      },
      refresh(){
        this.getList();
      },
      getList(){
        this.showLoading=true;
        sessionStorage.removeItem("inited")
        axios.post(baseUrl+'/parent/community-course/list', JSON.stringify({
            uid: this.user.uid,
            personId: this.user.personId,
            token: this.user.token,
            courseType: 2,
        }))
        .then(function (response) {
            this.showLoading=false;
            sessionStorage.setItem("inited","true")
            console.log(response);
            if(response.data.success){
                  var _this=this;
                  var newList=response.data.detail;
                   _this.list=newList;
                  window.clearInterval(_this.timer); 
                  _this.timer=setInterval(function(){
                    for(let i=0;i<newList.length;i++){
                      if(newList[i].surplusTime<=1) {
                        newList[i].surplusTime=0
                        if(newList[i].status==0){
                           newList[i].status=1
                        }
                      }else{
                        newList[i].surplusTime--
                      }
                    }
                    _this.list=newList;
                  },1000);
                  this.update();
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
      option(id,hasSelect){
         // <!-- 0暂未开始 -1已结束 1进行中 -->
       
          var _this=this;
          if(hasSelect==false){
             _this.select(id,hasSelect);
             return;
          }
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
                _this.select(id,hasSelect);
              }
            );
      },
      select(id,hasSelect){
          this.showLoading=true;
          let portStr=(hasSelect==true)?'/parent/community-course/cancel-select':'/parent/community-course/select';
          axios.post(baseUrl+portStr, JSON.stringify({
              uid: this.user.uid,
              personId: this.user.personId,
              token: this.user.token,
              courseId:id
          }))
          .then(function (response) {
               this.showLoading=false;
              if(response.data.success){
                  for(let i=0;i<this.list.length;i++){
                    if(response.data.detail.id==this.list[i].id){
                      this.list[i].applyPerson=response.data.detail.applyPerson;
                      this.list[i].hasSelect=response.data.detail.hasSelect;
                      this.list[i].hasSelectedFull=response.data.detail.hasSelectedFull;
                      this.list[i].totalPerson=response.data.detail.totalPerson;
                      this.list[i].status=response.data.detail.status;
                    }
                  }
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
              // this.update();
          }.bind(this))
          .catch(function (response) {
            console.log(response);
          });
      },
      collection(id,isFavorite){
          this.showLoading=true;
          axios.post(baseUrl+'/parent/community-course/collection', JSON.stringify({
              uid: this.user.uid,
              personId: this.user.personId,
              token: this.user.token,
              courseId:id
          }))
          .then(function (response) {
              this.showLoading=false;
              console.log(response);
              if(response.data.success){
                  for(let i=0;i<this.list.length;i++){
                    if(response.data.detail.id==this.list[i].id){
                      this.list[i].isFavorite=response.data.detail.isFavorite;
                    }
                  }
                  this.update();
                  let toastStr=isFavorite?"已取消":"已收藏"
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
              this.update();
          }.bind(this))
          .catch(function (response) {
            this.showLoading=false;
            console.log(response);
          })
      },
      changeBar(type){
        sessionStorage.setItem("type",type)
        switch (type) {
          case "all":
          this.left='9.5%';
          this.active=0;
          break;
          case "fav":
          this.left='40%';
          this.active=1;
          break;
          case "selected":
          this.left='70.5%';
          this.active=2;
          break;
          default:
          this.left='9.5%';
          this.active=0;
          break;
        }
        this.update();
      },
      initBar(){
        var type=sessionStorage.getItem("type")
        switch (type) {
          case "all":
          this.left='9.5%';
          this.active=0;
          break;
          case "fav":
          this.left='40%';
          this.active=1;
          break;
          case "selected":
          this.left='70.5%';
          this.active=2;
          break;
          default:
          this.left='9.5%';
          this.active=0;
          break;
        }
        this.update();
      },
      update(){
          if(this.active==0){
              if(this.list.length==0){
                 this.isShowTip=true;
              }else{
                 this.isShowTip=false;
              }
          }else if(this.active==1){
                let flag=true;
             for(let i=0;i<this.list.length;i++){
                  if (this.list[i].isFavorite==true){
                    flag=false
                  }
              }
              this.isShowTip=flag;
          }else{
            let flag=true;
             for(let i=0;i<this.list.length;i++){
                  if (this.list[i].hasSelect==true){
                    flag=false
                  }
              }
              this.isShowTip=flag;
          }
      }

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
.tab-con .active{
  color: #65bee5;
}
.tab-box{
  position: fixed;
   background: #fff;
   border-bottom: 1px solid #e4e4e4;
   height: 0.84rem;
   left: 0;
   top: 0;
   z-index: 99;
   width: 100%;
}
.tab-con{
   

}
.content-list{
  position: absolute;
  top: 0.88rem;
  left: 0;
  width: 100%;
}
.tab-bar{
  position: absolute;
  height: 0.03rem;
  width: 1.46rem;
  background: #65bee5;
  left: 0;
  transition: left 300ms;
}
.tab-con::after{
  display: block;
  content: "";
  clear: both;
  height: 0;
  line-height: 0;
}
.tab-item{
  float: left;
  height: 0.8rem;
  width: 33.3%;
  font-size: 0.28rem;
  line-height: 0.8rem;
  text-align: center;
  color: #7b7b7b;
}
.list-item{
  position: relative;
  padding: 0.3rem;
  background: #fff;
  margin-bottom: 1px;
}
.item-title{
  font-size: 0.32rem;
  color: #626262;
  padding-bottom: 0.06rem;
}
.item-name{
  font-size: 0.24rem;
  color: #7b7b7b;
  padding: 0.1rem 0;
}
.item-time{
  color: #7b7b7b;
  font-size: 0.24rem;
  padding: 0.06rem 0;
  padding-right: 1.2rem;
}
.item-sel-time{
  font-size: 0.22rem;
  color: #afafaf;
  padding: 0.06rem 0;
  padding-bottom: 0;
}
.option-btn{
  position: absolute;
  display: block;
  width:1.4rem;
  height: 0.44rem;
  font-size: 0.26rem;
  text-align: center;
  line-height: 0.44rem;
  background: #4fa4f3;
  color: #fff;
  right: 0.3rem;
  bottom: 0.2rem;
  border-radius: 0.22rem;
  box-sizing: border-box;
}
.fav-btn{
  position: absolute;
  display: block;
  width: 0.42rem;
  height: 0.42rem;
  background:url(../assets/icon_star_un.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  right: 0.3rem;
  top: 0.3rem;
}
.fav{
  background: url(../assets/icon_star.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
}
.cancel-select{
  background: #fff;
  color: #4fa4f3;
  border: 1px solid #4fa4f3;
}
.not-begin{
  background: #cecece;
  color: #fff;
}
.item-surplustime{
  position: absolute;
  right: 0.3rem;
  bottom: 0.7rem;
  font-size:0.24rem;
  color: #afafaf;
}
.no-data-wrap>img{
  width: 4.0rem;
  display: block;
  margin: 1.0rem auto;
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
</style>
