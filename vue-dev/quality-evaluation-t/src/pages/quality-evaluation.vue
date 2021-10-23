<template>
    <div>

       <div class="item" v-on:click.stop="openPicker">
        <img src="../assets/icon-a5.png" alt="">
        选择班级
        <span class="item-arr"></span>
        <input type="text" class="input-class" readonly="readonly" v-model="className">
      </div>
      <div class="item" > 
        <img src="../assets/icon-a6.png" alt="">
        学生姓名
        <!-- <span class="item-arr"></span> -->
        <input type="text" class="input-name" placeholder="请输入" maxlength="30" v-model="name">
      </div>
   

      <a href="javascript:;" class="login-btn save-btn" v-on:click.stop='select'>查询</a>

      <vue-pickers :show="show1"
        :selectData="pickData1"
        v-on:cancel="close"
        v-on:confirm="confirmFn">
      </vue-pickers>
      <div class="picker-mask" v-show="showMask" @touchmove.prevent>
        
      </div>

      <div class="result-mask-box" v-show="showSuccess" @touchmove.prevent>
          <div class="result-mask">
              <img src="../assets/icon-a12.png" alt="">
              <p>
                <span>{{name}}</span>，<span>{{className}}</span><br/>
              当前存款余额<span class="green">{{totalMoney}}</span>元
              </p>
              <a href="javascript:;" v-on:click="goBack">返回</a>
          </div>
      </div>
      <div class="result-mask-box result-mask-box-fail" v-show="showFail" @touchmove.prevent>
          <div class="result-mask">
              <img src="../assets/icon-a13.png" alt="">
              <p>
                温馨提示：<br/>
                <span>{{failText}}</span>
              </p>
              <a href="javascript:;" v-on:click="closeFail">关闭</a>
          </div>
      </div>
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl} from '../config/env'
import VuePickers from 'vue-pickers'
export default {
    name: 'index',
    components: {
      loading,
      VuePickers
    },
    data() {
        return {
          showLoading:false,
          show1:false,
          showMask:false,
          showSuccess:false,
          showFail:false,
          failText:"",
          className:"",
          classId:"",
          name:"",
          money:"",
          totalMoney:"",
          pickData1: {
            columns: 1, // picker的列数
            default: [
             
            ], // 默认显示哪个
            // 第一列的数据结构
            data1: []
          },
          user: {}
        }
    },
    mounted(){

        setTimeout(() => {
          this.init()
        }, 100);
       
        if(isiOS()){
            window.webkit.messageHandlers.showRightToolBar.postMessage(false);
        }else{
            window.app.showRightToolBar(false);
        }
    },
    beforeCreate(){

    },
    methods:{
        init(){
          this.showLoading=true;
          axios.post(baseUrl+'/pad/financial/class', JSON.stringify({
                uid: sessionStorage.getItem("uid"),
                token: sessionStorage.getItem("token")
            }))
            .then(function (response) {
                this.showLoading=false;
                console.log(response);
                if(response.data.success){
                let pickerArr=[];
                for(let i=0;i<response.data.detail.length;i++){
                  pickerArr.push({
                      "text":response.data.detail[i].classesName,
                      "value":response.data.detail[i].classId
                    })
                }
                this.pickData1.data1=pickerArr;

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
        close() {
           this.show1=false;
           this.showMask=false;
        },
        confirmFn(data){
            console.log(data);
            this.className=data.select1.text;
            this.classId=data.select1.value;
            this.show1=false;
            this.showMask=false;
            this.pickData1.default=[{
              "text":data.select1.text,
              "value":data.select1.value
            }]
        },
        openPicker(){
            this.showMask=true;
            this.show1=true;
        },
        select(){
            if(this.isNull(this.className)){
              this.$toast("请选择班级", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
              });
              return;
            }
            if(this.isNull(this.name)){
              this.$toast("请输入姓名", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
              });
              return;
            }
            if(this.isEmojiCharacter(this.name)){
              this.$toast("请输入正确的姓名,不能含有表情符号！", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
              });
              return;
            }
            this.showLoading=true;
            axios.post(baseUrl+'/pad/financial/select', JSON.stringify({
                uid: sessionStorage.getItem("uid"),
                token: sessionStorage.getItem("token"),
                classId:this.classId,
                name:this.name
              }))
              .then(function (response) {
                  this.showLoading=false;
                  console.log(response);
                  if(response.data.success){
                  this.showSuccess=true;
                  this.totalMoney=response.data.detail;
                }else{
                  this.showFail=true;
                  this.failText=response.data.description;
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
          goBack(){
            window.history.go(-1);
          },
          closeFail(){
            this.showFail=false;
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
            checkMoney(num){
                var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
                if(exp.test(num)){
                  return true;
                }else{
                  return false;
                }
            } 
            
       
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .item{
    height: 1.2rem;
    width: 6.8rem;
    line-height: 1.2rem;
    background-color: #fff;
    margin:0.24rem auto;
    position: relative;
    border-radius: 0.08rem;
    font-size: 0.36rem;
    color: #7b7b7b;
    padding-left: 1.2rem;
    box-sizing: border-box;
   }
 
   .item>img{
    position: absolute;
    display: block;
    width:0.7rem;
    height: 0.7rem;
    left: 0.3rem;
    top: 50%;
    margin-top: -0.35rem;
   }
   .item-arr{
    display: block;
    position: absolute;
    width: 0.2rem;
    height: 0.35rem;
    right: 0.36rem;
    top: 50%;
    margin-top: -0.175rem;
    background-image: url(../assets/icon-arr.png);
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
   }
   .save-btn{
  width: 6.15rem;
  height: 0.9rem;
  text-align: center;
  line-height: 0.9rem;
  color: #fff;
  background-color: #4fc2f3;
  display: block;
  font-size: 0.3rem;
  text-decoration: none;
  border-radius: 0.08rem;
  margin: 0.9rem auto;
}
.item>input{
  position: absolute;
  width:3.2rem;
  height: 0.4rem;
  line-height: 0.4rem;
  right: 0.35rem;
  top: 50%;
  margin-top: -0.2rem;
  padding: 0;
  border: none;
  outline: none;
  text-align: right;
  font-size: 0.3rem;
  color: #7b7b7b;

}
::-webkit-input-placeholder { /* WebKit browsers */
  color:    #afafaf;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color:    #afafaf;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color:    #afafaf;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
  color:    #afafaf;
}
.item>.input-class{
  right: 0.75rem;
}
.picker-mask{
  position: fixed;
  background-color: rgba(0,0,0,0.5);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;

}
.result-mask-box{
  position: fixed;
  background-color: rgba(0,0,0,0.3);
  z-index: 999;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}
.result-mask{
  width:5.4rem;
  /*height: 3.36rem;*/
  background-color: #fff;
  position: absolute;
  top: 50%;
  margin-top: -1.68rem;
  left: 50%;
  margin-left: -2.7rem;
  border-radius: 0.08rem;
  /*overflow: hidden;*/
}
.result-mask>img{
  position: absolute;
  width: 2.48rem;
  height: 1.77rem;
  top: -0.9rem;
  left: 50%;
  margin-left: -1.24rem;
}
.result-mask>p{
  /*position: absolute;*/
  word-break: break-all;
  font-size: 0.26rem;
  color: #7b7b7b;
  top: 0.86rem;
  padding: 0.25rem;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  line-height: 0.55rem;
  font-size: 0.28rem;
  padding-top: 0.86rem;
}
.result-mask>p>span.green{
  color: #4696db;
}
.result-mask>a{
  display: block;
  height: 0.9rem;
  background-color: #f5f5f9;
  text-align: center;
  line-height: 0.9rem;
  color: #5687ea;
  /*position: absolute;*/
  bottom: 0;
  font-size: 0.28rem;
  width: 100%;
  text-decoration: none;
  border-bottom-left-radius: 0.08rem;
  border-bottom-right-radius: 0.08rem;
  border-top: 0.01rem solid #d1d1d1;
}
.result-mask-box-fail>.result-mask>p{
  line-height: .48rem;
}
</style>
