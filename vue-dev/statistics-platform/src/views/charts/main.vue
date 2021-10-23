<template>
    <section class="chart-container">
         <el-row>
            <el-col :span="6">
                <div class="box-row c-green">
                    <h2>学校总数</h2>
                    <h1>{{data&&data.schoolCount}}</h1>
                </div>
            </el-col>
             <el-col :span="6">
                <div class="box-row c-blue">
                    <h2>教师总数</h2>
                    <h1>{{data&&data.teacherCount}}</h1>
                </div>
            </el-col>
             <el-col :span="6">
                <div class="box-row c-purple">
                    <h2>学生总数</h2>
                    <h1>{{data&&data.studentCount}}</h1>
                </div>
            </el-col>
             <el-col :span="6">
                <div class="box-row c-orage">
                    <h2>职工总数</h2>
                    <h1>{{data&&data.staffCount}}</h1>
                </div>
            </el-col>
         </el-row>
         <div id="container">
                <div class="mask" v-show="showMask">
                    <div class="close-btn" @click="closeMask()"></div>
                    <div class="content">
                        <h4>{{schoolData.schoolName}}</h4>
                        <p>{{schoolData.desc}}</p>
                        <div class="mask-img-box">
                            <img v-for="(item, index) in imgs" :key="index" class="mask-img" :src="imgBase + item" alt="">
                        </div>
                    </div>
                    <a href="javascript:;" class="btn-detail" @click="goToDetail">详细数据分析</a>
                </div>
         </div>
       
        <div class="box-bottom">
            <el-row>
                <el-col :span="12">
                    <h2>学校学生性别分析</h2>
                    <ve-histogram :data="chartData" :settings="chartSettings"></ve-histogram>
                </el-col>
                <el-col :span="12">
                    <h2>学校老师性别分析</h2>
                    <ve-histogram :data="chartData1" :settings="chartSettings"></ve-histogram>
                </el-col>
            </el-row>
         </div>
    </section>
</template>

<script>
    import Vue from 'vue'
    import echarts from 'echarts'
    import { personCount, getSchoolDetail } from '../../api/api';
    import {imgBase } from '../../config.js'
    export default {
        components: {

        },
        data() {
            return {
                icon: require("../../assets/location.png"),
                imgBase: imgBase,
                showMask: false,
                active: false,
                center: {lng: 0, lat: 0},
                zoom: 3,
                chartSettings: {
                    yAxisName: ['人数(人)']
                },
                chartData: {
                    columns: ['学校', '男生', '女生', '保密', '总数'],
                    rows: [
                        // { '学校': '学校1', '男生': 200, '女生': 1093, '总数': 1295 },
                    ]
                },
                chartData1: {
                    columns: ['学校', '男性', '女性', '保密', '总数'],
                    rows: [
                        // { '学校': '学校1', '男生': 200, '女生': 1093, '总数': 1295 },
                    ]
                },
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                data: {},
                schoolList: [],
                schoolData: {},
                imgs: []
            }
        },

        methods: {
            goToDetail () {
                localStorage.setItem('schoolId', this.schoolData.schoolId)
                this.$router.push('student-statistics')
            },
            handleClick () {
                global.alert('Well done.')
            },
            closeMask(){
                this.showMask = false
            },
            personCount() {
				let para = {}
				this.listLoading = true;
				personCount(para).then((res) => {
                    this.listLoading = false;
                    if(res.code == 200){
                        
                        this.data = res.data
                        this.schoolList = res.data.schoolList
                        let arr = []
                        let arr1 = []
                        res.data.schoolList.map(item=>{
                            let obj = {}
                            obj['学校'] = item.name
                            item.studentSexCount.map(i=>{
                                if(i.type == 0){
                                    obj['保密'] = i.count
                                }else if(i.type == 1){
                                    obj['男生'] = i.count
                                }else if(i.type == 2){
                                    obj['女生'] = i.count
                                }
                            })
                            obj['总数'] =  obj['男生'] + obj['女生']
                            arr.push(obj)

                            let obj1 = {}
                            obj1['学校'] = item.name
                            item.teacherSexCount.map(i=>{
                                if(i.type == 0){
                                    obj1['保密'] = i.count
                                }else if(i.type == 1){
                                    obj1['男性'] = i.count
                                }else if(i.type == 2){
                                    obj1['女性'] = i.count
                                }
                            })
                            obj1['总数'] =  obj1['男性'] + obj1['女性']
                            arr1.push(obj1)
                        })
                        this.chartData.rows = arr
                        this.chartData1.rows = arr1

                        this.createInfoWindow(res.data.schoolList)

                    }
                   
				});
            },
            getSchoolDetail(id){
                let para = {
                    schoolId: id
                }
                this.showMask = false
                this.listLoading = true
				getSchoolDetail(para).then((res) => {
                    this.listLoading = false;
                    if(res.code == 200){
                        this.showMask = true
                        this.schoolData = res.data
                        this.imgs = res.data.imgs

                    }
				});
            },
            
            handler ({BMap, map}) {
                console.log(BMap, map)
                this.center.lng = 104.07
                this.center.lat = 30.67
                this.zoom = 10
            },

            createInfoWindow(data) {
                let that = this
                const map = new AMap.Map(container, {
                    center: [104.07, 30.67],
                    zoom: 10
                })
                data.map(item=>{
                    var marker = new AMap.Marker({
                        icon: this.icon, // 自定义点标记
                        position: [parseFloat(item.longitude), parseFloat(item.latitude)], // 基点位置
                        anchor:'center', // 设置锚点方位,
                        offset: new AMap.Pixel(0,0), // 设置点标记偏移量
                    });
                    AMap.event.addListener(marker, 'click', function () {
                        var infoWindow = new AMap.InfoWindow({
                            isCustom: true,
                            anchor: 'middle-left',
                            offset: new AMap.Pixel(16, 0)
                        });
                        let inner = Vue.extend({
                            template: `
                                <div class="info-box" @click="clickA(${item.id})">
                                    <p>${item.name}</p>
                                    <p>
                                        <span>学生：${item.studentCount}</span>&nbsp;&nbsp;
                                        <span>教师：${item.teacherCount}</span>&nbsp;&nbsp;
                                        <span>职工：${item.staffCount}</span>
                                    </p>
                            </div>`,
                            methods: {
                                clickA(id){
                                    console.log(id)
                                    that.getSchoolDetail(id)
                                    infoWindow.close();
                                }
                            }
                        })
                        let comment = new inner().$mount()
                        infoWindow.setContent(comment.$el)
                        infoWindow.open(map, marker.getPosition())
                    });
                    map.add(marker);
                 })
            }
        },

        mounted: function () {
            this.personCount()

            
        },
        updated: function () {
            // this.drawCharts()
        }
    }
</script>
<style>
    .info-box{
        width: 220px;
        height: 50px;
        border-radius: 5px;
        background-color: #0d85ff;
        text-align: left;
        padding: 2px;
        z-index: 999999;
        color: #fff;
        cursor: pointer;
    }
    .info-box>p{
        padding: 4px 0 0 0;
        margin: 0;
    }
</style>
<style scoped>
    #container{
        height: 600px;
        position: relative;
    }
    .mask-img{
        width: 130px;
        float: left;
        margin-bottom: 8px;
        height: 90px;
        object-fit: cover;

    }
    .content{
        overflow-y: auto;
        height: 560px;
    }
    .mask-img:nth-child(2n+1){
        margin-right: 3px;
    }
    .box-bottom{
        background-color: #f2f2f2;
        padding: 10px;
    }
    .box-bottom h2{
        text-align: center;
        color: #666666;
    }
    .el-col-6{
        padding: 20px 20px!important;
    }

    .box-bottom .el-col-12{
        background-color: #fff;
    }
    .box-row{
        height: 120px;
        background-color: red;
        border-radius: 5px;
    }
    .mask-img-box{
        overflow: hidden;
        margin-bottom: 60px;
    }
    .c-green{
        background-color: #41c012;
    }
    .c-blue{
        background-color: #039de1;
    }
    .c-purple{
        background-color: #a28de9;
    }
    .c-orage{
        background-color: #ffb441;
    }
    .box-row>h2{
        margin: 0;
        color: #fff;
        padding: 10px;
    }
    .box-row>h1{
        margin: 0;
        color: #fff;
        text-align: center;
        padding-top: 5px;
        font-size: 40px;
    }
    .bm-view {
        width: 100%;
        height: 600px;
        position: relative;
    }
    .mask{
        width: 280px;
        height: 560px;
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 999;
        background-color: #fff;
        padding: 10px;
        overflow: hidden;
    }
    .mask>.close-btn:hover{
        opacity: 0.8;
    }
    .mask>.close-btn{
        position: absolute;
        right: 2px;
        top: 2px;
        width: 40px;
        height: 40px;
        background-image: url('../../assets/close.png');
        background-size: 100%;
        cursor: pointer;
    }
    .btn-detail{
        height: 36px;
        width: 200px;
        background: #0ab092;
        color: #fff;
        display: block;
        text-decoration: none;
        text-align: center;
        line-height: 36px;
        border-radius: 3px;
        position: absolute;
        bottom: 10px;
        left: 50px;

    }
    .mask>h4{
        margin: 0;
        padding: 5px 0;
    }
    .mask>p{
        padding: 0 10px;
        text-indent: 2em;
        color: #666666;
    }
    .chart-container {
        width: 100%;
        float: left;
    }
    .el-col {
        padding: 30px 20px;
    }

</style>
