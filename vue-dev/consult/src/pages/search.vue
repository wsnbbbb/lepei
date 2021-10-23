<template>
  <div>
    <van-nav-bar
      title="查询人员"
      left-text="返回"
      @click-left="onClickLeft"
      left-arrow
    />
    <van-form @submit="onSubmit">
      <van-field
        v-model="kw"
        name="kw"
        label="姓名"
        placeholder="请输入姓名"
        :rules="[{ required: true, message: '请输入姓名' }]"
      />
      <div class="err" v-if="error">
         <p>出错了！</p>
         <p>未查询到相关信息，请核对后重试。</p>
      </div>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">查询</van-button>
      </div>
      <div style="margin: 16px" v-if="error">
        <van-button round block plain type="info" native-type="submit" @click="newapply">发起新的申请</van-button>
      </div>
    </van-form>
    <div v-if="person.length!==0">
        <div class="personlist">
            <div>人员信息（姓名/性别/出生日期）</div>
            <div>操作</div>
        </div>
        <div class="personinfo" v-for="(item,index) in person" :key='index'>
            <div v-if="item.birthday!==''">{{item.childName}}/{{item.sex==1?'男':item.sex==2?'女':''}}/{{item.birthday}}</div>
            <div v-if="item.birthday==''">{{item.childName}}/{{item.sex==1?'男':item.sex==2?'女':''}}</div>
            <div class='choose' @click="choose(item.id)">选择</div>
        </div>
    </div>
  </div>
</template>

<script>
import { getSchool, login, getPerson } from "../api/request";
import { Decrypt } from "../util/secret";
import { getQueryString, stringCheck } from "../util/util";
export default {
  data() {
    return {
      defaltImg: require("../assets/imgs/logo.png"),
      type: "",
      kw: "",
      error:false,
      person:[]
    };
  },
  async created() {
     console.log(this.$route);
    let type = this.$route.query.type;
    console.log(type);
    this.type = type;
  },
  methods: {
    onClickLeft() {
      this.$router.push({ path: "./welcome" });
    },
    async onSubmit(values) {
      console.log(values);
      this.person=[];
      let params = {};
      params.token = sessionStorage.getItem("token");
      params.uid = sessionStorage.getItem("uid");
      params.type = this.type;
      params.kw = values.kw;
      console.log(params)
      let res = await getPerson(JSON.stringify(params));
      console.log(res);
      if (res.detail.length!==0) {
           this.error=false
           this.person=res.detail
      }else{
          this.error=true
      }
    },
    newapply(){
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
    choose(id){
        if(this.type==1){
            this.$router.push({"name":'VisitRegister',"query":{"applyId":id}})
        }
        if(this.type==2){
            this.$router.push({"name":'EntranceApply',"query":{"applyId":id}})
        }
        if(this.type==4){
            this.$router.push({"name":'ChildHealth',"query":{"applyId":id}})
        }
    }
  },
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  line-height: 46px;
}
.err{
width: 90%;
margin: 10px auto;
border: 1px solid #FFA39E;
background-color: #FFF1F0;
height: 88px;
padding-top: 30px;
p{
    padding-left: 30px;
    font-size: 14px;
}
}
.personlist{
  display:flex;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
}
.personinfo{
  display:flex;
  justify-content: space-between;
  padding: 20px;
  font-size: 14px;
  border-bottom:1px solid #ccc;
}
.choose{
    color:#0083FF;
}
</style>