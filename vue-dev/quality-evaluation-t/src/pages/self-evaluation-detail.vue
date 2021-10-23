<template>
    <div>
        <p class="title">{{title}}</p>
        <p class="content">{{content}}</p>
        <p class="time">
            {{time}}
        </p>
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
          title:'',
          content:'',
          time:'',
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
              this.init()
              window.clearInterval(timer)
          }
        }, 100);

        if(this.isiOS()){
            window.webkit.messageHandlers.showRightToolBar.postMessage(false);
        }else{
            window.app.showRightToolBar(false);
        }

    },
    beforeCreate(){

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
        close() {
        
        },
        init(){
          axios.post(baseUrl+'/teacher/quality-valuation/comment-detail', JSON.stringify({
                  uid: this.user.uid,
                  token: this.user.token,
                  personId: this.user.personId,
                  studentId: sessionStorage.getItem("studentId"),
                  semesterId: sessionStorage.getItem("semesterId"),
                  type: 1 //1自我 2家长 3教师
            }))
            .then(function (response) {
                this.showLoading=false;
                console.log(response);
                if(response.data.success){
                
                this.title=response.data.detail.title;
                this.content=response.data.detail.detail;
                this.time=response.data.detail.time;

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
div>p.title{
  color: #3492e9;
  font-size: 0.26rem;
}
div{
  padding: 0.2rem 0.3rem;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
}
div>p.content{
  color: #626262;
  font-size: 0.24rem;
  padding: 0.25rem 0 0.66rem 0;
  line-height: 0.35rem;
  word-break: break-all;
}
div>p.time{
  color: #626262;
  font-size: 0.24rem;
  text-align: right;
  padding-bottom: 2rem;
}
</style>
