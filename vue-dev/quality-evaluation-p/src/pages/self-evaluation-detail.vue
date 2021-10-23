<template>
    <div>
        <div class="box" v-show="showContent">
          <p class="title">{{title}}</p>
          <p class="content">{{comment}}</p>
          <p class="time">
             {{time}}
          </p>
        </div>
        <div class="box edit" v-show="showEdit">
          <p class="title">自我评价：</p>
          <textarea name="" id="" cols="30" rows="10" placeholder="请输入" v-model="comment"></textarea>
          <a href="javascript:;" class="submit-btn" v-on:click.stop="submit">保存</a>
        </div>
        <div class="tip" v-show="showTip">
            当前不能评价！
        </div>
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
          comment:'',
          showContent:false,
          showEdit:false,
          showTip:false,
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
              this.getCommentDetail();
              window.clearInterval(timer)
            }
        }, 100);

    },
    beforeCreate(){

    },
    methods:{
        getCommentDetail(){
           axios.post(baseUrl+'/parent/quality-valuation/comment-detail', JSON.stringify({
                  uid: this.user.uid,
                  token: this.user.token,
                  personId: this.user.personId,
                  semesterId: sessionStorage.getItem("semesterId"),
                  type: 1 //1自我 2家长 3教师
            }))
            .then(function (response) {
                this.showLoading=false;
                console.log(response);
                if(response.data.success){
                  if(response.data.detail.canEdit==false){
                      
                      if(response.data.detail.detail==''){
                        this.showTip=true;
                      }else{
                        this.showContent=true;
                        this.title=response.data.detail.title;
                        this.comment=response.data.detail.detail;
                        this.time=response.data.detail.time;
                      }
                  }else{
                      this.showEdit=true;
                      this.title=response.data.detail.title;
                      this.comment=response.data.detail.detail;
                      this.time=response.data.detail.time;
                  }
              }else{
                    // this.showContent=false;
                    // this.$toast(response.data.description, {
                    // durtaion: 200,
                    // location: 'center' // 默认在中间
                    //     });
                    }
            }.bind(this))
            .catch(function (response) {
              console.log(response);
            });
        },

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
        submit() {

          if(this.isNull(this.comment)){
              this.$toast("输入内容不能为空", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
              });
              return;
            }
            if(this.isEmojiCharacter(this.comment)){
              this.$toast("输入内容不能含有表情符号！", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
              });
              return;
            }
           axios.post(baseUrl+'/parent/quality-valuation/student-comment-apply', JSON.stringify({
              uid: this.user.uid,
              token: this.user.token,
              personId:this.user.personId,
              // studentId:sessionStorage.getItem("studentId"),
              semesterId:parseInt(sessionStorage.getItem("semesterId")),
              comment:this.comment,
              // type:1 //1自我 2家长 3教师

          }))
          .then(function (response) {
              this.showLoading=false;
              console.log(response);
              if(response.data.success){
                this.$confirm(
                      {
                          title: '',
                          content: '提交成功',
                          yesText: '返回',
                          noText: '确定'
                      }).then(
                        function(){
                          console.log("ok")
                          window.history.go(-1);
                        }
                      ).catch(
                        function(){
                          console.log('点了取消')
                        }
                      );

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
        isEmojiCharacter(substring) {
                for (var i = 0; i < substring.length; i++) {
                    var hs = substring.charCodeAt(i);
                    if (0xd800 <= hs && hs <= 0xdbff) {
                        if (substring.length > 1) {
                            var ls = substring.charCodeAt(i + 1);
                            var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                            if (0x1d000 <= uc && uc <= 0x1f77f) {
                                return true;
                            }
                        }
                    } else if (substring.length > 1) {
                        var ls = substring.charCodeAt(i + 1);
                        if (ls == 0x20e3) {
                            return true;
                        }
                    } else {
                        if (0x2100 <= hs && hs <= 0x27ff) {
                            return true;
                        } else if (0x2B05 <= hs && hs <= 0x2b07) {
                            return true;
                        } else if (0x2934 <= hs && hs <= 0x2935) {
                            return true;
                        } else if (0x3297 <= hs && hs <= 0x3299) {
                            return true;
                        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
                            hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
                            hs == 0x2b50) {
                            return true;
                        }
                    }
                }
            },
            isNull( str ){
              if ( str == "" ) return true;
              var regu = "^[ ]+$";
              var re = new RegExp(regu);
              return re.test(str);
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
div.box>p.title{
  color: #3492e9;
  font-size: 0.26rem;
   padding-bottom: 0.1rem;
}
div.box{
  padding: 0.2rem 0.3rem;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
}
div.box>p.content{
  color: #626262;
  font-size: 0.24rem;
  padding: 0.25rem 0 0.66rem 0;
  line-height: 0.35rem;
  word-break: break-all;
}
div.box>p.time{
  color: #626262;
  font-size: 0.24rem;
  text-align: right;
  /*padding-bottom: 2rem;*/
}
div.edit>p{
  padding-bottom: 0.1rem;
}
div.edit>textarea{
   width: 6.8rem;
  height: 4.0rem;
  outline: none;
  border: 1px solid #4fc2f3;
  padding: 0.1rem;
  color: #626262;
  -webkit-appearance: none;
  appearance: none;
  margin: 0 auto;
  box-sizing: border-box;
  display: block;
  resize:none;
}
.submit-btn{
  width: 5.0rem;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  text-decoration: none;
  color: #fff;
  background-color: #4fc2f3;
  margin: 2rem auto;
  display: block;
  font-size: 0.3rem;
  border-radius: 0.1rem;

}
.tip{
  text-align: center;
  font-size: 0.3rem;
  padding-top: 2rem;
}
</style>
