<template>
    <div>
       <ul>
         <li class="item-li"  v-on:click.stop="openUrl('parents-word-detail',list.semesterId,list.status)" v-for="list in listArr" v-bind:id="list.semesterId">
           <img src="../assets/bg15.jpg" alt="">
           <div class="li-info">
              <p>{{list.semesterName}}</p>
              <p>{{list.status==0?"未评价":"已评价"}}</p>
           </div>
           <span class="li-arr"></span>
         </li>
        
        
       </ul>
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
          listArr:[],
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
          axios.post(baseUrl+'/teacher/quality-valuation/comment-list', JSON.stringify({
              uid: this.user.uid,
              token: this.user.token,
              personId:this.user.personId,
              studentId:sessionStorage.getItem("studentId"),
              type:2 //1自我 2家长 3教师
          }))
          .then(function (response) {
              this.showLoading=false;
              console.log(response);
              if(response.data.success){
                this.listArr=response.data.detail;

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
        openUrl(url,semesterId,status){
          if(status==0){
              this.$toast("该学期还未评价！", {
                durtaion: 200,
                location: 'center' // 默认在中间
                  });
              return;
          }
          sessionStorage.setItem("semesterId",semesterId);
         this.$router.push({ path: url});
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
  list-style: none;
}
.item-li{
  padding: 0.2rem 0;
  padding-left: 0.45rem;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  margin-top: 0.1rem;
}
.item-li:first-child{
  margin-top: 0.2rem;
}
.item-li>img{
  width: 1.0rem;
  height: 1.0rem;
  display: block;
  float: left;

}
.item-li>div{
  float: left;
  padding-left: 0.25rem;
}
.item-li>div>p:first-child{
  font-size: 0.26rem;
  color: #626262;
  padding-top: 0.1rem;
  padding-bottom: 0.15rem;
}
.item-li>div>p:nth-child(2){
  font-size: 0.24rem;
  color: #989898;
}
.li-arr{
  display: block;
  width:0.13rem;
  height: 0.2rem;
  position: absolute;
  background-image: url(../assets/b7.png);
  background-repeat: no-repeat;
  background-position: center;
  right: 0.38rem;
  background-size: 100%;
  top: 50%;
  margin-top: -0.1rem;
}
</style>
