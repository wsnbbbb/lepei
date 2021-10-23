<template>
    <div class="dirver-info" >
        <van-field
            v-model="schoolName"
            name="所属学校"
            label="所属学校"
            input-align="right"
            disabled 
        />
        <van-field
            v-model="name"
            name="姓名"
            label="姓名"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field
            v-model="drivingLicenseNumber"
            name="驾驶证号"
            label="驾驶证号"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写驾驶证号' }]"
        />
        <van-field name="sex" label="性别" input-align="right">
          <van-radio-group v-model="sex" direction="horizontal" slot="input">
            <van-radio name="1">男</van-radio>
            <van-radio name="2">女</van-radio>
          </van-radio-group>
        </van-field>
        <van-field
            v-model="nationality"
            name="国籍"
            label="国籍"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写国籍' }]"
        />
        <van-field
          v-model="address"
          rows="3"
          autosize
          maxlength="100"
          show-word-limit
          label="实际居住地"
          type="textarea"
          placeholder="实际居住地（精确至门牌号）"
        />
        <van-field
          readonly
          clickable
          name="calendar"
          :value="birthday"
          label="出生日期"
          placeholder="点击选择日期"
          input-align="right"
          is-link
          @click="showCalendar = true"
        />
        <van-field label="准驾车型" v-model="canDriveCar" placeholder="请填写" input-align="right" />
        <van-field
          readonly
          clickable
          name="calendar"
          :value="drivingLicenseValidity"
          label="驾驶证有效期"
          placeholder="点击选择日期"
          input-align="right"
          is-link
          @click="showPicker = true"
        />
        <van-field
            v-model="certificationAuthority"
            name="发证机关"
            label="发证机关"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写发证机关' }]"
        />
        <van-field
            v-model="archivesNo"
            name="档案编号"
            label="档案编号"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写档案编号' }]"
        />
        <van-field
          class="remark"
          v-model="remark"
          rows="3"
          autosize
          maxlength="100"
          show-word-limit
          label="记录"
          type="textarea"
          placeholder="请填写"
        />
        <div class="btn-box" >
            <van-button round block type="info" native-type="submit" @click="addDirverInfo">提交</van-button>
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
        <van-popup
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
        </van-popup>
    </div>
</template>

<script>

import { addDirverInfo, getDirverInfo} from '../api/request'
import { stringCheck,getQueryString} from '../util/util'
import moment from 'moment'
import { Toast } from 'vant';

    export default {
        data(){
            return {
                id:'',
                uid:'',
                token: '',
                schoolName:'',
                sex: '',
                name: '',
                drivingLicenseNumber:'',
                nationality: '',
                canDriveCar:'',
                address:'',
                birthday:'',
                drivingLicenseValidity:'',
                certificationAuthority:'',
                archivesNo:'',
                remark:'',
                showCalendar: false,
                showPicker: false,
                minDate: new Date(1920, 0, 1),
                maxDate: new Date(),
                currentDate: new Date(),
                minDate1: new Date(),
                maxDate1: new Date(2030,12,31),
                datas:{},
                
            }
        },
       
        async created() {
            let id = getQueryString("id");
            let datas =  JSON.parse(localStorage.getItem("userInfo"))
            this.datas = datas;
            console.log(datas);
            
            this.token = datas.token;
            this.uid = datas.uid;
            this.schoolName = datas.schoolName;
            if(id){
                this.id = id
                this.getDirverInfo()
            }
    
        },
        methods:{
            
            confirm1(value){
                this.birthday = moment(value).format('YYYY-MM-DD');
                this.showCalendar = false
            },
            confirm2(value){
                this.drivingLicenseValidity = moment(value).format('YYYY-MM-DD');
                this.showPicker = false
            },
            getDirverInfo(){
               let params = {
                   "uid":this.uid,
                   "token":this.token,
                   "id":getQueryString("id"),
               }
               getDirverInfo(params).then(res =>{
                   if(res.success){
                    this.name = res.detail.name
                    this.sex = res.detail.sex+''
                    this.birthday = res.detail.birthday
                    this.drivingLicenseNumber = res.detail.drivingLicenseNumber
                    this.nationality = res.detail.nationality
                    this.address = res.detail.address
                    this.canDriveCar = res.detail.canDriveCar
                    this.drivingLicenseValidity = res.detail.drivingLicenseValidity
                    this.certificationAuthority = res.detail.certificationAuthority
                    this.archivesNo = res.detail.archivesNo
                    this.remark = res.detail.remark
                    this.currentDate = new Date(res.detail.birthday)
                }else{
                    Toast.fail(res.description);
                }
               })
            },
            
            async addDirverInfo(){
                let id = getQueryString("id");
                if(stringCheck(this.name)){
                    Toast('姓名不能为空');
                    return
                }
                if(stringCheck(this.sex)){
                    Toast('性别不能为空');
                    return
                }
                if(stringCheck(this.drivingLicenseNumber)){
                    Toast('驾驶证号不能为空');
                    return
                }
                if(stringCheck(this.nationality)){
                    Toast('国籍不能为空');
                    return
                }
                if(stringCheck(this.birthday)){
                    Toast('出生日期不能为空');
                    return
                }
                if(stringCheck(this.canDriveCar)){
                    Toast('准驾车型不能为空');
                    return
                }
                if(stringCheck(this.address)){
                  Toast('实际居住地不能为空');
                  return
                }
                if(stringCheck(this.drivingLicenseValidity)){
                  Toast('驾驶证有效截止日期不能为空');
                  return
                }
                if(stringCheck(this.certificationAuthority)){
                  Toast('发证机关不能为空');
                  return
                }
                if(stringCheck(this.archivesNo)){
                  Toast('档案编号不能为空');
                  return
                }
              
               let params
               if(id){
                   params = {
                       "id":id,
                       "uid":this.uid,
                       "sex":this.sex,
                       "name":this.name,
                       "token":this.token,
                       "drivingLicenseNumber":this.drivingLicenseNumber,
                       "nationality":this.nationality,
                       "canDriveCar":this.canDriveCar,
                       "drivingLicenseValidity":this.drivingLicenseValidity,
                       "address":this.address,
                       "birthday":this.birthday,
                       "certificationAuthority":this.certificationAuthority,
                       "archivesNo":this.archivesNo,
                       "remark":this.remark,
                   }
               }else{
                    params = {
                       "uid":this.uid,
                       "sex":this.sex,
                       "name":this.name,
                       "token":this.token,
                       "drivingLicenseNumber":this.drivingLicenseNumber,
                       "nationality":this.nationality,
                       "canDriveCar":this.canDriveCar,
                       "drivingLicenseValidity":this.drivingLicenseValidity,
                       "address":this.address,
                       "birthday":this.birthday,
                       "certificationAuthority":this.certificationAuthority,
                       "archivesNo":this.archivesNo,
                       "remark":this.remark,
                   }
               }
               console.log({params});
                let res = await addDirverInfo(params)
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
.dirver-info{
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