<template>
  <div class="mess-person-list">
    <van-search
      v-model="search"
      shape="round"
      show-action
      placeholder="请输入人员姓名"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch" class="ftColor">搜索</div>
    </van-search>
    <div class="personList">
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
          <van-row v-for="item in list" :key="item.id" type="flex" justify="space-between" class="person">
            <van-col span="6">{{item.name}}</van-col>
            <van-col span="6" style="textAlign:center">{{type(item.type)}}</van-col>
            <van-col span="6" @click="goDetail(item.id)" class="check">查看<van-icon name="arrow" color="#969799"/></van-col>
          </van-row>
        <!-- </van-list>
      </van-pull-refresh> -->
    </div>
    <div style="textAlign:center" v-if="!this.list">暂无记录</div>
  </div>
</template>

<script>
import { messPersonList } from '../api/request'
  export default {
    data(){
      return {
        search:'',
        list:[],
        data:[],
        uid:'',
        token:'',      
      }
    },
    created() {
      let data = JSON.parse(localStorage.getItem("userInfo"))
      if(data) {
        this.uid = data.uid;
        this.token = data.token;
      }
      this.allMessPerson()
    
    },
    methods:{
      type(type){
        if(type == 1) return '保安'
        if(type == 2) return '食堂从业人员'
      },
      onSearch() {
        if(this.kw == ''){
          return this.$toast("请输入搜索人姓名");
        }
        this.allMessPerson()
      },
      allMessPerson(){
        let params = {
          "uid":this.uid,
          "token":this.token,
          "search":this.search,
        }
       messPersonList(params).then(res =>{
          this.isLoading = false;
          if(res.success){
            this.list = res.detail
            this.finished = true;
            // if(res.detail == null || res.detail.length === 0){
            //   this.finished = true;
            //   return;
            // }
            // this.list.push(...res.detail);
            // this.finished = true;
            // let data = res.detail 
            // if (data.length < this.pageSize) {
            //     this.finished = true;
            // }
            // return res.detail;
          }else{
            Toast.fail(res.description);
            this.finished = true;
          }
       })
      },
      // onLoad() { //上拉加载
      //   this.page++
      //   let params = {
      //     "uid":this.uid,
      //     "token":this.token,
      //     "search":this.search,
      //     "page":this.page,
      //     "pageSize":this.pageSize,
      // }
      // this.allMessPerson()
      // setTimeout(() => {
      //  messPersonList(params)
      //   .then(res => {
      //     if(res.success){
      //         let data = res.detail 
      //         this.list.push(...data)
      //         this.loading = false; //加载状态结束
      //         if (data.length < this.pageSize) {
      //           this.finished = true;
      //         }
      //     }else{
      //         Toast.fail(res.description);
      //         this.finished = true;
      //     }
      //   })
      // },500)
    // },
    // onRefresh() {       //下拉刷新
    //   this.page = 1;
    //   this.finished = false;
    //   this.isLoading = false;
    //   this.allMessPerson()
    //   this.list = []
    // },

      goDetail(id) {
        this.$router.push({path:"/mess-person-info",query:{id}})
      },
    }

  }
</script>

<style lang="less">
.mess-person-list{
  .ftColor{
    color:#969799;
  }
  .personList{
    .person{
      border-bottom:1px solid #F5F6F7;
      line-height: 2.75rem;
      font-size:.875rem;
      padding: 0 1rem;
      .check{
        color:#969799;
        text-align: right;
        .van-icon{
          vertical-align: middle;
          margin-left: .5rem;
        }
      }
    }
  }
}
</style>