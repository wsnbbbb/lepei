<template>
    <div class="alien-info-list" >
        <van-cell-group>
            <van-cell title="填报联系人及电话" is-link to="alien-info" :value="contactComplete?'已填写':''" />
            <div class="banner">
              <img src="../assets/imgs/teacher.png" alt="#">
            </div>
            <van-cell title="外籍（中国以外地区）" is-link @click="toAlienInfo(2,4,nationalityTeacherComplete)" :value="nationalityTeacherComplete?'已填写':''" />
            <van-cell title="香港籍" is-link @click="toAlienInfo(2,1,hongKongTeacherComplete)" :value="hongKongTeacherComplete?'已填写':''" />
            <van-cell title="澳门籍" is-link @click="toAlienInfo(2,2,macaoTeacherComplete)" :value="macaoTeacherComplete?'已填写':''" />
            <van-cell title="台湾籍" is-link @click="toAlienInfo(2,3,taiwanTeacherComplete)" :value="taiwanTeacherComplete?'已填写':''" />
            <div class="banner">
              <img src="../assets/imgs/student.png" alt="#">
            </div>
            <van-cell title="外籍（中国以外地区）" is-link @click="toAlienInfo(1,4,nationalityStudentComplete)" :value="nationalityStudentComplete?'已填写':''" />
            <van-cell title="香港籍" is-link @click="toAlienInfo(1,1,hongKongStudentComplete)" :value="hongKongStudentComplete?'已填写':''" />
            <van-cell title="澳门籍" is-link @click="toAlienInfo(1,2,macaoStudentComplete)" :value="macaoStudentComplete?'已填写':''" />
            <van-cell title="台湾籍" is-link @click="toAlienInfo(1,3,taiwanStudentComplete)" :value="taiwanStudentComplete?'已填写':''" />
        </van-cell-group>
    </div>
</template>

<script>

import { alienInfoCount } from '../api/request'
import {Decrypt} from '../util/secret'
import {getQueryString} from '../util/util'
    export default {
        data(){
            return {
              uid:'',
              token:'',
              contactComplete: '',
              hongKongTeacherComplete: '',
              hongKongStudentComplete: '',
              macaoTeacherComplete: '',
              macaoStudentComplete: '',
              taiwanTeacherComplete: '',
              taiwanStudentComplete: '',
              nationalityTeacherComplete: '',
              nationalityStudentComplete: '',
            }
        },
        async created() {
            let datas =  JSON.parse(localStorage.getItem("userInfo"))
            if(datas){
              this.uid = datas.uid;
              this.token = datas.token;
            }
            let res = await alienInfoCount({"uid":datas.uid,"token":datas.token})
            if(res.success){
              this.contactComplete = res.detail.contactComplete;
              this.hongKongTeacherComplete = res.detail.hongKongTeacherComplete;
              this.hongKongStudentComplete = res.detail.hongKongStudentComplete;
              this.macaoTeacherComplete = res.detail.macaoTeacherComplete;
              this.macaoStudentComplete = res.detail.macaoStudentComplete;
              this.taiwanTeacherComplete = res.detail.taiwanTeacherComplete;
              this.taiwanStudentComplete = res.detail.taiwanStudentComplete;
              this.nationalityTeacherComplete = res.detail.nationalityTeacherComplete;
              this.nationalityStudentComplete = res.detail.nationalityStudentComplete;
            }else{
               if(res.code == 100004){
                  this.$toast(res.description)
                }else{
                  Toast.fail(res.description);
                }
            }
        },
        methods:{
          toAlienInfo(personType,areaType,isFill){
            let fillType
            if(isFill === true){
              fillType = 1
            }else{
              fillType = 0
            }
            this.$router.push({path:"/alien-person-info",query:{personType,areaType,fillType}})
          }
        },
        mounted() { 

        } 

    }
</script>

<style lang="less">
.alien-info-list{
  .banner{
    width:100%;
    img{
      width:100%;
      height:100%;
    }
  }
}
   
</style>