import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs,Button,Input,Select,Form,Col,Row,Breadcrumb, DatePicker, Modal,message,Tooltip ,Steps, Radio ,Table} from 'antd';
import PageIndex from '../../components/page';
import moment from 'moment';
import { portUrl } from '../../utils/img'
import "./style.less";

const FormItem = Form.Item;
const { RangePicker , MonthPicker} = DatePicker;
const Option = Select.Option;
const confirm = Modal.confirm;

class addScoreTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            classScoreDetails: '',
            tbodyData: [],
            groupData: [],
            weekData: [],
            monthData: [],
            showTitle: false,
            totalCount: 0,
            totalPage: 0,
            currentPage: 0,
            page: 1,
            prePage: 20,
            exportUrl: '',
            gradeData: [],
            classData: [],
            appointData: []

        };
    }
    componentDidMount=()=>{
        this.props.dispatch({ //获取所有学期
            type:'user/getAllSemesters',
        })
    }
    semesterChange=(val)=>{
        if(!val) return
        let params = {
          semesterId: val
        }
        this.props.form.resetFields(["groupId","week", "gradeId", "classId", "weeks", "months", "date", "cycle", "typeId"])
        this.getEvaluationGroupList(params)
        this.getWeekList(params)
        this.getMonthList(params)

        this.setState({
            gradeData: [],
            classData: [],
            appointData: []
        })

    }

    groupChange=(val)=>{
        if(!val) return
        let params = {
            groupId: val
        }
        this.getGradeByGroupId(params)
        this.props.form.resetFields(["week", "gradeId", "classId", "typeId"])
        this.setState({
            gradeData: [],
            classData: [],
            appointData: []
        })

        if(!this.props.form.getFieldValue("cycle")) return
        let params1 = {
            groupId: val,
            cycleType: this.props.form.getFieldValue("cycle")
        }
        this.getApointGroup(params1)   
    }

    // 年级
    gradeChange = (val)=>{
        if(val){
            this.props.dispatch({
            type:'user/getClassName',
            payload:{"gradeId":val},
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        classData: res.data
                    })
                    this.props.form.resetFields(["week", "classId"])
                    this.setState({
                        appointData: []
                    })
                }
            }
            })
        }
    }

    cycleChange=(val)=>{
        if(!val||!this.props.form.getFieldValue("groupId")) return
        let params = {
            groupId: this.props.form.getFieldValue("groupId"),
            cycleType: val
        }
        this.props.form.resetFields(["typeId"])
        this.getApointGroup(params)        
    }

    getApointGroup=(params)=>{
        this.props.dispatch({
            type:'evaluate/getApointGroup',
            payload: params,
            callback:(res)=>{
            if(res.code===200){
                this.setState({
                    appointData: res.data
                })
            }
            }
        })
    }

    getGradeByGroupId=(params)=>{
        this.props.dispatch({
            type:'evaluate/getGradeByGroupId',
            payload: params,
            callback:(res)=>{
            if(res.code===200){
                this.setState({
                    gradeData: res.data
                })
            }
            }
        })
    }

    onPageChange=(current,size)=>{
        this.props.form.validateFields((err, values) => {
            this.setState({page: current, prePage: size})
            if(values.cycle==1){
                let params = {
                    semesterId: values.semesterId||'',
                    groupId: values.groupId||'',
                    gradeId: values.gradeId||'',
                    classId: values.classId||'',
                    typeId: values.typeId||'',
                    startDate: values.date&&values.date.length==2&&values.date[0].format('YYYY-MM-DD')||'',
                    endDate: values.date&&values.date.length==2&&values.date[1].format('YYYY-MM-DD')||'',
                    page: current,
                    prePage: size,
                }
                this.getDetail(params, 'getDailyDetail')
            }

            if(values.cycle==2){
                let params = {
                    semesterId: values.semesterId||'',
                    groupId: values.groupId||'',
                    gradeId: values.week||'',
                    classId: values.classId||'',
                    typeId: values.typeId||'',
                    weeks: values.weeks&&values.weeks.join(",")||'',
                    page: current,
                    prePage: size,
                }
                this.getWeekDetail(params, 'getWeekDetail')
            }

            if(values.cycle==3){
                let params = {
                    semesterId: values.semesterId||'',
                    groupId: values.groupId||'',
                    gradeId: values.week||'',
                    classId: values.classId||'',
                    typeId: values.typeId||'',
                    months: values.months&&values.months.join(",")||'',
                    page: current,
                    prePage: size,
                }
                this.getDetail(params, 'getMonthDetail')
            }
            
        })
    }

    getWeekList=(params)=>{
        this.props.dispatch({
            type:'evaluate/getWeekList',
            payload: params,
            callback:(res)=>{
            if(res.code===200){
                this.setState({
                    weekData: res.data
                })
            }
            }
        })
    }

    getEvaluationGroupList=(params)=>{
        this.props.dispatch({
            type:'evaluate/getEvaluationGroupList',
            payload: params,
            callback:(res)=>{
            if(res.code===200){
                this.setState({
                    groupData: res.data
                })
            }
            }
        })
    }
    
    getMonthList=(params)=>{
        this.props.dispatch({
            type:'evaluate/getMonthList',
            payload: params,
            callback:(res)=>{
            if(res.code===200){
                this.setState({
                    monthData: res.data
                })
            }
            }
        })
    }
    // 重置
    reset = () => {
        this.props.form.resetFields()
        this.setState({ 
            groupData: [], 
            weekData: [], 
            gradeData: [],
            classData: [],
            appointData: [],
            monthData: []
         })
    }

    search = () => {
        let me = this
        this.props.form.validateFields((err, values) => {
            if(err) return
            if(values.cycle==1){
                let params = {
                    semesterId: values.semesterId||'',
                    groupId: values.groupId||'',
                    gradeId: values.gradeId||'',
                    classId: values.classId||'',
                    typeId: values.typeId||'',
                    startDate: values.date&&values.date.length==2&&values.date[0].format('YYYY-MM-DD')||'',
                    endDate: values.date&&values.date.length==2&&values.date[1].format('YYYY-MM-DD')||'',
                    page: 1,
                    prePage: 20
                }
                me.getDetail(params, 'getDailyDetail')
            }

            if(values.cycle==2){
                let params = {
                    semesterId: values.semesterId||'',
                    groupId: values.groupId||'',
                    gradeId: values.week||'',
                    classId: values.classId||'',
                    typeId: values.typeId||'',
                    weeks: values.weeks&&values.weeks.join(",")||'',
                    page: 1,
                    prePage: 20
                }
                me.getDetail(params, 'getWeekDetail')
            }

            if(values.cycle==3){
                let params = {
                    semesterId: values.semesterId||'',
                    groupId: values.groupId||'',
                    gradeId: values.week||'',
                    classId: values.classId||'',
                    typeId: values.typeId||'',
                    months: values.months&&values.months.join(",")||'',
                    page: 1,
                    prePage: 20
                }
                me.getDetail(params, 'getMonthDetail')
            }
        })
       
    }

    getDetail=(params, url)=>{
        this.props.dispatch({
            type:`evaluate/${url}`,
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                   this.setState({
                        classScoreDetails: res.data,
                        thData: res.data.header,
                        currentPage: res.data.currentPage,
                        totalCount: res.data.totalCount,
                        totalPage: res.data.totalPage
                   })
                   let tbodyData = res.data.classData
                   tbodyData.forEach(grade => {
                        let gradeData = [];
                        let col1 = 0
                        let col=0
                        grade.classList.forEach(cls => {
                            col=0
                            cls.cates.map(i=>{
                                col += i.types.length
                                i.types.map(e=>{
                                    let arr = []
                                    cls.typeRecords.map(j=>{
                                        if(j.typeId==e.typeId){
                                            arr.push(j)
                                        }
                                    })
                                    e.td=arr
                                    cls.typeCalculate.map(k=>{
                                        if(k.typeId==e.typeId){
                                            e.typeReduceTotal = k.typeReduceTotal
                                            e.typeReduceAverage = k.typeReduceAverage
                                        }
                                    })
                                })
                            })
                            col1 += col
                            cls.col = col
                        })
                        grade.col = col1
                        gradeData.push(grade.classList)
                    })
                    this.setState({
                        tbodyData: tbodyData,
                        showTitle: true,
                    })
                    console.log({tbodyData})
                }
            }
        })
    }
    




    //导出
    export = (e) =>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let checkArr = []
        this.props.form.validateFields(['cycle'], (err, values) => {
            if(err) {
                e.preventDefault();
            }
            if(values.cycle == 1){
                checkArr = ['date']
            }else if(values.cycle == 2){
                checkArr = ['weeks']
            }else if(values.cycle == 3){
                checkArr = ['months']
            }
        })
        this.props.form.validateFields(['semesterId', 'groupId', 'cycle', ...checkArr], (err, values) => {
            if(err) {
                e.preventDefault();
            }
            if(values.cycle==1){
                let semesterId = values.semesterId||''
                let groupId = values.groupId||''
                let gradeId = values.gradeId||''
                let classId = values.classId||''
                let typeId = values.typeId||''
                let startDate = values.date&&values.date.length==2&&values.date[0].format('YYYY-MM-DD')||''
                let endDate = values.date&&values.date.length==2&&values.date[1].format('YYYY-MM-DD')||''

                let url=portUrl("/manager/class-evaluation-statistics/daily-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&semesterId="+semesterId
                +"&groupId="+groupId+"&gradeId="+gradeId+"&classId="+classId+"&typeId="+typeId+"&startDate="+startDate+"&endDate="+endDate+"&exportType=1")
                this.setState({exportUrl: url})
            }
    
            if(values.cycle==2){
                let semesterId = values.semesterId||''
                let groupId = values.groupId||''
                let gradeId = values.gradeId||''
                let classId = values.classId||''
                let typeId = values.typeId||''
                let weeks = values.weeks&&values.weeks.join(",")||''
                let url=portUrl("/manager/class-evaluation-statistics/week-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&semesterId="+semesterId
                +"&groupId="+groupId+"&gradeId="+gradeId+"&classId="+classId+"&typeId="+typeId+"&weeks="+weeks+"&exportType=1")
                this.setState({exportUrl: url})
            }
    
            if(values.cycle==3){
                let semesterId = values.semesterId||''
                let groupId = values.groupId||''
                let gradeId = values.gradeId||''
                let classId = values.classId||''
                let typeId = values.typeId||''
                let months = values.months&&values.months.join(",")||''
                let url=portUrl("/manager/class-evaluation-statistics/month-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&semesterId="+semesterId
                +"&groupId="+groupId+"&gradeId="+gradeId+"&classId="+classId+"&typeId="+typeId+"&months="+months+"&exportType=1")
                this.setState({exportUrl: url})
            }

        })
       
        
    }

    render(){
        const { tbodyData, classScoreDetails, groupData, gradeData, weekData, showTitle, monthData, classData, appointData} = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {allTerms } = this.props;
        let termChild=[]
        allTerms&&allTerms.length>0&&allTerms.map(item=>{
          termChild.push(<Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>)
        })
        let groupChild=[]
        groupData&&groupData.length>0&&groupData.map(item=>{
            groupChild.push(<Option key={item.id} value={item.id}>{item.groupName}</Option>)
        })
        let weekChild=[]
        weekData&&weekData.length>0&&weekData.map(item=>{
            weekChild.push(<Option key={item.week} value={item.week}>{item.name}({item.startDate}~{item.endDate})</Option>)
        })

        let monthChild=[]
        monthData&&monthData.length>0&&monthData.map(item=>{
            monthChild.push(<Option key={item.n} value={item.n}>{item.month}</Option>)
        })

        let gradeChild=[]
        gradeData&&gradeData.length>0&&gradeData.map(item=>{
            gradeChild.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
        })

        let classChild = []
        classData&&classData.length>0&&classData.map(item => {
          return classChild.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
        })

        let appointChild = []
        appointData&&appointData.length>0&&appointData.map(item => {
          return appointChild.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
        })

        
        return (
            <div className="content-main">
                <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                    <Col span={4}>
                        <FormItem label=''>
                            {getFieldDecorator('semesterId',{rules: [{
                                required: true,
                                message:"请选择学期",
                                whitespace: true,
                            }]})(
                            <Select placeholder="请选择学期" onChange={this.semesterChange}>
                                {termChild}
                            </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem >
                        {getFieldDecorator("groupId",{rules: [{
                                required: true,
                                message:"请选择年级组",
                                whitespace: true,
                            }]})(
                            <Select placeholder="请选择年级组" onChange={this.groupChange}>
                                {groupChild}
                            </Select>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem >
                        {getFieldDecorator("gradeId",{rules: [{
                                required: false,
                                message:"请选择年级",
                                whitespace: true,
                            }]})(
                            <Select placeholder="请选择年级" onChange={this.gradeChange}>
                                {gradeChild}
                            </Select>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem >
                        {getFieldDecorator("classId",{rules: [{
                                required: false,
                                message:"请选择班级",
                                whitespace: true,
                            }]})(
                            <Select placeholder="请选择班级">
                                {classChild}
                            </Select>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem >
                        {getFieldDecorator("cycle",{rules: [{
                                required: true,
                                message:"请选择考评周期",
                            }]})(
                            <Select placeholder="请选择考评周期" disabled={getFieldValue("groupId")?false: true} onChange={this.cycleChange} optionFilterProp="children">
                                <Option key={1} value={1}>日</Option>
                                <Option key={2} value={2}>周</Option>
                                <Option key={3} value={3}>月</Option>
                            </Select>
                        )}
                        </FormItem>
                    </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={4}>
                            <FormItem >
                                {getFieldDecorator("typeId",{rules: [{
                                        required: false,
                                        message:"请选择考评项",
                                        whitespace: true,
                                    }]})(
                                    <Select placeholder="请选择考评项" optionFilterProp="children">
                                        {appointChild}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {getFieldValue('cycle')==2?<Col span={8}>
                                                        <FormItem >
                                                            {getFieldDecorator("weeks",{rules: [{
                                                                    required: getFieldValue('cycle')==2,
                                                                    message:"请选择时间",
                                                                }]})(
                                                                <Select placeholder="请选择时间" mode="multiple" optionFilterProp="children">
                                                                    {weekChild}
                                                                </Select>
                                                            )}
                                                        </FormItem>
                                                    </Col>:null}

                        {getFieldValue('cycle')==3?<Col span={8}>
                                                        <FormItem >
                                                            {getFieldDecorator("months",{rules: [{
                                                                    required: getFieldValue('cycle')==3,
                                                                    message:"请选择时间",
                                                                }]})(
                                                                <Select placeholder="请选择时间" mode="multiple" optionFilterProp="children">
                                                                    {monthChild}
                                                                </Select>
                                                            )}
                                                        </FormItem>
                                                    </Col>:null}
                        {getFieldValue('cycle')==1?<Col span={8}>
                            <FormItem >
                                {getFieldDecorator("date", {rules: [{
                                    required: getFieldValue('cycle')==1,
                                    message:"请选择日期"
                                }]})(
                                <RangePicker style={{ width: 380 }}
                                    showTime={{ format: 'YYY-MM-DD' }}
                                    format="YYYY-MM-DD"
                                    placeholder={['开始日期', '结束日期']}/>
                                )}
                            </FormItem>
                        </Col>:null}
                        <Col span={6} offset={getFieldValue('cycle')?3:11}>
                            <Button type="primary">
                                <a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
                            </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={this.reset.bind(this)}>重置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                        </Col>
                    </Row>
                </Form>
                <div className="table-container">
                    <table border="1" className="class-score-table" style={{margin:'10px 10px 50px 10px' }}>
                        {showTitle? <thead>
                                        <tr>
                                            <th>年级</th><th>班级</th><th>一级考评项</th><th>二级考评项</th>
                                            {
                                                classScoreDetails&&classScoreDetails.header.map((item,i)=>
                                                <th>
                                                    <p>{item.headerBottom}</p>
                                                    ({item.headerTop})
                                                </th>
                                            )
                                            }
                                            <th>项合计</th><th>项平均</th><th>总分</th><th>总平均分</th>                             
                                        </tr>
                                    </thead>:null}
                        <tbody>
                            {tbodyData.length!=0&&tbodyData.map((i, idx) =>
                                i.classList.map((j, index)=>
                                    j.cates.map((h, hIndx)=>
                                        h.types.map((l, lIndex)=>
                                            <tr key={lIndex}>
                                                {index === 0&&hIndx === 0&&lIndex === 0? <td rowSpan={i.col}>{i.gradeName}</td> : null}
                                                {hIndx === 0&&lIndex === 0?<td rowSpan={j.col}>{j.className}</td> :null}
                                                {lIndex==0?<td rowSpan={h.types.length}>{h.cateName}</td> :null}
                                                <td>{l.typeName}</td>
                                                {classScoreDetails&&classScoreDetails.header.map((item, i)=>{
                                                    let score = ''
                                                    l.td.map((e, eIndex)=>{
                                                        if(item.date==e.date){
                                                            score = e.reduceScore
                                                        }
                                                    })
                                                    return <td key={i}>{score?score:"-"}</td>
                                                    }
                                                )}
                                                <td>{l.typeReduceTotal?(l.typeReduceTotal):"-"}</td>
                                                <td>{l.typeReduceAverage?l.typeReduceAverage:'-'}</td>
                                                {lIndex==0&& hIndx === 0?<td rowSpan={j.col}>{j.totalReduce}</td> :null}
                                                {lIndex==0&& hIndx === 0?<td rowSpan={j.col}>{j.reduceAverage}</td> :null}
                                            </tr>
                                    )
                                    )
                                )
                            )
                            }
                        </tbody>
                    </table>
                </div>
                {showTitle?<PageIndex getPage={this.onPageChange.bind(this)} total={this.state.totalCount} totalPage={this.state.totalPage} currentPage={this.state.currentPage}/>:null}
            </div>
        );
    }
}
const mapStateToProps = (state) => {
  return {
    allTerms: state.user.allTerms,
    gradeList:state.user.commonGradeData
  }
}
export default connect(mapStateToProps)(Form.create()(addScoreTable));
