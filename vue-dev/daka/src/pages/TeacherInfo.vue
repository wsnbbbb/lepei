<template>
    <div class="teacher-info">
        <van-field
            v-model="name"
            clearable
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
        <van-field label="身份证号码" :value="idCardNo" disabled input-align="right" />
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
        <!-- <van-field label="人员类型" :value="roleType!=0?type(roleType):personType" disabled input-align="right" /> -->
        <van-field 
            readonly
            label="人员类型" 
            is-link 
            @click="showChoiceRole = true" 
            v-model="personType" 
            placeholder="请选择"
            input-align="right" 
        />
        <van-field
            disabled
            :value="school"
            label="学校"
            input-align="right"
        />
        <!-- <van-field
            readonly
            clickable
            name="school"
            :value="school"
            label="学校"
            placeholder="请选择"
            input-align="right"
            is-link
            @click="showSchool = true"
        /> -->
        <van-cell-group title="户籍所在地（精确至门牌号）">
            <van-field
                clickable
                name="address"
                :value="address"
                label="省市区"
                placeholder="点击选择地区"
                input-align="right"
                is-link
                readonly
                @click="showAddress = true"
            />
           
            <van-field
                v-model="domicileLocation"
                rows="3"
                autosize
                maxlength="100"
                show-word-limit
                label="具体地址"
                type="textarea"
                placeholder="街道（例：XX街102号5栋1单元502号）"
            />
        </van-cell-group>
        <van-field
            v-model="emergencyTel"
            clearable
            name="主要联系电话"
            label="主要联系电话"
            placeholder="请填写"
            input-align="right"
            maxlength="11"
            :rules="[{ required: true, message: '请填写姓名' }]"
        />
         <van-field
            v-model="standbyTel"
            clearable
            name="备用联系电话"
            label="备用联系电话"
            placeholder="请填写"
            input-align="right"
            maxlength="11"
        />
        <div class="btn-box" style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="setBase">保存</van-button>
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
        v-model="showChoiceRole"
        position="bottom"
        :style="{ height: '40%' }">
        <van-picker :columns="types"
            :default-index="0" 
            show-toolbar
            @cancel="showChoiceRole = false"
            @confirm="onConfirm"
            />
        </van-popup>

        <van-popup
            v-model="showAddress"
            position="bottom"
            :style="{ height: '50%' }"
            >
            <van-area 
            columns-num='3'
            @cancel="showAddress = false"
            @confirm="confirm2"
            :area-list="areaList" 
            value="" />
        </van-popup>

    </div>
</template>

<script>

import { getBase, setBase, getSchoolList,getAreaList } from '../api/request'
import { stringCheck, getBirthdayFromIdCard} from '../util/util'
import moment from 'moment'
import { Toast } from 'vant';

    export default {
        data(){
            return {
                address:'',
                provinceName:'',
                cityName:'',
                countyName:'',
                provinceCode:'',
                cityCode:'',
                countyCode:'',
                areaList:{
                    province_list: {},
                    city_list: {},
                    county_list: {},
                },
                showAddress:false,
                showTypePicker: false,
                showGradePicker: false,
                showClassPicker: false,
                gradeType: '',
                grade: '',
                className: '',
                domicileLocation: '',
                showPicker: false,
                minDate: new Date(1920, 0, 1),
                maxDate: new Date(2025, 10, 1),
                currentDate: new Date(),
                showCalendar: false,
                showSchool: false,
                sex: '',
                name: '',
                school: '',
                birthday: '',
                idCardNo: '',
                emergencyTel: '',
                standbyTel: '',
                user: {
                    token: '',
                    personId: '',
                },
                searchText: '',
                schoolList: [],
                schoolId: '',
                datas:{},
                roleType:'',
                showChoiceRole:false,
                types:[
                    {
                        text:'教职工',
                        type:3
                    },
                    {
                        text:'保安',
                        type:4
                    },
                    {
                        text:'食堂人员',
                        type:5
                    },
                    {
                        text:'物业人员',
                        type:6
                    },
                ],
                personType:'',
            }
        },
       
        async created() {
            let type = this.$route.query.roleType;
            if(type != undefined){
                this.roleType = type
                this.personType = this.type(type)
            }
            let datas =  JSON.parse(localStorage.getItem("detailList"))
            if(datas){
                this.datas = datas;
                this.user.token = datas.token;
                this.user.personId = datas.personId;
                this.idCardNo = datas.idCardNo
                this.school = datas.schoolName
                if(datas.type != ''){
                    this.roleType = datas.type
                    this.personType = this.type(datas.type)
                }
            }
            let res =  await getAreaList()
            if(res.success){
                res.detail&&res.detail.province.forEach(item =>{
                 this.areaList.province_list[item.areaCode] = item.areaName
                })
                res.detail&&res.detail.city.forEach(item =>{
                 this.areaList.city_list[item.areaCode] = item.areaName
                })
                res.detail&&res.detail.county.forEach(item =>{
                 this.areaList.county_list[item.areaCode] = item.areaName
                })
            }else{
                Toast.fail(res.description);
            }
        },
        methods:{
            type(type){
                if(type == 3) return '教职工'
                if(type == 4) return '保安'
                if(type == 5) return '食堂人员'
                if(type == 6) return '物业人员'
            },
            onConfirm(value) {
                console.log(value);
                this.personType = value.text;
                this.roleType = value.type;
                this.showChoiceRole = false;
            },
            confirm2(value){
                this.provinceName = value[0].name ||'';
                this.provinceCode = value[0].code ||'';
                this.cityName =  value[1].name ||'';
                this.cityCode =  value[1].code ||'';
                this.countyName =  value[2]&&value[2].name||'' ;
                this.countyCode =  value[2]&&value[2].code||'' ;
                this.address = this.provinceName + ' ' + this.cityName + ' ' + this.countyName
                this.showAddress = false
            },

            confirm1(value){
                this.birthday = moment(value).format('YYYY-MM-DD');
                this.showCalendar = false
            },
           
            async getBase(){
                 let res = await getBase({
                    personId: this.user.personId,
                    token: this.user.token,
                })
                if(res.success){
                    this.name = res.detail.name
                    this.sex = res.detail.sex+''
                    this.birthday = !res.detail.birthday?getBirthdayFromIdCard(this.idCardNo):res.detail.birthday
                    this.domicileLocation = res.detail.domicileLocation
                    this.emergencyTel = res.detail.emergencyTel
                    this.standbyTel = res.detail.standbyTel
                    this.schoolId = res.detail.schoolId
                    this.provinceName = res.detail.provinceName
                    this.cityName = res.detail.cityName
                    this.countyName = res.detail.countyName
                    this.provinceCode = res.detail.provinceCode
                    this.cityCode = res.detail.cityCode
                    this.countyCode = res.detail.countyCode
                    this.address = res.detail.provinceName+' '+res.detail.cityName+' '+res.detail.countyName
                    // this.currentDate = new Date(res.detail.birthday)
                }else{
                    Toast.fail(res.description);
                }
            },
            async setBase(){
                if(stringCheck(this.name)){
                    Toast('姓名不能为空');
                    return
                }
                if(stringCheck(this.sex)){
                    Toast('性别不能为空');
                    return
                }
                if(stringCheck(this.birthday)){
                    Toast('出生日期不能为空');
                    return
                }
                if(stringCheck(this.personType)){
                    Toast('人员类型不能为空');
                    return
                }
                if(stringCheck(this.domicileLocation)){
                    Toast('具体地址不能为空');
                    return
                }
                if(stringCheck(this.emergencyTel)){
                    Toast('主要联系电话不能为空');
                    return
                }
               
                let param = {
                    personId: this.user.personId,
                    personType: this.roleType,
                    token: this.user.token,
                    name: this.name,
                    sex: this.sex,
                    birthday: this.birthday,
                    domicileLocation: this.domicileLocation,
                    emergencyTel: this.emergencyTel,
                    standbyTel: this.standbyTel,
                    provinceCode : this.provinceCode,
                    cityCode :  this.cityCode,
                    countyCode :  this.countyCode,
                    provinceName : this.provinceName,
                    cityName : this.cityName,
                    countyName : this.countyName
                }
                let res = await setBase(param)
                if(res.success){
                   Toast.success('提交成功');
                   setTimeout(() => {
                       window.history.go(-1)
                   }, 2000);
                }else{
                    Toast.fail(res.description);
                }
            },

           
        },
        mounted() { 
            this.getBase()
        } 

    }
</script>

<style lang="less">
.teacher-info{
    .van-red{
        .van-cell__value{
            color: red;
        }
    }
    .van-field__label{
        width: 120px;
    }
}
    
</style>