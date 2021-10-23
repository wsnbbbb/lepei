<template>
  <div id="app">
      <div class="header">
      <img :src="portrait" alt="">
      <div class="info">
        <p>{{studentName}}</p>
        <p>{{className}}</p>
      </div>
      </div>
      <div class="image">
        <img src="./assets/imgs/polygon.png" alt="">
        <div class="ranking">
          <p>{{typeName}}</p>
          <p>{{levelTitle}}</p>
          <p class="text">{{awardOrg}}</p>
        </div>
      </div>
      <div class="imgs">
        <img v-for="(item,index) in imgs" 
        :src="item" 
        :key="index">
      </div>
   
  </div>
</template>

<script>
import {post} from './util/http'
import { getQueryString } from './util/util'
export default {
  data(){
    return {
      portrait:'',//头像
      studentName:'', //学生名
      className:'', //班级
      levelTitle:'', //等级名
      typeName:'', //类型名
      imgs:[] , //图片列表
      awardOrg:'' //颁奖机构

    }
  },
  created(){
    let recordId = getQueryString("recordId")
    let studentId = getQueryString("studentId")
    let params = {
      recordId,
      studentId
    }
    post('/web/share/person-honor',params)
    .then(res =>{
      this.portrait = res.detail.portrait;
      this.studentName = res.detail.studentName;
      this.className = res.detail.className;
      this.levelTitle = res.detail.levelTitle;
      this.typeName = res.detail.typeName;
      this.awardOrg = res.detail.awardOrg;
      this.imgs = res.detail.imgs;
      
    })
  },
  methods:{
  }
}
</script>

<style lang="less">
html,body,#app{
    width:100%;
    height: 100%;
    margin:0;
    padding:0;
}
body{
  width:100%;
  height:100vh;
  background:url('./assets/imgs/bgImg.png') center center repeat;
  background-size: 100vw 100vh;
  // background-size: cover
}

#app{
  position: relative;
    p{
      margin:0;
    }
    .header{
      height:8rem; 
      display: flex;
      justify-content:space-around;
      align-items: center;
      padding:1.5rem;
      img{
        width:7.1875rem;
        height:7.1875rem;
        border-radius: 50%;
      }
      .info{
        p{
          &:first-child{
            font-size:1.5rem;
            padding-bottom: 10px;
          }
          &:last-child{
            color:#767374;
            font-size:1.125rem;
          }
        }
      }
    }
    .image{
      width:70%;
      height:15rem;
      position: absolute;
      left:15%;
      top:10rem;
      text-align:center;
      img{
        width:100%;
      }
      .ranking{
        padding-top:14%;
        width:100%;
        position: absolute;
        top:0;
        left:0;
        color:rgb(68,68,68);
        
        p{
          &:first-child{
            font-size:1.75rem;
            margin-bottom:1.5rem;
            font-weight: bold;
          }
          &:nth-child(2){
            font-size:2rem;
            font-weight: bold;
          }
          &:last-child{
            font-size:0.8rem;
            padding-top:2.6rem;
          }
        }
      }
    }
    .imgs{
      padding:1.25rem 0;
      position: absolute;
      left:0;
      top:27rem;
      width:100%;
      display: flex;
      flex-wrap:wrap;
      justify-content: space-around;
      img{
        width:35%;
      }
    }

  
 
}
</style>
