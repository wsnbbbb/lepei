<template>
    <div class="alien-person-info" >
        <van-field
          v-model="school"
          name="所属学校"
          label="所属学校"
          input-align="right"
          disabled 
        />
        <van-field
          clearable
          v-model="personTotalNum"
          name="总人数"
          label="总人数"
          maxlength="5"
          placeholder="请填写"
          input-align="right"
          type="number"
        />
        <van-field
          v-if="areaType == 4"
          clearable
          v-model="nationalityDistribution"
          rows="3"
          autosize
          input-align="right"
          maxlength="200"
          show-word-limit
          label="国籍分布"
          type="textarea"
          placeholder="请填写"
        />
        <van-field
          clearable
          v-model="currentInChengduCount"
          maxlength="5"
          name="目前在蓉人数"
          label="目前在蓉人数"
          placeholder="请填写"
          input-align="right"
          type="number"
        />
        <van-field
          clearable
          v-model="currentNotInChengduCount"
          maxlength="5"
          name="目前非在蓉人数"
          label="目前非在蓉人数"
          placeholder="请填写"
          input-align="right"
          type="number"
        />
         <van-field
          clearable
          v-model="nationalityDistributionNoinCd"
          rows="4"
          autosize
          maxlength="200"
          show-word-limit
          label="非在蓉人员具体地区分布"
          type="textarea"
          placeholder="请填写具体地区，中国地区请填写城市，中国以外地区请填写国家（例：香港、北京、兰州、美国、德国）"
          input-align="right"
        />
         <van-field
          clearable
          v-model="doubtfulSickCount"
          maxlength="5"
          name="doubtfulSickCount"
          label="人员健康情况人员数统计，仅填写发热人员、疑似人员、确诊人员的总数"
          placeholder="请填写"
          input-align="right"
          type="number"
          class="text"
        />
         <van-field
          clearable
          v-model="touchEpicentersPersonCount"
          maxlength="5"
          name="touchEpicentersPersonCount"
          label="与疫情严重地区（湖北、浙江、广东、河南、湖南、江西、重庆、安徽、北京、海南）人员由接触的人数"
          placeholder="请填写"
          input-align="right"
          type="number"
          class="text"
        />
        <van-field
          clearable
          v-model="remark"
          rows="3"
          autosize
          input-align="right"
          maxlength="100"
          show-word-limit
          label="备注"
          type="textarea"
          placeholder="如有未尽事宜，请填写"
        />
        <div class="btn" style="margin:16px 0;">
            <van-button round block type="info" native-type="submit" @click="fillAlienInfo">提交</van-button>
        </div>
        
    </div>
</template>

<script>

import { alienPersonDetail,fillAlienInfo } from '../api/request'
import { stringCheck,getQueryString} from '../util/util'
import moment from 'moment'
import { Toast } from 'vant';

    export default {
        data(){
          return {
            uid:'',
            token: '',
            school:'',
            personType:'',
            areaType: '',
            name: '',
            personTotalNum: '',
            currentInChengduCount: '',
            currentNotInChengduCount: '',
            touchEpicentersPersonCount: '',
            doubtfulSickCount: '',
            nationalityDistribution: '',
            nationalityDistributionNoinCd: '',
            remark: '',
            fillType:0,
          }
        },
       
        created() {
            let datas =  JSON.parse(localStorage.getItem("userInfo"))
            this.uid = datas.uid;
            this.token = datas.token;
            this.school = datas.schoolName;
            this.personType = getQueryString("personType");
            this.areaType = getQueryString("areaType");
            this.fillType = getQueryString("fillType");
            console.log(getQueryString("fillType"));
            if(this.fillType == 1){
             this.alienPersonDetail()
            }
        },
        methods:{
            alienPersonDetail(){
              let params = {
                "uid":this.uid,
                "token":this.token,
                "personType":getQueryString("personType"),
                "areaType":getQueryString("areaType"),
              }
              alienPersonDetail(params).then(res =>{
                if(res.success){
                  this.personTotalNum = res.detail.personTotalNum;
                  this.currentInChengduCount = res.detail.currentInChengduCount;
                  this.currentNotInChengduCount = res.detail.currentNotInChengduCount;
                  this.touchEpicentersPersonCount = res.detail.touchEpicentersPersonCount;
                  this.doubtfulSickCount = res.detail.doubtfulSickCount;
                  this.nationalityDistribution = res.detail.nationalityDistribution;
                  this.nationalityDistributionNoinCd = res.detail.nationalityDistributionNoinCd;
                  this.remark = res.detail.remark;
                }else{
                  Toast.fail(res.description);
                }
              })
            },
            async fillAlienInfo(){
                let params = {
                  "uid":this.uid,
                  "token":this.token,
                  "personType":this.personType,
                  "areaType":this.areaType,
                  "personTotalNum":this.personTotalNum,
                  "currentInChengduCount":this.currentInChengduCount,
                  "currentNotInChengduCount":this.currentNotInChengduCount,
                  "touchEpicentersPersonCount":this.touchEpicentersPersonCount,
                  "doubtfulSickCount":this.doubtfulSickCount,
                  "nationalityDistribution":this.nationalityDistribution,
                  "certificationAuthority":this.certificationAuthority,
                  "nationalityDistributionNoinCd":this.nationalityDistributionNoinCd,
                  "remark":this.remark,
                }
              let res = await fillAlienInfo(params)
              if(res.success){
                  Toast.success('提交成功');
                  setTimeout(() => {
                      this.$router.go(-1)
                  }, 2000);
              }else{
                  Toast.fail(res.description);
                  if(res.code === 100004){
                      localStorage.removeItem("userInfo")
                      this.$router.push({path:"/home"})
                  }
              }
            },
        },
        mounted() { 

        } 

    }
</script>

<style lang="less">
.alien-person-info{
  .van-red{
      .van-cell__value{
          color: red;
      }
  }
  .van-field__label{
      width: 120px;
  }
  .text{
    .van-field__label{
      width: 230px;
    }
  }
  .btn{
    width:100%;
    text-align: center;
    button{
      width:80%;
      margin:0 auto;
    }
  }

}
</style>