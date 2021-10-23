<template>
    <div class="school-bus-info" >
        <van-field
            v-model="schoolName"
            name="所属学校"
            label="所属学校"
            input-align="right"
            disabled 
        />
        <van-field
            clearable
            v-model="carNo"
            name="车牌号码"
            label="车牌号码"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写车牌号码' }]"
        />
        <van-field
            v-model="type"
            clearable
            name="车辆类型"
            label="车辆类型"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写车辆类型' }]"
        />
        
        <van-field
            clearable
            v-model="ownerName"
            name="所有人"
            label="所有人"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写所有人' }]"
        />
        <van-field
            clearable
            v-model="usageCharacteristics"
            name="使用性质"
            label="使用性质"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写使用性质' }]"
        />
        <van-field
            clearable
            v-model="brandModel"
            name="品牌型号"
            label="品牌型号"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写品牌型号' }]"
        />
        <van-field
            clearable
            v-model="identificationCode"
            name="车辆识别码（车架号）"
            label="车辆识别码（车架号）"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写识别码' }]"
        />
        <van-field
            clearable
            v-model="engineCode"
            name="发动机号"
            label="发动机号"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写发动机号' }]"
        />
        <van-field
          readonly
          clickable
          name="calendar"
          :value="registerDate"
          label="注册日期"
          placeholder="点击选择日期"
          input-align="right"
          is-link
          @click="showCalendar = true"
        />
        <van-field
            clearable
            v-model="certificationAuthority"
            name="发证机关"
            label="发证机关"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写发证机关' }]"
        />
          <van-field
            clearable
            v-model="archivesCode"
            name="档案编号"
            label="档案编号"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写档案编号' }]"
        />
          <van-field
            clearable
            v-model="passengerCount"
            name="载客人数"
            label="载客人数"
            type="number"
            placeholder="请填写"
            input-align="right"
            maxlength="3"
            :rules="[{ required: true, message: '请填写载客人数' }]"
        />
        
        <van-field
          v-model="route"
          rows="3"
          autosize
          maxlength="100"
          show-word-limit
          label="核定路线"
          type="textarea"
          placeholder="请填写"
        />
       
        <van-field
        class="remark"
          v-model="remark"
          rows="3"
          autosize
          maxlength="100"
          show-word-limit
          label="备注"
          type="textarea"
          placeholder="请填写"
        />
        <div class="btn-box" >
            <van-button round block type="info" native-type="submit" @click="fillSchoolBus">提交</van-button>
        </div>
        <van-popup
            v-model="showCalendar"
            position="bottom"
            :style="{ height: '50%' }"
            >
            <van-datetime-picker
                @cancel="showCalendar = false"
                @confirm="confirm1"
                v-model="currentDate"
                type="date"
                :min-date="minDate"
                :max-date="maxDate"
                />
        </van-popup>
        <!-- <van-popup
            v-model="showPicker"
            position="bottom"
            :style="{ height: '50%' }"
            >
            <van-datetime-picker
                @cancel="showPicker = false"
                @confirm="confirm2"
                v-model="currentDate"
                type="date"
                :min-date="minDate1"
                :max-date="maxDate1"
                />
        </van-popup> -->
    </div>
</template>

<script>

import { getSchoolBus, fillSchoolBus} from '../api/request'
import { stringCheck, getBirthdayFromIdCard,getQueryString,getFormatDate} from '../util/util'
import { Toast } from 'vant';

    export default {
        data(){
            return {
                id:'',
                uid:'',
                token: '',
                schoolName:'',
                passengerCount: '',
                type:'',
                carNo: '',
                ownerName:'',
                usageCharacteristics: '',
                brandModel:'',
                identificationCode:'',
                engineCode:'',
                registerDate:'',
                certificationAuthority:'',
                archivesCode: '',
                route: '',
                remark: '',
                minDate: new Date(1920, 0, 1),
                maxDate: new Date(),
                currentDate: new Date(),
                minDate1: new Date(),
                maxDate1: new Date(2025,12,31),
                datas:{},
                showCalendar: false
                
            }
        },
        computed: {
           
        },
        async created() {
            let id = getQueryString("id");
            let datas =  JSON.parse(localStorage.getItem("userInfo"))
            if(datas){
                this.datas = datas;
                this.token = datas.token;
                this.uid = datas.uid;
                this.schoolName = datas.schoolName;
            }
            if(id){
                this.id = id
                this.getSchoolBus()
            }
    
        },
        methods:{
            getBirthday(e) {
                this.birthday = getBirthdayFromIdCard(e.target.value)
            },
            confirm1(value){
                this.registerDate = getFormatDate(value);
                this.showCalendar = false
            },
            confirm2(value){
                this.healthCertificateValidity = getFormatDate(value);
                this.showPicker = false
            },
            getSchoolBus(){
               let params = {
                   "uid":this.uid,
                   "token":this.token,
                   "id":getQueryString("id"),
               }
               getSchoolBus(params).then(res =>{
                   if(res.success){
                    this.name = res.detail.name
                    this.passengerCount = res.detail.passengerCount
                    this.type = res.detail.type
                    this.carNo = res.detail.carNo
                    this.ownerName = res.detail.ownerName
                    this.usageCharacteristics = res.detail.usageCharacteristics
                    this.brandModel = res.detail.brandModel
                    this.identificationCode = res.detail.identificationCode
                    this.engineCode = res.detail.engineCode
                    this.registerDate = res.detail.registerDate
                    this.certificationAuthority = res.detail.certificationAuthority
                    this.archivesCode = res.detail.archivesCode
                    this.route = res.detail.route
                    this.remark = res.detail.remark
                    this.currentDate = new Date(res.detail.birthday)
                }else{
                    Toast.fail(res.description);
                }
               })
            },
            
            async fillSchoolBus(){
                let id = getQueryString("id");
               
                if(stringCheck(this.type)){
                    Toast('车辆类型不能为空');
                    return
                }
                if(stringCheck(this.carNo)){
                    Toast('车辆号码不能为空');
                    return
                }
                if(stringCheck(this.ownerName)){
                    Toast('所有人不能为空');
                    return
                }
                if(stringCheck(this.usageCharacteristics)){
                    Toast('使用性质不能为空');
                    return
                }
                if(stringCheck(this.brandModel)){
                    Toast('品牌型号不能为空');
                    return
                }
                if(stringCheck(this.identificationCode)){
                    Toast('识别码不能为空');
                    return
                }
                if(stringCheck(this.engineCode)){
                    Toast('发动机号不能为空');
                    return
                }
                if(stringCheck(this.registerDate)){
                    Toast('注册日期不能为空');
                    return
                }
                if(stringCheck(this.certificationAuthority)){
                    Toast('发证机关不能为空');
                    return
                }
                 if(stringCheck(this.archivesCode)){
                    Toast('档案编号不能为空');
                    return
                }
                 if(stringCheck(this.passengerCount)){
                    Toast('载客人数不能为空');
                    return
                }
               
            //    if(this.type == 1 && stringCheck(this.securityStaffNo)){
            //         Toast('保安证编号不能为空');
            //         return
            //    }else if(this.type == 2 && stringCheck(this.healthCertificateValidity)){
            //         Toast('健康证有效日期不能为空');
            //         return
            //    }

               let params = {
                   "uid":this.uid,
                   "token":this.token,
                    "type":this.type,
                    "passengerCount":this.passengerCount,
                    "carNo":this.carNo,
                    "ownerName":this.ownerName,
                    "usageCharacteristics":this.usageCharacteristics,
                    "brandModel":this.brandModel,
                    "identificationCode":this.identificationCode,
                    "engineCode":this.engineCode,
                    "registerDate":this.registerDate,
                    "certificationAuthority":this.certificationAuthority,
                    "archivesCode":this.archivesCode,
                    "route":this.route,
                    "remark":this.remark,
                }
               if(id){
                   params.id = id
               }
               console.log({params});
                let res = await fillSchoolBus(params)
                if(res.success){
                   Toast.success('提交成功');
                   setTimeout(() => {
                       this.$router.go(-1)
                   }, 2000);
                }else{
                    Toast.fail(res.description);
                    if(code === 100004){
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
.school-bus-info{
  .van-red{
      .van-cell__value{
          color: red;
      }
  }
  .van-field__label{
      width: 120px;
  }
  .remark{
      margin-bottom: 5.25rem;
  }
  .btn-box{
    width:100%;
    text-align: center;
    position: fixed;
    left:0;
    bottom:15px;
    button{
        width:80%;
        margin:0 auto;
    }
  }

}
</style>