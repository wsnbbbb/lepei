<template>
  <div>
    <van-nav-bar :title="schoolName + '入学登记系统'" />
    <div class="info-box">
      <div class="info">
        <img :src="logo ? logo : defaltImg" alt="" />&nbsp;
        <span>{{ username }}</span>&nbsp;
        <span @click="signout" style="color:#610875;">退出</span>
      </div>
    </div>
    <div class="title">
      <img src="../assets/imgs/jichu.png" alt="" />
      <span>基础功能</span>
    </div>
    <div class="content">
      <div @click="toPullPage(1)">
        <img src="../assets/imgs/visit.png" alt="" />
      </div>
      <div @click="toPullPage(2)">
        <img src="../assets/imgs/entrance.png" alt="" />
      </div>
      <div @click="toPullPage(4)">
        <img src="../assets/imgs/health.png" alt="" />
      </div>
      <div @click="toPullPage(5)">
        <img src="../assets/imgs/new.png" alt="" />
      </div>
    </div>
    <!-- <div class="title">
      <img src="../assets/imgs/records.png" alt="" />
      <span>历史记录</span>
    </div>
    <div class="content">
      <div>
        <img src="../assets/imgs/visit.png" alt="" />
      </div>
      <div>
        <img src="../assets/imgs/entrance.png" alt="" />
      </div>
      <div>
        <img src="../assets/imgs/health.png" alt="" />
      </div>
      <div>
        <img src="../assets/imgs/new.png" alt="" />
      </div>
    </div> -->
  </div>
</template>

<script>
import { getSchool, login } from "../api/request";
import { Decrypt, Encrypt } from "../util/secret";
import { getQueryString, stringCheck } from "../util/util";
export default {
  data() {
    return {
      defaltImg: require("../assets/imgs/logo.png"),
      imgsrc: "",
      schoolId: "",
      username: "",
      logo: "",
      schoolName: "",
    };
  },
  async created() {
    this.logo = sessionStorage.getItem("logo");
    this.schoolName = sessionStorage.getItem("schoolName");
    this.username = sessionStorage.getItem("username");
  },
  methods: {
      toPullPage(i){
         if(i==5){
            this.$toast('该功能暂未开放')
         }else{
            this.$router.push({
              "name":"Pulldata",
              "query":{
              "type":i
             }
        })
         }
      },
      signout(){
        let id=Encrypt(sessionStorage.getItem("shoolId"));
        console.log(id)
        this.$router.push({path:`/login/${id}`})
      }
  },
};
</script>

<style lang="less" scoped>
.info-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  .info {
    display: flex;
    img {
      width: 25px;
      height: 25px;
    }
  }
}
.title {
  display: flex;
  margin-top: 20px;
  padding-left: 20px;
  img {
    width: 16px;
    height: 16px;
    padding-top: 2px;
  }
  span{
      padding-left:10px;
      font-size:16px;
  }
}
.content{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 20px;
    margin-top: 20px;
    div{
        margin-bottom: 20px;
    img{
        width: 160px;
        height: 105px;
    }
    }
}
/deep/.van-nav-bar {
  line-height: 46px;
}
</style>