<template>
  <div class="sign-list">
    <van-notice-bar text="系统提示：如果提示“今日已打卡”，代表今日已经完成健康打卡操作，无需再次操作。本页面列表中无今日数据，是由于网络原因未及时同步。请不要担心，打卡数据已记录，请稍后查看" left-icon="volume-o" />
    <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
        <van-swipe-cell v-for="(item, index) in list" :key="index"  >
          <van-cell title="已打卡" is-link :value="item" @click="toDetail(item)"/>
          <van-button
            v-if="item == currentDate"
            @click="close(item)"
            slot="right"
            square
            text="删除"
            type="danger"
          />
        </van-swipe-cell>
        <div class="empty" v-if="this.list.length == 0">暂无记录</div>
      <!-- </van-list>
    </van-pull-refresh> -->
   
  </div>

</template>
<script>
import { Dialog } from 'vant';
import { getList, getSignList,signDel} from "../api/request";
import qs from 'qs';
import { getQueryString, formatDate,getFormatDate } from "../util/util";
import { Toast } from 'vant';
// import { setTimeout } from 'timers';
export default {
  data() {
    return {
      user: {
        token: '',
        personId: ''
      },
      list: [],
      data:[],
      currentDate:getFormatDate(),
     
    };
  },
  created() {
    let datas =  JSON.parse(localStorage.getItem("detailList"))
    if(datas){
      this.user.token = datas.token;
      this.user.personId = datas.personId;
    }
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
                  _this.getListAll()
                 },1000)
               
              }else{
                Toast.fail(res.description);
              }
            })
          }).catch(() =>{
        })
    },

    toDetail(date){
        this.$router.push({path:"/sign-info",query:{date: date}})
    },
   
    async getListAll() {
      let res = await getSignList({
          personId: this.user.personId,
          token: this.user.token,
         
      });
      if(res.success){
        console.log("列表",res.detail);
        this.list = res.detail
      }else{
        Toast.fail(res.description);
      }

     
    },
    
  
  }
};
</script>

<style lang="less" >
.empty{
  text-align: center;
  height:2.5rem;
  line-height: 2.5rem;
}

</style>