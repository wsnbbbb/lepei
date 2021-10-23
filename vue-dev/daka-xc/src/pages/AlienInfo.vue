<template>
  <div>
    <van-form validate-first @failed="onFailed" @submit="onSubmit">
      <van-field
        disabled 
        v-model="school"
        name="学校"
        label="所属学校"
        input-align="right"
      />
      <van-field
        v-model="name"
        clearable
        name="name"
        label="填报联系人姓名"
        placeholder="请填写"
        input-align="right"
        :rules="[{ required: true, message: '请填写姓名' }]"
      />
      <van-field
        v-model="mobile"
        clearable
        maxlength="11"
        name="mobile"
        label="电话"
        placeholder="请填写"
        input-align="right"
        :rules="[{ required: true, message: '请填写电话号码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>


import { alienInfoDetail,alienInfoAdd } from '../api/request'
import {Decrypt} from '../util/secret'
import {getQueryString} from '../util/util'
    export default {
        data(){
            return {
              uid:'',
              token:'',
              school:'',
              name:'',
              mobile:'',
            }
        },
        async created() {
            let datas =  JSON.parse(localStorage.getItem("userInfo"))
            if(datas){
              this.uid = datas.uid;
              this.token = datas.token;
              this.school = datas.schoolName;
            }
            let res = await alienInfoDetail({"uid":datas.uid,"token":datas.token})
            if(res.success){
              this.name = res.detail.name;
              this.mobile = res.detail.mobile;
            }else{
               if(res.code == 100004){
                  this.$toast(res.description)
                }else{
                  Toast.fail(res.description);
                }
            }
        },
        methods:{
           onFailed(errorInfo) {
          },
          onSubmit(value) {
            let reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
            if(!reg.test(this.mobile)){
              return  this.$toast("请输入正确格式的手机号码");
            }
            let params = {
              "uid":this.uid,
              "token":this.token,
              "name":value.name,
              "mobile":value.mobile,
            }
            alienInfoAdd(params).then(res =>{
              if(res.success){
                this.$toast("提交成功")
                setTimeout(() =>{
                  this.$router.go(-1)
                },1000)
              }else{
                this.$toast.fail(res.description)
              }
            })
            
          }
        },
        mounted() { 

        } 

    }
</script>

<style lang="less">
   
    
</style>