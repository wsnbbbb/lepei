<template>
      <div>
        <div class="content-list">
            <ul>
              <li class="item" v-bind:key="item.recordId" v-for="item in list" v-on:click="toDetail(item.recordId, item.visitorName)">
                <p class="item-time">{{item.createTime}}</p>
                <div>
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
            list:[],
            showPrompt: false,
            realName: null,
            promptName: null,
            itemId: null,
            isShowTip: false,
        }
    },
    computed:{
      
    },
    mounted(){
      this.getList()
    },
    beforeDestroy () {
    
    },
    methods:{
      toDetail(id, name){
          this.realName = null
          this.showPrompt = true
          this.promptName = name
          this.itemId = id
      },
      apply(){
          this.$router.push({ path: '/apply/'+this.$route.params.schoolId})
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
          axios.post(baseUrl+'/web/visit-records/list', JSON.stringify({
              schoolId: this.$route.params.schoolId,
              telephone: sessionStorage.getItem("phone"),
          }))
          .then(function (response) {
              this.showLoading=false;
              console.log(response);
              if(response.data.success){
                  this.list = response.data.detail
                  if(response.data.detail.length==0){
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
  padding: .16rem 0;

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
.no-border{
  -webkit-appearance: none;
  border-radius: 0;
  border: none;
}
.no-data{
  padding-top: 2rem;
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
