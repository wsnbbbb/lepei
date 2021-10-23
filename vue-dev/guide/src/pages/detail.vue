<template>
    <div>
        <div class="top-bg"></div>
        <div class="info-box">
            <div class="box-content">
                <img :src=schoolLogo alt="">
            </div>
            <p class="info-item">
                <span class="info-name">学校</span>
                <span class="info-value">{{schoolName?schoolName:"- - - -"}}</span>
            </p>
            <p class="info-item">
                <span class="info-name">姓名</span>
                <span class="info-value">{{name?name:"- - - -"}}</span>
            </p>
            <p class="info-item">
                <span class="info-name">班级</span>
                <span class="info-value">{{className?className:"- - - -"}}</span>
            </p>
             <p class="info-item">
                <span class="info-name">卡号</span>
                <span class="info-value">{{icCardNo?icCardNo:"- - - -"}}</span>
            </p>
             <p class="info-item">
                <span class="info-name">校验码</span>
                <span class="info-value">{{activeCode?activeCode:"- - - -"}}</span>
            </p>
        </div>
        <p class="tip">
          如有疑问，请阅读<a href="javascript:;" v-on:click.stop="toLink">《绑卡须知》</a>
        </p>
        <div  class="bg-box">
            <img src="../assets/p4.png"  alt="">
        </div>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
export default {
    name: 'index',
    components: {
      loading
    },
    data() {
        return {
            name:'',
            className:'',
            icCardNo:'',
            schoolLogo:'',
            schoolName:'',
            activeCode:'',
            schoolLogo:''
        }
    },
    mounted(){
      this.name=sessionStorage.getItem("name");
      this.className=sessionStorage.getItem("className");
      this.icCardNo=sessionStorage.getItem("icCardNo");
      this.schoolLogo=sessionStorage.getItem("schoolLogo");
      this.schoolName=sessionStorage.getItem("schoolName");
      this.activeCode=sessionStorage.getItem("activeCode");
      if(!!sessionStorage.getItem("schoolLogo")){
         this.schoolLogo=sessionStorage.getItem("schoolLogo");
      }else{
         this.schoolLogo=require("../assets/p5.png")
      }
    },
    methods:{
        toLink(){
          window.location.href="http://api.lepayedu.com/web/person/bind-document"
        }
    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-bg{
  height: 1.4rem;
  background: #fff;
  border-bottom: 1px solid #c5c5c7;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: -1;
}
.info-box{
  width:6.7rem;
  background: #fff;
  margin: 0 auto;
  /*height: 5.88rem;*/
  z-index: 999;
  margin-top: 0.5rem;
  border-radius:  5px;
  box-shadow:0px 0px 5px 5px #ececec;
  padding-bottom: 0.22rem;
}
.box-content{
  height: 1.68rem;
  width: 6.0rem;
  margin: 0 auto;
  border-bottom: 1px dotted #ccc;
  padding-top: 0.2rem;
  box-sizing: border-box;
  margin-bottom: 0.2rem;
}
.box-content>img{
  width: 1.2rem;
  height: 1.2rem;
  display: block;
  margin: 0 auto;
  border-radius: 100.0rem;
}
.info-item{
  overflow: hidden;
/*  height: 0.76rem;
  line-height: 0.76rem;*/

  font-size: 0.26rem;
  color: #1b1f23;
  padding: 0.2rem 0.3rem;

}
.info-item>.info-name{
  float: left;
}
.info-item>.info-value{
  float: right;
  color: #585858;
  max-width: 5.0rem;
  word-break: break-all;
}
.tip{
  color: #7b7b7b;
  font-size: 0.24rem;
  padding-left: 0.37rem;
  padding-top: 0.4rem;
}
.tip>a{
  color: #39a2cf;
  text-decoration: none;
}
.bg-box{
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -1;

}
.bg-box>img{
  width: 100%;
  display: block;

}
.info-value-p{
  font-size: 0.26rem;
  width: 5.0rem;
  float: right; 
}
</style>
