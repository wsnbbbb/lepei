<template>
    <div class="home">
       <div class="logo">
           <img :src="detail.logo?detail.logo:defaltImg" alt="">
           <p>欢迎使用{{detail.schoolName}}问卷系统</p>
       </div>
       <van-cell-group>
        <van-field
            v-model="phone"
            type="number"
            label="手机号"
            placeholder="请输入手机号"
            maxlength="11"
        />
        </van-cell-group>
        <p class="message">手机号是问卷系统唯一识别号，请输入有效的手机号</p>
        <div class="btn">
            <button @click="clickBtn(schoolId,phone)">进入问卷系统</button>
        </div>
    </div>
</template>

<script>
import {getSchool} from '../api/request'
import {Decrypt} from '../util/secret'
import {getQueryString} from '../util/util'
    export default {
        data(){
            return {
               defaltImg: require('../assets/imgs/logo.png'),
               phone:'',
               detail:{},
               imgsrc:'',
               schoolId: ''
            }
        },
        async created() {
            let id = getQueryString("id")//截取地址栏带的id
            if (!id) return
            let res = await getSchool({"schoolId": Decrypt(id)})
            this.schoolId = Decrypt(id)
            console.log(res);
            this.detail = res.detail;
        },
        methods:{
            clickBtn(tel,id){
                var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
                if(this.phone == ''){
                    this.$toast("请填写手机号");
                }else if(!reg.test(this.phone)){
                    this.$toast("手机号格式错误");
                }else{
                    this.$router.push({path:"/questionnairelist",query:{id:this.schoolId,tel:this.phone}})
                }
            }
        },
    }
</script>

<style lang="less">
    .home{
        width:100%;
        .logo{
            width:100%;
            height:180px;
            padding-top:5rem;
            text-align: center;
            img{
                width:100px;
                height:100px;
                border-radius: 50%;
            }
            p{
                color:#AEACAD;
            }
        }
        .message{
            font-size:12px;
            color:#AEACAD;
            padding-left: 10px;
        }
        .btn{
            width:100%;
            display: flex;
            justify-content: center;
            align-items: center;
            button{
                width:95%;
                height:3rem;
                border:none;
                border-radius: 6px;
                margin:10px auto;
                background-color: #379BFA;
                color:#fff;
            }
        }

    }
</style>