<template>
  <div class="page">
    <!-- 搜索栏 -->
    <!-- <search></search> -->
    <!-- 导航 -->
    <div class="top">
      <p class="name">{{name}}的乐陪的余额</p>
      <p class="money">{{OffMoney}}</p>
      <p class="money-wait">待激活金额 {{OnMoney}}</p>
      <a href="javascript:;" class="btn-charge" v-on:click="toCharge">充值</a>
    </div>
    <div class="nav">
      <div class="nav-tab">
        <ul class="nav-ul">
          <li class="item" v-for="(n, index) in title" :key="index" @click="changeNav(index)" :class="{'active': index === oCurrentPage}">{{n.name}}</li>
        </ul>
      </div>
    </div>
    <!-- 外层翻页组件（轮播原理） -->
    <slider :oCurrentPage = 'oCurrentPage' ref="sendPage" v-on:switchTab="msgFromChild">
      <div >
        <!-- 上下拉加载更多，刷新数据的组件updown -->
        <up-down :data="data" :pulldown="pulldown" @pulldown="loadData">

          <ul class="box-ul">
            <div class="no-data" v-show="showImg1">
              <img src="../assets/icon-no-data.png" alt="" >
            </div>
            <li v-for="(item, index) in dataList1" :key="index">
                <div class="li-left">
                  <p class="li-title"> <span class="title-status">{{item.status}}</span> <span class="title-way">{{item.way}}</span></p>
                  <p class="li-time">{{formatTime(item.date)}} </p>
                </div>
                <div class="li-right">
                  &yen; {{item.price}}
                </div>
            </li>

          </ul>
        </up-down>
      </div>
          <div >
        <!-- 上下拉加载更多，刷新数据的组件updown -->
        <up-down :data="data" :pulldown="pulldown" @pulldown="loadData">

          <ul class="box-ul">
            <div class="no-data" v-show="showImg2">
              <img src="../assets/icon-no-data.png" alt="" >
            </div>
            <li v-for="(item, index) in dataList2" :key="index">
                <div class="li-left">
                  <p class="li-title"> <span class="title-status">{{item.status}}</span> <span class="title-way">{{item.way}}</span></p>
                  <p class="li-time">{{formatTime(item.date)}} </p>
                </div>
                <div class="li-right">
                  &yen; {{item.price}}
                </div>
            </li>
            
          </ul>
        </up-down>
      </div>
    </slider>
    <!-- <div class="loading-wrapper"></div> -->
  <loading v-show="showLoading"> </loading>
  </div>
</template>

<script>
// import Search from '@/common/Search'
import Slider from '@/common/scroll/Slider.vue'
import UpDown from '@/common/scroll/UpDown.vue'
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl,user,redirectUrlIos,redirectUrlAndroid, alipayStr, redirectUrlIosForAlipay} from '../config/env'
import { debug } from 'util';
import { fail } from 'assert';
var urlencode = require('urlencode');
const md5 = require('js-md5');
let dateFormat = require("format-datetime");

export default {
  name: 'list',
  components: {
    // Search,
    Slider,
    UpDown,
    loading
  },
  data () {
    return {
      data: [1, 1,],
      pulldown: true,
      title: [
        {name: '消费'},
        {name: '充值'},
   
      ],
      showLoading: false,
      oCurrentPage: 0,
      name: '',
      cardNo: '',
      OffMoney: '',
      OnMoney: '',
      amountType: 0,
      otherMoney: "",
      dataList1: [],
      dataList2: [],
      showImg1: false,
      showImg2: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    changeNav (num) {
      this.oCurrentPage = num
      console.log(this.oCurrentPage)
      this.$refs.sendPage.setPage(this.oCurrentPage)
    },
    loadData () {
      // 调用api获取数据
      console.log('初始化页面数据')
    },
    // 获取子组件传过来的当前页码值
    msgFromChild (data) {
      if (data || data === 0) {
        this.oCurrentPage = data
      }
    },
    formatTime(timestemp){
        return dateFormat(new Date(timestemp*1000), "yyyy-MM-dd HH:mm:ss")
    },

    getBalance(){
      this.showLoading=true;
      let schoolId = this.$route.query.schoolId
      let personId = this.$route.query.personId
      let cardNo = this.$route.query.No
      let uid = sessionStorage.getItem("openId")
      axios.post(baseUrl+'/wechat/new-ic/balance', JSON.stringify({
          uid: uid,
          schoolId: schoolId,
          personId: personId,
          cardNo: cardNo,
          sign: md5(`cardNo=${cardNo}&personId=${personId}&schoolId=${schoolId}&uid=${uid}`).toUpperCase()
      }))
      .then(function (response) {
          this.showLoading = false;
          console.log(response);
          if(response.data.success){
              this.OffMoney = response.data.detail.OffMoney;
              this.OnMoney = response.data.detail.OnMoney;
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
    getList(type){
      this.showLoading=true;
      let schoolId = this.$route.query.schoolId
      let personId = this.$route.query.personId
      let cardNo = this.$route.query.No
      let uid = sessionStorage.getItem("openId")
      axios.post(baseUrl+'/wechat/new-ic/billing-record', JSON.stringify({
          uid: uid,
          schoolId: schoolId,
          personId: personId,
          cardNo: cardNo,
          type: type,
          sign: md5(`cardNo=${cardNo}&personId=${personId}&schoolId=${schoolId}&type=${type}&uid=${uid}`).toUpperCase()
      }))
      .then(function (response) {
          this.showLoading = false;
          console.log(response);
          if(response.data.success){
             if(type==1){
                this.dataList1 = response.data.detail
                if(response.data.detail.length==0){
                  this.showImg1 = true
                }else{
                  this.showImg1 = false
                }
             }else if(type==2){
                this.dataList2 = response.data.detail
                if(response.data.detail.length==0){
                  this.showImg2 = true
                }else{
                  this.showImg2 = false
                }
             }
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

    toCharge(){
      let schoolId = this.$route.query.schoolId
      let personId = this.$route.query.personId
      let icCardNo = this.$route.query.No
      let status = this.$route.query.status
      if(status==1){
        this.$router.push({ path: `/charge?schoolId=${schoolId}&personId=${personId}&No=${icCardNo}`})
      }else{
        this.$alert({
          title: '提示',
          content: '充值功能暂时关闭，详询 028-62607709'
        })
      }
    },


  },
  mounted () {
    this.msgFromChild()
    this.getBalance()
    this.name = sessionStorage.getItem("name")
    this.getList(1)
    this.getList(2)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
ul,li{
   list-style: none;
}
.page{
  font-size: 14px;
  .nav{
    ul{
      list-style: none;
      display: flex;
      li{
        list-style: none;
        flex: 1;
      }
    }
  }
  .wrapper{
    height: calc(100vh - 237px);
    overflow: hidden;
  }
}
.active{
  color: #727272;
  border-bottom: 2px solid #3fa0f3;
}
.nav-tab{
  ul {
    padding-left:0;
    margin: 0;
    li{
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: .32rem;
    }
  }
}
.box-ul{
  margin: 0 ;
}
.top{
  height: 185px;
  background: url(../assets/bg_3.png);
  background-repeat: no-repeat;
  background-size: 100%;
  position: relative;
  .name{
    position: absolute;
    left: .3rem;
    top: .5rem;
    color: #7d7e7e;
    font-size: .28rem;
  }
  .money{
    position: absolute;
    left: .3rem;
    top: 1.2rem;
    color: #7d7e7e;
    font-size: .66rem;
  }
  .money-wait{
    position: absolute;
    left: .3rem;
    top: 2.4rem;
    color: #7d7e7e;
    font-size: .32rem;
  }
  .btn-charge{
    position: absolute;
    right: .3rem;
    bottom: 1rem;
    color: #7d7e7e;
    font-size: .32rem;
    display: block;
    width: 1.6rem;
    height: .5rem;
    color: #0096f1;
    text-align: center;
    border: 1px solid #0096f1;
    line-height: .5rem;
    background: #fff;
    text-decoration: none;
    border-radius: 1rem;

  }
  .box-ul{
    padding-left: 0;
    li{
      height: 1rem;
      line-height: 1rem;
      background: #333;
      
    }
  }
}
.nav-ul{
  border-bottom: 1px solid #ececec;
}
</style>
