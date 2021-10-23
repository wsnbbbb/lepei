import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs,Button,Input,Select,Form,Col,Row,Breadcrumb, DatePicker, Modal,message,Tooltip ,Steps, Radio ,Table} from 'antd';
import PageIndex from '../../components/page';
import moment from 'moment';
import "./style.less";

const FormItem = Form.Item;
const { RangePicker , MonthPicker} = DatePicker;
const Option = Select.Option;
const confirm = Modal.confirm;

class obtainFlagDetailWeek extends Component{
    constructor(props) {
        super(props);
        this.state = {
            classScoreDetails: '',
            tbodyData: [],
            groupData: [],
            weekData: [],
            showTitle: false,
            totalCount: 0,
            totalPage: 0,
            currentPage: 0,
            page: 1,
            prePage: 20,
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
        this.props.form.resetFields(["groupId","week"])
        this.getEvaluationGroupList(params)
        this.getWeekList(params)
    }

    onPageChange=(current,size)=>{
        this.props.form.validateFields((err, values) => {
            this.setState({page: current, prePage: size})
            const params={
              "page": current,
              "prePage": size,
              "semesterId": values.semesterId||'',
              "groupId": values.groupId||'',
              "week": values.week||'',
            }
            this.flagObtainDetail(params)
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
    // 重置
    reset = () => {
        this.props.form.resetFields(["semesterId", "groupId", "week"])
        this.setState({ groupData: [], weekData: []})
    }

    search = () => {
        this.props.form.validateFields((err, values) => {
            if(err) return
            let params = {
                semesterId: values.semesterId||'',
                groupId: values.groupId||'',
                week: values.week||'',
                page: 1,
                prePage: 20,
            }
            this.flagObtainDetail(params)
        })
       
    }
    

    flagObtainDetail=(params)=>{
        this.props.dispatch({
            type:'evaluate/flagDetailWeek',
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

    cancel=(id)=>{
        let me = this
        confirm({
            title: '提示',
            content: '你确定要取消颁发吗?',
            onOk() {
                me.props.dispatch({
                    type:'evaluate/obtainFlag',
                    payload:{"id": id},
                    callback:(res)=>{
                        if(res.code===200){
                            message.success("操作成功！")
                            setTimeout(() => {
                                me.flagObtainDetail()
                            }, 500);
                        }
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render(){
        const { tbodyData, classScoreDetails, groupData, weekData, showTitle} = this.state;
        const { getFieldDecorator } = this.props.form;
        const {allTerms } = this.props;
        let termChild=[]
        allTerms&&allTerms.length>0&&allTerms.map(item=>{
          termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
        })
        let groupChild=[]
        groupData&&groupData.length>0&&groupData.map(item=>{
            groupChild.push(<Option key={item.id}>{item.groupName}</Option>)
        })
        let weekChild=[]
        weekData&&weekData.length>0&&weekData.map(item=>{
            weekChild.push(<Option key={item.week}>{item.name}({item.startDate}~{item.endDate})</Option>)
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
                            <Select placeholder="请选择年级组" optionFilterProp="children">
                                {groupChild}
                            </Select>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem >
                        {getFieldDecorator("week",{rules: [{
                                required: true,
                                message:"请选择周次",
                            }]})(
                            <Select placeholder="请选择周次" optionFilterProp="children">
                                {weekChild}
                            </Select>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={6} offset={2}>
                        <Button onClick={this.reset.bind(this)}>重置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                    </Col>
                    </Row>
                </Form>
                    
                <table border="1" className="class-score-table" style={{margin:'10px 10px 50px 10px' }}>
                    {showTitle? <thead>
                                    <tr>
                                        <th>年级</th><th>班级</th><th>一级考评项</th><th>二级考评项</th>
                                        {
                                            classScoreDetails&&classScoreDetails.header.map((item,i)=>
                                            <th>
                                                {item.headerBottom.substring(5)}<br/>
                                                ({item.headerTop})
                                            </th>
                                        )
                                        }
                                        <th>总分</th><th>年级排名</th><th>流动红旗</th>                               
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
                                            {classScoreDetails&&classScoreDetails.header.map((item,i)=>{
                                                let score = ''
                                                l.td.map((e, eIndex)=>{
                                                    if(item.date==e.date){
                                                        score = e.score
                                                    }
                                                })
                                                return <td key={i}>{score?score:"-"}</td>
                                                }
                                            )}
                                            {hIndx==0&&lIndex === 0?<td rowSpan={j.col}>{j.totalScore}</td> :null}
                                            {hIndx==0&&lIndex === 0?<td rowSpan={j.col}>{j.rank}</td> :null}
                                            {hIndx==0&&lIndex === 0?<td rowSpan={j.col}>{j.isObtain==1?"是":"否"}</td> :null}
                                        </tr>
                                )
                                )
                            )
                        )
                        }
                    </tbody>
                </table>
                {showTitle?<PageIndex getPage={this.onPageChange.bind(this)} total={this.state.totalCount} totalPage={this.state.totalPage} currentPage={this.state.currentPage}/>:null}
            </div>
        );
    }
}
const mapStateToProps = (state) => {
  return {
    allTerms: state.user.allTerms,
  }
}
export default connect(mapStateToProps)(Form.create()(obtainFlagDetailWeek));
