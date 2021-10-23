<template>
    <div class="home wrapper" ref="wrapper">
        <van-radio-group v-model="isResidence" >
            <van-cell-group title="读书形式">
                <van-cell title="走读" clickable @click="isResidence = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
                <van-cell title="住读" clickable @click="isResidence = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>

         <van-radio-group v-model="departureDistance" >
            <van-cell-group title="学生家庭地址与学校的距离（1千米=1公里）">
                <van-cell title="小于2.5千米" clickable @click="departureDistance = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="大于2.5千米" clickable @click="departureDistance = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    
        <van-radio-group v-model="isParentTransfer" >
            <van-cell-group title="家长接送放学情况">
                <van-cell title="学生由家长接送上下学" clickable @click="isParentTransfer = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="学生独立上下学" clickable @click="isParentTransfer = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>

        <van-radio-group v-model="vehicleType" v-show="isParentTransfer==1">
            <van-cell-group title="学生上下学具体交通方式">
                <van-cell title="家长私家车接送" clickable @click="vehicleType = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
                <van-cell title="家长私家车拼车接送" clickable @click="vehicleType = '3'">
                    <van-radio slot="right-icon" name="3" />
                </van-cell>
                <van-cell title="家长自行车、电动自行车、摩托车（含三轮）接送" clickable @click="vehicleType = '4'">
                    <van-radio slot="right-icon" name="4" />
                </van-cell>
                <van-cell title="家长乘公交车接送" clickable @click="vehicleType = '5'">
                    <van-radio slot="right-icon" name="5" />
                </van-cell>
                <van-cell title="家长步行接送" clickable @click="vehicleType = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="其他方式-主要指使用两种以上方式完成上下学（两种以上方式不包括使用交通工具前后的步行）" clickable @click="vehicleType = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>

        <van-radio-group v-model="vehicleType1" v-show="isParentTransfer==0">
            <van-cell-group title="学生上下学具体交通方式">
                <van-cell title="学生独自骑自行车上下学" clickable @click="vehicleType1 = '4'">
                    <van-radio slot="right-icon" name="4" />
                </van-cell>
                <van-cell title="学生独自步行上下学" clickable @click="vehicleType1 = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="学生独自乘公交车上下学" clickable @click="vehicleType1 = '5'">
                    <van-radio slot="right-icon" name="5" />
                </van-cell>
                <van-cell title="学生独自乘专用校车上下学" clickable @click="vehicleType1 = '7'">
                    <van-radio slot="right-icon" name="7" />
                </van-cell>
                <van-cell title="学生独自乘坐个体接送车上下学" clickable @click="vehicleType1 = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
                <van-cell title="其他方式-主要指使用两种以上方式完成上下学（两种以上方式不包括使用交通工具前后的步行）" clickable @click="vehicleType1 = '0'">
                    <van-radio slot="right-icon" name="0" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>

        <div class="btn-box" style="margin: 16px;">
            <van-button round block type="info" @click="setTraffic">保存</van-button>
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
        <van-popup
            v-model="showSchool"
            position="bottom"
            :style="{ height: '80%' }"
            >
        </van-popup>
    </div>
</template>

<script>

import { getBase, setTraffic} from '../api/request'
import {Decrypt} from '../util/secret'
import {getQueryString, stringCheck} from '../util/util'
import { Toast } from 'vant';

    export default {
        data(){
            return {
                isResidence:'',
                departureDistance:'',
                isParentTransfer: '',
                vehicleType: '',
                vehicleType1: '',
                user: {
                    token: '',
                    personId: '',
                },
            }
        },
        async created() {
            let datas =  JSON.parse(localStorage.getItem("detailList"))
            if(datas){
                this.user.token = datas.token;
                this.user.personId = datas.personId;
            }
        },
        methods:{
           
            async setTraffic(){
                if(stringCheck(this.isResidence)){
                    Toast.fail('请选择读书形式');
                    return
                }
                if(stringCheck(this.departureDistance)){
                    Toast.fail('请选择学生家庭地址与学校的距离');
                    return
                }
                if(stringCheck(this.isParentTransfer)){
                    Toast.fail('请选择家长接送放学情况');
                    return
                }
                if(this.isParentTransfer == 1){
                    if(stringCheck(this.vehicleType)){
                        Toast.fail('请选择学生上下学交通方式');
                        return
                    }
                }else{
                    if(stringCheck(this.vehicleType1)){
                        Toast.fail('请选择学生上下学交通方式');
                        return
                    }
                }
                let param = {
                    personId: this.user.personId,
                    token: this.user.token,
                    isResidence: this.isResidence,
                    departureDistance: this.departureDistance,
                    vehicle: this.vehicle,
                    isParentTransfer: this.isParentTransfer,
                    vehicleType: this.isParentTransfer==1?this.vehicleType:this.vehicleType1
                }
                console.log(param);
                let type = this.$route.query.type;
                let res = await setTraffic(param)
                if(res.success){
                    let detailList = JSON.parse(localStorage.getItem('detailList'))
                    detailList.completeTraffic = true
                    localStorage.setItem("detailList", JSON.stringify(detailList))
                    Toast.success('提交成功');
                    if(type && type == 2){
                         setTimeout(() => {
                            this.$router.push({path:"/home"})
                        }, 1000);
                    }else{
                        setTimeout(() => {
                            this.$router.go(-1)
                        }, 1000); 
                    }
                }else{
                    Toast.fail(res.description);
                }
            },

             async getBase(){
                 let res = await getBase({
                    personId: this.user.personId,
                    token: this.user.token,
                })
                if(res.success){
                    this.isResidence = res.detail.isResidence + ''
                    this.departureDistance = res.detail.departureDistance + ''
                    this.isParentTransfer = res.detail.isParentTransfer + ''
                    this.domicileLocation = res.detail.domicileLocation + ''
                    if(res.detail.isParentTransfer==1){
                        this.vehicleType = res.detail.vehicleType + ''
                    }else{
                        this.vehicleType1 = res.detail.vehicleType + ''
                    }
                    
                }else{
                    Toast.fail(res.description);
                }
             }
        },
        mounted() { 
            // let datas =  JSON.parse(localStorage.getItem("detailList"))
            // if(datas.completeTraffic){
                this.getBase()
            // }
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