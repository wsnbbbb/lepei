<template>
  <div class="main-box">
    <div class="content">
      <van-icon name="checked" color="#6fa059" size="30" />提交成功！
    </div>
    <div>已提交成功，请勿重复提交</div>
  </div>
</template>

<script>

    export default {
        data(){
            return {

             
            }
        },
      
        methods:{

       
        },
        mounted() { 

        } 

    }
</script>

<style lang="less" scoped>
  .main-box{
    div{
      text-align: center;
    }
  }
  .content{
    width: 130px;
    height: 70px;
    line-height: 90px;
    color: #6fa059;
    margin: 0 auto;
    i{
      top: 10px;
    }
  }
    
</style>