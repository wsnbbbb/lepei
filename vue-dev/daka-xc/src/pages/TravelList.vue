<template>
  <div class="questionnaire-list">
    <van-notice-bar text="为了保证正常复课，在旅居史发生变化的情况下，请及时更新旅居史调查表，家庭成员旅居史为选填，请按需填写，最多填写5位家庭成员旅居史" left-icon="volume-o" />
    <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
      <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
        <van-swipe-cell>
          <van-cell title="本人旅居史" is-link :value="self" @click="toDetail(selfId, 'self')"/>
        </van-swipe-cell>
        <van-swipe-cell v-for="(item, index) in list" :key="index"  >
          <van-cell :title="item.name" is-link value="已填写" @click="toDetail(item.id)"/>
          <!-- <van-button
            @click="close(item)"
            slot="right"
            square
            text="删除"
            type="danger"
          /> -->
        </van-swipe-cell>
      <!-- </van-list> -->
    <!-- </van-pull-refresh> -->
    <div class="btn-box">
      <van-button round type="info" size="large" v-show="list.length<5"   @click="toAdd" >新增家庭成员旅居史</van-button>
    </div>
  </div>

</template>
<script>
import { Dialog } from 'vant';
import { getList, getJourningHistory,signDel} from "../api/request";
import qs from 'qs';
import { getQueryString, formatDate } from "../util/util";
import { Toast } from 'vant';
// import { setTimeout } from 'timers';
export default {
  data() {
    return {
      selfId: '',
      user: {
        token: '',
        personId: ''
      },
      list: [

      ],
      self: '未填写'
    };
  },
  created() {
    let datas =  JSON.parse(localStorage.getItem("detailList"))
    this.user.token = datas.token;
    this.user.personId = datas.personId;

    this.getListAll()
  },
  methods: {
    
    // 删除
    close(date){
      let _this = this
        Dialog.confirm({
            message: '确定删除吗？'
          }).then(() => {
            let parmas = {
              "personId":_this.user.personId,
              "token":_this.user.token,
              "date":date,
            }
            signDel(parmas).then(res =>{
              if(res.success){
                this.$toast("删除成功!")
                 setTimeout(() =>{
                  // _this.onRefresh()
                 },1000)
               
              }else{
                Toast.fail(res.description);
              }
            })
            
            
          }).catch(() =>{
          
        })
    },
    toDetail(id, type){
        this.$router.push({path:"/travel-info",query:{id: id, type: type}})
    },
    toAdd(id){
        this.$router.push({path:"/travel-info?type=add"})
    },

    async getListAll() {
     
      let id = getQueryString("id");

      let res = await getJourningHistory({
          personId: this.user.personId,
          token: this.user.token,
      });
      if(res.success){
          let flag = res.detail.some(item=>{
            if(item.isSelf==1){
              this.selfId = item.id
            }
            return item.isSelf == 1
          })
          if(flag){
            this.self = '已填写'
          }
          this.list = res.detail.filter(item=>{
            return item.isSelf !=1
          })
          
          // console.log("列表",res.detail);
          // this.list.push(...res.detail);
          // return res.detail;
      }else{
          Toast.fail(res.description);
          this.finished = true;
      }

     
    },
    

  
  }
};
</script>

<style lang="less" scoped>
.btn-box{
  padding: 30px 20px;
  padding-bottom: 80px;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
}
.box1{
  padding: 20px 10px;
  width: 300px;
  text-align: center;
}
  

.questionnaire-list {
  .phone{
    font-size: 1.5rem;
  }
  .copy-btn{
    float: right;
  }
  .list-box {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 0.2rem;
    p {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      // -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-top: 0;
    }
    .timeInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.5rem;
      color: #b5b3b3;
      .filled {
        color: #379bfa;
      }
    }
  }
}
</style>