<template>
    <div class="home wrapper" ref="wrapper">
         <van-field
            clickable
            v-model="name"
            v-show="isSelf!=1"
            label="家庭成员姓名"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            
            />
        <van-field
            clickable
            v-model="relation"
            v-show="isSelf!=1"
            label="关系"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
        />
      
         <van-radio-group v-model="hasLeave">
            <van-cell-group title="寒假假期至今，是否有离开过西昌市">
                <van-cell title="无" clickable @click="hasLeave = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
                <van-cell title="有" clickable @click="hasLeave = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <van-radio-group v-model="hasBack" v-show="hasLeave==1">
            <van-cell-group title="当前是否已返回西昌市" label="描述信息" >
                <van-cell title="已返回" clickable @click="hasBack = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="尚未返回" clickable @click="hasBack = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>

         <van-field
            readonly
            clickable
            name="calendar"
            :value="stayDate"
            label="外出时间段（尚未返回填写预计返回时间）"
            placeholder="点击选择"
            input-align="right"
            is-link
            @click="showStayDate = true"
            v-show="hasLeave==1"
            />

        <van-radio-group v-model="addressType" v-show="hasLeave==1&&hasBack==0">
            <van-cell-group title="目前居住地情况">
                <van-cell title="市外州内（凉山州内西昌市外）" clickable @click="addressType = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="州外省内（四川省内凉山州外）" clickable @click="addressType = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
                 <van-cell title="省外（湖北、浙江、广东、河南、湖南、江西、重庆、安徽、北京、海南）" clickable @click="addressType = '3'">
                    <van-radio slot="right-icon" name="3" />
                </van-cell>
                <van-cell title="省外（其他省份+国外）" clickable @click="addressType = '4'">
                    <van-radio slot="right-icon" name="4" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>

         <van-radio-group v-model="isolationType" v-show="hasLeave==1">
            <van-cell-group title="当前状态">
                <van-cell title="不需要隔离，不需要观察" clickable @click="isolationType = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
                <van-cell title="居家隔离" clickable @click="isolationType = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                 <van-cell title="集中隔离" clickable @click="isolationType = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
                <van-cell title="确诊病例" clickable @click="isolationType = '3'" v-show="hasBack==0">
                    <van-radio slot="right-icon" name="3" />
                </van-cell>
                <van-cell title="疑似病例" clickable @click="isolationType = '4'" v-show="hasBack==0">
                    <van-radio slot="right-icon" name="4" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <van-radio-group v-show="hasLeave==1">
            <van-cell-group title="离开与返回西昌的出行方式">
               <van-field
                    v-model="tripMode"
                    rows="3"
                    autosize
                    maxlength="100"
                    type="textarea"
                    placeholder="私家车、大巴车、火车、飞机等（火车请填写列车车次号码、飞机请填写航班等）"
                    />
            </van-cell-group>
        </van-radio-group>
       
        <div class="btn-box" style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="save">提交</van-button>
        </div>

 
       <van-calendar v-model="showStayDate" 
        :min-date="minDate"
        :max-date="maxDate"
       type="range" @confirm="onConfirm" />
      

    </div>
</template>

<script>

import {addJourningHistory, getJourningDetail} from '../api/request'
import {getQueryString, stringCheck,getFormatDate} from '../util/util'
import { Toast } from 'vant';
    export default {
        data(){
            return {
                user: {
                    token: '',
                    personId: ''
                },
                showStayDate: false,
                
                minDate: new Date(2020, 0, 1),
                maxDate: new Date(2020, 11, 31),
                isSelf: '',
                name: '',
                relation: '',
                hasLeave: '',
                hasBack: '',
                startDate: '',
                endDate: '',
                addressType: '',
                isolationType: '',
                stayStartDate: '',
                stayEndDate: '',
                tripMode: ''
            }
        },
        async created() {
            let datas =  JSON.parse(localStorage.getItem("detailList"))
            if(!datas) return
            this.user.token = datas.token;
            this.user.personId = datas.personId;
        },
        methods:{
          
            formatDate(date) {
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
 
            onConfirm(date) {  
                const [start, end] = date;
                this.showStayDate = false;
                this.stayDate = `${this.formatDate(start)} ~ ${this.formatDate(end)}`;
                this.stayStartDate = `${this.formatDate(start)}`
                this.stayEndDate = `${this.formatDate(end)}`
            },
    
            confirm(value){
                this.birthday = getFormatDate(value);
                this.showCalendar = false
            },
      
            async getJourningDetail(){
                let id = getQueryString('id')
                if(id){
                    let res = await getJourningDetail({
                        personId: this.user.personId,
                        token: this.user.token,
                        id: getQueryString('id')
                    }) 
                    if(res.success){
                        this.isSelf = res.detail.isSelf + ''
                        this.hasLeave = res.detail.hasLeave + ''
                        this.hasBack = res.detail.hasBack + ''
                        this.addressType = res.detail.addressType==0?'':res.detail.addressType+''
                        this.isolationType = res.detail.isolationType + ''
                        this.relation = res.detail.relation
                        this.name = res.detail.name
                        this.stayStartDate = res.detail.startDate
                        this.stayEndDate = res.detail.endDate
                        this.tripMode = res.detail.tripMode
                        if(res.detail.startDate){
                            this.stayDate = `${this.stayStartDate} ~ ${this.stayEndDate}`;
                        }
                    }else{
                        Toast.fail(res.description);
                    }
                }
            },
            
           async save(){
                if(getQueryString('type')!='self'){
                   if(stringCheck(this.name)){
                        Toast('姓名不能为空');
                        return
                    }
                    if(stringCheck(this.relation)){
                        Toast('关系不能为空');
                        return
                    }
                }
                
                if(stringCheck(this.hasLeave)){
                    Toast('请选择寒假至今是否离开过西昌市');
                    return
                }
                if(this.hasLeave==1){
                    if(stringCheck(this.hasBack)||stringCheck(this.stayStartDate)||stringCheck(this.stayEndDate)||
                    stringCheck(this.isolationType)){
                        Toast('请填写完整');
                        return
                    }
                    if(this.hasBack == 0&&stringCheck(this.addressType)){
                        Toast('请填写完整');
                        return
                    }
                    if(stringCheck(this.tripMode)){
                        Toast('请填写出行方式');
                        return
                    }
                    
                    if(this.hasBack==1&&(this.isolationType==3||this.isolationType==4)){
                        Toast('请选择隔离方式');
                        return
                    }

                  
                }
                
               let params = {
                    personId: (this.user&&this.user.personId)||'',
                    token: (this.user&&this.user.token)||'',
                    name: this.name,
                    hasLeave: this.hasLeave,
               }
               if(this.hasLeave==1){
                    params.isolationType = this.isolationType
                    
                    params.tripMode = this.tripMode
                    params.startDate = this.stayStartDate
                    params.endDate = this.stayEndDate
                    params.hasBack = this.hasBack
               }
               if(this.hasBack==0){
                    params.addressType = this.addressType
               }
               if(getQueryString('id')){
                   params.id = getQueryString('id')
               }
               if(getQueryString('type')!='self'){
                   params.isSelf = 0
                   params.relation = this.relation
               }else{
                   params.isSelf = 1
               }
               console.log({params});
               
                let res = await addJourningHistory(params)
                if(res.success){
                    Toast.success('提交成功');
                    setTimeout(() =>{
                        window.history.go(-1)
                    },1000)
                }else{
                    Toast.fail(res.description);
                }
           }
            
        },
        mounted() { 
            if(getQueryString('type')=='self'){
                this.isSelf = 1
            }else{
                this.isSelf = 0
            }
            if(getQueryString('id')){
                this.getJourningDetail()
            }
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