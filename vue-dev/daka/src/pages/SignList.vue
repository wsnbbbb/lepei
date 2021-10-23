<template>
  <div class="sign-list">
    <van-notice-bar text="系统提示：如果提示“今日已打卡”，代表今日已经完成健康打卡操作，无需再次操作。本页面列表中无今日数据，是由于网络原因未及时同步。请不要担心，打卡数据已记录，请稍后查看" left-icon="volume-o" />
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"  :immediate-check="false">
        <!-- <div id="list-content"> -->
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
        <!-- </div> -->
      </van-list>
  </div>

</template>
<script>
import { Dialog } from 'vant';
import { getList, getSignList,signDel,signListDetail} from "../api/request";
import qs from 'qs';
import { getQueryString, formatDate,getFormatDate } from "../util/util";
import { Toast } from 'vant';
// import { setTimeout } from 'timers';
export default {
  inject:['reload'],
  data() {
    return {
      user: {
        token: '',
        personId: ''
      },
      loading: false, //上拉加载
      finished: false, //是否已加载完所有数据
      list: [],
      data:[],
      total:1,
      page: 1,
      pageSize:20,
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
                _this.list = []
                 setTimeout(() =>{
                   _this.reload()
                   // _this.getListAll()
                 },500)
               
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
      // this.page = 1
      console.log(this.finished);
      let that = this;
      let res = await signListDetail({
        personId: this.user.personId,
        token: this.user.token,
        page: this.page,
        pageSize: this.pageSize,
      });
      if(res.success){
        that.list = res.detail;
        that.total = res.detail.length
        that.isLoading = false;
        if (res.detail.length < that.pageSize) {
          that.finished = true;
        }
      }else{
        Toast.fail(res.description);
        // this.finished = true;
      }
    },
    
    //上拉加载
    onLoad() { 
      this.page++;
      let that = this;
      let params = {
        personId: this.user.personId,
        token: this.user.token,
        page: this.page,
        pageSize: this.pageSize,
      };
      getSignList(params)
        .then(res => {
          if(res.success){
            that.data = res.detail //detail是后台返回一页的数据
            that.total = res.detail.length
            that.list.push(...res.detail)
            this.loading = false; //加载状态结束
            // 数据全部加载完成
            if (res.detail.length < this.pageSize) {
              this.finished = true;
            }
          }else{
            Toast.fail(res.description);
            // this.finished = true;
          }
          console.log("11",this.page);
          
        })
    },

     //下拉刷新
    // async onRefresh() {    
    //  this.page = 0
    //  this.finished = false
    //  this.list = []
    //  this.getListAll()
    // },

  
  },
  mounted(){
    // let winHeight = document.documentElement.clientHeight  //视口大小
    // document.getElementById('list-content').style.minHeight = (winHeight - 82) +'px'  //调整上拉加载框高度
  }
}
</script>

<style lang="less" scope>

</style>