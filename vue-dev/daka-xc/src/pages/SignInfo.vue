<template>
    <div class="home wrapper" ref="wrapper"> 
        <van-radio-group v-model="currentAddressType">
            <van-cell-group title="当日居住情况">
                <van-cell title="西昌市（市内）" clickable @click="currentAddressType = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="市外州内（凉山州内西昌市外）" clickable @click="currentAddressType = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
                 <van-cell title="州外省内（四川省内凉山州外）" clickable @click="currentAddressType = '3'">
                    <van-radio slot="right-icon" name="3" />
                </van-cell>
                <van-cell title="省外（湖北、浙江、广东、河南、湖南、江西、重庆、安徽、北京、海南）" clickable @click="currentAddressType = '4'">
                    <van-radio slot="right-icon" name="4" />
                </van-cell>
                <van-cell title="省外（其他省份+国外）" clickable @click="currentAddressType = '5'">
                    <van-radio slot="right-icon" name="5" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <van-cell-group title="当日居住地实际居住地（精确至门牌号）">
            <van-field
                readonly
                clickable
                name="address"
                :value="address"
                label="省市区"
                placeholder="点击选择地区"
                input-align="right"
                is-link
                @click="showAddress = true"
            />
            <van-field
                v-model="currentAddress"
                rows="3"
                autosize
                maxlength="100"
                show-word-limit
                label="具体地址"
                type="textarea"
                placeholder="街道（例：XX街102号5栋1单元502号）"
            />
        </van-cell-group>
        <van-radio-group v-model="temperatureState" >
            <van-cell-group title="当日体温情况">
                <van-cell title="正常（37.3℃及以下）" clickable @click="temperatureState = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="低烧（37.3℃至38.5℃）" clickable @click="temperatureState = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
                 <van-cell title="高烧（38.5℃及以上）" clickable @click="temperatureState = '3'">
                    <van-radio slot="right-icon" name="3" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <van-radio-group v-model="symptoms" v-show="temperatureState!=1">
            <van-cell-group title="表现症状">
                <van-cell title="咳嗽、乏力等不适症状" clickable @click="symptoms = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="无其他明显症状" clickable @click="symptoms = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <van-radio-group v-model="isToHospital" v-show="temperatureState!=1">
            <van-cell-group title="是否就医检查">
                <van-cell title="是" clickable @click="isToHospital = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="否" clickable @click="isToHospital = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>

         <van-field
            v-show="(temperatureState!=1)&&(isToHospital==1)"
            readonly
            clickable
            name="checkTime"
            :value="checkTime"
            label="检查时间"
            placeholder="点击选择日期"
            input-align="right"
            is-link
            @click="showCheckTime = true"
            />
        <van-radio-group v-if="(temperatureState!=1)&&(isToHospital==1)">
            <van-cell-group title="检查结果">
               <van-field
                    v-model="checkResult"
                    rows="3"
                    autosize
                    type="textarea"
                    placeholder="请填写"
                    />
            </van-cell-group>
        </van-radio-group>
      
        <van-radio-group v-model="isTouchIllness" >
            <van-cell-group :title='isTouchIllnessText'>
                <van-cell title="无" clickable @click="isTouchIllness = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
                <van-cell title="有" clickable @click="isTouchIllness = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <van-field
            v-if="isTouchIllness==1"
            readonly
            clickable
            name="calendar"
            :value="touchIllnessDate"
            label="接触时间"
            placeholder="点击选择日期"
            input-align="right"
            is-link
            @click="showTouchIllCalendar = true"
            />
        <van-radio-group v-model="isTouchEpicentersPerson" >
            <van-cell-group :title="isTouchEpicentersPersonText">
                <van-cell title="无" clickable @click="isTouchEpicentersPerson = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
                <van-cell title="有" clickable @click="isTouchEpicentersPerson = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <van-field
            v-show="isTouchEpicentersPerson==1"
            readonly
            clickable
            name="calendar"
            :value="touchEpicentersPersonDate"
            label="接触时间"
            placeholder="点击选择日期"
            input-align="right"
            is-link
            @click="showTouchCalendar = true"
            />
         <van-radio-group  v-show="isTouchEpicentersPerson==1">
            <van-cell-group title="接触人员所在区域">
               <van-field
                    v-model="epicentersPersonRegion"
                    rows="3"
                    autosize
                    type="textarea"
                    placeholder="请填写"
                    />
            </van-cell-group>
        </van-radio-group>
        <div v-show="temperatureState!=1">
            <van-radio-group v-model="isRecordInCommunity" >
                <van-cell-group title="相关情况是否到社区进行备案">
                    <van-cell title="未备案" clickable @click="isRecordInCommunity = '0'">
                        <van-radio slot="right-icon" name="0" />
                    </van-cell>
                    <van-cell title="已备案" clickable @click="isRecordInCommunity = '1'">
                        <van-radio slot="right-icon" name="1" />
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
            <van-field
                v-show="isRecordInCommunity==1"
                readonly
                clickable
                name="calendar"
                :value="recordDate"
                label="备案时间"
                placeholder="点击选择日期"
                input-align="right"
                is-link
                @click="showRecordCalendar = true"
            />
        </div>
         <van-radio-group v-model="hasHealthCard">
            <van-cell-group title="是否有健康卡">
                <van-cell title="是" clickable @click="hasHealthCard = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="否" clickable @click="hasHealthCard = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <div>
            <van-radio-group v-model="isolationType" >
                <van-cell-group title="隔离方式">
                    <van-cell title="不需要隔离，不需要观察" clickable @click="isolationType = '0'">
                        <van-radio slot="right-icon" name="0" />
                    </van-cell>
                    <van-cell  title="居家隔离" clickable @click="isolationType = '1'">
                        <van-radio slot="right-icon" name="1" />
                    </van-cell>
                    <van-cell  title="集中隔离" clickable @click="isolationType = '2'">
                        <van-radio slot="right-icon" name="2" />
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
            <van-field
                readonly
                clickable
                v-show="isolationType != 0"
                name="calendar"
                :value="isolationDate"
                label="隔离时段"
                placeholder="点击选择"
                input-align="right"
                is-link
                @click="showIsolationDate = true"
                />
        </div>

        <van-radio-group>
            <van-cell-group title="备注">
               <van-field
                    maxlength="100"
                    show-word-limit
                    v-model="remarks"
                    rows="3"
                    autosize
                    type="textarea"
                    placeholder="如有未尽事宜，请填写"
                    />
            </van-cell-group>
        </van-radio-group>
        <div class="btn-box" style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="save">提交</van-button>
        </div>

        <van-popup
            v-model="showSchool"
            position="bottom"
            :style="{ height: '80%' }"
            >
        </van-popup>
       <van-calendar v-model="showCheckTime" 
        :min-date="minDate1"
        :max-date="maxDate1"
        @confirm="onConfirm1" />
       <van-calendar v-model="showTouchCalendar" 
        :min-date="minDate3"
        :max-date="maxDate3"
       @confirm="onConfirm3" />
       <van-calendar v-model="showTouchIllCalendar" 
        :min-date="minDate3"
        :max-date="maxDate3"
       @confirm="onConfirm6" />
       <van-calendar v-model="showRecordCalendar"
        :min-date="minDate4"
        :max-date="maxDate4"
        @confirm="onConfirm4" />
       <van-calendar v-model="showIsolationDate" 
        :min-date="minDate5"
        :max-date="maxDate5"
       type="range" @confirm="onConfirm5" />
        <van-popup
            v-model="showAddress"
            position="bottom"
            :style="{ height: '50%' }"
            >
            <van-area 
            columns-num='3'
            @cancel="showAddress = false"
            @confirm="confirm7"
            :area-list="areaList" 
            value="110101" />
        </van-popup>
    </div>
</template>

<script>

import {getAppoint, punch,getAreaList,agentPunch} from '../api/request'
import {getQueryString, formatDate1, dateToStep, getBeforeDate,getBeforeDate1, stringCheck} from '../util/util'
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
                currentAddress: '',
                showAddress:false,
                showTypePicker: false,
                showGradePicker: false,
                showClassPicker: false,
                showCheckTime: false,
                showIsolationDate: false,
                showTouchCalendar: false,
                showRecordCalendar: false,
                showTouchIllCalendar: false,
                minDate: new Date(1920, 0, 1),
                maxDate: new Date(2025, 10, 1),
                minDate1: new Date(2020, 0, 1),
                maxDate1: new Date(),
                minDate3: new Date(2020, 2, 5),
                maxDate3: new Date(),
                minDate4: new Date(2020, 0, 1),
                maxDate4: new Date(),
                minDate5: new Date(2020, 0, 1),
                maxDate5: new Date(2020, 11, 31),
                dateTitle: '',
                currentAddressType: '',
                temperatureState: '',
                currentAddress: '',
                isToHospital: '',
                symptoms:'',
                touchIllnessDate: '',
                currentDate: new Date(),
                showSchool: false,
                radio: '1',
                name: '',
                school: '',
                birthday: '',
                checkTime: '',
                checkResult: '',
                idCardNo: '',
                isolationDate: '',
                isTouchEpicentersPerson: '',
                isTouchIllness: '',
                touchEpicentersPersonDate: '',
                epicentersPersonRegion: '',
                isRecordInCommunity: '',
                recordDate: '',
                isolationType: '',
                remarks: '',
                base:{
                    completeBase: false,
                    completeCustody: false,
                    completeTraffic: true
                },
                user: {
                    token: '',
                    personId: '',
                    schoolId: ''
                },
                isolationStartDate: '',
                isolationEndDate: '',
                isTouchIllnessText: '，是否与"新型冠状病毒肺炎"确诊病例或疑似病例有接触史',
                isTouchEpicentersPersonText:'，是否与疫情严重地区（湖北、浙江、广东、河南、湖南、江西、重庆、安徽、北京、海南）人员有接触史',
                dateText: '近14日内',
                disabled:false,
                hasHealthCard:''

            }
        },
        computed:{
            // minDate3: function(){
            //       return new Date(getBeforeDate(13))
            // }
        },
        async created() {
            let datas =  JSON.parse(localStorage.getItem("detailList"))
            if(datas) {
                this.user.token = datas.token;
                this.user.personId = datas.personId;
                this.user.schoolId = datas.schoolId;
            }
            let a = getQueryString("date")
            // console.log(getBeforeDate(13))
            if(!getQueryString("date")){
                this.dateText = '近14日（'+ getBeforeDate(13) + '以后）'
            }
            // this.hasInEpicentersText = this.dateText + this.hasInEpicentersText
            this.isTouchIllnessText = this.dateText + this.isTouchIllnessText
            this.isTouchEpicentersPersonText = this.dateText + this.isTouchEpicentersPersonText
            let res =  await getAreaList()
            if(res.success){
                res.detail&&res.detail.province.forEach(item =>{
                 this.areaList.province_list[item.areaCode] = item.areaName
                })
                res.detail&&res.detail.city.forEach(item =>{
                 this.areaList.city_list[item.areaCode] = item.areaName
                })
                res.detail.county&&res.detail.county.forEach(item =>{
                 this.areaList.county_list[item.areaCode] = item.areaName
                })
            }else{
                Toast.fail(res.description);
            }
            
        },
        methods:{
            confirm7(value){
                this.provinceName = value[0].name ;
                this.provinceCode = value[0].code ;
                this.cityName =  value[1].name ;
                this.cityCode =  value[1].code ;
                this.countyName =  value[2] == undefined?'':value[2].name;
                this.countyCode =  value[2] == undefined?'':value[2].code ;
                this.address = value[0].name +' '+ value[1].name +' '+ this.countyName
                this.showAddress = false
            },
            formatDate(date) {
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
           
            onConfirm1(date) {
                this.showCheckTime = false;
                this.checkTime = this.formatDate(date);  
            },
            
            onConfirm3(date) {
                this.showTouchCalendar = false;
                this.touchEpicentersPersonDate = this.formatDate(date);  
            },
            onConfirm6(date) {
                this.showTouchIllCalendar = false;
                this.touchIllnessDate = this.formatDate(date);  
            },
            onConfirm4(date) {
                this.showRecordCalendar = false;
                this.recordDate = this.formatDate(date);  
            },
            onConfirm5(date) {  
                const [start, end] = date;
                this.showIsolationDate = false;
                this.isolationDate = `${this.formatDate(start)} ~ ${this.formatDate(end)}`;
                this.isolationStartDate = `${this.formatDate(start)}`
                this.isolationEndDate = `${this.formatDate(end)}`
            },
          
            async getAppoint(){
                let date = getQueryString('date')
                if(date){
                    let res = await getAppoint({
                        personId: this.user.personId,
                        token: this.user.token,
                        date: getQueryString('date')
                    }) 
                    if(res.success){
                        this.currentAddressType = res.detail.currentAddressType+''
                        this.temperatureState = res.detail.temperatureState+''
                        this.currentAddress = res.detail.currentAddress
                        this.isTouchIllness = res.detail.isTouchIllness+''
                        this.touchIllnessDate = res.detail.touchIllnessDate
                        this.touchEpicentersPersonDate = res.detail.touchEpicentersPersonDate
                        this.epicentersPersonRegion = res.detail.epicentersPersonRegion
                        this.isToHospital = res.detail.isToHospital+''
                        this.checkTime = formatDate1(res.detail.checkTime)
                        this.symptoms = res.detail.symptoms
                        this.checkResult = res.detail.checkResult
                        this.isTouchEpicentersPerson = res.detail.isTouchEpicentersPerson+''
                        this.isRecordInCommunity = res.detail.isRecordInCommunity+''
                        this.recordDate = res.detail.recordDate
                        this.isolationType = res.detail.isolationType+''
                        this.isolationDate = res.detail.isolationStartDate+'~'+res.detail.isolationEndDate
                        this.remarks = res.detail.remarks
                        this.isolationStartDate = res.detail.isolationStartDate
                        this.isolationEndDate = res.detail.isolationEndDate
                        this.provinceName = res.detail.provinceName
                        this.cityName = res.detail.cityName
                        this.countyName = res.detail.countyName
                        this.provinceCode = res.detail.provinceCode
                        this.cityCode = res.detail.cityCode
                        this.countyCode = res.detail.countyCode
                        this.currentAddress = res.detail.currentAddress
                        this.hasHealthCard = res.detail.hasHealthCard + ''
                        this.address = res.detail.provinceName+' '+res.detail.cityName+' '+res.detail.countyName
                    }else{
                        Toast.fail(res.description);
                    }

                }
            },
           async save(){
               if(stringCheck(this.currentAddressType)){
                   return Toast.fail("请选择当日居住请況");
               }
               if(stringCheck(this.address)){
                   return Toast.fail("请选择省市区");
               }
               if(stringCheck(this.currentAddress)){
                   return Toast.fail("请填写具体地址");
               }
               if(stringCheck(this.temperatureState)){
                   return Toast.fail("请选择当日体温请況");
               }
               if(this.temperatureState==2||this.temperatureState==3){
                   if(stringCheck(this.symptoms)){
                       return Toast.fail("请选择表现症状");
                   }
                   if(stringCheck(this.isToHospital)){
                       return Toast.fail("请选择是否就医检查");
                   }
                   if(this.isToHospital==1){
                        if(stringCheck(this.checkTime)){
                            return Toast.fail("请选择检查时间");
                        }
                        if(stringCheck(this.checkResult)){
                            return Toast.fail("请填写检查结果");
                        }
                   }
                   
               }
               if(stringCheck(this.isTouchIllness)){
                   return Toast.fail("请选择近14日接触史");
               }
               if(this.isTouchIllness == 1){
                   if(stringCheck(this.touchIllnessDate)){
                       return Toast.fail("请填写接触时间");
                   }
               }
               if(stringCheck(this.isTouchEpicentersPerson)){
                   return Toast.fail("请选择近14日接触史");
               }
               if(this.isTouchEpicentersPerson == 1){
                   if(stringCheck(this.touchEpicentersPersonDate)){
                       return Toast.fail("请填写接触时间");
                   }
                   if(stringCheck(this.epicentersPersonRegion)){
                       return Toast.fail("请填写接触区域");
                   }
               }
               if((this.temperatureState==2||this.temperatureState==3)){
                   if(stringCheck(this.isRecordInCommunity)){
                        return Toast.fail("请选择是否备案");
                    }
                    if(this.isRecordInCommunity == 1){
                        if(stringCheck(this.recordDate)){
                            return Toast.fail("请填写备案时间");
                        }
                    }
               }
               if(this.hasHealthCard == ''){
                   return Toast.fail("请选择是否有健康卡");
               }
               if(stringCheck(this.isolationType)){
                   return Toast.fail("请选择隔离方式");
               }
               if(this.isolationType == 1||this.isolationType == 2){
                   if(stringCheck(this.isolationDate)){
                       return Toast.fail("请填写隔离时段");
                   }
               }
                let studentId = getQueryString('studentId')
                let params = {
                    personId: this.user.personId,
                    token: this.user.token,
                    schoolId: this.user.schoolId,
                    currentAddressType: this.currentAddressType,
                    currentAddress: this.currentAddress,
                    temperatureState: this.temperatureState,
                    isToHospital: this.temperatureState!=1?this.isToHospital:'',
                    isTouchIllness: this.isTouchIllness,
                    isTouchEpicentersPerson: this.isTouchEpicentersPerson,
                    isRecordInCommunity: this.temperatureState!=1?this.isRecordInCommunity:'',
                    isolationType: this.isolationType,
                    touchIllnessDate: this.isTouchIllness==1?this.touchIllnessDate:'',
                    touchEpicentersPersonDate: this.isTouchEpicentersPerson==1?this.touchEpicentersPersonDate:'',
                    recordDate: this.isRecordInCommunity==1?this.recordDate:'',
                    isolationStartDate: this.isolationType != 0?this.isolationStartDate:'',
                    isolationEndDate: this.isolationType != 0?this.isolationEndDate:'',
                    epicentersPersonRegion: this.isTouchEpicentersPerson==1?this.epicentersPersonRegion:'',
                    checkTime: this.temperatureState!=1&&this.isToHospital==1?this.checkTime:'',
                    checkResult: this.temperatureState!=1&&this.isToHospital==1?this.checkResult:'',
                    symptoms: this.temperatureState!=1?this.symptoms:'',
                    remarks: this.remarks,
                    currentAddress: this.currentAddress,
                    provinceCode : this.provinceCode,
                    cityCode :  this.cityCode,
                    countyCode :  this.countyCode,
                    provinceName : this.provinceName,
                    cityName : this.cityName,
                    countyName : this.countyName,
                    hasHealthCard : this.hasHealthCard
                }
                if(studentId){
                    params.studentId = studentId
                } 
               console.log({params});
               let res
               if(studentId){
                    res = await agentPunch(params)
               }else{
                    res = await punch(params)
               }
                if(res.success){
                    Toast.success('提交成功');
                    setTimeout(() =>{
                        if(studentId){
                            this.$router.go(-1)
                        }else{
                            this.$router.push({path:"/home"})
                        }
                    },1000)
                }else{
                    Toast.fail(res.description);
                }
           }
            
        },
        mounted() { 
            this.getAppoint()
            // setTimeout(() => {
            //     document.documentElement.scrollTop = 0
            // }, 0);
        } 

    }
</script>

<style lang="less">
    .van-red{
        .van-cell__value{
            color: red;
        }
    }
    .van-field__label{
        width: 120px;
    }
    .btn-box{
        margin-top: 40px!important;
    }
    .van-cell-relation{
        .van-field{
            padding-right: 0;
        }
    }
</style>