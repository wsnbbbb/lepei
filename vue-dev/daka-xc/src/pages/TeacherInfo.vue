<template>
    <div class="teacher-info">
        <van-notice-bar text="请确认信息是否正确，如信息非本人信息，请不要做任何操作，联系管理员索取正确的登录账号" left-icon="volume-o" />
        <div class="hintTitle bgColor1">请核对信息</div>
        <div class="userInfo">
            <div class="icon"><van-icon name="contact" /></div>
            <div class="info">
                <p>{{name}}<span class="sex">{{sex==1?'男':(sex==2?'女':'')}}</span>{{personType == 2?'学生':(personType == 3?'教师':'')}}</p>
                <p>{{school}}</p>
                <p v-if="gradeClass != ''">{{gradeClass}}（班主任）</p>
            </div>
        </div>
        <div class="hintTitle bgColor2">请补全信息</div>
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
        <van-radio-group v-model="domicileType">
            <van-cell-group title="户籍所在地类型">
                <van-cell title="西昌市（市内）" clickable @click="domicileType = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="市外州内（凉山州内西昌市外）" clickable @click="domicileType = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
                 <van-cell title="州外省内（四川省内凉山州外）" clickable @click="domicileType = '3'">
                    <van-radio slot="right-icon" name="3" />
                </van-cell>
                <van-cell title="省外（湖北、浙江、广东、河南、湖南、江西、重庆、安徽、北京、海南）" clickable @click="domicileType = '4'">
                    <van-radio slot="right-icon" name="4" />
                </van-cell>
                <van-cell title="省外（其他省份+国外）" clickable @click="domicileType = '5'">
                    <van-radio slot="right-icon" name="5" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <van-cell-group title="户籍所在地（精确至门牌号）">
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
import { stringCheck, getBirthdayFromIdCard,getFormatDate } from '../util/util'
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
                domicileLocation: '',
                showPicker: false,
                minDate: new Date(1920, 0, 1),
                maxDate: new Date(2025, 10, 1),
                currentDate: new Date(),
                showCalendar: false,
                sex: '',
                name: '',
                school: '',
                birthday: '',
                user: {
                    token: '',
                    personId: '',
                },
                datas:{},
                roleType:0,
                personType:'',
                gradeClass:'',
                domicileType:''
            }
        },
        computed: {
            personType(){
                // 1家长2学生3教师
                let type = this.datas.type;
                if(type == 1) return '家长'
                if(type == 2) return '学生'
                if(type == 3) return '教职工'
            }
        },
        async created() {
            let type = this.$route.query.roleType;
            if(type && type != undefined){
                this.roleType = type
            }
            let datas =  JSON.parse(localStorage.getItem("detailList"))
            if(datas){
                this.datas = datas;
                this.user.token = datas.token;
                this.user.personId = datas.personId;
                this.name = datas.name
                this.sex = datas.sex + ''
                this.personType = datas.type 
                this.school = datas.schoolName
            }
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
            confirm2(value){
                this.provinceName = value[0].name ;
                this.provinceCode = value[0].code ;
                this.cityName =  value[1].name ;
                this.cityCode =  value[1].code ;
                this.countyName =  value[2] == undefined?'':value[2].name;
                this.countyCode =  value[2] == undefined?'':value[2].code ;
                this.address = value[0].name +' '+ value[1].name +' '+ this.countyName
                this.showAddress = false
            },
            type(type){
                if(type == 1) return '家长'
                if(type == 2) return '学生'
                if(type == 3) return '教师'
            },
           
            // choose(id, name){
            //     this.school = name
            //     this.schoolId = id
            //     this.showSchool = false
            // },
            confirm1(value){
                this.birthday = getFormatDate(value);
                this.showCalendar = false
            },
            async getBase(){
                 let res = await getBase({
                    personId: this.user.personId,
                    token: this.user.token,
                })
                if(res.success){
                    // this.birthday = !res.detail.birthday?getBirthdayFromIdCard(this.idCardNo):res.detail.birthday
                    this.birthday = res.detail.birthday
                    this.domicileLocation = res.detail.domicileLocation
                    this.provinceName = res.detail.provinceName
                    this.cityName = res.detail.cityName
                    this.countyName = res.detail.countyName
                    this.provinceCode = res.detail.provinceCode
                    this.cityCode = res.detail.cityCode
                    this.countyCode = res.detail.countyCode
                    this.domicileType = res.detail.domicileType + ''
                    this.address = res.detail.provinceName+' '+res.detail.cityName+' '+res.detail.countyName
                    this.gradeClass = res.detail.teachClass
                }else{
                    Toast.fail(res.description);
                }
            },
            async setBase(){
               
                if(stringCheck(this.birthday)){
                    Toast('出生日期不能为空');
                    return
                }
                 if(stringCheck(this.provinceName)){
                    Toast.fail('请选择户籍所在地');
                    return
                }
                if(stringCheck(this.domicileLocation)){
                    Toast('具体地址不能为空');
                    return
                }
                let param = {
                    personId: this.user.personId,
                    token: this.user.token,
                    birthday: this.birthday,
                    domicileLocation: this.domicileLocation,
                    provinceCode : this.provinceCode,
                    cityCode :  this.cityCode,
                    countyCode :  this.countyCode,
                    provinceName : this.provinceName,
                    cityName : this.cityName,
                    countyName : this.countyName,
                    domicileType : this.domicileType
                }
                let res = await setBase(param)
                if(res.success){
                   Toast.success('提交成功');
                   setTimeout(() => {
                      this.$router.push({path:"/home"})
                   }, 1000);
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
    .hintTitle{
        height:2.1875rem;
        line-height:2.1875rem;
        text-align: center;
        color:#fff;
        margin:10px 0;
    }
    .bgColor1{
        width:6.25rem;
        background-color: #F07930;
    }
    .bgColor2{
        width:6.25rem;
        background-color: #58C556;
    }
    .userInfo{
        width:100%;
        background-color: #F7F5F5;
        display: flex;
        align-items: center;
        padding:10px 0;
        .icon{
            width:25%;
            text-align: center;
            font-size: 32px;
        }
        .info{
            width:70%;
            p{
                &:nth-child(2){
                    margin:10px 0;
                }
            }
           .sex{
               margin:1.875rem;
           }
        }
    }
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