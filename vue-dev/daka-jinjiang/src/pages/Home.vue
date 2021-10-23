<template>
    <div class="home ">
        <div class="banner"><img src="../assets/imgs/banner.png" alt=""></div>
        <div class="log-out">
            <p>欢迎您：{{idCardNo | formatIdcard}}</p>
            <div>
                <a href="#" @click="changePwd=true">修改密码</a>
                <a href="#" @click="logOut">退出登录</a>
            </div>
        </div>
        <div class="loginBtn" @click="punchCard"><img src="../assets/imgs/punch-card.png" alt=""></div>
        <div v-if="roleType == 3" class="checkPunchCard"><img @click="checkPunchCard" src="../assets/imgs/write-info.png" alt=""></div>
        <div class="infoBtn"><img @click="infoLogin(1)" src="../assets/imgs/write-info.png" alt=""></div>
        <div class="alienBtn"><img @click="infoLogin(2)" src="../assets/imgs/alien.png" alt=""></div>
        
        <van-overlay :show="roleChoice">
            <div class="login-modal">
                <div class="content" >
                    <div class="title-img"><img src="../assets/imgs/modal-img.png" alt=""></div> 
                    <p class="hint">需填写打卡人基础信息，<span class="fontColor">务必认真填写后，再次点击首页“打卡按钮”完成打卡工作</span></p>
                    <p class="hint">1、学生需填写《基本信息》、《监护人信息》、《上下学交通信息》</p>
                    <p class="hint">2、教职工需填写《基本信息》</p>
                    <div style="margin: 16px 22px 26px 22px;">
                        <van-button round block type="info" class="back" @click="goBasicInfo">填写打卡人基础信息</van-button>
                    </div>
                </div>
            </div>
        </van-overlay>
        <van-overlay :show="done" >
            <div class="login-modal">
                <div class="content" >
                    <div class="title-img"><img src="../assets/imgs/modal-img.png" alt=""></div> 
                    <p class="hint">今日打卡已完成，谢谢您的配合</p>
                    <div style="margin: 100px 30px 60px 30px;">
                        <van-button round block type="info" class="back" @click="goHome">返回首页</van-button>
                    </div>
                </div>
            </div>
        </van-overlay>
        <van-overlay :show="changeClock">
            <div class="login-modal">
                <div class="content" >
                    <div class="title-img"><img src="../assets/imgs/modal-img.png" alt=""></div> 
                    <p class="hint">您最近打卡时间为<span class="fontColor">{{punchDate}}</span>，今日打卡信息是否有变更？</p>
                    <p class="hint">1、无变更：请点击快速打卡按钮，一键完成今日打卡操作</p>
                    <p class="hint">2、有变更：请点击新建打卡按钮，认真填写</p>
                    <div class="changeClock">
                        <button :class="{bgColor:changeColor == 1}" style="marginBottom:20px" @click="fastClock(1)">信息无变更，快速打卡</button>
                        <button :class="{bgColor:changeColor == 2}" @click="fastClock(2)">信息变更，新建打卡</button>
                    </div>
                </div>
            </div>
        </van-overlay>
        <van-overlay :show="writeInfoLogin" @click="writeInfoLogin=false">
            <div class="login-modal" >
                <div class="content" @click.stop>
                    <div class="title-img"><img src="../assets/imgs/modal-img.png" alt=""></div> 
                    <p class="hint">请输入各填报单位预先分配的账号与密码，登录后再填报。如有疑问请联系管理员。</p>
                    <p class="hint fontColor">为了各单位的信息安全，请妥善管理账号与密码，请不要泄露给第三方。</p>
                    <div class="form">
                        <van-form @submit="toWriteInfo">
                            <van-field
                            class="input"
                            v-model="username"
                            name="username"
                            placeholder="账号"
                            :rules="[{ required: true, message: '请填写账号' }]"
                            />
                            <van-field
                            class="input"
                            v-model="password"
                            type="password"
                            name="password"
                            placeholder="密码"
                            :rules="[{ required: true, message: '请填写密码' }]"
                            />
                            <div style="margin: 16px;">
                                <p v-show="errInfo" class="ft12 err fontColor">账号或密码错误，请核实后再试</p>
                                <van-button round block type="info" native-type="submit">登录</van-button>
                            </div>
                        </van-form>
                    </div>
                    
                </div>
            </div>
        </van-overlay>
             <van-overlay :show="changePwd" @click="cancelChangePwd">
            <div class="login-modal" >
                <div class="content" @click.stop>
                    <div class="title-img"><img src="../assets/imgs/modal-img.png" alt=""></div> 
                    <div class="form">
                        <van-form @submit="changePassword">
                            <van-field
                            class="input"
                            v-model="oldPassword"
                            type="password"
                            name="oldPassword"
                            label="原密码"
                            maxlength="12"
                            input-align="right"
                            placeholder="请输入原密码"
                            :rules="[{ required: true, message: '请输入原密码' }]"
                            />
                            <van-field
                            class="input"
                            v-model="newPassword"
                            type="password"
                            label="新密码"
                            name="newPassword"
                            maxlength="12"
                            input-align="right"
                            placeholder="请输入密码"
                            :rules="[{ required: true, message: '请输入密码' }]"
                            />
                            <van-field
                            class="input"
                            v-model="comfirmPwd"
                            type="password"
                            label="新密码"
                            name="comfirmPwd"
                            maxlength="12"
                            input-align="right"
                            placeholder="请再次输入密码"
                            :rules="[{ required: true, message: '请再次输入密码' }]"
                            />
                            <p class="ruleHint">密码规则为6-12位，字母、数字，区分大小写</p>
                            <div style="margin: 16px;">
                                <van-button round block type="info" native-type="submit">修改密码</van-button>
                            </div>
                        </van-form>
                    </div>
                    
                </div>
            </div>
        </van-overlay>
        <div class="btns">
            <button @click="toPunchRecord">打卡记录</button>
            <button @click="toPersonInfo">人员信息</button>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { changePassword, clock, currentData, refresh, toWriteInfo } from '../api/request'
import { notSeconds, formatIdcard } from '../util/util'
import { Dialog } from 'vant';
    export default {
        inject:['reload'],
        data(){
            return {
                idCardNo:'',
                show: false, //登录弹框
                IDnumber:'',
                roleChoice:false, //角色选择弹框
                roleType:'',
                done:false, //完成打卡弹框
                changeClock:false, //变更打卡弹框
                changeColor:1,
                currentDate:moment().format('YYYY-MM-DD'),
                punchDate:'',
                token:'',
                detailList:{},
                flag1:false,
                flag2:false,
                currentTime:'',
                dataList:{},
                writeInfoLogin:false, // 信息填报登录 
                username:'',
                password:'',
                errInfo:false,
                isAlienType:'',
                changePwd:false, //修改密码
                oldPassword:'',
                newPassword:'',
                comfirmPwd:'',

            }
        },
        created() {
            let datas = JSON.parse(localStorage.getItem("detailList"))
            this.detailList = datas;
            this.idCardNo = datas.number;
            this.roleType = datas.type
            this.againGetData()
            
        },
        methods:{
            // 获取实时数据
            getCurrentData(){
                currentData().then(res =>{
                    if(res.success){
                        this.dataList = res.detail,
                        this.currentTime = notSeconds(res.detail.modifyTime)
                    }
                })
            },
            // 是否为正数
            positiveNum(num){
                if(num > 0){
                    return '+'+num
                }else{
                    return num
                }
            },
            is_weixin() {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    return true;
                } else {
                    return false;
                }
            },
            // 每日平安打卡
            punchCard(){
                if(this.detailList.completeBase == true){
                    if(this.detailList.hasPunch == true){
                        if(this.detailList.punchDate == this.currentDate){
                            this.done = true;
                        }else{
                            this.punchDate = this.detailList.punchDate;
                            this.changeClock = true;
                        }
                    }else{
                        this.$router.push({path:"/sign-info"})
                    }
                }else{
                    this.roleChoice = true;
                }
            },
            

            // 基础信息页面
            goBasicInfo(){
                if(this.roleType == 2){
                    this.$router.push({path:"/student-info",query:{roleType:this.roleType}})
                }else if(this.roleType == 3){
                    this.$router.push({path:"/teacher-info",query:{roleType:this.roleType}})
                }else{
                    return 
                }
            },
            goHome(){
                this.done = false;
                this.reload()
            },
            // 快速打卡
            fastClock(type){
                this.changeColor = type;
                if(type == 1){
                    let params = {
                        "personId":this.detailList.personId,
                        "token":this.detailList.token,
                        "date":this.detailList.punchDate,
                    };
                    clock(params).then(res =>{
                        if(res.success){
                            this.changeClock = false;
                            this.done = true;
                        }else{
                            this.$toast.fail(res.description)
                            this.changeClock = false;
                        }
                    })
                }else{
                    this.changeClock = false;
                    // 跳转至每日打卡页面
                    this.$router.push({path:"/sign-info",query:{date:this.detailList.punchDate}})
                }
            },
            // 打卡记录
            toPunchRecord(){
                this.$router.push({path:"/sign-list"})
            },
            // 人员信息
            toPersonInfo(){
                if(this.roleType == 2){
                    this.$router.push({path:"/person-info"})
                }else if(this.roleType == 3){
                    this.$router.push({path:"/teacher-info"})
                }
            },
            againGetData(){
                this.detailList = JSON.parse(localStorage.getItem("detailList"))
                let params = {
                    "personId":this.detailList.personId,
                    "token":this.detailList.token,
                }
                refresh(params).then(res =>{
                    if(res.success){
                        localStorage.setItem("detailList",JSON.stringify(res.detail))
                    }else{
                        this.$toast.fail(res.description)
                    }
                })
            },
            logOut(){
                Dialog.confirm({
                title: '提示',
                message: '是否确认退出登录'
                }).then(() => {
                    localStorage.removeItem("detailList")
                    this.$router.push({path:"/login"})
                }).catch(() => {
                });
               
            },
            // 修改密码
            changePassword(value) {
                if(value.newPassword == value.oldPassword){
                    return this.$toast("新密码不能与原密码相同");
                }
                if(value.newPassword != value.comfirmPwd){
                    return this.$toast("两次密码输入不一致");
                }
                let params = {
                    "personId":this.detailList.personId,
                    "token":this.detailList.token ,
                    "oldPassword":value.oldPassword,
                    "newPassword":value.newPassword,
                    "confirmPassword":value.comfirmPwd,
                }
                changePassword(params).then(res =>{
                    if(res.success){
                        setTimeout(() =>{
                            this.$toast("密码修改成功！");
                            localStorage.removeItem("detailList")
                            setTimeout(() =>{
                                this.$router.push({path:"/login"})
                                this.changePwd = false;
                            },1000)
                        },1000)
                    }else{
                        this.$toast.fail(res.description);
                    }
                })
                
            },
            cancelChangePwd() {
                this.changePwd = false;
                this.oldPassword = '';
                this.newPassword = '';
                this.comfirmPwd = '';
            },
            // 信息填报
            infoLogin(type){
                this.isAlienType = type
                this.writeInfoLogin = true;
            },
            // 信息填报登录
            toWriteInfo(values){
                let params = {
                    "username":values.username,
                    "password":values.password,
                }
                toWriteInfo(params).then(res =>{
                    if(res.success){
                        localStorage.setItem("userInfo",JSON.stringify(res.detail))
                        this.$toast("登录成功")
                        this.username = ''
                        this.password = ''
                        if(this.isAlienType == 1){
                            setTimeout(() =>{
                                this.writeInfoLogin = false;
                                this.$router.push({path:"/write-info-list"})
                            },1000)
                        }else if(this.isAlienType == 2){
                            setTimeout(() =>{
                                this.writeInfoLogin = false;
                                this.$router.push({path:"/alien-info-list"})
                            },1000)
                        }
                    }else{
                        if(res.code == 100055){
                            this.errInfo = true;
                        }else{
                            this.$toast(res.description)
                        }
                    }
                })
                
            },
            // 打卡情况查询
            checkPunchCard() {
                this.$router.push({path:"/clock-query"})
            }
        },
        mounted() { 
            
            
        },
        filters: {
            formatIdcard: function (value) {
                return formatIdcard(value)
            }
        }
       

    }
</script>

<style lang="less">
    .home{
        width:100%;
        position: relative;
        margin-bottom: 60px;
        .log-out{
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding:0 15px;
            margin-bottom:10px;
            div{
                a{
                    text-decoration: none;
                    &:first-child{
                        margin-right: .625rem;
                    }
                }

            }
        }
        p{
            padding:0;
            margin:0;
        }
        .ft24{
            font-size:24px;
        }
        .ft12{
            font-size:12px;
        }
        .ft14{
            font-size:14px;
        }
        .banner{
            width:100%;
            img{
                width:100%;
                height:100%;
            }
        }
        .realTime{
            color:#444;
            text-indent: 10px;
            font-size: 12px;
            line-height:28px;
        }
        .realTime-data{
            width:96%;
            text-align: center;
            background-color: #fff;
            padding:10px 0;
            margin:0 auto;
            margin-bottom: 15px;
            border-radius: 6px;
            .color1{
                color:#f04040;
            }
            .color2{
                color: #fe8d32;
            }
            .color3{
                color: #7e0909;
            }
            .color4{
                color: #ac0d72;
            }
            .color5{
                color: #76a7d5;
            }
            .color6{
                color: #0cd889;
            }
            .middle-border{
                width:100%;
                font-size:24px;
                border-left:2px solid #F1F1F1;
                border-right:2px solid #F1F1F1;
            }
        }
        .loginBtn,.infoBtn,.alienBtn,.checkPunchCard{
            width:100%;
            height:125px;
            img{
                width:100%;
                height:100%;
            }
        }
        
        .alienBtn{
            margin-bottom: 30px;
        }
        .btns{
            width:100%;
            text-align: center;
            position: fixed;
            left:0;
            bottom:15px;
            button{
                width:150px;
                text-align: center;
                border-radius: 50px;
                border:3px solid #D9D8D8;
                color:#fff;
                font-weight: bold;
                font-size:16px;
                line-height: 30px;
                &:first-child{
                    background-color: #5E8BFF;
                    margin-right: 15px;
                }
                &:last-child{
                    background-color: #8FC9FF;
                }
            }
        }
        .login-modal{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            .content{
                width:90%;
                background-color: #fff;
                .title-img{
                    width:100%;
                    img{
                        width:100%;
                    }
                }
                .errId{
                    color: #f86060;
                    font-size: 20px;
                    padding:10px 15px 0 15px;
                    word-wrap:break-word; 
                    word-break:break-all;
                    // overflow: hidden;
                }
                .hint{
                    padding:10px 15px 0 15px;
                    font-size: 15px;
                }
                .form{
                    padding:10px 20px 0 20px;
                    .van-field__label{
                        width:60px;
                    }
                    .input{
                        border:1px solid #ccc;
                        margin-bottom: 10px;
                    }
                    .err{
                        font-size:13px;
                        color:#f86060;
                        padding:0 0 .625rem 1.5rem;
                    }
                    .ruleHint{
                        color: #969799;
                        font-size:10px;
                        text-align: center;
                    }
                }
                .back{
                    font-size: 16px;
                }
                .fontColor{
                    color: #f86060;
                }
                .roles{
                    width:80%;
                    margin:20px auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    div{
                        width:80px;
                        height:80px;
                        color:#D1D3D7;
                        font-size: 20px;
                        line-height: 80px;
                        text-align: center;
                        border-radius: 80px;
                        border:2px solid #EFEEEE;
                    }
                    .active{
                        background-color: #1989FA;
                        color:#fff;
                    }
                }
                .changeClock{
                    margin:26px;
                    text-align: center;
                    button{
                        width:100%;
                        line-height: 44px;
                        border:none;
                        background-color: #fff;
                        color:#1989FA;
                        border-radius: 50px;
                    }
                    .bgColor{
                        background-color: #1989FA;
                        color:#fff;
                    }
                }
            }
        }

    }
    
</style>