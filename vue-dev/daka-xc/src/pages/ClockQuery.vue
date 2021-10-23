<template>
  <div class="clock-query">
    <van-cell title="学生打卡情况" label="查看绑定班级，查看每日打卡情况" is-link @click="toTypeList(1)"/>
    <van-cell title="班主任代打卡" label="代学生完成健康打卡" is-link @click="toTypeList(2)"/>
    <van-cell title="绑定班级管理" label="绑定班级后，可查看班级的打卡情况 一个班级仅允许绑定一位教师管理" to="bind-class-list" is-link />
  </div>
</template>

<script>
import { teachClassList } from '../api/request'
import { Toast } from 'vant';
  export default {
    data(){
      return {
        personId:'',
        token:'',
      }
    },
    async created() {
     let datas = JSON.parse(localStorage.getItem("detailList"))
     if(datas){
      this.personId = datas.personId
      this.token = datas.token
     }
    },
    methods:{
    async toTypeList (type) {
      let res = await teachClassList({"personId":this.personId,"token":this.token,})
        if(res.success){
         if(res.detail.length == 0){
            return Toast.fail("未绑定班级，请绑定班级后再试")
         }else{
            localStorage.setItem("clockTypeList",JSON.stringify(res.detail))
            if(type == 1){
              this.$router.push({path:"/clock-type-list"})
            }else{
              this.$router.push({path:"/help-punch-card"})
            }
         }
        }else{
          Toast.fail(res.description)
        }
      }
      
    },

  }
</script>

<style lang="less">
.clock-query{
  .van-cell__title{
    font-size: 1rem;
    .van-cell__label{
      width:12.8125rem;
    }
  }
 
}
</style>