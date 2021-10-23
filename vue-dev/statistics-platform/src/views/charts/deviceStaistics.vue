<template>
    <section class="chart-container">
        <el-row class="last-row">
            <!-- 门禁分析  门禁总数 {{deviceCount}}个 -->
            门禁分析  门禁总数 3个
        </el-row>
        <div class="box-bottom">
            <el-row class="last-row">
                <el-col :span="12" class="p0">
                    <div class="inner-box">
                        <h2>门禁数据月分析</h2>
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
                            &nbsp;&nbsp;&nbsp;&nbsp;门禁：
                            <el-select style="width:100px;" v-model="value2" placeholder="请选择"  @change="change2">
                                <el-option label="全部" value=""></el-option>
                                <el-option
                                    v-for="item in options2"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                             &nbsp;&nbsp;&nbsp;&nbsp;
                            <el-button type="primary" v-on:click="search1">查询</el-button>
                        </div>
                        <ve-line :data="lineData1" :legend-visible="false" :settings="chartSettings1" height='360px'></ve-line>
                    </div>
                </el-col>
                <el-col :span="12" class="p0">
                    <div class="inner-box">
                        <h2>门禁数据日分析</h2>
                        <div class="box">
                            年份：
                            <el-select style="width:100px;" v-model="value3" placeholder="请选择"  @change="change3">
                                <el-option
                                    v-for="item in options1"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            &nbsp;&nbsp;&nbsp;&nbsp;月份：
                            <el-select style="width:70px;" v-model="value4" placeholder="请选择"  @change="change4">
                                <el-option
                                    v-for="item in options4"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            &nbsp;&nbsp;&nbsp;&nbsp;门禁：
                            <el-select style="width:100px;" v-model="value5" placeholder="请选择"  @change="change5">
                                <el-option label="全部" value=""></el-option>
                                <el-option
                                    v-for="item in options2"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                             &nbsp;&nbsp;&nbsp;&nbsp;
                            <el-button type="primary" v-on:click="search2">查询</el-button>
                        </div>
                        <ve-line :data="lineData2" :legend-visible="false" :settings="chartSettings2" height='360px'></ve-line>
                    </div>
                </el-col>
            </el-row>
         </div>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import { entryDeviceCount, entryDataCountByMonth, entryDataCountByDay} from '../../api/api';

    export default {
        data() {
            return {
                schoolId: '',
                deviceCount: 0,
                value: '',
              
                options1: [],
                options2: [],
                options3: [],
                options4: [
                    {value: 1, label: "1月"},
                    {value: 2, label: "2月"},
                    {value: 3, label: "3月"},
                    {value: 4, label: "4月"},
                    {value: 5, label: "5月"},
                    {value: 6, label: "6月"},
                    {value: 7, label: "7月"},
                    {value: 8, label: "8月"},
                    {value: 9, label: "9月"},
                    {value: 10, label: "10月"},
                    {value: 11, label: "11月"},
                    {value: 12, label: "12月"}
                ],
                value1: '',
                value2: '',
                value3: '',
                value4: 1,
                value5: '',
                chartSettings1: {
                    yAxisName: ['数量(次)'],
                },
                chartSettings2: {
                    yAxisName: ['数量(个)'],
                },
        
                lineData1: {
                    columns: ['时间', '数量'],
                    rows: [
                        {'时间': '2018年', '数量': 12},
                        {'时间': '2019年', '数量': 19},
                        {'时间': '2020年', '数量': 28},
                    ]

                },
                lineData2: {
                    columns: ['时间', '数量'],
                    rows: [
                        {'时间': '1', '数量': 12},
                        {'时间': '2', '数量': 22},
                        {'时间': '3', '数量': 44},
                        {'时间': '4', '数量': 54},
                        {'时间': '5', '数量': 2},
                        {'时间': '6', '数量': 6},
                        {'时间': '7', '数量': 71},
                        {'时间': '8', '数量': 32},
                        {'时间': '9', '数量': 55},
                        {'时间': '10', '数量': 12},
                        {'时间': '11', '数量': 44},
                        {'时间': '12', '数量': 21},
                        {'时间': '13', '数量': 77},
                        {'时间': '14', '数量': 86},
                        {'时间': '15', '数量': 12},
                        {'时间': '16', '数量': 43},
                        {'时间': '17', '数量': 55},
                        {'时间': '18', '数量': 98},
                        {'时间': '19', '数量': 21},
                        {'时间': '20', '数量': 34},
                        {'时间': '21', '数量': 54},
                        {'时间': '22', '数量': 33},
                        {'时间': '23', '数量': 23},
                        {'时间': '24', '数量': 55},
                        {'时间': '25', '数量': 67},
                        {'时间': '26', '数量': 77},
                        {'时间': '27', '数量': 12},
                        {'时间': '28', '数量': 44},
                        {'时间': '29', '数量': 54},
                        {'时间': '30', '数量': 39},

                    ]
                },

            }
        },

        methods: {

            entryDeviceCount(){
                let para = {
                    schoolId: this.schoolId
                }
                entryDeviceCount(para).then((res) => {
                    if(res.code == 200){
                        this.deviceCount = res.data.deviceCount
                        let years1 = this.getYears(res.data.recordMinYear)
                        let years1Arr = []
                        years1.map(i=>{
                            years1Arr.push({
                                value: i,
                                label: i + '年'
                            })
                        })
                        this.options1 = years1Arr

                        let optionArr = []
                        res.data.deviceList.map(i=>{
                            optionArr.push({
                                value: i.devSn,
                                label: i.devName
                            })
                        })
                        this.options2 = optionArr
                    }
                })
            },
     
            entryDataCountByMonth(para) {
				entryDataCountByMonth(para).then((res) => {
                    if(res.code == 200){
                        let arr = []
                        res.data.map(item=>{
                            arr.push({
                                "时间": item.month,
                                "数量": item.count,
                            })
                        })
                        // this.lineData1.rows = arr
                    }
				});
            },

            entryDataCountByDay(para) {
				entryDataCountByDay(para).then((res) => {
                    if(res.code == 200){
                        let arr = []
                        res.data.map(item=>{
                            arr.push({
                                "时间": item.day,
                                "数量": item.count,
                            })
                        })
                        // this.lineData2.rows = arr
                    }
				});
            },

            search1(){
                let para = {
                    schoolId: this.schoolId,
                    year: this.value1||'',
                    devSn: this.value2||'',
                }
                this.lineData1.rows = []
                this.entryDataCountByMonth(para)
            },

            search2(){
                let para = {
                    schoolId: this.schoolId,
                    year: this.value3||'',
                    month: this.value4||'',
                    devSn: this.value5||'',
                }
                this.lineData2.rows = []
                this.entryDataCountByDay(para)
            },
    

            change1(val){
                this.value1 = val
            },
            change2(val){
                this.value2 = val
            },
            change3(val){
                this.value3 = val
            },
            change4(val){
                this.value4 = val
            },
            change5(val){
                this.value5 = val
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
            this.entryDeviceCount()
            this.entryDataCountByMonth({
                schoolId: this.schoolId,
                year: this.getCurrentYear()
            })
            // this.studentLeaveCount(2020)
            // this.repairCount(2020);
            this.value1 = this.getCurrentYear();
            this.value3 = this.getCurrentYear();
            var date = new Date();
            var currentMonth = date.getMonth()-1
            this.value4 = currentMonth
            let para = {
                    schoolId: this.schoolId,
                    year: this.value3||'',
                    month: this.value4,
                    devSn: this.value5||'',
                }
            this.entryDataCountByDay(para)

        },
        updated: function () {

        }
    }
</script>

<style scoped>
 
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
</style>
