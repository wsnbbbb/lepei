<template>
    <div class="home wrapper" ref="wrapper">
        <van-radio-group v-model="currentInChengdu" >
            <van-cell-group title="当日居住区情况">
                <van-cell title="成都（大成都范围内）" clickable @click="currentInChengdu = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="省内（除成都以外地区）" clickable @click="currentInChengdu = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
                 <van-cell title="省外（高风险地区）" clickable @click="currentInChengdu = '3'">
                    <van-radio slot="right-icon" name="3" />
                </van-cell>
                <van-cell title="省外（中风险地区）" clickable @click="currentInChengdu = '4'">
                    <van-radio slot="right-icon" name="4" />
                </van-cell>
                <van-cell title="省外（低风险地区）" clickable @click="currentInChengdu = '5'">
                    <van-radio slot="right-icon" name="5" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        
        <van-field
            v-show="currentInChengdu!=1"
            readonly
            clickable
            name="dateToBack"
            :value="dateToBack"
            label="计划返回成都时间"
            placeholder="点击选择日期"
            input-align="right"
            is-link
            @click="showCalendar = true"
            />
       
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
                disabled
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
      
        <van-radio-group v-model="hasInEpicenters" >
            <van-cell-group :title="hasInEpicentersText">
                <van-cell title="无" clickable @click="hasInEpicenters = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
                <van-cell title="有" clickable @click="hasInEpicenters = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <van-field
            v-if="hasInEpicenters==1"
            readonly
            clickable
            name="calendar"
            :value="stayDate"
            label="开始-结束时间"
            placeholder="点击选择"
            input-align="right"
            is-link
            @click="showStayDate = true"
            />
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
        <div v-show="temperatureState!=1||hasInEpicenters==1">
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
        <div v-show="temperatureState!=1||hasInEpicenters==1">
            <van-radio-group v-model="isolationType" >
                <van-cell-group title="隔离方式">
                    <van-cell title="居家隔离" clickable @click="isolationType = '1'">
                        <van-radio slot="right-icon" name="1" />
                    </van-cell>
                    <van-cell title="集中隔离" clickable @click="isolationType = '2'">
                        <van-radio slot="right-icon" name="2" />
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
            <van-field
                readonly
                clickable
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
                    placeholder="请填写"
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
       <van-calendar v-model="showCalendar" @confirm="onConfirm" />
       <van-calendar v-model="showCheckTime" 
        :min-date="minDate1"
        :max-date="maxDate1"
        @confirm="onConfirm1" />
       <van-calendar v-model="showStayDate" 
        :min-date="minDate2"
        :max-date="maxDate2"
       type="range" @confirm="onConfirm2" />
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
import {getQueryString, formatDate1, dateToStep, getBeforeDate} from '../util/util'
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
                showStayDate: false,
                showIsolationDate: false,
                showTouchCalendar: false,
                showRecordCalendar: false,
                showTouchIllCalendar: false,
                minDate: new Date(1920, 0, 1),
                maxDate: new Date(2025, 10, 1),
                minDate1: new Date(2020, 0, 1),
                maxDate1: new Date(),
                minDate2: new Date(2020, 0, 1),
                maxDate2: new Date(),
                minDate3: new Date(2020, 1, 15),
                maxDate3: new Date(),
                minDate4: new Date(2020, 0, 1),
                maxDate4: new Date(),
                minDate5: new Date(2020, 0, 1),
                maxDate5: new Date(2020, 8, 1),
                dateTitle: 'erere',
                currentInChengdu: '1',
                temperatureState: '1',
                currentAddress: '',
                dateToBack: '',
                isToHospital: '',
                symptoms:'',
                hasInEpicenters: '',
                touchIllnessDate: '',
                currentDate: new Date(),
                showCalendar: false,
                showSchool: false,
                radio: '1',
                name: '',
                school: '',
                birthday: '',
                checkTime: '',
                checkResult: '',
                idCardNo: '',
                stayDate: '',
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
                stayStartDate: '',
                stayEndDate: '',

                hasInEpicentersText: '，是否有疫情中高风险地区旅行或居住史',
                isTouchIllnessText: '，是否与"新型冠状病毒肺炎"确诊病例或疑似病例有接触史',
                isTouchEpicentersPersonText:'，是否有疫情中高风险地区人员有接触史',
                dateText: '近14日内',
                disabled:false,

            }
        },
        async created() {
            let datas =  JSON.parse(localStorage.getItem("detailList"))
            this.user.token = datas.token;
            this.user.personId = datas.personId;
            this.user.schoolId = datas.schoolId;
            let a = getQueryString("date")
            console.log(getBeforeDate(13))
            if(!getQueryString("date")){
                this.dateText = '近14日（'+ getBeforeDate(13) + '以后）'
            }
            this.hasInEpicentersText = this.dateText + this.hasInEpicentersText
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
                res.detail&&res.detail.county.forEach(item =>{
                 this.areaList.county_list[item.areaCode] = item.areaName
                })
            }else{
                Toast.fail(res.description);
            }
        },
        methods:{
            confirm7(value){
                console.log(value);
                this.provinceName = value[0].name ||'';
                this.provinceCode = value[0].code ||'';
                this.cityName =  value[1].name ||'';
                this.cityCode =  value[1].code ||'';
                this.countyName =  value[2]&&value[2].name||'' ;
                this.countyCode =  value[2]&&value[2].code||'' ;
                this.address = this.provinceName + ' ' + this.cityName + ' ' + this.countyName
                this.showAddress = false
            },
            formatDate(date) {
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
            onConfirm(date) {
                this.showCalendar = false;
                this.dateToBack = this.formatDate(date);  
                console.log(this.birthday)
            },
            onConfirm1(date) {
                this.showCheckTime = false;
                this.checkTime = this.formatDate(date);  
            },
            onConfirm2(date) {  
                const [start, end] = date;
                this.showStayDate = false;
                this.stayDate = `${this.formatDate(start)} ~ ${this.formatDate(end)}`;
                this.stayStartDate = `${this.formatDate(start)}`
                this.stayEndDate = `${this.formatDate(end)}`
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
            confirm(value){
                this.birthday = moment(value).format('YYYY-MM-DD');
                this.showCalendar = false
            },
            onConfirmGradeType(value){
                this.gradeType = value
                this.showTypePicker = false
            },
            onConfirmGrade(value){
                this.grade = value
                this.showGradePicker = false
            },
            onConfirmClass(value){
                this.className = value
                this.showClassPicker = false
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
                        this.currentInChengdu = res.detail.currentInChengdu+''
                        this.temperatureState = res.detail.temperatureState+''
                        this.currentAddress = res.detail.currentAddress
                        this.isTouchIllness = res.detail.isTouchIllness+''
                        this.touchIllnessDate = res.detail.touchIllnessDate
                        this.touchEpicentersPersonDate = res.detail.touchEpicentersPersonDate
                        this.epicentersPersonRegion = res.detail.epicentersPersonRegion
                        this.dateToBack = res.detail.dateToBack
                        this.isToHospital = res.detail.isToHospital+''
                        this.checkTime = formatDate1(res.detail.checkTime)
                        this.symptoms = res.detail.symptoms
                        this.checkResult = res.detail.checkResult
                        this.hasInEpicenters = res.detail.hasInEpicenters+''
                        this.stayDate = res.detail.stayStartDate+'~'+res.detail.stayEndDate
                        this.isTouchEpicentersPerson = res.detail.isTouchEpicentersPerson+''
                        this.isRecordInCommunity = res.detail.isRecordInCommunity+''
                        this.recordDate = res.detail.recordDate
                        this.isolationType = res.detail.isolationType+''
                        this.isolationDate = res.detail.isolationStartDate+'~'+res.detail.isolationEndDate
                        this.remarks = res.detail.remarks
                        this.isolationStartDate = res.detail.isolationStartDate
                        this.isolationEndDate = res.detail.isolationEndDate
                        this.stayStartDate = res.detail.stayStartDate
                        this.stayEndDate = res.detail.stayEndDate
                        this.provinceName = res.detail.provinceName
                        this.cityName = res.detail.cityName
                        this.countyName = res.detail.countyName
                        this.provinceCode = res.detail.provinceCode
                        this.cityCode = res.detail.cityCode
                        this.countyCode = res.detail.countyCode
                        this.currentAddress = res.detail.currentAddress
                        this.address = res.detail.provinceName+' '+res.detail.cityName+' '+res.detail.countyName
                    }else{
                        Toast.fail(res.description);
                    }

                }

                
            },

            
           async save(){
                let studentId = getQueryString('studentId')
                let params = {
                    personId: this.user.personId,
                    token: this.user.token,
                    schoolId: this.user.schoolId,
                    currentInChengdu: this.currentInChengdu,
                    currentAddress: this.currentAddress,
                    dateToBack: this.currentInChengdu!=1?this.dateToBack:'',
                    temperatureState: this.temperatureState,
                    isToHospital: this.temperatureState!=1?this.isToHospital:'',
                    hasInEpicenters: this.hasInEpicenters,
                    isTouchIllness: this.isTouchIllness,
                    isTouchEpicentersPerson: this.isTouchEpicentersPerson,
                    isRecordInCommunity: this.temperatureState!=1||this.hasInEpicenters==1?this.isRecordInCommunity:'',
                    isolationType: this.temperatureState!=1||this.hasInEpicenters==1?this.isolationType:'',
                    stayStartDate: this.hasInEpicenters==1?this.stayStartDate:'',
                    stayEndDate: this.hasInEpicenters==1?this.stayEndDate:'',
                    touchIllnessDate: this.isTouchIllness==1?this.touchIllnessDate:'',
                    touchEpicentersPersonDate: this.isTouchEpicentersPerson==1?this.touchEpicentersPersonDate:'',
                    recordDate: this.isRecordInCommunity==1?this.recordDate:'',
                    isolationStartDate: this.temperatureState!=1||this.hasInEpicenters==1?this.isolationStartDate:'',
                    isolationEndDate: this.temperatureState!=1||this.hasInEpicenters==1?this.isolationEndDate:'',
                    epicentersPersonRegion: this.isTouchEpicentersPerson==1?this.epicentersPersonRegion:'',
                    // checkTime: dateToStep(this.checkTime),
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
                    countyName : this.countyName
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