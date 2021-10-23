<template>
  <div class="apply-list">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="container">
        <div class="noData" v-if='noData'>暂无数据</div>
        <template v-else>
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="- 没有更多了 -"
            @load="onLoad"
            :offset="130"
          >
            <div class="list-box" v-for="item in applyList" :key="item.id" @click="toDetail(item.id)">
              <h4 class="title">{{ item.title }}</h4>
              <van-cell-group :border="false">
                <van-cell :border="false" title="申请时间" :value="item.applyTime | changetime" />
                <van-cell :border="false" title="申请人" :value="item.applyPerson" />
                <van-cell :border="false" title="当前状态" :value="item.status | applyStatus" />
              </van-cell-group>
            </div>
          </van-list>
        </template>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getApplyList } from "../api/request";
import { formatDate, applyType } from "../util/util";
export default {
  data() {
    return {
      page: 1,
      pageSize:20,
      loading: false, // 当loading为true时，转圈圈
      finished: false, // 数据是否请求结束，结束会先显示- 没有更多了 -
      applyList:[],
      noData: false, // 如果没有数据，显示暂无数据
      isLoading:false // 下拉的加载图案
    };
  },
  created() {
   
  },
  methods: {
    // 获取列表
    getInfo () {
      let user = JSON.parse(sessionStorage.getItem("userInfo"))
      let params = {
        "schoolId":user.id,
        "telephone":user.tel,
        "page":this.page,
        "pageSize":this.pageSize
      }
      getApplyList(params).then(res => {
        if (res.success) { 
          this.loading = false
          this.applyList = this.applyList.concat(res.detail)
          // 如果没有数据，显示暂无数据
          if (this.applyList.length === 0 && this.page === 1) {
            this.noData = true
          }
          // 如果加载完毕，显示没有更多了
          if (res.detail.length < this.pageSize) {
            this.finished = true
          }
          this.page++
        }
      })
      .catch(error => {
        console.log(error)
      });
    },
    // 列表加载
    onLoad () {
      setTimeout(() => {
        this.getInfo()
        this.loading = true
      }, 500)
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        // 重新初始化这些属性
        this.isLoading = false
        this.applyList = []
        this.page = 1
        this.loading = false
        this.finished = false
        this.noData = false
        // 请求信息
        this.getInfo()
      }, 500)
    },
    // 点击进入详情页面
    toDetail (id) {
      this.$router.push({ path: "/audit-detail",query:{id}})
    }
  },
  filters:{
    applyStatus(type){
      return applyType(type)
    },
    // 名字脱敏
    noPassByName(str){
      if(null != str && str != undefined){
        return str.substr(0,1) + '**' //截取name 字符串截取第一个字符，
      } else {
        return "";
      }
    },
    changetime(time) {
      return formatDate(time);
    } 

  }
}
</script>

<style lang="less" scope>
.apply-list{
  .container{
    padding-top: 10px;
    .list-box{
      background-color: #fff;
      padding:10px;
      margin-bottom: 10px;
      .title {
        margin-bottom: 10px !important;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .noData{
    text-align: center;
    margin-top: 20px;
  }
}
</style>
