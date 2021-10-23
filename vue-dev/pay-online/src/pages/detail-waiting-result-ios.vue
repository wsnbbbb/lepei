<template>
    <div>
       
        <div class="tip-text">
          <img src="../assets/p13.png"  alt="">
          <h3>操作成功</h3>
          <p>
            请返回查看支付结果
          </p>
          <a href="javascript:;" class="btn-end" v-on:click="finish">完成</a>
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
           
        }
    },
    mounted(){
  
    },
    methods:{
      finish(){
          window.history.go(-3)
      }
    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   .error-tip{
    padding-top: 0.35rem;
    background-color: #fff;
  }
  .error-tip>img{
    margin: 0 auto;
    display: block;
    width: 0.88rem;
    height: 0.88rem;
  }
  .error-tip>p{
  text-align: center;

  }
  .error-tip>p.tip-no{
    color: #626262;
    font-size: 0.32rem;
    padding-top: 0.25rem;

  }
  .error-tip>p.tip-no-match{
    color: #bababa;
    font-size: 0.22rem;
    padding-top: 0.2rem;
    padding-bottom: 0.25rem;
  }
  .content-title{

    display: block;
    font-size: 0.32rem;
    /*float: left;*/
    border-bottom: 1px dotted #dddddd;
   }
   .content-title>div{
      display: inline-block;
      position: relative;
      padding: 0 0.3rem;
      max-width: 5rem;
      word-break: break-all;
      font-size: 0.32rem;
      color: #626262;
      /*min-height: 0.96rem;*/
      padding: 0.35rem 0.35rem;
      box-sizing: border-box;
   }
  .content-title>div>.img1{
    position: absolute;
    width: 0.3rem;
    height: 0.22rem;
    display: block;
    left: 0;
    top: 0.47rem;
  }
   .content-title>div>.img2{
    position: absolute;
    width: 0.3rem;
    height: 0.22rem;
    display: block;
    right:  0;
    top: 0.47rem;
  }
  .bill-content{
    margin-top: 0.27rem;
    background: #fff;
    padding: 0 0.3rem;
  }
  .content-title>span{
    float: right;
    padding-top: 0.3rem;
    font-size: 0.36rem;
    color: #78cded;
  }
  .content-des{
    padding: 0.26rem 0;
    font-size: 0.26rem;
    color: #7b7b7b;
    line-height: 0.42rem;
    word-break: break-all;
    border-bottom: 1px dotted #dddddd;
  }
  .content-time{
    font-size: 0.26rem;
    color: #7b7b7b;
    height: 1.08rem;
    line-height: 1.08rem;
  }
  .bill-obj{
    margin-top: 0.26rem;
    background-color: #fff;
    padding:0.3rem 0;
  }
  .bill-obj>p{
    font-size: 0.28rem;
    padding: 0.1rem 0.3rem;
    color: #7b7b7b;
    overflow: hidden;
  }
  .bill-obj>p>span:nth-child(2){
    padding-left: 0.5rem;
  }
  .bill-obj>p:nth-child(3)>span{
    float: left;
  }
   .bill-obj>p:nth-child(3)>span:nth-child(2){
    max-width: 5rem;
    word-break: break-all;
  }
  .bill-bottom{
    margin-top: 0.26rem;
    background-color: #fff;
  }
  .bill-bottom>p{
    font-size: 0.28rem;
    color:#7b7b7b;
    padding: 0 0.3rem;
  }
   .bill-bottom>p:first-child{
    padding: 0.36rem;

   }
   .bill-bottom>p:first-child>span{
    color: #78cded;
   }
   .bill-bottom>p:last-child{
    padding: 0.4rem 0.3rem;
    word-break: break-all;
    padding-top: 0;
   }
  .tip{
    font-size: 0.28rem;
    color: #ffa25e;
    height: 0.8rem;
    line-height: 0.8rem;
    position: relative;
    background-color: #fff;
    padding-left: 0.8rem;
  }
  .tip>img{
    width: 0.36rem;
    height: 0.36rem;
    display: block;
    position: absolute;
    left: 0.22rem;
    top: 50%;
    margin-top: -0.18rem;
  }
  .btn-box{
    padding: 0.96rem 0.3rem ;

  }
  .btn-box>p{
    font-size: 0.22rem;
    color: #7b7b7b;
  }
  .btn-box>p>a{
    font-size: 0.22rem;
    color: #7b7b7b;
    text-decoration: none;
    color: #46a8d2;
  }
  .btn-submit{
    display: block;
    width: 6.6rem;
    height: 0.88rem;
    color: #fff;
    text-align:center;
    line-height: 0.88rem;
    font-size: 0.3rem;
    background: #4fc2f3;
    text-decoration: none;
    border-radius: 0.1rem;
    margin: 0.2rem auto;
  }
   .btn-box .btn-box-bottom{
    color: #afafaf;
    text-align: center;
  }
  .check-box{
    width: 0.24rem;
    height: 0.24rem;
    display: inline-block;
    background-image: url(../assets/p9.png);
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
  
  }
  .btn-box> .active .check-box{
        background-image: url(../assets/p10.png);
  }
  .mask{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index:99;
  }
  .mask-box{
    width: 5.0rem;
    height: auto;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -2.5rem;
    margin-top: -1.5rem;
    z-index: 999;
    border-radius: 0.1rem;
  }
  .mask-box>p{
    font-size: 0.28rem;
    color: #343434;
    text-align: center;
    padding: 0.3rem 0;
    border-bottom: 0.01rem solid #efefef;
  }
  .hasOk{
    color: #FF2B45;
    font-size: 0.28rem;
    height: 0.9rem;
    display: block;
    width: 100%;
    line-height: 0.9rem;
    text-align: center;
    text-decoration: none;
    /*border-bottom: 0.01rem solid #efefef;*/
  }
  .hasError{
    color: #797979;
    font-size: 0.28rem;
    height: 0.9rem;
    display: block;
    width: 100%;
    line-height: 0.9rem;
    text-align: center;
    text-decoration: none;
  }
  .back{
     color: #797979;
    font-size: 0.28rem;
    height: 0.9rem;
    display: block;
    width: 100%;
    line-height: 0.9rem;
    text-align: center;
    text-decoration: none;
  }
  .tip-text{
    padding-top: 2rem;
    font-size: 0.28rem;
    text-align: center;

  }
  .tip-text>h3{
      font-weight: 400;
  }
  .tip-text>img{
    width: 1.28rem;
    height: 1.28rem;
    display: block;
    margin: 0 auto;
  }
    .tip-text>p{
      text-align: center;
      color: #9E9E9E;
    }
    .btn-end{
      width: 2.0rem;
      height: 0.6rem;
      border: 1px solid #2BBEFA;
      text-align: center;
      display: block;
      margin:0 auto;
      line-height: 0.6rem;
      text-decoration: none;
      color: #2BBEFA;
      border-radius: 4px;
      margin-top: 0.5rem;
    }
</style>
