<template>
    <div class="mess-person-info" >
        <van-field
            v-model="schoolName"
            name="所属学校"
            label="所属学校"
            input-align="right"
            disabled 
        />
        <van-field name="type" label="人员类型" input-align="right">
          <van-radio-group v-model="type" direction="horizontal" slot="input">
            <van-radio name="1">安保人员</van-radio>
            <van-radio name="2">食堂从业</van-radio>
          </van-radio-group>
        </van-field>
        <van-field
            v-model="name"
            name="姓名"
            label="姓名"
            placeholder="请填写"
            input-align="right"
            maxlength="30"
            :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field name="sex" label="性别" input-align="right">
          <van-radio-group v-model="sex" direction="horizontal" slot="input">
            <van-radio name="1">男</van-radio>
            <van-radio name="2">女</van-radio>
          </van-radio-group>
        </van-field>
        <van-field label="身份证号码" v-model="idCardNo" placeholder="请填写" input-align="right" @blur="getBirthday"/>
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
        <van-field label="文化程度" v-model="educationLevel" placeholder="请填写" input-align="right" />
        <van-field
          v-model="address"
          rows="3"
          autosize
          maxlength="100"
          show-word-limit
          label="实际居住地"
          type="textarea"
           input-align="right"
          placeholder="实际居住地（精确至门牌号）"
        />
        <van-field
          v-if="type == 1"
          v-model="securityStaffNo"
          rows="2"
          autosize
          maxlength="100"
          show-word-limit
          input-align="right"
          label="保安证编号和保安公司名称"
          type="textarea"
          placeholder="请填写"
        />
        <van-field
          v-if="type == 2"
          readonly
          clickable
          name="calendar"
          :value="healthCertificateValidity"
          label="健康证有效截止期"
          placeholder="点击选择日期"
          input-align="right"
          is-link
          @click="showPicker = true"
        />
        <van-field
        class="remark"
          v-model="remark"
          rows="3"
          autosize
          maxlength="100"
          show-word-limit
          label="备注"
          input-align="right"
          type="textarea"
          placeholder="请填写"
        />
        <div class="btn-box" >
            <van-button round block type="info" native-type="submit" @click="fillPersonInfo">提交</van-button>
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

import { getMessPerson, fillPersonInfo, getSchoolList} from '../api/request'
import { stringCheck, getBirthdayFromIdCard,getQueryString,getFormatDate} from '../util/util'
import { Toast } from 'vant';

    export default {
        data(){
            return {
                id:'',
                uid:'',
                token: '',
                schoolName:'',
                type:'',
                sex: '',
                name: '',
                idCardNo:'',
                birthday: '',
                educationLevel:'',
                address:'',
                securityStaffNo:'',
                healthCertificateValidity:'',
                remark:'',
                showCalendar: false,
                showPicker: false,
                minDate: new Date(1920, 0, 1),
                maxDate: new Date(),
                currentDate: new Date(),
                minDate1: new Date(),
                maxDate1: new Date(2025,12,31),
                datas:{},
                
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
                // 获取从业人员信息
                this.getMessPerson()
            }
    
        },
        methods:{
            getBirthday(e) {
                this.birthday = getBirthdayFromIdCard(e.target.value)
            },
            confirm1(value){
                this.birthday = getFormatDate(value);
                this.showCalendar = false
            },
            confirm2(value){
                this.healthCertificateValidity = getFormatDate(value);
                this.showPicker = false
            },
            getMessPerson(){
               let params = {
                   "uid":this.uid,
                   "token":this.token,
                   "id":getQueryString("id"),
               }
               getMessPerson(params).then(res =>{
                   if(res.success){
                    this.name = res.detail.name
                    this.sex = res.detail.sex+''
                    this.birthday = !res.detail.birthday?getBirthdayFromIdCard(this.idCardNo):res.detail.birthday
                    this.type = res.detail.type+''
                    this.idCardNo = res.detail.idCardNo
                    this.educationLevel = res.detail.educationLevel
                    this.healthCertificateValidity = res.detail.healthCertificateValidity
                    this.securityStaffNo = res.detail.securityStaffNo
                    this.remark = res.detail.remark
                    this.address = res.detail.address
                    this.currentDate = new Date(res.detail.birthday)
                }else{
                    Toast.fail(res.description);
                }
               })
            },
            
            async fillPersonInfo(){
                let id = getQueryString("id");
                if(stringCheck(this.name)){
                    Toast('姓名不能为空');
                    return
                }
                if(stringCheck(this.type)){
                    Toast('人员类型不能为空');
                    return
                }
                if(stringCheck(this.sex)){
                    Toast('性别不能为空');
                    return
                }
                if(stringCheck(this.idCardNo)){
                    Toast('身份证号不能为空');
                    return
                }
                if(stringCheck(this.birthday)){
                    Toast('出生日期不能为空');
                    return
                }
                if(stringCheck(this.educationLevel)){
                    Toast('文化程度不能为空');
                    return
                }
                if(stringCheck(this.address)){
                    Toast('实际居住地不能为空');
                    return
                }
               if(this.type == 1 && stringCheck(this.securityStaffNo)){
                    Toast('保安证编号不能为空');
                    return
               }else if(this.type == 2 && stringCheck(this.healthCertificateValidity)){
                    Toast('健康证有效日期不能为空');
                    return
               }
               let params
               if(id){
                   params = {
                       "id":id,
                       "uid":this.uid,
                       "type":this.type,
                       "idCardNo":this.idCardNo,
                       "token":this.token,
                       "sex":this.sex,
                       "name":this.name,
                       "token":this.token,
                       "educationLevel":this.educationLevel,
                       "securityStaffNo":this.securityStaffNo,
                       "address":this.address,
                       "birthday":this.birthday,
                       "healthCertificateValidity":this.healthCertificateValidity,
                       "remark":this.remark,
                   }
               }else{
                    params = {
                        "uid":this.uid,
                       "type":this.type,
                       "idCardNo":this.idCardNo,
                       "token":this.token,
                       "sex":this.sex,
                       "name":this.name,
                       "token":this.token,
                       "educationLevel":this.educationLevel,
                       "securityStaffNo":this.securityStaffNo,
                       "address":this.address,
                       "birthday":this.birthday,
                       "healthCertificateValidity":this.healthCertificateValidity,
                       "remark":this.remark,
                   }
               }
               console.log({params});
                let res = await fillPersonInfo(params)
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
.mess-person-info{
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