import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs,Button,Input,Select,Form,Col,Row,DatePicker, Modal,message,Tooltip ,Steps, Radio ,Table} from 'antd';
import SetClassScore from './setClassScore';
import { getDays,getAllDays,formatDate, isNumber, getDateData,toDecimal2, getQueryString,defaultDate,getMonthDays } from '../../utils/public';
import echarts from 'echarts';
import PageIndex from '../../components/page';
import ImgPreview from '../../components/imgPreview';
import {getImg,portUrl} from '../../utils/img';
import moment from 'moment';
import "./style.less";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker , MonthPicker} = DatePicker;
const { TextArea } = Input;
const Option = Select.Option;
const Step = Steps.Step;

class MoralIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tabData:'1',
            size:'1',
            size1:'2',
            size2:'4',
            page:1,
            prePage:20,
            sort:'1',
            visible: false ,
            classDisabled:true,
            classValue:'',
            gradeId:'',
            semesterId:'',
            semesterChartId:'',
            tyId:'',
            tyChartId:'',
            ths:[],
            thData:[],
            licenceUrl:"",
            previewVisible: false,
            singleClassScore: {},
            cycle1: 1,
            weekList: [],
            cycle2: 1,
            curType: '',
            curCycle2: ''

        };
    }
    componentDidMount=()=>{
        this.props.dispatch({ //获取所有学期
            type:'user/getAllSemesters',
            callback:(res)=>{
                if(res.code===200){
                    res.data.map(item=>{
                        if(item.isCurrent===true){
                            const params={
                                "typeId": 0,
                                "quickSearch": this.state.size,
                                "semesterId": item.semesterId,
                                "type": this.state.cycle1
                            }
                            const params1={
                                "typeId": '',
                                "quickSearch": 1,
                                "semesterId": item.semesterId,
                            }
                            this.getBarData(params,this.state.sort);//获取柱状图
                            this.getClassScoreData(params1); //获取考评统计列表
                            this.setState({semesterChartId:item.semesterId,semesterId:item.semesterId})
                            this.props.dispatch({
                                type:'moralEvaluation/getClassScoreType',
                                payload:{"semesterId":item.semesterId, "type": 1},
                                callback:(res)=>{
                                    if(res.code===200){
                                        this.setState({
                                            scoreChartTypeBySemester: res.data,
                                            scoreTypeBySemester: res.data
                                        })
                                    }
                                }
                            })

                            this.props.dispatch({ //获取周
                                type:'moralEvaluation/getMoralWeek',
                                payload:{"semesterId":item.semesterId},
                                callback:(res)=>{
                                    if(res.code===200){
                                        this.setState({weekList: res.data})
                                    }
                                }
                            })
                        }
                    })
                }
            }
        })
        this.props.dispatch({ //获取所有年级
            type:'user/getCommonGradeList',
        })

        const key=getQueryString("key")
        if(key){
            this.setState({tabData:key})
        }
        var now = new Date();                    //当前日期      
        var nowDay = now.getDate();              //当前日     
        var nowMonth = now.getMonth();           //当前月     
        var nowYear = now.getFullYear();             //当前年 
        if(this.state.size==1){ //今日
            const startData=new Date(nowYear, nowMonth, nowDay)
            const endData= new Date(nowYear, nowMonth, nowDay)
            this.setState({startDate:defaultDate(startData),endDate:defaultDate(endData)})
        }
        
    }

    cycleChange1=(e)=>{

        this.props.dispatch({ //获取所有考评项
            type:'moralEvaluation/getClassScoreType',
            payload: {
                semesterId: this.state.semesterChartId,
                type: e.target.value
            },
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        scoreChartTypeBySemester: res.data,
                        tyChartId: ''
                    })
                }
            }
        })
        this.setState({
            cycle1: e.target.value,
        });
    }
    cycleChange2=(e)=>{
        this.props.dispatch({ //获取所有考评项
            type:'moralEvaluation/getClassScoreType',
            payload: {
                semesterId: this.state.semesterChartId,
                type: e.target.value
            },
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        scoreTypeBySemester: res.data,
                        tyId: ''
                    })
                }
            }
        })
        this.setState({
            cycle2: e.target.value,
        });
    }
    cycleChange3=(e)=>{
        this.setState({
            cycle3: e.target.value,
        });
    }

    showImg=(url)=>{
        this.setState({
            previewVisible: true,
            licenceUrl: getImg(url)
        })
    }
  
    closePreview=()=>{
        this.setState({
            previewVisible: false
        })
    }
    tabChange=(value)=>{
        
        this.setState({tabData:value})
    }
    // 获取柱状图
    getBarData=(params,id)=>{
        this.props.dispatch({
          type: 'moralEvaluation/getClassScoreBar',
          payload: params,
          callback:(res)=>{
            if(res.code===200){
              let xData=[];let yData=[];
              if(id==1){
                res.data.classList&&res.data.classList.length>0&&res.data.classList.map(item=>{
                    xData.push(`${item.gradeName}${item.className}`);
                    yData.push(item.totalScore)
                })
              }else{
                res.data.gradeList&&res.data.gradeList.length>0&&res.data.gradeList.map(item=>{
                    xData.push(item.gradeName);
                    yData.push(item.averageScore)
                })
              }
              const myChart = echarts.init(document.getElementById('barCharts'));
              myChart.setOption({
                title: {
                    text: ''
                },
                color: ['#3398DB'],
                tooltip: {},
                xAxis: {
                    data: xData,
                    axisTick: {
                      alignWithLabel: true
                    }
                },
                yAxis: {},
                series: [{
                    name: '分数',
                    type: 'bar',
                    data: yData
                }]
              });
            }
            
          }
        })
    }
    // 获取考评统计列表
    getClassScoreData=(params)=>{
        this.props.dispatch({
          type:"moralEvaluation/getClassScoreList",
          payload:{"page":this.state.page,"prePage":this.state.prePage,...params, type: this.state.cycle1},
        })
    }
    // 查询
    search=()=>{
        const {startDate, endDate, size, sort, size1, size2, cycle1} = this.state;
        let quickSearch = ''
        if(cycle1 == 1){
            quickSearch = this.props.form.getFieldValue("size")
        }else if(cycle1 == 2){
            quickSearch = this.props.form.getFieldValue("size1")
        }else if(cycle1 == 3){
            quickSearch = this.props.form.getFieldValue("size2")
        }
        let rst = ''
        let flag = true
        if(cycle1==1&&quickSearch==6){
            this.props.form.validateFields(['date'], (err, values) => {
                rst = values
                if(err) {
                    flag = false
                    return
                }
            })
        }else if(cycle1==2&&quickSearch==7){
            this.props.form.validateFields(['week'], (err, values) => {
                rst = values
                if(err) {
                    flag = false
                    return
                }
              })
        }else if(cycle1==3&&quickSearch==8){
            this.props.form.validateFields(['month'], (err, values) => {
                rst = values
                if(err) {
                    flag = false
                    return
                }
              })
        }

        if(!flag) return
        const params={
            "typeId":this.state.tyChartId||'',
            "quickSearch": (quickSearch==7||quickSearch==8||quickSearch==6)?0:quickSearch,
            "startDate":(cycle1==1&&quickSearch==6)?rst.date[0]&&rst.date[0].format('YYYY-MM-DD'):((cycle1==2&&quickSearch==7)?rst.week[0]:(cycle1==3&&quickSearch==8)?moment(rst.month).format('YYYY-MM'):""),
            "endDate":(cycle1==1&&quickSearch==6)?rst.date[1]&&rst.date[1].format('YYYY-MM-DD'):((cycle1==2&&quickSearch==7)?rst.week[1]:(cycle1==3&&quickSearch==8)?moment(rst.month).format('YYYY-MM'):""),
            "semesterId":this.state.semesterChartId, 
            "type": this.state.cycle1
          }

          this.getBarData(params,sort);
          this.getClassScoreData({"page":1,"prePage":this.state.prePage,...params})
          this.setState({page:1})

    }
    handleChange=(e)=>{
        this.setState({sort:e.target.value})
        this.props.form.validateFields((err, values) => {
        const params={
            "typeId":this.state.tyChartId||'',"quickSearch":this.state.size==6?0:this.state.size,
            "startDate":this.state.startDate||"","endDate":this.state.endDate||"","semesterId":this.state.semesterChartId, type: this.state.cycle1
        }
        this.getBarData(params,e.target.value)
        })
    }    
  
    handleSizeChange=(type, e)=>{
        if(type ===1){
            this.setState({size:e.target.value})
        }else if(type ===2){
            this.setState({size1:e.target.value})
        }else{
            this.setState({size2:e.target.value})
        }
        if(e.target.value==6||e.target.value==7||e.target.value==8) return
  
        this.props.form.validateFields((err, values) => {
          const params={
            "typeId":this.state.tyChartId||'',
            "quickSearch":e.target.value==6?0:e.target.value,
            "semesterId":this.state.semesterChartId,
            // "startDate":this.state.startDate||'',"endDate":this.state.endDate||"",
            "type": this.state.cycle1
          }

          if(e.target.value!=6){
            this.getBarData(params,this.state.sort);
            this.getClassScoreData({"page":1,"prePage":this.state.prePage,...params, type: this.state.cycle1})
            this.setState({page:1,startDate:'',endDate:''})
          }
        })
  
    }
    onTimeChange=(date, dateString)=> {
        const start=dateString[0];
        const end=dateString[1];
        this.setState({
          startDate:start,
          endDate:end
        })
    }
    // 分页
    onPageChange=(current,size)=>{

        const {size1, size2, cycle1} = this.state;
        let quickSearch = ''
        if(cycle1 == 1){
            quickSearch = this.props.form.getFieldValue("size")
        }else if(cycle1 == 2){
            quickSearch = this.props.form.getFieldValue("size1")
        }else if(cycle1 == 3){
            quickSearch = this.props.form.getFieldValue("size2")
        }
        let rst = ''
        let flag = true
        if(cycle1==1&&quickSearch==6){
            this.props.form.validateFields(['date'], (err, values) => {
                rst = values
                if(err) {
                    flag = false
                    return
                }
            })
        }else if(cycle1==2&&quickSearch==7){
            this.props.form.validateFields(['week'], (err, values) => {
                rst = values
                if(err) {
                    flag = false
                    return
                }
              })
        }else if(cycle1==3&&quickSearch==8){
            this.props.form.validateFields(['month'], (err, values) => {
                rst = values
                if(err) {
                    flag = false
                    return
                }
              })
        }
        if(!flag) return
        const params={
            "typeId":this.state.tyChartId||'',
            "quickSearch": (quickSearch==7||quickSearch==8||quickSearch==6)?0:quickSearch,
            "startDate":(cycle1==1&&quickSearch==6)?rst.date[0]&&rst.date[0].format('YYYY-MM-DD'):((cycle1==2&&quickSearch==7)?rst.week[0]:(cycle1==3&&quickSearch==8)?moment(rst.month).format('YYYY-MM'):""),
            "endDate":(cycle1==1&&quickSearch==6)?rst.date[1]&&rst.date[1].format('YYYY-MM-DD'):((cycle1==2&&quickSearch==7)?rst.week[1]:(cycle1==3&&quickSearch==8)?moment(rst.month).format('YYYY-MM'):""),
            "semesterId":this.state.semesterChartId, 
            "type": this.state.cycle1
          }
          this.getClassScoreData({"page":current,"prePage":this.state.prePage,...params})
    }
    
    goToDetail=(record)=>{
        this.setState({
           semesterId:record.semesterId,gradeId:record.gradeId,classValue:record.classId,tabData:'2',tyId:''
        })
        this.props.dispatch({
            type:"moralEvaluation/getClassScoreType",
            payload:{"semesterId":record.semesterId}
        })
        this.props.dispatch({
            type:'user/getClassName',
            payload:{"gradeId":record.gradeId},
            callback:(res)=>{
                if(res.code===200){
                    this.setState({classValue:record.classId,classDisabled:false})
                }
            }
        })
        const {startDate,endDate} = this.state;
        if(startDate&&endDate){
            Date.prototype.format=function (){
                var s='';
                s+=this.getFullYear()+'-';          // 获取年份。
                s+=(this.getMonth()+1)+"-";         // 获取月份。
                s+= this.getDate();                 // 获取日。
                return(s);                          // 返回日期。
            };
            const dateData=getAllDays(startDate,endDate)
            const datas=getDateData(dateData)
            this.setState({thData:datas})
            this.setState({
                startTime:startDate,endTime:endDate
            })
        }
        const params={
            "semesterId":record.semesterId,
            "gradeId":record.gradeId,
            "classId":record.classId,
            "typeId":'',
            "startDate":startDate||'',
            "endDate":endDate||''
        }
        this.getClassScoreDetail(params)
    }
// 考评明细tab
    semesterChange=(val)=>{
        this.setState({semesterId:val,tyId:""})
        this.props.dispatch({
            type:'moralEvaluation/getClassScoreType',
            payload:{"semesterId":val, type: this.state.cycle2},
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        scoreTypeBySemester:res.data
                    })
                }
            }
        })
    }
    semesterChangeChart=(val)=>{
        this.setState({semesterChartId:val,tyChartId:""})
        this.props.dispatch({
            type:'moralEvaluation/getClassScoreType',
            payload:{"semesterId":val, type: this.state.cycle1},
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        scoreChartTypeBySemester: res.data
                    })
                }
            }
        })
    }
    gradeChange=(val)=>{
        if(val){
          this.setState({gradeId:val})
          this.props.dispatch({
            type:'user/getClassName',
            payload:{"gradeId":val},
            callback:(res)=>{
              if(res.code===200){
                this.setState({classValue:'',classDisabled:false})
              }
            }
          })
        }else{
          this.setState({classValue:'',classDisabled:true,gradeId:''})
        }
    }
    classChange=(val)=>{
        this.setState({classValue:val})
    }
    typeChange=(val)=>{
        this.setState({tyId:val})
    }
    typeChartChange=(val)=>{
        this.setState({tyChartId:val})
    }
    showModal = (item,i) => {
        this.props.form.resetFields(["score","remark"]);
        if(i!=0&&item.isAllowedScore==0){
            Modal.warning({
                title: '您暂时没有权限编辑分数',
            });
        }
        if(i!=0&&item.isAllowedScore==1){
            this.setState({classId:item.classId,typeId:item.typeId,date:item.date,week:item.week,typeName:item.typeName})
            this.props.dispatch({
                type:'moralEvaluation/showScore',
                payload:{
                    "classId":item.classId,"typeId":item.typeId,"date":item.date, type: this.state.curType
                },
                callback: res=>{
                    if(res.code===200){
                        this.setState({
                            singleClassScore: res.data,
                            visible: true,
                        })
                    }
                }
            })
            this.props.dispatch({
                type:'moralEvaluation/getLogs',
                payload:{
                    "classId":item.classId,"typeId":item.typeId,"date":item.date,
                    "page":1,"prePage":1000
                }
            })
        }
    }
    
    handleOk = (e) => {
        const {classId,typeId,date, singleClassScore} = this.state;

            let errorFlag = false
            const reg=/^\d{1,11}$|^\d{1,11}[.]\d{1,2}$/;
            let scores = []
            let scoreFlag = true
            if(singleClassScore.secondTypes.length!==0){
                singleClassScore.secondTypes.map(item=>{
                    scores.push({
                        typeId: item.typeId,
                        score: item.score,
                        remark: item.remark
                    })
                    if(!reg.test(item.score)){
                        scoreFlag = false
                    }
                })
            }else{
                this.props.form.validateFields((err, values) => {
                    if(!values.score){
                        errorFlag = true
                    }
                    if(!reg.test(values.score)){
                        scoreFlag = false
                    }
                    scores.push({
                        typeId: singleClassScore.typeId,
                        score: values.score,
                        remark: values.remark
                    })
                })
            }
            if(singleClassScore.secondTypes.length===0&&errorFlag){
                return message.error("请填分数",2)
            }
            if(!scoreFlag){
                return message.error("分数只能输入整数或最多包含有两位小数的数字",3)
            }
            this.props.dispatch({
                type:'moralEvaluation/updateScore',
                payload:{
                    "classId": classId,
                    "date": date,
                    "scores": scores,
                    "type": this.state.curCycle2
                },
                callback:(res)=>{
                    if(res.code===200){
                        message.success("设置成功",2)
                        const params={
                            "semesterId":this.state.semesterId,
                            "gradeId":this.state.gradeId,
                            "classId":this.state.classValue,
                            "typeId":this.state.tyId,
                            "startDate":this.state.startTime,
                            "endDate":this.state.endTime
                        }
                        this.getClassScoreDetail(params)
                        this.setState({visible:false})
                        // this.props.form.resetFields(["score","remark"]);
                    }
                }
            })
        // })
    }
    
    handleCancel = (e) => {
        this.props.form.resetFields(["score","remark"]);
        this.setState({
          visible: false,
        });
    }
    onTimeChange2=(date, dateString)=> {
        const start=dateString[0];
        const end=dateString[1];
        this.setState({
          startTime:start,
          endTime:end
        })
        Date.prototype.format=function (){
            var s='';
            s+=this.getFullYear()+'-';          // 获取年份。
            s+=(this.getMonth()+1)+"-";         // 获取月份。
            s+= this.getDate();                 // 获取日。
            return(s);                          // 返回日期。
        };
        const dateData=getAllDays(start,end)
        const datas=getDateData(dateData)
        this.setState({ths:datas})
    }
    submit=()=>{
       
        this.props.form.validateFields((err, values) => {
            if(!this.state.semesterId){
                return message.error("请选择学期",2)
            }
    
            if(this.state.cycle2 == 1&&(!this.state.startTime||!this.state.endTime)){
                return message.error("请选择时间",2)
            }
     
            const params={
                "semesterId": this.state.semesterId,
                "gradeId": this.state.gradeId,
                "classId": this.state.classValue,
                "typeId": this.state.tyId,
                "startDate": this.state.cycle2 == 1?this.state.startTime:'',
                "endDate": this.state.cycle2 == 1?this.state.endTime:''
            }
            this.getClassScoreDetail(params)
        })
    }
    getClassScoreDetail=(params)=>{
        let curType = ''
        if(this.state.cycle2 ==1){
            curType = 1
        }else if(this.state.cycle2 == 2){
            curType = 2
        }else if(this.state.cycle2 == 3){
            curType = 3
        }
        this.props.dispatch({
            type: this.state.cycle2==1?'moralEvaluation/getMoralDayDetail': 
            (this.state.cycle2==2?"moralEvaluation/getMoralWeekDetail":"moralEvaluation/getMoralMonthDetail"),
            payload: params,
            callback: (res)=>{
                if(res.code===200){
                    this.setState({
                        classScoreDetails: res.data,
                        thData: res.data.header,
                        curType: curType,
                        curCycle2: this.state.cycle2
                    })
                }
            }
        })
    }
    exportList=()=>{
        const {semesterId,gradeId,classValue,tyId,startTime,endTime} = this.state;
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        const gId=gradeId||0;
        const cId=classValue||0;
        const tId=tyId||0
        let url = ''
        if(this.state.cycle2 == 1){
            url=portUrl("/manager/moral-education-evaluation/day-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&semesterId="+semesterId+"&gradeId="+gId+"&classId="+cId+"&typeId="+tId+"&startDate="+startTime+
            "&endDate="+endTime)
        }else if(this.state.cycle2 == 2){
            url=portUrl("/manager/moral-education-evaluation/week-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&semesterId="+semesterId+"&gradeId="+gId+"&classId="+cId+"&typeId="+tId)
        }else{
            url=portUrl("/manager/moral-education-evaluation/month-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&semesterId="+semesterId+"&gradeId="+gId+"&classId="+cId+"&typeId="+tId)
        }
        this.setState({exportUrl:url})
    }
    changeTypeName=(index, e)=>{
        let oldData = this.state.singleClassScore
        oldData.secondTypes[index].score = e.target.value
        this.setState({
            singleClassScore: oldData
        })
    }
    changeRemark=(index, e)=>{
        let oldData = this.state.singleClassScore
        oldData.secondTypes[index].remark = e.target.value
        this.setState({
            singleClassScore: oldData
        })
    }
    render(){
        const { singleClassScore, cycle1, cycle2, cycle3} = this.state;
        const { getFieldDecorator } = this.props.form;
        const {size,size1,size2,weekList,sort,allScoreTypes,scoreTypeBySemester,scoreChartTypeBySemester,tyChartId,semesterChartId,defauleSemesters} = this.state;
        const {classScoreList} = this.props;
        let child=[]
        allScoreTypes&&allScoreTypes.length>0&&allScoreTypes.map(item=>{
            child.push(<Option key={item.typeId} value={item.typeId}>
               <Tooltip placement="topLeft" title={item.typeName+'('+item.semesterName+')'}>{item.typeName+'('+item.semesterName+')'}</Tooltip>
              </Option>)
        })
        const columns = [{
            title: '排名',
            dataIndex: 'rank',
            key:'rank'
          }, {
            title: '年级',
            dataIndex: 'gradeName',
            key:'gradeName'
          }, {
              title: '班级',
              dataIndex: 'className',
              key:'className'
          }, {
            title: '班级评分',
            dataIndex: 'totalScore',
            key:'totalScore'
          }];
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const formItemLayout2 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const formItemLayout3 = {
            labelCol: { span: 2 },
            wrapperCol: { span: 10 }
        };
        const {allTerms,commonGradeData,classNameData ,classScoreLog} = this.props;
        const {classScoreDetails} = this.state;
        let termChild=[]
        allTerms&&allTerms.length>0&&allTerms.map(item=>{
            termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
        })
        let weekOption=[]
        weekList&&weekList.length>0&&weekList.map(item=>{
        weekOption.push(<Option key={item.startDate} value={[item.startDate, item.endDate]}>{item.weekNum}({item.startDate} ~ {item.endDate})</Option>)
        })
        let typeChild=[]
        scoreTypeBySemester&&scoreTypeBySemester.length>0&&scoreTypeBySemester.map(item=>{
            typeChild.push(<Option key={item.typeId} value={item.typeId}>
               <Tooltip placement="topLeft" title={item.typeName}>{item.typeName}</Tooltip>
              </Option>)
        })
        let typeChartChild=[]
        scoreChartTypeBySemester&&scoreChartTypeBySemester.length>0&&scoreChartTypeBySemester.map(item=>{
            typeChartChild.push(<Option key={item.typeId} value={item.typeId}>
               <Tooltip placement="topLeft" title={item.typeName}>{item.typeName}</Tooltip>
              </Option>)
        })
        let gradeChild=[]
        commonGradeData&&commonGradeData.length>0&&commonGradeData.map(item=>{
            gradeChild.push(<Option key={item.gradeId}>{item.gradeName}</Option>)
        })
        let classChild=[]
        classNameData&&classNameData.length>0&&classNameData.map(item=>{
            classChild.push(<Option key={item.classId}>{item.className}</Option>)
        })
        const {classDisabled,classValue,thData,gradeId,semesterId,tyId,startTime,endTime,tabData} = this.state;
        let data=[]
        if(classScoreDetails){
            classScoreDetails.classData.forEach(grade => {
                let gradeData = [];
                grade.classList.forEach(cls => {
                    let clsData = [];
                    classScoreDetails.typesList.forEach(tp => {
                        let tdList = [];
                        tdList.push(tp.typeName.name||tp.typeName);
                        thData.forEach(th => {
                            let flag = false;
                            let son={
                                typeId:tp.typeId,
                                typeName:tp.typeName.name||tp.typeName,
                                score: "",
                                date:th.date,
                                classId:cls.classId,
                                // week:th.week,
                                isAllowedScore:tp.isAllowedScore
                            }

                            cls.classScoreRecordsList.forEach(rec => {
                                if (String(rec.date) === String(th.date) && String(tp.typeId) === String(rec.typeId)) {
                                    son.score=(rec.score);
                                    flag = true;
                                }
                            })
                            if (!flag) {
                                son.score=('--')
                            }
                            tdList.push(son)
                        })
                        let arr=[];
                        tdList.map((item,idx)=>{

                            if(!isNaN(Number(item.score))){
                               arr.push(item.score)
                            }
                        })
                        let total=0;
                        arr.length>0&&arr.map(item=>{
                            total+=Number(item)
                        })
                        clsData.push({
                            tdList: tdList,
                            total:total==0?'0.00':total,
                            average:arr.length>0?(total/arr.length):'--'
                        })
                    })
                    gradeData.push({
                        clsName: cls.className,
                        totalScore: cls.totalScore,
                        averageScore: cls.totalAverageScore,
                        rank: cls.rank,
                        clsData: clsData,
                        flagCount: cls.flagCount
                    });
                });
                data.push({
                    gradeName: grade.gradeName,
                    gradeData: gradeData
                });
            })
        }
        console.log({data})
        let steps=[];
        classScoreLog&&classScoreLog.dataList.length>0&&classScoreLog.dataList.map(item=>{
            return steps.push(<Step description={<span>{item.examiner}&nbsp;&nbsp;{item.score}&nbsp;&nbsp;{item.source==1?"app":(item.source==2?"电子班牌":(item.source==3?"Pad":(item.source==4?"学校后台":"")))}&nbsp;&nbsp;{formatDate(item.createTime)}</span>}/>)
        })
        return (
            <div className="score-main">
              <Tabs defaultActiveKey='1' activeKey={tabData} onChange={this.tabChange}>
                  <TabPane tab="考评统计" key="1">
                  <div className="socre-main content-main">
                   <Row gutter={24} style={{padding: "10px 0"}}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;学期&nbsp;&nbsp;&nbsp;&nbsp;
                        <Select value={semesterChartId} style={{width: "200px"}} placeholder='请选择' onChange={this.semesterChangeChart}>
                            {termChild}
                        </Select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        评分周期&nbsp;&nbsp;&nbsp;&nbsp;
                        <Radio.Group onChange={this.cycleChange1} value={this.state.cycle1}>
                            <Radio value={1}>每日</Radio>
                            <Radio value={2}>每周</Radio>
                            <Radio value={3}>每月</Radio>
                        </Radio.Group>
                    </Row>
                    <Row gutter={24} style={{padding: "10px 0"}}>
                        <Col span={6}>
                            考评项&nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder='请选择' style={{width: '200px'}} value={tyChartId} onChange={this.typeChartChange}>
                                <Option key='' value=''>全部</Option>
                                {typeChartChild}
                            </Select>
                        </Col>
                        <Col span={9}>
                        {
                            this.state.cycle1 ===1? 
                            <FormItem label=''>
                                {getFieldDecorator('size',{initialValue:size})(
                                <Radio.Group onChange={this.handleSizeChange.bind(this, 1)}>
                                    <Radio.Button value="1">今日</Radio.Button>
                                    <Radio.Button value="2">本周</Radio.Button>
                                    <Radio.Button value="3">上周</Radio.Button>
                                    <Radio.Button value="4">本月</Radio.Button>
                                    <Radio.Button value="5">上月</Radio.Button>
                                    <Radio.Button value="6">自定义时间</Radio.Button>
                                    </Radio.Group>
                                )}
                            </FormItem>:(this.state.cycle1 ===2?<FormItem label=''>
                                {getFieldDecorator('size1',{initialValue:size1})(
                                <Radio.Group onChange={this.handleSizeChange.bind(this, 2)}>
                                    <Radio.Button value="2">本周</Radio.Button>
                                    <Radio.Button value="3">上周</Radio.Button>
                                    <Radio.Button value="7">自定义周</Radio.Button>
                                    </Radio.Group>
                                )}
                            </FormItem>:<FormItem label=''>
                                {getFieldDecorator('size2',{initialValue:size2})(
                                <Radio.Group onChange={this.handleSizeChange.bind(this, 3)}>
                                    <Radio.Button value="4">本月</Radio.Button>
                                    <Radio.Button value="5">上月</Radio.Button>
                                    <Radio.Button value="8">自定义</Radio.Button>
                                    </Radio.Group>
                                )}
                            </FormItem>)
                        }
                        </Col>
                            <Col span={5} style={{display: cycle1==1&&size==6? "block": "none"}}>
                                <FormItem label=''>
                                {getFieldDecorator('date', {rules:[{required:true,message:"请选择日期"}]})(
                                <RangePicker onChange={this.onTimeChange} />
                                )}
                                </FormItem>
                            </Col>
                            <Col span={5} style={{display: cycle1==2&&size1==7? "block": "none"}}>
                                <FormItem label=''>
                                {getFieldDecorator('week', {rules:[{required:true,message:"请选择周"}]})(
                                    <Select placeholder='请选择' style={{width: "90%"}}>
                                    {weekOption}
                                </Select>
                                )}
                                </FormItem>
                            </Col>
                            <Col span={5} style={{display: cycle1==3&&size2==8? "block": "none"}}>
                                <FormItem label=''>
                                {getFieldDecorator('month', {rules:[{required:true,message:"请选择月"}]})(
                                <MonthPicker placeholder="请选择" />
                                )}
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                            </Col>
                        </Row>
                        <Form className="ant-advanced-search-form content-form">
                            <Row gutter={24}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label=''>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {getFieldDecorator('sort',{initialValue:sort})(
                                        <Radio.Group onChange={this.handleChange}>
                                            <Radio.Button value="1">班级排行</Radio.Button>
                                            <Radio.Button value="2">年级排行</Radio.Button>
                                            </Radio.Group>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>  
                        <div className="chart-main">
                        <div id="barCharts" style={{ width: "95%", height: 500,display:"inline-block" }}></div>     
                        <div className="apply-main">
                            {/* <p className="apply-name"></p> */}
                            <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={classScoreList&&classScoreList.dataList} pagination={false}/>
                            <PageIndex getPage={this.onPageChange.bind(this)} total={classScoreList&&classScoreList.totalCount} totalPage={classScoreList&&classScoreList.totalPage} currentPage={classScoreList&&classScoreList.currentPage}/>
                        </div>
                        </div>  
                    </div>

                  </TabPane>
                  <TabPane tab="考评明细" key="2">
                        <div className='socre-table-main content-main'>
                        <Row gutter={24} style={{padding: "10px 0"}}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;学期&nbsp;&nbsp;&nbsp;&nbsp;
                            <Select value={semesterId} style={{width: '200px'}} placeholder='请选择' onChange={this.semesterChange}>
                                {termChild}
                            </Select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        评分周期&nbsp;&nbsp;&nbsp;&nbsp;
                        <Radio.Group onChange={this.cycleChange2} value={this.state.cycle2}>
                                <Radio value={1}>每日</Radio>
                                <Radio value={2}>每周</Radio>
                                <Radio value={3}>每月</Radio>
                            </Radio.Group>
                        </Row>
                        <Form className="ant-advanced-search-form content-form">
                            <Row gutter={24}>
                               
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label={'年级'}>
                                        <Select showSearch value={gradeId} onChange={this.gradeChange} optionFilterProp="children">
                                            <Option value='' key=''>全部</Option>
                                            {gradeChild}
                                        </Select>
                                    </FormItem>
                                </Col>  
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label={'班级'} >
                                        <Select showSearch value={classValue} optionFilterProp="children" onChange={this.classChange} disabled={classDisabled}>
                                            <Option value='' key=''>全部</Option>
                                            {classChild}
                                        </Select>
                                    </FormItem>
                                </Col> 
                                                                                                                                                                                                                                                                                                                                                                                                                
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='考评项'>
                                        <Select placeholder='请选择' value={tyId} onChange={this.typeChange}>
                                            <Option key='' value=''>全部</Option>
                                            {typeChild}
                                        </Select>
                                    </FormItem>
                                </Col> 
                              
                                <Col span={8} style={{display: cycle2 ===1?"block":"none"}}>
                                    <FormItem {...formItemLayout} label='时间'>
                                        <RangePicker onChange={this.onTimeChange2} value={[startTime?moment(startTime):'', endTime?moment(endTime):'']} />
                                    </FormItem>
                                </Col>
                                
                                <Col span={2} offset={2}>
                                    <Button type='primary' onClick={this.submit}>查询</Button>
                                </Col>
                                <Col span={2} offset={0}>
                                    <Button type='primary'><a href={this.state.exportUrl} onClick={this.exportList.bind(this)}>导出</a></Button>
                                </Col>
                            </Row>
                        </Form> 
                        <table border="1" className="class-score-table" style={{margin:'0 auto'}}>
                            <thead>
                                <tr>
                                    <th>年级</th><th>班级</th><th>考评项</th>
                                    {/* {
                                        thData.length>0&&thData.map((item,i)=>
                                            <th>
                                                {item.date}<br/>
                                                {getDays(item.week)}
                                            </th>
                                        )
                                    } */}
                                    {
                                        classScoreDetails&&classScoreDetails.header.map((item,i)=>
                                        <th>
                                            {item.headerTop}<br/>
                                            {/* {item.date}<br/> */}
                                            {item.headerBottom}
                                        </th>
                                    )
                                    }
                                
                                    <th>合计</th><th>单项平均分</th><th>总分</th><th>总平均分</th><th>排名</th>
                                    {this.state.curCycle2==1?<th>流动红旗次数</th>:null}
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(grade =>
                                    grade.gradeData.map((cls, idx) =>
                                        cls.clsData.map((item, index) =>
                                            <tr key={index}>
                                                {idx === 0 && index === 0 ? <td rowSpan={grade.gradeData.length * cls.clsData.length}>{grade.gradeName}</td> : null}
                                                {index === 0 ? <td rowSpan={cls.clsData.length}>{cls.clsName}</td> : null}
                                                {item.tdList.map((el, i) =>
                                                    <td style={{cursor:'pointer'}} key={i} onClick={this.showModal.bind(this,el,i)}>{i==0?el:el.score}</td>
                                                )}
                                                <td>{toDecimal2(item.total)}</td>
                                                <td>{toDecimal2(item.average)}</td>
                                                {index === 0 ? <td rowSpan={cls.clsData.length}>{cls.totalScore}</td> : null}
                                                {index === 0 ? <td rowSpan={cls.clsData.length}>{cls.averageScore}</td> : null}
                                                {index === 0 ? <td rowSpan={cls.clsData.length}>{cls.rank}</td> : null}
                                                {index === 0 &&this.state.curCycle2==1? <td rowSpan={cls.clsData.length}>{cls.flagCount}</td> : null}
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                        <Modal
                            title={
                                <span>
                                    考评详情(<span style={{marginRight:12}}>{this.state.date||''}</span><span style={{marginRight:12}}>{getDays(this.state.week||'')}</span><span>{this.state.typeName||''}</span>)
                                </span>
                            }
                            width='720px'
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <Form className="ant-advanced-search-form content-form">
                               {
                                 !singleClassScore.hasSecondTypes? <div> 
                                    <Row gutter={24}>
                                        <Col span={22}>
                                            <FormItem {...formItemLayout2} label='分数'>
                                            {getFieldDecorator('score',{initialValue:singleClassScore&&singleClassScore.score||0,rules:[{required:true,message:"请输入"}]})(
                                                <Input />
                                            )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={22}>
                                            <FormItem {...formItemLayout2} label='备注'>
                                            {getFieldDecorator('remark',{initialValue:singleClassScore&&singleClassScore.remark||''})(
                                                <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                                            )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={22}>
                                            <FormItem {...formItemLayout2} label='图片'>
                                                {singleClassScore&&singleClassScore.imgs&&singleClassScore.imgs.map(item=>
                                                    <img src={getImg(item)} onClick={this.showImg.bind(this, item)} style={{width:70,height:70,margin:'0px 10px 10px 0px'}}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>:<div>
                                {singleClassScore.secondTypes&&singleClassScore.secondTypes.map((item, index)=>{
                                    return  <div key={index}>
                                        <Row gutter={24}>
                                            <Col span={22}>
                                                <FormItem {...formItemLayout2} label={item.typeName}>
                                                    <Input value={item.score} onChange={this.changeTypeName.bind(this, index)}/>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                       
                                        <Row gutter={24}>
                                            <Col span={22}>
                                                <FormItem {...formItemLayout2} label='备注'>
                                                    <TextArea value={item.remark} onChange={this.changeRemark.bind(this, index)} autosize={{ minRows: 2, maxRows: 6 }} />
                                                </FormItem>
                                            </Col>
                                        </Row>

                                        <Row gutter={24}>
                                            <Col span={22}>
                                                <FormItem {...formItemLayout2} label='图片'>
                                                    {item.imgs&&item.imgs.map(item=>
                                                        <img src={getImg(item)} onClick={this.showImg.bind(this, item)} style={{width:70,height:70,margin:'0px 10px 10px 0px'}}/>
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </div>
                                })}
                                        </div>
                                 
                               }

                             
                            </Form>
                            {classScoreLog&&classScoreLog.dataList.length>0?<div className="step-box">
                                <p style={{margin:'10px 0px'}}>考评明细</p>
                                <Steps progressDot direction="vertical" >
                                    {steps}
                                </Steps>
                            </div>:null}
                            <ImgPreview
                                visible={this.state.previewVisible}  // 是否可见
                                onClose={this.closePreview} // 关闭事件
                                src={this.state.licenceUrl} // 图片url
                                picKey={"currentKey"} // 下载需要的key，根据自己需要决定
                                isAlwaysCenterZoom={false} // 是否总是中心缩放，默认false，若为true，每次缩放图片都先将图片重置回屏幕中间
                                isAlwaysShowRatioTips={false} // 是否总提示缩放倍数信息，默认false，只在点击按钮时提示，若为true，每次缩放图片都会提示
                            />
                        </Modal>
                    </div>
                  </TabPane>
                  <TabPane tab="考评设置" key="3"><SetClassScore /></TabPane>
              </Tabs>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    allTerms:state.user.allTerms,
    commonGradeData:state.user.commonGradeData,
    classNameData:state.user.classNameData,
    singleClassScore:state.moralEvaluation.singleClassScore,
    classScoreLog:state.moralEvaluation.classScoreLog,
    classScoreList:state.moralEvaluation,
  }
}
export default connect(mapStateToProps)(Form.create()(MoralIndex));
