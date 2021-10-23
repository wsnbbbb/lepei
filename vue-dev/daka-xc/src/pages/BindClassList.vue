<template>
  <div class="bind-class-list">
    <van-swipe-cell :key="index" v-for="(item, index) in list">
      <van-cell is-link title="班级信息" :value="item.className" />
      <template slot="right">
        <van-button  @click="del(item.classId)" square type="danger" text="删除" />
      </template>
    </van-swipe-cell>
   
    <div class="addBtn" >
      <van-button round color="#1989FA" plain block @click="addBind">增加绑定班级</van-button>
    </div>
  </div>
</template>

<script>
import { dirverList, teachClassList, deleteBind } from '../api/request'
import { Dialog,Toast } from 'vant';
  export default {
    data(){
      return {
        list:[],
      }
    },
    created() {
        let data = JSON.parse(localStorage.getItem("detailList"))
        if(data){
          this.personId = data.personId;
          this.token = data.token;
        }
        this.init()
    },
    methods:{
        async init(){
          let params = {
            "personId": this.personId,
            "token":this.token,
          }
          let res = await teachClassList(params)
          if(res.success){
            this.list = res.detail
          }else{
            Toast.fail(res.description);
          }
        },
       // 删除
       async del(id){
        let _this = this
          Dialog.confirm({
              message: '确定删除吗？'
            }).then(() => {
              let parmas = {
                "personId": _this.personId,
                "token": _this.token,
                "classId": id
              }
              deleteBind(parmas).then(res =>{
                if(res.success){
                  this.$toast("删除成功!")
                  setTimeout(() => {
                    this.init()
                  }, 1000);
                }else{
                  this.$toast(res.description);
                }
              }).catch(()=>{
              })
            }).catch(() =>{
          })
      },

      // 增加班级绑定
      addBind() {
        this.$router.push({path:"/bind-class-info"})
      }
        
    },

  }
</script>

<style lang="less">
.bind-class-list{
 .addBtn{
    width:100%;
    margin-top: 1.875rem;
    button{
      width:60%;
      margin:0 auto;
    }
  }
 
}
</style>