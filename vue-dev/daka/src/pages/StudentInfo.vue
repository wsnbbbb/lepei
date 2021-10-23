<template>
    <div class="home wrapper" ref="wrapper">

        <van-field
            v-model="name"
            clearable
            name="姓名"
            label="姓名"
            placeholder="请填写"
            input-align="right"
            :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field name="sex" label="性别" input-align="right">
            <van-radio-group v-model="sex" direction="horizontal" slot="input">
                <van-radio name="1">男</van-radio>
                <van-radio name="2">女</van-radio>
            </van-radio-group>
        </van-field>
        <van-field label="身份证号码" v-model="idCardNo" disabled input-align="right" />
        <van-field
            readonly
            clickable
            name="calendar"
            v-model="birthday"
            label="出生日期"
            placeholder="点击选择日期"
            input-align="right"
            is-link
            @click="showCalendar = true"
            />
        <van-field label="人员类型" :value="roleType!=0?type(roleType):personType" disabled input-align="right" />
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
            @click="onSearch"
            /> -->
        <van-field
            readonly
            clickable
            name="picker"
            :value="gradeType"
            label="学业阶段"
            placeholder="请选择"
            input-align="right"
            is-link
            @click="showTypePicker = true"
            />
        <van-cell class="van-cell-relation" title="年级" value="内容" label="例：2017年入学，则选择2017级，以入学年份为准" >
            <van-field
                readonly
                clickable
                name="picker"
                :value="grade"
                label=""
                placeholder="请选择"
                input-align="right"
                is-link
                @click="showGradePicker = true"
            />
        </van-cell>   
        <van-field
            readonly
            clickable
            name="picker"
            :value="className"
            label="班级"
            placeholder="请选择"
            input-align="right"
            is-link
            @click="showClassPicker = true"
        />
            
         <van-field
            v-model="headMaster"
            clearable
            name="班主任或导师姓名"
            label="班主任或导师姓名"
            placeholder="请填写"
            input-align="right"
            :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-cell-group title="户籍所在地（精确至门牌号）">
            <van-field
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

        <van-radio-group v-model="custodyType" >
            <van-cell-group title="学生在家学习监护情况">
                <van-cell title="无人监护" clickable @click="custodyType = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="有父母监护" clickable @click="custodyType = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
                 <van-cell title="由父母以外的人监护" clickable @click="custodyType = '3'">
                    <van-radio slot="right-icon" name="3" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>

        <div class="btn-box" style="margin: 16px;">
            <van-button v-if="roleType == 0" round block type="info" @click="setBase(roleType)">保存</van-button>
            <van-button v-if="roleType == 2" round block type="info" @click="setBase(roleType)">保存，并下一步</van-button>
        </div>


        <van-popup
            v-model="showCalendar"
            position="bottom"
            :style="{ height: '50%' }"
            >
            <van-datetime-picker
                @cancel="showCalendar = false"
                @confirm="confirm"
                v-model="currentDate"
                type="date"
                :min-date="minDate"
                :max-date="maxDate"
                />
        </van-popup>
        <!-- <van-popup
            v-model="showSchool"
            position="bottom"
            :style="{ height: '80%' }"
            >
           <van-search
            v-model="searchText"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
            >
            <div slot="action" @click="onSearch">搜索</div>
            </van-search>
            <van-cell-group>
                <van-cell :key="item.id" v-for="item in schoolList" :title="item.name" @click="choose(item.id, item.name)"/>
            </van-cell-group>
        </van-popup> -->
        <van-popup v-model="showTypePicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="arr1"
                @confirm="onConfirmGradeType"
                @cancel="showTypePicker = false"
            />
        </van-popup>
        <van-popup v-model="showGradePicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="arr2"
                @confirm="onConfirmGrade"
                @cancel="showGradePicker = false"
            />
        </van-popup>
         <van-popup v-model="showClassPicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="arr3"
                @confirm="onConfirmClass"
                @cancel="showClassPicker = false"
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
            @confirm="confirm1"
            :area-list="areaList" 
            value="" />
        </van-popup>
    </div>
</template>

<script>

import {getAreaList,getBase, getSchoolList, setBase,getGrade,getGradeList,getClass} from '../api/request'
import {Decrypt} from '../util/secret'
import {getQueryString, stringCheck, getBirthdayFromIdCard} from '../util/util'
import moment from 'moment'
import { Toast, Loading } from 'vant';
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
                searchText: '',
                grade: '',
                className: '',
                domicileLocation: '',
                gradeTypes: [],
                grades: [],
                classes: [],
                showPicker: false,
                minDate: new Date(1920, 0, 1),
                maxDate: new Date(2025, 10, 1),
                currentDate: new Date(),
                showCalendar: false,
                showSchool: false,
                name: '',
                sex: '',
                school: '',
                birthday: '',
                idCardNo: '',
                user: {
                    token: '',
                    personId: '',
                },
                schoolList: [],
                schoolId: '',
                headMaster: '',
                roleType:0,
                datas:{},
                arr1:[],
                gradeTypeId:'',
                arr2:[],
                gradeId:'',
                arr3:[],
                classId:'',
                custodyType:'',
            }
        },
       async created() {
            let type = this.$route.query.roleType;
            if(type != undefined){
                this.roleType = type
            }
            console.log(this.roleType);
            let datas =  JSON.parse(localStorage.getItem("detailList"))
            if(datas){
                this.datas = datas;
                this.user.token = datas.token;
                this.user.personId = datas.personId;
                this.idCardNo = datas.idCardNo;
            }
            getGrade().then(res =>{
                if(res.success){
                    this.gradeTypes = res.detail;
                    res.detail.forEach(item => {
                        this.arr1.push(item.name)
                    })
                }
            })
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
        computed:{
            personType(){
                // 1家长2学生3教师
                let type = this.datas.type;
                if(type == 2) return '学生'
                if(type == 3) return '教师'
            }
        },
        methods:{
             confirm1(value){
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
            getGradeList(){
                let params = {"gradeType":this.gradeTypeId}
                getGradeList(params).then(res =>{
                   if(res.success){
                       this.grades = res.detail;
                       this.arr2 = []
                       this.arr3 = []
                       res.detail.forEach(item => {
                           this.arr2.push(item.name)
                       })
                       this.grade = ''
                       this.className = ''
                   }
               })
            },
            getClass(){
                let params1 = {"gradeId":this.gradeId}
                getClass(params1).then(res =>{
                    if(res.success){
                        this.classes = res.detail;
                        this.arr3 = []
                        res.detail.forEach(item => {
                            this.arr3.push(item.name)
                        });
                        this.className = ''
                    }
                })
            },
            type(type){
                if(type == 2) return '学生'
                if(type == 3) return '教师'
            },
            choose(id, name){
                this.school = name
                this.schoolId = id
                this.showSchool = false
            },
            onSearch() {
                // Toast(this.searchText);
                this.getSchoolList({
                    name: this.searchText
                })
            },
            onCancel() {
                Toast('取消');
            },

            confirm(value){
                this.birthday = moment(value).format('YYYY-MM-DD');
                this.showCalendar = false
            },
            onConfirmGradeType(value){
               let res = this.gradeTypes.filter((item,index) =>{
                   return item.name == value
               })
                this.gradeTypeId = res[0].gradeType;
                this.gradeType = value;
                this.showTypePicker = false
                this.getGradeList()
            },
            onConfirmGrade(value){
                let res = this.grades.filter((item,index) =>{
                   return item.name == value
               })

               this.gradeId = res[0].gradeId;
                this.grade = value
                this.showGradePicker = false
                this.getClass()
            },
            onConfirmClass(value){
                let res = this.classes.filter((item,index) =>{
                   return item.name == value
               })
               this.classId = res[0].classId;
                this.className = value
                this.showClassPicker = false
            },
            async getBase(){
                 let res = await getBase({
                    personId: this.user.personId,
                    token: this.user.token,
                })
                if(res.success){
                    this.name = res.detail.name
                    this.sex = res.detail.sex==0?'':(res.detail.sex+'')
                    this.birthday = !res.detail.birthday?getBirthdayFromIdCard(this.idCardNo):res.detail.birthday
                    this.domicileLocation = res.detail.domicileLocation
                    this.grade = res.detail.gradeName
                    this.gradeId = res.detail.gradeId
                    this.headMaster = res.detail.headMaster
                    this.className = res.detail.className
                    this.classId = res.detail.classId
                    this.school = res.detail.schoolName
                    this.schoolId = res.detail.schoolId
                    this.gradeType = res.detail.gradeTypeName==0?'':res.detail.gradeTypeName,
                    this.gradeTypeId = res.detail.gradeType
                    this.custodyType = res.detail.custodyType + ''
                    this.provinceName = res.detail.provinceName
                    this.cityName = res.detail.cityName
                    this.countyName = res.detail.countyName
                    this.provinceCode = res.detail.provinceCode
                    this.cityCode = res.detail.cityCode
                    this.countyCode = res.detail.countyCode
                    this.address = res.detail.provinceName+' '+res.detail.cityName+' '+res.detail.countyName
                  
                }else{
                    Toast.fail(res.description);
                }
                
            },

            async getSchoolList(param){
                let res = await getSchoolList(param)
                if(res.success){
                    this.schoolList = res.detail
                }else{
                    Toast.fail(res.description);
                }
                // this.searchText = ''
                this.showSchool = true
            },

             async setBase(type){
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
                // if(stringCheck(this.schoolId)){
                //     Toast('学校不能为空');
                //     return
                // }
                if(stringCheck(this.gradeType)){
                    Toast('学业阶段不能为空');
                    return
                }
                if(stringCheck(this.gradeId)){
                    Toast('年级不能为空');
                    return
                }
                if(stringCheck(this.className)){
                    Toast('班级不能为空');
                    return
                }
                if(stringCheck(this.domicileLocation)){
                    Toast('具体地址不能为空');
                    return
                }
                if(stringCheck(this.custodyType)){
                    Toast('监护情况不能为空');
                    return
                }
                let param = {
                    personId: this.user.personId,
                    personType: this.roleType!=0?this.roleType:this.datas.type,
                    token: this.user.token,
                    name: this.name,
                    sex: this.sex,
                    birthday: this.birthday,
                    // schoolId: this.schoolId,
                    domicileLocation: this.domicileLocation,
                    headMaster: this.headMaster,
                    classId: this.classId,
                    custodyType: this.custodyType,
                    provinceCode : this.provinceCode,
                    cityCode :  this.cityCode,
                    countyCode :  this.countyCode,
                    provinceName : this.provinceName,
                    cityName : this.cityName,
                    countyName : this.countyName
                    // gradeType: this.gradeId,
                    // gradeName: this.grade,
                    // classNo: this.classNo
                    
                   
                }
                let res = await setBase(param)
                if(res.success){
                    let detailList = JSON.parse(localStorage.getItem('detailList'))
                    detailList.completeBase = true
                    localStorage.setItem("detailList", JSON.stringify(detailList))
                    if(type == 0){
                        Toast.success('提交成功');
                        setTimeout(() => {
                            window.history.go(-1)
                        }, 2000);
                    }else if(type == 2){
                        this.$router.push({path:"/custody-info",query:{roleType:this.roleType}})
                    }
                }else{
                    Toast.fail(res.description);
                }
            },

        },
        mounted() { 
            // this.getSchoolList({})
            this.getBase()
            
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
    .search-div{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin-top: 20px;
    }
</style>