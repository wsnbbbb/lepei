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
    <van-cell v-for="item in list" :key="item.id" :title="item.name" is-link  @click="toDirverInfo(item.id)" value="查看" />
       
  </div>
</template>

<script>
import { dirverList } from '../api/request'
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
        }
        let res = await dirverList(params)
          if(res.success){
            this.list = res.detail
          }else{
            Toast.fail(res.description);
          }
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