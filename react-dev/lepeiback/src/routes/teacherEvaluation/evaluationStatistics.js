import React,{Component} from 'react';
import { connect } from 'dva';
import { DatePicker, Table, Card, Form, Col, Row, Input, Button } from 'antd';
import PageIndex from '../../components/page';
import { onlyDate, addKeys} from '../../utils/public';
import { routerRedux } from 'dva/router';
import {portUrl} from '../../utils/img'
import './style.less';

const FormItem = Form.Item;
const Search = Input.Search;
const { RangePicker } = DatePicker;

class EvaluationStatistics extends Component{
    constructor(props) {
        super(props);
        this.state = {
            page:1,
            prePage:20,
            templateList:[],
            exportUrl:''
           
        }
    }
    componentDidMount =()=>{
        const params={
            "kw":"",
            "page":this.state.page,
            "prePage":this.state.prePage,
            "attendTime":"",
        }
        this.getStatisticList(params)
        
        
    }
    // 获取评课统计列表
    getStatisticList=(params)=>{
        this.props.dispatch({
            type:'teacherEvaluation/getStatisticList',
            payload: params,
            callback: (res)=>{
                console.log("res",res);
                if(res.code===200){
                    addKeys(res.data.dataList)
                    this.setState({
                        templateList: res.data
                    })
                }
            }
        })
    }
    // 分页
    onPageChange=(current,size)=>{
        this.props.form.validateFields((err, values) => {
          this.setState({page:current,prePage:size})
          const rangeValue = values['time'];
          const params={
            "page":current,
            "prePage":size,
            "kw":values.kw||'',
            "attendTime":rangeValue&&rangeValue.length==2?(rangeValue[0].format('YYYY-MM-DD')+'~'+rangeValue[1].format('YYYY-MM-DD')):''
           
          }
          this.getStatisticList(params)
        })
    }
    // 查询
    search =() =>{
        this.props.form.validateFields((err, values) => {
            const rangeValue = values['time'];
            const params={
                "page":1,
                "prePage":this.state.prePage,
                "kw":values.kw||'',
                "attendTime":rangeValue&&rangeValue.length==2?(rangeValue[0].format('YYYY-MM-DD')+'~'+rangeValue[1].format('YYYY-MM-DD')):''
            }
            this.getStatisticList(params)
        })

    }
    // 导出
    export = ()=>{
        this.props.form.validateFields((err, values) => {
            let rangeValue = values['time'];
            let token = sessionStorage.getItem("token");
            let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
            let userId = sessionStorage.getItem("userId");
            let kw = values.kw||'';
            let attendTime = rangeValue&&rangeValue.length==2?(rangeValue[0].format('YYYY-MM-DD')+'~'+rangeValue[1].format('YYYY-MM-DD')):''
            let url = portUrl("/manager/course-valuation-records/export-record-list?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&kw="+kw+"&attendTime="+attendTime)
            this.setState({exportUrl:url})
        })
    }
    // 查看
    check =(id)=>{
        console.log("id",id);
        this.props.dispatch(routerRedux.push("/evaluation-statistics-detail?id="+id))
    }
 

    render(){
        const {templateList} = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span:3 },
            wrapperCol: { span: 21 }
        };
        const columns =[
            {
                title: '序号',
                dataIndex: 'id',
              },
              {
                title: '上课教师',
                dataIndex: 'teacherName',
              },
              {
                  title: '评课时间',
                  dataIndex: '',
                  render:(record)=>{
                    return <span>{onlyDate(record.teachingTime)}</span>
                  }
              },
              {
                title: '评课总分',
                dataIndex: 'totalScore',
              },
              {
                title: '评课平均分',
                dataIndex: 'avgScore',
              },
              {
                title: '评课人数',
                dataIndex: 'personNum',
              },
              {
              title: '操作',
              dataIndex: '',
              width:200,
              fixed:'right',
              render:(text, record) => (
              <span>
                  <a href="javascript:;"  onClick={this.check.bind(this,record.valuationId)}>查看</a>
              </span>
            )},

        ]
        
        
        return (
            <div className="evaluation-statistic">
                <Card title="评课统计">
                    <Form>
                        <Row gutter={24}>
                            <Col span={4}>
                                <FormItem label="">
                                    {getFieldDecorator('kw')(
                                        <Search placeholder="上课教师姓名"/>
                                    )}
                                </FormItem>
                            </Col> 
                                <Col span={6} >
                                <FormItem {...formItemLayout} label={'日期：'}>
                                    {getFieldDecorator("time",{})(
                                        <RangePicker />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} offset={0}>
                                <Button type='primary' onClick={this.search.bind(this)} className="marginTop">查询</Button>
                                <Button style={{marginLeft:"10px"}} type='primary'><a  href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                            </Col>
                            
                        </Row>
                    </Form>
                    <Table scroll={{ x: 800 }} columns={columns} dataSource={templateList.dataList} pagination={false}/>
                    <PageIndex getPage={this.onPageChange.bind(this)} total={templateList.totalCount} totalPage={templateList.totalPage} currentPage={templateList.currentPage}/>
                </Card>  
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
    }
  }
  
export default connect(mapStateToProps)(Form.create()(EvaluationStatistics));