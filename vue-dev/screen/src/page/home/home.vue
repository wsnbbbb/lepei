<template>
    <div>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                 <div class="swiper-slide">
                    <h2 class="school-name">{{title}}</h2>
                    <div class="wrap">
                        <div class="item today-cg" v-show="model.page1.cusume" :style="{order: model.page1.cusume.order}">
                            <p class="title">今日常规</p>
                            <div class="content">
                                <ul class="title-ul">
                                    <li></li>
                                    <li class="zan">点赞班级</li>
                                    <li>加油班级</li>
                                </ul>
                                <ul class="wujian-ul">
                                    <li class="left-text">{{special.oneTypes[0]&&special.oneTypes[0].typeName}}</li>
                                    <li class="center">
                                        <ul class="wujian-center-ul">
                                            <li v-for="item in special.oneTypes[0].thumbClasses">{{item}}</li>
                                        </ul>
                                    </li>
                                    <li class="center">
                                        <ul class="wujian-center-ul">
                                            <li v-for="item in special.oneTypes[0].comeOnClasses">{{item}}</li>
                                        </ul>
                                    </li>
                                </ul>
                                <ul class="wujian-ul">
                                    <li class="left-text">{{special.oneTypes[1]&&special.oneTypes[1].typeName}}</li>
                                    <li class="center">
                                        <ul class="wujian-center-ul">
                                            <li v-for="item in special.oneTypes[1].thumbClasses">{{item}}</li>
                                        </ul>
                                    </li>
                                    <li class="center">
                                        <ul class="wujian-center-ul">
                                            <li v-for="item in special.oneTypes[1].comeOnClasses">{{item}}</li>
                                        </ul>
                                    </li>
                                </ul>
                                <ul class="wujian-ul jingxiao">
                                    <li class="left-text">{{special.twoTypes[0]&&special.twoTypes[0].typeName}}</li>
                                    <li class="center">
                                        <div class="first-div">
                                            <div class="left">
                                                {{special.twoTypes[0].childType[0]&&special.twoTypes[0].childType[0].typeName}}：
                                            </div>
                                            <div class="classBox">
                                                <span class="className" v-for="item in special.twoTypes[0].childType[0].classNames">{{item}}</span>
                                            </div>
                                        </div>
                                        <div class="first-div second-div">
                                             <div class="left">
                                                {{special.twoTypes[0].childType[1].typeName}}：
                                            </div>
                                            <div class="classBox">
                                                <span class="className" v-for="item in special.twoTypes[0].childType[1].classNames">{{item}}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>

                            </div>
                        </div>
                        <div class="item item2 per-deyu" v-show="model.page1.eCard" :style="{order: model.page1.eCard.order}">
                            <p class="title">每周德育</p>
                            <div class="main-content">
                                <div class="top-title">第{{meizhouDeyu.weekNum}}周</div>
                                <ul class="deyu-ul">
                                    <li v-for="item in meizhouDeyu.list">
                                        <p>{{item.className}}</p>
                                        <div>
                                            <img :src="meizhouDeyu.flagUrl" alt="">
                                        </div>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    
               
               
                    </div>
                </div>
                <div class="swiper-slide">
                    <h2 class="school-name">{{title}}</h2>
                    <div class="wrap">
                        <div class="item item1 cusume" v-show="model.page1.cusume" :style="{order: model.page1.cusume.order}">
                            <p class="title">校园消费</p>
                            <div class="content">
                                <div class="head">
                                    <div>
                                        本学期消费金额<br/>
                                        <span class="green">{{consume.totalMoney}}</span>
                                    </div>
                                    <div>
                                        本学期消费人次<br/>
                                        <span class="purple">{{consume.totalPersonTime}}</span>
                                    </div>
                                </div>
                                <div id="c1"></div>
                            </div>
                        </div>
                        <div class="item item2 eCard" v-show="model.page1.eCard" :style="{order: model.page1.eCard.order}">
                            <p class="title">电子班牌</p>
                            <div class="content">
                                <div class="c-l-content">
                                    <div class="c-l-content-text">班牌监控</div>
                                    <div class="c-l-content-main">
                                        <div class="first">
                                            <div id="mountNode"></div>
                                        </div>
                                        <div class="second">
                                            <div class="scroll-box">
                                                <vue-seamless-scroll :class-option="classOption" :data="listData" class="warp">
                                                    <ul>
                                                        <li v-for="item in eCard.offLineMac">
                                                            <span>{{item}}</span>
                                                        </li>
                                                    </ul>
                                                </vue-seamless-scroll>
                                            </div>
                                            <div class="second-bottom">
                                                <div>
                                                    {{eCard.online}}<br/>
                                                    在线
                                                </div>
                                                <div>
                                                    {{eCard.offLine}}<br/>
                                                    离线
                                                </div>
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>
                                <div>
                                    <div class="common-title">
                                       <div class="common-left">班牌使用统计
                                        </div>
                                        <div class="common-right">
                                            <ul>
                                                <li v-on:click="changeType(1, 'eCard')" v-bind:class="{ active: type.eCard ==1 }">本月</li>
                                                <li v-on:click="changeType(2, 'eCard')" v-bind:class="{ active: type.eCard ==2 }">本学期</li>
                                                <li v-on:click="changeType(3, 'eCard')" v-bind:class="{ active: type.eCard ==3 }">累计</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="item2-bottom">
                                        <div id="mountNode1" ref="mountNode1"></div>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                        <div class="item item3 studentLeave" v-show="model.page1.studentLeave" :style="{order: model.page1.studentLeave.order}">
                            <p class="title">学生请假</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'studentLeave')" v-bind:class="{ active: type.studentLeave ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'studentLeave')" v-bind:class="{ active: type.studentLeave ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'studentLeave')" v-bind:class="{ active: type.studentLeave ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item2-bottom">
                                <div id="mountNode2" ref="mountNode2"></div>
                            </div>
                        </div>
                        <div class="item item4 teacherLeave" v-show="model.page1.teacherLeave" :style="{order: model.page1.teacherLeave.order}">
                            <p class="title">教师请假</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'teacherLeave')" v-bind:class="{ active: type.teacherLeave ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'teacherLeave')" v-bind:class="{ active: type.teacherLeave ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'teacherLeave')" v-bind:class="{ active: type.teacherLeave ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item4-bottom">
                                <div id="mountNode3"  ref="mountNode3"></div>
                            </div>
                        </div>
                        <div class="item item5 coin" v-show="model.page1.coin" :style="{order: model.page1.coin.order}">
                             <p class="title">益小币</p>
                             <ul class="top">
                                 <li>资产总额 {{financial.total}}</li>
                                 <li>本月收入 {{financial.income}}</li>
                                 <li>本月支出 {{financial.expenditure}}</li>
                             </ul>
                             <div class="item5-bottom">
                                 <div class="item5-bottom-l">
                                    <h2>班级财富榜</h2>
                                    <div id="mountNode4" ref="mountNode4"></div>
                                 </div>
                                  <div class="item5-bottom-r">
                                    <h2>个人财富榜</h2>
                                     <ul class="item5-bottom-r-ul">
                                           <li :key="index" v-for="(item, index) in financial.topList">
                                              <span class="li-left">{{index+1}}</span> 
                                              <span class="li-middle">{{item.name}}</span> 
                                              <span class="li-right">{{item.money}}</span> 
                                           </li>            
                                       </ul>
                                 </div>
                             </div>
                        </div>
                        <div class="item item6 opinion" v-show="model.page1.opinion" :style="{order: model.page1.opinion.order}">
                            <p class="title">意见反馈</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'opinion')" v-bind:class="{ active: type.opinion ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'opinion')" v-bind:class="{ active: type.opinion ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'opinion')" v-bind:class="{ active: type.opinion ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item4-bottom">
                                <div id="mountNode6" ref="mountNode6"></div>
                            </div>
                        </div>
                        <div class="item item2 item8 todayDeyu" v-show="model.page1.todayDeyu" :style="{order: model.page1.todayDeyu.order}">
                            <p class="title">今日德育</p>
                            <div class="item7-content">
                               <div class="i8-left">
                                   <ul class="i8-l-title">
                                       <li class="i8-l-main-name">班级</li>
                                       <li v-for="item in todayDeyu.showX">{{item.name}}</li>
                                   </ul>
                                   <div class="scroll-wrap" v-show='renderScroll'>
                                        <vue-seamless-scroll :data="listData" class="seamless-warp">
                                            <ul v-for="item in todayDeyu.class" class="i8-l-main">
                                                <li class="i8-l-main-name">{{item.className}}</li>
                                                <li v-for="i in item.scores">{{i}}</li>
                                            </ul>
                                        </vue-seamless-scroll>
                                   </div>
                               </div>
                               <!-- <div class="i8-l-bottom">
                                   434zs        
                               </div> -->
                               <div class="i8-right">
                                   <div class="i8-right-div">
                                       <h2>上周德育考评q</h2>
                                        <div class="scroll-wrap1">
                                            <vue-seamless-scroll>
                                                <!-- <ul class="i8-right-div-main"> -->
                                                    <li>
                                                        <span>1</span> 
                                                        <span>一年级一班</span> 
                                                        <span>44</span> 
                                                    </li>
                                                        <li>
                                                        <span>1</span> 
                                                        <span>一年级一班</span> 
                                                        <span>44</span> 
                                                    </li>
                                                        <li>
                                                        <span>1</span> 
                                                        <span>一年级一班</span> 
                                                        <span>44</span> 
                                                    </li>
                                                      <li>
                                                        <span>1</span> 
                                                        <span>一年级一班</span> 
                                                        <span>44</span> 
                                                    </li>
                                                      <li>
                                                        <span>1</span> 
                                                        <span>一年级一班</span> 
                                                        <span>44</span> 
                                                    </li>
                                                      <li>
                                                        <span>1</span> 
                                                        <span>一年级一班</span> 
                                                        <span>44</span> 
                                                    </li>
                                                      <li>
                                                        <span>1</span> 
                                                        <span>一年级一班</span> 
                                                        <span>44</span> 
                                                    </li>
                                                      <li>
                                                        <span>1</span> 
                                                        <span>一年级一班</span> 
                                                        <span>44</span> 
                                                    </li>
                                            

                                                <!-- </ul> -->
                                             </vue-seamless-scroll>
                                        </div>
                                   </div>
                               </div>
                            </div>
                            
                           
                        </div>
                        <div class="item item2 item7 schoolSurvey" v-show="model.page1.schoolSurvey" :style="{order: model.page1.schoolSurvey.order}">
                            <p class="title">校园概况</p>
                            <div class="item7-content">
                                <div>
                                    <div class="c-item">
                                        <img src="../../images/icon-student.png" alt="">
                                        <span>
                                            <h3>学生人数</h3>
                                            <h2>{{schoolSurvey.student}}</h2>
                                        </span>
                                    </div>
                                    <div class="c-item">
                                        <img src="../../images/icon-teacher.png" alt="">
                                        <span>
                                            <h3>教职工人数</h3>
                                            <h2>{{schoolSurvey.teacher}}</h2>
                                        </span>
                                    
                                    </div>
                                    <div class="c-item">
                                        <img src="../../images/icon-parent.png" alt="">
                                        <span>
                                            <h3>家长人数</h3>
                                            <h2>{{schoolSurvey.parents}}</h2>
                                        </span>
                                    </div>
                                    
                                </div>
                                <div>
                                    <div class="c-item">
                                        <img src="../../images/icon-book.png" alt="">
                                        <span>
                                            <h3>年级数</h3>
                                            <h2>{{schoolSurvey.grade}}</h2>
                                        </span>
                                    </div>
                                    <div class="c-item">
                                        <img src="../../images/icon-person.png" alt="">
                                        <span>
                                            <h3>班级数</h3>
                                            <h2>{{schoolSurvey.class}}</h2>
                                        </span>
                                    
                                    </div>
                                    <div class="c-item">
                                        <img src="../../images/icon-account.png" alt="">
                                        <span>
                                            <h3>家长绑卡率</h3>
                                            <h2>{{schoolSurvey.studentHasBind}}</h2>
                                        </span>
                                    </div>
                                    </div>
                                </div>
                           
                        </div>
                        <div class="item item9 repair" v-show="model.page1.repair" :style="{order: model.page1.repair.order}">
                            <p class="title">报事报修</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'repair')" v-bind:class="{ active: type.repair ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'repair')" v-bind:class="{ active: type.repair ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'repair')" v-bind:class="{ active: type.repair ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item4-bottom">
                                <h2>累计上报 
                                    <span>{{newRepair.total}}</span>
                                </h2>
                                <div id="mountNode8" ref="mountNode8"></div>
                            </div>
                        </div>
                        <div class="item item10 infoPublish" v-show="model.page1.infoPublish" :style="{order: model.page1.infoPublish.order}">
                            <p class="title">信息发布</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'publish')" v-bind:class="{ active: type.publish ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'publish')" v-bind:class="{ active: type.publish ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'publish')" v-bind:class="{ active: type.publish ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item4-bottom">
                                <div id="mountNode10" ref="mountNode10"></div>
                            </div>
                        </div>
                        <div class="item item11 todayAttendance" v-show="model.page1.todayAttendance" :style="{order: model.page1.todayAttendance.order}">
                            <p class="title">今日考勤</p>
                            <div class="content">
                                <div class="head">
                                    <div class="left">
                                        已考勤 {{todayAttence.normal}}<br/>
                                        <span class="green">{{Math.round(todayAttence.normal/todayAttence.total)}}%</span>
                                    </div>
                                    <div class="right">
                                        未考勤 {{todayAttence.normal}}<br/>
                                        <span class="purple">{{Math.round(todayAttence.normal/todayAttence.total)}}%</span>
                                    </div>
                                </div>
                                <div class="content-main">
                                    <div class="item">
                                        <div id="mountNode11"></div>
                                        <h2>正常 {{todayAttence.normal}}人</h2>
                                    </div>
                                    <div class="item">
                                        <div id="mountNode12"></div>
                                        <h2>迟到 {{todayAttence.late}}人</h2>
                                    </div>
                                    <div class="item">
                                        <div id="mountNode13"></div>
                                        <h2>请假 {{todayAttence.leave}}人</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item item4 teacherTrain"  v-show="model.page1.teacherTrain" :style="{order: model.page1.teacherTrain.order}">
                            <p class="title">教师培训</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'teacherTrain')" v-bind:class="{ active: type.teacherTrain ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'teacherTrain')" v-bind:class="{ active: type.teacherTrain ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'teacherTrain')" v-bind:class="{ active: type.teacherTrain ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item4-bottom">
                                <div id="mountNode14"  ref="mountNode14"></div>
                            </div>
                        </div>
                    </div>
                </div>
                    
                <div class="swiper-slide">
                    <h2 class="school-name">{{title}}</h2>
                    <div class="wrap">
                        <div class="item item1 cusume" v-show="model.page2.cusume" :style="{order: model.page2.cusume.order}">
                            <p class="title">校园消费</p>
                            <div class="content">
                                <div class="head">
                                    <div>
                                        本学期消费金额<br/>
                                        <span class="green">12313</span>
                                    </div>
                                    <div>
                                        本学期消费人次<br/>
                                        <span class="purple">12313</span>
                                    </div>
                                </div>
                                <div id="c1"></div>
                            </div>
                        </div>
                        <div class="item item2 eCard" v-show="model.page2.eCard" :style="{order: model.page2.eCard.order}">
                            <p class="title">电子班牌</p>
                            <div class="content">
                                <div class="c-l-content">
                                    <div class="c-l-content-text">班牌监控</div>
                                    <div class="c-l-content-main">
                                        <div class="first">
                                            <div id="mountNode"></div>
                                        </div>
                                        <div class="second">
                                            <div class="scroll-box">
                                                <vue-seamless-scroll :data="listData" :class-option="classOption" class="warp">
                                                    <ul >
                                                        <li v-for="item in listData">
                                                            <span class="date" v-text="item.date"></span>
                                                        </li>
                                                    </ul>
                                                </vue-seamless-scroll>
                                            </div>
                                            <div class="second-bottom">
                                                <div>
                                                    100<br/>
                                                    在线
                                                </div>
                                                <div>
                                                    100<br/>
                                                    离线
                                                </div>
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>
                                <div>
                                    <div class="common-title">
                                       <div class="common-left">班牌使用统计
                                        </div>
                                        <div class="common-right">
                                            <ul>
                                                <li class="active">本月</li>
                                                <li>本学期</li>
                                                <li>累计</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="item2-bottom">
                                        <div id="mountNode1" ref="mountNode1"></div>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                        <div class="item item3 studentLeave" v-show="model.page2.studentLeave" :style="{order: model.page2.studentLeave.order}">
                            <p class="title">学生请假</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'studentLeave')" v-bind:class="{ active: type.studentLeave ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'studentLeave')" v-bind:class="{ active: type.studentLeave ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'studentLeave')" v-bind:class="{ active: type.studentLeave ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item2-bottom">
                                <div id="mountNode2" ref="mountNode2"></div>
                            </div>
                        </div>
                        <div class="item item4 teacherLeave" v-show="model.page2.teacherLeave" :style="{order: model.page2.teacherLeave.order}">
                            <p class="title">教师请假</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'teacherLeave')" v-bind:class="{ active: type.teacherLeave ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'teacherLeave')" v-bind:class="{ active: type.teacherLeave ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'teacherLeave')" v-bind:class="{ active: type.teacherLeave ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item4-bottom">
                                <div id="mountNode3"  ref="mountNode3"></div>
                            </div>
                        </div>
                        <div class="item item5 coin" v-show="model.page2.coin" :style="{order: model.page2.coin.order}">
                             <p class="title">益小币</p>
                             <ul class="top">
                                 <li>资产总额 {{financial.total}}</li>
                                 <li>本月收入 {{financial.income}}</li>
                                 <li>本月支出 {{financial.expenditure}}</li>
                             </ul>
                             <div class="item5-bottom">
                                 <div class="item5-bottom-l">
                                    <h2>班级财富榜</h2>
                                    <div id="mountNode4" ref="mountNode4"></div>
                                 </div>
                                  <div class="item5-bottom-r">
                                    <h2>个人财富榜</h2>
                                     <ul class="item5-bottom-r-ul">
                                           <li :key="index" v-for="(item, index) in financial.topList">
                                              <span class="li-left">{{index+1}}</span> 
                                              <span class="li-middle">{{item.name}}</span> 
                                              <span class="li-right">{{item.money}}</span> 
                                           </li>            
                                       </ul>
                                 </div>
                             </div>
                        </div>
                        <div class="item item6 opinion" v-show="model.page2.opinion" :style="{order: model.page2.opinion.order}">
                            <p class="title">意见反馈</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'opinion')" v-bind:class="{ active: type.opinion ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'opinion')" v-bind:class="{ active: type.opinion ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'opinion')" v-bind:class="{ active: type.opinion ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item4-bottom">
                                <div id="mountNode6" ref="mountNode6"></div>
                            </div>
                        </div>
                        <div class="item item2 item8 todayDeyu" v-show="model.page2.todayDeyu" :style="{order: model.page2.todayDeyu.order}">
                            <p class="title">今日德育</p>
                            <div class="item7-content">
                               <div class="i8-left">
                                   <ul class="i8-l-title">
                                       <li class="i8-l-main-name">班级</li>
                                       <li>早读</li>
                                       <li>眼保健操</li>
                                       <li>大课间</li>
                                       <li>路队</li>
                                       <li>早读</li>
                                       <li>班级纪律</li>
                                       <li class="total-score">总分</li>
                                   </ul>
                                   <ul class="i8-l-main">
                                       <li class="i8-l-main-name">三年级一班</li>
                                       <li>1</li>
                                       <li>2</li>
                                       <li>3</li>
                                       <li>4</li>
                                       <li>5</li>
                                       <li>55</li>
                                       <li class="total-score">22</li>
                                   </ul>
                                   <ul class="i8-l-main">
                                       <li class="i8-l-main-name">三年级一班</li>
                                       <li>1</li>
                                       <li>2</li>
                                       <li>3</li>
                                       <li>4</li>
                                       <li>5</li>
                                       <li>55</li>
                                       <li class="total-score">22</li>
                                   </ul>
                                   
                               </div>
                               <div class="i8-right">
                                   <div class="i8-right-div">
                                       <h2>上周德育考评1</h2>
                                       <ul class="i8-right-div-top">
                                           <li>
                                              <span class="index">1</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                              <span class="main">一年级一班</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                              <span class="point">44</span> 
                                           </li>
                                            <li>
                                              <span class="index">1</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                              <span class="main">一年级一班</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                              <span class="point">44</span> 
                                           </li>
                                            <li>
                                              <span class="index">1</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                              <span class="main">一年级一班</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                              <span class="point">44</span> 
                                           </li>
                                            <li>
                                              <span class="index">1</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                              <span class="main">一年级一班</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                              <span class="point">44</span> 
                                           </li>
                                           
                                       </ul>
                                      
                                   </div>
                               </div>
                            </div>
                            
                           
                        </div>
                        <div class="item item2 item7 schoolSurvey" v-show="model.page2.schoolSurvey" :style="{order: model.page2.schoolSurvey.order}">
                            <p class="title">校园概况</p>
                            <div class="item7-content">
                                <div>
                                    <div class="c-item">
                                        <img src="../../images/icon-student.png" alt="">
                                        <span>
                                            <h3>学生人数</h3>
                                            <h2>{{schoolSurvey.student}}</h2>
                                        </span>
                                    </div>
                                    <div class="c-item">
                                        <img src="../../images/icon-teacher.png" alt="">
                                        <span>
                                            <h3>教职工人数</h3>
                                            <h2>{{schoolSurvey.teacher}}</h2>
                                        </span>
                                    
                                    </div>
                                    <div class="c-item">
                                        <img src="../../images/icon-parent.png" alt="">
                                        <span>
                                            <h3>家长人数</h3>
                                            <h2>{{schoolSurvey.parents}}</h2>
                                        </span>
                                    </div>
                                    
                                </div>
                                <div>
                                    <div class="c-item">
                                        <img src="../../images/icon-book.png" alt="">
                                        <span>
                                            <h3>年级数</h3>
                                            <h2>{{schoolSurvey.grade}}</h2>
                                        </span>
                                    </div>
                                    <div class="c-item">
                                        <img src="../../images/icon-person.png" alt="">
                                        <span>
                                            <h3>班级数</h3>
                                            <h2>{{schoolSurvey.class}}</h2>
                                        </span>
                                    
                                    </div>
                                    <div class="c-item">
                                        <img src="../../images/icon-account.png" alt="">
                                        <span>
                                            <h3>家长绑卡率</h3>
                                            <h2>{{schoolSurvey.studentHasBind}}</h2>
                                        </span>
                                    </div>
                                    </div>
                                </div>
                           
                        </div>
                        <div class="item item9 repair" v-show="model.page2.repair" :style="{order: model.page2.repair.order}">
                            <p class="title">报事报修</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'repair')" v-bind:class="{ active: type.repair ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'repair')" v-bind:class="{ active: type.repair ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'repair')" v-bind:class="{ active: type.repair ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item4-bottom">
                                <h2>累计上报 
                                    <span>{{newRepair.total}}</span>
                                </h2>
                                <div id="mountNode8" ref="mountNode8"></div>
                            </div>
                        </div>
                        <div class="item item10 infoPublish" v-show="model.page2.infoPublish" :style="{order: model.page2.infoPublish.order}">
                            <p class="title">信息发布</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'publish')" v-bind:class="{ active: type.publish ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'publish')" v-bind:class="{ active: type.publish ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'publish')" v-bind:class="{ active: type.publish ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item4-bottom">
                                <div id="mountNode10" ref="mountNode10"></div>
                            </div>
                        </div>
                        <div class="item item11 todayAttendance" v-show="model.page2.todayAttendance" :style="{order: model.page2.todayAttendance.order}">
                            <p class="title">今日考勤</p>
                            <div class="content">
                                <div class="head">
                                    <div class="left">
                                        已考勤 {{todayAttence.normal}}<br/>
                                        <span class="green">{{Math.round(todayAttence.normal/todayAttence.total)}}%</span>
                                    </div>
                                    <div class="right">
                                        未考勤 {{todayAttence.normal}}<br/>
                                        <span class="purple">{{Math.round(todayAttence.normal/todayAttence.total)}}%</span>
                                    </div>
                                </div>
                                <div class="content-main">
                                    <div class="item">
                                        <div id="mountNode11"></div>
                                        <h2>正常 {{todayAttence.normal}}人</h2>
                                    </div>
                                    <div class="item">
                                        <div id="mountNode12"></div>
                                        <h2>迟到 {{todayAttence.late}}人</h2>
                                    </div>
                                    <div class="item">
                                        <div id="mountNode13"></div>
                                        <h2>请假 {{todayAttence.leave}}人</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item item4 teacherTrain"  v-show="model.page2.teacherTrain" :style="{order: model.page2.teacherTrain.order}">
                            <p class="title">教师培训</p>
                            <div class="common-title">
                                <div class="common-left">
                                </div>
                                <div class="common-right">
                                    <ul>
                                        <li v-on:click="changeType(1, 'teacherTrain')" v-bind:class="{ active: type.teacherTrain ==1 }">本月</li>
                                        <li v-on:click="changeType(2, 'teacherTrain')" v-bind:class="{ active: type.teacherTrain ==2 }">本学期</li>
                                        <li v-on:click="changeType(3, 'teacherTrain')" v-bind:class="{ active: type.teacherTrain ==3 }">累计</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="item4-bottom">
                                <div id="mountNode14"  ref="mountNode14"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    	<!-- <foot-guide></foot-guide> -->
    </div>    
</template>

<script>
import {mapMutations} from 'vuex'

import { getStudentLeave, getTeacherLeave, getConsume, getYzFinancial, 
getYzFinancialWeekRecord, getClassCard, getSchoolSurvey, getNewRepair, 
getPublish, getOpinion, getTodayAttendance, getTeacherTrain,
getPosition, getTodayScoreRecords, getFlag, getEvaluationShow} from 'src/service/getData'

import 'src/plugins/swiper.min.js'
import 'src/style/swiper.min.css'
import G2 from '@antv/g2';
import DataSet from '@antv/data-set';

export default {
	data(){
        return {
            title: '校园大数据',
            renderScroll: false,
            test: [],
            model: {
                page1:{
                    cusume:{
                        order: 1
                    },
                    eCard:{
                        order: 2
                    },
                    studentLeave:{
                        order: 3
                    },
                    teacherLeave:{
                        order: 4
                    },
                    coin:{
                        order: 5
                    },
                    opinion:{
                        order: 6
                    },
                    // todayDeyu:{
                    //     order: 5
                    // },
                    // schoolSurvey: {
                    //     order: 5
                    // },
                    // repair: {
                    //      order: 5
                    // },
                    // infoPublish:{
                    //     order: 5
                    // },
                    // todayAttendance:{
                    //     order: 5
                    // },
                    // teacherTrain: {
                    //     order: 5
                    // }
                },
                page2:{
                    // cusume:{
                    //     order: 1
                    // },
                    // eCard:{
                    //     order: 2
                    // },
                    // studentLeave:{
                    //     order: 3
                    // },
                    // teacherLeave:{
                    //     order: 4
                    // },
                    // coin:{
                    //     order: 5
                    // },
                    // opinion:{
                    //     order: 6
                    // },
                    todayDeyu:{
                        order: 1
                    },
                    schoolSurvey: {
                        order: 4
                    },
                    repair: {
                        order: 2
                    },
                    infoPublish:{
                        order: 3
                    },
                    todayAttendance:{
                        order: 5
                    },
                    teacherTrain: {
                        order: 6
                    }
                }
               
            },
            type: {
                repair: 1,
                studentLeave: 1,
                teacherLeave: 1,
                teacherTrain: 1,
                publish: 1,
                opinion: 1,
                eCard: 1
            },
            allMethod: {
                repair: this.getNewRepair,
                studentLeave: this.getStudentLeave,
                teacherLeave: this.getTeacherLeave,
                teacherTrain: this.getTeacherTrain,
                publish: this.getPublish,
                opinion: this.getOpinion,
                eCard: this.getClassCard,

            },
            financial: {
                expenditure: 0,
                income: 0,
                total: 0,
                topList: []
            },
            schoolSurvey: {
                class: 0,
                grade: 0,
                parents: 0,
                student: 0,
                studentHasBind: 0,
                teacher: 0
            },
            newRepair: {
                total: 0
            },
            todayAttence: {
                late: 0,
                leave: 0,
                normal: 0,
                total: 0
            },
            consume: {
                totalMoney: 0,
                totalPersonTime: 0
            },
            eCard: {
                online: 0,
                offLine: 0,
                offLineMac: []
            },
            meizhouDeyu: {
                weekNum: '',
                flagUrl: '',
                list: []
            },

            todayDeyu: {
                class: [],
                showX: []
            },
            special: {
                oneTypes: [
                    {
                        typeName: "午间管理情况",
                        thumbClasses: [],
                        comeOnClasses: []
                    },
                    {
                        typeName: "放学路队情况",
                        thumbClasses: [],
                        comeOnClasses: []
                    }
                ],
                twoTypes: [
                    {
                        typeName: "静校情况",
                        childType: [
                            {
                                typeName: "",
                                classNames: []
                            },
                            {
                                typeName: "",
                                classNames: []
                            }

                        ],
                    }
                ],

            },
        	geohash: '', // city页面传递过来的地址geohash
            msiteTitle: '请选择地址...', // msite页面头部标题
            foodTypes: [], // 食品分类列表
            hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
            imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
            listData: [{
                   'title': '一行',
                   'date': '2017-12-11'
                 }, {
                    'title': '二行',
                    'date': '2017-12-12'
                 }, {
                     'title': '三行',
                     'date': '2017-12-13'
                 }, {
                     'title': '四行',
                     'date': '2017-12-14'
                 }, {
                     'title': '五行',
                     'date': '2017-12-15'
                 }, {
                     'title': '六行',
                     'date': '2017-12-16'
                 }, {
                     'title': '七行',
                     'date': '2017-12-17'
                 }, {
                     'title': '八行',
                     'date': '2017-12-18'
                 }, {
                     'title': '九行',
                     'date': '2017-12-19'
                 }]
                
            
        }
    },
   created() {
       debugger
        // this.$nextTick(() => {
        //     this.getClassCard()
        // })
    },
    mounted(){
        debugger
        // 	//初始化swiper
        // new Swiper('.swiper-container', {
        //     // pagination: '.swiper-pagination',
        //     // loop: true
        // });

        // this.getEvaluationShow();


        // console.log(document.body.clientWidth)

    //    this.render()
    //    this.render2()
    //    this.render3()

    //    this.getTeacherLeave(1)
    //    this.getConsume()
    //    this.getYzFinancial()
    //    this.getYzFinancialWeekRecord()
       

        // this.getClassCard()//获取数据接口方法
      
    //    this.getSchoolSurvey()

        // this.allMethod.repair(1)
        // this.allMethod.studentLeave(1)
        // this.getPublish(1)
        // this.getOpinion(1)

        // this.getTodayAttendance()
        // this.getTeacherTrain(1)

        // this.getPosition();

        // this.init()

        // this.getTodayScoreRecords()
    },
    components: {
    	// headTop,
    	// shopList,
    	// footGuide,
    },
  
    computed: {
            classOption: function () {
                return {
                //   step: 0.2,
                //   hoverStop:true,
                  openWatch: true,
                  limitMoveNum: 0,

                }
            },
         
    },
    methods: {
    
        // initWidth: function (val) {
        //     return (window.screen.width/1920)*val
        // },
        // async getPosition(){

        //     let res = await getPosition({
        //                         schoolId: this.$route.params.id,
        //                     });
            
        //     let page1 = {}
        //     let page2 = {}
        //     debugger
        //     res.detail.list.map((item)=>{
        //         item.navs.map(i=>{
        //             switch (i.code){
        //                 case 'school-info':
        //                     item.page === 1? page1.schoolSurvey={order: i.position}: page2.schoolSurvey={order: i.position}
        //                 break;
        //                 case 'student-leave':
        //                     item.page === 1? page1.studentLeave={order: i.position}: page2.studentLeave={order: i.position}
        //                 break;
        //                 case 'teacher-leave':
        //                     item.page === 1? page1.teacherLeave={order: i.position}: page2.teacherLeave={order: i.position}
        //                 break;
        //                 case 'class-score':
        //                     item.page === 1? page1.todayDeyu={order: i.position}: page2.todayDeyu={order: i.position}
        //                 break;
        //                 case 'today-attendce':
        //                     item.page === 1? page1.todayAttendance={order: i.position}: page2.todayAttendance={order: i.position}
        //                 break;
        //                 case 'article-publish':
        //                     item.page === 1? page1.infoPublish={order: i.position}: page2.infoPublish={order: i.position}
        //                 break;
        //                 case 'class-card':
        //                     item.page === 1? page1.eCard={order: i.position}: page2.eCard={order: i.position}
        //                 break;
        //                 case 'repair':
        //                     item.page === 1? page1.repair={order: i.position}: page2.repair={order: i.position}
        //                 break;
        //                 case 'consume':
        //                     item.page === 1? page1.cusume={order: i.position}: page2.cusume={order: i.position}
        //                 break;
        //                 case 'financial':
        //                     item.page === 1? page1.coin={order: i.position}: page2.coin={order: i.position}
        //                 break;
        //                 case 'opinion':
        //                     item.page === 1? page1.opinion={order: i.position}: page2.opinion={order: i.position}
        //                 break;
        //                  case 'out-train':
        //                     item.page === 1? page1.teacherTrain={order: i.position}: page2.teacherTrain={order: i.position}
        //                 break;
        //             }
        //         })
        //     })
        //     this.title = res.detail.title
        //     this.model.page1 = page1
        //     this.model.page2 = page2


        //     // this.init()

          
        // },

        // changeType(type, target){
        //     this.type[target] = type
        //     this.allMethod[target](type, true)
        // },
        // init(){
        //     debugger
        //     if(this.model.page1.cusume){
        //         // this.render1()
        //         this.getConsume()
                
        //     }
        //     if(this.model.page1.eCard){
        //         this.render2()
        //         this.getClassCard()
        //     }
        //     if(this.model.page1.studentLeave){
        //         this.allMethod.studentLeave(1)
        //     }
        //     if(this.model.page1.teacherLeave){
        //         this.allMethod.teacherLeave(1)
        //     }
        //     if(this.model.page1.coin){
        //         this.getYzFinancial()
        //     }
        //     if(this.model.page1.opinion){
        //         this.getOpinion(1);
        //     }
        //     if(this.model.page1.todayDeyu){

        //     }
        //     if(this.model.page1.schoolSurvey){
        //         this.getSchoolSurvey()
        //     }
        //     if(this.model.page1.repair){
        //         this.allMethod.repair(1)
        //     }
        //     if(this.model.page1.infoPublish){
        //         this.getPublish(1)
        //     }
        //     if(this.model.page1.todayAttendance){
        //         this.getTodayAttendance()
        //     }
        //     if(this.model.page1.teacherTrain){
        //         this.getTeacherTrain(1)
        //     }

            

        //     if(this.model.page2.cusume){
        //         this.render()
        //     }
        //     if(this.model.page2.eCard){
        //         this.render2()
        //         this.render3()
        //     }
        //     if(this.model.page2.studentLeave){
        //         this.allMethod.studentLeave(1)
        //     }
        //     if(this.model.page2.teacherLeave){
        //         this.allMethod.teacherLeave(1)
        //     }
        //     if(this.model.page2.coin){
        //         this.getYzFinancial()
        //     }
        //     if(this.model.page2.opinion){
        //         this.getOpinion(1);
        //     }
        //     if(this.model.page2.todayDeyu){

        //     }
        //     if(this.model.page2.schoolSurvey){
        //         this.getSchoolSurvey()
        //     }
        //     if(this.model.page2.repair){
        //         this.allMethod.repair(1)
        //     }
        //     if(this.model.page2.infoPublish){
        //         this.getPublish(1)
        //     }
        //     if(this.model.page2.todayAttendance){
        //         this.getTodayAttendance()
        //     }
        //     if(this.model.page2.teacherTrain){
        //         this.getTeacherTrain(1)
        //     }

        //     this.getFlag(1);
        //     this.getEvaluationShow();

        // },
            
  
        // async getTodayScoreRecords(type){
        //     if(this.$refs.mountNode2) this.$refs.mountNode2.innerHTML=""
        //     let res = await getTodayScoreRecords({
        //                         schoolId: this.$route.params.id,
        //                         type: type
        //                     });
        //     this.todayDeyu.class = res.detail.class
        //     this.todayDeyu.showX = res.detail.showX
        //     this.renderScroll = true
        //     // var data = []
        //     // res.detail.list.map(item=>{
        //     //     data.push({
        //     //         item: item.typeName,
        //     //         count: item.hour,
        //     //         percent: Math.floor((item.hour/res.detail.total)*100)/100 
        //     //     })
        //     // })
        //     // this.render4(data);
        // },
        // async getStudentLeave(type){
        //     if(this.$refs.mountNode2) this.$refs.mountNode2.innerHTML=""
        //     let res = await getStudentLeave({
        //                         schoolId: this.$route.params.id,
        //                         type: type
        //                     });
        //     var data = []
        //     res.detail.list.map(item=>{
        //         data.push({
        //             item: item.typeName,
        //             count: item.hour,
        //             percent: Math.floor((item.hour/res.detail.total)*100)/100 
        //         })
        //     })
        //     this.render4(data);
        // },
        // async getTeacherLeave(type){
        //     if(this.$refs.mountNode3) this.$refs.mountNode3.innerHTML=""
        //     let res = await getTeacherLeave({
        //                         schoolId: this.$route.params.id,
        //                         type: type
        //                     });
        //     var data = []
        //     res.detail.list.map(item=>{
        //         data.push({
        //             item: item.typeName,
        //             count: item.hour,
        //             percent: Math.floor((item.hour/res.detail.total).toFixed(2)*100)/100
        //         })
        //     })
        //     this.render5(data, res.detail.total);
        // },
        // async getConsume(){
        //     let res = await getConsume({
        //                         schoolId: this.$route.params.id,
        //                     });
        //     this.consume.totalMoney = res.detail.totalMoney
        //     this.consume.totalPersonTime = res.detail.totalPersonTime
        //     res.detail.key = res.detail.key.filter((element,index,array)=> index>=array.length-6);
        //     res.detail.moneys = res.detail.moneys.filter((element,index,array)=> index>=array.length-6);
        //     var data = []
        //     res.detail.key.map(item=>{
        //         data.push({
        //             month: item
        //         })
        //     })
        //     res.detail.moneys.map((item, index)=>{
        //         data[index].Tokyo = item
        //     })
        //     this.render1(data)
        // },
        // async getYzFinancial(){
        //     if(this.$refs.mountNode4) this.$refs.mountNode4.innerHTML=""
        //     let res = await getYzFinancial({
        //                         schoolId: this.$route.params.id,
        //                     });
        //     var data = []
        //     this.financial.total = parseFloat(res.detail.total)
        //     this.financial.income = parseFloat(res.detail.income)
        //     this.financial.expenditure = parseFloat(res.detail.expenditure)
        //     this.financial.topList = res.detail.top100
        //     res.detail.rank.map(item=>{
        //         data.push({
        //             className: item.className,
        //             money: parseFloat(item.money),
        //         })
        //     })
        //     this.render6(data);
        // },
        // async getYzFinancialWeekRecord(){
        //     let res = await getYzFinancialWeekRecord({
        //                         schoolId: this.$route.params.id,
        //                     });
        //     var data = []
        //     // res.detail.list.map(item=>{
        //     //     data.push({
        //     //         item: item.typeName,
        //     //         count: item.hour,
        //     //         percent: Math.floor((item.hour/res.detail.total)*100)/100 
        //     //     })
        //     // })
        //     // debugger
        //     // this.render5(data, res.detail.total);
        // },
        // async getClassCard(){
         
        //     let res = await getClassCard({
        //                         schoolId: this.$route.params.id,
        //                     });
        //     var data = [];
        //     this.eCard.offLineMac = res.detail.offLineMac[0].split(',')
        //     res.detail.moduleUse.map(item=>{
        //         data.push({
        //             type: item.moduleName,
        //             value: item.clicks
        //         })
        //     })
        //     this.eCard.online = res.detail.online
        //     this.eCard.offLine = res.detail.offLine
        //     this.render3(data)

        // },
        // async getSchoolSurvey(){
        //     let res = await getSchoolSurvey({ schoolId: this.$route.params.id });
        //     this.schoolSurvey.class = res.detail.class
        //     this.schoolSurvey.grade = res.detail.grade
        //     this.schoolSurvey.parents = res.detail.parents
        //     this.schoolSurvey.student = res.detail.student
        //     this.schoolSurvey.studentHasBind = res.detail.studentHasBind
        //     this.schoolSurvey.teacher = res.detail.teacher
        // },
        // async getNewRepair(type){
        //     if(this.$refs.mountNode8) this.$refs.mountNode8.innerHTML=""
        //     let res = await getNewRepair({ schoolId: this.$route.params.id, type: type });
        //     this.newRepair.total = res.detail.total
        //     var data = []
        //     res.detail.list.map((item, index)=>{
        //         if(index>=12) return
        //         data.push({
        //             item: item.typeName,
        //             a: item.count,
        //         })
        //     })
        //     this.render8(data)
        // },
        // async getPublish(type){
        //     if(this.$refs.mountNode10) this.$refs.mountNode10.innerHTML=""
        //     let res = await getPublish({ schoolId: this.$route.params.id, type: type });
        //     var data = [{
        //         type: '班级通知',
        //         value: res.detail.classNotice,
        //     }, {
        //         type: '校园新闻',
        //         value: res.detail.article,
        //     }, {
        //         type: '学生风采',
        //         value: res.detail.studentStyle,
        //     }, {
        //         type: '作业发布',
        //         value: res.detail.homework,
        //     }, {
        //         type: '校园公告',
        //         value: res.detail.notice,
        //     }];
        //     this.render9(data)
        // },
        // async getOpinion(type){
        //     if(this.$refs.mountNode6) this.$refs.mountNode6.innerHTML=""
        //     let res = await getOpinion({ schoolId: this.$route.params.id, type: type });
        //     var data = []
        //     res.detail.map((item, index)=>{
        //         data.push({
        //             type: item.typeName,
        //             value: parseFloat(item.count),
        //         })
        //     })
        //     this.render7(data)
        // },
        // async getTodayAttendance(){
        //     let res = await getTodayAttendance({ schoolId: this.$route.params.id });
        //     this.todayAttence.late = res.detail.late
        //     this.todayAttence.leave = res.detail.leave
        //     this.todayAttence.normal = res.detail.normal
        //     this.todayAttence.total = res.detail.total
        //     this.render10()
        //     this.render11()
        //     this.render12()
        // },
        // generateName(level){
        //     if(level==1){
        //         return '国家级'
        //     }else if(level==2){
        //         return '省级'
        //     }else if(level==3){
        //         return '市级'
        //     }else if(level==4){
        //         return '区县级'
        //     }else if(level==5){
        //         return '校级'
        //     }else if(level==6){
        //         return '其他'
        //     }
        // },
        // async getTeacherTrain(type){
        //     if(this.$refs.mountNode4) this.$refs.mountNode14.innerHTML=""
        //     let res = await getTeacherTrain({ schoolId: this.$route.params.id, type: type });
        //     var data = []
        //     res.detail.list.map(item=>{
        //         data.push({
        //             item: this.generateName(item.level),
        //             count: item.hours,
        //             percent: Math.floor((item.hours/res.detail.total).toFixed(2)*100)/100
        //         })
        //     })
        //     this.render14(data, res.detail.total);
        // },
        // async getFlag(type){
        //     let res = await getFlag({ schoolId: this.$route.params.id, type: type });
        //     var data = []
        //     if(res.code == 0){
        //         this.meizhouDeyu.weekNum = res.detail.weekNum
        //         this.meizhouDeyu.flagUrl = res.detail.flagUrl
        //         this.meizhouDeyu.list = res.detail.list
        //     }
        // },
        // async getEvaluationShow(){
        //     let res = await getEvaluationShow({ schoolId: this.$route.params.id});
        //     var data = []
        //     if(res.code == 0){
        //         debugger
        //         this.special.oneTypes = res.detail.oneTypes
        //         this.special.twoTypes = res.detail.twoTypes
        //     }
        // },

        // render1(data){
        // //    var data = [{
        // //         month: 'Jan',
        // //         Tokyo: 7.0,
        // //     }, {
        // //         month: 'Feb',
        // //         Tokyo: 6.9,
        // //     }, {
        // //         month: 'Mar',
        // //         Tokyo: 9.5,
        // //     }, {
        // //         month: 'Apr',
        // //         Tokyo: 14.5,
        // //     }, {
        // //         month: 'May',
        // //         Tokyo: 18.4,
        // //     }, {
        // //         month: 'Jun',
        // //         Tokyo: 21.5,
        // //     }, {
        // //         month: 'Jul',
        // //         Tokyo: 25.2,
        // //     },];
        //     var ds = new DataSet();
        //     var dv = ds.createView().source(data);
        //     // fold 方式完成了行列转换，如果不想使用 DataSet 直接手工转换数据即可
        //     dv.transform({
        //         type: 'fold',
        //         fields: ['Tokyo', 'London'], // 展开字段集
        //         key: 'city', // key字段
        //         value: 'temperature' // value字段
        //     });
        //     var chart = new G2.Chart({
        //         container: 'c1',
        //         forceFit: true,
        //         height: 300
        //     });
        //     chart.source(dv, {
        //         month: {
        //         range: [0, 1]
        //         }
        //     });
        //     chart.tooltip({
        //         crosshairs: {
        //         type: 'line'
        //         }
        //     });
        //     chart.axis('temperature', {
        //         grid: null,
        //         label: {
        //             // formatter: function formatter(val) {
        //             //     return val + '°C';
        //             // },
        //             textStyle: {
        //                 // textAlign: 'center', // 文本对齐方向，可取值为： start middle end
        //                 fill: '#fff',
        //             }
        //         },
              
        //     });
        //     chart.axis('month', {
        //         grid: null,
        //         label: {
        //             textStyle: {
        //                 fill: '#fff',
        //             }
        //         },
        //     });
        //     chart.legend(false)
        //     chart.area().position('month*temperature').color('city',[ 'rgba(241, 87, 15, 0.4)']).shape('smooth');
        //     chart.line().position('month*temperature').color('city',[ 'rgba(241, 87, 15, 0.8)']).size(2).shape('smooth');
        //     chart.tooltip(false)
        //     chart.render();
        // },
        
        // render2(){
        //      var data = [{
        //         type: '',
        //         value: 56.4
        //     }];
        //     var chart = new G2.Chart({
        //         container: 'mountNode',
        //         forceFit: true,
        //         height: 300,
        //         padding: [ 0, 0, 0, 0 ]
        //     });
        //     chart.source(data);
        //     chart.legend(false);
        //     chart.facet('rect', {
        //         fields: ['type'],
        //         padding: 20,
        //         showTitle: false,
        //         eachView: function eachView(view, facet) {
        //         var data = facet.data;
        //         var color = void 0;
        //         if (data[0].type === '男性') {
        //             color = '#0a9afe';
        //         } else {
        //             color = '#f0657d';
        //         }
        //         data.push({
        //             type: '其他',
        //             value: 100 - data[0].value
        //         });
        //         view.source(data);
        //         view.coord('theta', {
        //             radius: 0.8,
        //             innerRadius: 0.5
        //         });
        //         view.intervalStack().position('value').color('type', ['#02f4fd', '#7b7d96']).opacity(1);
        //         view.guide().html({
        //             position: ['50%', '50%'],
        //             html: '<div class="g2-guide-html"><p class="title" style="color: #fff; text-align: center;font-size: 0.2rem;font-weight: 700;">' + ''+ '33%</p><p class="value" style="color: #fff;font-size: 0.14rem">在线率</p></div>'
        //         });
        //         }
        //     });

        //     chart.tooltip(false)
        //     chart.render();
        // },
        
        // render3(data){
        //     this.$refs.mountNode1.innerHTML=""
        //     var chart = new G2.Chart({
        //         container: 'mountNode1',
        //         forceFit: true,
        //         height: (document.body.clientWidth/1920)*300,
        //         padding: [20, 0, 20, 10]
        //     });

        //     chart.source(data);
        //     chart.coord('polar', {
        //         startAngle: Math.PI, // 起始角度
        //         endAngle: Math.PI * (3 / 2) // 结束角度
        //     });
        //     chart.axis('type', {
        //         label: {
        //             textStyle: {
        //                 fill: '#fff',
        //             }
        //         }
        //     });
        //     chart.axis('value', {
        //         label: {
        //             textStyle: {
        //                 fill: '#fff',
        //             }
        //         }
        //     });
        //     chart.interval().position('type*value').color('type', '#f9e505').label('value', {
        //         offset: -15,
        //         label: {
        //             textAlign: 'center',
        //             fill: '#fff'
        //         }
        //     }).style({
        //         lineWidth: 1,
        //         stroke: '#fff'
        //     });
        //     chart.legend(false);
        //     chart.tooltip(false)
        //     chart.render();
        // },

        // render4(data){
            
        //     var chart = new G2.Chart({
        //         container: 'mountNode2',
        //         forceFit: true,
        //         height: (document.body.clientWidth/1920)*400
        //     });
        //     chart.source(data, {
        //         percent: {
        //         formatter: function formatter(val) {
        //             val = val * 100 + '%';
        //             return val;
        //         }
        //         }
        //     });
        //     chart.coord('theta', {
        //         radius: 0.75
        //     });
        //     chart.tooltip({
        //         showTitle: false,
        //         itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        //     });
        //     chart.intervalStack().position('percent').color('item').label('percent', {
        //         formatter: function formatter(val, item) {
        //             return item.point.item + ': ' + val;
        //         },
        //          textStyle: {
        //              fill: "#fff"
        //          }
        //     }).tooltip('item*percent', function(item, percent) {
        //         percent = percent * 100 + '%';
        //         return {
        //             name: item,
        //             value: percent
        //         };
        //     }).style({
        //         lineWidth: 1,
        //         stroke: '#fff'
        //     });
        //     chart.legend(false);
        //     chart.tooltip(false)
        //     chart.render();
        // },

        // render5(data, total){
        //     var chart = new G2.Chart({
        //         container: 'mountNode3',
        //         forceFit: true,
        //         height: (document.body.clientWidth/1920)*380,
        //         // padding: 'auto'
        //     });
        //     console.log((document.body.clientWidth/1920)*380)
        //     chart.source(data, {
        //         percent: {
        //         formatter: function formatter(val) {
        //             val = val * 100 + '%';
        //             return val;
        //         }
        //         }
        //     });
        //     chart.coord('theta', {
        //         radius: 0.95,
        //         innerRadius: 0.6
        //     });
        //     chart.tooltip({
        //         showTitle: false,
        //         itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        //     });
        //     // 辅助文本
        //     chart.guide().html({
        //         position: ['50%', '50%'],
        //         html: '<div style="color:#fff;font-size: 0.2rem;text-align: center;width: 10em;">总计<br><span style="color:#fff;font-size:0.2rem">'+total+'</span style="font-size: 20px">h</div>',
        //         alignX: 'middle',
        //         alignY: 'middle'
        //     });
        //     var interval = chart.intervalStack().position('percent').color('item').label('percent', {
        //         formatter: function formatter(val, item) {
        //             return item.point.item + ': ' + val;
        //         },
        //          textStyle: {
        //              fill: "#fff"
        //          }
        //     }).tooltip('item*percent', function(item, percent) {
        //         percent = percent * 100 + '%';
        //         return {
        //             name: item,
        //             value: percent
        //         };
        //     }).style({
        //         lineWidth: 1,
        //         stroke: '#fff'
        //     });
        //     chart.legend(false);
        //     chart.tooltip(false)
        //     chart.render();
        // },

        // render6(data){
  
        //     var chart = new G2.Chart({
        //         container: 'mountNode4',
        //         padding: 'auto',
        //         forceFit: true,
        //         height: (document.body.clientWidth/1920)*310,
        //     });
        //     chart.source(data);
        //     chart.axis('className', {
        //         label: {
        //             offset: 12,
        //             textStyle: {
        //                 fill: '#fff',
        //             }
        //         }
        //     });
        //     chart.axis('money', {
        //         label: {
        //             textStyle: {
        //                 fill: '#fff',
        //             }
        //         }
        //     });
        //     chart.coord().transpose();
        //     chart.interval().position('className*money').color('className', '#ff45ff');
        //     chart.legend(false);
        //     chart.render();
        // },
        // render7(data){
           

        //     // 根据比例，获取两点之间的点
        //     function getPoint(p0, p1, ratio) {
        //         return {
        //         x: (1 - ratio) * p0.x + ratio * p1.x,
        //         y: (1 - ratio) * p0.y + ratio * p1.y
        //         };
        //     }

        //     var pointRatio = 0.7; // 设置开始变成圆弧的位置 0.7
        //     // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
        //     var sliceNumber = 0.005;

        //     // 自定义 other 的图形，增加两条线
        //     G2.Shape.registerShape('interval', 'platelet', {
        //         draw: function draw(cfg, container) {
        //         cfg.points[1].y = cfg.points[1].y - sliceNumber;
        //         cfg.points[2].y = cfg.points[2].y - sliceNumber;
        //         var centerPoint = {
        //             x: cfg.points[3].x,
        //             y: (cfg.points[2].y + cfg.points[3].y) / 2
        //         };
        //         centerPoint = this.parsePoint(centerPoint);
        //         var points = this.parsePoints(cfg.points);
        //         var path = [];
        //         var tmpPoint1 = getPoint(points[0], points[3], pointRatio);
        //         var tmpPoint2 = getPoint(points[1], points[2], pointRatio);
        //         path.push(['M', points[0].x, points[0].y]);
        //         path.push(['L', tmpPoint1.x, tmpPoint1.y]);
        //         path.push(['Q', points[3].x, points[3].y, centerPoint.x, centerPoint.y]);
        //         path.push(['Q', points[2].x, points[2].y, tmpPoint2.x, tmpPoint2.y]);
        //         path.push(['L', points[1].x, points[1].y]);
        //         path.push(['z']);
        //         return container.addShape('path', {
        //             attrs: {
        //             fill: cfg.color,
        //             path: path
        //             }
        //         });
        //         }
        //     });

        //     var chart = new G2.Chart({
        //         container: 'mountNode6',
        //         forceFit: true,
        //         height: (document.body.clientWidth/1920)*380,
        //         // padding: [40, 0]
        //     });
        //     // chart.legend({ 
        //     //     position: 'right-top', // 设置图例的显示位置
        //     //     // itemGap: 20 // 图例项之间的间距
        //     // });
        //     chart.source(data);
        //     chart.coord('theta');
        //     chart.intervalStack().position('value').color('type').shape('platelet').label('type', {
        //          textStyle: {
        //              fill: "#fff"
        //          }
        //     });
        //     chart.legend(false);
        //     chart.tooltip(false)
        //     chart.render();
        // },

        // render8(data){
        //     var _DataSet = DataSet,
        //         DataView = _DataSet.DataView;
            

        //     var dv = new DataView().source(data);
        //     dv.transform({
        //         type: 'fold',
        //         fields: ['a', 'b'], // 展开字段集
        //         key: 'user', // key字段
        //         value: 'score' // value字段
        //     });
        //     var chart = new G2.Chart({
        //         container: 'mountNode8',
        //         forceFit: true,
        //         height: (document.body.clientWidth/1920)*380,
        //         padding: [20, 20, 95, 20]
        //     });
        //     chart.source(dv, {
        //         score: {
        //         min: 0,
        //         max: 80
        //         }
        //     });
        //     chart.coord('polar', {
        //         radius: 0.8
        //     });
        //     chart.axis('item', {
        //         line: null,
        //         tickLine: null,
        //         grid: {
        //         lineStyle: {
        //             lineDash: null
        //         },
        //         hideFirstLine: false
        //         }
        //     });
        //     chart.axis('score', {
        //         line: null,
        //         tickLine: null,
        //         grid: {
        //         type: 'polygon',
        //         lineStyle: {
        //             lineDash: null
        //         }
        //         }
        //     });
        //     chart.legend('user', {
        //         marker: 'circle',
        //         offset: 30
        //     });
        //     chart.line().position('item*score').color('user', '#e905ee').size(1);
        //     chart.point().position('item*score').color('user').shape('circle').size(0).style({
        //         stroke: '#fff',
        //         lineWidth: 0,
        //         fillOpacity: 0
        //     });
         
        //     chart.area().position('item*score').color('user', '#e905ee');
        //     chart.legend(false);
        //     chart.tooltip(false)
        //     chart.render();
        // },
    
        // render9(data){
        //     var chart = new G2.Chart({
        //         container: 'mountNode10',
        //         forceFit: true,
        //         height: (document.body.clientWidth/1920)*320,
        //         padding: 'auto',
        //     });
        //     const Shape = G2.Shape;
        //     Shape.registerShape('interval', 'textInterval', {
        //         draw(cfg, group) {
        //             const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
        //             const value = cfg.origin._origin.value;
        //             group.addShape('text', {
        //             attrs: {
        //                 text: "value",
        //                 textAlign: 'center',
        //                 x: points[1].x + cfg.size / 2,
        //                 y: points[1].y,
        //                 fontFamily: 'PingFang SC',
        //                 fontSize: 12,
        //                 fill: '#BBB'
        //             }
        //             });
        //             const polygon = group.addShape('polygon', {
        //             attrs: {
        //                 points: points.map(point => [ point.x, point.y ]),
        //                 fill: cfg.color
        //             }
        //             });
        //             return polygon;
        //         }
        //         });
        //     chart.source(data);
        //     chart.scale('value', {
        //         alias: '销售额(万)'
        //     });
           
        //     chart.axis('type', {
        //         grid: null,
        //         label: {
        //             textStyle: {
        //                 fill: '#fff'
        //             }
        //         },
        //         tickLine: {
        //             alignWithLabel: false,
        //             length: 0
        //         }
        //     });
        //     chart.axis('value', {
        //         grid: null, 
        //         label: {
        //             textStyle: {
        //                 fill: '#fff'
        //             }
        //         },
        //     });
        
        //     chart.interval().position('type*value').color('type', ['#13ffff']).shape('textInterval');
        //     chart.legend(false);
        //     chart.tooltip(false)
        //     chart.render();
        // },

           
        // render10(){
        //      var data = [{
        //         type: '',
        //         value: this.todayAttence.normal
        //     }];
        //     var percent = (this.todayAttence.normal*100/this.todayAttence.total).toFixed(2)
        //     var otherValue = this.todayAttence.total-this.todayAttence.normal
        //     var chart = new G2.Chart({
        //         container: 'mountNode11',
        //         forceFit: true,
        //         height: (document.body.clientWidth/1920)*200,
        //         padding: [0,0,0,0]
        //     });
        //     chart.source(data);
        //     chart.legend(false);
        //     chart.facet('rect', {
        //         fields: ['type'],
        //         padding: 20,
        //         showTitle: false,
        //         eachView: function eachView(view, facet) {
        //         var data = facet.data;
               
        //         data.push({
        //             type: '其他',
        //             value: otherValue
        //         });
        //         view.source(data);
        //         view.coord('theta', {
        //             radius: 0.8,
        //             innerRadius: 0.6
        //         });
        //         view.intervalStack().position('value').color('type', ['#0000ff', 'rgba(96,111,155, 0.8)']).opacity(1);
        //         view.guide().html({
        //             position: ['50%', '50%'],
        //             html: '<div class="g2-guide-html"><p class="title" style="color: #fff; text-align: center;font-size: 0.1rem;font-weight: 700;">' + ''+ '正常</p><p class="value" style="color: #fff;font-size: 0.1rem;font-weight: 700;">'+percent+'%</p></div>'
        //         });
        //         }
        //     });

        //     chart.tooltip(false)
        //     chart.render();
        // },

        // render11(){
        //      var data = [{
        //         type: '迟到',
        //         value: this.todayAttence.late
        //     }];
        //     var percent = (this.todayAttence.late*100/this.todayAttence.total).toFixed(2)
        //     var otherValue = this.todayAttence.total-this.todayAttence.late
        //     var chart = new G2.Chart({
        //         container: 'mountNode12',
        //         forceFit: true,
        //         height: (document.body.clientWidth/1920)*200,
        //         padding: [0,0,0,0]
        //     });
        //     chart.source(data);
        //     chart.legend(false);
        //     chart.facet('rect', {
        //         fields: ['type'],
        //         padding: 20,
        //         showTitle: false,
        //         eachView: function eachView(view, facet) {
        //         var data = facet.data;
        //         var color = void 0;
        //         if (data[0].type === '男性') {
        //             color = '#0a9afe';
        //         } else {
        //             color = '#f0657d';
        //         }
        //         data.push({
        //             type: '其他',
        //             value: otherValue
        //         });
        //         view.source(data);
        //         view.coord('theta', {
        //             radius: 0.8,
        //             innerRadius: 0.6
        //         });
        //         view.intervalStack().position('value').color('type', ['#00ffff', 'rgba(96,111,155, 0.8)']).opacity(1);
        //         view.guide().html({
        //             position: ['50%', '50%'],
        //             html: '<div class="g2-guide-html"><p class="title" style="color: #fff; text-align: center;font-size: 0.1rem;font-weight: 700;">' + ''+ '迟到</p><p class="value" style="color: #fff;font-size: 0.1rem;font-weight: 700;">'+percent+'%</p></div>'
        //         });
        //         }
        //     });

        //     chart.tooltip(false)
        //     chart.render();
        // },

        // render12(){
        //     var percent = (this.todayAttence.leave*100/this.todayAttence.total).toFixed(2)
        //     var otherValue = this.todayAttence.total-this.todayAttence.leave
        //      var data = [{
        //         type: '',
        //         value: this.todayAttence.leave
        //     }];
        //     var chart = new G2.Chart({
        //         container: 'mountNode13',
        //         forceFit: true,
        //         height: (document.body.clientWidth/1920)*200,
        //         padding: [0,0,0,0]
        //     });
        //     chart.source(data);
        //     chart.legend(false);
        //     chart.facet('rect', {
        //         fields: ['type'],
        //         padding: 20,
        //         showTitle: false,
        //         eachView: function eachView(view, facet) {
        //         var data = facet.data;
        //         var color = void 0;
        //         if (data[0].type === '男性') {
        //             color = '#0a9afe';
        //         } else {
        //             color = '#f0657d';
        //         }
        //         data.push({
        //             type: '其他',
        //             value: otherValue
        //         });
        //         view.source(data);
        //         view.coord('theta', {
        //             radius: 0.8,
        //             innerRadius: 0.6
        //         });
        //         view.intervalStack().position('value').color('type', ['#f39800', 'rgba(96,111,155, 0.8)']).opacity(1);
        //         view.guide().html({
        //             position: ['50%', '50%'],
        //             html: '<div class="g2-guide-html"><p class="title" style="color: #fff; text-align: center;font-size: 0.1rem;font-weight: 700;">' + ''+ '请假</p><p class="value" style="color: #fff;font-size: 0.1rem;font-weight: 700;">'+percent+'%</p></div>'
        //         });
        //         }
        //     });

        //     chart.tooltip(false)
        //     chart.render();
        // },

        render14(data, total){
            var chart = new G2.Chart({
                container: 'mountNode14',
                forceFit: true,
                height: (document.body.clientWidth/1920)*380,
            });
            console.log((document.body.clientWidth/1920)*380)
            chart.source(data, {
                percent: {
                formatter: function formatter(val) {
                    val = val * 100 + '%';
                    return val;
                }
                }
            });
            chart.coord('theta', {
                radius: 0.95,
                innerRadius: 0.6
            });
            chart.tooltip({
                showTitle: false,
                itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            });
            // 辅助文本
            chart.guide().html({
                position: ['50%', '50%'],
                html: '<div style="color:#fff;font-size: 0.2rem;text-align: center;width: 10em;">培训时长<br><span style="color:#fff;font-size:0.2rem">'+total+'</span style="font-size: 20px">h</div>',
                alignX: 'middle',
                alignY: 'middle'
            });
            var interval = chart.intervalStack().position('percent').color('item').label('percent', {
                formatter: function formatter(val, item) {
                    return item.point.item + ': ' + val;
                },
                 textStyle: {
                     fill: "#fff"
                 }
            }).tooltip('item*percent', function(item, percent) {
                percent = percent * 100 + '%';
                return {
                    name: item,
                    value: percent
                };
            }).style({
                lineWidth: 1,
                stroke: '#fff'
            });
            chart.legend(false);
            chart.tooltip(false)
            chart.render();
        },
    },
    watch: {

    }
}

</script>

<style lang="scss" scoped>
  #mountNode10{
      width: 3.8rem;
      margin: 0 auto;
  }
    .green{
        color: #1df3fe;
        font-size: 0.15rem;
    }
    .purple{
        color: #ff45ff;
        font-size: 0.15rem;
    }
    .item1 .head{
        height: 0.67rem;
        display: flex;
        font-size: 0.12rem;
        width: 65%;
        margin: 0 auto;
        div{
            color: #fff;
            flex: 1;
            text-align: center;

            padding-top: 0.16rem;
          
        }

    }
    .item1 .content{
        height: 3.33rem;
        width: 100%;
        background: url("../../images/xiaofeibg.jpg");
        overflow: hidden;
    }
    .item4 {
       
        background: url("../../images/jiaoshibg.jpg");
        overflow: hidden;
    }
    #mountNode{
        font-size: 0.12rem!important;

    }
    .item2-bottom{
        height: 3rem;
    }
    .common-title{
        font-size: 0.12rem;
        display: flex;
        .common-left{
            flex: 1;
            color: #fff;
            height: 0.57rem;
            line-height: 0.58rem;
            padding-left: 0.2rem;
            font-size: 0.14rem;
            font-weight: 700;
        }
        .common-right{
            flex: 1;
            color: #fff;
            height: 0.57rem;
            display: flex;
            align-items: center;
            ul{
                // height: 0.57rem;
                //     line-height: 0.58rem;
                li{
                    float: left;
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.12rem;
                    padding: 0.05rem 0.0rem;
                    margin: 0 0.1rem;
                }
                li.active{
                    color: #f905f6;
                    border-bottom: 3px solid #f905f6;
                }
            }
        }

    }
  
    .g2-guide-html .value{
        color: #fff;

    }
    .item5{
        ul.top{
            width: 90%;
            margin: 0 auto;
            display: flex;
            height: 0.44rem;
            align-items: center;
            li{
                font-size: 0.14rem;
                color: #fff;
                font-weight: 700;
                flex: 1;
                text-align: center;
            }
        }
        .item5-bottom{
            display: flex;
            .item5-bottom-l{
                flex: 3;
                h2{
                    font-size: 0.15rem;
                    color: #ff46ff;
                    text-indent: 0.26rem;
                }
            }
            .item5-bottom-r{
                flex: 2;
                h2{
                    font-size: 0.15rem;
                    color: #ff46ff;
                    text-align: center;
                }
            }
        }
       
    }
  
    .item2 .content{
        height: 3.33rem;
        width: 100%;
        background: #020a47;
        overflow: hidden;
        display: flex;
        div{
            flex: 1;
        }
        .c-l-content{
            .c-l-content-text{
                height: 0.58rem;
                line-height: 0.58rem;
                font-size: 0.14rem;
                color: #fff;
                padding-left: 0.2rem;
                font-weight: 700;
            }
            .c-l-content-main{
                display: flex;
                justify-content: flex-start;
                border-right: 1px solid #3c4272;
                .first{
                    flex: 2;
                }
                .second{
                    flex: 1;


                    .scroll-box{
                        width: 90%;
                        overflow: hidden;
                         margin-top: 0.62rem;
                         height: 1rem;
                         border: 2px solid #00ffff;
                         border-radius: 0.1rem;
                        ul{
                        
                            width: 100%;
                                font-size: 0.12rem;
                            li{
                                span{
                                    color: #f905f6;
                                }

                            }
                        }
                    }
                   
                    .second-bottom{
                        display: flex;
                        margin-top: 0.1rem;
                        width: 80%;
                        div{
                            flex: 1;
                            font-size: 0.15rem;
                            color: #fff;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        div:nth-child(1){
                            border-right: 2px solid #fff;
                        }

                    }
                }
            }
        }
    }
    .item7{
        .item7-content{
            height: calc(100% - 0.43rem);
            background-image: url("../../images/gaikuangbg.png");
        }
        .item7-content div{
            height: 50%;
            width: 100%;
            display: flex;
            justify-items: center;
            flex-wrap: wrap;
            align-items: center;
            .c-item{
                width: 33.33%;

                display: flex;
                font-size: 0.12rem;
                justify-content: center;
                align-items: center;
                
                img{
                    width: 0.81rem;
                    height: 0.81rem;
                    display: block;
                }
                span{
                    h3{
                        color: #fff;
                        font-size: 0.17rem;
                    }
                    h2{
                        font-weight: 700;
                        font-size: 0.22rem;
                        color: #fff;
                        text-align: center;
                    }
                }
            }
        }
    }
    .title{
        font-size: 0.2rem;
        color: #fff;
        font-weight: 700;
        height: 0.43rem;
        background-color: #073969;
        text-align: center;
        line-height: 0.43rem;
        border-bottom: 2px solid #1df3fe;
    }
    .item{
        width: 4.1rem;
        height: 3.77rem;
        border: 2px solid #1df3fe;
        background-color: #020a45;
        overflow: hidden;
    }
    .item1{
   
        background-color: #999;
        
    }
    .item2{

        background-color: green;
        width: 6.68rem;
    }
    .item3{

    }
    .item4{

    }
    .item5{

        width: 6.68rem;
    }
    .item6{

    }
   
    .item8{
        position: relative;
        background-color: #020a45;
        .i8-left{
            // width: 100%;
            padding: 0 0.06rem;
            padding-top: 0.125rem;
            // height: 3.33rem;
            // position: absolute;

        }
        .i8-right{
            width: 6.5rem;
            position: absolute;
            bottom: 0.1rem;
            left: 0.08rem;
            // height: 3.33rem;
            // margin-left: 4.75rem;
            padding-top: 0.05rem;

            .i8-right-div{
                // width: 1.85rem;
                // height: 3.2rem;
                background: url('../../images/bg-3.jpg') no-repeat;
                background-size: 100%;
                h2{
                    font-size: 0.15rem;
                    color: #f905f6;
                    font-weight: 700;
                    text-indent: 0.1rem;
                    padding: 0.08rem 0;
                }
                .i8-right-div-top{
                    height: .7rem;
                    li{
                        float: left;
                        font-size: 0.12rem;
                        color: #fff;
                        width: 33.3%;
                        text-align: center;
                        font-weight: 700;
                        padding: 0.03rem;

                        .index{
                            display: inline-block;
                            width: 0.2rem;
                            height: 0.2rem;
                            color: #fff;
                            border-radius: 50%;
                            text-align: center;
                            background: #2997ff;
                            line-height: 0.2rem;
                        }
                        .main{
                            color: #fff;
                        }
                        .point{
                             color: #fff;
                        }

                    }
                }
                .i8-right-div-main{
                    overflow: hidden;
                  
                    // padding-top: .2rem;
                    li{
                        margin: 0.05rem 0;
                        font-size: 0.12rem;
                        color: #fff;
                        height: 0.22rem;
                        // float: left;
                        span{
                            color: #fff;
                            display: inline-block;
                            text-align: left;
                            height: 0.22rem;
                            line-height: 0.22rem;
                            font-weight: 700;
                        }
                        span:nth-child(1){
                            margin-left: 0.1rem;
                            width: 0.22rem;
                            background-color: #299fff;
                            border-radius: 50%;
                            text-align: center;
                            // overflow: hidden;
                            // text-overflow:ellipsis;
                            // white-space: nowrap;
                        }
                        span:nth-child(2){
                            width: .8rem;
                            overflow: hidden;
                            height: 100%;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            vertical-align: top;
                        }
                        span:nth-child(3){
                            width: 0.6rem;
                            text-align: right;
                            padding-right: 0.175rem;
                        }
                    }
                }
            }
        }
        
        .i8-l-title{
            height: 0.25rem;
            // width: 4.6rem;
            background: url('../../images/bar-red.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: space-around;
            li{
                line-height: 0.25rem;
                float: left;
                font-size: 0.14rem;
                color: #fff;
                font-weight: 700;

                // padding: 0 0.06rem;
                
            }
            .i8-l-main-name{
                width: 1rem;
                text-align: center;
                padding: 0;
             
            }
            
        }
        .i8-l-main{
            margin-top: 0.12rem;
            height: 0.2rem;
            // width: 4.6rem;
              display: flex;
            justify-content: space-around;
            background: url('../../images/bar-blue.jpg') no-repeat;
            background-size: 100% 100%;
            li{
                line-height: 0.22rem;
                float: left;
                font-size: 0.14rem;
                color: #fff;
                font-weight: 700;
                text-align: center;
            }
            li:nth-child(2){
                width: 0.4rem;
            }
            li:nth-child(3){
                width: 0.68rem;
            }
            li:nth-child(4){
                width: 0.54rem;
            }
            li:nth-child(5){
                width: 0.4rem;
            }
            li:nth-child(6){
                width: 0.4rem;
            }
            li:nth-child(7){
                width: 0.68rem;
            }
            li:nth-child(8){
                width: 0.46rem;
            }
            .i8-l-main-name{
                width: 1rem;
                text-align: left;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                padding: 0 0.05rem;
                color: #f4ea2a;
            }
            
        }
        .total-score{
            color: #fd03ee!important;
        }
    }
    .item9{
        .item4-bottom{
            h2{
                font-size: 0.15rem;
                font-weight: 700;
                color: #fff;
                padding-left: 0.25rem;
                span{
                    font-size: 0.23rem;
                    color: #f706f8;
                    font-weight: 700;
                }
            }
        }
    }
    .wrap{
        display: flex;
        width: 15.3rem;
        height: 7.92rem;
        // background-color: yellow;
        margin: 0 auto;
        margin-top: 0.62rem;
        justify-content: space-between;
        flex-wrap: wrap;
    }
  
    .swiper-container {
        // background-color: #02072d;
        // width: 100vw;
        // height: 100vh;
    }  
    @import 'src/style/mixin';
	.link_search{
		left: .8rem;
		@include wh(.9rem, .9rem);
		@include ct;
	}
	.msite_title{
		@include center;
        width: 50%;
        color: #fff;
        text-align: center;
        margin-left: -0.5rem;
        .title_text{
            @include sc(0.8rem, #fff);
            text-align: center;
            display: block;
        }
	}
	.msite_nav{
		padding-top: 2.1rem;
		background-color: #fff;
		border-bottom: 0.025rem solid $bc;
		height: 10.6rem;
		.swiper-container{
			@include wh(100%, auto);
			padding-bottom: 0.6rem;
			.swiper-pagination{
				bottom: 0.2rem;
			}
		}
		.fl_back{
			@include wh(100%, 100%);
		}
	}
	.food_types_container{
		display:flex;
		flex-wrap: wrap;
		.link_to_food{
			width: 25%;
			padding: 0.3rem 0rem;
			@include fj(center);
			figure{
				img{
					margin-bottom: 0.3rem;
					@include wh(1.8rem, 1.8rem);
				}
				figcaption{
					text-align: center;
					@include sc(0.55rem, #666);
				}
			}
		}
	}
	.shop_list_container{
		margin-top: .4rem;
		border-top: 0.025rem solid $bc;
		background-color: #fff;
		.shop_header{
			.shop_icon{
				fill: #999;
				margin-left: 0.6rem;
				vertical-align: middle;
				@include wh(0.6rem, 0.6rem);
			}
			.shop_header_title{
				color: #999;
				@include font(0.55rem, 1.6rem);
			}
		}
	}

body{
    background: url('../../images/bg.jpg');
}
.item5-bottom-r-ul{
    padding: 0.1rem 0 0.1rem 0.5rem;
    height: 2.55rem;
    overflow: hidden;
    li{
        padding: 0.038rem 0;
        .li-left{
            font-weight: 700;
            display: inline-block;
            background: #48a2ff;
            width: .23rem;
            height: 0.23rem;
            text-align: center;
            line-height: 0.23rem;
            border-radius: 0.2rem;
        }
        .li-middle{
            padding-left: 0.1rem;
            width: 0.8rem;
            display: inline-block;
        }
        .li-right{
            
        }
        display: block;
        font-size: 0.12rem;
        span{
            color: #fff;

        }
    }
    li:nth-child(1){
        .li-left{
           background: #010b87; 
        }
    }
    li:nth-child(2){
        .li-left{
           background: #010fbb; 
        }
    }
    li:nth-child(3){
        .li-left{
           background: #0012ec; 
        }
    }
}
.item11{
    // border: none;
    overflow: hidden;
    .content{
        padding-top: 0.3rem;
        background: url('../../images/bg-2.png') no-repeat;
        background-size: 100%;
        height: 3.4rem;
        .head{
            height: 0.58rem;
            overflow: hidden;
            .left{
                width: 1.67rem;
                text-align: center;
                font-size: 0.2rem;
                font-weight: 700;
                color: #fff;
                span{
                    color: #f905f6;
                    font-size: 0.2rem;
                    font-weight: 700;
                }
                border-right: 3px solid #fff;
            }
            .right{
                width: 1.67rem;
                text-align: center;
                font-size: 0.2rem;
                font-weight: 700;
                color: #fff;
                span{
                    color: #f905f6;
                    font-size: 0.2rem;
                    font-weight: 700;
                }

            }
            div{
                float: left;
                font-size: 0.12rem;
                span{
                    font-size: 0.12rem;
                }
            }
        }
        .content-main{
           height: 2.5rem;
           align-items: center;
           display: flex;
           justify-content: center;
           padding-top: 0.15rem;
           background: transparent;
           .item{
               background: transparent;
               width: 1.25rem;
               border: none;
               height: 100%;
               div{
                    width: 100%;
                    height: 1.25rem;
               }

               h2{
                   color: #fb1cf8;
                   text-align: center;
                   font-size: 0.2rem;
                   padding-top: 0.3rem;
               }
           } 
        }
    }
}
.swiper-container{
    height: 100%;
    .swiper-slide{
        background: url('../../images/bg.jpg');
        background-size: 100%;
    }
}
 .swiper-slide{
     .school-name{
         width: 100%;
         font-size: 0.28rem;
         position: absolute;
         color: #02072d;
         font-weight: 700;
         text-align: center;
         margin-top: 0.22rem;
     }
 }
 .scroll-wrap{
    height: 1.6rem;
    overflow: hidden;
 }
  .scroll-wrap1{
    height: 1rem;
    overflow: hidden;
    li{
        font-size: 12px;
    }
 }
 .today-cg{
     .title-ul{
         overflow: hidden;
         li{
            color: #fff;
            float: left;
            width: 33.3%;
            font-size: .2rem;
            display: inline-block;
            height: 0.4rem;
            font-weight: 700;
            line-height: 0.4rem;
            text-align: center;
            border-bottom: 2px solid #02f4fd;
         }
         li.zan{
             color: #b706c7;
             border-left: 2px solid #02f4fd;
             border-right: 2px solid #02f4fd;
         }
         
     }
     .wujian-ul{
        overflow: hidden;
         >li{
            color: #fff;
            float: left;
            width: 33.3%;
            font-size: .12rem;
            display: inline-block;
            height: 1rem;
            font-weight: 700;
            text-align: center;
            border-bottom: 2px solid #02f4fd;
         }
         .left-text,.right-text{
             line-height: 1rem;
         }
         .left-text{
             font-size: .2rem;
             color: #02f4fd;
         }
        .center{
             border-right: 2px solid #02f4fd;
             border-left: 2px solid #02f4fd;
         }
         .wujian-center-ul{
             li{
                display: block;
                color: #fff;
             }
         }
         
     }
     .jingxiao{
         
         .left{
             color: #02f4fd;
             width: 1.1rem;
            height: 0.3rem;
            overflow: hidden;
            text-align: right;
         }
          .classBox{
                float: left;
                width: 1.4rem;
                height: 0.3rem;
                overflow: hidden;
                .className{
                    color: #fff;
                }
                span{
                    padding: 0 2px;
                }
            }
         >li{
            height: 0.9rem;
            // line-height: 0.9rem;
            border: none;
         }
         .center{
             width: 66.6%;
             border-right: none;
             text-align: left;
             text-indent: 2em;
             .first-div{
                 margin-top: .15rem;
             }
             >div{
                 height: 0.3rem;
                 line-height: 0.3rem;
                 display: block;
                 color: #fff;
                 span{
                     color: #09f9fb;
                 }
             }
         }
         .second-div{
             margin-top: 0!important;
         }
     }

 }
 .per-deyu{
     .main-content{
         background: #020a45;
     }
     .top-title{
         font-size: .2rem;
         color: #fff;
         height: 0.42rem;
         line-height: .42rem;
         flex: none;
     }
     .deyu-ul{
         display: block;
         height: 2.9rem;
         li{
             float: left;
             width: 14%;
             margin-right: 1px;
             margin-left: 1px;
             margin-bottom: 2px;
             box-sizing: content-box;
             p{
                 line-height: 0.33rem;
                 color: #fff;
                 font-size: .12rem;
                 height: 0.33rem;
                 background: #0ab4c2;
                 text-align: center;
             }
             div{
                 height: 0.61rem;
                 overflow: hidden;
                 background-color: #11367c;
                 position: relative;
                 img{
                     height: 0.41rem;
                     width: 0.41rem;
                     display: block;
                     position: absolute;
                     left: 50%;
                     top: 50%;
                     margin-left: -0.205rem;
                     margin-top: -0.205rem;
                 }
             }
         }
     }
     .jingxiao{
         
        .center .first-div{
            float: left;
            .left{
                width: 1rem;
            }
           
         }
     }
 }
</style>
