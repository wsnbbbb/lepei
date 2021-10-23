<template>
  <div class="Write-info-list">
    <div class="image">
      <img src="../assets/imgs/banner1.png" alt="#">
    </div>
    <div class="btns">
      <div @click="addSchoolBus">新增<van-icon name="add-o" /></div>
      <div @click="toSchoolBus">已填写<span>{{schoolBusCount}}</span>份<van-icon name="arrow" /></div>
    </div>
    <div class="image">
      <img src="../assets/imgs/banner2.png" alt="#">
    </div>
    <div class="btns">
      <div @click="addDirver">新增<van-icon name="add-o" /></div>
      <div @click="toDiverList">已填写<span>{{driverCount}}</span>份<van-icon name="arrow" /></div>
    </div>
    <div class="image">
      <img src="../assets/imgs/banner3.png" alt="#">
    </div>
    <div class="btns">
      <div @click="addMessInfo">新增<van-icon name="add-o" /></div>
      <div @click="toMessPerson">已填写<span>{{workerCount}}</span>份<van-icon name="arrow" /></div>
    </div>
    <div class="image">
      <img src="../assets/imgs/fangyi.png" alt="#">
    </div>
    <van-cell :class="epidemicMaterials?'statistics':'van-red statistics'"  title="抗疫物资统计" is-link to="epidemic-materials" :value="epidemicMaterials?'已填写':'未填写'"/>
  </div>
</template>

<script>
import {completeCount } from '../api/request'
import { Toast } from 'vant';
  export default {
    data(){
      return {
        schoolBusCount:'',
        driverCount:'',
        workerCount:'',
        epidemicMaterials:false,
      }
    },
   async created() {
     let data = JSON.parse(localStorage.getItem("userInfo"))
     let params
     if(data){
        params = {
         "uid":data.uid,
         "token":data.token
       }
     }
     let res = await completeCount(params)
     if(res.success){
       this.schoolBusCount = res.detail.schoolBusCount;
       this.driverCount = res.detail.driverCount;
       this.workerCount = res.detail.workerCount;
       this.epidemicMaterials = res.detail.epidemicMaterials;
       localStorage.setItem("isFill",res.detail.epidemicMaterials)
     }else{
       Toast.fail(res.description);
     }
    },
    methods:{
      toSchoolBus() {
        this.$router.push({path:"/school-bus"})
      },
      toDiverList() {
        this.$router.push({path:"/dirver-list"})
      },
      toMessPerson() {
        this.$router.push({path:"/mess-person"})
      },
      addSchoolBus() {
        this.$router.push({path:"/school-bus-info"})
      },
      addDirver() {
        this.$router.push({path:"/dirver-info"})
      },
      addMessInfo() {
        this.$router.push({path:"/mess-person-info"})
      },
    }

  }
</script>

<style lang="less">

.Write-info-list{
  width:100%;
  .statistics{
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  .van-red{
    .van-cell__value{
        color: red;
    }
  }
  .image{
    width:100%;
    img{
      width:100%;
      height:100%;
    }
  }
  .btns{
      display: flex;
      text-align: center;
      margin-bottom: .625rem;
      div{
        width:50%;
        margin:.625rem 0;
        &:first-child{
          border-right:2px solid #ccc;
          .van-icon{
            font-size: 19px;
            vertical-align: middle;
             margin: 0 0 2px 10px;
          }
        }
        &:last-child{
          span{
            padding:5px;
            color:#f86060;
          }
          .van-icon{
            vertical-align: middle;
            margin: 0 0 2px 10px;
          }
        }
      }
    }
}
</style>