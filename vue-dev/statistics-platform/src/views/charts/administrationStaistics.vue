<template>
    <section class="chart-container">
        <div class="box-bottom">
            <el-row  class="last-row">
                <el-col :span="12" class="p0 box1" >
                    <div class="inner-box inner-box1" >
                        <h2>建筑物类型分析</h2>
                        <el-row class="mb0">
                            <el-col :span="12" class="p0">
                                <div class="inner-box" style="padding-top: 0">
                                    <ve-histogram :legend-visible="false" :data="chartData" :settings="chartSettings" height='360px'></ve-histogram>
                                </div>
                            </el-col>
                            <el-col :span="12" class="p0">
                                <div class="inner-box inner-box3">
                                    <ve-pie :legend-visible="false"  :settings="chartSettings2" :data="chartData2" height='320px'></ve-pie>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="12" class="p0 pd5">
                    <div class="inner-box inner-box1" >
                        <h2>建筑物场所统计</h2>
                        <ve-histogram :legend-visible="false" :data="chartData3" :settings="chartSettings" height='360px'></ve-histogram>
                     </div>
                </el-col>
            </el-row>
            <el-row class="last-row">
                <el-col :span="12" class="p0">
                    <div class="inner-box">
                        <h2>教师请假月分析</h2>
                        <div class="box">
                            年份：
                            <el-select style="width:100px;" v-model="value1" placeholder="请选择"  @change="change1">
                                <el-option
                                    v-for="item in options1"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <ve-line :data="lineData3" :settings="chartSettings1" height='360px'></ve-line>
                    </div>
                </el-col>
                <el-col :span="12" class="p0">
                    <div class="inner-box">
                        <h2>学生请假月分析</h2>
                        <div class="box">
                            年份：
                            <el-select style="width:100px;" v-model="value2" placeholder="请选择"  @change="change2">
                                <el-option
                                    v-for="item in options2"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <ve-line :data="lineData4" :settings="chartSettings1" height='360px'></ve-line>
                    </div>
                </el-col>
            </el-row>
             <el-row class="last-row">
                <el-col :span="12" class="p0">
                    <div class="inner-box">
                        <h2>报事报修年分析</h2>
                        <h4 style="height: 36px"></h4>
                        <ve-line :data="lineData5" :settings="chartSettings1" height='360px'></ve-line>
                    </div>
                </el-col>
                <el-col :span="12" class="p0">
                    <div class="inner-box">
                        <h2>报事报修月分析</h2>
                        <div class="box">
                            年份：
                            <el-select style="width:100px;" v-model="value3" placeholder="请选择"  @change="change3">
                                <el-option
                                    v-for="item in options3"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <ve-line :data="lineData6" :settings="chartSettings1" height='360px'></ve-line>
                    </div>
                </el-col>
            </el-row>
         </div>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import {placeRepairCount, teacherLeaveCount, studentLeaveCount, repairCount} from '../../api/api';

    export default {
        data() {
            return {
                schoolId: '',
                value: '',
                options1: [],
                options2: [],
                options3: [],
                value1: '',
                value2: '',
                value3: '',
                chartSettings: {
                    yAxisName: ['数量(个)'],
                },
                chartSettings1: {
                    yAxisName: ['数量(个)'],
                },
                chartSettings2: {
                    radius: 70
                },
                chartData1: {
                    columns: ['性别', '人数'],
                    rows: [
                        { '性别': '男', '人数': 0 },
                        { '性别': '女', '人数': 0 },
                    ]
                },
                lineData3: {
                    columns: ['日期', '事假', '病假',],
                    rows: [
                        { '日期': '1月', '事假': 10, '病假': 53, },
                        { '日期': '2月', '事假': 28, '病假': 6,},
                        { '日期': '3月', '事假': 89, '病假': 42,},
                        { '日期': '4月', '事假': 20, '病假': 2, },
                        { '日期': '5月', '事假': 3, '病假': 121,},
                        { '日期': '6月', '事假': 9, '病假': 15, },
                        { '日期': '7月', '事假': 13, '病假': 18 , },
                        { '日期': '8月', '事假': 0, '病假': 0, },
                    ]
                },
                lineData4: {
                    columns: ['日期', '事假', '病假',],
                    rows: [
                        { '日期': '1月', '事假': 20, '病假': 5, },
                        { '日期': '2月', '事假': 68, '病假': 66,},
                        { '日期': '3月', '事假': 49, '病假': 52,  },
                        { '日期': '4月', '事假': 120, '病假': 72, },
                        { '日期': '5月', '事假': 34, '病假': 21,},
                        { '日期': '6月', '事假': 98, '病假': 155, },
                        { '日期': '7月', '事假': 13, '病假': 0 , },
                        { '日期': '8月', '事假': 0, '病假': 0, },
                    ]
                },
                lineData5: {
                    columns: ['年份', '修电脑', '修桌子', '修风扇'],
                    rows: [
                        
                        
                        { '年份': '2018年', '修电脑': 38, '修桌子': 596, '修风扇': 673 },
                        { '年份': '2019年', '修电脑': 378, '修桌子': 366, '修风扇': 223 },
                        { '年份': '2020年', '修电脑': 200, '修桌子': 345, '修风扇': 123 },
                    ]
                },
                lineData6: {
                    columns: ['日期', '修电脑', '修桌子', '修风扇'],
                    rows: [
                        { '日期': '1月', '修电脑': 200, '修桌子': 345, '修风扇': 123 },
                        { '日期': '2月', '修电脑': 378, '修桌子': 366, '修风扇': 223 },
                        { '日期': '3月', '修电脑': 499, '修桌子': 12, '修风扇': 233 },
                        { '日期': '4月', '修电脑': 190, '修桌子': 32, '修风扇': 23 },
                        { '日期': '5月', '修电脑': 284, '修桌子': 321, '修风扇': 93 },
                        { '日期': '6月', '修电脑': 988, '修桌子': 55, '修风扇': 3 },
                        { '日期': '7月', '修电脑': 1393, '修桌子': 88 , '修风扇': 0},
                        { '日期': '8月', '修电脑': 1088, '修桌子': 134, '修风扇': 0 },
                    ]
                },
                chartData2: {
                    columns: ['建筑', '数量'],
                    rows: [{'建筑': '教学楼', '数量': 2},
                         {'建筑': '图书馆', '数量': 4},
                          {'建筑': '体育馆', '数量': 5},
                           {'建筑': '食堂', '数量': 3}

                    ]
                },

                chartData: {
                    columns: ['建筑', '数量'],
                    rows: [  {'建筑': '教学楼', '数量': 2},
                         {'建筑': '图书馆', '数量': 4},
                          {'建筑': '体育馆', '数量': 5},
                           {'建筑': '食堂', '数量': 3}]
                },
                chartData3: {
                    columns: ['建筑', '数量'],
                    rows: [
                        {'建筑': '教学楼', '数量': 2},
                         {'建筑': '图书馆', '数量': 4},
                          {'建筑': '体育馆', '数量': 5},
                           {'建筑': '食堂', '数量': 3}
                    ]
                },
                chartData5: {
                    columns: ['建筑', '数量'],
                    rows: []
                },


                lineData1: {
                    columns: ['年级', '数量'],
                    rows: [
                        // { '年级': '年级1', '数量': 1295 },
                    ]
                },
                lineData2: {
                    columns: ['年级', '数量'],
                    rows: [
                        // { '年级': '年级1', '数量': 1295 },
                    ]
                },
            }
        },

        methods: {


            placeRepairCount() {
				let para = {
                    schoolId: this.schoolId
                }
				placeRepairCount(para).then((res) => {
                    if(res.code == 200){
                        let arr = []
                        let arr1 = []
                        res.data.buildTypeCount.map(item=>{
                            arr.push({
                                 '建筑': item.name,
                                 '数量': item.count
                            })
                            arr1.push({
                                 '建筑': item.name+": "+item.rate,
                                 '数量': item.count
                            })
                        })
                        // this.chartData.rows = arr
                        // this.chartData2.rows = arr1

                        let arr3 = []
                        res.data.buildingCount.map(item=>{
                            arr3.push({
                                 '建筑': item.name,
                                 '数量': item.count
                            })
                        })
                        // this.chartData3.rows = arr3

                        // minYears
                        let years1 = []
                        let years2 = []
                        let years3 = []
                        res.data.minYears.map(i=>{
                            if(i.type == 2){
                                years1 = this.getYears(i.year)

                            }
                            if(i.type == 3){
                                years2 = this.getYears(i.year)
                            }
                             if(i.type == 4){
                                years3 = this.getYears(i.year)
                            }
                        })

                        let years1Arr = []
                        years1.map(i=>{
                            years1Arr.push({
                                value: i,
                                label: i + '年'
                            })
                        })
                        let years2Arr = []
                        years2.map(i=>{
                            years2Arr.push({
                                value: i,
                                label: i + '年'
                            })
                        })
                        let years3Arr = []
                        years3.map(i=>{
                            years3Arr.push({
                                value: i,
                                label: i + '年'
                            })
                        })
                        this.options1 = years1Arr
                        this.options2 = years2Arr
                        this.options3 = years3Arr

                        // res.data.repairCount

                        let repairArr1 = ['日期']
                        res.data.repairCount.types.map(item=>{
                            repairArr1.push(item.name)
                        })
                        // this.lineData5.columns = repairArr1
                        let repairArr2 = []
                        res.data.repairCount.list.map(item=>{
                            let obj = {}
                            obj['日期'] = item.year
                            item.data.map(i=>{
                                obj[i.name] = i.count
                            })
                            repairArr2.push(obj)
                        })
                        // this.lineData5.rows = repairArr2
                    }
				});
            },
            teacherLeaveCount(year) {
				let para = {
                    schoolId: this.schoolId,
                    year: year
                }
				teacherLeaveCount(para).then((res) => {
                    if(res.code == 200){
                        let arr = ['日期']
                        res.data.types.map(item=>{
                            arr.push(item.name)
                        })
                        // this.lineData3.columns = arr
                        
                        let arr1 = []
                        res.data.list.map(item=>{
                            let obj = {}
                            obj['日期'] = item.month
                            item.leaveCount.map(i=>{
                                obj[i.name] = i.count
                            })
                            arr1.push(obj)
                        })
                        // this.lineData3.rows = arr1

                    }
				});
            },

            studentLeaveCount(year) {
				let para = {
                    schoolId: this.schoolId,
                    year: year
                }
				studentLeaveCount(para).then((res) => {
                    if(res.code == 200){
                        let arr = ['日期']
                        res.data.types.map(item=>{
                            arr.push(item.name)
                        })
                        // this.lineData4.columns = arr
                        
                        let arr1 = []
                        res.data.list.map(item=>{
                            let obj = {}
                            obj['日期'] = item.month
                            item.leaveCount.map(i=>{
                                obj[i.name] = i.count
                            })
                            arr1.push(obj)
                        })
                        // this.lineData4.rows = arr1

                    }
				});
            },

            repairCount(val){
                if(!val) return
                let para = {
                    schoolId: this.schoolId,
                    year: val
                }
				repairCount(para).then((res) => {
                    if(res.code == 200){
                       let arr = ['日期']
                        res.data.types.map(item=>{
                            arr.push(item.name)
                        })
                        // this.lineData6.columns = arr
                        
                        let arr1 = []
                        res.data.list.map(item=>{
                            let obj = {}
                            obj['日期'] = item.month
                            item.repairCount.map(i=>{
                                obj[i.name] = i.count
                            })
                            arr1.push(obj)
                        })
                        // this.lineData6.rows = arr1
                    }
				});
            },

            change1(val){
				this.teacherLeaveCount(val)
            },
            change2(val){
                this.studentLeaveCount(val)
            },
            change3(val){
                this.repairCount(val)
            },

            getYears(minYear){
                var myDate = new Date();
                var thisYear = myDate.getFullYear(); // 获取当年年份
                var Section = thisYear - minYear; // 声明一个变量 获得当前年份至想获取年份差 eg.2008
                var arrYear = []; // 声明一个空数组 把遍历出的年份添加到数组里
                for (var i = 0; i <= Section; i++) {
                    arrYear.push(thisYear--)
                }
                return arrYear
            },

            getCurrentYear(){
                var myDate = new Date();
                var thisYear = myDate.getFullYear(); // 获取当年年份
                return thisYear
            }
        },
        

        mounted: function () {
            this.schoolId = localStorage.getItem("schoolId")
            this.placeRepairCount()
            this.teacherLeaveCount(2020)
            this.studentLeaveCount(2020)
            this.repairCount(2020);
            this.value1 = this.getCurrentYear();
            this.value2 = this.getCurrentYear();
            this.value3 = this.getCurrentYear();

        },
        updated: function () {

        }
    }
</script>

<style scoped>
   
    .box-10{
        /* width: 372px;
        margin: 0 5px; */
    }
    .last-box h4{
        height: 20px;
    }
    .p1{
        padding-top: 20px!important;
        padding-bottom: 0!important;
    }
    .inner-box{
        margin: 0 5px;
        background-color: #fff;
        padding-top: 20px;
    }
    .inner-box h4{
        height: 20px;
    }
    .inner-box1{
        padding-bottom: 40px;

    }
    .box-1{
        height: 344px!important;
    }
    .el-row{
        margin-bottom: 10px;
    }
    .p0{
        padding: 0!important;
    }
    .box-bottom{
        background-color: #f2f2f2;
        padding: 10px;
    }
    .box-bottom h2{
        text-align: center;
        color: #666666;
        margin: 0;
        margin-bottom: 6px;
    }
    .box-bottom h4{
        text-align: center;
        color: #666666;
        margin: 0;
    }
    .el-col-6{
        padding: 0!important;

    }

    .box{
        padding-left: 10px;
        font-size: 16px;
    }
    .box-row{
        height: 120px;
        background-color: red;
        border-radius: 5px;
    }
    .last-row{
        padding-right: 5px;
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

    .inner-box2{
        margin-right: 10px;
    }


    .chart-container {
        width: 100%;
        float: left;
    }
    .el-col {
        padding: 30px 20px;
    }
    .last-box{
        background-color: #fff;
        padding-top: 20px!important;
        height: 435px;
        overflow: hidden;
        padding-right: 5px;
    }
    .last-box-inner{
        margin-top: 15px;
    }
    .inner-box3{
        margin: 0;
        padding-top: 0!important;
    }
    .el-row-1{
        background-color: #fff;
        padding: 0;
        padding-top: 20px;
        padding-bottom: 40px;
        /* margin: 0 5px; */
    }
    .el-row-1 .el-row{
        margin-bottom: 0;
    }
    .pd5{
        /* margin: 0 5px; */
    }
    /* .box1{
        background-color: red;
        padding-top: 20px!important;
        padding-bottom: 30px!important;
    } */

    .mb0{
        margin-bottom: 0!important;
    }
</style>
