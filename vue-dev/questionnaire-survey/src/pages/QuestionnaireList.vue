<template>
  <div class="questionnaire-list">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell
          v-for="(item,index) in list"
          :key="item.questionnairesId"
          class="list-box"
          @click="jumpDetail(index,item.questionnairesId, item.md5, item.title, item.endTime,item.intro)"
        >
          <p>{{item.title}}</p>
          <div class="timeInfo">
            <span>截止时间：{{item.endTime | changetime}}</span>
            <div>
              <span v-if="item.hasAnswer" class="filled">已填写</span>
              <span v-else>{{item.count}}个问题</span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getList, getPageList } from "../api/request";
import { getQueryString, formatDate } from "../util/util";
// import { setTimeout } from 'timers';
export default {
  data() {
    return {
      loading: false, //上拉加载
      finished: false, //是否已加载完所有数据
      isLoading: false,   //下拉刷新
      list: [],
      data:[],
      page: 1,
      pageSize:10,
      schoolId: "",
      tel: "",
      questionnairesId:"",
    };
  },
  created() {
    this.getListAll()
    let id = getQueryString("id");
    this.schoolId = id;
    
  },
  methods: {
    async getListAll(page, pageSize, schoolId, telephone) {
      let tel = this.$route.query.tel;
      this.tel = tel;
      let id = getQueryString("id");
      // let id = this.$route.query.id
      let res = await getList({
        schoolId: id,
        page: this.page,
        pageSize: this.pageSize,
        telephone: tel
      });
      console.log("列表",res.detail);
      // this.questionnairesId = res.detail.questionnairesId
      this.list.push(...res.detail);
      return res.detail;
    },
    
    onLoad() { //上拉加载
      this.tel = this.$route.query.tel;
      // let id = this.$ruoute.query.id;
      let id = getQueryString("id");
      this.page++
      let params = {
          schoolId: id,
          page: this.page,
          pageSize: this.pageSize,
          telephone: this.tel
        };
      setTimeout(() => {
       getList(params)
        .then(res => {
          let data = res.detail//detail是后台返回的数组
          this.list.push(...data)
          this.loading = false;//加载状态结束
          if (data.length < this.pageSize) {
            this.finished = true;
          }
        })
      },500)
    },
    onRefresh() {       //下拉刷新
          this.page = 1;
          this.finished = false;
          this.isLoading = false;
          this.getListAll()
          this.list = []
    },
    jumpDetail(index, id, md5, title, endTime,intro) {
      console.log({intro});
      sessionStorage.setItem("md5",md5)
      let schoolId = getQueryString("id");
      sessionStorage.setItem("title", title)
      sessionStorage.setItem("endTime", endTime)
      sessionStorage.setItem("intro", intro)
      
      this.$router.push({
        path: "/questionnairedetail",
        query: {
          schoolId: schoolId,
          telephone: this.tel,
          questionnairesId: id
        }
      });
    },
  },
  filters: {
    changetime(time) {
      return formatDate(time);
    }
  }
};
</script>

<style lang="less" scope>
.questionnaire-list {
  .list-box {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 1rem;
    p {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
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