<template>
  <div>
    <van-nav-bar title="请选择" left-text="返回" @click-left="onClickLeft" left-arrow/>
    <div class="content">
        <div class="conten-item" @click="toApplay">
            <span>发起新请求</span>
            <van-icon class='arrow' name="arrow" />
        </div>
        <div class="conten-item" v-if='type==1' @click="toDetail(type)">
            <span>从《咨询登记》拉取数据</span>
            <van-icon class='arrow' name="arrow" />
        </div>
        <div class="conten-item" v-if='type==2' @click="toDetail(type)">
            <span>从《参观登记》拉取数据</span>
            <van-icon class='arrow' name="arrow" />
        </div>
        <div class="conten-item" v-if='type==4' @click="toDetail(type)">
            <span>健康登记二次确认</span>
            <van-icon class='arrow' name="arrow" />
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type:''
    };
  },
  async created() {
    let type=this.$route.query.type
    console.log(type)
    this.type=type
  },
  methods: {
     onClickLeft(){
         this.$router.push({"path":'./welcome'})
     },
     toApplay(){
        if(this.type==1){
            this.$router.push({"path":'./visit-register'})
        }
        if(this.type==2){
            this.$router.push({"path":'./entrance-apply'})
        }
        if(this.type==4){
            this.$router.push({"path":'./child-health'})
        }
     },
     toDetail(type){
       this.$router.push({ "name": 'Search', "query": { type: type }});
     }
  },
};
</script>

<style lang="less" scoped>
.content{
    margin-top: 20px;
    padding: 0 20px;
}
.conten-item{
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
     .arrow{
        line-height: 50px;
    }
}
.conten-item:active{
   background-color: #ccc;
}

/deep/.van-nav-bar {
  line-height: 46px;
}
</style>