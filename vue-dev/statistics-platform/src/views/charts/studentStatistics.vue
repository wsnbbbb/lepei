<template>
    <section class="chart-container">
        <div class="box-bottom">
            <el-row >
                <el-col :span="6" class="p0">
                    <div class="inner-box inner-box1">
                        <h2>学生性别统计</h2>
                        <h4>总人数{{chartData1.rows[0]['人数']+chartData1.rows[1]['人数']}}人</h4>
                        <ve-pie :data="chartData1" height='320px'></ve-pie>
                    </div>
                </el-col>
                <el-col :span="12" class="p0">
                    <div class="inner-box">
                        <h2>学业阶段统计</h2>
                        <h4></h4>
                        <ve-histogram :data="chartData5" :settings="chartSettings" height='360px'></ve-histogram>
                    </div>
                </el-col>
                 <el-col :span="6" class="p0">
                    <div class="inner-box inner-box1">
                        <h2>读书形式统计</h2>
                        <h4>总人数{{chartData2.rows[0]['人数']+chartData2.rows[1]['人数']}}人</h4>
                        <ve-pie :data="chartData2" height='320px'></ve-pie>
                     </div>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="6" class="p0">
                    <div class="inner-box inner-box1">
                        <h2>教师性别统计</h2>
                        <h4>总人数{{chartData3.rows[0]['人数']+chartData3.rows[1]['人数']}}人</h4>
                        <ve-pie :data="chartData3" height='320px'></ve-pie>
                    </div>
                </el-col>
                <el-col :span="12" class="p0">
                    <div class="inner-box ">
                        <h2>年级人数统计</h2>
                        <div class="box">
                            学业阶段：
                            <el-select style="width:100px;" v-model="value1" placeholder="请选择"  @change="change1">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <ve-histogram class="box-1" :data="lineData1" :legend-visible="false" :settings="chartSettings1" height='360px'></ve-histogram>
                    </div>
                </el-col>
                 <el-col :span="6" class="p0">
                    <div class="inner-box inner-box1">
                        <h2>职工性别统计</h2>
                        <h4>总人数{{chartData4.rows[0]['人数']+chartData4.rows[1]['人数']}}人</h4>
                        <ve-pie :data="chartData4" height='320px'></ve-pie>
                     </div>
                </el-col>
            </el-row>
              <el-row class="last-row">
                 <el-col :span="12" class="p0">
                    <div class="inner-box inner-box2">
                        <h2>班级人数统计</h2>
                        <div class="box">
                            学业阶段：
                            <el-select style="width:100px;" v-model="value" placeholder="请选择" @change="getGradesByType">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年级：
                            <el-select style="width:100px;" v-model="value3" placeholder="请选择"  @change="getClassByType">
                                <el-option
                                    v-for="item in options3"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <ve-histogram class="box-1" :data="lineData2" :legend-visible="false" :settings="chartSettings1" height='360px'></ve-histogram>
                    </div>
                </el-col>
                <el-col :span="12" class="p0 last-box">
                    <h2>积分统计</h2>
                    <h4></h4>
                    <el-row>
                        <el-col :span="12" class="p0">
                            <div class="last-box-inner">
                                <ve-histogram class="box-1" :legend-visible="false" :data="chartData6" :settings="chartSettings" height='360px'></ve-histogram>
                            </div>
                         </el-col>
                         <el-col :span="12" class="p0">
                            <div class="inner-box">
                                <h2>排行</h2>
                                <ul class="ul-box">
                                    <li :key="index" v-for="(item, index) in scoreList">
                                        <span class="li-rank">{{item.className}}</span>
                                        <span class="li-name">{{item.personName}}</span>
                                        <span class="li-score">{{item.score}}分</span>
                                    </li>
                                    
                                </ul>
                                <el-row class="btn-el-row">
                                    <el-button v-show="page!=1" v-on:click="lastPage">上一页</el-button>
                                    <!-- <el-button v-show="page!=totalPage" type="primary" v-on:click="nextPage">下一页</el-button> -->
                                </el-row>
                                <!-- <ve-histogram class="box-1" :legend-visible="false" :data="chartData" :settings="chartSettings" height='360px'></ve-histogram> -->
                            </div>
                         </el-col>
                    </el-row>
                </el-col>
            </el-row>
         </div>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import { schoolPersonCount, getTypes, getGradeByType, getGradesByType, getClassByType, studentScoreList } from '../../api/api';
import { Option } from 'element-ui';

    export default {
        data() {
            return {
                page: 1,
                pageSize: 10,
                totalPage: 0,
                scoreList: [
                    {
                        className: '2018级二班',
                        personName: '王小飞',
                        score: 98
                    },
                     {
                        className: '2019级五班',
                        personName: '李飞',
                        score: 97
                    },
                     {
                        className: '2019级四班',
                        personName: '姜朋',
                        score: 95
                    },
                     {
                        className: '2020级六班',
                        personName: '张磊',
                        score: 93
                    },
                     {
                        className: '2020级二班',
                        personName: '李文龙',
                        score: 92
                    },
                     {
                        className: '2020级二班',
                        personName: '何磊',
                        score: 91
                    },
                     {
                        className: '2019级二班',
                        personName: '文耀',
                        score: 89
                    },
                     {
                        className: '2020级一班',
                        personName: '张婷',
                        score: 88
                    },
                     {
                        className: '2019级一班',
                        personName: '龙波',
                        score: 86
                    },
                     {
                        className: '2019级三班',
                        personName: '邱林',
                        score: 85
                    },
                     {
                        className: '2018级一班',
                        personName: '熊春燕',
                        score: 83
                    }
                ],
                schoolId: '',
                options: [
                    {
                        label: '小学',
                        value: '1'
                    },
                     {
                        label: '初中',
                        value: '2'
                    },
                      {
                        label: '高中',
                        value: '3'
                    }
                    

                ],
                value: '',
                options1: [],
                value1: '',
                options3: [
                    {
                        label: '2018级',
                        value: '1'
                    },
                     {
                        label: '2019级',
                        value: '2'
                    },
                     {
                        label: '2020级',
                        value: '3'
                    },

                ],
                value3: '2020级',
                data: {},
                chartSettings: {
                    yAxisName: ['人数(人)'],
                },
                chartSettings1: {
                    yAxisName: ['数量(人)'],
                },
                chartData1: {
                    columns: ['性别', '人数'],
                    rows: [
                        { '性别': '男', '人数': 3099 },
                        { '性别': '女', '人数': 2890 },
                    ]
                },
                chartData2: {
                    columns: ['读书形式', '人数'],
                    rows: [
                        { '读书形式': '住读', '人数': 3919 },
                        { '读书形式': '走读', '人数': 2070 },
                    ]
                },
                chartData3: {
                    columns: ['性别', '人数'],
                    rows: [
                        { '性别': '男', '人数': 137 },
                        { '性别': '女', '人数': 273 },
                    ]
                },
                chartData4: {
                    columns: ['性别', '人数'],
                    rows: [
                        { '性别': '男', '人数': 393 },
                        { '性别': '女', '人数': 530 },
                    ]
                },
                chartData: {
                    columns: ['学业阶段', '男生', '女生', '保密', '总数'],
                    rows: [
                        { '学业阶段': '学校1', '男生': 200, '女生': 1093, '总数': 1295 },
                    ]
                },
                chartData5: {
                    columns: ['学业阶段', '男生', '女生','总数'],
                    rows: [
                        { '学业阶段': '小学', '男生': 200, '女生': 1093, '总数': 1293 },
                        { '学业阶段': '初中', '男生': 1220, '女生': 330, '总数': 1520 },
                        { '学业阶段': '高中', '男生': 230, '女生': 3230, '总数': 3430 },
                    ]
                },
                chartData6: {
                    columns: ['name', '人数'],
                    rows: [
                        { 'name': '等级1', '人数': 200},
                        { 'name': '等级2', '人数': 98},
                        { 'name': '等级3', '人数': 198},
                        { 'name': '等级4', '人数': 398},
                        { 'name': '等级5', '人数': 498},
                    ]
                },
                lineData1: {
                    columns: ['年级', '数量'],
                    rows: [
                        { '年级': '2018级', '数量': 1295 },
                        { '年级': '2019级', '数量': 695 },
                        { '年级': '2020级', '数量': 995 },
                    ]
                },
                lineData2: {
                    columns: ['班级', '数量'],
                    rows: [
                        { '班级': '1班', '数量': 45 },
                        { '班级': '2班', '数量': 42 },
                        { '班级': '3班', '数量': 37 }, 
                        { '班级': '4班', '数量': 33 },
                        { '班级': '5班', '数量': 48 },

                       
                    ]
                },
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
               
            }
        },

        methods: {

            formatGradeType(type) {
				if(type==1){
					return "幼儿园"
				}else if(type==2){
					return "小学"
				}else if(type==3){
					return "初中"
				}else if(type==4){
					return "高中"
				}else if(type==5){
					return "大学"
				}
			},


            getTypes(){
                let para = {
                    schoolId: this.schoolId
                }
				getTypes(para).then((res) => {
                    if(res.code == 200){
                        let options = []
                        res.data.map(i=>{
                            options.push({
                                value: i.typeId,
                                label: i.typeName
                            })
                        })
                        // this.options = options

                        if(options[0]){
                            this.change1(options[0].value)
                            this.value1 = options[0].value
                            this.value = options[0].value
                            // this.getClassByType(options[0].value)
                        }
                        
                    }
                })
            },
            
            schoolPersonCount() {
				let para = {
                    schoolId: this.schoolId
                }
				this.listLoading = true;
				schoolPersonCount(para).then((res) => {
                    this.listLoading = false;
                    this.data = res.data
                    let arr = []
                    res.data.gtSexCount.map(i=>{
                        arr.push(i.gradeType)
                    })
                    arr = Array.from(new Set(arr))
                    console.log(arr)

                    let typeArr = []
                    arr.map(i=>{
                        typeArr.push(this.formatGradeType(i))
                    })
                    console.log(typeArr)
                    let resultArr = []
                    arr.map(item=>{
                        let obj = {}
                        res.data.gtSexCount.map(i=>{
                            if(i.gradeType == item){
                                obj['学业阶段'] = this.formatGradeType(i.gradeType)
                                // if(i.sexType == 0){
                                //     obj['保密'] = i.count+0
                                // }
                                if(i.sexType == 1){
                                    obj['男生'] = i.count+0
                                }
                                if(i.sexType == 2){
                                    obj['女生'] = i.count+0
                                }
                                obj['总数'] = (obj['男生']) + (obj['女生'])
                            }
                        })
                        resultArr.push(obj)
                    })

                    // this.chartData5.rows = resultArr


                   let levelArr = []
                   res.data.studentScoreLevelCount.map(i=>{
                       levelArr.push({
                           'name': i.name,
                           '人数': i.count
                       })
                   })

                    // this.chartData6.rows = levelArr

                    let studentSexArr = []
                   res.data.studentSexCount.map(i=>{
                       if(i.type== 1){
                            studentSexArr.push({
                                '性别': "男",
                                '人数': i.count
                            })
                       }else if(i.type== 2){
                            studentSexArr.push({
                                '性别': "女",
                                '人数': i.count
                            })
                       }
                   })
                    // this.chartData1.rows = studentSexArr

                    let teacherSexArr = []
                   res.data.teacherSexCount.map(i=>{
                       if(i.type== 1){
                            teacherSexArr.push({
                                '性别': "男",
                                '人数': i.count
                            })
                       }else if(i.type== 2){
                            teacherSexArr.push({
                                '性别': "女",
                                '人数': i.count
                            })
                       }
                   })
                    // this.chartData3.rows = teacherSexArr

                     let staffSexArr = []
                   res.data.staffSexCount.map(i=>{
                       if(i.type== 1){
                            staffSexArr.push({
                                '性别': "男",
                                '人数': i.count
                            })
                       }else if(i.type== 2){
                            staffSexArr.push({
                                '性别': "女",
                                '人数': i.count
                            })
                       }
                   })
                    // this.chartData4.rows = staffSexArr

				});
            },
            
            
            change1(val){
				let para = {
                    schoolId: this.schoolId,
                    gradeType: val
                }
				this.listLoading = true;
				getGradeByType(para).then((res) => {
                    if(res.code == 200){
                        let arr = []
                        res.data.map(item=>{
                            arr.push({
                                 '年级': item.name,
                                 '数量': item.count
                            })
                        })
                        // this.lineData1.rows = arr
                    }
				});
            },
            
            getGradesByType(val){
				let para = {
                    schoolId: this.schoolId,
                    typeId: val
                }
                this.listLoading = true;
                
				getGradesByType(para).then((res) => {
                    if(res.code == 200){
                        let arr = []
                        res.data.map(item=>{
                            arr.push({
                                'label': item.name,
                                'value': item.id
                            })
                        })
                        // this.options3 = arr
                        if(arr[0]){
                            this.getClassByType(arr[0].value)
                            // this.value3 = arr[0].value
                         }
                    }
                });
                
                // this.value3 = ''
              

            },


            getClassByType(val){
                if(!val) return
                let para = {
                    schoolId: this.schoolId,
                    gradeId: val
                }
				getClassByType(para).then((res) => {
                    if(res.code == 200){
                        let arr = []
                        res.data.map(item=>{
                            arr.push({
                                 '年级': item.name,
                                 '数量': item.count
                            })
                        })
                        // this.lineData2.rows = arr

                    }
				});
            },

            studentScoreList(page){
                let para = {
                    schoolId: this.schoolId,
                    page: page||this.page,
                    pageSize: this.pageSize
                }
				studentScoreList(para).then((res) => {
                    if(res.code == 200){
                        // this.scoreList = res.data.dataList
                        this.page = res.data.currentPage
                        this.totalPage = res.data.totalPage
                    }
				});
            },
            lastPage(){
                this.studentScoreList(this.page-1)
            },
            nextPage(){
                this.studentScoreList(this.page+1)
            }
        },

        mounted: function () {
            this.schoolId = localStorage.getItem("schoolId")
            this.schoolPersonCount()
            this.studentScoreList()
            this.getTypes()
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
    .ul-box{
        list-style: none;
        padding: 0;
        margin: 0;
        /* padding-top: 20px; */
        height: 220px;
        color: #666;
    }
    .ul-box>li{
        padding: 1px 0;
    }
    .li-rank{
        width: 120px;
        display: inline-block;
    }
    .li-name{
        width: 80px;
        display: inline-block;
    }
     .li-score{
        width: 60px;
        display: inline-block;
        text-align: right;
    }
    .btn-el-row{
        text-align: center;
    }
</style>
