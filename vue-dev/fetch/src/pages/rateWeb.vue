<template>
    <div class="list-wrap">
      <ul class="list">
          <li class="list-item" v-for="item in list" v-on:click.stop="openUrl(item.id,item.teacherName,item.classTime,item.teachingPlace,item.teachingTitle)" >
              <p class="item-name">
                  {{item.teacherName}}
              </p>
              <p class="item-time">
                    <img src="../assets/icon-time.png" alt="">
                    <span class="span-time"> {{item.classTime}}</span>
                     <img src="../assets/icon-location.png" alt="">
                    <span class="span-time">{{item.teachingPlace}}</span>
              </p>
              <p class="item-title">
                    {{item.teachingTitle}}
              </p>
              <img src="../assets/icon-arr.png" alt="">
          </li>
      </ul>
      <div class="qr-box" v-show="isShowQr">
            <div class="qr-content">
                <div class="qr-cont-box">
                  <div id="qrcode"></div>                   
                </div>
                <img src="../assets/icon-close.png" alt="close" v-on:click.stop="close()">
            </div>
      </div>
        <!-- <img class="scan-icon" src="../assets/icon-scan.png" alt="" v-on:click.stop="showQr()"> -->
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl,qrBaseUrl} from '../config/env'
import QRCode from 'qrcodejs2'

export default {
    name: 'rateWeb',
    components: {
      loading
    },
    data() {
        return {
            showLoading:true,
            list:[],
            isShowQr:false,
            schoolId:'',
            user: {}
        }
    },
    computed: {
        // a computed getter
      
      },
    mounted(){
        this.initData();
        document.title = '教师评课'
        // window.addEventListener('scroll', this.handleScroll)
    },
    methods:{

        initData(){
            let _this=this
            axios.post(baseUrl+'/web/course-valuation/list', JSON.stringify({
                schoolId: this.$route.query.schoolId,
                page:1,
                pageSize:100
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
                this.list=response.data.detail;
                this.schoolId=response.data.detail.schoolId;
                console.log(this.list);
                this.qrcode();
              }.bind(this))
              .catch(function (response) {
                 console.log(response);
                 _this.$toast("数据获取失败", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                  });
              });
        },

        doThis(id){
            alert(id)

        },
        openUrl(id,teacherName,classTime,teachingPlace,teachingTitle){
            this.$router.push({name:'rateSubmitWeb',params: {
                id:id,
                teacherName:teacherName,
                classTime:classTime,
                teachingPlace:teachingPlace,
                teachingTitle:teachingTitle
            } })
        },
        qrcode () {
          let qr_text=qrBaseUrl+"?schoolId="+this.schoolId; 
          console.log(qr_text)
          let qrcode = new QRCode('qrcode', {  
            width: 150,  
            height: 150, // 高度  
            text: qr_text // 二维码内容  
            // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）  
            // background: '#f0f'  
            // foreground: '#ff0'  
          })  
          console.log(qrcode)  
        },
        close(){
            this.isShowQr=false;
        },
        showQr(){
            this.isShowQr=true;
        }
       
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   body,ul,li{
    margin: 0;
    padding: 0;
   }
   li{
    list-style:none;
   }
   .list-item{
    padding: 0.3rem 0.3rem;
    background-color: #fff;
    position: relative;
    margin-top: 0.15rem;
   }
   .item-name{
    font-size: 0.26rem;
    color: #4696db;
    padding-bottom: 0.1rem;
   }
   .item-time{
    font-size: 0.24rem;
    color: #999999;
    display: flex;
    align-items: center;
   }
   .item-time img{
    width:0.3rem;
    height: 0.3rem;
   }
   .span-time{
    padding: 0 0.1rem;
   }
   .span-time{
    padding: 0 0.1rem;
   }
   .item-title{
        font-size: 0.28rem;
        color: #7b7b7b;
        padding-top: 0.1rem;
   }
   .list-item>img{
    position: absolute;
    width:0.14rem;
    height:0.25rem;
    display: block;
    top: 50%;
    margin-top: -0.125rem;
    right: 0.3rem;
    z-index: 999; 
   }
.qr-box{
    width:100%;
    height: 100%;
    position: fixed;
    background-color: rgba(0,0,0,0.4);
    z-index: 999;
    top:0;
    left: 0;
}
.qr-content{
    width:180px;
    height: 180px;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -90px;
    margin-top: -90px;
    background: url(../assets/icon-qr.png);
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
}
#qrcode{
    position: relative;
}
.qr-content img{

    margin: 0 auto;
    /*margin-top: -1.5rem;*/
    /*top: 50%;*/
    position: absolute;
}
.qr-cont-box{
    width:150px;
    height: 150px;
    margin: 0 auto;
    position: absolute;
    top:50%;
    margin-top: -75px;
    left: 50%;
    margin-left: -75px;
}
.qr-content img{
    width:0.68rem;
    height: 0.68rem;
    display: block;
    position: absolute;
    right: -0.34rem;
    top: -0.34rem;
    z-index: 99999;
}
.scan-icon{
    width:1.05rem;
    height: 1.05rem;
    display: block;
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
    z-index: 99;
}
</style>
