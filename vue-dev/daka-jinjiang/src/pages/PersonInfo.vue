<template>
    <div class="home wrapper" ref="wrapper">
        <van-cell-group>
            <van-cell :class="base.completeBase?'':'van-red'" icon="friends" title="基础信息" is-link to="student-info" :value="base.completeBase?'已填写':'未填写'" />
            <van-cell :class="base.completeCustody?'':'van-red'" icon="comment" title="监护人信息" is-link to="custody-info" :value="base.completeCustody?'已填写':'未填写'" />
            <van-cell :class="base.completeTraffic?'':'van-red'"  icon="card" title="上下学交通信息" is-link to="traffic-info" :value="base.completeTraffic?'已填写':'未填写'" />
        </van-cell-group>
    </div>
</template>

<script>


import {getSchool} from '../api/request'
import {Decrypt} from '../util/secret'
import {getQueryString} from '../util/util'
    export default {
        data(){
            return {
               base:{
                   completeBase: false,
                   completeCustody: false,
                   completeTraffic: false
               }
            }
        },
        async created() {
            let datas =  JSON.parse(localStorage.getItem("detailList"))
            this.base.completeBase = datas.completeBase;
            this.base.completeCustody = datas.completeCustody;
            this.base.completeTraffic = datas.completeTraffic;
        },
        methods:{
            onClick(){
               
            }
        },
        mounted() { 

        } 

    }
</script>

<style lang="less">
    .van-red{
        .van-cell__value{
            color: red;
        }
    }
    
</style>