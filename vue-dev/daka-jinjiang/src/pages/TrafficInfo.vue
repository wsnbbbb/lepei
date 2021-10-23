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
                <van-cell title="小于1千米" clickable @click="departureDistance = '1'">
                    <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="1千米到2千米" clickable @click="departureDistance = '2'">
                    <van-radio slot="right-icon" name="2" />
                </van-cell>
                 <van-cell title="2千米到3千米" clickable @click="departureDistance = '3'">
                    <van-radio slot="right-icon" name="3" />
                </van-cell>
                <van-cell title="3千米到4千米" clickable @click="departureDistance = '4'">
                    <van-radio slot="right-icon" name="4" />
                </van-cell>
                 <van-cell title="4千米到5千米" clickable @click="departureDistance = '5'">
                    <van-radio slot="right-icon" name="5" />
                </van-cell>
                 <van-cell title="5千米以上" clickable @click="departureDistance = '6'">
                    <van-radio slot="right-icon" name="6" />
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
                <van-cell title="家长乘地铁接送" clickable @click="vehicleType = '6'">
                    <van-radio slot="right-icon" name="6" />
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
                <van-cell title="学生独自乘地铁上下学" clickable @click="vehicleType1 = '6'">
                    <van-radio slot="right-icon" name="6" />
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
            <van-button round block type="info" @click="setTraffic">
            保存
            </van-button>
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

                name: '',
                school: '',
                birthday: '',
                idCardNo: '',
                user: {
                    token: '',
                    personId: '',
                },
            }
        },
        async created() {
           
            let datas =  JSON.parse(localStorage.getItem("detailList"))
            this.user.token = datas.token;
            this.user.personId = datas.personId;
        },
        methods:{
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
             
            async setTraffic(){
                // if(stringCheck(this.isResidence)||stringCheck(this.departureDistance)||stringCheck(this.vehicle)
                // ||stringCheck(this.isParentTransfer)){
                //     Toast('请填写完整');
                //     return
                // }
                // if(stringCheck(this.vehicleType)||stringCheck(this.vehicleType1)){
                //     Toast('请填写完整');
                //     return
                // }
                let param = {
                    personId: this.user.personId,
                    token: this.user.token,
                    isResidence: this.isResidence,
                    departureDistance: this.departureDistance,
                    vehicle: this.vehicle,
                    isParentTransfer: this.isParentTransfer,
                    vehicleType: this.isParentTransfer==1?this.vehicleType:this.vehicleType1
                }
                let type = this.$route.query.type;
                let res = await setTraffic(param)
                if(res.success){
                    let detailList = JSON.parse(localStorage.getItem('detailList'))
                     detailList.completeTraffic = true
                    localStorage.setItem("detailList", JSON.stringify(detailList))
                     Toast.success('成功');
                     if(type == 2){
                        this.$router.push({path:"/home"})
                     }else{
                        this.$router.push({path:"/person-info"})
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
                    this.isResidence = res.detail.isResidence+''
                    this.departureDistance = res.detail.departureDistance+''
                    this.isParentTransfer = res.detail.isParentTransfer+''
                    this.domicileLocation = res.detail.domicileLocation+''
                    if(res.detail.isParentTransfer==1){
                        this.vehicleType = res.detail.vehicleType+''
                    }else{
                        this.vehicleType1 = res.detail.vehicleType+''
                    }
                    
                }else{
                    Toast.fail(res.description);
                }
             }
        },
        mounted() { 
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
    .van-cell-relation{
        .van-field{
            padding-right: 0;
        }
    }
</style>