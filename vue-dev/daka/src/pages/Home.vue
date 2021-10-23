<template>
    <div class="home ">
        <div class="banner"><img src="../assets/imgs/banner.png" alt=""></div>
        <div v-if="token" class="log-out">
            <p>欢迎您：{{IDnumber | formatIdcard}}</p>
            <a href="#" @click="logOut">退出登录</a>
        </div>
        <div class="loginBtn" @click="punchCard"><img src="../assets/imgs/punch-card.png" alt=""></div>
        <div v-if="role == 3" class="checkPunchCard"><img @click="checkPunchCard" src="https://cdn.lepayedu.com/dkqk.png" alt=""></div>
        <div class="infoBtn"><img @click="infoLogin(1)" src="../assets/imgs/write-info.png" alt=""></div>
        <div class="alienBtn"><img @click="infoLogin(2)" src="../assets/imgs/alien.png" alt=""></div>
        <van-overlay :show="show"  @click="close">
            <div class="login-modal">
                <div class="content"  @click.stop>
                    <div class="title-img"><img src="../assets/imgs/modal-img.png" alt=""></div> 
                    <p class="hint">每日打卡和人员维护，仅针对四川省成都市天府新区辖区所管辖的学生与教职工</p>
                    <p class="hint">1、学生请输入学生身份证</p>
                    <p class="hint">2、教职工请输入本人身份证</p>
                    <div class="form">
                        <van-form @submit="onSubmit(IDnumber,flag1)">
                            <van-field
                                class="input"
                                v-model="IDnumber"
                                placeholder="请输入身份证号码"
                                :rules="[{ required: true, message: '请输入身份证号码' }]"
                            />
                            <div style="margin: 16px;">
                                <van-button round block type="info" native-type="submit">登录</van-button>
                            </div>
                        </van-form> 
                    </div>
                </div>
            </div>
        </van-overlay>
        <van-overlay :show="errorShow" >
            <div class="login-modal">
                <div class="content">
                    <div class="title-img"><img src="../assets/imgs/modal-img.png" alt=""></div> 
                    <p class="errId">您的输入：{{IDnumber}}</p>
                    <p class="hint">可能发生了以下错误，请核实后再试或联系班主任（学校管理员）</p>
                    <p class="hint">1、身份证号码错误</p>
                    <p class="hint">2、身份证号码未在统计范围内</p>
                    <div style="margin: 16px;">
                        <van-button round block type="info" class="back" @click="backLogin">返回重新输入</van-button>
                    </div>
                </div>
            </div>
        </van-overlay>
        <van-overlay :show="roleChoice">
            <div class="login-modal">
                <div class="content" >
                    <div class="title-img"><img src="../assets/imgs/modal-img.png" alt=""></div> 
                    <p class="hint fontColor">请选择当前输入身份证号的角色，学生与老师角色不可变更，为了你的信息统计准确性，请慎重选择。</p>
                    <p class="hint">按照天府新区抗疫办公室要求，需填写打卡人基础信息，<span class="fontColor">务必认真填写后，再次点击首页“打卡按钮”完成打卡工作</span></p>
                    <p class="hint">1、人员类型分为五大类，学生、教职工、保安、食堂人员、物业人员。</p>
                    <p class="hint">2、物业人员定义（含保洁、宿管、服务、绿化等相关人员）</p>
                    <!-- <div class="roles">
                        <div :class="{active:roleType == 2}" @click="choiceRole(2)">学生</div>
                        <div :class="{active:roleType == 3}" @click="choiceRole(3)">教职工</div>
                    </div> -->
                    <div class="roles">
                        <van-cell  title="人员类型" is-link @click="showChoiceRole = true" :value="personType" />
                    </div>
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
                    <p class="hint">今日（{{currentDate}}）打卡已完成，谢谢您的配合</p>
                    <p class="hint">打卡人：{{IDnumber | formatIdcard}}</p>
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
                    <p class="hint">1、无变更：<span class="fontColor">先选择体温后</span>，点击快速打卡按钮，一键完成今日打卡操作</p>
                    <p class="hint">2、有变更：请点击新建打卡按钮，认真填写</p>
                    <div class="temperature-picker">
                        <van-cell  title="今日体温" is-link @click="showPopup" :value="currentTemperture" />
                    </div>
                    <div class="changeClock">
                        <button :class="{bgColor:changeColor == 1}" style="marginBottom:20px" @click="fastClock(1)">信息无变更，快速打卡</button>
                        <button :class="{bgColor:changeColor == 2}" @click="fastClock(2)">信息变更，新建打卡</button>
                    </div>
                </div>
            </div>
        </van-overlay>
        <van-overlay :show="writeInfoLogin" @click="cancelWriteInfo">
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
        <van-overlay :show="roleVerify"  @click="onCancel">
            <div class="login-modal">
                <div class="content"  @click.stop>
                    <div class="title-img"><img src="../assets/imgs/modal-img.png" alt=""></div> 
                    <p class="hint">查看个人信息，需验证填写的主要联系电话，请输入</p>
                    <div class="form">
                        <van-form @submit="roleCheck">
                            <van-field
                                maxlength="11"
                                type = "number"
                                class="input"
                                name="mobile"
                                v-model="mobile"
                                placeholder="请输入电话号码"
                                :rules="[{ required: true, message: '请输入电话号码' }]"
                            />
                            <p v-show="showerr" class="err">您输入的电话号码有误</p>
                            <div style="margin: 16px;">
                                <van-button round block type="info" native-type="submit">确定</van-button>
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
       
        <van-popup
        v-model="showTemperature"
        position="bottom"
        :style="{ height: '40%' }">
        <van-picker :columns="temperatures"
            :default-index="30" 
            show-toolbar
            title="选择温度"
            @cancel="showTemperature = false"
            @confirm="onConfirm"
            />
        </van-popup>
        <van-popup
        v-model="showChoiceRole"
        position="bottom"
        :style="{ height: '40%' }">
        <van-picker :columns="types"
            :default-index="0" 
            show-toolbar
            title="选择人员类型"
            @cancel="showChoiceRole = false"
            @confirm="onConfirm1"
            />
        </van-popup>
    </div>
</template>

<script>
import moment from 'moment'
import { login, clock, currentData, refresh, toWriteInfo,roleCheck } from '../api/request'
import { notSeconds, formatIdcard , isNumber} from '../util/util'
import { Dialog } from 'vant';
    export default {
        inject:['reload'],
        data(){
            return {
                show: false, //登录弹框
                IDnumber:'',
                errorShow:false, //身份信息错误提示弹框
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
                roleVerify:false,
                showerr:false,
                mobile:'',
                showTemperature: false,
                temperatures: [ '34.0', '34.1', '34.2', '34.3', '34.4', '34.5', '34.6', '34.7', '34.8', '34.9', '35.0', 
                '35.1', '35.2', '35.3', '35.4', '35.5', '35.6', '35.7', '35.8', '35.9', '36.0', '36.1', '36.2', '36.3', 
                '36.4', '36.5', '36.6', '36.7', '36.8', '36.9', '37.0', '37.1', '37.2', '37.3', '37.4', '37.5', '37.6', 
                '37.7', '37.8', '37.9', '38.0', '38.1', '38.2', '38.3', '38.4', '38.5', '38.6', '38.7', '38.8', '38.9',
                '39.0', '39.1', '39.2', '39.3', '39.4', '39.5', '39.6', '39.7', '39.8', '39.9', '40.0', '40.1', '40.2',
                '40.3', '40.4', '40.5', '40.6', '40.7', '40.8', '40.9', '41.0', '41.1', '41.2', '41.3', '41.4', '41.5',
                '41.6', '41.7', '41.8', '41.9', '42.0'
                ],
                currentTemperture: '请选择',
                showChoiceRole:false,
                types:[
                    {
                        text:'学生',
                        type:2
                    },
                    {
                        text:'教职工',
                        type:3
                    },
                    {
                        text:'保安',
                        type:4
                    },
                    {
                        text:'食堂人员',
                        type:5
                    },
                    {
                        text:'物业人员',
                        type:6
                    },
                ],
                personType:'请选择',
                role:'',
            }
        },
        created() {
            let IDnumber = localStorage.getItem("IDnumber")
            if(IDnumber){
                this.IDnumber = IDnumber;
            }
            this.token =  localStorage.getItem("token")
            if(this.token != null){
                this.againGetData()
            }
            this.detailList = JSON.parse(localStorage.getItem("detailList"))
         
        },
        methods:{
            showPopup() {
                this.showTemperature = true;
            },
            onConfirm(value) {
                this.currentTemperture = value;
                this.showTemperature = false;
            },
            onConfirm1(value) {
                console.log(value);
                this.personType = value.text;
                this.roleType = value.type;
                this.showChoiceRole = false;
            },
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
                this.token = localStorage.getItem("token")
                this.detailList = JSON.parse(localStorage.getItem("detailList"))
               
                if(this.token == null){
                    this.show = true;
                    this.IDnumber = '';
                }else if(this.token != null){
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
                }
            },
            // 关闭登录框
            close(){
                this.show = false;
                this.IDnumber = ''
            },
            
            // 登录
            onSubmit(values,code1) {
                localStorage.setItem("IDnumber",values)
                this.IDnumber = values;
                let params = {"idCardNo":values};
                login(params).then(res =>{
                    if(res.success){
                        if(res.detail.type){
                            this.role = res.detail.type
                        }
                        this.IDnumber = res.detail.idCardNo
                        this.show = false;
                        localStorage.setItem("token", res.detail.token)
                        localStorage.setItem("detailList", JSON.stringify(res.detail))
                        if(code1){
                            this.$router.push({path:"/sign-list"})
                            
                        // }else if(code2){
                        //     if(res.detail.type == 2){
                        //         this.$router.push({path:"/person-info"})
                        //     }else if(res.detail.type == 3){
                        //         this.$router.push({path:"/teacher-info"})
                        //     }else{
                        //         this.roleChoice = true;
                        //     }
                        }else{
                                // 登陆成功但未补全基础信息
                            if(res.detail.completeBase === false){
                                this.roleChoice = true;
                                // 登陆成功，有基础信息，无历史打卡记录
                            }else if(res.detail.completeBase === true && res.detail.hasPunch === false){
                                //  跳转到每日打卡页面  
                                this.$router.push({path:"/sign-info"})
                            }else if(res.detail.completeBase === true && res.detail.hasPunch === true){
                                this.punchDate = res.detail.punchDate;
                                if(res.detail.punchDate == this.currentDate){
                                    this.done = true;
                                }else{
                                    this.changeClock = true;
                                }
                            }
                        }
                    }else{
                        this.show = false;
                        this.errorShow = true;
                    }
                })
            },
            // 返回
            backLogin(){
               this.errorShow = false;
               this.show = true;
               this.IDnumber = ''
            },
            // 角色选择
            // choiceRole(type){
            //     this.roleType = type;
            // },

            // 跳转基础信息页面
            goBasicInfo(){
                console.log(this.roleType);
                if(this.personType == "请选择"){
                    this.$toast("请选择人员类型")
                    return
                }
                this.showChoiceRole = false;
                if(this.roleType == 2){
                    this.$router.push({path:"/student-info",query:{roleType:this.roleType}})
                }else{
                   this.$router.push({path:"/teacher-info",query:{roleType:this.roleType}})
                }
            },
            goHome(){
                this.done = false;
               this.reload()
            },
            // 快速打卡
            fastClock(type){
                this.detailList = JSON.parse(localStorage.getItem("detailList"))
                this.changeColor = type;
                if(type == 1){
                    if(parseFloat(this.currentTemperture).toString() == "NaN"){
                        this.$toast("请选择体温")
                        return
                    }
                    let temperatureState
                    if(this.currentTemperture<=37.3){
                        temperatureState = 1
                    }else if(this.currentTemperture>37.3&&this.currentTemperture<38.5){
                        temperatureState = 2
                    }else if(this.currentTemperture>=38.5){
                        temperatureState = 3
                    }
                    let params = {
                        "personId":this.detailList.personId,
                        "token":this.detailList.token,
                        "date":this.detailList.punchDate,
                        "temperatureState": temperatureState,
                        "temperature": this.currentTemperture,
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
                this.token = localStorage.getItem("token")
                this.detailList = JSON.parse(localStorage.getItem("detailList"))
                if(this.token == null){
                    this.flag1 = true;
                    this.show = true;
                    this.IDnumber = '';
                }else{
                    this.$router.push({path:"/sign-list"})
                }
            },
            // 人员信息
            toPersonInfo(){
                let token = localStorage.getItem("token")
                let data = JSON.parse(localStorage.getItem("detailList"))
                if(token && token != null){
                    if(data.completeBase == false){
                        this.roleChoice = true;
                    }else{
                        this.roleVerify = true
                    }
                }else{
                    this.$toast.fail("用户未登录,请点击每日打卡登录")
                }
               
            },
            // 身份验证
            roleCheck(value) {
               let datas =  JSON.parse(localStorage.getItem("detailList"))
                let params = {
                    "personId":datas.personId,
                    "token":datas.token,
                    "mobile":value.mobile,
                }
                roleCheck(params).then(res =>{
                    if(res.success){
                        this.$toast("身份验证成功")
                        setTimeout(() =>{
                            this.roleVerify = false
                            if(datas.type == 2){
                                this.$router.push({path:"/person-info"})
                            }else{
                                this.$router.push({path:"/teacher-info"})
                            }
                        },1000)
                        
                    }else{
                        if(res.code == 100062){
                            this.showerr = true
                        }else{
                            this.$toast.fail(res.description)
                        }
                    }
                })
            },
            onCancel() {
                this.roleVerify = false
                this.mobile= ''
                this.showerr = false
            },
            // 刷新数据
            againGetData(){
                this.token = localStorage.getItem("token")
                this.detailList = JSON.parse(localStorage.getItem("detailList"))
                let params = {
                    "personId":this.detailList.personId,
                    "token":this.token,
                }
                refresh(params).then(res =>{
                    if(res.success){
                        localStorage.setItem("detailList",JSON.stringify(res.detail))
                        this.role = res.detail.type;
                    }else{
                        if(res.code == 100004){
                            localStorage.removeItem("token")
                            localStorage.removeItem("detailList")
                            this.token = ''
                            this.$toast.fail(res.description)
                        }else{
                            this.$toast.fail(res.description)
                        }
                        
                    }
                })
            },
            // 退出登录
            logOut(){
                Dialog.confirm({
                title: '提示',
                message: '是否确认退出登录'
                }).then(() => {
                    localStorage.removeItem("token")
                    localStorage.removeItem("detailList")
                    this.token = ''
                }).catch(() => {
                });
               
            },
            // 信息填报
            infoLogin(type){
                console.log(type);
                this.isAlienType = type
                this.writeInfoLogin = true;
            },
            // 信息填报登录框取消
            cancelWriteInfo() {
                this.writeInfoLogin = false;
                this.username = '';
                this.password = '';
                this.errInfo = false;
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
            },
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
    .temperature-picker{
        padding: 20px;
        padding-bottom: 30px;
    }
    .home{
        // padding-top: 1.25rem;
        width:100%;
        position: relative;
        margin-bottom: 60px;
        // background-color: #F2F6F9;
        .log-out{
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding:0 15px;
            margin-bottom:10px;
            a{
                display: inline-block;
                text-decoration: none;
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
                    padding:10px 15px 0 15px;
                    .input{
                        border:1px solid #ccc;
                        margin-bottom: 10px;
                    }
                    .err{
                        font-size:13px;
                        color:#f86060;
                        padding:0 0 .625rem 0;
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
                    width:100%;
                    margin:20px 0;
                    // display: flex;
                    // justify-content: space-between;
                    // align-items: center;
                    // div{
                    //     width:80px;
                    //     height:80px;
                    //     color:#D1D3D7;
                    //     font-size: 20px;
                    //     line-height: 80px;
                    //     text-align: center;
                    //     border-radius: 80px;
                    //     border:2px solid #EFEEEE;
                    // }
                    // .active{
                    //     background-color: #1989FA;
                    //     color:#fff;
                    // }
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