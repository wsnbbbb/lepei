<template>
  <div class="school-bus">
    <van-search
      v-model="search"
      shape="round"
      show-action
      placeholder="请输入车牌号"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch" class="ftColor">搜索</div>
    </van-search>
    <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
          <van-cell v-for="item in list" :key="item.id" :title="item.carNo" is-link  @click="toSchoolBusInfo(item.id)" value="查看" />
        <!-- </van-list>
    </van-pull-refresh> -->
  </div>
</template>

<script>
import { schoolBusList } from '../api/request'
import { Toast } from 'vant';
  export default {
    data(){
      return {
        search:'',
        list:[],
        uid:'',
        token:'',  
      }
    },
    async created() {
      let data = JSON.parse(localStorage.getItem("userInfo"))
      if(data){
        this.uid = data.uid;
        this.token = data.token;
      }
      this.schoolBusList()
    },
    methods:{
      toSchoolBusInfo(id){
        this.$router.push({path:"/school-bus-info",query:{id}})
      },
      onSearch() {
        if(this.search == ''){
          return this.$toast("请输入车牌号");
        }
        this.schoolBusList()
      },
      async schoolBusList(){
        let params = {
          "uid":this.uid,
          "token":this.token,
          "search":this.search,
        }
        let res = await schoolBusList(params)
          if(res.success){
            // this.list.push(...res.detail);
            // return res.detail;
            this.list = res.detail
          }else{
            Toast.fail(res.description);
            this.finished = true;
          }
      },
      onLoad() { //上拉加载
        this.page++
        let params = {
          "uid":this.uid,
          "token":this.token,
          "search":this.search,
          "page":this.page,
          "pageSize":this.pageSize,
        }
        setTimeout(() => {
          schoolBusList(params)
            .then(res => {
              if(res.success){
                  let data = res.detail 
                  this.list.push(...data)
                  this.loading = false; //加载状态结束
                  if (data.length < this.pageSize) {
                    this.finished = true;
                  }
              }else{
                  Toast.fail(res.description);
                  this.finished = true;
              }
            })
        },500)
      },
      onRefresh() {       //下拉刷新
        this.page = 1;
        this.finished = false;
        this.isLoading = false;
        this.schoolBusList()
        this.list = []
      },

      
    },

  }
</script>

<style lang="less">
.school-bus{
  .ftColor{
    color:#969799;
  }
 
}
</style>