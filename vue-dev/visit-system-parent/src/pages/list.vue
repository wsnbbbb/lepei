<template>
      <div>
        <div class="content-list">
            <!-- <ul> -->
            <div class="wrapper" ref="wrapper">
                <!-- 内容列表 -->
                <ul class="content">
                    <div class="top-tip">
                        <span class="refresh-hook">{{pulldownMsg}}</span>
                    </div>
                    <!-- <li :key="item" v-for="item in data">{{item}}</li> -->
                      <li class="item" v-bind:key="item.recordId" v-for="item in list" v-on:click="toDetail(item.recordId, item.visitorName)">
                      <p class="item-time">{{item.createTime}}</p>
                      <div class="item-content">
                        <p>
                          <span class="i-left left">拜访对象</span>
                          <span class="i-right right">{{item.teacherName}}&nbsp;&nbsp;{{item.teacherMobile&&item.teacherMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
                        </p>
                        <p>
                          <span class="i-left left">拜访时间</span>
                          <span class="i-right right">{{item.visitTime}}</span>
                        </p>
                        <p>
                          <span class="i-left left">访客姓名</span>
                          <span class="i-right right">{{item.visitorName.substring(0, 1)}}**</span>
                        </p>
                        <p>
                          <span class="i-left left">当前状态</span>
                          <span class="i-right right" :class="{'pass':1===item.status, 'refuse':2===item.status, 
                          'timeOut':4===item.status}" >{{generateStatus(item.status)}}</span>
                        </p>
                      </div>
                    </li>
                </ul>
                <div class="no-data" v-show="isShowTip">
                  <img src="../assets/tips.png" alt="">
                  <p>暂时还没有数据</p>
                </div>
            </div>
            <!-- </ul> -->
        </div>
        <div class="btn-wrap">
          <a href="javascript:;" class="btn-a" v-on:click="apply">发起拜访申请</a>
        </div>
        <div class="prompt-box" v-show="showPrompt">
          <div class="pro-content">
            <div class="pro-info">
              <h4>验证信息</h4>
              <p>为保障信息安全，请输入此访客”<span>{{promptName&&promptName.substring(0, 1)}}**</span>“的姓名</p>
              <input type="text" class="no-border" v-model="realName">
            </div>
            <div class="btn-group">
              <div class="btn-cancel" v-on:click="cancel">
                取消
              </div>
              <div class="btn-comfirm" v-on:click="comfirm">
                确定
              </div>
            </div>
          </div>
        </div>
        <div class="alert-hook" :style="{display: alertHook}">刷新成功</div>
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import BScroll from 'better-scroll'
import {indexUrl,baseUrl,websocketUrl} from '../config/env'
export default {
    name: 'list',
    components: {
      loading
    },
    data() {
        return {
            showLoading:false,
            list:[],
            showPrompt: false,
            realName: null,
            promptName: null,
            itemId: null,
            pulldownMsg: '下拉刷新',
            pullupMsg: '加载更多',
            alertHook: 'none',
            page: 1,
            pageSize: 20,
            isShowTip: false,
            user: {}
        }
    },
    computed:{
      
    },
    created(){
       
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
            const that = this;
            this.getData(1).then(res=>{
                this.$nextTick(() => {
                    this.scroll = new BScroll(this.$refs.wrapper,{       //初始化better-scroll
                        probeType:1,   //1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
                        click: true   //是否派发click事件
                    })
                    that.scroll.refresh();
                    // 滑动过程中事件
                    this.scroll.on('scroll',(pos)=>{
                        if(pos.y > 30){
                            this.pulldownMsg = '释放立即刷新'
                        }
                    });
                    //滑动结束松开事件
                    this.scroll.on('touchEnd',(pos) =>{  //上拉刷新
                        if(pos.y > 30){
                            setTimeout(()=>{
                                that.getData(1).then((res)=>{
                                    console.log(res)
                                    //刷新数据
                                    // that.data = res;
                                    //恢复刷新提示文本值
                                    that.pulldownMsg = '下拉刷新'
                                    //刷新成功后提示
                                    that.refreshalert();
                                    //刷新列表后，重新计算滚动区域高度
                                    that.scroll.refresh();
                                })
                            },20)
                        } 
                        else if(pos.y<(this.scroll.maxScrollY - 30)){   //下拉加载
                            this.pullupMsg = '加载中。。。';
                            setTimeout(()=>{
                                that.getData(2).then((res)=>{
                                    //恢复文本值
                                    that.pullupMsg = '加载更多';
                                    // that.data = this.data.concat(res);
                                    that.scroll.refresh();
                                })
                            },20)
                            
                        }
                    })      
                })
              }
            )
          window.clearInterval(timer)
        }
      }, 100);


    },
    beforeDestroy () {
    
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
        // this.$toast(result, {
        //   durtaion: 200,
        //   location: 'center' // 默认在中间
        // });   
      },
      postCurrentCardId(result){
        this.user.personId = result
      },

      getData(type) {//1 下拉刷新 2上拉加载
          let _this = this
          if(type === 1){
            this.page = 1
          }
          return new Promise(resolve => {  //模拟数据请求
              this.showLoading=true;
              axios.post(baseUrl+'/parent/visit-records/list', JSON.stringify({
                  uid: this.user.uid,
                  token: this.user.token,
                  personId: this.user.personId,
                  page: this.page,
                  pageSize: this.pageSize
              }))
              .then(function (response) {
                  this.showLoading=false;
                  console.log(response);
                  if(response.data.success){
                      if(type ===1){
                          this.list = response.data.detail
                      }else{
                          this.list = [...this.list, ...response.data.detail]
                      }
                      if(this.list.length==0){
                        this.isShowTip = true
                      }
                      if(response.data.detail.length===0){
                          _this.$toast("没有更多了！", {
                            durtaion: 200,
                            location: 'center' // 默认在中间
                          });
                      }else{
                          this.page = this.page+1
                          // _this.$toast("请求成功", {
                          //   durtaion: 200,
                          //   location: 'center' // 默认在中间
                          // });
                      }
                      resolve("请求成功")
                  }else{
                      this.$toast(response.data.description, {
                          durtaion: 200,
                          location: 'center' // 默认在中间
                      });
                  }
              }.bind(this))
              .catch(function (response) {
                _this.showLoading = false
                console.log(response);
              })

          })
      },
      refreshalert(){   //刷新成功提示
          this.alertHook = 'block';
          setTimeout(()=>{
              this.alertHook = 'none'
          },1000)
      },
      toDetail(id, name){
          this.realName = null
          this.showPrompt = true
          this.promptName = name
          this.itemId = id
      },
      apply(){
          this.$router.push({ path: '/apply'})
      },
      cancel(){
        this.showPrompt = false
      },
      comfirm(){
        this.showPrompt = false
        if(this.realName === this.promptName){
          this.$router.push({ path: '/detail/'+ this.itemId})
        }else{
          this.$alert({
            title: '验证失败',
            content: '姓名校验失败，请核实后再试'
          })
        }
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
      getList(){
          var _this = this
          this.showLoading=true;
          axios.post(baseUrl+'/parent/visit-records/list', JSON.stringify({
              uid: this.user.uid,
              token: this.user.token,
              personId: this.user.personId,
              page: 1,
              pageSize: 20
          }))
          .then(function (response) {
              this.showLoading=false;
              console.log(response);
              if(response.data.success){
                  this.list = response.data.detail
                  if(this.list.length==0){
                    this.isShowTip = true
                  }
              }else{
                  this.$toast(response.data.description, {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                  });
              }
          }.bind(this))
          .catch(function (response) {
            _this.showLoading = false
            console.log(response);
          })
      },
      
 

 

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
.left{
  float: left;
}
.right{
  float: right;
}
.item-content{
  background: #fff;
}
.wrapper{
    width: 100%;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 92vh;
}
.content{
  min-height: calc(92vh + 1px);
  padding-bottom: 0.7rem;
}
.top-tip{
    position: absolute;  
    top: -40px;  
    left: 0;
    z-index: 1;  
    width: 100%;  
    height:40px;  
    line-height:40px;  
    text-align:center;
    color: #555;
    font-size: 16px;
} 
  
.bottom-tip{
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: #777;
    background: #f2f2f2;
    position: absolute;
    bottom: -35px;
    left: 0;
    font-size: 16px;
}
/* 全局提示信息 */
.alert-hook{
    display: none;
    position: fixed;
    top: 62px;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    background: rgba(7, 17, 27, 0.5);
    font-size: 16px;
}
.content-list{
  padding-bottom: 2rem;
}
.prompt-box{
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 1;
  transition: all 1s;
  z-index: 999;

}
.pro-info{
  padding: 0 .3rem;
  
}
.prompt-box .pro-content{
  min-height: 3rem;
  width: 5.4rem;
  margin: 0 auto;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  // padding: .2rem;
  border-radius: .15rem;
  /* transform: scale(0.8); */
  .btn-group{
    font-size: .32rem;
    overflow: hidden;
    margin-top: .5rem;
    border-top: 1px solid #efefef;
    div{
      float: left;
      width: 50%;
      height: .8rem;
      line-height: .8rem;
      text-align: center;
    }
    .btn-cancel{
      border-right: 1px solid #efefef;
      box-sizing: border-box;
    }
    .btn-comfirm{
      color: #3492e9;
    }
  }
}
.prompt-box .pro-content h4{
  font-size: .32rem;
  text-align: center;
  padding: .1rem;
  color: #444;
}
.prompt-box .pro-content p{
  font-size: .28rem;
  padding: .2rem 0;
  width: 5rem;
  margin: 0 auto;
  span{
    color: #f51818;
  }
}
.prompt-box .pro-content input{
  font-size: .28rem;
  display: block;
  height: .5rem;
  border: 1px solid #999;
  outline: none;
  text-indent: 1em;
  width: 4.7rem;
  margin: 0 auto;
}
.call{
  color: #3492e9;
  text-decoration: underline;
}
.content-list>ul>li>div{
  background-color: #fff;
}
.item-time{
  height: .7rem;
  line-height: .7rem;
  text-align: center;
  color: #8c8c8c;
  font-size: .22rem;
}
.item>div>p{
  font-size: .28rem;
  padding: 0.18rem .3rem;
  color: #444;
  overflow: hidden;
}
.item>div>p .refuse{
  color: #f51818;
}
.item>div>p .pass{
  color: #1bac55;
}
.item>div>p .timeOut{
  color: #b12525;
}
.no-data-wrap>img{
  width: 4.0rem;
  display: block;
  margin: 1.0rem auto;
}
.btn-wrap{
  position: fixed;
  background-color: #fff;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8vh;
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
  position: absolute;
  top: 50%;
  margin-top: -.32rem;
  left: 50%;
  margin-left: -1.5rem;
}
.no-border{
  -webkit-appearance: none;
  border-radius: 0;
  border: none;
}
.no-data{
  padding-top: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  img{
    width: 4.6rem;
    margin: 0 auto;
    display: block;
  }
  p{
    font-size: 0.28rem;
    color: #444;
    text-align: center;
  }
}
</style>
