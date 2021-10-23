<template>
    <div>
        34334
    </div>    
</template>

<script>


import { getStudentLeave, getTeacherLeave, getConsume, getYzFinancial, 
getYzFinancialWeekRecord, getClassCard, getSchoolSurvey, getNewRepair, 
getPublish, getOpinion, getTodayAttendance, getTeacherTrain,
getPosition, getTodayScoreRecords, getFlag, getEvaluationShow} from 'src/service/getData'

import 'src/plugins/swiper.min.js'
import 'src/style/swiper.min.css'
import DataSet from '@antv/data-set';

export default {
	data(){
        return {
            title: '校园大数据',
            renderScroll: false,
            test: [],
            model: {
         
               
            },
         
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
      
    },
    mounted(){

      
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

    
    },
 
}

</script>

<style lang="scss" scoped>
 
</style>
