<template>
  <div class="questionnaire-list">
    <van-notice-bar text="系统提示：如果提示“今日已打卡”，代表今日已经完成健康打卡操作，无需再次操作。本页面列表中无今日数据，是由于网络原因未及时同步。请不要担心，打卡数据已记录，请稍后查看" left-icon="volume-o" />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-swipe-cell v-for="(item, index) in list" :key="index"  >
          <van-cell title="已打卡" is-link :value="item" @click="toDetail(item)"/>
          <van-button
            @click="close(item)"
            slot="right"
            square
            text="删除"
            type="danger"
          />
        </van-swipe-cell>
      </van-list>
    </van-pull-refresh>
    <van-popup v-model="show">
      <div class="box1">
        <van-field name="stepper" label="天数">
          <van-stepper v-model="stepper" slot="input" />
        </van-field>
        <van-button type="primary" @click="pass()">确定</van-button>
      </div>
    </van-popup>
  </div>

</template>
<script>
import { Dialog } from 'vant';
import { getList, getSignList,signDel} from "../api/request";
import qs from 'qs';
import { getQueryString, formatDate } from "../util/util";
import { Toast } from 'vant';
// import { setTimeout } from 'timers';
export default {
  data() {
    return {
      user: {
        token: '',
        personId: ''
      },
      show: false,
      stepper: 1,

      loading: false, //上拉加载
      finished: false, //是否已加载完所有数据
      isLoading: false,   //下拉刷新
      list: [

      ],
      data:[],
      page: 0,
      pageSize:20,
      schoolId: "",
      tel: "",
      questionnairesId:"",
      currentId: 0,
    };
  },
  created() {
    let id = getQueryString("id");
    this.schoolId = id;
    let datas =  JSON.parse(localStorage.getItem("detailList"))
    this.user.token = datas.token;
    this.user.personId = datas.personId;
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
                  _this.onRefresh()
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
    passOk(id){
      this.show = true
      this.stepper = 1
      this.currentId = id
    },

    async getListAll(page, pageSize, schoolId, telephone) {
      let tel = this.$route.query.tel;
      this.tel = tel;
      let id = getQueryString("id");
      // let id = this.$route.query.id
    
      let res = await getSignList({
          personId: this.user.personId,
          token: this.user.token,
          page: this.page,
          pageSize: this.pageSize,
      });
      if(res.success){
          console.log("列表",res.detail);
          this.list.push(...res.detail);
          return res.detail;
      }else{
          Toast.fail(res.description);
          this.finished = true;
      }

     
    },
    
    onLoad() { //上拉加载
      this.tel = this.$route.query.tel;
      // let id = this.$ruoute.query.id;
      let id = getQueryString("id");
    
      this.page++
      let params = {
          personId: this.user.personId,
          token: this.user.token,
          page: this.page,
          pageSize: this.pageSize,
        };

      setTimeout(() => {
       getSignList(params)
        .then(res => {
          if(res.success){
              let data = res.detail//detail是后台返回的数组
              this.list.push(...data)
              this.loading = false;//加载状态结束
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
          this.getListAll()
          this.list = []
    },

  
  }
};
</script>

<style lang="less" scope>
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