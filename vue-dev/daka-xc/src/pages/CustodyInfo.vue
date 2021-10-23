<template>
    <div class="custody-info">
        <div class="hintTitle bgColor3">请补全监护人信息</div>
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
        <van-cell class="van-cell-relation" title="关系" value="内容" label="例：爸爸，妈妈，爷爷，奶奶，舅舅，舅妈，姨妈等" >
            <van-field
                v-model="relation"
                maxlength="30"
                clearable
                name="关系"
                placeholder="请填写"
                input-align="right"
                :rules="[{ required: true, message: '请填写关系' }]"
            />
        </van-cell>
        <van-field
            v-model="emergencyTel"
            clearable
            name="主要联系电话"
            label="主要联系电话"
            maxlength="11"
            placeholder="选填"
            input-align="right"
        />
        <div class="btn-box" style="margin: 16px;">
            <van-button v-if="roleType == 0" round block type="info" @click="setCustodyBase(roleType)">保存</van-button>
            <van-button v-if="roleType == 2" round block type="info" @click="setCustodyBase(roleType)">保存，并下一步</van-button>
        </div>

    </div>
</template>

<script>

import {getCustodyBase, setCustodyBase} from '../api/request'
import {Decrypt} from '../util/secret'
import {getQueryString, stringCheck} from '../util/util'
import { Toast } from 'vant';
    export default {
        data(){
            return {
                name: '',
                sex: '',
                school: '',
                relation: '',
                emergencyTel: '',
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
            if(datas){
                this.user.token = datas.token;
                this.user.personId = datas.personId;
            }
        },
        methods:{
            async getCustodyBase(param){
                let res = await getCustodyBase(param)
                if(res.success){
                    if(res.detail != null){
                        this.name = res.detail.name||''
                        this.sex = (res.detail.sex+'')||''
                        this.relation = res.detail.relation||''
                        this.emergencyTel = res.detail.emergencyTel||''
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
              
                if(stringCheck(this.relation)){
                    Toast('关系不能为空');
                    return
                }
                
                let param = {
                    personId: this.user.personId,
                    token: this.user.token,
                    name: this.name,
                    sex: this.sex,
                    relation: this.relation,
                    emergencyTel: this.emergencyTel,
                }
                let res = await setCustodyBase(param)
                if(res.success){
                    let detailList = JSON.parse(localStorage.getItem('detailList'))
                    detailList.completeCustody = true
                    localStorage.setItem("detailList", JSON.stringify(detailList))
                    if(type == 0){
                        Toast.success('提交成功');
                        setTimeout(() => {
                            window.history.go(-1)
                        }, 1000);
                    }else if(type == 2){
                        this.$router.push({path:"/traffic-info",query:{type:type}})
                    }
                }else{
                    Toast.fail(res.description);
                }
            }

        },
        mounted() { 
            // let datas =  JSON.parse(localStorage.getItem("detailList"))
            // if(datas.completeCustody){
                this.getCustodyBase({ 
                    personId: this.user.personId,
                    token: this.user.token
                })
            // }
        } 

    }
</script>

<style lang="less">
    .custody-info{
        .hintTitle{
            height:2.1875rem;
            line-height:2.1875rem;
            text-align: center;
            color:#fff;
            margin:10px 0;
        }
        .bgColor3{
            width:12.5rem;
            background-color:#54A0F5;
        }
        .van-cell-relation{
            .van-field{
                padding-right: 0;
            }
            .van-cell__label{
                width:13.375rem;
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
    .btn-box{
        margin-top: 40px!important;
    }
    
</style>