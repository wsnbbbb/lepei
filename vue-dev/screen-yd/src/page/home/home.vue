<template>
  	<div>
       <div class="content">
           <div class="content-left">
               <h1>一日常规</h1>
               <div class="content-left-title">
                   <div class="content-left-title-l">点赞班级</div>
                   <div class="content-left-title-r">加油班级</div>
               </div>
               <div class="content-middle">
                    <div class="content-middle-left">
                        <h2>午间<br/>管理情况</h2>
                    </div>
                    <div class="content-middle-middle">
                        <vue-seamless-scroll :data="list1" :class-option="classOption" class="table-content">
                            <ul>
                                <li v-for="(item,index) in list1"  :key="index">
                                       {{item}}
                                </li>
                            </ul>
                        </vue-seamless-scroll>
                    </div>
                    <div class="content-middle-right">
                         <vue-seamless-scroll :data="list2" :class-option="classOption" class="table-content">
                            <ul>
                                <li v-for="(item,index) in list2"  :key="index">
                                       {{item}}
                                </li>
                            </ul>
                        </vue-seamless-scroll>

                    </div>
               </div>
               <div class="content-middle">
                    <div class="content-middle-left">
                        <h2>眼保<br/>健操情况</h2>
                    </div>
                    <div class="content-middle-middle">
                        <vue-seamless-scroll :data="list3" :class-option="classOption" class="table-content">
                            <ul>
                                <li v-for="(item,index) in list3"  :key="index">
                                       {{item}}
                                </li>
                            </ul>
                        </vue-seamless-scroll>
                    </div>
                    <div class="content-middle-right">
                         <vue-seamless-scroll :data="list4" :class-option="classOption" class="table-content">
                            <ul>
                                <li v-for="(item,index) in list4"  :key="index">
                                       {{item}}
                                </li>
                            </ul>
                        </vue-seamless-scroll>

                    </div>
               </div>
               <div class="content-middle content-bottom">
                    <div class="content-middle-left">
                        <h2>静校情况</h2>
                    </div>
                    <div class="content-middle-middle">
                        <h2>未关门班级</h2>
                        <vue-seamless-scroll :data="list5" :class-option="classOption" class="table-content">
                            <ul>
                                <li v-for="(item,index) in list5"  :key="index">
                                       {{item}}
                                </li>
                            </ul>
                        </vue-seamless-scroll>
                    </div>
                    <div class="content-middle-right">
                        <h2>未关电器班级</h2>
                         <vue-seamless-scroll :data="list6" :class-option="classOption" class="table-content">
                            <ul>
                                <li v-for="(item,index) in list6"  :key="index">
                                       {{item}}
                                </li>
                            </ul>
                        </vue-seamless-scroll>

                    </div>
               </div>
           </div>
           <div class="content-center">
               <h2>每周德育 第{{flagData.weekNum}}周</h2>
               <ul class="content-center-main">
                    <vue-seamless-scroll :data="flagData.list" :class-option="classOption" class="table-content1">
                        <ul>
                            <li v-for="(item,index) in flagData.list"  :key="index">
                                <h4>{{item.className}}</h4>
                                <img :src="flagUrl" v-show="item.hasFlag" />
                            </li>
                        </ul>
                    </vue-seamless-scroll>
               </ul>
           </div>
           <div class="content-right">
                <h2>天气信息</h2>
                <h2>{{weatherData.date}}&nbsp;&nbsp;&nbsp;&nbsp;{{weatherData.week}}&nbsp;&nbsp;&nbsp;&nbsp;{{weatherData.calendar}}</h2>
                <h1>{{weatherData.temp}}<span class="first-span">°C</span>&nbsp;<span class="second-span">{{weatherData.weather}}</span></h1>
                <h2 class="tips">
                     <vue-seamless-scroll :data="list3" :class-option="classOption" class="table-content">
                    {{weatherData.tips}}
                    </vue-seamless-scroll>
                </h2>
           </div>
       </div>
    </div>
</template>

<script>

import {cityGuess, hotcity, groupcity, getWeather, getEvaluation, getEvaluationFlag} from '../../service/getData'

export default {
    data(){
        return{
            list: [],
            list1: [],
            list2: [],
            list3: [],
            list4: [],
            list5: [],
            list6: [],
            flagUrl: '',
            flagData: {
                weekNum: '',
                
            },
            weatherData: {
                date: '',
                week: '',
                weather: '',
                temp: '',
                tips: '',
                calendar: '',
            }
        }
    },

	mounted(){

        getEvaluation({schoolId: 141}).then(res => {
            this.list1 = res.detail.oneTypes[0].thumbClasses
            this.list2 = res.detail.oneTypes[0].comeOnClasses
            this.list3 = res.detail.oneTypes[1].thumbClasses
            this.list4 = res.detail.oneTypes[1].comeOnClasses
            this.list5 = res.detail.twoTypes[0].childType[0].classNames
            this.list6 = res.detail.twoTypes[0].childType[1].classNames
        })

        getEvaluationFlag({schoolId:  141,}).then(res => {
            this.flagUrl = res.detail.flagUrl
            this.flagData.list = res.detail.list
            this.flagData.weekNum = res.detail.weekNum
        })

        this.getWeather()

        setInterval(() => {
            this.reload()
        }, 7200000);


         window.setInterval(function(){
            var refreshHours = new Date().getHours();
            var refreshMin = new Date().getMinutes();
            var refreshSec = new Date().getSeconds();
            if(refreshHours=='0' && refreshMin=='0' && refreshSec=='0'){
                // 指定每天凌晨做的事情
                this.reload()
            }
        }, 1000);
       
    },

    components:{

    },

    computed:{
        classOption () {
            return {
                step: 0.6,
            }
        },

    },

    methods:{
        reload(){
            window.location.reload()
        },
        getWeather(){
             getWeather().then(res => {
                this.weatherData.date = res.detail.date;
                this.weatherData.week = res.detail.week;
                this.weatherData.weather = res.detail.weather;
                this.weatherData.temp = res.detail.temp;
                this.weatherData.tips = res.detail.tips;
                this.weatherData.calendar = res.detail.calendar;
            })
        },
    
    },
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .table-content {
        height: 65px;
        overflow: hidden;
    }
    .table-content1>div ul{
          padding-top: 10px!important;
    }
     .table-content1 {
        height: 260px;
        overflow: hidden;
        padding-bottom: 20px;
    }
    .content{
        display: block;
        margin: 0 auto;
        width: 1378px;
        height: 413px;
        background: url('../../images/bg.jpg');
        background-repeat: no-repeat;
        background-size: 100%;
        position: relative;

    }
    .content-left{
        height: 300px;
        width: 300px;
        position: absolute;
        // border: 1px solid red;
        left: 70px;
        top: 70px;
        h1{
            font-size: 16px;
            font-weight: 700;
            text-align: center;

        }
    }
    .content-left-title{
        margin-top: 8px;
        height: 32px;
        overflow: hidden;
        .content-left-title-l{
            font-size: 16px;
            display: inline-block;
            float: left;
            width: 128px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            margin-left: 67px;
            color: #e42b2a;
            font-weight: 700;
        }
         .content-left-title-r{
            font-size: 16px;
            display: inline-block;
            float: left;
            width: 100px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            color: #005508;
            font-weight: 700;
        }
    }
    .content-middle{
        height: 89px;
        overflow: hidden;
        padding-top: 3px;
        .content-middle-left{
            float: left;
            width: 65px;
            height: 100%;
            h2{
                font-size: 14px;
                text-align: center;
                color: #0278bb;
                padding-top: 24px;
                font-weight: 700;
            }
        }
        .content-middle-middle{
            h2{
                padding-top: 2px;
                font-size: 14px;
                       color: #0278bb;
            }
            width: 128px;
            font-size: 14px;
            display: inline-block;
            float: left;
            h4{
                text-align: center;
                color: #229c9d;
            }
            .table-content{
                height: 92px;
                li{
                    text-align: center;
                    color: #229c9d;
                }
            }

        }
        .content-middle-right{
             h2{
                padding-top: 2px;
                font-size: 14px;
                color: #0278bb;
            }
            width: 100px;
            font-size: 14px;
            display: inline-block;
            float: left;
            h4{
                text-align: center;
                color: #229c9d;
            }
            .table-content{
                 height: 92px;
                li{
                    text-align: center;
                    color: #229c9d;
                }
            }
        }
    }
    .content-bottom{
        .content-middle-middle{
           color: #0278bb;
           text-align: center;
           height: 54px;
           overflow: hidden;
        }
        .content-middle-right{
           color: #0278bb;
           text-align: center;
           height: 54px;
           overflow: hidden;
        }
    }
    .content-center{
        width: 530px;
        height: 300px;
        position: absolute;
        left: 415px;
        top: 70px;
        h2{
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            padding-top: 5px;

        }
    }

    .content-center-main{
        margin-left: 3px;
        li{
            width: 83px;
            height: 97px;
            display: block;
            background: url('../../images/icon-bg.png');
            background-repeat: no-repeat;
            font-size: 16px;
            text-align: center;
            margin: 0 2px;
            padding-top: 24px;
            float: left;
            margin-top: -10px;
            h4{
                font-size: 14px;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
            img{
                width: 40px;
                height: 40px;
            }
        }
    }
    .content-right{
        width: 330px;
        height: 300px;
        position: absolute;
        top: 70px;
        left: 1000px;
        h2{
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            padding-top: 5px;
        }
        .tips{
            text-align: left;
            padding-left: 35px;
            padding-right: 35px;
            height: 40px;
            padding-top: 40px;
        }
        h1{
            font-size: 70px;
            color: #fe811c;
            padding-top: 25px;
            text-align: center;
            span{
                font-size: 24px;
                color: #fbc112;
            }
            .first-span{
                color: #fe811c;
            }
        }
    }
    .second-span{
        text-align: left;
        display: inline-block;
        width: 120px;
    }
</style>
