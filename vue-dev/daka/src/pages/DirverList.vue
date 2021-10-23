<template>
  <div class="dirver-list">
    <van-search
      v-model="search"
      shape="round"
      show-action
      placeholder="请输入人员姓名"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch" class="ftColor">搜索</div>
    </van-search>
    <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" offset='10' @load="onLoad"> -->
          <van-cell v-for="item in list" :key="item.id" :title="item.name" is-link  @click="toDirverInfo(item.id)" value="查看" />
        <!-- </van-list>
    </van-pull-refresh> -->
  </div>
</template>

<script>
import { dirverList } from '../api/request'
  export default {
    data(){
      return {
        search:'',
        page:1,
        pageSize: 20,
        loading: false, //上拉加载
        finished: false, //是否已加载完所有数据
        isLoading: false,   //下拉刷新
        list:[],
        uid:'',
        token:'',  
      }
    },
    async created() {
      let data = JSON.parse(localStorage.getItem("userInfo"))
      this.uid = data.uid;
      this.token = data.token;
      this.dirverLists()
    },
    methods:{
      toDirverInfo(id){
        this.$router.push({path:"/dirver-info",query:{id}})
      },
      onSearch() {
        if(this.search == ''){
          return this.$toast("请输入搜索人姓名");
        }
        this.dirverLists()
      },
      async dirverLists(){
        let params = {
          "uid":this.uid,
          "token":this.token,
          "search":this.search,
          "page":this.page,
          "pageSize":this.pageSize,
        }
        let res = await dirverList(params)
          if(res.success){
            // this.list.push(...res.detail);
            // return res.detail;
            this.list = res.detail
            this.finished = true;
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
          dirverList(params)
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
        this.dirverList()
        this.list = []
      },

      
    },

  }
</script>

<style lang="less">
.dirver-list{
  .ftColor{
    color:#969799;
  }
 
}
</style>