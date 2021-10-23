<template>
    <div class="list-wrap">
       <div class="list-item">
          <img src="../assets/icon-star.png" alt="">
          品名
          <input type="text" placeholder="请输入" v-model="propertyName" maxlength="20">
       </div>
         <div class="list-item">
          <img src="../assets/icon-star.png" alt="">
          请购数量
          <input type="tel" placeholder="请输入" v-model="applyNum" maxlength="5" autocomplete="off" oninput="if(value.length>5)value=(value.slice(0,5)).replace(/[^\d]/g,'')">
          
       </div>
        <div class="list-item">
          <img src="../assets/icon-star.png" alt="">
       
          单位
          <input type="text" placeholder="请输入" v-model="propertyUnit" maxlength="5">
       </div>
        <div class="list-item mb20">
          <img src="../assets/icon-star.png" alt="">
          用途
          <input type="text" placeholder="请输入" v-model="usage" maxlength="100">
       </div>

       <div class="list-item ti0">
             规格
          <input type="text" placeholder="请输入" v-model="specification" maxlength="20" >
       </div>
         <div class="list-item ti0">
          单价
    <!--       <input type="text" placeholder="请输入" v-model="price" maxlength="6" oninput="if( ! /^-?\d+\.?\d{0,2}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.length-1);}"> -->
            <input type="text" placeholder="请输入" v-model="price" maxlength="6"  oninput="if( ! /^d*(?:.d{0,2})?$/.test(this.value)){});this.value='';}" >
       </div>
        <div class="list-item ti0">
          预算费用
          <input type="text" placeholder=""  v-model="totalMoney" maxlength="20" readonly="readonly">
       </div>
       <div class="list-item ti0">
          时间要求
          <input type="text" placeholder="请输入" v-model="timeRequest" maxlength="20">
       </div>
       <div class="list-item ti0">
          备注
          <input type="text" placeholder="请输入" v-model="remark" maxlength="50">
       </div>

         <div class="list-item bottom-color">
          <img src="../assets/icon-star.png" alt="">
          项为必填项
       </div>
  
    
      <section class="btn-box">
        <a href="javascript:;" v-on:click="apply">确定</a>
      </section>
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl} from '../config/env'
export default {
    name: 'add-goods',
    components: {
      loading
    },
    data() {
        return {
            showLoading:false,
            propertyName:"",
            applyNum:"",
            propertyUnit:"",
            specification:"",
            usage:"",
            price:"",
            timeRequest:"",
            remark:"",
            oldNum:1,
            user: {}

        }
    },
    computed: {
        reversedMessage: function () {
          return 555
        },
        inpNum:{
            get:function(){
                return this.oldNum;
            },
            set:function(newValue){
                this.oldNum=newValue.replace(/[^\d]/g,'');
            }
        },
        totalMoney: function(){
          if((!!this.price)&&(!!this.applyNum)){
              let r = /^\+?[1-9][0-9]*$/;　　//正整数 
              if(!r.test(this.applyNum)){
                   return "";
              }
              let s=/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/　; //正浮点数
              if(!s.test(this.price)){
                   return "";
              }
            return (parseFloat(this.applyNum)*parseFloat(this.price)).toFixed(2); 
          }else{
            return 0;
          }
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

        if(this.isiOS()){
            window.webkit.messageHandlers.showRightToolBar.postMessage(false);
        }else{
            window.app.showRightToolBar(false);
        }

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
        apply(){
            if(this.isEmojiCharacter(this.propertyName)||this.isEmojiCharacter(this.applyNum)||this.isEmojiCharacter(this.usage)||this.isEmojiCharacter(this.propertyUnit)||this.isEmojiCharacter(this.specification)||this.isEmojiCharacter(this.propertyUnit)||this.isEmojiCharacter(this.price)||this.isEmojiCharacter(this.timeRequest)||this.isEmojiCharacter(this.remark)){
                 this.$toast("内容不能含有表情符号！", {
                        durtaion: 200,
                        location: 'center' // 默认在中间
                  });
                 return;
            }

            if((!this.isNull(this.propertyName))&&(!this.isNull(this.usage))&&(!this.isNull(this.applyNum))&&(!this.isNull(this.propertyUnit))){
              let r = /^\+?[1-9][0-9]*$/;　　//正整数 
              if(!r.test(this.applyNum)){
                 this.$toast("请购数量输入不合法！请重新输入", {
                          durtaion: 200,
                          location: 'center' // 默认在中间
                    });
                   return;
            }

            let s=/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/　; //正浮点数
            if(!!this.price){
                if(!s.test(this.price)){
                   this.$toast("单价输入不合法！请重新输入", {
                            durtaion: 200,
                            location: 'center' // 默认在中间
                      });
                     return;
              }
            }
            if(!!this.price){
              if(Number(this.price)*parseInt(this.applyNum)>=100000000){
                 this.$toast("总金额过高!请修改", {
                            durtaion: 200,
                            location: 'center' // 默认在中间
                      });
                     return;
              }
            }
              var list=new Array();
              if(!!sessionStorage.getItem("list")){
                  list=JSON.parse(sessionStorage.getItem("list"))
              }
             
             list.push(
                  {propertyName:this.propertyName,
                  applyNum:this.applyNum,
                  propertyUnit:this.propertyUnit,
                  specification:this.specification,
                  propertyUnit:this.propertyUnit,
                  applyUse:this.usage,
                  price:this.price,
                  timeRequest:this.timeRequest,
                  remark:this.remark
                }               
              )
              
              sessionStorage.setItem("list",JSON.stringify(list));
               this.$alert("添加物品成功").then(
                function(){
                   window.history.go(-1);
                }
              ).catch(
                    function(){
                        console.log("no");
                    }
                )
              
            }else{
                this.$toast("请输入必填项", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                });
            }
            
        },
         isNull( str ){
          if ( str == "" ) return true;
          var regu = "^[ ]+$";
          var re = new RegExp(regu);
          return re.test(str);
        },
          isEmojiCharacter(substring) {
            if(!substring){
              return;
            }
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
margin:0;
padding: 0;
}
input, button, select, textarea {
outline: none;
-webkit-appearance: none;
border-radius: 0;
}
   li{
    list-style:none;
   }
.list-item{
  position: relative;
  font-size: 0.32rem;
  padding-left: 0.35rem;
  height: 0.9rem;
  line-height: 0.9rem;
  text-indent: 2em;
  background-color: #fff;
  color: #626263;
  border-bottom: 1px solid #f5f5f9;
}
.list-item>img{
  position: absolute;
  width: 0.34rem;
  height: 0.34rem;
  left: 0.35rem;
  top:50%;
  margin-top: -0.17rem;
}
.list-item>input{
  position: absolute;
  right: 0.4rem;
  top:50%;
  height: 0.4rem;
  margin-top: -0.2rem;
  border:none;
  text-align: right;
  width: 4.6rem;
  color: #7b7b7b;
  font-size: 0.28rem;
}
.mb20{
  margin-bottom: 0.2rem;
}
.ti0{
  text-indent: 0;
}
.bottom-color{
  background: #f5f5f9;
}
.btn-box a{
  width: 6.6rem;
  height: 0.9rem;
  line-height: 0.9rem;
  text-align: center;
  color: #fff;
  text-decoration: none;
  font-size: 0.32rem;
  background-color: #4fc2f3;
  display: block;
  border-radius: 0.08rem;
  margin: 2rem auto;
}
</style>
