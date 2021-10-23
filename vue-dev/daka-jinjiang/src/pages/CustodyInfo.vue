<template>
    <div class="home wrapper" ref="wrapper">
   
    <van-cell-group title="监护人信息">
        <van-field
            v-model="name"
            clearable
            maxlength="30"
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
        <!-- <van-field label="身份证号码" clearable maxlength="18" placeholder="请填写" v-model="idCardNo" input-align="right" />
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
            /> -->

        <van-cell class="van-cell-relation" title="关系" value="内容" label="例：爸爸，妈妈，爷爷，舅舅等" >
            <van-field
                v-model="relation"
                maxlength="30"
                clearable
                name="关系"
                placeholder="请填写"
                input-align="right"
                :rules="[{ required: true, message: '请填写' }]"
            />
        </van-cell>
        <van-field
            v-model="emergencyTel"
            clearable
            name="主要联系电话"
            label="主要联系电话"
            maxlength="11"
            placeholder="请填写"
            input-align="right"
            :rules="[{ required: true, message: '请填写' }]"
        />
        <van-field
            v-model="standbyTel"
            clearable
            name="备用联系电话"
            label="备用联系电话"
            maxlength="11"
            placeholder="请填写"
            input-align="right"
            :rules="[{ required: true, message: '请填写' }]"
        />
       
        </van-cell-group>
        <div class="btn-box" style="margin: 16px;">
            <van-button v-if="roleType == 0" round block type="info" @click="setCustodyBase(roleType)">保存</van-button>
            <van-button v-if="roleType == 2" round block type="info" @click="setCustodyBase(roleType)">保存，并下一步</van-button>
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
      
    </div>
</template>

<script>

import {getCustodyBase, setCustodyBase} from '../api/request'
import {Decrypt} from '../util/secret'
import {getQueryString, stringCheck} from '../util/util'
import moment from 'moment'
import { Toast } from 'vant';
    export default {
        data(){
            return {

                minDate: new Date(1920, 0, 1),
                maxDate: new Date(2025, 10, 1),
                currentDate: new Date(),
                showCalendar: false,
                name: '',
                sex: '',
                school: '',
                birthday: '',
                idCardNo: '',
                relation: '',
                emergencyTel: '',
                standbyTel: '',
                user: {
                    token: '',
                    personId: '',
                },
                roleType:0,
            }
        },
        async created() {
            let type = this.$route.query.roleType;
            if(type != undefined){
                this.roleType = type
            }
            let datas =  JSON.parse(localStorage.getItem("detailList"))
            this.user.token = datas.token;
            this.user.personId = datas.personId;
        },
        methods:{
            confirm(value){
                this.birthday = moment(value).format('YYYY-MM-DD');
                this.showCalendar = false
            },
     
            async getCustodyBase(param){
                let res = await getCustodyBase(param)
                if(res.success){
                    if(res.detail != null){
                        this.name = res.detail.name||''
                        this.sex = (res.detail.sex+'')||''
                        this.relation = res.detail.relation||''
                        this.emergencyTel = res.detail.emergencyTel||''
                        this.standbyTel = res.detail.standbyTel||''
                        // this.idCardNo = res.detail.idCardNo||''
                        // this.birthday = res.detail.birthday||''
                    }
                }else{
                    Toast.fail(res.description);
                }
            },

            
            async setCustodyBase(type){
                if(stringCheck(this.name)){
                    Toast('姓名不能为空');
                    return
                }
                if(stringCheck(this.sex)){
                    Toast('性别不能为空');
                    return
                }
                // if(stringCheck(this.idCardNo)){
                //     Toast('身份证号码不能为空');
                //     return
                // }
                // if(stringCheck(this.birthday)){
                //     Toast('出生日期不能为空');
                //     return
                // }
                if(stringCheck(this.relation)){
                    Toast('关系不能为空');
                    return
                }
                if(stringCheck(this.emergencyTel)){
                    Toast('主要联系电话不能为空');
                    return
                }
                let param = {
                    personId: this.user.personId,
                    token: this.user.token,
                    name: this.name,
                    sex: this.sex,
                    // birthday: this.birthday,
                    relation: this.relation,
                    emergencyTel: this.emergencyTel,
                    standbyTel: this.standbyTel,
                    // idCardNo: this.idCardNo
                }
                let res = await setCustodyBase(param)
                if(res.success){
                    let detailList = JSON.parse(localStorage.getItem('detailList'))
                    detailList.completeCustody = true
                    localStorage.setItem("detailList", JSON.stringify(detailList))
                  
                    if(type == 0){
                        Toast.success('成功');
                           window.history.go(-1)
                    }else if(type == 2){
                        this.$router.push({path:"/traffic-info",query:{type:type}})
                    }
                }else{
                    Toast.fail(res.description);
                }
            }

        },
        mounted() { 
            this.getCustodyBase({ 
                personId: this.user.personId,
                token: this.user.token
            })
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