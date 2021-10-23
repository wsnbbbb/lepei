<template>
  <div class="outside-list">
    <div class="list-item">
      <div class="list-box" v-for="item in list" :key="item.id" @click="gotoDetatil(item.id)">
        <div class="left">
          <div class="imgBox">
            <img :src="item.icon || defaultUrl" alt="" />
          </div>
        </div>
        <div class="right">
          <h4 class="title">{{ item.title }}</h4>
          <p>{{ item.remark }}</p>
        </div>
      </div>
    </div>
     <div class="btn">
        <van-button round block type="info" @click="toApplyList">我的申请</van-button>
      </div>
  </div>
</template>
<script>
import { getOutsideList } from "../api/request";
export default {
  data() {
    return {
      list: [],
      defaultUrl: require("../assets/imgs/logo.png")
    };
  },
  async created() {
    let user = JSON.parse(sessionStorage.getItem("userInfo"))
    if (user.id && user.tel) {
      let res = await getOutsideList({ schoolId: user.id, telephone: user.tel });
      if (res.code === 0) {
        this.list = res.detail;
      }   
    }
  },
  methods: {
    // 我的申请
    toApplyList() {
      this.$router.push({ path: "/apply-list"});
    },
    // 详情页面
    gotoDetatil(id) {
      this.$router.push({ path: "/apply-detail",query:{id}});
    },
  },
};
</script>

<style lang="less" scope>
.outside-list{
  height: 100vh;
  .list-item {
    padding-top: 10px;
    padding-bottom: 60px;
    .list-box {
      display: flex;
      background-color: #fff;
      padding:15px;
      margin-bottom: 10px;
      .left {
        width: 30%;
        .imgBox {
          width: 80px;
          height: 80px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 40px;
          }
        }
      }
      .right {
        width:75%;
        .title {
          margin-bottom: 10px !important;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        p {
          font-size: 14px;
          color: #aeacae;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
  }
  .btn{
    position: fixed;
    bottom:0;
    left: 0;
    width:100%;
    background-color: #fff;
    padding:8px;
    button{
      width:60%;
      margin:0 auto;
    }
  }
}
</style>
