<template>
  <div class="clock-query">
    <van-cell title="学生打卡情况" label="查看绑定班级，查看每日打卡情况" to="clock-type-list" is-link />
    <van-cell title="绑定班级管理" label="绑定班级后，可查看班级的打卡情况 一个班级仅允许绑定一位教师管理" to="bind-class-list" is-link />
  </div>
</template>

<script>
import { dirverList } from '../api/request'
  export default {
    data(){
      return {
        
      }
    },
    async created() {
     
    },
    methods:{
      
      
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